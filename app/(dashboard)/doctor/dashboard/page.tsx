// app/doctor/dashboard/page.tsx
"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import Link from "next/link"
import { useAuth } from "@/hooks/useAuth"
import { useAppointments } from "@/hooks/useAppointments"
import { analyticsService } from "@/services/analytics.service"
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

export default function DoctorDashboard() {
  const { user } = useAuth()
  const [searchQuery, setSearchQuery] = useState("")
  const { appointments, isLoading } = useAppointments()
  const [analytics, setAnalytics] = useState<any>(null)
  const [analyticsLoading, setAnalyticsLoading] = useState(true)

  const displayName = user?.full_name || `${user?.first_name || ''} ${user?.last_name || ''}`.trim() || 'Doctor'
  const currentDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })

  const checkedInCount = appointments.filter(a => a.status === "Checked-in").length

  const filteredAppointments = appointments.filter(apt =>
    apt.patientName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    apt.serviceName?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Fetch analytics data
  useEffect(() => {
    const fetchAnalytics = async () => {
      if (typeof window === 'undefined') return
      setAnalyticsLoading(true)
      try {
        const overallStats = await analyticsService.getOverallStats(30)
        setAnalytics(overallStats)
      } catch (error) {
        console.error('Failed to fetch analytics:', error)
      } finally {
        setAnalyticsLoading(false)
      }
    }

    fetchAnalytics()
  }, [])

  // Transform analytics data to stats format
  const stats = analytics ? [
    {
      title: "Total Patients",
      value: analytics.total_appointments?.toString() || "0",
      change: "+0%",
      trend: "up" as const,
      icon: Users,
      color: "bg-teal-50 text-teal-600"
    },
    {
      title: "Completed",
      value: analytics.completed?.toString() || "0",
      change: "+0%",
      trend: "up" as const,
      icon: Stethoscope,
      color: "bg-teal-50 text-teal-600"
    },
    {
      title: "Checked In",
      value: analytics.checked_in?.toString() || "0",
      change: "+0%",
      trend: "up" as const,
      icon: UserCheck,
      color: "bg-teal-50 text-teal-600"
    },
    {
      title: "No-Show Rate",
      value: `${analytics.no_show_rate?.toFixed(1) || 0}%`,
      change: analytics.no_show_rate > 5 ? "-0%" : "-0%",
      trend: analytics.no_show_rate > 5 ? "up" as const : "down" as const,
      icon: UserX,
      color: analytics.no_show_rate > 5 ? "bg-rose-50 text-rose-600" : "bg-teal-50 text-teal-600"
    }
  ] : []

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
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">{displayName}</h2>
            <p className="text-teal-50 text-base">You have {appointments.length} patients scheduled for today</p>
          </div>
          <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <Calendar className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-xs font-semibold text-white/70 uppercase tracking-wide">Today's Date</p>
                <p className="text-lg font-bold text-white">{currentDate}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {analyticsLoading ? (
          <div className="col-span-4 flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
          </div>
        ) : stats.length > 0 ? (
          stats.map((stat) => (
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
                  <span className="text-xs text-gray-500">last 30 days</span>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-4 text-center py-8 text-gray-500">
            No analytics data available
          </div>
        )}
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
          {isLoading ? (
            <div className="text-center py-12 text-gray-500">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600 mx-auto mb-3"></div>
              <p>Loading appointments...</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredAppointments.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <Calendar className="h-12 w-12 mx-auto mb-3 opacity-50 text-teal-600" />
                  <p>No appointments scheduled for today</p>
                </div>
              ) : (
                filteredAppointments.map((apt, index) => (
                  <div
                    key={apt.id}
                    className="group bg-white rounded-xl border border-gray-100 hover:border-teal-200 hover:shadow-md transition-all duration-300 overflow-hidden"
                  >
                    <div className="p-5">
                      <div className="flex flex-col lg:flex-row lg:items-center gap-5">
                        {/* Queue Number */}
                        <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-teal-50 text-teal-600 font-bold text-lg">
                          #{index + 1}
                        </div>

                        {/* Patient Avatar & Info */}
                        <div className="flex items-center gap-4 flex-1">
                          <div className="relative">
                            <Avatar className="h-14 w-14 rounded-xl">
                              <AvatarFallback className={cn(
                                "text-lg font-bold",
                                apt.status === "Checked-in"
                                  ? "bg-teal-100 text-teal-600"
                                  : "bg-gray-100 text-gray-600"
                              )}>
                                {apt.patientImage || apt.patientName?.substring(0, 2).toUpperCase() || 'P'}
                              </AvatarFallback>
                            </Avatar>
                            {apt.status === "Checked-in" && (
                              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h4 className="font-bold text-gray-800 text-lg">{apt.patientName}</h4>
                              <Badge className={cn(
                                "text-xs",
                                apt.status === "Checked-in"
                                  ? "bg-green-100 text-green-700"
                                  : "bg-yellow-100 text-yellow-700"
                              )}>
                                {apt.status === "Checked-in" ? "Checked In" : apt.status}
                              </Badge>
                            </div>
                            <div className="flex flex-wrap items-center gap-3 mt-1 text-sm text-gray-500">
                              <span className="flex items-center gap-1">
                                <Activity className="h-3.5 w-3.5 text-teal-600" />
                                {apt.serviceType || apt.serviceName}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="h-3.5 w-3.5 text-teal-600" />
                                {apt.slotTime || new Date(apt.scheduledDateTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2">
                          {apt.status === "Checked-in" ? (
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
                          {apt.patientPhone && (
                            <span className="flex items-center gap-1">
                              <Phone className="h-3 w-3 text-teal-600" />
                              {apt.patientPhone}
                            </span>
                          )}
                          {apt.location && (
                            <span className="flex items-center gap-1">
                              <CalendarDays className="h-3 w-3 text-teal-600" />
                              {apt.location}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}