// services/analytics.service.ts
import { ApiService } from './api.service'
import { AnalyticsData, AnalyticsQueryParams } from '@/types/entities/analytics.types'

interface OverallStats {
  total_appointments: number
  completed: number
  cancelled: number
  no_shows: number
  no_show_rate: number
  checked_in: number
  pending: number
  days_scoped: number
}

interface PeakHour {
  hour: number
  appointment_count: number
}

interface DailyTrend {
  date: string
  appointment_count: number
}

interface ServiceBreakdown {
  service_name: string
  appointment_count: number
}

class AnalyticsService extends ApiService {
  private readonly basePath = '/providers/analytics'

  private getDaysFromPeriod(period: AnalyticsQueryParams['period'] = '30days'): number {
    switch (period) {
      case '7days':
        return 7
      case '90days':
        return 90
      case 'year':
        return 365
      case '30days':
      default:
        return 30
    }
  }

  async getOverallStats(days: number = 30): Promise<OverallStats> {
    return this.get<OverallStats>(`${this.basePath}/overall?days=${days}`)
  }

  async getPeakHours(days: number = 30): Promise<PeakHour[]> {
    return this.get<PeakHour[]>(`${this.basePath}/peak-hours?days=${days}`)
  }

  async getDailyTrend(days: number = 30): Promise<DailyTrend[]> {
    return this.get<DailyTrend[]>(`${this.basePath}/daily-trend?days=${days}`)
  }

  async getServiceBreakdown(days: number = 30): Promise<ServiceBreakdown[]> {
    return this.get<ServiceBreakdown[]>(`${this.basePath}/service-breakdown?days=${days}`)
  }

  async getAnalytics(params: AnalyticsQueryParams = {}): Promise<AnalyticsData> {
    const days = this.getDaysFromPeriod(params.period)

    const [overallStats, peakHours, dailyTrend, serviceBreakdown] = await Promise.all([
      this.getOverallStats(days),
      this.getPeakHours(days),
      this.getDailyTrend(days),
      this.getServiceBreakdown(days),
    ])

    const totalAppointments = overallStats.total_appointments || 0
    const maxServiceCount = Math.max(
      ...serviceBreakdown.map((service) => service.appointment_count),
      0
    )

    return {
      revenue: {
        total: 0,
        change: { value: 0, trend: 'stable' },
        series: dailyTrend.map((day) => ({
          label: day.date,
          value: 0,
        })),
      },
      appointments: {
        total: totalAppointments,
        change: { value: 0, trend: 'stable' },
        completed: overallStats.completed || 0,
        cancelled: overallStats.cancelled || 0,
        noShowCount: overallStats.no_shows || 0,
      },
      noShowRate: {
        value: overallStats.no_show_rate || 0,
        change: { value: 0, trend: 'stable' },
      },
      serviceBreakdown: serviceBreakdown.map((service, index) => ({
        id: `${service.service_name}-${index}`,
        name: service.service_name,
        count: service.appointment_count,
        percentage: totalAppointments > 0
          ? Math.round((service.appointment_count / totalAppointments) * 100)
          : 0,
        revenue: 0,
      })),
      monthlyData: {
        data: dailyTrend.map((day) => ({
          label: day.date,
          appointments: day.appointment_count,
          revenue: 0,
        })),
      },
      peakHours: peakHours.map((peakHour) => ({
        hour: peakHour.hour,
        count: peakHour.appointment_count,
      })),
      popularTests: serviceBreakdown.map((service, index) => ({
        id: `${service.service_name}-${index}`,
        name: service.service_name,
        count: service.appointment_count,
        percentage: maxServiceCount > 0
          ? Math.round((service.appointment_count / maxServiceCount) * 100)
          : 0,
        revenue: 0,
      })),
    }
  }
}

export const analyticsService = new AnalyticsService()
