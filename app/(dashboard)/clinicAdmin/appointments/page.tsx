// app/(routes)/clinic/appointments/page.tsx
'use client';

import { useState, useCallback, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Bell,
  Calendar as CalendarIcon,
  ClipboardCheck,
  RefreshCw,
  Users,
  DollarSign,
  CheckCircle,
  Building2,
  CalendarPlus,
} from 'lucide-react';
import { useAppointments } from '@/hooks/useAppointments';
import { AppointmentStatsCards } from '@/components/appointments/AppointmentStatsCards';
import { AppointmentFilters } from '@/components/appointments/AppointmentFilters';
import { AppointmentCard, AppointmentCardData } from '@/components/appointments/AppointmentCards';
import { AppointmentDetailsDialog } from '@/components/appointments/AppointmentDetailsDialog';
import { RescheduleDialog } from '@/components/appointments/RescheduleDialog';
import { TabsFilter, TabOption } from '@/components/common/TabsFilter';
import { EmptyState } from '@/components/common/EmptyState';
import { LoadingState } from '@/components/common/LoadingState';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { EnrichedAppointment } from '@/types/entities/appointment.types';
import Link from 'next/link';

// Card number IS included for clinic view (for check-in purposes)
const toAppointmentCardData = (appointment: EnrichedAppointment): AppointmentCardData => ({
  id: appointment.id,
  patientName: appointment.patientName,
  patientId: appointment.patientId,
  serviceName: appointment.serviceName || "",
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
  cardNumber: appointment.cardNumber, // Included for clinic staff
  location: appointment.location,
  locationDetail: appointment.locationDetail,
  patientEmail: appointment.patientEmail,
  patientPhone: appointment.patientPhone,
  providerName: appointment.providerName,
  providerType: appointment.providerType,
  providerEmail: appointment.providerEmail,
  providerPhone: appointment.providerPhone,
});

const getCurrentClinicId = (): number => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('currentClinicId');
    if (stored) {
      const parsed = parseInt(stored, 10);
      if (!isNaN(parsed)) return parsed;
    }
  }
  return 1;
};

