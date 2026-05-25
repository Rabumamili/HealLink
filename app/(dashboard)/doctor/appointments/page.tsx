// doctor-appointments/page.tsx
"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { 
  Calendar,
  Clock,
  MapPin,
  CalendarPlus,
  Activity,
  DollarSign,
  CheckCircle,
  Users,
  TrendingUp,
  Stethoscope
} from "lucide-react"
import { cn } from "@/lib/utils"

interface Appointment {
  id: string
  patientName: string
  patientId: string
  service: string
  date: string
  time: string
  location: string
  status: "Confirmed" | "Checked-in" | "In Progress" | "Completed" | "Cancelled" | "No-show"
  cardNumber: string | null
  fee: number
  patientImage?: string
}

const appointments: Appointment[] = [
  {
    id: "1",
    patientName: "Abebe Kebede",
    patientId: "P001",
    service: "Initial Consultation",
    date: "May 15, 2026",
    time: "10:00 AM",
    location: "Black Lion Hospital, Addis Ababa",
    status: "Confirmed",
    cardNumber: "4512-7893-1023-6745",
    fee: 500,
  },
  {
    id: "2",
    patientName: "Tigist Haile",
    patientId: "P002",
    service: "Cardiology Review",
    date: "May 18, 2026",
    time: "8:30 AM",
    location: "Bole, Addis Ababa",
    status: "Checked-in",
    cardNumber: "8923-4567-1234-9876",
    fee: 750,
  },
  {
    id: "3",
    patientName: "Mekdes Alemu",
    patientId: "P003",
    service: "Follow-up Visit",
    date: "May 10, 2026",
    time: "2:00 PM",
    location: "Kazanchis, Addis Ababa",
    status: "Completed",
    cardNumber: "1234-5678-9012-3456",
    fee: 300,
  },
  {
    id: "4",
    patientName: "Yonas Desta",
    patientId: "P004",
    service: "General Consultation",
    date: "May 5, 2026",
    time: "11:00 AM",
    location: "Bole, Addis Ababa",
    status: "Completed",
    cardNumber: "9876-5432-1098-7654",
    fee: 500,
  },
]

const statusColors: Record<string, string> = {
  "Confirmed": "bg-emerald-100 text-emerald-700",
  "Checked-in": "bg-blue-100 text-blue-700",
  "In Progress": "bg-amber-100 text-amber-700",
  "Completed": "bg-gray-100 text-gray-700",
  "Cancelled": "bg-rose-100 text-rose-700",
  "No-show": "bg-rose-100 text-rose-700",
}

export default function DoctorAppointmentsPage() {
  const upcomingAppointments = appointments.filter(a => 
    a.status === "Confirmed" || a.status === "Checked-in" || a.status === "In Progress"
  )
  const pastAppointments = appointments.filter(a => 
    a.status === "Completed" || a.status === "Cancelled" || a.status === "No-show"
  )

  const stats = [
    { title: "Total Appointments", value: appointments.length.toString(), icon: Calendar, color: "bg-teal-50 text-teal-600", description: "All time" },
    { title: "Upcoming", value: upcomingAppointments.length.toString(), icon: Activity, color: "bg-blue-50 text-blue-600", description: "Scheduled" },
    { title: "Completed", value: appointments.filter(a => a.status === "Completed").length.toString(), icon: CheckCircle, color: "bg-emerald-50 text-emerald-600", description: "Finished" },
    { title: "Revenue", value: `ETB ${appointments.filter(a => a.status === "Completed").reduce((sum, a) => sum + a.fee, 0).toLocaleString()}`, icon: DollarSign, color: "bg-amber-50 text-amber-600", description: "Total earned" }
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Appointments</h1>
          <p className="text-sm text-gray-500 mt-1">Manage and track all patient appointments</p>
        </div>
        <Button asChild className="bg-teal-600 hover:bg-teal-700 shadow-sm hover:shadow transition-all rounded-xl px-6 py-5 h-auto">
          <Link href="/doctor/checkin">
            <CalendarPlus className="mr-2 h-4 w-4" />
            Check-in Patient
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-800 mt-1">{stat.value}</p>
                  <p className="text-xs text-gray-400 mt-1">{stat.description}</p>
                </div>
                <div className={cn("h-11 w-11 rounded-xl flex items-center justify-center", stat.color)}>
                  <stat.icon className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Appointments List */}
      <Card className="border border-gray-100 shadow-sm overflow-hidden">
        <CardHeader className="bg-gray-50/50 border-b border-gray-100">
          <CardTitle className="text-lg font-bold text-gray-800">All Appointments</CardTitle>
          <CardDescription className="text-sm text-gray-500">Your appointment history and upcoming visits</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <Tabs defaultValue="upcoming" className="space-y-6">
            <TabsList className="bg-gray-100 p-1 rounded-xl">
              <TabsTrigger value="upcoming" className="rounded-lg text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm">
                Upcoming ({upcomingAppointments.length})
              </TabsTrigger>
              <TabsTrigger value="past" className="rounded-lg text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm">
                Past ({pastAppointments.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="upcoming" className="space-y-4">
              {upcomingAppointments.map((apt) => (
                <AppointmentCard key={apt.id} appointment={apt} />
              ))}
            </TabsContent>

            <TabsContent value="past" className="space-y-4">
              {pastAppointments.map((apt) => (
                <AppointmentCard key={apt.id} appointment={apt} isPast />
              ))}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

function AppointmentCard({ appointment, isPast = false }: { appointment: Appointment; isPast?: boolean }) {
  return (
    <div className="group flex flex-col sm:flex-row sm:items-center gap-4 p-5 rounded-xl border border-gray-100 bg-white hover:shadow-md hover:border-teal-200 transition-all duration-300">
      <Avatar className="h-14 w-14 rounded-xl">
        <AvatarImage src={appointment.patientImage} />
        <AvatarFallback className="bg-teal-50 text-teal-600 text-base font-bold rounded-xl">
          {appointment.patientName.split(" ").map(n => n[0]).join("")}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 space-y-1.5">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
          <span className="font-semibold text-gray-800 text-base">{appointment.patientName}</span>
          <Badge className={cn("text-xs font-medium", statusColors[appointment.status])}>{appointment.status}</Badge>
        </div>
        <p className="text-sm text-gray-500">{appointment.service}</p>
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
          <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5 text-teal-500" />{appointment.date} at {appointment.time}</span>
          <span className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5 text-teal-500" />{appointment.location.split(",")[0]}</span>
          <span className="flex items-center gap-1.5"><DollarSign className="h-3.5 w-3.5 text-teal-500" />ETB {appointment.fee}</span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {!isPast && appointment.cardNumber && (
          <Button variant="outline" size="sm" asChild className="rounded-lg border-gray-200 hover:border-teal-300">
            <Link href={`/doctor/checkin?card=${appointment.cardNumber}`}>View Card</Link>
          </Button>
        )}
        {!isPast && (
          <Button size="sm" className="bg-teal-600 text-white hover:bg-teal-700 rounded-lg shadow-sm" asChild>
            <Link href={`/doctor/patient/${appointment.patientId}`}>Start Consultation</Link>
          </Button>
        )}
      </div>
    </div>
  )
}