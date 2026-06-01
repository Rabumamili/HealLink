// app/(routes)/diagnostic/appointments/page.tsx
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
  FlaskConical,
  CalendarPlus,
  Sparkles,
} from 'lucide-react';
import { useAppointments } from '@/hooks/useAppointments';
import { AppointmentStatsCards } from '@/components/appointments/AppointmentStatsCards';
import { AppointmentFilters } from '@/components/appointments/AppointmentFilters';
import { AppointmentCard, AppointmentCardData } from '@/components/appointments/AppointmentCards';
import { AppointmentDetailsDialog } from '@/components/appointments/AppointmentDetailsDialog';
import { RescheduleDialog } from '@/components/appointments/RescheduleDialog';
import { AppointmentHeader } from '@/components/appointments/AppointmentHeader';
import { TabsFilter, TabOption } from '@/components/common/TabsFilter';
import { EmptyState } from '@/components/common/EmptyState';
import { LoadingState } from '@/components/common/LoadingState';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { EnrichedAppointment } from '@/types/entities/appointment.types';
import Link from 'next/link';

// Card number IS included for diagnostic center view
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
  cardNumber: appointment.cardNumber,
  location: appointment.location,
  locationDetail: appointment.locationDetail,
  patientEmail: appointment.patientEmail,
  patientPhone: appointment.patientPhone,
  providerName: appointment.providerName,
  providerType: appointment.providerType,
  providerEmail: appointment.providerEmail,
  providerPhone: appointment.providerPhone,
});

const getCurrentDiagnosticCenterId = (): number => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('currentDiagnosticCenterId');
    if (stored) {
      const parsed = parseInt(stored, 10);
      if (!isNaN(parsed)) return parsed;
    }
  }
  return 1;
};

