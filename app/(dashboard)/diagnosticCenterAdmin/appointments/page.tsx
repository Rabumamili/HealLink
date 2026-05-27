// app/diagnosticCenter/appointments/page.tsx
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

export default function DiagnosticAppointmentsPage() {
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

  const statsCards = useMemo(() => {
    if (!stats) return []
    return [
      { title: "Total Appointments", value: stats.total.toString(), icon: Users, description: "All appointments" },
      { title: "Today's Appointments", value: stats.today.toString(), icon: Calendar, description: "Scheduled today" },
      { title: "Completed", value: stats.completed.toString(), icon: CheckCircle, description: "Completed tests" },
      { title: "Revenue", value: `ETB ${stats.revenue.toLocaleString()}`, icon: DollarSign, description: "Total earned" },
      { title: "Cards Issued", value: stats.cardsIssued.toString(), icon: ClipboardCheck, description: "Cards generated" },
      { title: "Cards Utilized", value: stats.cardsUtilized.toString(), icon: Users, description: "Cards used for check-in" },
    ]
  }, [stats])

  const tabs: TabOption[] = useMemo(() => [
    { id: "today", label: "Today", icon: <Bell className="h-4 w-4" />, count: todayAppointments.length },
    { id: "upcoming", label: "Upcoming", icon: <CalendarIcon className="h-4 w-4" />, count: upcomingAppointments.length },
    { id: "past", label: "Past", icon: <ClipboardCheck className="h-4 w-4" />, count: pastAppointments.length },
  ], [todayAppointments.length, upcomingAppointments.length, pastAppointments.length])

  const handleView = useCallback((appointment: AppointmentCardData) => {
    setSelectedAppointment(appointment)
    setIsViewDialogOpen(true)
  }, [])

  const handleReschedule = useCallback((appointment: AppointmentCardData) => {
    setSelectedAppointment(appointment)
    setIsRescheduleDialogOpen(true)
  }, [])

  const handleStartTest = useCallback(async (appointment: AppointmentCardData) => {
    try {
      await updateStatus(appointment.id, "In Progress")
      await refreshData()
      toast.success("Test started")
    } catch (error) {
      console.error("Error starting test:", error)
      toast.error("Failed to start test")
    }
  }, [updateStatus, refreshData])

  const handleCompleteTest = useCallback(async (appointment: AppointmentCardData) => {
    try {
      await updateStatus(appointment.id, "Completed")
      await refreshData()
      toast.success("Test completed successfully")
      
      toast.info("Completed test moved to Past tab", {
        duration: 3000,
      })
    } catch (error) {
      console.error("Error completing test:", error)
      toast.error("Failed to complete test")
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

  const handleConfirmAppointment = useCallback(async (appointment: AppointmentCardData) => {
    try {
      await updateStatus(appointment.id, "Confirmed")
      await refreshData()
      
      if (appointment.cardNumber) {
        toast.success(`Appointment confirmed! Card: ${appointment.cardNumber}`, {
          duration: 8000,
        })
      } else {
        toast.success("Appointment confirmed successfully")
      }
    } catch (error) {
      console.error("Error confirming appointment:", error)
      toast.error("Failed to confirm appointment")
    }
  }, [updateStatus, refreshData])

  const handleCheckIn = useCallback(async (appointment: AppointmentCardData) => {
    router.push(`/diagnosticCenter/checkin?appointmentId=${appointment.id}&cardNumber=${appointment.cardNumber}`)
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
      case "today": return todayAppointments
      case "upcoming": return upcomingAppointments
      case "past": return pastAppointments
      default: return []
    }
  }, [activeTab, todayAppointments, upcomingAppointments, pastAppointments])

  const currentAppointments = getCurrentAppointments()
  const isPastTab = activeTab === "past"

  if (isLoading && !todayAppointments.length && !upcomingAppointments.length && !pastAppointments.length) {
    return <LoadingState message="Loading appointments..." />
  }

  return (
    <div className="min-h-screen bg-[#F8F9FF] pb-20">
      <div className="max-w-[1200px] mx-auto px-4 md:px-8 pt-8">
        <PageHeader
          title="Diagnostic Appointments"
          subtitle="Manage patient test appointments, verify payments, and handle check-ins"
          actions={
            <Button 
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="bg-[#006767] hover:bg-[#008282] text-white rounded-xl px-6 py-6 h-auto shadow-md hover:shadow-lg transition-all group"
            >
              <RefreshCw className={`h-5 w-5 mr-2 ${isRefreshing ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`} />
              <div className="text-left">
                <div className="font-bold text-base">{isRefreshing ? 'Refreshing...' : 'Refresh'}</div>
                <div className="text-xs opacity-90">Check for new payments</div>
              </div>
            </Button>
          }
        />

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
              const appointmentCardData = toAppointmentCardData(appointment)
              
              const showConfirm = !isPastTab && 
                appointment.status === "Scheduled" && 
                appointment.paymentStatus === "Paid"
              
              const showCheckin = !isPastTab && appointment.status === "Confirmed"
              const showStart = !isPastTab && appointment.status === "Checked-in"
              const showComplete = !isPastTab && appointment.status === "In Progress"
              const showReschedule = !isPastTab && 
                (appointment.status === "Scheduled" || appointment.status === "Confirmed")
              const showCancel = !isPastTab && 
                (appointment.status === "Scheduled" || 
                 appointment.status === "Confirmed" || 
                 appointment.status === "Checked-in")
              
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
                  onStart={showStart ? handleStartTest : undefined}
                  onComplete={showComplete ? handleCompleteTest : undefined}
                  onConfirm={showConfirm ? handleConfirmAppointment : undefined}
                  onCheckIn={showCheckin ? handleCheckIn : undefined}
                />
              )
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
        variant="clinic"
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