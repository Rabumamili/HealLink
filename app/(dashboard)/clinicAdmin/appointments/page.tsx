// app/clinicAdmin/appointments/page.tsx
"use client"

import { useState } from "react"
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

export default function ClinicAppointmentsPage() {
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

  const handleRefresh = async () => {
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
  }

  const statsCards = stats ? [
    { title: "Total Appointments", value: stats.total.toString(), icon: Users, description: "All appointments" },
    { title: "Today's Appointments", value: stats.today.toString(), icon: Calendar, description: "Scheduled today" },
    { title: "Completed", value: stats.completed.toString(), icon: CheckCircle, description: "Finished appointments" },
    { title: "Revenue", value: `ETB ${stats.revenue.toLocaleString()}`, icon: DollarSign, description: "Total earned" }
  ] : []

  const tabs: TabOption[] = [
    { id: "today", label: "Today", icon: <Bell className="h-4 w-4" />, count: todayAppointments.length },
    { id: "upcoming", label: "Upcoming", icon: <CalendarIcon className="h-4 w-4" />, count: upcomingAppointments.length },
    { id: "past", label: "Past", icon: <ClipboardCheck className="h-4 w-4" />, count: pastAppointments.length },
  ]

  const handleView = (appointment: AppointmentCardData) => {
    setSelectedAppointment(appointment)
    setIsViewDialogOpen(true)
  }

  const handleReschedule = (appointment: AppointmentCardData) => {
    setSelectedAppointment(appointment)
    setIsRescheduleDialogOpen(true)
  }

  const handleStartConsultation = async (appointment: AppointmentCardData) => {
    try {
      await updateStatus(appointment.id, "In Progress")
      await refreshData()
      toast.success("Consultation started")
    } catch (error) {
      toast.error("Failed to start consultation")
    }
  }

  const handleConfirmReschedule = async (appointment: AppointmentCardData, date: string, time: string) => {
    try {
      const startTime = `${date} ${time}`
      const endTime = `${date} ${parseInt(time.split(':')[0]) + 1}:${time.split(':')[1]}`
      await updateTiming(appointment.id, startTime, endTime)
      await refreshData()
      toast.success("Appointment rescheduled")
    } catch (error) {
      toast.error("Failed to reschedule appointment")
    }
  }

  const generateCardNumber = (patientId: number): string => {
    const date = new Date()
    const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '')
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0')
    return `CARD-${dateStr}-${random}`
  }

  const handleConfirmAppointment = async (appointment: AppointmentCardData) => {
    try {
      const cardNumber = generateCardNumber(appointment.patientId || appointment.id)
      await updateStatus(appointment.id, "Confirmed")
      await refreshData()
      
      toast.success(`Appointment confirmed! Card: ${cardNumber}`, {
        duration: 5000,
      })
    } catch (error) {
      console.error("Error confirming appointment:", error)
      toast.error("Failed to confirm appointment")
    }
  }

  const handleCheckIn = async (appointment: AppointmentCardData) => {
    try {
      if (!appointment.cardNumber) {
        toast.error("No card number assigned")
        return
      }
      
      await updateStatus(appointment.id, "Checked-in")
      await refreshData()
      toast.success("Patient checked in")
    } catch (error) {
      toast.error("Failed to check in patient")
    }
  }

  const handleCancel = async (appointment: AppointmentCardData) => {
    try {
      await updateStatus(appointment.id, "Cancelled")
      await refreshData()
      toast.success("Appointment cancelled")
    } catch (error) {
      toast.error("Failed to cancel appointment")
    }
  }

  const getCurrentAppointments = () => {
    switch (activeTab) {
      case "today": return todayAppointments
      case "upcoming": return upcomingAppointments
      case "past": return pastAppointments
    }
  }

  const currentAppointments = getCurrentAppointments()
  const isPastTab = activeTab === "past"

  if (isLoading && !currentAppointments.length) {
    return <LoadingState message="Loading appointments..." />
  }

  return (
    <div className="min-h-screen bg-[#F8F9FF] pb-20">
      <div className="max-w-[1200px] mx-auto px-4 md:px-8 pt-8">
        <PageHeader
          title="Clinic Appointments"
          subtitle="Manage patient appointments, verify payments, and handle check-ins"
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

        <AppointmentStatsCards stats={statsCards} variant="clinic" />

        <AppointmentFilters
          searchTerm={filters.searchTerm || ""}
          onSearchChange={(value) => setFilters({ searchTerm: value })}
          statusFilter={filters.status || "all"}
          onStatusChange={(value) => setFilters({ status: value as any })}
          placeholder="Search by patient name, card number, or ID..."
        />

        <TabsFilter tabs={tabs} activeTab={activeTab} onTabChange={(tab) => setActiveTab(tab as any)} />

        <div className="space-y-5 mt-6">
          {currentAppointments.length > 0 ? (
            currentAppointments.map((apt) => {
              const showConfirm = !isPastTab && apt.status === "Scheduled" && apt.paymentStatus === "Paid"
              const showCheckin = !isPastTab && apt.status === "Confirmed"
              
              return (
                <AppointmentCard
                  key={apt.id}
                  appointment={apt}
                  variant="clinic"
                  isPast={isPastTab}
                  showCheckin={showCheckin}
                  showConfirm={showConfirm}
                  onView={handleView}
                  onReschedule={!isPastTab && apt.status === "Confirmed" ? handleReschedule : undefined}
                  onCancel={!isPastTab ? handleCancel : undefined}
                  onStart={!isPastTab && (apt.status === "Checked-in" || apt.status === "In Progress") ? handleStartConsultation : undefined}
                  onConfirm={showConfirm ? handleConfirmAppointment : undefined}
                  onCheckIn={showCheckin ? handleCheckIn : undefined}
                />
              )
            })
          ) : (
            <EmptyState
              variant="appointment"
              message={activeTab === "today" ? "No appointments today" : activeTab === "upcoming" ? "No upcoming appointments" : "No past appointments"}
              submessage={activeTab === "today" ? "No patient appointments scheduled for today" : activeTab === "upcoming" ? "No future appointments scheduled" : "Your appointment history will appear here"}
            />
          )}
        </div>
      </div>

      <AppointmentDetailsDialog
        open={isViewDialogOpen}
        onOpenChange={setIsViewDialogOpen}
        appointment={selectedAppointment}
        onStart={handleStartConsultation}
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