export default function DiagnosticAppointmentsPage() {
  const router = useRouter();
  const [diagnosticId, setDiagnosticId] = useState<number>(1);
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
    const id = getCurrentDiagnosticCenterId();
    setDiagnosticId(id);
    fetchProviderAppointments(id);
  }, [fetchProviderAppointments]);

  const diagnosticAppointments = useMemo(() => {
    return appointments.filter((apt: EnrichedAppointment) =>
      apt.providerId === diagnosticId && apt.serviceType === 'DiagnosticTests'
    );
  }, [appointments, diagnosticId]);

  const filteredAppointments = useMemo(() => {
    return diagnosticAppointments.filter((apt: EnrichedAppointment) => {
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
  }, [diagnosticAppointments, filters]);

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
      await fetchProviderAppointments(diagnosticId);
      toast.success("Test appointment data refreshed");
    } catch (error) {
      console.error("Error refreshing data:", error);
      toast.error("Failed to refresh data");
    } finally {
      setIsRefreshing(false);
    }
  }, [refreshData, fetchProviderAppointments, diagnosticId]);

  const statsCards = useMemo(() => {
    if (!stats) return [];
    return [
      { title: "Total Tests", value: diagnosticAppointments.length.toString(), icon: FlaskConical, description: "All test appointments" },
      { title: "Today's Tests", value: todayAppointments.length.toString(), icon: CalendarIcon, description: "Scheduled today" },
      { title: "Completed", value: pastAppointments.filter(a => a.status === 'Completed').length.toString(), icon: CheckCircle, description: "Completed tests" },
      { title: "Revenue", value: `ETB ${stats.revenue?.toLocaleString() || 0}`, icon: DollarSign, description: "Total earned" },
      { title: "Cards Issued", value: stats.cardsIssued?.toString() || "0", icon: ClipboardCheck, description: "Cards generated" },
      { title: "Cards Utilized", value: stats.cardsUtilized?.toString() || "0", icon: Users, description: "Cards used for check-in" },
    ];
  }, [stats, diagnosticAppointments.length, todayAppointments.length, pastAppointments]);

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

  const handleStartTest = useCallback(async (appointment: AppointmentCardData) => {
    try {
      await updateStatus(appointment.id, "In Progress");
      await fetchProviderAppointments(diagnosticId);
      toast.success("Test started");
    } catch (error) {
      console.error("Error starting test:", error);
      toast.error("Failed to start test");
    }
  }, [updateStatus, fetchProviderAppointments, diagnosticId]);

  const handleCompleteTest = useCallback(async (appointment: AppointmentCardData) => {
    try {
      await updateStatus(appointment.id, "Completed");
      await fetchProviderAppointments(diagnosticId);
      toast.success("Test completed successfully");
    } catch (error) {
      console.error("Error completing test:", error);
      toast.error("Failed to complete test");
    }
  }, [updateStatus, fetchProviderAppointments, diagnosticId]);

  const handleConfirmReschedule = useCallback(async (
    appointment: AppointmentCardData,
    date: string,
    time: string
  ) => {
    try {
      const startDateTime = new Date(`${date}T${time}:00`);
      const endDateTime = new Date(startDateTime.getTime() + 60 * 60000);
      await updateTiming(appointment.id, startDateTime.toISOString(), endDateTime.toISOString());
      await fetchProviderAppointments(diagnosticId);
      toast.success("Appointment rescheduled successfully");
    } catch (error) {
      console.error("Error rescheduling:", error);
      toast.error("Failed to reschedule appointment");
    }
  }, [updateTiming, fetchProviderAppointments, diagnosticId]);

  const handleConfirmAppointment = useCallback(async (appointment: AppointmentCardData) => {
    try {
      await updateStatus(appointment.id, "Confirmed");
      await fetchProviderAppointments(diagnosticId);
      toast.success(`Test appointment confirmed! ${appointment.cardNumber ? `Card: ${appointment.cardNumber}` : ''}`);
    } catch (error) {
      console.error("Error confirming appointment:", error);
      toast.error("Failed to confirm appointment");
    }
  }, [updateStatus, fetchProviderAppointments, diagnosticId]);

  const handleCheckIn = useCallback(async (appointment: AppointmentCardData) => {
    router.push(`/diagnostic/checkin?appointmentId=${appointment.id}&cardNumber=${appointment.cardNumber}`);
  }, [router]);

  const handleCancel = useCallback(async (appointment: AppointmentCardData) => {
    try {
      await updateStatus(appointment.id, "Cancelled");
      await fetchProviderAppointments(diagnosticId);
      toast.success("Test appointment cancelled successfully");
    } catch (error) {
      console.error("Error cancelling:", error);
      toast.error("Failed to cancel appointment");
    }
  }, [updateStatus, fetchProviderAppointments, diagnosticId]);

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

  if (isLoading && diagnosticAppointments.length === 0) {
    return <LoadingState message="Loading test appointments..." />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white pb-20">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        {/* Modern Header with consistent #008282 color */}
        <AppointmentHeader
          title="Diagnostic Appointments"
          description="Manage all patient test appointments, verify payments, handle check-ins, and track diagnostic test progress. View detailed test information for each appointment."
          icon={<FlaskConical className="h-5 w-5" />}
          variant="diagnostic"
          actions={
            <div className="flex items-center gap-3">
              <Button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="bg-[#008282] hover:bg-[#00a0a0] text-white rounded-xl px-5 py-2.5 shadow-md"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                {isRefreshing ? 'Refreshing...' : 'Refresh'}
              </Button>
              <Link href="/diagnostic/appointments/new">
                <Button variant="outline" className="rounded-xl border-[#008282] text-[#008282] hover:bg-[#008282]/10">
                  <CalendarPlus className="h-4 w-4 mr-2" />
                  Schedule Test
                </Button>
              </Link>
            </div>
          }
        />

        {/* Today's Overview Section */}
        {todayAppointments.length > 0 && !isPastTab && activeTab === 'today' && (
          <div className="mb-6 rounded-xl bg-gradient-to-r from-[#008282]/5 to-[#00a0a0]/5 border border-[#008282]/10 p-4">
            <div className="flex items-start gap-3">
              <Sparkles className="h-5 w-5 text-[#008282] mt-0.5" />
              <div>
                <h3 className="font-semibold text-[#008282]">Today's Test Schedule</h3>
                <p className="text-sm text-slate-600 mt-1">
                  You have {todayAppointments.length} test{todayAppointments.length !== 1 ? 's' : ''} scheduled today.
                  {todayAppointments.filter(a => a.status === 'Checked-in').length > 0 && 
                    ` ${todayAppointments.filter(a => a.status === 'Checked-in').length} patient(s) have checked in and are waiting.`}
                </p>
              </div>
            </div>
          </div>
        )}

        {statsCards.length > 0 && (
          <AppointmentStatsCards stats={statsCards} variant="diagnostic" />
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

        <div className="space-y-4 mt-6">
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
                  variant="diagnostic"
                  isPast={isPastTab}
                  showCheckin={showCheckin}
                  showConfirm={showConfirm}
                  onView={handleView}
                  onReschedule={showReschedule ? handleReschedule : undefined}
                  onCancel={showCancel ? handleCancel : undefined}
                  onStart={showStart ? handleStartTest : undefined}
                  onComplete={showComplete ? handleCompleteTest : undefined}
                  onConfirm={showConfirm ? handleConfirmAppointment : undefined}
                  onCheckIn={showCheckin ? handleCheckIn : undefined}
                />
              );
            })
          ) : (
            <EmptyState
              variant="appointment"
              message={
                activeTab === "today" ? "No tests today" :
                  activeTab === "upcoming" ? "No upcoming tests" :
                    "No past tests"
              }
              submessage={
                activeTab === "today" ? "No patient tests scheduled for today" :
                  activeTab === "upcoming" ? "No future tests scheduled" :
                    "Completed and cancelled tests will appear here"
              }
            />
          )}
        </div>
      </div>

      <AppointmentDetailsDialog
        open={isViewDialogOpen}
        onOpenChange={setIsViewDialogOpen}
        appointment={selectedAppointment}
        onStart={handleStartTest}
        onComplete={handleCompleteTest}
        onReschedule={handleReschedule}
        variant="diagnostic"
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