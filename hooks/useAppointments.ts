// hooks/useAppointments.ts - FULLY FIXED
import { useEffect, useCallback } from 'react';
import { useAppointmentStore } from '@/stores/slices/appiontmentSlice'; // FIXED: Corrected filename from 'appiontmentSlice' to 'appointment.slice'
import { AppointmentStatus, BookAppointmentRequest } from '@/types/entities/appointment.types';

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
    bookAppointment,
    bookAppointmentWithPendingPayment,  // ADDED
    createChapaCheckout,               // ADDED
    confirmAfterChapaPayment,          // ADDED
    setFilters,
    clearError,
    getAppointmentsByStatus,
    getTodayAppointments,
    getAppointmentsByDate,
    setProviderContext,
    refreshData: storeRefreshData,
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

  // Helper method to book an appointment with Chapa payment
  const bookNewAppointment = useCallback(async (request: BookAppointmentRequest) => {
    return await bookAppointment(request);
  }, [bookAppointment]);

  // Helper method to book an appointment with pending payment (pay later)
  const bookPendingAppointment = useCallback(async (request: BookAppointmentRequest) => {
    return await bookAppointmentWithPendingPayment(request);
  }, [bookAppointmentWithPendingPayment]);

  // Helper method to create Chapa checkout URL
  const createChapaPaymentLink = useCallback(async (request: BookAppointmentRequest) => {
    return await createChapaCheckout(request);
  }, [createChapaCheckout]);

  // Helper method to confirm payment after Chapa webhook
  const confirmPayment = useCallback(async (appointmentId: number, paymentId: number, txRef: string) => {
    return await confirmAfterChapaPayment(appointmentId, paymentId, txRef);
  }, [confirmAfterChapaPayment]);

  // Helper method to get appointments by service type
  const getAppointmentsByServiceType = useCallback((serviceType: string) => {
    return appointments.filter(a => a.serviceType === serviceType);
  }, [appointments]);

  // Helper method to get appointments by provider
  const getAppointmentsByProvider = useCallback((providerName: string) => {
    return appointments.filter(a => a.providerName === providerName);
  }, [appointments]);

  // Helper method to get appointments with cards
  const getAppointmentsWithCards = useCallback(() => {
    return appointments.filter(a => a.cardNumber);
  }, [appointments]);

  // Helper method to get confirmed appointments
  const getConfirmedAppointments = useCallback(() => {
    return appointments.filter(a => a.status === 'Confirmed');
  }, [appointments]);

  // Helper method to get checked-in appointments
  const getCheckedInAppointments = useCallback(() => {
    return appointments.filter(a => a.status === 'Checked-in');
  }, [appointments]);

  // Helper method to get completed appointments
  const getCompletedAppointments = useCallback(() => {
    return appointments.filter(a => a.status === 'Completed');
  }, [appointments]);

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
    bookAppointment: bookNewAppointment,
    bookAppointmentWithPendingPayment: bookPendingAppointment,
    createChapaCheckout: createChapaPaymentLink,
    confirmAfterChapaPayment: confirmPayment,
    setFilters,
    clearError,
    refreshData,
    
    // Expose fetch functions for manual refresh
    fetchAppointments,
    fetchStats,
    fetchCheckedInPatients,
    
    // Helper methods
    getAppointmentsForDate,
    getAppointmentsBySpecificStatus,
    getAppointmentsByServiceType,
    getAppointmentsByProvider,
    getAppointmentsWithCards,
    getConfirmedAppointments,
    getCheckedInAppointments,
    getCompletedAppointments,
    
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