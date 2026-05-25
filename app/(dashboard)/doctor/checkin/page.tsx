// doctor-checkin/page.tsx (improved styles)
"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { 
  Search,
  CheckCircle,
  Clock,
  Calendar,
  Users,
  X,
  Verified,
  Smartphone,
  QrCode,
  UserCheck,
  Stethoscope
} from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

interface Appointment {
  id: string
  patientName: string
  patientId: string
  time: string
  service: string
  status: "booked" | "checked-in" | "in-progress" | "completed"
  avatar: string
  cardNumber: string
  patientImage?: string
}

const todayAppointments: Appointment[] = [
  {
    id: "1",
    patientName: "Abebe Alemu",
    patientId: "#HL-2039",
    time: "09:30 AM",
    service: "General Consultation",
    status: "booked",
    avatar: "AA",
    cardNumber: "4512-7893-1023-6745"
  },
  {
    id: "2",
    patientName: "Sara Kebede",
    patientId: "#HL-2040",
    time: "09:45 AM",
    service: "Full Lab Panel",
    status: "checked-in",
    avatar: "SK",
    cardNumber: "8923-4567-1234-9876"
  },
  {
    id: "3",
    patientName: "Yonas Mekonnen",
    patientId: "#HL-2041",
    time: "10:15 AM",
    service: "Pediatric Review",
    status: "booked",
    avatar: "YM",
    cardNumber: "3456-7890-2345-6789"
  },
  {
    id: "4",
    patientName: "Tigist Haile",
    patientId: "#HL-2042",
    time: "10:45 AM",
    service: "Cardiology Consultation",
    status: "booked",
    avatar: "TH",
    cardNumber: "9012-3456-7890-1234"
  },
  {
    id: "5",
    patientName: "Mekdes Alemu",
    patientId: "#HL-2043",
    time: "11:30 AM",
    service: "Follow-up Visit",
    status: "booked",
    avatar: "MA",
    cardNumber: "5678-9012-3456-7890"
  }
]

