// stores/slices/resultSlice.ts
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { resultService } from '@/services/result.service';
import {
  Result,
  CreateResultDTO,
  UpdateResultDTO,
  ResultFilters,
  ResultWithDetails,
  ResultHistoryResponse,
  ResultStats,
  ResultStatus,
} from '@/types/entities/result.types';

interface ResultState {
  // State
  results: Result[];
  currentResult: ResultWithDetails | null;
  resultHistory: ResultHistoryResponse | null;
  stats: ResultStats | null;
  isLoading: boolean;
  error: string | null;
  filters: ResultFilters;
  
  // Actions
  fetchResults: (filters?: ResultFilters) => Promise<void>;
  fetchResultById: (id: number) => Promise<void>;
  fetchResultsByAppointment: (appointmentId: number) => Promise<void>;
  fetchResultsByDiagnosticCenter: (diagnosticCenterId: number, filters?: ResultFilters) => Promise<void>;
  fetchStats: (diagnosticCenterId?: number) => Promise<void>;
  createResult: (data: CreateResultDTO) => Promise<Result>;
  updateResult: (id: number, data: UpdateResultDTO) => Promise<Result>;
  updateDiagnosticResult: (id: number, data: UpdateResultDTO) => Promise<Result>;
  deleteResult: (id: number) => Promise<void>;
  bulkUpdateStatus: (updates: { id: number; status: ResultStatus }[]) => Promise<void>;
  markAsReady: (id: number, staffId: number) => Promise<void>;
  markAsCollected: (id: number, staffId: number) => Promise<void>;
  setFilters: (filters: ResultFilters) => void;
  clearError: () => void;
  clearCurrentResult: () => void;
  resetState: () => void;
}

export const useResultStore = create<ResultState>()(
  devtools(
    (set, get) => ({
      // Initial state
      results: [],
      currentResult: null,
      resultHistory: null,
      stats: null,
      isLoading: false,
      error: null,
      filters: {},

      // Fetch all results
      fetchResults: async (filters) => {
        set({ isLoading: true, error: null });
        try {
          const newFilters = filters || get().filters;
          const results = await resultService.getResults(newFilters);
          set({ results, filters: newFilters, error: null });
        } catch (error: any) {
          const errorMessage = error.message || 'Failed to fetch results';
          set({ error: errorMessage });
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      // Fetch result by ID
      fetchResultById: async (id) => {
        set({ isLoading: true, error: null });
        try {
          const result = await resultService.getResultById(id);
          set({ currentResult: result, error: null });
        } catch (error: any) {
          const errorMessage = error.message || 'Failed to fetch result';
          set({ error: errorMessage });
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      // Fetch results by appointment
      fetchResultsByAppointment: async (appointmentId) => {
        set({ isLoading: true, error: null });
        try {
          const history = await resultService.getResultsByAppointment(appointmentId);
          set({ resultHistory: history, error: null });
        } catch (error: any) {
          const errorMessage = error.message || 'Failed to fetch result history';
          set({ error: errorMessage });
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      // Fetch results by diagnostic center
      fetchResultsByDiagnosticCenter: async (diagnosticCenterId, filters) => {
        set({ isLoading: true, error: null });
        try {
          const results = await resultService.getResultsByDiagnosticCenter(diagnosticCenterId, filters);
          set({ results, filters: { ...get().filters, ...filters, diagnostic_center_id: diagnosticCenterId }, error: null });
        } catch (error: any) {
          const errorMessage = error.message || 'Failed to fetch results for diagnostic center';
          set({ error: errorMessage });
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      // Fetch statistics
      fetchStats: async (diagnosticCenterId) => {
        set({ isLoading: true, error: null });
        try {
          const stats = await resultService.getResultStats(diagnosticCenterId);
          set({ stats, error: null });
        } catch (error: any) {
          const errorMessage = error.message || 'Failed to fetch statistics';
          set({ error: errorMessage });
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      // Create result
      createResult: async (data) => {
        set({ isLoading: true, error: null });
        try {
          const newResult = await resultService.createResult(data);
          set((state) => ({
            results: [newResult, ...state.results],
            error: null,
          }));
          return newResult;
        } catch (error: any) {
          const errorMessage = error.message || 'Failed to create result';
          set({ error: errorMessage });
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      // Update result
      updateResult: async (id, data) => {
        set({ isLoading: true, error: null });
        try {
          const updatedResult = await resultService.updateResult(id, data);
          set((state) => ({
            results: state.results.map((r) => (r.id === id ? updatedResult : r)),
            currentResult: state.currentResult?.id === id 
              ? { ...state.currentResult, ...updatedResult }
              : state.currentResult,
            resultHistory: state.resultHistory
              ? {
                  ...state.resultHistory,
                  results: state.resultHistory.results.map((r) =>
                    r.id === id ? updatedResult : r
                  ),
                  currentStatus: updatedResult.status,
                  lastUpdated: updatedResult.changed_at,
                }
              : null,
            error: null,
          }));
          return updatedResult;
        } catch (error: any) {
          const errorMessage = error.message || 'Failed to update result';
          set({ error: errorMessage });
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      // Update diagnostic result (alias)
      updateDiagnosticResult: async (id, data) => {
        return get().updateResult(id, data);
      },

      // Delete result
      deleteResult: async (id) => {
        set({ isLoading: true, error: null });
        try {
          await resultService.deleteResult(id);
          set((state) => ({
            results: state.results.filter((r) => r.id !== id),
            currentResult: state.currentResult?.id === id ? null : state.currentResult,
            resultHistory: state.resultHistory
              ? {
                  ...state.resultHistory,
                  results: state.resultHistory.results.filter((r) => r.id !== id),
                }
              : null,
            error: null,
          }));
        } catch (error: any) {
          const errorMessage = error.message || 'Failed to delete result';
          set({ error: errorMessage });
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      // Bulk update status
      bulkUpdateStatus: async (updates) => {
        set({ isLoading: true, error: null });
        try {
          const updatedResults = await resultService.bulkUpdateStatus(updates);
          set((state) => ({
            results: state.results.map(
              (r) => updatedResults.find((ur) => ur.id === r.id) || r
            ),
            error: null,
          }));
        } catch (error: any) {
          const errorMessage = error.message || 'Failed to bulk update results';
          set({ error: errorMessage });
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      // Mark as ready
      markAsReady: async (id, staffId) => {
        await get().updateResult(id, {
          status: 'Ready',
          changed_by_staff_id: staffId,
          changed_at: new Date().toISOString(),
        });
      },

      // Mark as collected
      markAsCollected: async (id, staffId) => {
        await get().updateResult(id, {
          status: 'Collected',
          changed_by_staff_id: staffId,
          changed_at: new Date().toISOString(),
        });
      },

      // Set filters
      setFilters: (filters) => {
        set({ filters });
      },

      // Clear error
      clearError: () => {
        set({ error: null });
      },

      // Clear current result
      clearCurrentResult: () => {
        set({ currentResult: null });
      },

      // Reset state
      resetState: () => {
        set({
          results: [],
          currentResult: null,
          resultHistory: null,
          stats: null,
          isLoading: false,
          error: null,
          filters: {},
        });
      },
    }),
    { name: 'ResultStore' }
  )
);