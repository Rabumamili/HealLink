// stores/analyticsStore.ts

import { create } from 'zustand'
import { analyticsService } from '@/services/analytics.service'
import { AnalyticsData, AnalyticsQueryParams } from '@/types/entities/analytics.types'

type AnalyticsType = 'clinic' | 'diagnostic' | 'doctor'
type Period = '7days' | '30days' | '90days' | 'year'

interface AnalyticsState {
  // Data
  clinicData: AnalyticsData | null
  diagnosticData: AnalyticsData | null
  doctorData: AnalyticsData | null

  // UI State
  isLoading: {
    clinic: boolean
    diagnostic: boolean
    doctor: boolean
  }
  error: {
    clinic: string | null
    diagnostic: string | null
    doctor: string | null
  }
  period: Period
  selectedDoctorId: string | null  // Keeping as null for state

  // Actions
  fetchClinicAnalytics: (params?: AnalyticsQueryParams) => Promise<void>
  fetchDiagnosticAnalytics: (params?: AnalyticsQueryParams) => Promise<void>
  fetchDoctorAnalytics: (doctorId?: string, params?: AnalyticsQueryParams) => Promise<void>
  fetchAllAnalytics: (params?: AnalyticsQueryParams) => Promise<void>

  setPeriod: (period: Period) => void
  setSelectedDoctor: (doctorId: string | null) => void
  clearError: (type?: AnalyticsType) => void
  reset: () => void
}

export const useAnalyticsStore = create<AnalyticsState>((set, get) => ({
  // ======================
  // INITIAL STATE
  // ======================
  clinicData: null,
  diagnosticData: null,
  doctorData: null,

  isLoading: {
    clinic: false,
    diagnostic: false,
    doctor: false,
  },
  error: {
    clinic: null,
    diagnostic: null,
    doctor: null,
  },

  period: '30days',
  selectedDoctorId: null,

  // ======================
  // FETCH CLINIC
  // ======================
  fetchClinicAnalytics: async (params) => {
    set({ 
      isLoading: { ...get().isLoading, clinic: true },
      error: { ...get().error, clinic: null }
    })

    try {
      const queryParams: AnalyticsQueryParams = {
        period: params?.period || get().period,
        ...params
      }
      
      const data = await analyticsService.getAnalytics(queryParams)
      set({ 
        clinicData: data, 
        isLoading: { ...get().isLoading, clinic: false }
      })
    } catch (error: any) {
      set({
        error: {
          ...get().error,
          clinic: error?.response?.data?.message || 'Failed to fetch clinic analytics'
        },
        isLoading: { ...get().isLoading, clinic: false },
      })
    }
  },

  // ======================
  // FETCH DIAGNOSTIC
  // ======================
  fetchDiagnosticAnalytics: async (params) => {
    set({ 
      isLoading: { ...get().isLoading, diagnostic: true },
      error: { ...get().error, diagnostic: null }
    })

    try {
      const queryParams: AnalyticsQueryParams = {
        period: params?.period || get().period,
        ...params
      }
      
      const data = await analyticsService.getAnalytics(queryParams)
      set({ 
        diagnosticData: data, 
        isLoading: { ...get().isLoading, diagnostic: false }
      })
    } catch (error: any) {
      set({
        error: {
          ...get().error,
          diagnostic: error?.response?.data?.message || 'Failed to fetch diagnostic analytics'
        },
        isLoading: { ...get().isLoading, diagnostic: false },
      })
    }
  },

  // ======================
  // FETCH DOCTOR
  // ======================
  fetchDoctorAnalytics: async (doctorId, params) => {
    // FIX: Convert null to undefined by using ?? operator
    const id = doctorId ?? get().selectedDoctorId ?? undefined
    
    if (!id) {
      set({
        error: {
          ...get().error,
          doctor: 'Doctor ID is required'
        }
      })
      return
    }

    set({ 
      isLoading: { ...get().isLoading, doctor: true },
      error: { ...get().error, doctor: null }
    })

    try {
      const queryParams: AnalyticsQueryParams = {
        period: params?.period || get().period,
        doctorId: id,  // Now id is string | undefined, not string | null
        ...params
      }
      
      const data = await analyticsService.getAnalytics(queryParams)
      set({ 
        doctorData: data, 
        isLoading: { ...get().isLoading, doctor: false }
      })
    } catch (error: any) {
      set({
        error: {
          ...get().error,
          doctor: error?.response?.data?.message || 'Failed to fetch doctor analytics'
        },
        isLoading: { ...get().isLoading, doctor: false },
      })
    }
  },

  // ======================
  // FETCH ALL ANALYTICS
  // ======================
  fetchAllAnalytics: async (params) => {
    const period = params?.period || get().period
    const promises = []
    
    // Fetch clinic analytics
    promises.push(get().fetchClinicAnalytics({ period, ...params }))
    
    // Fetch diagnostic analytics
    promises.push(get().fetchDiagnosticAnalytics({ period, ...params }))
    
    // Fetch doctor analytics if a doctor is selected
    // FIX: Convert null to undefined when checking
    const doctorId = get().selectedDoctorId ?? undefined
    if (doctorId) {
      promises.push(get().fetchDoctorAnalytics(doctorId, { period, ...params }))
    }
    
    await Promise.allSettled(promises)
  },

  // ======================
  // SET PERIOD (SAFE REFRESH)
  // ======================
  setPeriod: (period) => {
    set({ period })
    const state = get()

    // Refresh all loaded data with new period
    if (state.clinicData) {
      state.fetchClinicAnalytics({ period })
    }

    if (state.diagnosticData) {
      state.fetchDiagnosticAnalytics({ period })
    }

    // FIX: Convert null to undefined when checking
    const doctorId = state.selectedDoctorId ?? undefined
    if (state.doctorData && doctorId) {
      state.fetchDoctorAnalytics(doctorId, { period })
    }
  },

  // ======================
  // SELECT DOCTOR
  // ======================
  setSelectedDoctor: (doctorId) => {
    set({ selectedDoctorId: doctorId })

    // FIX: Convert null to undefined when passing to fetchDoctorAnalytics
    if (doctorId) {
      get().fetchDoctorAnalytics(doctorId, { period: get().period })
    } else {
      // Clear doctor data when no doctor is selected
      set({ doctorData: null })
    }
  },

  // ======================
  // UTILITIES
  // ======================
  clearError: (type?: AnalyticsType) => {
    if (type) {
      set({
        error: {
          ...get().error,
          [type]: null
        }
      })
    } else {
      set({
        error: {
          clinic: null,
          diagnostic: null,
          doctor: null
        }
      })
    }
  },

  reset: () =>
    set({
      clinicData: null,
      diagnosticData: null,
      doctorData: null,
      isLoading: {
        clinic: false,
        diagnostic: false,
        doctor: false,
      },
      error: {
        clinic: null,
        diagnostic: null,
        doctor: null,
      },
      period: '30days',
      selectedDoctorId: null,
    }),
}))