// hooks/useAppointments.ts
import { useEffect, useCallback } from 'react';
import { useAppointmentStore } from '@/stores/slices/appiontmentSlice';
import {
  AppointmentStatus,
  BookAppointmentRequest,
  EnrichedAppointment,
} from '@/types/entities/appointment.types';
import { PaymentStatus } from '@/types/entities/payment.types';

export const useAppointments = (providerId?: number) => {
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
    bookAppointmentWithPendingPayment,
    createChapaCheckout,
    confirmAfterChapaPayment,

    getAppointmentPaymentStatus,
    updateAppointmentPaymentStatus,
    retryFailedPayment,

    setFilters,
    clearError,

    getAppointmentsByStatus,
    getAppointmentsByPaymentStatus,
    getTodayAppointments,
    getAppointmentsByDate,

    setProviderContext,

    fetchPatientAppointments,
    fetchUpcomingPatientAppointments,
    fetchPastPatientAppointments,

    fetchProviderAppointments,
    fetchUpcomingProviderAppointments,
    fetchTodayProviderAppointments,

    refreshData: storeRefreshData,
  } = useAppointmentStore();

  const loadData = useCallback(async () => {
    try {
      if (providerId) {
        setProviderContext(providerId);
      }

      await Promise.all([
        fetchStats(),
        fetchCheckedInPatients(),
        fetchAppointments(),
      ]);
    } catch (error) {
      console.error('Failed to load appointment data:', error);
    }
  }, [
    providerId,
    setProviderContext,
    fetchAppointments,
    fetchStats,
    fetchCheckedInPatients,
  ]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const refreshData = useCallback(async () => {
    await storeRefreshData();
  }, [storeRefreshData]);

  const upcomingAppointments = getAppointmentsByStatus('upcoming');
  const pastAppointments = getAppointmentsByStatus('past');
  const todayAppointments = getTodayAppointments();

  const getAppointmentsForDate = useCallback(
    (date: string) => getAppointmentsByDate(date),
    [getAppointmentsByDate]
  );

  const getAppointmentsBySpecificStatus = useCallback(
    (status: AppointmentStatus) => getAppointmentsByStatus(status),
    [getAppointmentsByStatus]
  );

  const getAppointmentsByPaymentStatusFilter = useCallback(
    (status: PaymentStatus) => getAppointmentsByPaymentStatus(status),
    [getAppointmentsByPaymentStatus]
  );

  const bookNewAppointment = useCallback(
    async (request: BookAppointmentRequest) => {
      return await bookAppointment(request);
    },
    [bookAppointment]
  );

  const bookPendingAppointment = useCallback(
    async (request: BookAppointmentRequest) => {
      return await bookAppointmentWithPendingPayment(request);
    },
    [bookAppointmentWithPendingPayment]
  );

  const createChapaPaymentLink = useCallback(
    async (request: BookAppointmentRequest) => {
      return await createChapaCheckout(request);
    },
    [createChapaCheckout]
  );

  const confirmPayment = useCallback(
    async (
      appointmentId: number,
      paymentId: number,
      txRef: string
    ) => {
      return await confirmAfterChapaPayment(
        appointmentId,
        paymentId,
        txRef
      );
    },
    [confirmAfterChapaPayment]
  );

  const getPaymentStatus = useCallback(
    async (appointmentId: number) => {
      return await getAppointmentPaymentStatus(appointmentId);
    },
    [getAppointmentPaymentStatus]
  );

  const updatePaymentStatus = useCallback(
    async (
      appointmentId: number,
      status: PaymentStatus
    ) => {
      return await updateAppointmentPaymentStatus(
        appointmentId,
        status
      );
    },
    [updateAppointmentPaymentStatus]
  );

  const retryPayment = useCallback(
    async (appointmentId: number) => {
      return await retryFailedPayment(appointmentId);
    },
    [retryFailedPayment]
  );

  const getAppointmentsByServiceType = useCallback(
  (serviceType: string): EnrichedAppointment[] => {
    return appointments.filter(
      (appointment: EnrichedAppointment) =>
        appointment.serviceType === serviceType
    );
  },
  [appointments]
);

const getAppointmentsByProviderName = useCallback(
  (providerName: string): EnrichedAppointment[] => {
    return appointments.filter(
      (appointment: EnrichedAppointment) =>
        appointment.providerName === providerName
    );
  },
  [appointments]
);

const getAppointmentsWithCards = useCallback((): EnrichedAppointment[] => {
  return appointments.filter(
    (appointment: EnrichedAppointment) =>
      Boolean(appointment.cardNumber)
  );
}, [appointments]);

const getConfirmedAppointments = useCallback((): EnrichedAppointment[] => {
  return appointments.filter(
    (appointment: EnrichedAppointment) =>
      appointment.status === 'Confirmed'
  );
}, [appointments]);

const getCheckedInAppointments = useCallback((): EnrichedAppointment[] => {
  return appointments.filter(
    (appointment: EnrichedAppointment) =>
      appointment.status === 'Checked-in'
  );
}, [appointments]);

const getCompletedAppointments = useCallback((): EnrichedAppointment[] => {
  return appointments.filter(
    (appointment: EnrichedAppointment) =>
      appointment.status === 'Completed'
  );
}, [appointments]);

const getPaidAppointments = useCallback((): EnrichedAppointment[] => {
  return appointments.filter(
    (appointment: EnrichedAppointment) =>
      appointment.paymentStatus === 'SUCCESS'
  );
}, [appointments]);

const getPendingPaymentAppointments = useCallback((): EnrichedAppointment[] => {
  return appointments.filter(
    (appointment: EnrichedAppointment) =>
      appointment.paymentStatus === 'PENDING'
  );
}, [appointments]);

const getFailedPaymentAppointments = useCallback((): EnrichedAppointment[] => {
  return appointments.filter(
    (appointment: EnrichedAppointment) =>
      appointment.paymentStatus === 'FAILED'
  );
}, [appointments]);

  const reschedule = useCallback(
    async (
      id: number,
      startTime: string,
      endTime: string
    ) => {
      await updateTiming(id, startTime, endTime);
    },
    [updateTiming]
  );

  return {
    // Data
    appointments,
    stats,
    checkedInPatients,
    upcomingAppointments,
    pastAppointments,
    todayAppointments,

    // State
    isLoading,
    error,
    filters,

    // Core actions
    updateStatus,
    updateTiming,
    checkinPatient,
    cancelAppointment,
    createAppointment,

    // Booking
    bookAppointment: bookNewAppointment,
    bookAppointmentWithPendingPayment:
      bookPendingAppointment,
    createChapaCheckout: createChapaPaymentLink,
    confirmAfterChapaPayment: confirmPayment,

    // Payments
    getPaymentStatus,
    updatePaymentStatus,
    retryFailedPayment: retryPayment,

    // Filters
    setFilters,
    clearError,

    // Refresh
    refreshData,

    // Raw fetch methods
    fetchAppointments,
    fetchStats,
    fetchCheckedInPatients,

    // Patient methods
    fetchPatientAppointments,
    fetchUpcomingPatientAppointments,
    fetchPastPatientAppointments,

    // Provider methods
    fetchProviderAppointments,
    fetchUpcomingProviderAppointments,
    fetchTodayProviderAppointments,

    // Helpers
    getAppointmentsForDate,
    getAppointmentsBySpecificStatus,
    getAppointmentsByPaymentStatusFilter,
    getAppointmentsByServiceType,
    getAppointmentsByProviderName,
    getAppointmentsWithCards,
    getConfirmedAppointments,
    getCheckedInAppointments,
    getCompletedAppointments,
    getPaidAppointments,
    getPendingPaymentAppointments,
    getFailedPaymentAppointments,

    // Legacy compatibility
    reschedule,
    cancel: cancelAppointment,
  };
};