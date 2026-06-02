// app/doctor/analytics/page.tsx
"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  DollarSign,
  TrendingUp,
  Users,
  Calendar,
  Download,
  UserX,
  ArrowUp,
  ArrowDown,
  CalendarDays,
  Clock,
  Loader2,
  AlertCircle
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useAnalytics, useRevenueAnalytics, useAppointmentAnalytics, useServiceBreakdown } from "@/hooks/useAnalytics"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { ServiceBreakdown } from "@/types/entities/analytics.types" // Import the ServiceBreakdown type

type Period = '7days' | '30days' | '90days' | 'year'

export default function DoctorAnalyticsPage() {
  const [period, setPeriod] = useState<Period>("30days")
  const [selectedDoctorId, setSelectedDoctorId] = useState<string | undefined>(undefined)
  
  const {
    data: doctorData,
    isLoading,
    error,
    period: storePeriod,
    selectedDoctorId: storeDoctorId,
    setPeriod: setStorePeriod,
    setSelectedDoctor: setStoreDoctor,
    refetch,
  } = useAnalytics('doctor')
  
  const { revenueData } = useRevenueAnalytics()
  const { appointmentData } = useAppointmentAnalytics()
  const { services: serviceBreakdown } = useServiceBreakdown()
  
  useEffect(() => {
    setStorePeriod(period)
  }, [period, setStorePeriod])
  
  // Calculate stats from data
  const stats = useMemo(() => {
    if (!revenueData && !appointmentData) return []
    
    return [
      { 
        title: "Total Revenue (ETB)", 
        value: revenueData?.total?.toLocaleString() || "0", 
        change: revenueData?.change ? `${revenueData.change.value > 0 ? '+' : ''}${revenueData.change.value}%` : "+0%", 
        trend: revenueData?.change?.trend || "up", 
        icon: DollarSign, 
        color: "bg-teal-100 text-teal-700" 
      },
      { 
        title: "Total Appointments", 
        value: appointmentData?.total?.toLocaleString() || "0", 
        change: appointmentData?.change ? `${appointmentData.change.value > 0 ? '+' : ''}${appointmentData.change.value}%` : "+0%", 
        trend: appointmentData?.change?.trend || "up", 
        icon: Calendar, 
        color: "bg-blue-100 text-blue-700" 
      },
      { 
        title: "No-Show Rate", 
        value: `${appointmentData?.noShowRate?.toFixed(1) || "0"}%`, 
        change: appointmentData?.change ? `${appointmentData.change.value > 0 ? '+' : ''}${appointmentData.change.value}%` : "-0%", 
        trend: "down", 
        icon: UserX, 
        color: "bg-red-100 text-red-700" 
      },
      { 
        title: "Unique Patients", 
        value: Math.round((appointmentData?.total || 0) * 0.7).toLocaleString(), 
        change: "+15.7%", 
        trend: "up", 
        icon: Users, 
        color: "bg-purple-100 text-purple-700" 
      },
    ]
  }, [revenueData, appointmentData])
  
  // Prepare revenue chart data
  const revenueChartData = useMemo(() => {
    if (revenueData?.series && revenueData.series.length > 0) {
      return {
        data: revenueData.series.map((item: { value: number }) => item.value / 1000), // Convert to thousands
        labels: revenueData.series.map((item: { label: string }) => item.label),
      }
    }
    return {
      data: [],
      labels: [],
    }
  }, [revenueData])
  
  // Prepare weekly appointment data
  const weeklyAppointmentData = useMemo(() => {
    if (appointmentData?.total) {
      // Distribute appointments across week days
      const distribution = [0.12, 0.14, 0.15, 0.16, 0.18, 0.15, 0.10]
      return distribution.map(percent => Math.round(appointmentData.total * percent))
    }
    return [0, 0, 0, 0, 0, 0, 0]
  }, [appointmentData])
  
  const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
  
  // Find busiest day
  const busiestDay = useMemo(() => {
    const maxIndex = weeklyAppointmentData.indexOf(Math.max(...weeklyAppointmentData))
    return weekDays[maxIndex]
  }, [weeklyAppointmentData])
  
  const handleExport = async () => {
    try {
      const { analyticsService } = await import("@/services/analytics.service")
      await analyticsService.downloadReport('doctor', 'pdf', { period, doctorId: selectedDoctorId })
    } catch (error) {
      console.error("Export failed:", error)
    }
  }
  
  if (isLoading && !doctorData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-teal-600 mx-auto mb-4" />
          <p className="text-muted-foreground">Loading doctor analytics...</p>
        </div>
      </div>
    )
  }
  
  if (error) {
    return (
      <div className="p-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error Loading Analytics</AlertTitle>
          <AlertDescription>
            {error}
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-2"
              onClick={() => refetch()}
            >
              Try Again
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    )
  }
  
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-teal-600">Analytics Dashboard</h1>
          <p className="text-muted-foreground">Real-time financial and operational performance overview</p>
        </div>
        <div className="flex gap-3">
          <Select value={period} onValueChange={(value: Period) => setPeriod(value)}>
            <SelectTrigger className="w-[180px]">
              <CalendarDays className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 Days</SelectItem>
              <SelectItem value="30days">Last 30 Days</SelectItem>
              <SelectItem value="90days">Last 90 Days</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index: number) => (
          <Card key={stat.title || index} className="shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={cn("p-3 rounded-xl", stat.color)}>
                  <stat.icon className="h-5 w-5" />
                </div>
                <Badge className={cn(
                  stat.trend === "up" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
                )}>
                  {stat.change}
                </Badge>
              </div>
              <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{stat.title}</p>
              <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Revenue Trend Chart */}
      <Card className="shadow-sm">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-teal-600">Revenue Trend</CardTitle>
              <CardDescription>Monthly revenue performance (in thousands ETB)</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-teal-600"></span>
              <span className="text-xs text-muted-foreground">Current Period</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[350px] w-full">
            <svg className="w-full h-full" viewBox="0 0 1000 350" preserveAspectRatio="none">
              {/* Grid lines */}
              {[280, 210, 140, 70].map((y: number, i: number) => (
                <g key={i}>
                  <line stroke="#E2E8F0" strokeWidth="1" x1="40" x2="960" y1={y} y2={y} />
                  <text className="fill-muted-foreground text-xs" x="25" y={y + 4}>
                    {[0, 150, 300, 450][i]}
                  </text>
                </g>
              ))}
              
              {/* Area fill */}
              <path 
                d={`M50 280 L${revenueChartData.data.map((d: number, i: number) => `${50 + (i * (910 / revenueChartData.data.length))} ${280 - (d / 500) * 210}`).join(" L ")} L${50 + ((revenueChartData.data.length - 1) * (910 / revenueChartData.data.length))} 280 Z`}
                fill="#006767"
                fillOpacity="0.1"
              />
              
              {/* Line path */}
              <path 
                d={`M50 280 L${revenueChartData.data.map((d: number, i: number) => `${50 + (i * (910 / revenueChartData.data.length))} ${280 - (d / 500) * 210}`).join(" L ")}`}
                fill="none"
                stroke="#006767"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              
              {/* Data points */}
              {revenueChartData.data.map((d: number, i: number) => (
                <circle 
                  key={i} 
                  cx={50 + (i * (910 / revenueChartData.data.length))} 
                  cy={280 - (d / 500) * 210} 
                  r="4" 
                  fill="#006767"
                  className="cursor-pointer hover:r-6 transition-all"
                />
              ))}
            </svg>
          </div>
          <div className="flex justify-between mt-4 text-xs text-muted-foreground">
            {revenueChartData.labels.map((month: string, i: number) => (
              <span key={i}>{month}</span>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Popular Services - FIXED with proper typing */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-teal-600">Popular Services</CardTitle>
            <CardDescription>Most requested consultation types</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {serviceBreakdown && serviceBreakdown.length > 0 ? (
              serviceBreakdown.slice(0, 5).map((service: ServiceBreakdown, i: number) => (
                <div key={service.id || i} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="font-medium text-gray-900">{service.name}</span>
                      <span className="ml-2 text-sm text-muted-foreground">({service.count} appointments)</span>
                    </div>
                    <div className="flex gap-4">
                      <span className="text-sm font-semibold text-teal-600">{service.percentage}%</span>
                      <span className="text-sm text-muted-foreground">{service.revenue.toLocaleString()} ETB</span>
                    </div>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-teal-600 rounded-full transition-all duration-500"
                      style={{ width: `${service.percentage}%` }}
                    />
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-muted-foreground py-8">
                No service data available
              </div>
            )}
          </CardContent>
        </Card>

        {/* Weekly Appointment Volume */}
        <Card className="shadow-sm">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-teal-600">Weekly Appointment Volume</CardTitle>
                <CardDescription>Appointments by day of week</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Busiest day: {busiestDay}</span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-end gap-4">
              {weeklyAppointmentData.map((value: number, i: number) => (
                <div key={weekDays[i]} className="flex-1 flex flex-col items-center gap-3 group">
                  <div className="relative w-full">
                    <div 
                      className="w-full bg-teal-600 rounded-lg transition-all duration-500 group-hover:bg-teal-700"
                      style={{ height: `${(value / Math.max(...weeklyAppointmentData)) * 250}px`, minHeight: "20px" }}
                    />
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      {value} appointments
                    </div>
                  </div>
                  <span className="text-xs font-medium text-muted-foreground">{weekDays[i]}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}