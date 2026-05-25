// services/analytics.service.ts
import { ApiService } from './api.service'
import { AnalyticsData } from '@/types/entities/analytics.types'

class AnalyticsService extends ApiService {
  async getAnalytics(period: string = '30days'): Promise<AnalyticsData> {
    return this.get<AnalyticsData>(`/analytics?period=${period}`)
  }

  async getRevenueData(period: string): Promise<AnalyticsData['revenue']> {
    return this.get<AnalyticsData['revenue']>(`/analytics/revenue?period=${period}`)
  }

  async getAppointmentAnalytics(period: string): Promise<AnalyticsData['appointments']> {
    return this.get<AnalyticsData['appointments']>(`/analytics/appointments?period=${period}`)
  }

  async getServiceBreakdown(): Promise<AnalyticsData['serviceBreakdown']> {
    return this.get<AnalyticsData['serviceBreakdown']>('/analytics/services')
  }
}

export const analyticsService = new AnalyticsService()