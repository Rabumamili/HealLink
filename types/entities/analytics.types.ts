export interface ChangeMetric {
  value: number
  trend: "up" | "down" | "stable"
}

export interface RevenueDataPoint {
  label: string
  value: number
}

export interface RevenueData {
  total: number
  change: ChangeMetric
  series: RevenueDataPoint[]
  weeklyData?: any // Made optional if not always present
  breakdown?: any // Made optional
  trend?: any // Made optional
  data?: any // Made optional
}

export interface AppointmentAnalytics {
  total: number
  change: ChangeMetric
  completed: number
  cancelled: number
  noShowCount: number
}

export interface ServiceBreakdown {
  id: string
  name: string
  count: number
  percentage: number
  revenue: number
  trend?: any // Made optional
}

export interface MonthlyDataPoint {
  label: string
  appointments: number
  revenue: number
}

export interface MonthlyData {
  data: MonthlyDataPoint[]
  revenue?: any // Made optional
}

export interface PeakHour {
  hour: number
  count: number
}

export interface NoShowRate {
  value: number
  change: ChangeMetric
}

export interface AnalyticsData {
  revenue: RevenueData
  appointments: AppointmentAnalytics
  noShowRate: NoShowRate
  serviceBreakdown: ServiceBreakdown[]
  monthlyData: MonthlyData
  peakHours: PeakHour[]
  popularTests?: any // Made optional
}

// Analytics query parameters type
export interface AnalyticsQueryParams {
  period?: "7days" | "30days" | "90days" | "year"
  doctorId?: string
  startDate?: string
  endDate?: string
}