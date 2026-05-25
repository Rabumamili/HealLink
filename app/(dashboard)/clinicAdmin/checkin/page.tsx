"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Search, 
  CheckCircle, 
  Clock, 
  UserCheck,
  Calendar,
  CreditCard,
  AlertCircle
} from "lucide-react"
import { cn } from "@/lib/utils"

interface CheckedInPatient {
  id: string
  patientName: string
  patientId: string
  service: string
  checkInTime: string
  appointmentTime: string
  status: "waiting" | "in-progress" | "completed"
  queueNumber: number
  cardNumber: string
}

const checkedInPatients: CheckedInPatient[] = [
  {
    id: "1",
    patientName: "Abebe Kebede",
    patientId: "P001",
    service: "General Consultation",
    checkInTime: "08:55 AM",
    appointmentTime: "09:00 AM",
    status: "in-progress",
    queueNumber: 1,
    cardNumber: "4512-7893-1023-6745",
  },
  {
    id: "2",
    patientName: "Tigist Haile",
    patientId: "P002",
    service: "Pediatric Checkup",
    checkInTime: "09:20 AM",
    appointmentTime: "09:30 AM",
    status: "waiting",
    queueNumber: 2,
    cardNumber: "8923-4567-1234-9876",
  },
]

export default function ClinicCheckinPage() {
  const [cardNumber, setCardNumber] = useState("")
  const [searchResult, setSearchResult] = useState<any>(null)
  const [showSuccess, setShowSuccess] = useState(false)

  const handleVerifyAndCheckin = () => {
    // Simulate verification
    if (cardNumber === "4512-7893-1023-6745") {
      setSearchResult({
        patientName: "Abebe Kebede",
        patientId: "P001",
        service: "General Consultation",
        appointmentTime: "09:00 AM",
        status: "confirmed",
        paymentStatus: "paid",
      })
    } else if (cardNumber === "8923-4567-1234-9876") {
      setSearchResult({
        patientName: "Tigist Haile",
        patientId: "P002",
        service: "Pediatric Checkup",
        appointmentTime: "09:30 AM",
        status: "confirmed",
        paymentStatus: "paid",
      })
    } else {
      setSearchResult({
        error: "Invalid Card Number or No Appointment Found",
      })
    }
  }

  const confirmCheckin = () => {
    setShowSuccess(true)
    setTimeout(() => setShowSuccess(false), 3000)
    setCardNumber("")
    setSearchResult(null)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-teal-600">Patient Check-in</h1>
        <p className="text-muted-foreground">Verify and check in patients using their Card number</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Check-in Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCheck className="h-5 w-5 text-teal-600" />
              Quick Patient Check-in
            </CardTitle>
            <CardDescription>Enter patient's 16-digit Card number to verify and check in</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <Input
                    placeholder="Enter 16-digit Card number (e.g., 4512-7893-1023-6745)"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="font-mono"
                  />
                </div>
                <Button className="bg-teal-600 hover:bg-teal-700 whitespace-nowrap" onClick={handleVerifyAndCheckin}>
                  <Search className="mr-2 h-4 w-4" />
                  Verify & Check-in
                </Button>
              </div>

              {/* Search Result */}
              {searchResult && (
                <div className={cn(
                  "p-4 rounded-lg border",
                  searchResult.error ? "bg-red-50 border-red-200" : "bg-green-50 border-green-200"
                )}>
                  {searchResult.error ? (
                    <div className="flex items-center gap-3 text-red-700">
                      <AlertCircle className="h-5 w-5" />
                      <p>{searchResult.error}</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-12 w-12">
                            <AvatarFallback className="bg-teal-100 text-teal-600">
                              {searchResult.patientName.split(" ").map((n: string) => n[0]).join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-semibold">{searchResult.patientName}</p>
                            <p className="text-sm text-muted-foreground">ID: {searchResult.patientId}</p>
                          </div>
                        </div>
                        <Badge className="bg-green-100 text-green-700">Verified</Badge>
                      </div>
                      <div className="grid gap-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Service</span>
                          <span>{searchResult.service}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Appointment Time</span>
                          <span>{searchResult.appointmentTime}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Payment Status</span>
                          <Badge className="bg-green-100 text-green-700">{searchResult.paymentStatus}</Badge>
                        </div>
                      </div>
                      <Button className="w-full bg-teal-600 hover:bg-teal-700" onClick={confirmCheckin}>
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Confirm Check-in
                      </Button>
                    </div>
                  )}
                </div>
              )}

              {/* Success Message */}
              {showSuccess && (
                <div className="p-4 bg-green-100 border border-green-300 rounded-lg animate-in fade-in">
                  <div className="flex items-center gap-3 text-green-700">
                    <CheckCircle className="h-5 w-5" />
                    <p>Patient checked in successfully! They have been added to the queue.</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Current Queue */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-teal-600" />
              Current Queue
            </CardTitle>
            <CardDescription>Patients currently checked in and waiting</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {checkedInPatients.map((patient, index) => (
                <div key={patient.id} className="flex items-center gap-4 p-3 rounded-lg border">
                  <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center font-bold text-teal-600">
                    {patient.queueNumber}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{patient.patientName}</p>
                    <p className="text-sm text-muted-foreground">{patient.service}</p>
                  </div>
                  <div className="text-right">
                    <Badge className={cn(
                      patient.status === "in-progress" 
                        ? "bg-purple-100 text-purple-700"
                        : "bg-yellow-100 text-yellow-700"
                    )}>
                      {patient.status === "in-progress" ? "In Progress" : "Waiting"}
                    </Badge>
                    <p className="text-xs text-muted-foreground mt-1">Checked in: {patient.checkInTime}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Today's Schedule Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-teal-600" />
            Today's Schedule Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-2xl font-bold text-blue-600">18</p>
              <p className="text-sm text-muted-foreground">Total Appointments</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-2xl font-bold text-green-600">2</p>
              <p className="text-sm text-muted-foreground">Checked In</p>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <p className="text-2xl font-bold text-yellow-600">16</p>
              <p className="text-sm text-muted-foreground">Remaining</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}