// app/diagnosticCenter/appointments/page.tsx
"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

interface Appointment {
  id: string
  patientName: string
  patientId: string
  testType: string
  date: string
  time: string
  status: "Scheduled" | "Checked-in" | "In Progress" | "Completed" | "Cancelled" | "No-show"
  paymentStatus: "Paid" | "Pending" | "Failed"
  fee: number
  phoneNumber?: string
  email?: string
}

const appointments: Appointment[] = [
  {
    id: "APT001",
    patientName: "James Wilson",
    patientId: "P001",
    testType: "Lipid Profile",
    date: "2024-05-20",
    time: "09:00 AM",
    status: "Checked-in",
    paymentStatus: "Paid",
    fee: 1200,
    phoneNumber: "+251 911 223 344",
    email: "james.wilson@example.com",
  },
  {
    id: "APT002",
    patientName: "Maria Garcia",
    patientId: "P002",
    testType: "Thyroid Panel",
    date: "2024-05-20",
    time: "10:30 AM",
    status: "Scheduled",
    paymentStatus: "Paid",
    fee: 1800,
    phoneNumber: "+251 922 556 677",
    email: "maria.garcia@example.com",
  },
  {
    id: "APT003",
    patientName: "Robert Brown",
    patientId: "P003",
    testType: "HbA1c Glycated Hemoglobin",
    date: "2024-05-20",
    time: "02:00 PM",
    status: "Scheduled",
    paymentStatus: "Pending",
    fee: 950,
    phoneNumber: "+251 933 889 900",
    email: "robert.brown@example.com",
  },
  {
    id: "APT004",
    patientName: "Sarah Miller",
    patientId: "P004",
    testType: "Complete Blood Count",
    date: "2024-05-20",
    time: "11:00 AM",
    status: "Scheduled",
    paymentStatus: "Paid",
    fee: 650,
    phoneNumber: "+251 944 112 233",
    email: "sarah.miller@example.com",
  },
  {
    id: "APT005",
    patientName: "David Chen",
    patientId: "P005",
    testType: "Vitamin D, 25-Hydroxy",
    date: "2024-05-19",
    time: "09:30 AM",
    status: "Completed",
    paymentStatus: "Paid",
    fee: 1400,
    phoneNumber: "+251 955 334 455",
    email: "david.chen@example.com",
  },
  {
    id: "APT006",
    patientName: "Elena Rodriguez",
    patientId: "P006",
    testType: "Thyroid Panel",
    date: "2024-05-18",
    time: "03:00 PM",
    status: "No-show",
    paymentStatus: "Failed",
    fee: 1800,
    phoneNumber: "+251 966 556 677",
    email: "elena.rodriguez@example.com",
  },
]

const statusColors: Record<string, string> = {
  "Scheduled": "bg-yellow-100 text-yellow-700",
  "Checked-in": "bg-green-100 text-green-700",
  "In Progress": "bg-blue-100 text-blue-700",
  "Completed": "bg-gray-100 text-gray-700",
  "Cancelled": "bg-red-100 text-red-700",
  "No-show": "bg-red-100 text-red-700",
}

const paymentStatusColors: Record<string, string> = {
  "Paid": "bg-green-100 text-green-700",
  "Pending": "bg-yellow-100 text-yellow-700",
  "Failed": "bg-red-100 text-red-700",
}

