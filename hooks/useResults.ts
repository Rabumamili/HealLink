// hooks/useResults.ts
import { useEffect } from 'react';
import { useResultStore } from '@/stores/slices/resultSlice';
import {
  CreateResultDTO,
  UpdateResultDTO,
  ResultFilters,
  ResultStatus,
} from '@/types/entities/result.types';

interface UseResultsOptions {
  autoFetch?: boolean;
  filters?: ResultFilters;
  appointmentId?: number;
  diagnosticCenterId?: number;
  staffId?: number;
  enablePolling?: boolean;
  pollingInterval?: number;
}

export const useResults = (options: UseResultsOptions = {}) => {
  const {
    autoFetch = false,
    filters,
    appointmentId,
    diagnosticCenterId,
    staffId,
    enablePolling = false,
    pollingInterval = 5000,
  } = options;

  const {
    results,
    currentResult,
    resultHistory,
    stats,
    isLoading,
    error,
    filters: currentFilters,
    fetchResults,
    fetchResultById,
    fetchResultsByAppointment,
    fetchResultsByDiagnosticCenter,
    fetchStats,
    createResult,
    updateResult,
    updateDiagnosticResult,
    deleteResult,
    bulkUpdateStatus,
    markAsReady,
    markAsCollected,
    setFilters,
    clearError,
    clearCurrentResult,
    resetState,
  } = useResultStore();

  // Auto-fetch results
  useEffect(() => {
    if (autoFetch) {
      if (appointmentId) {
        fetchResultsByAppointment(appointmentId);
      } else if (diagnosticCenterId) {
        fetchStats(diagnosticCenterId);
        fetchResultsByDiagnosticCenter(diagnosticCenterId, filters);
      } else if (staffId) {
        fetchResults({ ...filters, staff_id: staffId });
      } else if (filters) {
        fetchResults(filters);
      } else if (Object.keys(currentFilters).length > 0) {
        fetchResults();
      }
    }
  }, [autoFetch, appointmentId, diagnosticCenterId, staffId, filters]);

  // Polling for real-time updates
  useEffect(() => {
    if (!enablePolling || !autoFetch) return;

    const interval = setInterval(() => {
      if (appointmentId) {
        fetchResultsByAppointment(appointmentId);
      } else if (diagnosticCenterId) {
        fetchResultsByDiagnosticCenter(diagnosticCenterId, filters);
        fetchStats(diagnosticCenterId);
      } else if (staffId) {
        fetchResults({ ...filters, staff_id: staffId });
      } else if (filters) {
        fetchResults(filters);
      }
    }, pollingInterval);

    return () => clearInterval(interval);
  }, [enablePolling, pollingInterval, appointmentId, diagnosticCenterId, staffId, filters, autoFetch]);

  // Helper functions
  const getResultsByStatus = (status: ResultStatus): typeof results => {
    return results.filter((result) => result.status === status);
  };

  const getPendingResults = (): typeof results => {
    return results.filter((result) => result.status === 'Pending');
  };

  const getInProgressResults = (): typeof results => {
    return results.filter((result) => result.status === 'in progress');
  };

  const getReadyResults = (): typeof results => {
    return results.filter((result) => result.status === 'Ready');
  };

  const getCollectedResults = (): typeof results => {
    return results.filter((result) => result.status === 'Collected');
  };

  const getAverageProcessingTime = (): number => {
    if (!stats) return 0;
    return stats.averageProcessingTimeMinutes;
  };

  const getCompletionRate = (): number => {
    if (!stats || stats.total === 0) return 0;
    return ((stats.ready + stats.collected) / stats.total) * 100;
  };

  const getStatsByDiagnosticCenter = (centerId: number) => {
    if (!stats) return null;
    return stats.byDiagnosticCenter.find((center) => center.diagnosticCenterId === centerId);
  };

  return {
    // State
    results,
    currentResult,
    resultHistory,
    stats,
    isLoading,
    error,
    filters: currentFilters,
    
    // Filtered results
    getResultsByStatus,
    getPendingResults,
    getInProgressResults,
    getReadyResults,
    getCollectedResults,
    
    // Statistics
    getAverageProcessingTime,
    getCompletionRate,
    getStatsByDiagnosticCenter,
    
    // Actions
    fetchResults,
    fetchResultById,
    fetchResultsByAppointment,
    fetchResultsByDiagnosticCenter,
    fetchStats,
    createResult: async (data: CreateResultDTO) => {
      try {
        const result = await createResult(data);
        return { success: true, data: result };
      } catch (error) {
        return { success: false, error };
      }
    },
    updateResult: async (id: number, data: UpdateResultDTO) => {
      try {
        const result = await updateResult(id, data);
        return { success: true, data: result };
      } catch (error) {
        return { success: false, error };
      }
    },
    updateDiagnosticResult: async (id: number, data: UpdateResultDTO) => {
      try {
        const result = await updateDiagnosticResult(id, data);
        return { success: true, data: result };
      } catch (error) {
        return { success: false, error };
      }
    },
    deleteResult: async (id: number) => {
      try {
        await deleteResult(id);
        return { success: true };
      } catch (error) {
        return { success: false, error };
      }
    },
    bulkUpdateStatus,
    markAsReady,
    markAsCollected,
    setFilters,
    clearError,
    clearCurrentResult,
    resetState,
  };
};