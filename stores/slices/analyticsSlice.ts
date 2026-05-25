// stores/analyticsStore.ts
import { create } from 'zustand';
import { 
  ClinicAnalytics, 
  DiagnosticAnalytics, 
  DoctorAnalytics,
  AnalyticsQueryParams 
} from '@/types/entities/analytics.types';
import { analyticsService } from '@/services/analytics.service';

type AnalyticsType = 'clinic' | 'diagnostic' | 'doctor';

interface AnalyticsState {
  // State
  clinicData: ClinicAnalytics | null;
  diagnosticData: DiagnosticAnalytics | null;
  doctorData: DoctorAnalytics | null;
  isLoading: boolean;
  error: string | null;
  period: '7days' | '30days' | '90days' | 'year';
  selectedDoctorId: string | null;
  
  // Actions
  fetchClinicAnalytics: (params?: AnalyticsQueryParams) => Promise<void>;
  fetchDiagnosticAnalytics: (params?: AnalyticsQueryParams) => Promise<void>;
  fetchDoctorAnalytics: (doctorId?: string, params?: AnalyticsQueryParams) => Promise<void>;
  setPeriod: (period: AnalyticsState['period']) => void;
  setSelectedDoctor: (doctorId: string | null) => void;
  clearError: () => void;
  reset: () => void;
}

export const useAnalyticsStore = create<AnalyticsState>((set, get) => ({
  // Initial state
  clinicData: null,
  diagnosticData: null,
  doctorData: null,
  isLoading: false,
  error: null,
  period: '30days',
  selectedDoctorId: null,

  // Actions
  fetchClinicAnalytics: async (params) => {
    set({ isLoading: true, error: null });
    try {
      const data = await analyticsService.getClinicAnalytics({
        period: get().period,
        ...params
      });
      set({ clinicData: data, isLoading: false });
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Failed to fetch clinic analytics', 
        isLoading: false 
      });
    }
  },

  fetchDiagnosticAnalytics: async (params) => {
    set({ isLoading: true, error: null });
    try {
      const data = await analyticsService.getDiagnosticAnalytics({
        period: get().period,
        ...params
      });
      set({ diagnosticData: data, isLoading: false });
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Failed to fetch diagnostic analytics', 
        isLoading: false 
      });
    }
  },

  fetchDoctorAnalytics: async (doctorId, params) => {
    set({ isLoading: true, error: null });
    try {
      const id = doctorId || get().selectedDoctorId;
      const data = await analyticsService.getDoctorAnalytics(id || undefined, {
        period: get().period,
        ...params
      });
      set({ doctorData: data, isLoading: false });
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Failed to fetch doctor analytics', 
        isLoading: false 
      });
    }
  },

  setPeriod: (period) => {
    set({ period });
    // Auto-refetch based on current view
    const state = get();
    if (state.clinicData) {
      state.fetchClinicAnalytics();
    }
    if (state.diagnosticData) {
      state.fetchDiagnosticAnalytics();
    }
    if (state.doctorData) {
      state.fetchDoctorAnalytics();
    }
  },

  setSelectedDoctor: (doctorId) => {
    set({ selectedDoctorId: doctorId });
    if (doctorId) {
      get().fetchDoctorAnalytics(doctorId);
    }
  },

  clearError: () => set({ error: null }),
  
  reset: () => set({
    clinicData: null,
    diagnosticData: null,
    doctorData: null,
    isLoading: false,
    error: null,
    period: '30days',
    selectedDoctorId: null,
  }),
}));