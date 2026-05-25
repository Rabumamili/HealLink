// hooks/useAppointments.ts
import { useEffect } from 'react';
import { useAppointmentStore } from '@/stores/slices/appiontmentSlice';

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
    reschedule,
    checkinPatient,
    cancel,
    setFilters,
    clearError,
    getAppointmentsByStatus,
    getTodayAppointments,
    setProviderContext,
  } = useAppointmentStore();

  useEffect(() => {
    if (providerId) {
      setProviderContext(providerId);
      fetchStats(providerId);
      fetchCheckedInPatients(providerId);
    } else {
      fetchStats();
      fetchCheckedInPatients();
    }
    fetchAppointments();
  }, [providerId]);

  const upcomingAppointments = getAppointmentsByStatus('upcoming');
  const pastAppointments = getAppointmentsByStatus('past');
  const todayAppointments = getTodayAppointments();

  return {
    appointments,
    stats,
    checkedInPatients,
    upcomingAppointments,
    pastAppointments,
    todayAppointments,
    isLoading,
    error,
    filters,
    updateStatus,
    reschedule,
    checkinPatient,
    cancel,
    setFilters,
    clearError,
  };
};