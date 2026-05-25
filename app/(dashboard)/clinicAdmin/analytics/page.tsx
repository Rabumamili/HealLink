"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  TrendingUp,
  TrendingDown,
  Users,
  Calendar,
  DollarSign,
  Activity,
  UserCheck,
  UserX,
  Stethoscope,
  ArrowUp,
  ArrowDown,
  Clock,
} from "lucide-react"
import { cn } from "@/lib/utils"

// Mock analytics data
const analyticsData = {
  revenue: {
    total: 284500,
    change: 18.2,
    trend: "up",
    data: [125000, 142000, 168000, 195000, 210000, 245000, 284500],
  },
  appointments: {
    total: 4120,
    change: 8.2,
    trend: "up",
    completed: 3780,
    cancelled: 220,
    noShow: 120,
  },
  patients: {
    total: 2840,
    new: 342,
    returning: 2498,
    change: 15.7,
    trend: "up",
  },
  noShowRate: {
    rate: 4.8,
    change: -2.1,
    trend: "down",
  },
  serviceBreakdown: [
    { name: "General Consultation", count: 1240, percentage: 30, revenue: 1054000 },
    { name: "Pediatric Checkup", count: 980, percentage: 24, revenue: 637000 },
    { name: "Minor Procedure", count: 620, percentage: 15, revenue: 930000 },
    { name: "Vaccination", count: 580, percentage: 14, revenue: 232000 },
    { name: "Other Services", count: 700, percentage: 17, revenue: 385000 },
  ],
  monthlyData: {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
    appointments: [320, 350, 410, 450, 520, 580, 620],
    revenue: [185000, 195000, 225000, 245000, 275000, 310000, 345000],
  },
  peakHours: [
    { hour: "9:00 AM", count: 85 },
    { hour: "10:00 AM", count: 92 },
    { hour: "11:00 AM", count: 78 },
    { hour: "2:00 PM", count: 88 },
    { hour: "3:00 PM", count: 76 },
    { hour: "4:00 PM", count: 65 },
  ],
}

export default function ClinicAnalyticsPage() {
  const [period, setPeriod] = useState("30days")

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-teal-600">Analytics Dashboard</h1>
          <p className="text-muted-foreground">Real-time financial and operational performance overview</p>
        </div>
        <Select value={period} onValueChange={setPeriod}>
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7days">Last 7 Days</SelectItem>
            <SelectItem value="30days">Last 30 Days</SelectItem>
            <SelectItem value="90days">Last 90 Days</SelectItem>
            <SelectItem value="year">This Year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Total Revenue (ETB)</p>
              <div className={cn(
                "flex items-center gap-1 text-sm font-semibold",
                analyticsData.revenue.trend === "up" ? "text-green-600" : "text-red-600"
              )}>
                {analyticsData.revenue.trend === "up" ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
                {analyticsData.revenue.change}%
              </div>
            </div>
            <p className="text-2xl font-bold">{analyticsData.revenue.total.toLocaleString()}</p>
            <div className="mt-4 h-1 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-teal-600 rounded-full" style={{ width: "75%" }} />
            </div>
          </CardContent>
        </Card>

        <Card className="border shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Total Appointments</p>
              <div className={cn(
                "flex items-center gap-1 text-sm font-semibold",
                analyticsData.appointments.trend === "up" ? "text-green-600" : "text-red-600"
              )}>
                {analyticsData.appointments.trend === "up" ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
                {analyticsData.appointments.change}%
              </div>
            </div>
            <p className="text-2xl font-bold">{analyticsData.appointments.total.toLocaleString()}</p>
            <div className="flex gap-2 mt-2 text-xs">
              <span className="text-green-600">Completed: {analyticsData.appointments.completed}</span>
              <span className="text-red-600">Cancelled: {analyticsData.appointments.cancelled}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Unique Patients</p>
              <div className={cn(
                "flex items-center gap-1 text-sm font-semibold",
                analyticsData.patients.trend === "up" ? "text-green-600" : "text-red-600"
              )}>
                {analyticsData.patients.trend === "up" ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
                {analyticsData.patients.change}%
              </div>
            </div>
            <p className="text-2xl font-bold">{analyticsData.patients.total.toLocaleString()}</p>
            <div className="flex gap-2 mt-2 text-xs">
              <span className="text-blue-600">New: +{analyticsData.patients.new}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">No-Show Rate (%)</p>
              <div className={cn(
                "flex items-center gap-1 text-sm font-semibold",
                analyticsData.noShowRate.trend === "down" ? "text-green-600" : "text-red-600"
              )}>
                {analyticsData.noShowRate.trend === "down" ? <ArrowDown className="h-4 w-4" /> : <ArrowUp className="h-4 w-4" />}
                {Math.abs(analyticsData.noShowRate.change)}%
              </div>
            </div>
            <p className="text-2xl font-bold">{analyticsData.noShowRate.rate}%</p>
            <p className="text-xs text-muted-foreground mt-2">Target: Below 5%</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Revenue Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue Trend</CardTitle>
            <CardDescription>Monthly revenue performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-end gap-2">
              {analyticsData.monthlyData.revenue.map((value, index) => (
                <div key={index} className="flex-1 flex flex-col items-center gap-2">
                  <div 
                    className="w-full bg-teal-600 rounded-t-lg transition-all hover:bg-teal-700"
                    style={{ height: `${(value / 350000) * 100}%`, minHeight: "4px" }}
                  />
                  <span className="text-xs text-muted-foreground">{analyticsData.monthlyData.labels[index]}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t">
              <div className="flex justify-between text-sm">
                <span>Total: {analyticsData.revenue.total.toLocaleString()} ETB</span>
                <Badge className="bg-green-100 text-green-700">+{analyticsData.revenue.change}% vs last period</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Service Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Popular Services</CardTitle>
            <CardDescription>Service utilization breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analyticsData.serviceBreakdown.map((service) => (
                <div key={service.name}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">{service.name}</span>
                    <span className="text-sm font-medium">{service.percentage}%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-teal-600 rounded-full"
                      style={{ width: `${service.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Peak Hours */}
      <Card>
        <CardHeader>
          <CardTitle>Peak Hours Analysis</CardTitle>
          <CardDescription>Busiest times for appointment scheduling</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            {analyticsData.peakHours.map((hour) => (
              <div key={hour.hour} className="flex-1 min-w-[100px] text-center">
                <p className="text-sm text-muted-foreground">{hour.hour}</p>
                <p className="text-xl font-bold text-teal-600">{hour.count}</p>
                <div className="mt-1 h-1 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-teal-600 rounded-full"
                    style={{ width: `${(hour.count / 100) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Key Insights */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-green-700">Growth Rate</p>
                <p className="text-lg font-bold text-green-800">+{analyticsData.revenue.change}% Revenue Growth</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <UserCheck className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-blue-700">Patient Retention</p>
                <p className="text-lg font-bold text-blue-800">{(analyticsData.patients.returning / analyticsData.patients.total * 100).toFixed(1)}% Returning</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-purple-50 border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Clock className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-purple-700">Best Time to Book</p>
                <p className="text-lg font-bold text-purple-800">10:00 AM - 11:00 AM</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}