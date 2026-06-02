// stores/slices/resultSlice.ts
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { resultService, DiagnosticResult, UpdateResultStatusRequest } from '@/services/result.service';

interface ResultState {
  results: DiagnosticResult[];
  currentResult: DiagnosticResult | null;
  isLoading: boolean;
  error: string | null;
  
  getMyResults: () => Promise<void>;
  getResultForAppointment: (appointmentId: number) => Promise<void>;
  updateResultStatus: (appointmentId: number, data: UpdateResultStatusRequest) => Promise<void>;
  clearCurrentResult: () => void;
  clearError: () => void;
  resetState: () => void;
}

export const useResultStore = create<ResultState>()(
  devtools(
    (set) => ({
      results: [],
      currentResult: null,
      isLoading: false,
      error: null,

      getMyResults: async () => {
        set({ isLoading: true, error: null });
        try {
          const results = await resultService.getMyResults();
          set({ results, error: null, isLoading: false });
        } catch (error: any) {
          const errorMessage = error.message || 'Failed to fetch results';
          set({ error: errorMessage, isLoading: false });
          throw error;
        }
      },

      getResultForAppointment: async (appointmentId: number) => {
        set({ isLoading: true, error: null });
        try {
          const result = await resultService.getResultForAppointment(appointmentId);
          set({ currentResult: result, error: null, isLoading: false });
        } catch (error: any) {
          const errorMessage = error.message || 'Failed to fetch result';
          set({ error: errorMessage, isLoading: false });
          throw error;
        }
      },

      updateResultStatus: async (appointmentId: number, data: UpdateResultStatusRequest) => {
        set({ isLoading: true, error: null });
        try {
          const updatedResult = await resultService.updateResultStatus(appointmentId, data);
          set((state) => ({
            results: state.results.map((r) => r.appointment_id === appointmentId ? updatedResult : r),
            currentResult: state.currentResult?.appointment_id === appointmentId 
              ? updatedResult
              : state.currentResult,
            error: null,
            isLoading: false,
          }));
        } catch (error: any) {
          const errorMessage = error.message || 'Failed to update result';
          set({ error: errorMessage, isLoading: false });
          throw error;
        }
      },

      clearCurrentResult: () => {
        set({ currentResult: null });
      },

      clearError: () => {
        set({ error: null });
      },

      resetState: () => {
        set({
          results: [],
          currentResult: null,
          isLoading: false,
          error: null,
        });
      },
    }),
    { name: 'ResultStore' }
  )
);