// app/doctor/appointments/page.tsx
"use client"

import { useState } from "react"
import { CalendarPlus, Bell, Calendar as CalendarIcon, ClipboardCheck, Stethoscope, DollarSign, Users, CheckCircle } from "lucide-react"
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function DoctorAppointmentsPage() {
  const [selectedAppointment, setSelectedAppointment] = useState<AppointmentCardData | null>(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isRescheduleDialogOpen, setIsRescheduleDialogOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<"upcoming" | "past">("upcoming")

  const {
    appointments,
    upcomingAppointments,
    pastAppointments,
    stats,
    isLoading,
    filters,
    setFilters,
    updateStatus,
    updateTiming,
  } = useAppointments()

  // Filter for consultation-type appointments (doctor appointments)
  const doctorAppointments = appointments.filter(apt => apt.type === "Consultation")
  const doctorUpcoming = doctorAppointments.filter(apt => 
    apt.status === "Scheduled" || apt.status === "Confirmed" || apt.status === "Checked-in"
  )
  const doctorPast = doctorAppointments.filter(apt => 
    apt.status === "Completed" || apt.status === "Cancelled" || apt.status === "No-show"
  )

  const statsCards = stats ? [
    { title: "Total Appointments", value: doctorAppointments.length.toString(), icon: Users, description: "All time" },
    { title: "Upcoming", value: doctorUpcoming.length.toString(), icon: CalendarIcon, description: "Scheduled visits" },
    { title: "Completed", value: doctorPast.filter(apt => apt.status === "Completed").length.toString(), icon: CheckCircle, description: "Finished appointments" },
    { title: "Revenue", value: `ETB ${stats.revenue.toLocaleString()}`, icon: DollarSign, description: "Total earned" }
  ] : []

  const tabs: TabOption[] = [
    { id: "upcoming", label: "Upcoming", icon: <Bell className="h-4 w-4" />, count: doctorUpcoming.length },
    { id: "past", label: "Past", icon: <ClipboardCheck className="h-4 w-4" />, count: doctorPast.length },
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
    await updateStatus(appointment.id, "In Progress")
  }

  const handleConfirmReschedule = async (appointment: AppointmentCardData, date: string, time: string) => {
    const startTime = `${date} ${time}`
    const endTime = `${date} ${parseInt(time.split(':')[0]) + 1}:${time.split(':')[1]}`
    await updateTiming(appointment.id, startTime, endTime)
  }

  const currentAppointments = activeTab === "upcoming" ? doctorUpcoming : doctorPast
  const isPastTab = activeTab === "past"

  if (isLoading && !currentAppointments.length) {
    return <LoadingState message="Loading your appointments..." />
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Appointments"
        subtitle="Manage and track all patient appointments"
        actions={
          <Link href="/doctor/checkin">
            <Button className="bg-teal-600 hover:bg-teal-700 text-white rounded-xl px-6 py-5 h-auto shadow-md hover:shadow-lg transition-all group">
              <CalendarPlus className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
              <div className="text-left">
                <div className="font-bold text-base">Check-in Patient</div>
                <div className="text-xs opacity-90">Quick patient check-in</div>
              </div>
            </Button>
          </Link>
        }
      />

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {statsCards.map((stat, idx) => (
          <Card key={idx} className="border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-800 mt-1">{stat.value}</p>
                  <p className="text-xs text-gray-400 mt-1">{stat.description}</p>
                </div>
                <div className="h-11 w-11 rounded-xl bg-teal-50 flex items-center justify-center text-teal-600">
                  <stat.icon className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border border-gray-100 shadow-sm overflow-hidden">
        <CardHeader className="bg-gray-50/50 border-b border-gray-100">
          <CardTitle className="text-lg font-bold text-gray-800">All Appointments</CardTitle>
          <CardDescription className="text-sm text-gray-500">
            Your appointment history and upcoming visits
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <AppointmentFilters
            searchTerm={filters.searchTerm || ""}
            onSearchChange={(value) => setFilters({ searchTerm: value })}
            statusFilter={filters.status || "all"}
            onStatusChange={(value) => setFilters({ status: value as any })}
            placeholder="Search by patient name..."
            className="mb-6"
          />

          <TabsFilter tabs={tabs} activeTab={activeTab} onTabChange={(tab) => setActiveTab(tab as any)} variant="pills" />

          <div className="space-y-4 mt-6">
            {currentAppointments.length > 0 ? (
              currentAppointments.map((apt) => (
                <AppointmentCard
                  key={apt.id}
                  appointment={apt}
                  variant="doctor"
                  isPast={isPastTab}
                  onView={handleView}
                  onReschedule={!isPastTab && apt.status === "Scheduled" ? handleReschedule : undefined}
                  onStart={!isPastTab && (apt.status === "Checked-in" || apt.status === "Confirmed") ? handleStartConsultation : undefined}
                />
              ))
            ) : (
              <EmptyState
                variant="appointment"
                message={activeTab === "upcoming" ? "No upcoming appointments" : "No past appointments"}
                submessage={activeTab === "upcoming" ? "Your scheduled appointments will appear here" : "Your completed appointments will appear here"}
                actionLabel={activeTab === "upcoming" ? "View Schedule" : undefined}
                actionHref={activeTab === "upcoming" ? "/doctor/schedule" : undefined}
              />
            )}
          </div>
        </CardContent>
      </Card>

      <AppointmentDetailsDialog
        open={isViewDialogOpen}
        onOpenChange={setIsViewDialogOpen}
        appointment={selectedAppointment}
        onStart={handleStartConsultation}
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