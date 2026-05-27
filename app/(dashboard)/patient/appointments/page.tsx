// app/patient/appointments/page.tsx
"use client"

import { useState, useCallback, useMemo, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Bell, Calendar as CalendarIcon, ClipboardCheck, RefreshCw, CalendarPlus, Calendar } from "lucide-react"
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
import { toast } from "sonner"
import { EnrichedAppointment } from "@/types/entities/appointment.types"
import Link from "next/link"

// Get current patient ID from localStorage or auth context
const getCurrentPatientId = (): number => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('currentPatientId')
    if (stored) return parseInt(stored)
  }
  return 201 // Default patient ID for demo
}

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

export default function PatientAppointmentsPage() {
  const router = useRouter()
  const [selectedAppointment, setSelectedAppointment] = useState<AppointmentCardData | null>(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isRescheduleDialogOpen, setIsRescheduleDialogOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<"today" | "upcoming" | "past">("today")
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [patientId, setPatientId] = useState<number>(201)

  useEffect(() => {
    setPatientId(getCurrentPatientId())
  }, [])

  const {
    appointments,
    todayAppointments,
    upcomingAppointments,
    pastAppointments,
    stats,
    isLoading,
    filters,
    setFilters,
    updateStatus,
    updateTiming,
    cancelAppointment,
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

  // Filter appointments for the current patient
  const patientAppointments = appointments.filter(apt => apt.patientId === patientId)
  
  const patientToday = todayAppointments.filter(apt => apt.patientId === patientId)
  const patientUpcoming = upcomingAppointments.filter(apt => apt.patientId === patientId)
  const patientPast = pastAppointments.filter(apt => apt.patientId === patientId)

  const totalSpent = patientAppointments
    .filter(apt => apt.paymentStatus === "Paid")
    .reduce((sum, apt) => sum + (apt.fee || 0), 0)

  const statsCards = useMemo(() => [
    { title: "Total", value: patientAppointments.length.toString(), icon: ClipboardCheck, description: "All appointments" },
    { title: "Today", value: patientToday.length.toString(), icon: CalendarIcon, description: "Today's visits" },
    { title: "Upcoming", value: patientUpcoming.length.toString(), icon: Bell, description: "Scheduled visits" },
    { title: "Total Spent", value: `ETB ${totalSpent.toLocaleString()}`, icon: Calendar, description: "Healthcare investment" }
  ], [patientAppointments.length, patientToday.length, patientUpcoming.length, totalSpent])

  const tabs: TabOption[] = useMemo(() => [
    { id: "today", label: "Today", icon: <CalendarIcon className="h-4 w-4" />, count: patientToday.length },
    { id: "upcoming", label: "Upcoming", icon: <Bell className="h-4 w-4" />, count: patientUpcoming.length },
    { id: "past", label: "Past", icon: <ClipboardCheck className="h-4 w-4" />, count: patientPast.length },
  ], [patientToday.length, patientUpcoming.length, patientPast.length])

  const handleView = useCallback((appointment: AppointmentCardData) => {
    setSelectedAppointment(appointment)
    setIsViewDialogOpen(true)
  }, [])

  const handleReschedule = useCallback((appointment: AppointmentCardData) => {
    setSelectedAppointment(appointment)
    setIsRescheduleDialogOpen(true)
  }, [])

  const handleCancel = useCallback(async (appointment: AppointmentCardData) => {
    try {
      await cancelAppointment(appointment.id)
      await refreshData()
      toast.success("Appointment cancelled successfully")
    } catch (error) {
      console.error("Error cancelling:", error)
      toast.error("Failed to cancel appointment")
    }
  }, [cancelAppointment, refreshData])

  const handleContact = useCallback((appointment: AppointmentCardData) => {
    toast.info(`Contact provider at ${appointment.location || 'the clinic'}`)
  }, [])

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

  const getCurrentAppointments = useCallback((): EnrichedAppointment[] => {
    switch (activeTab) {
      case "today": return patientToday
      case "upcoming": return patientUpcoming
      case "past": return patientPast
      default: return []
    }
  }, [activeTab, patientToday, patientUpcoming, patientPast])

  const currentAppointments = getCurrentAppointments()
  const isPastTab = activeTab === "past"

  if (isLoading && !currentAppointments.length) {
    return <LoadingState message="Loading your appointments..." />
  }

  return (
    <div className="min-h-screen bg-[#F8F9FF] pb-20">
      <div className="max-w-[1200px] mx-auto px-4 md:px-8 pt-8">
        <PageHeader
          title="My Appointments"
          subtitle="Manage your healthcare schedule and track your medical visits"
          actions={
            <Link href="/patient/bookings">
              <Button className="bg-[#006767] hover:bg-[#008282] text-white rounded-xl px-6 py-6 h-auto shadow-md hover:shadow-lg transition-all group">
                <CalendarPlus className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
                <div className="text-left">
                  <div className="font-bold text-base">Book New</div>
                  <div className="text-xs opacity-90">Schedule appointment</div>
                </div>
              </Button>
            </Link>
          }
        />

        <AppointmentStatsCards stats={statsCards} variant="patient" />

        <AppointmentFilters
          searchTerm={filters.searchTerm || ""}
          onSearchChange={(value) => setFilters({ searchTerm: value })}
          statusFilter={filters.status || "all"}
          onStatusChange={(value) => setFilters({ status: value as any })}
          placeholder="Search by provider or service..."
        />

        <TabsFilter 
          tabs={tabs} 
          activeTab={activeTab} 
          onTabChange={(tab) => setActiveTab(tab as "today" | "upcoming" | "past")} 
        />

        {activeTab === "upcoming" && patientUpcoming.length === 0 && !isLoading && (
          <div className="mb-8 bg-gradient-to-r from-[#006767]/5 to-[#008282]/5 rounded-2xl p-6 border border-[#006767]/20">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#006767]/10 rounded-xl flex items-center justify-center">
                  <CalendarPlus className="h-6 w-6 text-[#006767]" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-[#0b1c30]">No upcoming appointments?</h3>
                  <p className="text-sm text-[#6d7979]">Book your next healthcare visit today</p>
                </div>
              </div>
              <Link href="/patient/bookings">
                <Button variant="outline" className="border-[#006767]/30 text-[#006767] hover:bg-[#006767]/5 rounded-xl">
                  Find a Provider
                </Button>
              </Link>
            </div>
          </div>
        )}

        <div className="space-y-5 mt-6">
          {currentAppointments.length > 0 ? (
            currentAppointments.map((apt) => (
              <AppointmentCard
                key={apt.id}
                appointment={toAppointmentCardData(apt)}
                variant="patient"
                isPast={isPastTab}
                onView={handleView}
                onReschedule={!isPastTab && apt.status === "Confirmed" ? handleReschedule : undefined}
                onCancel={!isPastTab && apt.status !== "Cancelled" && apt.status !== "Completed" ? handleCancel : undefined}
                onContact={handleContact}
              />
            ))
          ) : (
            <EmptyState
              variant="appointment"
              message={
                activeTab === "today" ? "No appointments today" : 
                activeTab === "upcoming" ? "No upcoming appointments" : 
                "No past appointments"
              }
              submessage={
                activeTab === "today" ? "You have no appointments scheduled for today" : 
                activeTab === "upcoming" ? "Schedule your next healthcare visit to stay on top of your health" : 
                "Your appointment history will appear here"
              }
              actionLabel={activeTab === "upcoming" ? "Book an Appointment" : undefined}
              actionHref={activeTab === "upcoming" ? "/patient/bookings" : undefined}
            />
          )}
        </div>
      </div>

      <AppointmentDetailsDialog
        open={isViewDialogOpen}
        onOpenChange={setIsViewDialogOpen}
        appointment={selectedAppointment}
        onReschedule={handleReschedule}
        variant="patient"
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