export default function DoctorCheckin() {
  const [cardNumber, setCardNumber] = useState("")
  const [showRescheduleDialog, setShowRescheduleDialog] = useState(false)
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)
  const [checkedInPatients, setCheckedInPatients] = useState<Appointment[]>(
    todayAppointments.filter(a => a.status === "checked-in")
  )
  const [appointments, setAppointments] = useState<Appointment[]>(todayAppointments)
  const [selectedDate, setSelectedDate] = useState("2024-10-25")
  const [selectedTime, setSelectedTime] = useState("09:00 AM")
  const [foundPatient, setFoundPatient] = useState<Appointment | null>(null)

  const handleCheckIn = () => {
    if (!cardNumber) {
      toast.error("Please enter a card number")
      return
    }

    const patient = appointments.find(a => a.cardNumber === cardNumber)
    
    if (patient) {
      if (patient.status === "checked-in") {
        toast.error("Patient already checked in")
        return
      }
      
      setFoundPatient(patient)
      toast.success(`Patient ${patient.patientName} found`)
    } else {
      setFoundPatient(null)
      toast.error("No appointment found with this card number")
    }
  }

  const confirmCheckIn = () => {
    if (foundPatient) {
      setAppointments(appointments.map(a => 
        a.id === foundPatient.id ? { ...a, status: "checked-in" } : a
      ))
      setCheckedInPatients([...checkedInPatients, { ...foundPatient, status: "checked-in" }])
      setFoundPatient(null)
      setCardNumber("")
      toast.success(`${foundPatient.patientName} checked in successfully`)
    }
  }

  const handleReschedule = (appointment: Appointment) => {
    setSelectedAppointment(appointment)
    setShowRescheduleDialog(true)
  }

  const confirmReschedule = () => {
    if (selectedAppointment) {
      toast.success(`Appointment rescheduled to ${selectedDate} at ${selectedTime}`)
      setShowRescheduleDialog(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "checked-in":
        return <Badge className="bg-emerald-100 text-emerald-700">Checked-In</Badge>
      case "in-progress":
        return <Badge className="bg-blue-100 text-blue-700">In Progress</Badge>
      case "completed":
        return <Badge className="bg-gray-100 text-gray-700">Completed</Badge>
      default:
        return <Badge className="bg-amber-100 text-amber-700">Booked</Badge>
    }
  }

  const timeSlots = ["08:00 AM", "08:30 AM", "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM"]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Patient Check-in</h1>
        <p className="text-sm text-gray-500 mt-1">Check in patients and manage the waiting queue</p>
      </div>

      {/* Search Section - Card Number Input */}
      <Card className="border border-gray-100 shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-teal-50 to-white px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-100 flex items-center justify-center">
              <Smartphone className="h-5 w-5 text-teal-600" />
            </div>
            <div>
              <CardTitle className="text-lg font-bold text-gray-800">Enter Patient Card Number</CardTitle>
              <CardDescription className="text-sm text-gray-500"> Enter the patient's 16-digit card number</CardDescription>
            </div>
          </div>
        </div>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="4512-7893-1023-6745"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                className="py-6 font-mono text-base bg-gray-50 border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
              />
              <p className="text-xs text-gray-400 mt-2">
                Format: XXXX-XXXX-XXXX-XXXX (16 digits)
              </p>
            </div>
            <Button 
              className="bg-teal-600 hover:bg-teal-700 rounded-xl px-8 py-6 h-auto shadow-sm hover:shadow transition-all"
              onClick={handleCheckIn}
            >
              <Search className="mr-2 h-5 w-5" />
              Find Patient
            </Button>
          </div>


          {/* Found Patient - Show when patient is found */}
          {foundPatient && (
            <div className="mt-6 p-5 rounded-xl bg-emerald-50 border border-emerald-200">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-14 w-14 rounded-xl">
                    <AvatarFallback className="bg-emerald-100 text-emerald-700 text-lg font-bold">
                      {foundPatient.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-bold text-lg text-gray-800">{foundPatient.patientName}</p>
                    <p className="text-sm text-gray-500">{foundPatient.service}</p>
                    <p className="text-xs text-gray-400">ID: {foundPatient.patientId}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Appointment Time</p>
                  <p className="font-semibold text-teal-600">{foundPatient.time}</p>
                </div>
              </div>
              <div className="mt-4 flex justify-end">
                <Button onClick={confirmCheckIn} className="bg-emerald-600 hover:bg-emerald-700 rounded-lg">
                  <Verified className="mr-2 h-4 w-4" />
                  Confirm Check-in
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
        {/* Today's Schedule */}
        <Card className="lg:col-span-4 border border-gray-100 shadow-sm overflow-hidden">
          <div className="bg-gray-50/50 px-6 py-4 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-bold text-gray-800">Today's Schedule</CardTitle>
                <CardDescription className="text-sm text-gray-500">{appointments.length} patients scheduled today</CardDescription>
              </div>
              <Badge className="bg-teal-100 text-teal-700 px-3 py-1 text-sm">
                <UserCheck className="mr-1 h-3 w-3" />
                {appointments.filter(a => a.status === "checked-in").length} Checked In
              </Badge>
            </div>
          </div>
          <CardContent className="p-6">
            <div className="space-y-3">
              {appointments.map((apt) => (
                <div
                  key={apt.id}
                  className="group flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-teal-200 hover:shadow-md transition-all"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-14 text-center">
                      <p className="text-sm font-bold text-teal-600">{apt.time}</p>
                    </div>
                    <Avatar className="h-10 w-10 rounded-lg">
                      <AvatarFallback className="bg-gray-100 text-gray-600 font-medium">
                        {apt.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-gray-800">{apt.patientName}</p>
                      <p className="text-xs text-gray-400">{apt.patientId}</p>
                      <p className="text-sm text-gray-500">{apt.service}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {getStatusBadge(apt.status)}
                    {apt.status === "booked" && (
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="rounded-lg border-gray-200 hover:border-teal-300"
                        onClick={() => {
                          setCardNumber(apt.cardNumber)
                          handleCheckIn()
                        }}
                      >
                        Check In
                      </Button>
                    )}
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="hover:bg-gray-100"
                      onClick={() => handleReschedule(apt)}
                    >
                      <Calendar className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Right Column - Checked In Queue & Reschedule */}
        <div className="lg:col-span-3 space-y-6">
          {/* Checked In Queue */}
          <Card className="border border-gray-100 shadow-sm overflow-hidden">
            <div className="bg-amber-50/50 px-6 py-4 border-b border-amber-100">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
                  <Users className="h-4 w-4 text-amber-600" />
                </div>
                <CardTitle className="text-lg font-bold text-gray-800">Current Queue</CardTitle>
              </div>
              <CardDescription className="text-sm text-gray-500 mt-1">Patients waiting to be seen</CardDescription>
            </div>
            <CardContent className="p-6">
              {checkedInPatients.length > 0 ? (
                <div className="space-y-3">
                  {checkedInPatients.map((patient, index) => (
                    <div key={patient.id} className="flex items-center justify-between p-3 rounded-lg bg-emerald-50 border border-emerald-100">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-emerald-200 flex items-center justify-center">
                          <span className="font-bold text-emerald-700">{index + 1}</span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">{patient.patientName}</p>
                          <p className="text-xs text-gray-500">{patient.service}</p>
                        </div>
                      </div>
                      <Badge className="bg-blue-100 text-blue-700">Waiting</Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gray-100 flex items-center justify-center">
                    <Users className="h-8 w-8 text-gray-400" />
                  </div>
                  <p className="text-gray-500 font-medium">No patients in queue</p>
                  <p className="text-sm text-gray-400 mt-1">Check in patients to add them to the queue</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Reschedule Section */}
          <Card className="border border-gray-100 shadow-sm overflow-hidden">
            <div className="bg-purple-50/50 px-6 py-4 border-b border-purple-100">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
                  <Calendar className="h-4 w-4 text-purple-600" />
                </div>
                <CardTitle className="text-lg font-bold text-gray-800">Reschedule Booking</CardTitle>
              </div>
              <CardDescription className="text-sm text-gray-500 mt-1">Modify an existing appointment time</CardDescription>
            </div>
            <CardContent className="p-6 space-y-5">
              <div>
                <Label className="text-sm font-semibold text-gray-700">Patient ID or Name</Label>
                <div className="flex gap-2 mt-2">
                  <Input 
                    placeholder="e.g., #HL-2039 or Name"
                    className="bg-gray-50 border-gray-200 rounded-lg focus:ring-teal-500"
                  />
                  <Button variant="outline" className="rounded-lg border-gray-200">Search</Button>
                </div>
              </div>
              <div className="p-4 rounded-lg bg-gray-50 border border-gray-100">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Patient</span>
                    <span className="font-semibold text-gray-800">Abebe Alemu</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Service</span>
                    <span className="font-semibold text-gray-800">Cardiology Consultation</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Original Time</span>
                    <span className="font-semibold text-teal-600">Today, 09:30 AM</span>
                  </div>
                </div>
              </div>
              <div>
                <Label className="text-sm font-semibold text-gray-700">New Date</Label>
                <Input 
                  type="date" 
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="mt-2 bg-gray-50 border-gray-200 rounded-lg"
                />
              </div>
              <div>
                <Label className="text-sm font-semibold text-gray-700">New Time</Label>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {timeSlots.map((time) => (
                    <button
                      key={time}
                      onClick={() => setSelectedTime(time)}
                      className={cn(
                        "py-2 text-sm font-medium rounded-lg border transition-all",
                        selectedTime === time
                          ? "border-teal-500 bg-teal-50 text-teal-600"
                          : "border-gray-200 hover:border-teal-300 hover:text-teal-600"
                      )}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>
              <Button className="w-full bg-teal-600 hover:bg-teal-700 rounded-lg shadow-sm">
                Confirm Reschedule
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Reschedule Dialog */}
      <Dialog open={showRescheduleDialog} onOpenChange={setShowRescheduleDialog}>
        <DialogContent className="sm:max-w-[500px] rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gray-800">Reschedule Appointment</DialogTitle>
            <DialogDescription className="text-gray-500">
              Modify the appointment time for {selectedAppointment?.patientName}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-5 py-4">
            <div className="p-4 rounded-lg bg-gray-50 border border-gray-100">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-500">Current Time</span>
                  <span className="font-semibold text-gray-800">{selectedAppointment?.time}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Service</span>
                  <span className="font-semibold text-gray-800">{selectedAppointment?.service}</span>
                </div>
              </div>
            </div>
            <div>
              <Label className="text-sm font-semibold text-gray-700">New Date</Label>
              <Input type="date" className="mt-2 rounded-lg" />
            </div>
            <div>
              <Label className="text-sm font-semibold text-gray-700">New Time</Label>
              <div className="grid grid-cols-3 gap-2 mt-2">
                {["09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM"].map((time) => (
                  <button
                    key={time}
                    className="py-2 text-sm font-medium rounded-lg border border-gray-200 hover:border-teal-300 hover:text-teal-600 transition-all"
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter className="gap-3">
            <Button variant="outline" onClick={() => setShowRescheduleDialog(false)} className="rounded-lg">
              Cancel
            </Button>
            <Button onClick={confirmReschedule} className="bg-teal-600 hover:bg-teal-700 rounded-lg">
              Confirm Reschedule
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}