"use client"

import { useState, useCallback, useMemo, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Bell, Calendar as CalendarIcon, ClipboardCheck, RefreshCw, Sparkles } from "lucide-react"
import { useAppointments } from "@/hooks/useAppointments"
import { AppointmentStatsCards } from "@/components/appointments/AppointmentStatsCards"
import { AppointmentFilters } from "@/components/appointments/AppointmentFilters"
import { AppointmentCard, AppointmentCardData } from "@/components/appointments/AppointmentCards"
import { AppointmentDetailsDialog } from "@/components/appointments/AppointmentDetailsDialog"
import { RescheduleDialog } from "@/components/appointments/RescheduleDialog"
import { AppointmentHeader } from "@/components/appointments/AppointmentHeader"
import { TabsFilter, TabOption } from "@/components/common/TabsFilter"
import { EmptyState } from "@/components/common/EmptyState"
import { LoadingState } from "@/components/common/LoadingState"
import { Button } from "@/components/ui/button"
import { Calendar, DollarSign, Users, CheckCircle, Stethoscope, CalendarPlus } from "lucide-react"
import { toast } from "sonner"
import { EnrichedAppointment } from "@/types/entities/appointment.types"
import Link from "next/link"

// Card number IS included for doctor view (for check-in purposes)
const toAppointmentCardData = (appointment: EnrichedAppointment): AppointmentCardData => {
  return {
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
  }
}

// Get doctor ID from localStorage
const getCurrentDoctorId = (): number => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('currentDoctorId')
    if (stored) {
      const parsed = parseInt(stored, 10)
      if (!isNaN(parsed)) return parsed
    }
  }
  return 1
}

