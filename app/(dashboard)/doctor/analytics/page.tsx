"use client"
import { TopHeader } from "@/components/doctor/top-header"

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
  Activity,
  Stethoscope,
  UserX,
  ArrowUp,
  ArrowDown,
  CalendarDays,
  Clock
} from "lucide-react"
import { cn } from "@/lib/utils"

const stats = [
  { title: "Total Revenue (ETB)", value: "1,284,500", change: "+12.4%", trend: "up", icon: DollarSign, color: "bg-primary/10 text-primary" },
  { title: "Total Appointments", value: "4,120", change: "+8.2%", trend: "up", icon: Calendar, color: "bg-secondary/10 text-secondary" },
  { title: "No-Show Rate", value: "4.8%", change: "-2.1%", trend: "down", icon: UserX, color: "bg-error/10 text-error" },
  { title: "Unique Patients", value: "2,840", change: "+15.7%", trend: "up", icon: Users, color: "bg-primary-container/10 text-primary" },
]

const revenueData = [220, 150, 210, 400, 380, 250, 300, 350, 420, 380, 450, 500]
const appointmentData = [45, 52, 48, 51, 58, 32, 18]
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

const servicePopularity = [
  { name: "General Consultation", percentage: 42, count: 144, revenue: 72000 },
  { name: "Pediatric Screening", percentage: 28, count: 96, revenue: 48000 },
  { name: "Diagnostic Imaging", percentage: 15, count: 52, revenue: 41600 },
  { name: "Cardiology Review", percentage: 10, count: 34, revenue: 25500 },
  { name: "Laboratory Panels", percentage: 5, count: 17, revenue: 8500 },
]

export default function DoctorAnalytics() {
  return (
    <>
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#006767]">Analytics Dashboard</h1>
          <p className="text-muted-foreground">Real-time financial and operational performance overview</p>
        </div>
        <div className="flex gap-3">
          <Select defaultValue="30days">
            <SelectTrigger className="w-[180px] bg-white/80 backdrop-blur-sm border-[#E2E8F0]">
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
          <Button variant="outline" className="bg-white/80 backdrop-blur-sm">
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title} className="bg-white/80 backdrop-blur-sm border-[#E2E8F0] shadow-sm hover:shadow-md transition-all">
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
              <h3 className="text-2xl font-bold text-[#0b1c30]">{stat.value}</h3>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Revenue Trend Chart */}
      <Card className="bg-white/80 backdrop-blur-sm border-[#E2E8F0] shadow-sm">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-[#006767]">Revenue Trend</CardTitle>
              <CardDescription>Monthly revenue performance (in thousands ETB)</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#006767]"></span>
              <span className="text-xs text-muted-foreground">Current Period</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[350px] w-full">
            <svg className="w-full h-full" viewBox="0 0 1000 350" preserveAspectRatio="none">
              {/* Grid lines */}
              {[280, 210, 140, 70].map((y, i) => (
                <g key={i}>
                  <line stroke="#E2E8F0" strokeWidth="1" x1="40" x2="960" y1={y} y2={y} />
                  <text className="fill-muted-foreground text-xs" x="25" y={y + 4}>
                    {[0, 150, 300, 450][i]}
                  </text>
                </g>
              ))}
              
              {/* Area fill */}
              <path 
                d={`M50 280 L${revenueData.map((d, i) => `${50 + (i * 82)} ${280 - (d / 500) * 210}`).join(" L ")} L${50 + (revenueData.length - 1) * 82} 280 Z`}
                fill="#006767"
                fillOpacity="0.1"
              />
              
              {/* Line path */}
              <path 
                d={`M50 280 L${revenueData.map((d, i) => `${50 + (i * 82)} ${280 - (d / 500) * 210}`).join(" L ")}`}
                fill="none"
                stroke="#006767"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              
              {/* Data points */}
              {revenueData.map((d, i) => (
                <circle 
                  key={i} 
                  cx={50 + (i * 82)} 
                  cy={280 - (d / 500) * 210} 
                  r="4" 
                  fill="#006767"
                  className="cursor-pointer hover:r-6 transition-all"
                />
              ))}
            </svg>
          </div>
          <div className="flex justify-between mt-4 text-xs text-muted-foreground">
            {months.map((month, i) => (
              <span key={i}>{month}</span>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Popular Services */}
        <Card className="bg-white/80 backdrop-blur-sm border-[#E2E8F0] shadow-sm">
          <CardHeader>
            <CardTitle className="text-[#006767]">Popular Services</CardTitle>
            <CardDescription>Most requested consultation types</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {servicePopularity.map((service, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="font-medium text-[#0b1c30]">{service.name}</span>
                    <span className="ml-2 text-sm text-muted-foreground">({service.count} appointments)</span>
                  </div>
                  <div className="flex gap-4">
                    <span className="text-sm font-semibold text-[#006767]">{service.percentage}%</span>
                    <span className="text-sm text-muted-foreground">{service.revenue.toLocaleString()} ETB</span>
                  </div>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-[#006767] rounded-full transition-all duration-500"
                    style={{ width: `${service.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Weekly Appointment Volume */}
        <Card className="bg-white/80 backdrop-blur-sm border-[#E2E8F0] shadow-sm">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-[#006767]">Weekly Appointment Volume</CardTitle>
                <CardDescription>Appointments by day of week</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Busiest day: Friday</span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-end gap-4">
              {appointmentData.map((value, i) => (
                <div key={days[i]} className="flex-1 flex flex-col items-center gap-3 group">
                  <div className="relative w-full">
                    <div 
                      className="w-full bg-[#006767] rounded-lg transition-all duration-500 group-hover:bg-[#006767]/80"
                      style={{ height: `${(value / 60) * 250}px`, minHeight: "20px" }}
                    />
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[#0b1c30] text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      {value} appointments
                    </div>
                  </div>
                  <span className="text-xs font-medium text-muted-foreground">{days[i]}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
    </>
  )
}