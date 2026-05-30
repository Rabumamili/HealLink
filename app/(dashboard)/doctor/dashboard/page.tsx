// app/doctor/dashboard/page.tsx
"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import Link from "next/link"
import { 
  Calendar,
  Clock,
  Users,
  DollarSign,
  UserCheck,
  UserX,
  Stethoscope,
  Verified,
  ArrowRight,
  TrendingUp,
  TrendingDown,
  Sparkles,
  Activity,
  Heart,
  Phone,
  Clipboard,
  CalendarDays,
  Search
} from "lucide-react"
import { cn } from "@/lib/utils"

// Ordered appointment data - NO card numbers or patient IDs
const todayAppointments = [
  {
    id: "1",
    patientName: "Abebe Kebede",
    time: "09:00 AM",
    type: "Consultation",
    status: "checked-in",
    queueNumber: 1,
    avatar: "AK",
    age: 45,
    condition: "Hypertension",
    lastVisit: "Oct 15, 2024",
    phone: "+251 911 223 344"
  },
  {
    id: "2",
    patientName: "Tigist Haile",
    time: "09:30 AM",
    type: "Follow-up",
    status: "scheduled",
    queueNumber: 2,
    avatar: "TH",
    age: 32,
    condition: "Diabetes Type 2",
    lastVisit: "Oct 10, 2024",
    phone: "+251 922 556 677"
  },
  {
    id: "3",
    patientName: "Mekdes Alemu",
    time: "10:00 AM",
    type: "Consultation",
    status: "scheduled",
    queueNumber: 3,
    avatar: "MA",
    age: 28,
    condition: "Respiratory Issue",
    lastVisit: "Oct 5, 2024",
    phone: "+251 933 889 900"
  },
  {
    id: "4",
    patientName: "Yonas Desta",
    time: "10:30 AM",
    type: "Review",
    status: "scheduled",
    queueNumber: 4,
    avatar: "YD",
    age: 52,
    condition: "Arthritis",
    lastVisit: "Sep 28, 2024",
    phone: "+251 944 112 233"
  },
  {
    id: "5",
    patientName: "Helen Tsegaye",
    time: "11:00 AM",
    type: "Consultation",
    status: "scheduled",
    queueNumber: 5,
    avatar: "HT",
    age: 38,
    condition: "Migraine",
    lastVisit: "Oct 12, 2024",
    phone: "+251 955 667 788"
  }
]

const stats = [
  {
    title: "Total Patients",
    value: "1,284",
    change: "+12.4%",
    trend: "up",
    icon: Users,
    color: "bg-teal-50 text-teal-600"
  },
  {
    title: "Total Revenue",
    value: "284,500 ETB",
    change: "+18.2%",
    trend: "up",
    icon: DollarSign,
    color: "bg-teal-50 text-teal-600"
  },
  {
    title: "Consultations",
    value: "342",
    change: "+8.2%",
    trend: "up",
    icon: Stethoscope,
    color: "bg-teal-50 text-teal-600"
  },
  {
    title: "No-Show Rate",
    value: "4.8%",
    change: "-2.1%",
    trend: "down",
    icon: UserX,
    color: "bg-teal-50 text-teal-600"
  }
]

