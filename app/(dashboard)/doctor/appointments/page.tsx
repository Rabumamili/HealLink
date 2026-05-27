// app/doctor/appointments/page.tsx
"use client"

import { useState, useCallback, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Bell, Calendar as CalendarIcon, ClipboardCheck, RefreshCw } from "lucide-react"
import { useAppointments } from "@/hooks/useAppointments"
import { AppointmentStatsCards } from "@/components/appointments/AppointmentStatsCards"
import { AppointmentFilters } from "@/components/appointments/AppointmentFilters"
import { AppointmentCard, AppointmentCardData } from "@/components/appointments/AppointmentCards"
import { AppointmentDetailsDialog } from "@/components/appointments/AppointmentDetailsDialog"
import { RescheduleDialog } from "@/components/appointments/RescheduleDialog"
import { PageHeader } from "@/components/common/PageHeader"
import { TabsFilter, TabOption } from "@/components/common/TabsFilter"
import { EmptyState } from "@/components/common/EmptyState"
import { LoadingState } from "@/components/common/LoadingState"
import { Button } from "@/components/ui/button"
import { Calendar, DollarSign, Users, CheckCircle } from "lucide-react"
import { toast } from "sonner"
import { EnrichedAppointment } from "@/types/entities/appointment.types"

const toAppointmentCardData = (appointment: EnrichedAppointment): AppointmentCardData => {
  return {
    id: appointment.id,
    patientName: appointment.patientName,
    patientId: appointment.patientId,
    serviceName: appointment.serviceName || "",
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
  }
}