export default function AppointmentsPage() {
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isRescheduleDialogOpen, setIsRescheduleDialogOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const todayAppointments = appointments.filter(a => a.date === "2024-05-20")
  const upcomingAppointments = appointments.filter(a => 
    a.status === "Scheduled" || a.status === "Checked-in"
  )
  const pastAppointments = appointments.filter(a => 
    a.status === "Completed" || a.status === "Cancelled" || a.status === "No-show"
  )

  const filteredAppointments = (appts: Appointment[]) => {
    return appts.filter(apt => {
      const matchesSearch = apt.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           apt.patientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           apt.id.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = statusFilter === "all" || apt.status === statusFilter
      return matchesSearch && matchesStatus
    })
  }

  const stats = [
    { title: "Total Appointments", value: appointments.length.toString(), icon: "event_note", color: "bg-primary/10" },
    { title: "Today's Appointments", value: todayAppointments.length.toString(), icon: "today", color: "bg-blue-100" },
    { title: "Completed", value: appointments.filter(a => a.status === "Completed").length.toString(), icon: "check_circle", color: "bg-green-100" },
    { title: "Revenue (ETB)", value: appointments.filter(a => a.status === "Completed").reduce((sum, a) => sum + a.fee, 0).toLocaleString(), icon: "payments", color: "bg-yellow-100" }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-headline-lg text-headline-lg text-primary">Appointments Management</h1>
        <p className="text-body-md text-secondary mt-1">Schedule and manage patient test appointments</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat) => (
          <Card key={stat.title} className="bg-surface-container-lowest border border-outline-variant/30 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-label-md text-secondary uppercase tracking-wider mb-1">{stat.title}</p>
                  <p className="font-headline-md text-headline-md font-bold text-primary">{stat.value}</p>
                </div>
                <div className={cn("w-12 h-12 rounded-full flex items-center justify-center", stat.color)}>
                  <span className="material-symbols-outlined text-primary text-[24px]">{stat.icon}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search and Filter */}
      <Card className="bg-surface-container-lowest border border-outline-variant/30">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[20px]">search</span>
              <Input
                placeholder="Search by patient name, ID, or appointment ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-surface-container-low border-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px] bg-surface-container-low border-none">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Scheduled">Scheduled</SelectItem>
                <SelectItem value="Checked-in">Checked-in</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
                <SelectItem value="Cancelled">Cancelled</SelectItem>
                <SelectItem value="No-show">No-show</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Appointments Tabs */}
      <Card className="bg-surface-container-lowest border border-outline-variant/30">
        <CardHeader>
          <CardTitle className="font-headline-md text-headline-md text-on-surface">Appointments</CardTitle>
          <CardDescription>Manage all patient test appointments</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="today" className="space-y-4">
            <TabsList className="bg-surface-container-low">
              <TabsTrigger value="today">Today ({todayAppointments.length})</TabsTrigger>
              <TabsTrigger value="upcoming">Upcoming ({upcomingAppointments.length})</TabsTrigger>
              <TabsTrigger value="past">Past ({pastAppointments.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="today" className="space-y-4">
              {filteredAppointments(todayAppointments).map((apt) => (
                <AppointmentCard 
                  key={apt.id} 
                  appointment={apt} 
                  onView={() => {
                    setSelectedAppointment(apt)
                    setIsViewDialogOpen(true)
                  }}
                  onReschedule={() => {
                    setSelectedAppointment(apt)
                    setIsRescheduleDialogOpen(true)
                  }}
                />
              ))}
              {filteredAppointments(todayAppointments).length === 0 && (
                <div className="text-center py-8 text-secondary">
                  No appointments found
                </div>
              )}
            </TabsContent>

            <TabsContent value="upcoming" className="space-y-4">
              {filteredAppointments(upcomingAppointments).map((apt) => (
                <AppointmentCard 
                  key={apt.id} 
                  appointment={apt} 
                  onView={() => {
                    setSelectedAppointment(apt)
                    setIsViewDialogOpen(true)
                  }}
                  onReschedule={() => {
                    setSelectedAppointment(apt)
                    setIsRescheduleDialogOpen(true)
                  }}
                />
              ))}
            </TabsContent>

            <TabsContent value="past" className="space-y-4">
              {filteredAppointments(pastAppointments).map((apt) => (
                <AppointmentCard 
                  key={apt.id} 
                  appointment={apt} 
                  isPast
                  onView={() => {
                    setSelectedAppointment(apt)
                    setIsViewDialogOpen(true)
                  }}
                />
              ))}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* View Appointment Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl">Appointment Details</DialogTitle>
            <DialogDescription>Complete information about this appointment</DialogDescription>
          </DialogHeader>
          {selectedAppointment && (
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-surface-container-low rounded-lg">
                <div className="w-14 h-14 rounded-full bg-primary-container/20 flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary text-[32px]">account_circle</span>
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-on-surface">{selectedAppointment.patientName}</h3>
                  <p className="text-sm text-secondary">ID: {selectedAppointment.patientId}</p>
                  <p className="text-sm text-secondary">Appointment: {selectedAppointment.id}</p>
                </div>
              </div>
              <div className="grid gap-3">
                <div className="flex justify-between py-2 border-b border-outline-variant/20">
                  <span className="text-secondary">Test Type</span>
                  <span className="font-medium">{selectedAppointment.testType}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-outline-variant/20">
                  <span className="text-secondary">Date & Time</span>
                  <span className="font-medium">{selectedAppointment.date} at {selectedAppointment.time}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-outline-variant/20">
                  <span className="text-secondary">Status</span>
                  <Badge className={statusColors[selectedAppointment.status]}>{selectedAppointment.status}</Badge>
                </div>
                <div className="flex justify-between py-2 border-b border-outline-variant/20">
                  <span className="text-secondary">Payment Status</span>
                  <Badge className={paymentStatusColors[selectedAppointment.paymentStatus]}>
                    {selectedAppointment.paymentStatus}
                  </Badge>
                </div>
                <div className="flex justify-between py-2 border-b border-outline-variant/20">
                  <span className="text-secondary">Fee</span>
                  <span className="font-medium">ETB {selectedAppointment.fee.toLocaleString()}</span>
                </div>
                {selectedAppointment.phoneNumber && (
                  <div className="flex justify-between py-2 border-b border-outline-variant/20">
                    <span className="text-secondary">Phone</span>
                    <span>{selectedAppointment.phoneNumber}</span>
                  </div>
                )}
                {selectedAppointment.email && (
                  <div className="flex justify-between py-2">
                    <span className="text-secondary">Email</span>
                    <span>{selectedAppointment.email}</span>
                  </div>
                )}
              </div>
              <DialogFooter className="flex gap-3">
                <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>Close</Button>
                {selectedAppointment.status === "Checked-in" && (
                  <Button className="bg-primary hover:bg-primary-container text-white">
                    <span className="material-symbols-outlined text-[18px] mr-2">science</span>
                    Start Test
                  </Button>
                )}
                {selectedAppointment.status === "Scheduled" && (
                  <Button 
                    variant="outline" 
                    className="text-primary border-primary/30"
                    onClick={() => {
                      setIsViewDialogOpen(false)
                      setIsRescheduleDialogOpen(true)
                    }}
                  >
                    <span className="material-symbols-outlined text-[18px] mr-2">edit_calendar</span>
                    Reschedule
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
            <DialogTitle>Reschedule Appointment</DialogTitle>
            <DialogDescription>Select a new date and time for this appointment</DialogDescription>
          </DialogHeader>
          {selectedAppointment && (
            <div className="space-y-4">
              <div className="p-3 bg-surface-container-low rounded-lg">
                <p className="text-sm text-secondary">Patient: <span className="font-medium text-on-surface">{selectedAppointment.patientName}</span></p>
                <p className="text-sm text-secondary">Test: <span className="font-medium text-on-surface">{selectedAppointment.testType}</span></p>
                <p className="text-sm text-secondary">Current: <span className="font-medium text-on-surface">{selectedAppointment.date} at {selectedAppointment.time}</span></p>
              </div>
              <div>
                <Label>New Date</Label>
                <Input type="date" className="mt-1 bg-surface-container-low border-none" defaultValue="2024-05-21" />
              </div>
              <div>
                <Label>New Time</Label>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {["09:00 AM", "10:00 AM", "11:00 AM", "02:00 PM", "03:00 PM", "04:00 PM"].map((time) => (
                    <Button key={time} variant="outline" className="text-sm border-outline-variant">
                      {time}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRescheduleDialogOpen(false)}>Cancel</Button>
            <Button className="bg-primary hover:bg-primary-container text-white" onClick={() => setIsRescheduleDialogOpen(false)}>
              Confirm Reschedule
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// Appointment Card Component
function AppointmentCard({ 
  appointment, 
  isPast = false, 
  onView, 
  onReschedule 
}: { 
  appointment: Appointment
  isPast?: boolean
  onView: () => void
  onReschedule?: () => void
}) {
  const getInitials = (name: string) => {
    return name.split(" ").map(n => n[0]).join("")
  }

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-lg border border-outline-variant/30 hover:shadow-md transition-all bg-surface-container-lowest">
      <div className="w-12 h-12 rounded-full bg-secondary-container flex items-center justify-center">
        <span className="material-symbols-outlined text-secondary">person</span>
      </div>
      <div className="flex-1 space-y-1">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
          <span className="font-medium text-on-surface">{appointment.patientName}</span>
          <span className="text-xs text-secondary">ID: {appointment.patientId}</span>
          <span className="text-xs text-secondary font-mono">APT: {appointment.id}</span>
          <Badge className={statusColors[appointment.status]}>{appointment.status}</Badge>
        </div>
        <p className="text-sm text-secondary">{appointment.testType}</p>
        <div className="flex flex-wrap items-center gap-4 text-sm text-secondary">
          <span className="flex items-center gap-1">
            <span className="material-symbols-outlined text-[16px]">schedule</span>
            {appointment.date} at {appointment.time}
          </span>
          <span className="flex items-center gap-1">
            <span className="material-symbols-outlined text-[16px]">payments</span>
            ETB {appointment.fee.toLocaleString()}
          </span>
          <Badge className={paymentStatusColors[appointment.paymentStatus]}>
            {appointment.paymentStatus}
          </Badge>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={onView}>
          <span className="material-symbols-outlined text-[18px] mr-1">visibility</span>
          View
        </Button>
        {!isPast && onReschedule && appointment.status === "Scheduled" && (
          <Button variant="outline" size="sm" onClick={onReschedule}>
            <span className="material-symbols-outlined text-[18px] mr-1">edit_calendar</span>
            Reschedule
          </Button>
        )}
        {!isPast && appointment.status === "Checked-in" && (
          <Button size="sm" className="bg-primary hover:bg-primary-container text-white">
            <span className="material-symbols-outlined text-[18px] mr-1">science</span>
            Start Test
          </Button>
        )}
      </div>
    </div>
  )
}