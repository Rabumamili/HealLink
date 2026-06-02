// hooks/useResults.ts
import { useEffect, useCallback } from 'react';
import { useResultStore } from '@/stores/slices/resultSlice';
import { DiagnosticResult, UpdateResultStatusRequest } from '@/services/result.service';

interface UseResultsOptions {
  autoFetch?: boolean;
  appointmentId?: number;
}

export const useResults = (options: UseResultsOptions = {}) => {
  const {
    results,
    currentResult,
    isLoading,
    error,
    getMyResults,
    getResultForAppointment,
    updateResultStatus,
    clearCurrentResult,
    clearError,
    resetState,
  } = useResultStore();

  const { autoFetch = false, appointmentId } = options;

  useEffect(() => {
    if (autoFetch) {
      if (appointmentId) {
        getResultForAppointment(appointmentId);
      } else {
        getMyResults();
      }
    }
  }, [autoFetch, appointmentId, getResultForAppointment, getMyResults]);

  const updateStatus = useCallback(async (appointmentId: number, data: UpdateResultStatusRequest) => {
    await updateResultStatus(appointmentId, data);
  }, [updateResultStatus]);

  return {
    results,
    currentResult,
    isLoading,
    error,
    getMyResults,
    getResultForAppointment,
    updateResultStatus: updateStatus,
    clearCurrentResult,
    clearError,
    resetState,
  };
};