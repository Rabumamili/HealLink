// app/clinicAdmin/appointments/page.tsx
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CalendarPlus, Bell, ClipboardCheck } from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { useAppointments } from "@/hooks/useAppointments"
import { AppointmentStatsCards } from "@/components/appointments/AppointmentStatsCards"
import { AppointmentFilters } from "@/components/appointments/AppointmentFilters"
import { ProviderAppointmentCard } from "@/components/appointments/ProviderAppointmentCard"

// Replace with actual clinic ID from auth
const CLINIC_ID = "clinic1"

export default function ClinicAppointmentsPage() {
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isRescheduleDialogOpen, setIsRescheduleDialogOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<"today" | "upcoming" | "past">("today")
  const [newDate, setNewDate] = useState("")
  const [newTime, setNewTime] = useState("")

  const {
    todayAppointments,
    upcomingAppointments,
    pastAppointments,
    stats,
    filters,
    setFilters,
    updateStatus,
    reschedule,
  } = useAppointments(CLINIC_ID)

  // Transform stats for the stats cards component
  const statsCards = stats ? [
    { title: "Total Appointments", value: stats.total.toString(), description: "All appointments" },
    { title: "Today's Appointments", value: stats.today.toString(), description: "Scheduled today" },
    { title: "Completed", value: stats.completed.toString(), description: "Finished appointments" },
    { title: "Revenue", value: `ETB ${stats.revenue.toLocaleString()}`, description: "Total earned" }
  ] : []

  const handleView = (appointment: any) => {
    setSelectedAppointment(appointment)
    setIsViewDialogOpen(true)
  }

  const handleReschedule = (appointment: any) => {
    setSelectedAppointment(appointment)
    setIsRescheduleDialogOpen(true)
  }

  const handleStartConsultation = async (appointment: any) => {
    await updateStatus(appointment.id, "In Progress")
    toast.success("Consultation started")
  }

  const handleConfirmReschedule = async () => {
    if (selectedAppointment && newDate && newTime) {
      await reschedule(selectedAppointment.id, newDate, newTime)
      setIsRescheduleDialogOpen(false)
      setNewDate("")
      setNewTime("")
    }
  }

  return (
    <div className="min-h-screen bg-[#F8F9FF] pb-20">
      <div className="max-w-[1200px] mx-auto px-4 md:px-8 pt-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-[28px] md:text-[32px] font-bold text-[#0b1c30] tracking-tight">
              Clinic Appointments
            </h1>
            <p className="text-[16px] text-[#3d4949] mt-1">
              Manage and track all patient appointments
            </p>
          </div>
          <Button 
            className="bg-[#006767] hover:bg-[#008282] text-white rounded-xl px-6 py-6 h-auto shadow-md hover:shadow-lg transition-all group"
          >
            <CalendarPlus className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
            <div className="text-left">
              <div className="font-bold text-base">Export Report</div>
              <div className="text-xs opacity-90">Download appointment data</div>
            </div>
          </Button>
        </div>

        {/* Stats Cards */}
        <AppointmentStatsCards stats={statsCards} variant="clinic" />

        {/* Filters */}
        <div className="mb-6">
          <AppointmentFilters
            searchTerm={filters.searchTerm || ""}
            onSearchChange={(value) => setFilters({ searchTerm: value })}
            statusFilter={filters.status || "all"}
            onStatusChange={(value) => setFilters({ status: value as any })}
            placeholder="Search by patient name or ID..."
          />
        </div>

        {/* Tabs */}
        <div className="bg-[#EFF4FF] p-1.5 rounded-xl w-fit mb-6">
          <button
            onClick={() => setActiveTab("today")}
            className={cn(
              "px-5 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2",
              activeTab === "today"
                ? "bg-white shadow-sm text-[#006767]"
                : "text-[#6d7979] hover:text-[#0b1c30]"
            )}
          >
            <Bell className="h-4 w-4" />
            Today ({todayAppointments.length})
          </button>
          <button
            onClick={() => setActiveTab("upcoming")}
            className={cn(
              "px-5 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2",
              activeTab === "upcoming"
                ? "bg-white shadow-sm text-[#006767]"
                : "text-[#6d7979] hover:text-[#0b1c30]"
            )}
          >
            <CalendarPlus className="h-4 w-4" />
            Upcoming ({upcomingAppointments.length})
          </button>
          <button
            onClick={() => setActiveTab("past")}
            className={cn(
              "px-5 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2",
              activeTab === "past"
                ? "bg-white shadow-sm text-[#006767]"
                : "text-[#6d7979] hover:text-[#0b1c30]"
            )}
          >
            <ClipboardCheck className="h-4 w-4" />
            Past ({pastAppointments.length})
          </button>
        </div>

        {/* Appointments List */}
        <div className="space-y-5">
          {activeTab === "today" && (
            todayAppointments.length > 0 ? (
              todayAppointments.map((apt) => (
                <ProviderAppointmentCard
                  key={apt.id}
                  appointment={apt}
                  onView={handleView}
                  onReschedule={handleReschedule}
                  onStart={handleStartConsultation}
                  showCheckin
                />
              ))
            ) : (
              <EmptyState 
                message="No appointments today" 
                submessage="No patient appointments scheduled for today"
              />
            )
          )}

          {activeTab === "upcoming" && (
            upcomingAppointments.length > 0 ? (
              upcomingAppointments.map((apt) => (
                <ProviderAppointmentCard
                  key={apt.id}
                  appointment={apt}
                  onView={handleView}
                  onReschedule={handleReschedule}
                />
              ))
            ) : (
              <EmptyState 
                message="No upcoming appointments" 
                submessage="No future appointments scheduled"
              />
            )
          )}

          {activeTab === "past" && (
            pastAppointments.length > 0 ? (
              pastAppointments.map((apt) => (
                <ProviderAppointmentCard
                  key={apt.id}
                  appointment={apt}
                  isPast
                  onView={handleView}
                />
              ))
            ) : (
              <EmptyState 
                message="No past appointments" 
                submessage="Your appointment history will appear here"
              />
            )
          )}
        </div>
      </div>

      {/* View Appointment Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="rounded-2xl max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-[#0b1c30]">Appointment Details</DialogTitle>
            <DialogDescription className="text-[#3d4949]">
              Complete information about this appointment
            </DialogDescription>
          </DialogHeader>
          {selectedAppointment && (
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-[#EFF4FF] rounded-xl">
                <div className="w-14 h-14 rounded-xl bg-[#006767]/10 flex items-center justify-center text-[#006767] text-lg font-bold">
                  {selectedAppointment.patientName?.split(" ").map((n: string) => n[0]).join("")}
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-[#0b1c30]">{selectedAppointment.patientName}</h3>
                  <p className="text-sm text-[#6d7979]">ID: {selectedAppointment.patientId}</p>
                </div>
              </div>
              <div className="grid gap-3">
                <div className="flex justify-between py-2 border-b border-[#E0E7FF]">
                  <span className="text-[#6d7979]">Service</span>
                  <span className="font-medium text-[#0b1c30]">{selectedAppointment.serviceName}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-[#E0E7FF]">
                  <span className="text-[#6d7979]">Date & Time</span>
                  <span className="font-medium text-[#0b1c30]">{selectedAppointment.date} at {selectedAppointment.time}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-[#E0E7FF]">
                  <span className="text-[#6d7979]">Location</span>
                  <span className="font-medium text-[#0b1c30]">{selectedAppointment.location}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-[#E0E7FF]">
                  <span className="text-[#6d7979]">Fee</span>
                  <span className="font-medium text-[#0b1c30]">ETB {selectedAppointment.fee}</span>
                </div>
                {selectedAppointment.cardNumber && (
                  <div className="flex justify-between py-2">
                    <span className="text-[#6d7979]">Card Number</span>
                    <span className="font-mono text-sm text-[#006767]">{selectedAppointment.cardNumber}</span>
                  </div>
                )}
              </div>
              <DialogFooter className="gap-3">
                <Button variant="outline" onClick={() => setIsViewDialogOpen(false)} className="rounded-xl">
                  Close
                </Button>
                {selectedAppointment.status === "Checked-in" && (
                  <Button 
                    className="bg-[#006767] hover:bg-[#008282] text-white rounded-xl"
                    onClick={() => {
                      handleStartConsultation(selectedAppointment)
                      setIsViewDialogOpen(false)
                    }}
                  >
                    Start Consultation
                  </Button>
                )}
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Reschedule Dialog */}
      <Dialog open={isRescheduleDialogOpen} onOpenChange={setIsRescheduleDialogOpen}>
        <DialogContent className="rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-[#0b1c30]">Reschedule Appointment</DialogTitle>
            <DialogDescription className="text-[#3d4949]">
              Select a new date and time for this appointment
            </DialogDescription>
          </DialogHeader>
          {selectedAppointment && (
            <div className="space-y-4">
              <div className="p-4 bg-[#EFF4FF] rounded-xl space-y-1">
                <p className="text-sm text-[#6d7979]">
                  Patient: <span className="font-medium text-[#0b1c30]">{selectedAppointment.patientName}</span>
                </p>
                <p className="text-sm text-[#6d7979]">
                  Service: <span className="font-medium text-[#0b1c30]">{selectedAppointment.serviceName}</span>
                </p>
                <p className="text-sm text-[#6d7979]">
                  Current: <span className="font-medium text-[#0b1c30]">{selectedAppointment.date} at {selectedAppointment.time}</span>
                </p>
              </div>
              <div>
                <Label className="text-[#3d4949]">New Date</Label>
                <Input 
                  type="date" 
                  value={newDate} 
                  onChange={(e) => setNewDate(e.target.value)} 
                  className="mt-1 rounded-xl border-[#E0E7FF] focus:ring-[#006767]"
                />
              </div>
              <div>
                <Label className="text-[#3d4949]">New Time</Label>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {["09:00 AM", "10:00 AM", "11:00 AM", "02:00 PM", "03:00 PM", "04:00 PM"].map((time) => (
                    <Button
                      key={time}
                      variant={newTime === time ? "default" : "outline"}
                      className={cn(
                        "rounded-xl",
                        newTime === time && "bg-[#006767] hover:bg-[#008282]"
                      )}
                      onClick={() => setNewTime(time)}
                    >
                      {time}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          )}
          <DialogFooter className="gap-3">
            <Button variant="outline" onClick={() => setIsRescheduleDialogOpen(false)} className="rounded-xl">
              Cancel
            </Button>
            <Button 
              className="bg-[#006767] hover:bg-[#008282] text-white rounded-xl" 
              onClick={handleConfirmReschedule}
            >
              Confirm Reschedule
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function EmptyState({ message, submessage }: { message: string; submessage: string }) {
  return (
    <div className="bg-white rounded-2xl border border-[#E0E7FF] text-center py-16">
      <div className="w-20 h-20 bg-[#EFF4FF] rounded-2xl flex items-center justify-center mx-auto mb-5">
        <CalendarPlus className="h-10 w-10 text-[#6d7979] opacity-50" />
      </div>
      <p className="text-[#3d4949] text-lg font-semibold mb-2">{message}</p>
      <p className="text-[#6d7979] text-sm">{submessage}</p>
    </div>
  )
}