export default function DoctorDashboard() {
  const [searchQuery, setSearchQuery] = useState("")
  const checkedInCount = todayAppointments.filter(a => a.status === "checked-in").length
  
  const filteredAppointments = todayAppointments.filter(apt =>
    apt.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    apt.condition.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-teal-600 to-teal-700 p-6 md:p-8 shadow-lg">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full blur-2xl -ml-24 -mb-24"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-5 w-5 text-white/80" />
              <span className="text-white/80 text-sm font-medium">Welcome back</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Dr. Abebe Bekele</h2>
            <p className="text-teal-50 text-base">You have {todayAppointments.length} patients scheduled for today</p>
          </div>
          <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <Calendar className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-xs font-semibold text-white/70 uppercase tracking-wide">Today's Date</p>
                <p className="text-lg font-bold text-white">October 24, 2024</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="border shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">{stat.title}</p>
                  <p className="text-2xl md:text-3xl font-bold text-gray-800 mt-1">{stat.value}</p>
                </div>
                <div className={cn("h-12 w-12 rounded-xl flex items-center justify-center", stat.color)}>
                  <stat.icon className="h-6 w-6" />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className={cn(
                  "text-xs font-semibold",
                  stat.trend === "up" ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"
                )}>
                  {stat.change}
                  {stat.trend === "up" ? 
                    <TrendingUp className="ml-1 h-3 w-3" /> : 
                    <TrendingDown className="ml-1 h-3 w-3" />
                  }
                </Badge>
                <span className="text-xs text-gray-500">vs last month</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Check-in Card */}
      <Card className="border shadow-sm overflow-hidden relative">
        <div className="absolute top-0 right-0 w-32 h-32 bg-teal-50 rounded-full blur-2xl -mr-16 -mt-16"></div>
        <CardContent className="pt-6 pb-6 relative z-10">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input 
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all text-base"
                  placeholder="Search patient by name..."
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <Button className="bg-teal-600 hover:bg-teal-700 rounded-xl px-8 py-2.5 shadow-sm hover:shadow transition-all">
              <UserCheck className="mr-2 h-4 w-4" />
              Check-in Patient
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Today's Appointments Section */}
      <Card className="border shadow-sm overflow-hidden">
        <div className="bg-gray-50/50 px-6 py-4 border-b">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold text-gray-800">Today's Appointments</h3>
              <p className="text-sm text-gray-500 mt-1">Your schedule for today</p>
            </div>
            <div className="flex items-center gap-3">
              <Badge className="bg-teal-100 text-teal-700 px-3 py-1 text-sm">
                <UserCheck className="mr-1 h-3 w-3" />
                {checkedInCount} Checked In
              </Badge>
              <Button variant="outline" size="sm" asChild className="rounded-lg border-teal-200 hover:bg-teal-50">
                <Link href="/doctor/appointments">
                  View All
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
        
        <CardContent className="p-6">
          <div className="space-y-4">
            {filteredAppointments.map((apt, index) => (
              <div
                key={apt.id}
                className="group bg-white rounded-xl border border-gray-100 hover:border-teal-200 hover:shadow-md transition-all duration-300 overflow-hidden"
              >
                <div className="p-5">
                  <div className="flex flex-col lg:flex-row lg:items-center gap-5">
                    {/* Queue Number */}
                    <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-teal-50 text-teal-600 font-bold text-lg">
                      #{apt.queueNumber}
                    </div>
                    
                    {/* Patient Avatar & Info */}
                    <div className="flex items-center gap-4 flex-1">
                      <div className="relative">
                        <Avatar className="h-14 w-14 rounded-xl">
                          <AvatarFallback className={cn(
                            "text-lg font-bold",
                            apt.status === "checked-in" 
                              ? "bg-teal-100 text-teal-600"
                              : "bg-gray-100 text-gray-600"
                          )}>
                            {apt.avatar}
                          </AvatarFallback>
                        </Avatar>
                        {apt.status === "checked-in" && (
                          <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                        )}
                      </div>
                      
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-bold text-gray-800 text-lg">{apt.patientName}</h4>
                          <Badge className={cn(
                            "text-xs",
                            apt.status === "checked-in" 
                              ? "bg-green-100 text-green-700"
                              : "bg-yellow-100 text-yellow-700"
                          )}>
                            {apt.status === "checked-in" ? "Checked In" : "Scheduled"}
                          </Badge>
                        </div>
                        <div className="flex flex-wrap items-center gap-3 mt-1 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Activity className="h-3.5 w-3.5 text-teal-600" />
                            {apt.type}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5 text-teal-600" />
                            {apt.time}
                          </span>
                          <span className="flex items-center gap-1">
                            <Heart className="h-3.5 w-3.5 text-teal-600" />
                            {apt.condition}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="h-3.5 w-3.5 text-teal-600" />
                            Age: {apt.age}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      {apt.status === "checked-in" ? (
                        <Button className="bg-teal-600 hover:bg-teal-700 rounded-lg px-6 shadow-sm hover:shadow transition-all">
                          <Stethoscope className="mr-2 h-4 w-4" />
                          Start Consultation
                        </Button>
                      ) : (
                        <>
                          <Button variant="outline" size="sm" className="rounded-lg border-gray-200 hover:border-teal-200">
                            <Calendar className="mr-2 h-4 w-4" />
                            Reschedule
                          </Button>
                          <Button variant="outline" size="sm" className="rounded-lg border-teal-200 text-teal-600 hover:bg-teal-50">
                            View Details
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                  
                  {/* Additional Patient Info - Visible on hover */}
                  <div className="mt-3 pt-3 border-t border-gray-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Clipboard className="h-3 w-3 text-teal-600" />
                        Last Visit: {apt.lastVisit}
                      </span>
                      <span className="flex items-center gap-1">
                        <Phone className="h-3 w-3 text-teal-600" />
                        {apt.phone}
                      </span>
                      <span className="flex items-center gap-1">
                        <CalendarDays className="h-3 w-3 text-teal-600" />
                        Follow-up in 2 weeks
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}