// app/diagnosticCenter/analytics/page.tsx
"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { useAnalytics, useRevenueAnalytics, useServiceBreakdown, useMonthlyTrends } from "@/hooks/useAnalytics"
import { ServiceBreakdown } from "@/types/entities/analytics.types"
import { Loader2, AlertCircle, TrendingUp, ArrowUp, ArrowDown } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

type Period = '7days' | '30days' | '90days' | 'year'

// Define the test type interface
interface PopularTest {
  name: string;
  revenue: number;
  percentage: number;
}

export default function DiagnosticAnalyticsPage() {
  const [period, setPeriod] = useState<Period>("30days")
  
  const {
    data: diagnosticData,
    isLoading,
    error,
    setPeriod: setStorePeriod,
    refetch,
  } = useAnalytics('diagnostic')
  
  const { revenueData } = useRevenueAnalytics()
  const { services: serviceBreakdown } = useServiceBreakdown()
  const { monthlyData } = useMonthlyTrends()
  
  useEffect(() => {
    setStorePeriod(period)
  }, [period, setStorePeriod])
  
  // Calculate test metrics
  const testMetrics = useMemo(() => {
    if (!diagnosticData?.appointments) return null
    
    const total = diagnosticData.appointments.total
    const completed = diagnosticData.appointments.completed
    const pending = diagnosticData.appointments.cancelled
    const inProgress = diagnosticData.appointments.noShowCount
    
    return {
      total,
      completed,
      pending,
      inProgress,
      completionRate: total > 0 ? (completed / total) * 100 : 0,
      pendingRate: total > 0 ? (pending / total) * 100 : 0,
      inProgressRate: total > 0 ? (inProgress / total) * 100 : 0,
    }
  }, [diagnosticData])
  
  // Calculate turnaround time (mock calculation - in real app, this comes from API)
  const turnaroundTime = useMemo(() => {
    if (!diagnosticData?.appointments) return 0
    // Mock calculation - average of 3-5 hours
    return (3.4).toFixed(1)
  }, [diagnosticData])
  
  // Prepare weekly revenue data
  const weeklyRevenueData = useMemo(() => {
    if (revenueData?.series && revenueData.series.length >= 4) {
      return {
        data: revenueData.series.slice(-4).map(item => item.value),
        labels: revenueData.series.slice(-4).map(item => item.label),
      }
    }
    return {
      data: [185000, 195000, 225000, 245000],
      labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
    }
  }, [revenueData])
  
  // Get popular tests from service breakdown with proper typing
  const popularTests = useMemo((): PopularTest[] => {
    if (serviceBreakdown && serviceBreakdown.length > 0) {
      return serviceBreakdown.slice(0, 4).map((service: ServiceBreakdown) => ({
        name: service.name,
        revenue: service.revenue,
        percentage: service.percentage,
      }))
    }
    return []
  }, [serviceBreakdown])
  
  if (isLoading && !diagnosticData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-teal-600 mx-auto mb-4" />
          <p className="text-muted-foreground">Loading diagnostic analytics...</p>
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-teal-600">Diagnostic Center Analytics</h1>
          <p className="text-muted-foreground">Real-time financial and operational performance overview</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => refetch()}
            disabled={isLoading}
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            Refresh
          </Button>
          <Select value={period} onValueChange={(value: Period) => setPeriod(value)}>
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
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <Card className="border shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground uppercase tracking-wider">Total Revenue</p>
              {revenueData?.change && (
                <div className={cn(
                  "flex items-center gap-1 text-sm font-semibold",
                  revenueData.change.trend === "up" ? "text-green-600" : "text-red-600"
                )}>
                  {revenueData.change.trend === "up" ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
                  {Math.abs(revenueData.change.value)}%
                </div>
              )}
            </div>
            <p className="text-2xl font-bold text-teal-600">
              {revenueData?.total?.toLocaleString() || "0"} ETB
            </p>
          </CardContent>
        </Card>

        <Card className="border shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground uppercase tracking-wider">Tests Completed</p>
            </div>
            <p className="text-2xl font-bold text-teal-600">
              {testMetrics?.completed?.toLocaleString() || "0"}
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              {testMetrics?.completionRate?.toFixed(1)}% of total
            </p>
          </CardContent>
        </Card>

        <Card className="border shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground uppercase tracking-wider">Avg. Turnaround Time</p>
            </div>
            <p className="text-2xl font-bold text-teal-600">{turnaroundTime} hours</p>
          </CardContent>
        </Card>

        <Card className="border shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground uppercase tracking-wider">Pending Tests</p>
            </div>
            <p className="text-2xl font-bold text-teal-600">
              {testMetrics?.pending?.toLocaleString() || "0"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Chart and Popular Tests */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 border rounded-xl p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <h3 className="font-semibold text-lg mb-2">Revenue per Week</h3>
              <div className="flex items-center gap-4">
                <span className="text-2xl font-bold text-teal-600">
                  {revenueData?.total?.toLocaleString() || "0"} ETB
                </span>
                {revenueData?.change && (
                  <div className={cn(
                    "flex items-center gap-1 text-sm font-semibold",
                    revenueData.change.trend === "up" ? "text-green-600" : "text-red-600"
                  )}>
                    {revenueData.change.trend === "up" ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
                    {Math.abs(revenueData.change.value)}% VS Last Month
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="relative w-full h-[280px]">
            <div className="h-full">
              <div className="flex items-end gap-4 h-full">
                {weeklyRevenueData.data.map((value: number, index: number) => (
                  <div key={index} className="flex-1 flex flex-col items-center gap-2">
                    <div 
                      className="w-full bg-teal-600 rounded-t-lg transition-all hover:bg-teal-700"
                      style={{ 
                        height: `${(value / Math.max(...weeklyRevenueData.data)) * 100}%`, 
                        minHeight: "4px" 
                      }}
                    />
                    <span className="text-xs text-muted-foreground">
                      {weeklyRevenueData.labels[index]}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Tests by Status */}
        <div className="border rounded-xl p-6">
          <h3 className="font-semibold text-lg mb-4">Tests by Status</h3>
          {testMetrics && (
            <div className="flex flex-col items-center gap-6">
              <div className="relative w-40 h-40">
                <svg className="w-full h-full" viewBox="0 0 36 36">
                  <circle cx="18" cy="18" fill="transparent" r="15.915" stroke="#e5eeff" strokeWidth="4" />
                  <circle 
                    cx="18" cy="18" fill="transparent" r="15.915" 
                    stroke="#006767" 
                    strokeDasharray={`${testMetrics.completionRate} ${100 - testMetrics.completionRate}`} 
                    strokeDashoffset="0" 
                    strokeWidth="4" 
                  />
                  <circle 
                    cx="18" cy="18" fill="transparent" r="15.915" 
                    stroke="#515f78" 
                    strokeDasharray={`${testMetrics.inProgressRate} ${100 - testMetrics.inProgressRate}`} 
                    strokeDashoffset={-testMetrics.completionRate} 
                    strokeWidth="4" 
                  />
                  <circle 
                    cx="18" cy="18" fill="transparent" r="15.915" 
                    stroke="#bcc9c8" 
                    strokeDasharray={`${testMetrics.pendingRate} ${100 - testMetrics.pendingRate}`} 
                    strokeDashoffset={-(testMetrics.completionRate + testMetrics.inProgressRate)} 
                    strokeWidth="4" 
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-bold text-teal-600">{testMetrics.total}</span>
                  <span className="text-xs text-muted-foreground">Total</span>
                </div>
              </div>
              <div className="flex flex-col gap-3 w-full">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-teal-600"></div>
                  <span className="text-sm">Completed</span>
                  <span className="text-sm font-bold text-muted-foreground ml-auto">
                    {testMetrics.completionRate.toFixed(0)}%
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-gray-500"></div>
                  <span className="text-sm">In-Progress</span>
                  <span className="text-sm font-bold text-muted-foreground ml-auto">
                    {testMetrics.inProgressRate.toFixed(0)}%
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-gray-300"></div>
                  <span className="text-sm">Pending</span>
                  <span className="text-sm font-bold text-muted-foreground ml-auto">
                    {testMetrics.pendingRate.toFixed(0)}%
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Popular Tests - Fixed with proper typing */}
      <div className="border rounded-xl p-6">
        <h3 className="font-semibold text-lg mb-6">Popular Tests</h3>
        {popularTests.length > 0 ? (
          <div className="space-y-5">
            {popularTests.map((test: PopularTest, index: number) => (
              <div key={index}>
                <div className="flex justify-between mb-2">
                  <span className="font-medium">{test.name}</span>
                  <span className="text-sm text-teal-600">{test.revenue.toLocaleString()} ETB</span>
                </div>
                <div className="h-2.5 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-teal-600 rounded-full" 
                    style={{ width: `${test.percentage}%` }} 
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-muted-foreground py-8">
            No test data available
          </div>
        )}
      </div>

      {/* Key Insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <TrendingUp className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-green-700">Growth Rate</p>
              <p className="text-lg font-bold text-green-800">
                +{Math.abs(revenueData?.change?.value || 0)}% Revenue Growth
              </p>
            </div>
          </div>
        </div>

        <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <TrendingUp className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-blue-700">Avg. Turnaround</p>
              <p className="text-lg font-bold text-blue-800">{turnaroundTime} hours</p>
            </div>
          </div>
        </div>

        <div className="p-4 bg-purple-50 border border-purple-200 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <TrendingUp className="h-5 w-5 text-purple-600" />
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