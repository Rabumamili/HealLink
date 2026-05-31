// app/(routes)/patient/appointments/page.tsx - Complete fixed version with providerSpecialty

'use client';

import { useState, useCallback, useMemo, useEffect } from 'react';
import Link from 'next/link';
import {
  Bell,
  Calendar as CalendarIcon,
  ClipboardCheck,
  CalendarPlus,
  Wallet,
  RefreshCw,
  Clock3,
  Sparkles,
  Star,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { TabsFilter, TabOption } from '@/components/common/TabsFilter';
import { EmptyState } from '@/components/common/EmptyState';
import { LoadingState } from '@/components/common/LoadingState';
import { AppointmentHeader } from '@/components/appointments/AppointmentHeader';

import {
  AppointmentCard,
  AppointmentCardData,
} from '@/components/appointments/AppointmentCards';
import { AppointmentDetailsDialog } from '@/components/appointments/AppointmentDetailsDialog';
import { AppointmentFilters } from '@/components/appointments/AppointmentFilters';
import { AppointmentStatsCards } from '@/components/appointments/AppointmentStatsCards';
import { RescheduleDialog } from '@/components/appointments/RescheduleDialog';
import { WriteReviewDialog } from '@/components/review/WriteReviewDialog';

import { useAppointments } from '@/hooks/useAppointments';
import { useReview } from '@/hooks/useReview';
import { EnrichedAppointment } from '@/types/entities/appointment.types';

import { toast } from 'sonner';

const getCurrentPatientId = (): number => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('currentPatientId');
    if (stored) {
      const parsed = parseInt(stored, 10);
      if (!isNaN(parsed)) return parsed;
    }
  }
  return 201;
};

const normalize = (value?: string | null): string =>
  value?.toLowerCase().trim() || '';

// IMPORTANT: Card number is NOT included in patient view for security
const toCardData = (
  appointment: EnrichedAppointment,
  hasReviewed: boolean = false
): AppointmentCardData => ({
  id: appointment.id,
  patientId: appointment.patientId,
  patientName: appointment.patientName,
  serviceName: appointment.serviceName,
  serviceDescription: appointment.serviceDescription,
  serviceDuration: appointment.serviceDuration,
  type: appointment.serviceType,
  scheduledDateTime: appointment.scheduledDateTime,
  status: appointment.status,
  checkInTime: appointment.checkInTime,
  startTime: appointment.startTime,
  endTime: appointment.endTime,
  estimatedWaitMinutes: appointment.estimatedWaitMinutes,
  notes: appointment.notes,
  fee: appointment.fee,
  paymentStatus: appointment.paymentStatus,
  cardNumber: null,
  location: appointment.location,
  locationDetail: appointment.locationDetail,
  patientEmail: appointment.patientEmail,
  patientPhone: appointment.patientPhone,
  providerName: appointment.providerName,
  providerType: appointment.providerType,
  providerEmail: appointment.providerEmail,
  providerPhone: appointment.providerPhone,
  hasReviewed,
});