export default function DoctorAppointmentsPage() {
  const router = useRouter()
  const [doctorId, setDoctorId] = useState<number>(1)
  const [selectedAppointment, setSelectedAppointment] = useState<AppointmentCardData | null>(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isRescheduleDialogOpen, setIsRescheduleDialogOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<"today" | "upcoming" | "past">("today")
  const [isRefreshing, setIsRefreshing] = useState(false)

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
  } = useAppointments()

  useEffect(() => {
    const id = getCurrentDoctorId()
    setDoctorId(id)
    fetchProviderAppointments(id)
  }, [fetchProviderAppointments])

  const doctorAppointments = useMemo(() => {
    return appointments.filter((apt: EnrichedAppointment) => 
      apt.providerId === doctorId && apt.serviceType === 'Consultation'
    )
  }, [appointments, doctorId])

  const filteredAppointments = useMemo(() => {
    return doctorAppointments.filter((apt: EnrichedAppointment) => {
      const matchesSearch = 
        !filters.searchTerm || 
        apt.patientName?.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        apt.cardNumber?.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        apt.patientId?.toString().includes(filters.searchTerm)
      
      const matchesStatus = 
        !filters.status || 
        filters.status === 'all' || 
        apt.status === filters.status
      
      return matchesSearch && matchesStatus
    })
  }, [doctorAppointments, filters])

  const today = new Date().toISOString().split('T')[0]
  
  const todayAppointments = useMemo(() => {
    return filteredAppointments.filter((apt: EnrichedAppointment) => 
      apt.scheduledDateTime.startsWith(today)
    )
  }, [filteredAppointments, today])

  const upcomingAppointments = useMemo(() => {
    return filteredAppointments.filter((apt: EnrichedAppointment) => 
      apt.scheduledDateTime > today && 
      apt.status !== 'Completed' && 
      apt.status !== 'Cancelled' &&
      apt.status !== 'No-show'
    )
  }, [filteredAppointments, today])

  const pastAppointments = useMemo(() => {
    return filteredAppointments.filter((apt: EnrichedAppointment) => 
      apt.status === 'Completed' || 
      apt.status === 'Cancelled' || 
      apt.status === 'No-show' ||
      (apt.scheduledDateTime < today && apt.status !== 'Scheduled' && apt.status !== 'Confirmed')
    )
  }, [filteredAppointments, today])

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true)
    try {
      await refreshData()
      await fetchProviderAppointments(doctorId)
      toast.success("Appointment data refreshed")
    } catch (error) {
      console.error("Error refreshing data:", error)
      toast.error("Failed to refresh data")
    } finally {
      setIsRefreshing(false)
    }
  }, [refreshData, fetchProviderAppointments, doctorId])

  const statsCards = useMemo(() => {
    if (!stats) return []
    return [
      { title: "Total Consultations", value: doctorAppointments.length.toString(), icon: Stethoscope, description: "All time" },
      { title: "Today's Consultations", value: todayAppointments.length.toString(), icon: Calendar, description: "Scheduled today" },
      { title: "Completed", value: pastAppointments.filter(a => a.status === 'Completed').length.toString(), icon: CheckCircle, description: "Finished appointments" },
      { title: "Revenue", value: `ETB ${stats.revenue?.toLocaleString() || 0}`, icon: DollarSign, description: "Total earned" }
    ]
  }, [stats, doctorAppointments.length, todayAppointments.length, pastAppointments])

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

  const handleStartConsultation = useCallback(async (appointment: AppointmentCardData) => {
    try {
      await updateStatus(appointment.id, "In Progress")
      await fetchProviderAppointments(doctorId)
      toast.success("Consultation started")
    } catch (error) {
      console.error("Error starting consultation:", error)
      toast.error("Failed to start consultation")
    }
  }, [updateStatus, fetchProviderAppointments, doctorId])

  const handleCompleteConsultation = useCallback(async (appointment: AppointmentCardData) => {
    try {
      await updateStatus(appointment.id, "Completed")
      await fetchProviderAppointments(doctorId)
      toast.success("Consultation completed successfully")
    } catch (error) {
      console.error("Error completing consultation:", error)
      toast.error("Failed to complete consultation")
    }
  }, [updateStatus, fetchProviderAppointments, doctorId])

  const handleConfirmReschedule = useCallback(async (
    appointment: AppointmentCardData, 
    date: string, 
    time: string
  ) => {
    try {
      const startDateTime = new Date(`${date}T${time}:00`)
      const endDateTime = new Date(startDateTime.getTime() + 30 * 60000)
      
      await updateTiming(appointment.id, startDateTime.toISOString(), endDateTime.toISOString())
      await fetchProviderAppointments(doctorId)
      toast.success("Appointment rescheduled successfully")
    } catch (error) {
      console.error("Error rescheduling:", error)
      toast.error("Failed to reschedule appointment")
    }
  }, [updateTiming, fetchProviderAppointments, doctorId])

  const handleCheckIn = useCallback((appointment: AppointmentCardData) => {
    router.push(`/doctor/checkin?appointmentId=${appointment.id}&cardNumber=${appointment.cardNumber}`)
  }, [router])

  const handleCancel = useCallback(async (appointment: AppointmentCardData) => {
    try {
      await updateStatus(appointment.id, "Cancelled")
      await fetchProviderAppointments(doctorId)
      toast.success("Appointment cancelled successfully")
    } catch (error) {
      console.error("Error cancelling:", error)
      toast.error("Failed to cancel appointment")
    }
  }, [updateStatus, fetchProviderAppointments, doctorId])

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

  if (isLoading && doctorAppointments.length === 0) {
    return <LoadingState message="Loading your appointments..." />
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white pb-20">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        {/* Modern Header with consistent #008282 color */}
        <AppointmentHeader
          title="Doctor Appointments"
          description="Manage your patient consultations, track appointment status, and provide quality care. View detailed patient information and service descriptions for each consultation."
          icon={<Stethoscope className="h-5 w-5" />}
          variant="doctor"
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
              <Link href="/doctor/schedule">
                <Button variant="outline" className="rounded-xl border-[#008282] text-[#008282] hover:bg-[#008282]/10">
                  <CalendarPlus className="h-4 w-4 mr-2" />
                  Manage Schedule
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
                <h3 className="font-semibold text-[#008282]">Today's Schedule Overview</h3>
                <p className="text-sm text-slate-600 mt-1">
                  You have {todayAppointments.length} consultation{todayAppointments.length !== 1 ? 's' : ''} scheduled today.
                  {todayAppointments.filter(a => a.status === 'Checked-in').length > 0 && 
                    ` ${todayAppointments.filter(a => a.status === 'Checked-in').length} patient(s) have checked in and are waiting.`}
                </p>
              </div>
            </div>
          </div>
        )}

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

        <div className="space-y-4 mt-6">
          {currentAppointments.length > 0 ? (
            currentAppointments.map((appointment) => {
              const appointmentCardData = toAppointmentCardData(appointment)
              
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
                  variant="doctor"
                  isPast={isPastTab}
                  showCheckin={showCheckin}
                  onView={handleView}
                  onReschedule={showReschedule ? handleReschedule : undefined}
                  onCancel={showCancel ? handleCancel : undefined}
                  onStart={showStart ? handleStartConsultation : undefined}
                  onComplete={showComplete ? handleCompleteConsultation : undefined}
                  onCheckIn={showCheckin ? handleCheckIn : undefined}
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
                activeTab === "today" ? "Your scheduled consultations for today will appear here." : 
                activeTab === "upcoming" ? "No future consultations are scheduled. Share your availability with patients." : 
                "Your completed and cancelled consultations will appear here for reference."
              }
              actionLabel={activeTab === "upcoming" ? "Share Availability" : undefined}
              actionHref={activeTab === "upcoming" ? "/doctor/schedule" : undefined}
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