export default function ClinicAppointmentsPage() {
  const router = useRouter();
  const [clinicId, setClinicId] = useState<number>(1);
  const [selectedAppointment, setSelectedAppointment] = useState<AppointmentCardData | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isRescheduleDialogOpen, setIsRescheduleDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"today" | "upcoming" | "past">("today");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const {
    appointments,
    stats,
    isLoading,
    filters,
    setFilters,
    updateStatus,
    updateTiming,
    refreshData,
    fetchProviderAppointments,
  } = useAppointments();

  useEffect(() => {
    const id = getCurrentClinicId();
    setClinicId(id);
    fetchProviderAppointments(id);
  }, [fetchProviderAppointments]);

  const clinicAppointments = useMemo(() => {
    return appointments.filter((apt: EnrichedAppointment) => apt.providerId === clinicId);
  }, [appointments, clinicId]);

  const filteredAppointments = useMemo(() => {
    return clinicAppointments.filter((apt: EnrichedAppointment) => {
      const matchesSearch =
        !filters.searchTerm ||
        apt.patientName?.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        apt.cardNumber?.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        apt.patientId?.toString().includes(filters.searchTerm);

      const matchesStatus =
        !filters.status ||
        filters.status === 'all' ||
        apt.status === filters.status;

      return matchesSearch && matchesStatus;
    });
  }, [clinicAppointments, filters]);

  const today = new Date().toISOString().split('T')[0];

  const todayAppointments = useMemo(() => {
    return filteredAppointments.filter((apt: EnrichedAppointment) =>
      apt.scheduledDateTime.startsWith(today)
    );
  }, [filteredAppointments, today]);

  const upcomingAppointments = useMemo(() => {
    return filteredAppointments.filter((apt: EnrichedAppointment) =>
      apt.scheduledDateTime > today &&
      apt.status !== 'Completed' &&
      apt.status !== 'Cancelled' &&
      apt.status !== 'No-show'
    );
  }, [filteredAppointments, today]);

  const pastAppointments = useMemo(() => {
    return filteredAppointments.filter((apt: EnrichedAppointment) =>
      apt.status === 'Completed' ||
      apt.status === 'Cancelled' ||
      apt.status === 'No-show' ||
      (apt.scheduledDateTime < today && apt.status !== 'Scheduled' && apt.status !== 'Confirmed')
    );
  }, [filteredAppointments, today]);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await refreshData();
      await fetchProviderAppointments(clinicId);
      toast.success("Appointment data refreshed");
    } catch (error) {
      console.error("Error refreshing data:", error);
      toast.error("Failed to refresh data");
    } finally {
      setIsRefreshing(false);
    }
  }, [refreshData, fetchProviderAppointments, clinicId]);

  const statsCards = useMemo(() => {
    if (!stats) return [];
    return [
      { title: "Total Appointments", value: clinicAppointments.length.toString(), icon: Users, description: "All appointments" },
      { title: "Today's Appointments", value: todayAppointments.length.toString(), icon: CalendarIcon, description: "Scheduled today" },
      { title: "Completed", value: pastAppointments.filter(a => a.status === 'Completed').length.toString(), icon: CheckCircle, description: "Finished appointments" },
      { title: "Revenue", value: `ETB ${stats.revenue?.toLocaleString() || 0}`, icon: DollarSign, description: "Total earned" },
      { title: "Cards Issued", value: stats.cardsIssued?.toString() || "0", icon: ClipboardCheck, description: "Cards generated" },
      { title: "Cards Utilized", value: stats.cardsUtilized?.toString() || "0", icon: Users, description: "Cards used for check-in" },
    ];
  }, [stats, clinicAppointments.length, todayAppointments.length, pastAppointments]);

  const tabs: TabOption[] = useMemo(() => [
    { id: "today", label: "Today", icon: <Bell className="h-4 w-4" />, count: todayAppointments.length },
    { id: "upcoming", label: "Upcoming", icon: <CalendarIcon className="h-4 w-4" />, count: upcomingAppointments.length },
    { id: "past", label: "Past", icon: <ClipboardCheck className="h-4 w-4" />, count: pastAppointments.length },
  ], [todayAppointments.length, upcomingAppointments.length, pastAppointments.length]);

  const handleView = useCallback((appointment: AppointmentCardData) => {
    setSelectedAppointment(appointment);
    setIsViewDialogOpen(true);
  }, []);

  const handleReschedule = useCallback((appointment: AppointmentCardData) => {
    setSelectedAppointment(appointment);
    setIsRescheduleDialogOpen(true);
  }, []);

  const handleStartConsultation = useCallback(async (appointment: AppointmentCardData) => {
    try {
      await updateStatus(appointment.id, "In Progress");
      await fetchProviderAppointments(clinicId);
      toast.success("Consultation started");
    } catch (error) {
      console.error("Error starting consultation:", error);
      toast.error("Failed to start consultation");
    }
  }, [updateStatus, fetchProviderAppointments, clinicId]);

  const handleCompleteConsultation = useCallback(async (appointment: AppointmentCardData) => {
    try {
      await updateStatus(appointment.id, "Completed");
      await fetchProviderAppointments(clinicId);
      toast.success("Consultation completed successfully");
    } catch (error) {
      console.error("Error completing consultation:", error);
      toast.error("Failed to complete consultation");
    }
  }, [updateStatus, fetchProviderAppointments, clinicId]);

  const handleConfirmReschedule = useCallback(async (
    appointment: AppointmentCardData,
    date: string,
    time: string
  ) => {
    try {
      const startDateTime = new Date(`${date}T${time}:00`);
      const endDateTime = new Date(startDateTime.getTime() + 60 * 60000);
      await updateTiming(appointment.id, startDateTime.toISOString(), endDateTime.toISOString());
      await fetchProviderAppointments(clinicId);
      toast.success("Appointment rescheduled successfully");
    } catch (error) {
      console.error("Error rescheduling:", error);
      toast.error("Failed to reschedule appointment");
    }
  }, [updateTiming, fetchProviderAppointments, clinicId]);

  const handleConfirmAppointment = useCallback(async (appointment: AppointmentCardData) => {
    try {
      await updateStatus(appointment.id, "Confirmed");
      await fetchProviderAppointments(clinicId);
      toast.success(`Appointment confirmed! ${appointment.cardNumber ? `Card: ${appointment.cardNumber}` : ''}`);
    } catch (error) {
      console.error("Error confirming appointment:", error);
      toast.error("Failed to confirm appointment");
    }
  }, [updateStatus, fetchProviderAppointments, clinicId]);

  const handleCheckIn = useCallback(async (appointment: AppointmentCardData) => {
    router.push(`/clinic/checkin?appointmentId=${appointment.id}&cardNumber=${appointment.cardNumber}`);
  }, [router]);

  const handleCancel = useCallback(async (appointment: AppointmentCardData) => {
    try {
      await updateStatus(appointment.id, "Cancelled");
      await fetchProviderAppointments(clinicId);
      toast.success("Appointment cancelled successfully");
    } catch (error) {
      console.error("Error cancelling:", error);
      toast.error("Failed to cancel appointment");
    }
  }, [updateStatus, fetchProviderAppointments, clinicId]);

  const getCurrentAppointments = useCallback((): EnrichedAppointment[] => {
    switch (activeTab) {
      case "today": return todayAppointments;
      case "upcoming": return upcomingAppointments;
      case "past": return pastAppointments;
      default: return [];
    }
  }, [activeTab, todayAppointments, upcomingAppointments, pastAppointments]);

  const currentAppointments = getCurrentAppointments();
  const isPastTab = activeTab === "past";

  if (isLoading && clinicAppointments.length === 0) {
    return <LoadingState message="Loading clinic appointments..." />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white pb-20">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        {/* Enhanced Header */}
        <div className="mb-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="rounded-2xl bg-[#006767]/10 p-2.5">
                  <Building2 className="h-6 w-6 text-[#006767]" />
                </div>
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900">
                  Clinic Appointments
                </h1>
              </div>
              <p className="text-slate-500 text-base max-w-2xl ml-12">
                Manage all patient appointments, verify payments, handle check-ins, 
                and track consultation progress. View detailed service information for each appointment.
              </p>
            </div>
            <div className="flex items-center gap-3 ml-12 md:ml-0">
              <Button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="bg-[#006767] hover:bg-[#008282] text-white rounded-xl px-6 py-2.5 shadow-md"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                {isRefreshing ? 'Refreshing...' : 'Refresh'}
              </Button>
              <Link href="/clinic/appointments/new">
                <Button variant="outline" className="rounded-xl border-[#006767] text-[#006767] hover:bg-[#006767]/10">
                  <CalendarPlus className="h-4 w-4 mr-2" />
                  Create Appointment
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {statsCards.length > 0 && (
          <AppointmentStatsCards stats={statsCards} variant="clinic" />
        )}

        <AppointmentFilters
          searchTerm={filters.searchTerm || ""}
          onSearchChange={(value) => setFilters({ searchTerm: value })}
          statusFilter={filters.status || "all"}
          onStatusChange={(value) => setFilters({ status: value as any })}
          placeholder="Search by patient name, card number, or ID..."
        />

        <TabsFilter
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={(tab) => setActiveTab(tab as "today" | "upcoming" | "past")}
        />

        <div className="space-y-5 mt-6">
          {currentAppointments.length > 0 ? (
            currentAppointments.map((appointment) => {
              const appointmentCardData = toAppointmentCardData(appointment);

              const showConfirm = !isPastTab &&
                appointment.status === "Scheduled" &&
                appointment.paymentStatus === "SUCCESS";

              const showCheckin = !isPastTab && appointment.status === "Confirmed";
              const showStart = !isPastTab && appointment.status === "Checked-in";
              const showComplete = !isPastTab && appointment.status === "In Progress";
              const showReschedule = !isPastTab &&
                (appointment.status === "Scheduled" || appointment.status === "Confirmed");
              const showCancel = !isPastTab &&
                (appointment.status === "Scheduled" ||
                  appointment.status === "Confirmed" ||
                  appointment.status === "Checked-in");

              return (
                <AppointmentCard
                  key={appointment.id}
                  appointment={appointmentCardData}
                  variant="clinic"
                  isPast={isPastTab}
                  showCheckin={showCheckin}
                  showConfirm={showConfirm}
                  onView={handleView}
                  onReschedule={showReschedule ? handleReschedule : undefined}
                  onCancel={showCancel ? handleCancel : undefined}
                  onStart={showStart ? handleStartConsultation : undefined}
                  onComplete={showComplete ? handleCompleteConsultation : undefined}
                  onConfirm={showConfirm ? handleConfirmAppointment : undefined}
                  onCheckIn={showCheckin ? handleCheckIn : undefined}
                />
              );
            })
          ) : (
            <EmptyState
              variant="appointment"
              message={
                activeTab === "today" ? "No appointments today" :
                  activeTab === "upcoming" ? "No upcoming appointments" :
                    "No past appointments"
              }
              submessage={
                activeTab === "today" ? "No patient appointments scheduled for today" :
                  activeTab === "upcoming" ? "No future appointments scheduled" :
                    "Completed and cancelled appointments will appear here"
              }
            />
          )}
        </div>
      </div>

      <AppointmentDetailsDialog
        open={isViewDialogOpen}
        onOpenChange={setIsViewDialogOpen}
        appointment={selectedAppointment}
        onStart={handleStartConsultation}
        onComplete={handleCompleteConsultation}
        onReschedule={handleReschedule}
        variant="clinic"
      />

      <RescheduleDialog
        open={isRescheduleDialogOpen}
        onOpenChange={setIsRescheduleDialogOpen}
        appointment={selectedAppointment}
        onConfirm={handleConfirmReschedule}
      />
    </div>
  );
}