export default function PatientAppointmentsPage() {
  const [patientId, setPatientId] = useState<number>(201);
  const [selectedAppointment, setSelectedAppointment] = useState<AppointmentCardData | null>(null);
  const [viewOpen, setViewOpen] = useState<boolean>(false);
  const [rescheduleOpen, setRescheduleOpen] = useState<boolean>(false);
  const [reviewDialogOpen, setReviewDialogOpen] = useState<boolean>(false);
  const [selectedAppointmentForReview, setSelectedAppointmentForReview] = useState<EnrichedAppointment | null>(null);
  const [activeTab, setActiveTab] = useState<'today' | 'upcoming' | 'past'>('today');
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [reviewedAppointments, setReviewedAppointments] = useState<Set<number>>(new Set());

  const {
    appointments,
    isLoading,
    filters,
    setFilters,
    refreshData,
    cancelAppointment,
    updateTiming,
    fetchPatientAppointments,
  } = useAppointments();

  const {
    reviews,
    createReview,
    fetchReviewsByPatient,
    isLoading: reviewsLoading,
  } = useReview();

  useEffect(() => {
    const id = getCurrentPatientId();
    setPatientId(id);
    fetchPatientAppointments(id);
  }, [fetchPatientAppointments]);

  useEffect(() => {
    if (patientId) {
      fetchReviewsByPatient(patientId);
    }
  }, [patientId, fetchReviewsByPatient]);

  useEffect(() => {
    const reviewedIds = new Set(reviews.map((r: any) => r.appointment_id || r.appointmentId));
    setReviewedAppointments(reviewedIds);
  }, [reviews]);

  const patientAppointments = useMemo(() => {
    return appointments.filter((apt: EnrichedAppointment) => apt.patientId === patientId);
  }, [appointments, patientId]);

  const filteredAppointments = useMemo(() => {
    return patientAppointments.filter((apt: EnrichedAppointment) => {
      const matchesSearch =
        normalize(apt.providerName).includes(normalize(filters.searchTerm)) ||
        normalize(apt.serviceName).includes(normalize(filters.searchTerm)) ||
        normalize(apt.location).includes(normalize(filters.searchTerm));

      const matchesStatus =
        filters.status === 'all' ? true : apt.status === filters.status;

      return matchesSearch && matchesStatus;
    });
  }, [patientAppointments, filters]);

  const today = new Date().toLocaleDateString('en-CA');

  const todayAppointments = useMemo(() => {
    return filteredAppointments.filter((a: EnrichedAppointment) =>
      a.scheduledDateTime.startsWith(today)
    );
  }, [filteredAppointments, today]);

  const upcomingAppointments = useMemo(() => {
    return filteredAppointments.filter((a: EnrichedAppointment) =>
      a.status === 'Scheduled' ||
      a.status === 'Confirmed' ||
      a.status === 'Checked-in' ||
      a.status === 'In Progress'
    );
  }, [filteredAppointments]);

  const pastAppointments = useMemo(() => {
    return filteredAppointments.filter((a: EnrichedAppointment) =>
      a.status === 'Completed' ||
      a.status === 'Cancelled' ||
      a.status === 'No-show'
    );
  }, [filteredAppointments]);

  const currentAppointments = useMemo(() => {
    switch (activeTab) {
      case 'today':
        return todayAppointments;
      case 'upcoming':
        return upcomingAppointments;
      case 'past':
        return pastAppointments;
      default:
        return [];
    }
  }, [activeTab, todayAppointments, upcomingAppointments, pastAppointments]);

  const totalSpent = useMemo(() => {
    return patientAppointments
      .filter((a: EnrichedAppointment) => a.paymentStatus === 'SUCCESS')
      .reduce((sum: number, apt: EnrichedAppointment) => sum + (apt.fee || 0), 0);
  }, [patientAppointments]);

  const pendingPayments = useMemo(() => {
    return patientAppointments.filter((a: EnrichedAppointment) => a.paymentStatus === 'PENDING').length;
  }, [patientAppointments]);

  const statsCards = useMemo(
    () => [
      {
        title: 'Total',
        value: patientAppointments.length.toString(),
        icon: ClipboardCheck,
        description: 'Appointments',
      },
      {
        title: 'Today',
        value: todayAppointments.length.toString(),
        icon: CalendarIcon,
        description: "Today's visits",
      },
      {
        title: 'Upcoming',
        value: upcomingAppointments.length.toString(),
        icon: Clock3,
        description: 'Scheduled care',
      },
      {
        title: 'Spent',
        value: `ETB ${totalSpent.toLocaleString()}`,
        icon: Wallet,
        description: 'Healthcare payments',
      },
    ],
    [patientAppointments.length, todayAppointments.length, upcomingAppointments.length, totalSpent]
  );

  const tabs: TabOption[] = useMemo(
    () => [
      {
        id: 'today',
        label: 'Today',
        icon: <CalendarIcon className="h-4 w-4" />,
        count: todayAppointments.length,
      },
      {
        id: 'upcoming',
        label: 'Upcoming',
        icon: <Bell className="h-4 w-4" />,
        count: upcomingAppointments.length,
      },
      {
        id: 'past',
        label: 'Past',
        icon: <ClipboardCheck className="h-4 w-4" />,
        count: pastAppointments.length,
      },
    ],
    [todayAppointments.length, upcomingAppointments.length, pastAppointments.length]
  );

  const handleRefresh = useCallback(async (): Promise<void> => {
    try {
      setIsRefreshing(true);
      await refreshData();
      await fetchPatientAppointments(patientId);
      await fetchReviewsByPatient(patientId);
      toast.success('Appointments refreshed');
    } catch {
      toast.error('Failed to refresh');
    } finally {
      setIsRefreshing(false);
    }
  }, [refreshData, fetchPatientAppointments, fetchReviewsByPatient, patientId]);

  const handleView = useCallback((appointment: AppointmentCardData): void => {
    setSelectedAppointment(appointment);
    setViewOpen(true);
  }, []);

  const handleReschedule = useCallback((appointment: AppointmentCardData): void => {
    setSelectedAppointment(appointment);
    setRescheduleOpen(true);
  }, []);

  const handleCancel = useCallback(
    async (appointment: AppointmentCardData): Promise<void> => {
      try {
        await cancelAppointment(appointment.id);
        await fetchPatientAppointments(patientId);
        toast.success('Appointment cancelled successfully');
      } catch {
        toast.error('Failed to cancel appointment');
      }
    },
    [cancelAppointment, fetchPatientAppointments, patientId]
  );

  const handleRescheduleConfirm = useCallback(
    async (appointment: AppointmentCardData, date: string, time: string): Promise<void> => {
      try {
        const start = new Date(`${date}T${time}:00`);
        const end = new Date(start.getTime() + 30 * 60000);

        const startTime = start.toISOString();
        const endTime = end.toISOString();

        await updateTiming(appointment.id, startTime, endTime);
        toast.success('Appointment rescheduled successfully');
        await fetchPatientAppointments(patientId);
      } catch {
        toast.error('Failed to reschedule appointment');
      }
    },
    [updateTiming, fetchPatientAppointments, patientId]
  );

  const handleWriteReview = useCallback((appointment: EnrichedAppointment): void => {
    setSelectedAppointmentForReview(appointment);
    setReviewDialogOpen(true);
  }, []);

  const handleSubmitReview = useCallback(
    async (rating: number, comment: string): Promise<void> => {
      if (!selectedAppointmentForReview) return;

      const reviewData = {
        providerId: selectedAppointmentForReview.providerId,
        providerType: selectedAppointmentForReview.providerType || 'clinic',
        rating,
        comment,
      };

      try {
        const success = await createReview(reviewData as any);
        
        if (success) {
          toast.success('Thank you for your review!');
          await fetchReviewsByPatient(patientId);
          setReviewDialogOpen(false);
          setSelectedAppointmentForReview(null);
        } else {
          toast.error('Failed to submit review');
        }
      } catch (error) {
        console.error('Review submission error:', error);
        toast.error('Failed to submit review');
      }
    },
    [createReview, fetchReviewsByPatient, patientId, selectedAppointmentForReview]
  );

  const canReview = useCallback((appointment: EnrichedAppointment): boolean => {
    return appointment.status === 'Completed' && !reviewedAppointments.has(appointment.id);
  }, [reviewedAppointments]);

  if (isLoading && appointments.length === 0) {
    return <LoadingState message="Loading your appointments..." />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white pb-20">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        <AppointmentHeader
          title="My Appointments"
          description="View and manage all your upcoming and past medical appointments. Track your healthcare journey, view service details, and stay on top of your schedule."
          icon={<CalendarIcon className="h-5 w-5" />}
          variant="patient"
          actions={
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="rounded-xl border-white/30 bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm"
              >
                <RefreshCw
                  className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`}
                />
                Refresh
              </Button>

              <Link href="/patient/bookings">
                <Button className="bg-white text-[#008282] hover:bg-white/90 rounded-xl h-10 px-5 shadow-md">
                  <CalendarPlus className="h-4 w-4 mr-2" />
                  Book Appointment
                </Button>
              </Link>
            </div>
          }
        />

        {todayAppointments.length > 0 && activeTab === 'today' && (
          <div className="mb-6 rounded-xl bg-gradient-to-r from-[#008282]/5 to-[#00a0a0]/5 border border-[#008282]/10 p-4">
            <div className="flex items-start gap-3">
              <Sparkles className="h-5 w-5 text-[#008282] mt-0.5" />
              <div>
                <h3 className="font-semibold text-[#008282]">Today's Schedule</h3>
                <p className="text-sm text-slate-600 mt-1">
                  You have {todayAppointments.length} appointment{todayAppointments.length !== 1 ? 's' : ''} scheduled for today.
                </p>
              </div>
            </div>
          </div>
        )}

        {pendingPayments > 0 && (
          <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 px-5 py-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h3 className="font-semibold text-amber-900">Pending Payments</h3>
                <p className="text-sm text-amber-700 mt-1">
                  You have {pendingPayments} appointment(s) waiting for payment confirmation.
                </p>
              </div>

              <Link href="/patient/payments">
                <Button size="sm" className="bg-amber-600 hover:bg-amber-700 rounded-xl">
                  Complete Payment
                </Button>
              </Link>
            </div>
          </div>
        )}

        <AppointmentStatsCards stats={statsCards} variant="patient" />

        <AppointmentFilters
          searchTerm={filters.searchTerm || ''}
          onSearchChange={(value: string) => setFilters({ searchTerm: value })}
          statusFilter={filters.status || 'all'}
          onStatusChange={(value: string) => setFilters({ status: value as any })}
          placeholder="Search provider, service or location..."
        />

        <TabsFilter
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={(tab) => setActiveTab(tab as 'today' | 'upcoming' | 'past')}
        />

        <div className="space-y-4 mt-6">
          {currentAppointments.length > 0 ? (
            currentAppointments.map((appointment: EnrichedAppointment) => (
              <AppointmentCard
                key={appointment.id}
                appointment={toCardData(appointment, reviewedAppointments.has(appointment.id))}
                variant="patient"
                isPast={activeTab === 'past'}
                onView={handleView}
                onReschedule={
                  appointment.status !== 'Completed' && appointment.status !== 'Cancelled'
                    ? handleReschedule
                    : undefined
                }
                onCancel={
                  appointment.status !== 'Completed' && appointment.status !== 'Cancelled'
                    ? handleCancel
                    : undefined
                }
                onReview={canReview(appointment) ? () => handleWriteReview(appointment) : undefined}
              />
            ))
          ) : (
            <EmptyState
              variant="appointment"
              message={`No ${activeTab} appointments`}
              submessage={
                activeTab === 'today' 
                  ? "You don't have any appointments scheduled for today. Book a new appointment or check back later."
                  : activeTab === 'upcoming'
                  ? "No upcoming appointments found. Book your next healthcare visit today!"
                  : "Your completed and cancelled appointments will appear here once you have them."
              }
              actionLabel="Book Appointment"
              actionHref="/patient/bookings"
            />
          )}
        </div>
      </div>

      <AppointmentDetailsDialog
        open={viewOpen}
        onOpenChange={setViewOpen}
        appointment={selectedAppointment}
        variant="patient"
        onReschedule={handleReschedule}
        onReview={selectedAppointment && selectedAppointment.status === 'Completed' && !reviewedAppointments.has(selectedAppointment.id) 
          ? () => {
              const fullAppointment = patientAppointments.find(a => a.id === selectedAppointment.id);
              if (fullAppointment) handleWriteReview(fullAppointment);
              setViewOpen(false);
            }
          : undefined
        }
      />

      <RescheduleDialog
        open={rescheduleOpen}
        onOpenChange={setRescheduleOpen}
        appointment={selectedAppointment}
        onConfirm={handleRescheduleConfirm}
      />

      <WriteReviewDialog
        open={reviewDialogOpen}
        onOpenChange={setReviewDialogOpen}
        providerName={selectedAppointmentForReview?.providerName || ''}
        serviceName={selectedAppointmentForReview?.serviceName}
        onSubmit={handleSubmitReview}
      />
    </div>
  );
}