export default function DoctorAppointmentsPage() {
  const router = useRouter()
  const [selectedAppointment, setSelectedAppointment] = useState<AppointmentCardData | null>(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isRescheduleDialogOpen, setIsRescheduleDialogOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<"today" | "upcoming" | "past">("today")
  const [isRefreshing, setIsRefreshing] = useState(false)

  const {
    todayAppointments,
    upcomingAppointments,
    pastAppointments,
    stats,
    isLoading,
    filters,
    setFilters,
    updateStatus,
    updateTiming,
    refreshData,
  } = useAppointments()

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true)
    try {
      await refreshData()
      toast.success("Appointment data refreshed")
    } catch (error) {
      console.error("Error refreshing data:", error)
      toast.error("Failed to refresh data")
    } finally {
      setIsRefreshing(false)
    }
  }, [refreshData])

  // Filter for consultation-type appointments (doctor appointments)
  const doctorToday = todayAppointments.filter(apt => 
    apt.serviceType === "Consultation"
  )
  const doctorUpcoming = upcomingAppointments.filter(apt => 
    apt.serviceType === "Consultation"
  )
  const doctorPast = pastAppointments.filter(apt => 
    apt.serviceType === "Consultation"
  )

  const statsCards = useMemo(() => {
    if (!stats) return []
    return [
      { title: "Total Appointments", value: (doctorUpcoming.length + doctorPast.length).toString(), icon: Users, description: "All time" },
      { title: "Today's Appointments", value: doctorToday.length.toString(), icon: Calendar, description: "Scheduled today" },
      { title: "Completed", value: doctorPast.filter(apt => apt.status === "Completed").length.toString(), icon: CheckCircle, description: "Finished appointments" },
      { title: "Revenue", value: `ETB ${stats.revenue.toLocaleString()}`, icon: DollarSign, description: "Total earned" }
    ]
  }, [stats, doctorToday.length, doctorUpcoming.length, doctorPast.length])

  const tabs: TabOption[] = useMemo(() => [
    { id: "today", label: "Today", icon: <Bell className="h-4 w-4" />, count: doctorToday.length },
    { id: "upcoming", label: "Upcoming", icon: <CalendarIcon className="h-4 w-4" />, count: doctorUpcoming.length },
    { id: "past", label: "Past", icon: <ClipboardCheck className="h-4 w-4" />, count: doctorPast.length },
  ], [doctorToday.length, doctorUpcoming.length, doctorPast.length])

  const handleView = useCallback((appointment: AppointmentCardData) => {
    setSelectedAppointment(appointment)
    setIsViewDialogOpen(true)
  }, [])

  const handleReschedule = useCallback((appointment: AppointmentCardData) => {
    setSelectedAppointment(appointment)
    setIsRescheduleDialogOpen(true)
  }, [])

  const handleStartConsultation = useCallback(async (appointment: AppointmentCardData) => {
    try {
      await updateStatus(appointment.id, "In Progress")
      await refreshData()
      toast.success("Consultation started")
    } catch (error) {
      console.error("Error starting consultation:", error)
      toast.error("Failed to start consultation")
    }
  }, [updateStatus, refreshData])

  const handleCompleteConsultation = useCallback(async (appointment: AppointmentCardData) => {
    try {
      await updateStatus(appointment.id, "Completed")
      await refreshData()
      toast.success("Consultation completed successfully")
      
      toast.info("Completed consultation moved to Past tab", {
        duration: 3000,
      })
    } catch (error) {
      console.error("Error completing consultation:", error)
      toast.error("Failed to complete consultation")
    }
  }, [updateStatus, refreshData])

  const handleConfirmReschedule = useCallback(async (
    appointment: AppointmentCardData, 
    date: string, 
    time: string
  ) => {
    try {
      const [hours, minutes] = time.split(':')
      const endHour = parseInt(hours) + 1
      const startTime = `${date} ${time}:00`
      const endTime = `${date} ${endHour.toString().padStart(2, '0')}:${minutes}:00`
      await updateTiming(appointment.id, startTime, endTime)
      await refreshData()
      toast.success("Appointment rescheduled successfully")
    } catch (error) {
      console.error("Error rescheduling:", error)
      toast.error("Failed to reschedule appointment")
    }
  }, [updateTiming, refreshData])

  const handleCheckIn = useCallback((appointment: AppointmentCardData) => {
    router.push(`/doctor/checkin?appointmentId=${appointment.id}&cardNumber=${appointment.cardNumber}`)
  }, [router])

  const handleCancel = useCallback(async (appointment: AppointmentCardData) => {
    try {
      await updateStatus(appointment.id, "Cancelled")
      await refreshData()
      toast.success("Appointment cancelled successfully")
    } catch (error) {
      console.error("Error cancelling:", error)
      toast.error("Failed to cancel appointment")
    }
  }, [updateStatus, refreshData])

  const getCurrentAppointments = useCallback((): EnrichedAppointment[] => {
    switch (activeTab) {
      case "today": return doctorToday
      case "upcoming": return doctorUpcoming
      case "past": return doctorPast
      default: return []
    }
  }, [activeTab, doctorToday, doctorUpcoming, doctorPast])

  const currentAppointments = getCurrentAppointments()
  const isPastTab = activeTab === "past"
  const isTodayTab = activeTab === "today"

  if (isLoading && !currentAppointments.length) {
    return <LoadingState message="Loading your appointments..." />
  }

  return (
    <div className="min-h-screen bg-[#F8F9FF] pb-20">
      <div className="max-w-[1200px] mx-auto px-4 md:px-8 pt-8">
        <PageHeader
          title="Doctor Appointments"
          subtitle="Manage patient consultations and track appointments"
          actions={
            <Button 
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="bg-[#006767] hover:bg-[#008282] text-white rounded-xl px-6 py-6 h-auto shadow-md hover:shadow-lg transition-all group"
            >
              <RefreshCw className={`h-5 w-5 mr-2 ${isRefreshing ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`} />
              <div className="text-left">
                <div className="font-bold text-base">{isRefreshing ? 'Refreshing...' : 'Refresh'}</div>
                <div className="text-xs opacity-90">Check for new patients</div>
              </div>
            </Button>
          }
        />

        {statsCards.length > 0 && (
          <AppointmentStatsCards stats={statsCards} variant="doctor" />
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
              const appointmentCardData = toAppointmentCardData(appointment)
              
              // Determine which actions to show based on appointment status and tab
              const showStart = !isPastTab && appointment.status === "Checked-in"
              const showComplete = !isPastTab && appointment.status === "In Progress"
              const showCancel = !isPastTab && 
                (appointment.status === "Scheduled" || 
                 appointment.status === "Confirmed" || 
                 appointment.status === "Checked-in")
              
              return (
                <AppointmentCard
                  key={appointment.id}
                  appointment={appointmentCardData}
                  variant="doctor"
                  isPast={isPastTab}
                  onView={handleView}
                  onReschedule={!isPastTab && appointment.status === "Confirmed" ? handleReschedule : undefined}
                  onCancel={showCancel ? handleCancel : undefined}
                  onStart={showStart ? handleStartConsultation : undefined}
                  onComplete={showComplete ? handleCompleteConsultation : undefined}
                />
              )
            })
          ) : (
            <EmptyState
              variant="appointment"
              message={
                activeTab === "today" ? "No consultations today" : 
                activeTab === "upcoming" ? "No upcoming consultations" : 
                "No past consultations"
              }
              submessage={
                activeTab === "today" ? "Your scheduled consultations for today will appear here" : 
                activeTab === "upcoming" ? "Your scheduled patient consultations will appear here" : 
                "Your completed consultations will appear here"
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
        variant="doctor"
      />

      <RescheduleDialog
        open={isRescheduleDialogOpen}
        onOpenChange={setIsRescheduleDialogOpen}
        appointment={selectedAppointment}
        onConfirm={handleConfirmReschedule}
      />
    </div>
  )
}