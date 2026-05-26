// components/cardNumber/TodaySchedule.tsx
"use client"

import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Calendar } from "lucide-react"

export interface ScheduleAppointment {
  id: string
  time: string
  patientName: string
  patientId: string
  service: string
  status: "booked" | "checked-in" | "in-progress" | "completed"
  cardNumber: string
}

interface TodayScheduleProps {
  appointments: ScheduleAppointment[]
  onCheckIn?: (cardNumber: string) => void
}

export function TodaySchedule({ appointments, onCheckIn }: TodayScheduleProps) {
  const getStatusBadge = (status: ScheduleAppointment["status"]) => {
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

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold flex items-center gap-2">
          <Calendar className="h-4 w-4 text-teal-600" />
          Today's Schedule
        </h3>
        <Badge variant="outline">{appointments.length} appointments</Badge>
      </div>

      <div className="space-y-3">
        {appointments.map((apt) => (
          <div
            key={apt.id}
            className="group flex items-center justify-between p-4 rounded-xl border hover:border-teal-200 hover:shadow-md transition-all"
          >
            <div className="flex items-center gap-4 flex-1">
              <div className="w-14 text-center">
                <p className="text-sm font-bold text-teal-600">{apt.time}</p>
              </div>
              <Avatar className="h-10 w-10 rounded-lg">
                <AvatarFallback className="bg-gray-100 text-gray-600 font-medium">
                  {getInitials(apt.patientName)}
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
              {apt.status === "booked" && onCheckIn && (
                <button
                  onClick={() => onCheckIn(apt.cardNumber)}
                  className="px-3 py-1.5 text-sm font-medium rounded-lg border border-gray-200 hover:border-teal-300 hover:text-teal-600 transition-colors"
                >
                  Check In
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}