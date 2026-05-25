// types/analytics.ts
export interface RevenueData {
  total: number
  change: number
  trend: "up" | "down"
  data: number[]
}

export interface AppointmentAnalytics {
  total: number
  change: number
  trend: "up" | "down"
  completed: number
  cancelled: number
  noShow: number
}

export interface PatientAnalytics {
  total: number
  new: number
  returning: number
  change: number
  trend: "up" | "down"
}

export interface ServiceBreakdown {
  name: string
  count: number
  percentage: number
  revenue: number
}

export interface MonthlyData {
  labels: string[]
  appointments: number[]
  revenue: number[]
}

export interface PeakHour {
  hour: string
  count: number
}

export interface AnalyticsData {
  revenue: RevenueData
  appointments: AppointmentAnalytics
  patients: PatientAnalytics
  noShowRate: {
    rate: number
    change: number
    trend: "up" | "down"
  }
  serviceBreakdown: ServiceBreakdown[]
  monthlyData: MonthlyData
  peakHours: PeakHour[]
}