// app/diagnosticCenter/analytics/page.tsx
"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

const analyticsData = {
  revenue: {
    total: 1248500,
    change: 12,
    trend: "up",
    weeklyData: [185000, 195000, 225000, 245000, 275000, 310000, 345000],
  },
  tests: {
    completed: 4822,
    pending: 579,
    inProgress: 843,
    total: 6244,
  },
  turnaroundTime: 3.4,
  popularTests: [
    { name: "Lipid Profile", revenue: 312000, percentage: 90 },
    { name: "Thyroid Panel", revenue: 245000, percentage: 75 },
    { name: "Diabetes HbA1c", revenue: 198000, percentage: 60 },
    { name: "CBC (Full Count)", revenue: 156000, percentage: 45 },
  ],
  weeklyLabels: ["Week 1", "Week 2", "Week 3", "Week 4"],
}

export default function AnalyticsPage() {
  const [period, setPeriod] = useState("30days")

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="font-headline-lg text-headline-lg text-primary">Diagnostic Center Analytics</h1>
          <p className="text-body-md text-secondary">Real-time financial and operational performance overview</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-surface-container border border-outline-variant/30 rounded-xl text-primary font-label-md hover:bg-surface-container-high transition-all">
            <span className="material-symbols-outlined text-[18px]">calendar_today</span>
            Last 30 Days
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <Card className="bg-surface-container-lowest border border-outline-variant/30 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary-container/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-primary text-[24px]">payments</span>
              </div>
              <div>
                <p className="text-label-md text-secondary uppercase tracking-wider mb-1">Total Revenue</p>
                <p className="font-headline-md text-headline-md font-bold text-primary">{analyticsData.revenue.total.toLocaleString()} ETB</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-surface-container-lowest border border-outline-variant/30 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary-container/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-primary text-[24px]">check_circle</span>
              </div>
              <div>
                <p className="text-label-md text-secondary uppercase tracking-wider mb-1">Tests Completed</p>
                <p className="font-headline-md text-headline-md font-bold text-primary">{analyticsData.tests.completed.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-surface-container-lowest border border-outline-variant/30 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary-container/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-primary text-[24px]">timer</span>
              </div>
              <div>
                <p className="text-label-md text-secondary uppercase tracking-wider mb-1">Avg. Turnaround Time</p>
                <p className="font-headline-md text-headline-md font-bold text-primary">{analyticsData.turnaroundTime} hours</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-surface-container-lowest border border-outline-variant/30 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary-container/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-primary text-[24px]">pending_actions</span>
              </div>
              <div>
                <p className="text-label-md text-secondary uppercase tracking-wider mb-1">Pending Tests</p>
                <p className="font-headline-md text-headline-md font-bold text-primary">{analyticsData.tests.pending}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chart and Popular Tests */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <div className="flex items-center gap-2 text-on-surface-variant mb-2">
                <span className="material-symbols-outlined text-[20px]">bar_chart</span>
                <h3 className="font-label-md text-label-md">Revenue per Week</h3>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-[32px] font-bold text-primary">{analyticsData.revenue.total.toLocaleString()} ETB</span>
                <div className="flex items-center gap-1 text-green-600 font-semibold">
                  <span className="material-symbols-outlined text-[18px]">arrow_upward</span>
                  <span className="text-label-md">{analyticsData.revenue.change}% VS Last Month</span>
                </div>
              </div>
            </div>
          </div>
          <div className="relative w-full h-[280px]">
            <div className="ml-10 h-full">
              <div className="flex items-end gap-4 h-full">
                {analyticsData.revenue.weeklyData.map((value, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center gap-2">
                    <div 
                      className="w-full bg-primary rounded-t-lg transition-all hover:bg-primary/80"
                      style={{ height: `${(value / 350000) * 100}%`, minHeight: "4px" }}
                    />
                    <span className="text-xs text-secondary">{analyticsData.weeklyLabels[index]}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Tests by Status Donut */}
        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-6">
          <h3 className="font-headline-md text-headline-md text-primary mb-4">Tests by Status</h3>
          <div className="flex flex-col items-center gap-6">
            <div className="relative w-40 h-40">
              <svg className="w-full h-full" viewBox="0 0 36 36">
                <circle cx="18" cy="18" fill="transparent" r="15.915" stroke="#e5eeff" strokeWidth="4" />
                <circle cx="18" cy="18" fill="transparent" r="15.915" stroke="#006767" strokeDasharray="77 23" strokeDashoffset="23" strokeWidth="4" />
                <circle cx="18" cy="18" fill="transparent" r="15.915" stroke="#515f78" strokeDasharray="14 86" strokeDashoffset="50" strokeWidth="4" />
                <circle cx="18" cy="18" fill="transparent" r="15.915" stroke="#bcc9c8" strokeDasharray="9 91" strokeDashoffset="60" strokeWidth="4" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-headline-md text-headline-md text-primary">{analyticsData.tests.total}</span>
                <span className="text-label-md text-secondary">Total</span>
              </div>
            </div>
            <div className="flex flex-col gap-3 w-full">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-primary"></div>
                <span className="text-body-md">Completed</span>
                <span className="text-label-md font-bold text-secondary ml-auto">77%</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-secondary"></div>
                <span className="text-body-md">In-Progress</span>
                <span className="text-label-md font-bold text-secondary ml-auto">14%</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-outline-variant"></div>
                <span className="text-body-md">Pending</span>
                <span className="text-label-md font-bold text-secondary ml-auto">9%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Popular Tests */}
      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-6">
        <h3 className="font-headline-md text-headline-md text-primary mb-6">Popular Tests</h3>
        <div className="space-y-5">
          {analyticsData.popularTests.map((test) => (
            <div key={test.name}>
              <div className="flex justify-between mb-2">
                <span className="text-body-md font-semibold">{test.name}</span>
                <span className="text-label-md text-primary">{test.revenue.toLocaleString()} ETB</span>
              </div>
              <div className="h-2.5 w-full bg-surface-container rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full" style={{ width: `${test.percentage}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Key Insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <span className="material-symbols-outlined text-green-600">trending_up</span>
            </div>
            <div>
              <p className="text-sm text-green-700">Growth Rate</p>
              <p className="text-lg font-bold text-green-800">+{analyticsData.revenue.change}% Revenue Growth</p>
            </div>
          </div>
        </div>

        <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <span className="material-symbols-outlined text-blue-600">schedule</span>
            </div>
            <div>
              <p className="text-sm text-blue-700">Avg. Turnaround</p>
              <p className="text-lg font-bold text-blue-800">{analyticsData.turnaroundTime} hours</p>
            </div>
          </div>
        </div>

        <div className="p-4 bg-purple-50 border border-purple-200 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <span className="material-symbols-outlined text-purple-600">schedule</span>
            </div>
            <div>
              <p className="text-sm text-purple-700">Best Time to Schedule</p>
              <p className="text-lg font-bold text-purple-800">10:00 AM - 11:00 AM</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}