// services/analytics.service.ts
import { ApiService } from './api.service'
import { 
  AnalyticsData, 
  AnalyticsQueryParams, 
  RevenueData, 
  AppointmentAnalytics,
  ServiceBreakdown 
} from '@/types/entities/analytics.types'

class AnalyticsService extends ApiService {
  
  async getAnalytics(params?: AnalyticsQueryParams): Promise<AnalyticsData> {
    const queryString = this.buildQueryString(params)
    return this.get<AnalyticsData>(`/analytics${queryString}`)
  }

  async getRevenueData(params?: AnalyticsQueryParams): Promise<RevenueData> {
    const queryString = this.buildQueryString(params)
    return this.get<RevenueData>(`/analytics/revenue${queryString}`)
  }

  async getAppointmentAnalytics(params?: AnalyticsQueryParams): Promise<AppointmentAnalytics> {
    const queryString = this.buildQueryString(params)
    return this.get<AppointmentAnalytics>(`/analytics/appointments${queryString}`)
  }

  async getServiceBreakdown(params?: AnalyticsQueryParams): Promise<ServiceBreakdown[]> {
    const queryString = this.buildQueryString(params)
    return this.get<ServiceBreakdown[]>(`/analytics/services${queryString}`)
  }

  async getRealTimeAnalytics(): Promise<any> {
    return this.get<any>('/analytics/realtime')
  }

  async getComparativeAnalytics(
    currentParams: AnalyticsQueryParams, 
    previousParams: AnalyticsQueryParams, 
    type?: string, 
    doctorId?: string
  ): Promise<any> {
    const currentQuery = this.buildQueryString(currentParams)
    const previousQuery = this.buildQueryString(previousParams)
    let url = `/analytics/compare?current${currentQuery}&previous${previousQuery}`
    
    if (type) url += `&type=${type}`
    if (doctorId) url += `&doctorId=${doctorId}`
    
    return this.get<any>(url)
  }

  async downloadReport(
    type: string, 
    format: 'pdf' | 'csv' | 'excel' = 'pdf',
    params?: AnalyticsQueryParams
  ): Promise<Blob> {
    const queryString = this.buildQueryString(params)
    return this.get<Blob>(`/analytics/report/${type}/${format}${queryString}`, {
      responseType: 'blob'
    })
  }

  private buildQueryString(params?: AnalyticsQueryParams): string {
    if (!params) return ''
    
    const queryParams: string[] = []
    
    if (params.period) queryParams.push(`period=${params.period}`)
    if (params.doctorId) queryParams.push(`doctorId=${params.doctorId}`)
    if (params.startDate) queryParams.push(`startDate=${params.startDate}`)
    if (params.endDate) queryParams.push(`endDate=${params.endDate}`)
    
    return queryParams.length ? `?${queryParams.join('&')}` : ''
  }
}

export const analyticsService = new AnalyticsService()