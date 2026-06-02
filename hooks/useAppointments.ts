// hooks/useAppointments.ts
import { useEffect, useCallback, useMemo } from 'react';
import { useAppointmentStore } from '@/stores/slices/appiontmentSlice';
import { appointmentService } from '@/services/appointment.service';

export const useAppointments = () => {
  const {
    appointments,
    services,
    serviceSlots,
    isLoading,
    error,

    fetchServices,
    fetchMyAppointments,
    createAppointment,
    cancelAppointment,
    markVisitCompleted,
    markNeedsRecheck,
    bookRecheckVisit,
    fetchServiceSlots,

    clearError,
  } = useAppointmentStore();

  const loadData = useCallback(async () => {
    try {
      await Promise.all([
        fetchServices(),
        fetchMyAppointments(),
      ]);
    } catch (error) {
      console.error('Failed to load appointment data:', error);
    }
  }, [fetchServices, fetchMyAppointments]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const refreshData = useCallback(async () => {
    await loadData();
  }, [loadData]);

  const rescheduleAppointment = useCallback(async (providerId: number, appointmentId: number, slotId: number) => {
    return await appointmentService.rescheduleAppointment(providerId, appointmentId, slotId);
  }, []);

  // Compatibility methods for existing pages - implemented using available API
  const updateStatus = useCallback(async (appointmentId: number, status: string) => {
    // Status updates not directly available in API
    // Use markVisitCompleted for completion, cancelAppointment for cancellation
    if (status === 'Completed') {
      // Need providerId - this is a limitation
      console.warn('updateStatus: markVisitCompleted requires providerId');
    } else if (status === 'Cancelled') {
      await cancelAppointment(appointmentId);
    } else {
      console.warn(`updateStatus: status "${status}" not directly supported by API`);
    }
  }, [cancelAppointment]);

  const updateTiming = useCallback(async (appointmentId: number, startTime: string, endTime: string) => {
    // Use rescheduleAppointment instead - requires providerId and slotId
    console.warn('updateTiming: use rescheduleAppointment with providerId and slotId instead');
  }, []);

  const fetchProviderAppointments = useCallback(async (providerId: number) => {
    // Provider appointments endpoint not available in API
    // Use fetchMyAppointments for patient's own appointments
    console.warn('fetchProviderAppointments not available in current API version');
    await fetchMyAppointments();
  }, [fetchMyAppointments]);

  const fetchPatientAppointments = useCallback(async (patientId: number) => {
    // Patient-specific appointments endpoint not available
    // Use fetchMyAppointments for current user's appointments
    console.warn('fetchPatientAppointments not available in current API version');
    await fetchMyAppointments();
  }, [fetchMyAppointments]);

  // Calculate stats from real data
  const stats = useMemo(() => {
    const completedAppointments = appointments.filter(a => a.status === 'Completed').length;
    const cancelledAppointments = appointments.filter(a => a.status === 'Cancelled').length;
    const totalRevenue = completedAppointments * 1000; // Placeholder - would need service data
    return {
      revenue: totalRevenue,
      cardsIssued: appointments.length,
      cardsUtilized: completedAppointments,
    };
  }, [appointments]);

  return {
    // Data
    appointments,
    services,
    serviceSlots,

    // State
    isLoading,
    error,

    // Actions
    fetchServices,
    fetchMyAppointments,
    createAppointment,
    cancelAppointment,
    markVisitCompleted,
    markNeedsRecheck,
    bookRecheckVisit,
    fetchServiceSlots,
    rescheduleAppointment,

    // Utilities
    clearError,
    refreshData,

    // Compatibility
    updateStatus,
    updateTiming,
    fetchProviderAppointments,
    fetchPatientAppointments,
    stats,
    filters: { searchTerm: '', status: 'all' },
    setFilters: (newFilters: any) => console.warn('setFilters not implemented'),
  };
};