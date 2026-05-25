// app/diagnosticCenter/checkin/page.tsx
"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

interface CheckedInPatient {
  id: string
  patientName: string
  patientId: string
  testType: string
  checkInTime: string
  appointmentTime: string
  status: "waiting" | "in-progress" | "completed"
  queueNumber: number
}

const checkedInPatients: CheckedInPatient[] = [
  {
    id: "1",
    patientName: "James Wilson",
    patientId: "P001",
    testType: "Lipid Profile",
    checkInTime: "08:55 AM",
    appointmentTime: "09:00 AM",
    status: "in-progress",
    queueNumber: 1,
  },
  {
    id: "2",
    patientName: "Maria Garcia",
    patientId: "P002",
    testType: "Thyroid Panel",
    checkInTime: "09:20 AM",
    appointmentTime: "09:30 AM",
    status: "waiting",
    queueNumber: 2,
  },
  {
    id: "3",
    patientName: "Robert Brown",
    patientId: "P003",
    testType: "HbA1c Glycated Hemoglobin",
    checkInTime: "09:45 AM",
    appointmentTime: "10:00 AM",
    status: "waiting",
    queueNumber: 3,
  },
]

const todayAppointments = [
  { time: "09:30 AM", patient: "Abebe Alemu", test: "General Consultation", status: "Booked" },
  { time: "09:45 AM", patient: "Sara Kebede", test: "Full Lab Panel", status: "Checked-In" },
  { time: "10:15 AM", patient: "Yonas Mekonnen", test: "Pediatric Review", status: "Booked" },
  { time: "10:45 AM", patient: "Tigist Haile", test: "Cardiology Consult", status: "Booked" },
  { time: "11:30 AM", patient: "Mekdes Alemu", test: "Minor Procedure", status: "Booked" },
]

