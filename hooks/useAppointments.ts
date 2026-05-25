// hooks/useAppointments.ts
import { useEffect, useCallback } from 'react';
import { useAppointmentStore } from '@/stores/slices/appiontmentSlice';
import { AppointmentStatus } from '@/types/entities/appointment.types';

export const useAppointments = (providerId?: string) => {
  const {
    appointments,
    stats,
    checkedInPatients,
    isLoading,
    error,
    filters,
    fetchAppointments,
    fetchStats,
    fetchCheckedInPatients,
    updateStatus,
    updateTiming,
    checkinPatient,
    cancelAppointment,
    createAppointment,
    setFilters,
    clearError,
    getAppointmentsByStatus,
    getTodayAppointments,
    getAppointmentsByDate,
    setProviderContext,
  } = useAppointmentStore();

  const loadData = useCallback(async () => {
    if (providerId) {
      setProviderContext(providerId);
      await fetchStats(providerId);
      await fetchCheckedInPatients(providerId);
    } else {
      await fetchStats();
      await fetchCheckedInPatients();
    }
    await fetchAppointments();
  }, [providerId, fetchAppointments, fetchStats, fetchCheckedInPatients, setProviderContext]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Refresh function to reload all data
  const refreshData = useCallback(async () => {
    await loadData();
  }, [loadData]);

  const upcomingAppointments = getAppointmentsByStatus('upcoming');
  const pastAppointments = getAppointmentsByStatus('past');
  const todayAppointments = getTodayAppointments();

  // Helper method to get appointments for a specific date
  const getAppointmentsForDate = (date: string) => {
    return getAppointmentsByDate(date);
  };

  // Helper method to get appointments by specific status
  const getAppointmentsBySpecificStatus = (status: AppointmentStatus) => {
    return getAppointmentsByStatus(status);
  };

  return {
    // Data
    appointments,
    stats,
    checkedInPatients,
    upcomingAppointments,
    pastAppointments,
    todayAppointments,
    
    // Status
    isLoading,
    error,
    filters,
    
    // Actions
    updateStatus,
    updateTiming,
    checkinPatient,
    cancelAppointment,
    createAppointment,
    setFilters,
    clearError,
    refreshData, // Add refreshData
    
    // Expose fetch functions for manual refresh
    fetchAppointments,
    fetchStats,
    fetchCheckedInPatients,
    
    // Helper methods
    getAppointmentsForDate,
    getAppointmentsBySpecificStatus,
    
    // Legacy compatibility (if needed for existing code)
    reschedule: async (id: number, date: string, time: string) => {
      console.warn('reschedule is deprecated. Please use updateTiming instead');
      const startTime = `${date} ${time}`;
      const endTime = `${date} ${parseInt(time) + 30}:00`;
      await updateTiming(id, startTime, endTime);
    },
    cancel: cancelAppointment,
  };
};