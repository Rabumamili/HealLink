// hooks/usePayment.ts
import { useEffect, useCallback } from 'react';
import { usePaymentStore } from '@/stores/slices/paymentSlice';
import { PaymentStatus } from '@/types/entities/appointment.types';
import { CreatePaymentData } from '@/services/payment.service';

interface UsePaymentOptions {
  autoFetch?: boolean;
  patientId?: number;
  appointmentId?: number;
  paymentId?: number;
}

export const usePayment = (options?: UsePaymentOptions) => {
  const {
    payments,
    currentPayment,
    isLoading,
    error,
    fetchPatientPayments,
    fetchPaymentById,
    fetchPaymentByAppointmentId,
    createPayment,
    updatePaymentStatus,
    initializeChapaPayment,
    clearCurrentPayment,
    clearError,
  } = usePaymentStore();

  const { autoFetch = true, patientId, appointmentId, paymentId } = options || {};

  // Auto-fetch based on options
  useEffect(() => {
    if (autoFetch) {
      if (patientId) {
        fetchPatientPayments(patientId);
      } else if (appointmentId) {
        fetchPaymentByAppointmentId(appointmentId);
      } else if (paymentId) {
        fetchPaymentById(paymentId);
      }
    }
  }, [autoFetch, patientId, appointmentId, paymentId, fetchPatientPayments, fetchPaymentByAppointmentId, fetchPaymentById]);

  // Get payment by appointment ID (memoized)
  const getPaymentForAppointment = useCallback((appointmentId: number) => {
    return payments.find(p => p.appointmentId === appointmentId);
  }, [payments]);

  // Get payment by ID (memoized)
  const getPaymentById = useCallback((id: number) => {
    return payments.find(p => p.id === id);
  }, [payments]);

  // Check if payment exists for appointment
  const hasPaymentForAppointment = useCallback((appointmentId: number) => {
    return payments.some(p => p.appointmentId === appointmentId);
  }, [payments]);

  // Get successful payments
  const getSuccessfulPayments = useCallback(() => {
    return payments.filter(p => p.status === 'SUCCESS');
  }, [payments]);

  // Get pending payments
  const getPendingPayments = useCallback(() => {
    return payments.filter(p => p.status === 'PENDING');
  }, [payments]);

  // Get failed payments
  const getFailedPayments = useCallback(() => {
    return payments.filter(p => p.status === 'FAILED');
  }, [payments]);

  // Get total amount spent
  const getTotalAmountSpent = useCallback(() => {
    return payments
      .filter(p => p.status === 'SUCCESS')
      .reduce((total, payment) => total + payment.amount, 0);
  }, [payments]);

  // Process payment with Chapa
  const processPayment = useCallback(async (
    data: {
      amount: number;
      email: string;
      firstName: string;
      lastName: string;
      appointmentId: number;
      patientId: number;
    }
  ) => {
    const txRef = `TX-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    try {
      // Initialize payment with Chapa
      const paymentResult = await initializeChapaPayment({
        amount: data.amount,
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        txRef,
        callbackUrl: `${window.location.origin}/api/payment/callback`,
        returnUrl: `${window.location.origin}/patient/payments/status?txRef=${txRef}`,
      });

      if (!paymentResult) {
        throw new Error('Failed to initialize payment');
      }

      // Create payment record
      const newPayment = await createPayment({
        patientId: data.patientId,
        appointmentId: data.appointmentId,
        provider: 'chapa',
        txRef,
        amount: data.amount,
        status: 'PENDING',
        checkoutUrl: paymentResult.checkoutUrl,
        chapaReference: paymentResult.reference,
      });

      return {
        payment: newPayment,
        checkoutUrl: paymentResult.checkoutUrl,
      };
    } catch (error) {
      console.error('Payment processing error:', error);
      throw error;
    }
  }, [initializeChapaPayment, createPayment]);

  // Verify payment status
  const verifyPayment = useCallback(async (paymentId: number, reference: string) => {
    // This would typically be handled by a webhook or callback
    // For now, we'll manually update
    await updatePaymentStatus(paymentId, 'SUCCESS');
  }, [updatePaymentStatus]);

  return {
    // State
    payments,
    currentPayment,
    isLoading,
    error,
    
    // Actions
    fetchPatientPayments,
    fetchPaymentById,
    fetchPaymentByAppointmentId,
    createPayment,
    updatePaymentStatus,
    initializeChapaPayment,
    clearCurrentPayment,
    clearError,
    processPayment,
    verifyPayment,
    
    // Helper functions
    getPaymentForAppointment,
    getPaymentById,
    hasPaymentForAppointment,
    getSuccessfulPayments,
    getPendingPayments,
    getFailedPayments,
    getTotalAmountSpent,
  };
};