export default function CheckinPage() {
  const [cardNumber, setCardNumber] = useState("")
  const [searchResult, setSearchResult] = useState<any>(null)
  const [showSuccess, setShowSuccess] = useState(false)

  const handleVerifyAndCheckin = () => {
    if (cardNumber === "4512-7893-1023-6745") {
      setSearchResult({
        patientName: "James Wilson",
        patientId: "P001",
        testType: "Lipid Profile",
        appointmentTime: "09:00 AM",
        status: "confirmed",
      })
    } else if (cardNumber === "8923-4567-1234-9876") {
      setSearchResult({
        patientName: "Maria Garcia",
        patientId: "P002",
        testType: "Thyroid Panel",
        appointmentTime: "09:30 AM",
        status: "confirmed",
      })
    } else {
      setSearchResult({ error: "Invalid Card Number or No Appointment Found" })
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
      <div className="text-center max-w-3xl mx-auto">
        <h1 className="font-headline-lg text-headline-lg text-primary mb-4">Patient Reception</h1>
        <div className="bg-surface-container-lowest rounded-xl p-6 flex flex-col md:flex-row gap-4 border border-outline-variant/30 shadow-sm">
          <div className="relative flex-grow">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline">search</span>
            <input
              className="w-full pl-12 pr-4 py-4 bg-surface-container-low border-none rounded-lg focus:ring-2 focus:ring-primary transition-all text-body-md outline-none"
              placeholder="Enter Patient ID or Booking ID"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
            />
          </div>
          <button 
            className="px-10 py-4 bg-primary text-white font-label-md rounded-lg hover:translate-y-[-2px] hover:shadow-lg transition-all flex items-center justify-center gap-2"
            onClick={handleVerifyAndCheckin}
          >
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
            Check In
          </button>
        </div>

        {/* Search Result */}
        {searchResult && (
          <div className={cn(
            "mt-4 p-4 rounded-lg text-left",
            searchResult.error ? "bg-red-50 border border-red-200" : "bg-green-50 border border-green-200"
          )}>
            {searchResult.error ? (
              <div className="flex items-center gap-3 text-red-700">
                <span className="material-symbols-outlined">error</span>
                <p>{searchResult.error}</p>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-primary-container/20 flex items-center justify-center">
                      <span className="material-symbols-outlined text-primary text-[24px]">account_circle</span>
                    </div>
                    <div>
                      <p className="font-semibold">{searchResult.patientName}</p>
                      <p className="text-sm text-secondary">ID: {searchResult.patientId}</p>
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-700">Verified</Badge>
                </div>
                <div className="grid gap-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-secondary">Test</span>
                    <span>{searchResult.testType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-secondary">Appointment Time</span>
                    <span>{searchResult.appointmentTime}</span>
                  </div>
                </div>
                <button 
                  className="w-full py-3 bg-primary text-white font-label-md rounded-lg hover:bg-primary-container transition-all"
                  onClick={confirmCheckin}
                >
                  Confirm Check-in
                </button>
              </div>
            )}
          </div>
        )}

        {/* Success Message */}
        {showSuccess && (
          <div className="fixed bottom-4 right-4 z-50 animate-in slide-in-from-right-5 duration-300">
            <div className="bg-primary text-white rounded-xl p-4 shadow-lg flex items-center gap-3">
              <span className="material-symbols-outlined">check_circle</span>
              <p>Patient checked in successfully! They have been added to the queue.</p>
            </div>
          </div>
        )}
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-8">
        {/* Today's Schedule */}
        <div className="lg:col-span-7">
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 overflow-hidden">
            <div className="px-6 py-4 border-b border-outline-variant/20 flex justify-between items-center">
              <h2 className="font-headline-md text-headline-md text-on-surface">Today's Schedule</h2>
              <span className="px-3 py-1 bg-primary-container/10 text-primary font-label-md rounded-full">42 Booked Today</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-surface-container-low border-b border-outline-variant/10">
                  <tr>
                    <th className="px-6 py-4 font-label-md text-label-md text-secondary">TIME</th>
                    <th className="px-6 py-4 font-label-md text-label-md text-secondary">PATIENT NAME</th>
                    <th className="px-6 py-4 font-label-md text-label-md text-secondary">TEST</th>
                    <th className="px-6 py-4 font-label-md text-label-md text-secondary">STATUS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/10">
                  {todayAppointments.map((apt, index) => (
                    <tr key={index} className="hover:bg-primary-container/5 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-label-md text-primary">{apt.time}</p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container font-bold text-xs">
                            {apt.patient.split(" ").map(n => n[0]).join("")}
                          </div>
                          <p className="font-body-md font-semibold">{apt.patient}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-secondary">{apt.test}</td>
                      <td className="px-6 py-4">
                        <span className={cn(
                          "px-3 py-1 font-label-md rounded-full text-xs",
                          apt.status === "Checked-In" 
                            ? "bg-green-100 text-green-700" 
                            : "bg-orange-100 text-orange-700"
                        )}>
                          {apt.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Current Queue */}
        <div className="lg:col-span-5">
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-6">
            <h2 className="font-headline-md text-headline-md text-on-surface mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">queue</span>
              Current Queue
            </h2>
            <div className="space-y-4">
              {checkedInPatients.map((patient) => (
                <div key={patient.id} className="flex items-center gap-4 p-3 rounded-lg border border-outline-variant/30">
                  <div className="w-10 h-10 rounded-full bg-primary-container/10 flex items-center justify-center font-bold text-primary">
                    {patient.queueNumber}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{patient.patientName}</p>
                    <p className="text-sm text-secondary">{patient.testType}</p>
                  </div>
                  <div className="text-right">
                    <Badge className={cn(
                      patient.status === "in-progress" 
                        ? "bg-purple-100 text-purple-700"
                        : "bg-yellow-100 text-yellow-700"
                    )}>
                      {patient.status === "in-progress" ? "In Progress" : "Waiting"}
                    </Badge>
                    <p className="text-xs text-secondary mt-1">Checked in: {patient.checkInTime}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Reschedule Section */}
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-6 mt-6">
            <h2 className="font-headline-md text-headline-md text-on-surface mb-2">Reschedule Booking</h2>
            <p className="text-body-md text-secondary mb-4">Modify an existing appointment time.</p>
            <div className="space-y-4">
              <div>
                <label className="block font-label-md text-secondary mb-2">Patient ID or Name</label>
                <div className="flex gap-2">
                  <input 
                    className="flex-grow p-3 bg-surface-container-low border-outline-variant border rounded-lg focus:ring-2 focus:ring-primary outline-none"
                    placeholder="e.g., #HL-2039 or Name"
                    type="text"
                  />
                  <button className="px-4 py-3 bg-secondary text-white font-label-md rounded-lg hover:bg-on-background transition-all">
                    Search
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}