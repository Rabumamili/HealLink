// app/patient/appointments/page.tsx
"use client"

import { useState } from "react"
import { CalendarPlus, Bell, Calendar as CalendarIcon, ClipboardCheck, DollarSign, Users, CheckCircle } from "lucide-react"
import Link from "next/link"
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

export default function PatientAppointmentsPage() {
  const [selectedAppointment, setSelectedAppointment] = useState<AppointmentCardData | null>(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isRescheduleDialogOpen, setIsRescheduleDialogOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<"upcoming" | "past">("upcoming")

  const {
    appointments,
    stats,
    isLoading,
    filters,
    setFilters,
    updateStatus,
    updateTiming,
    cancelAppointment,
  } = useAppointments()

  // Filter appointments for the current patient from the hook's data
  // In a real app, this patient ID would come from authentication context
  // For demo with mock data, we filter by patientId 201 (Abebe Kebede)
  const patientAppointments = appointments.filter(apt => apt.patientId === 201)
  
  const patientUpcoming = patientAppointments.filter(apt => 
    apt.status === "Scheduled" || apt.status === "Confirmed" || apt.status === "Checked-in"
  )
  const patientPast = patientAppointments.filter(apt => 
    apt.status === "Completed" || apt.status === "Cancelled" || apt.status === "No-show"
  )

  const totalSpent = patientAppointments
    .filter(apt => apt.paymentStatus === "Paid")
    .reduce((sum, apt) => sum + (apt.fee || 0), 0)

  const statsCards = [
    { title: "Total", value: patientAppointments.length.toString(), icon: Users, description: "All appointments" },
    { title: "Upcoming", value: patientUpcoming.length.toString(), icon: CalendarIcon, description: "Scheduled visits" },
    { title: "Completed", value: patientPast.filter(apt => apt.status === "Completed").length.toString(), icon: CheckCircle, description: "Finished appointments" },
    { title: "Total Spent", value: `ETB ${totalSpent.toLocaleString()}`, icon: DollarSign, description: "Healthcare investment" }
  ]

  const tabs: TabOption[] = [
    { id: "upcoming", label: "Upcoming", icon: <Bell className="h-4 w-4" />, count: patientUpcoming.length },
    { id: "past", label: "Past", icon: <ClipboardCheck className="h-4 w-4" />, count: patientPast.length },
  ]

  const handleView = (appointment: AppointmentCardData) => {
    setSelectedAppointment(appointment)
    setIsViewDialogOpen(true)
  }

  const handleReschedule = (appointment: AppointmentCardData) => {
    setSelectedAppointment(appointment)
    setIsRescheduleDialogOpen(true)
  }

  const handleCancel = async (appointment: AppointmentCardData) => {
    await cancelAppointment(appointment.id)
  }

  const handleContact = (appointment: AppointmentCardData) => {
    toast.info(`Contact provider at ${appointment.location || 'the clinic'}`)
  }

  const handleConfirmReschedule = async (appointment: AppointmentCardData, date: string, time: string) => {
    const startTime = `${date} ${time}`
    const endTime = `${date} ${parseInt(time.split(':')[0]) + 1}:${time.split(':')[1]}`
    await updateTiming(appointment.id, startTime, endTime)
  }

  const currentAppointments = activeTab === "upcoming" ? patientUpcoming : patientPast
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
                  <div className="font-bold text-base">Book New Appointment</div>
                  <div className="text-xs opacity-90">Schedule with a provider</div>
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

        <TabsFilter tabs={tabs} activeTab={activeTab} onTabChange={(tab) => setActiveTab(tab as any)} />

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
                appointment={apt}
                variant="patient"
                isPast={isPastTab}
                onView={handleView}
                onReschedule={!isPastTab && apt.status === "Scheduled" ? handleReschedule : undefined}
                onCancel={!isPastTab && apt.status !== "Cancelled" && apt.status !== "Completed" ? handleCancel : undefined}
                onContact={handleContact}
              />
            ))
          ) : (
            <EmptyState
              variant="appointment"
              message={activeTab === "upcoming" ? "No upcoming appointments" : "No past appointments"}
              submessage={activeTab === "upcoming" ? "Schedule your next healthcare visit to stay on top of your health" : "Your appointment history will appear here"}
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