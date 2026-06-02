// hooks/usePayment.ts
import { useCallback } from 'react';
import { usePaymentStore } from '@/stores/slices/paymentSlice';
import { ChapaInitializeRequest, ChapaInitializeResponse, ChapaVerifyResponse } from '@/services/payment.service';

export const usePayment = (options?: { patientId?: number; autoFetch?: boolean }) => {
  const {
    isLoading,
    error,
    initializeChapaPayment,
    verifyChapaPayment,
    chapaCallback,
    clearError,
  } = usePaymentStore();

  const processPayment = useCallback(async (
    appointmentId: number,
    data: ChapaInitializeRequest
  ): Promise<ChapaInitializeResponse | null> => {
    return await initializeChapaPayment(appointmentId, data);
  }, [initializeChapaPayment]);

  const verifyPayment = useCallback(async (txRef: string): Promise<ChapaVerifyResponse | null> => {
    return await verifyChapaPayment(txRef);
  }, [verifyChapaPayment]);

  const handleCallback = useCallback(async (trxRef: string): Promise<ChapaVerifyResponse | null> => {
    return await chapaCallback(trxRef);
  }, [chapaCallback]);

  // Payment history - API endpoint not yet implemented
  // TODO: Implement payment history fetching when backend endpoint is available
  const payments: any[] = [];
  const getTotalAmountSpent = useCallback(() => 0, []);

  return {
    isLoading,
    error,
    processPayment,
    verifyPayment,
    handleCallback,
    clearError,
    payments,
    getTotalAmountSpent,
  };
};