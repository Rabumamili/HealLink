// app/diagnosticCenter/page.tsx (Dashboard)
"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

const dashboardData = {
  stats: [
    { title: "Total Tests", value: "6,244", change: "+12%", icon: "science", color: "bg-primary/10", trend: "up" },
    { title: "Patients Served", value: "4,822", change: "+8%", icon: "groups", color: "bg-primary/10", trend: "up" },
    { title: "Revenue (ETB)", value: "1,248,500", change: "+18%", icon: "payments", color: "bg-primary/10", trend: "up" },
    { title: "Avg. Turnaround", value: "3.4 hrs", change: "-0.5", icon: "timer", color: "bg-primary/10", trend: "down" },
  ],
  recentTests: [
    { id: "T001", patient: "James Wilson", test: "Lipid Profile", date: "2024-05-20", status: "Completed", time: "09:00 AM" },
    { id: "T002", patient: "Maria Garcia", test: "Thyroid Panel", date: "2024-05-20", status: "In Progress", time: "09:30 AM" },
    { id: "T003", patient: "Robert Brown", test: "HbA1c", date: "2024-05-20", status: "Pending", time: "10:00 AM" },
    { id: "T004", patient: "Sarah Miller", test: "CBC", date: "2024-05-20", status: "Pending", time: "10:30 AM" },
  ],
  pendingAlerts: [
    { id: "A001", type: "Critical Result", patient: "David Chen", test: "Lipid Profile", urgency: "High", time: "2 hours ago" },
    { id: "A002", type: "Quality Check", patient: "Elena Rodriguez", test: "Thyroid Panel", urgency: "Medium", time: "3 hours ago" },
    { id: "A003", type: "Equipment Alert", patient: "-", test: "Hematology Analyzer", urgency: "Low", time: "5 hours ago" },
  ],
}

export default function DiagnosticCenterDashboard() {
  const [searchQuery, setSearchQuery] = useState("")

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed": return "bg-green-100 text-green-700"
      case "In Progress": return "bg-blue-100 text-blue-700"
      case "Pending": return "bg-yellow-100 text-yellow-700"
      default: return "bg-gray-100 text-gray-700"
    }
  }

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "High": return "bg-red-100 text-red-700"
      case "Medium": return "bg-yellow-100 text-yellow-700"
      case "Low": return "bg-gray-100 text-gray-700"
      default: return "bg-gray-100 text-gray-700"
    }
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-headline-lg text-headline-lg text-primary">Welcome back, Dr. Chen</h1>
          <p className="text-body-md text-secondary mt-1">Here's what's happening at your diagnostic center today.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl font-label-md hover:bg-primary-container transition-all">
            <span className="material-symbols-outlined text-[18px]">download</span>
            Export Report
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {dashboardData.stats.map((stat) => (
          <Card key={stat.title} className="bg-surface-container-lowest border border-outline-variant/30 shadow-sm hover:shadow-md transition-all">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-label-md text-secondary uppercase tracking-wider mb-1">{stat.title}</p>
                  <p className="font-headline-md text-headline-md font-bold text-primary">{stat.value}</p>
                  <div className="flex items-center gap-1 mt-2">
                    <span className={cn(
                      "text-xs font-semibold",
                      stat.trend === "up" ? "text-green-600" : "text-red-600"
                    )}>
                      {stat.change}
                    </span>
                    <span className="text-xs text-secondary">vs last month</span>
                  </div>
                </div>
                <div className={cn("w-12 h-12 rounded-full flex items-center justify-center", stat.color)}>
                  <span className="material-symbols-outlined text-primary text-[24px]">{stat.icon}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Tests - Left Column */}
        <div className="lg:col-span-2">
          <Card className="bg-surface-container-lowest border border-outline-variant/30">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="font-headline-md text-headline-md text-on-surface">Recent Tests</CardTitle>
                <CardDescription>Today's test queue and status</CardDescription>
              </div>
              <Button variant="outline" className="text-primary">
                View All
                <span className="material-symbols-outlined text-[18px] ml-1">arrow_forward</span>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dashboardData.recentTests.map((test) => (
                  <div key={test.id} className="flex items-center justify-between p-3 rounded-lg border border-outline-variant/30 hover:bg-surface-container-low transition-all">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center">
                        <span className="material-symbols-outlined text-secondary">science</span>
                      </div>
                      <div>
                        <p className="font-body-md font-semibold text-on-surface">{test.patient}</p>
                        <p className="text-sm text-secondary">{test.test}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-secondary">{test.time}</p>
                      <Badge className={cn("mt-1", getStatusColor(test.status))}>
                        {test.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Alerts & Notifications - Right Column */}
        <div className="lg:col-span-1">
          <Card className="bg-surface-container-lowest border border-outline-variant/30">
            <CardHeader>
              <CardTitle className="font-headline-md text-headline-md text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">notifications_active</span>
                Alerts & Notifications
              </CardTitle>
              <CardDescription>Pending actions and system alerts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dashboardData.pendingAlerts.map((alert) => (
                  <div key={alert.id} className="p-3 rounded-lg border border-outline-variant/30 hover:bg-surface-container-low transition-all">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-2">
                        <span className="material-symbols-outlined text-primary text-[18px]">circle_notifications</span>
                        <div>
                          <p className="font-body-md font-semibold text-on-surface">{alert.type}</p>
                          <p className="text-sm text-secondary">{alert.patient} - {alert.test}</p>
                          <p className="text-xs text-secondary mt-1">{alert.time}</p>
                        </div>
                      </div>
                      <Badge className={cn(getUrgencyColor(alert.urgency))}>
                        {alert.urgency}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="bg-surface-container-lowest border border-outline-variant/30 mt-6">
            <CardHeader>
              <CardTitle className="font-headline-md text-headline-md text-on-surface">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start gap-3 bg-primary/10 text-primary hover:bg-primary/20">
                <span className="material-symbols-outlined">add</span>
                New Test Order
              </Button>
              <Button className="w-full justify-start gap-3 bg-secondary/10 text-secondary hover:bg-secondary/20">
                <span className="material-symbols-outlined">schedule</span>
                View Schedule
              </Button>
              <Button className="w-full justify-start gap-3 bg-primary/10 text-primary hover:bg-primary/20">
                <span className="material-symbols-outlined">upload_file</span>
                Upload Results
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}