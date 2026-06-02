// stores/payment.store.ts
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { paymentService, ChapaInitializeRequest, ChapaInitializeResponse, ChapaVerifyResponse } from '@/services/payment.service';

interface PaymentState {
  isLoading: boolean;
  error: string | null;
  
  initializeChapaPayment: (appointmentId: number, data: ChapaInitializeRequest) => Promise<ChapaInitializeResponse | null>;
  verifyChapaPayment: (txRef: string) => Promise<ChapaVerifyResponse | null>;
  chapaCallback: (trxRef: string) => Promise<ChapaVerifyResponse | null>;
  clearError: () => void;
}

export const usePaymentStore = create<PaymentState>()(
  devtools(
    (set) => ({
      isLoading: false,
      error: null,

      initializeChapaPayment: async (appointmentId: number, data: ChapaInitializeRequest) => {
        set({ isLoading: true, error: null }, false, 'payment/initializeChapaPayment');
        try {
          const result = await paymentService.initializeChapaPayment(appointmentId, data);
          set({ isLoading: false }, false, 'payment/initializeChapaPayment/success');
          return result;
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to initialize payment';
          set({ error: errorMessage, isLoading: false }, false, 'payment/initializeChapaPayment/error');
          return null;
        }
      },

      verifyChapaPayment: async (txRef: string) => {
        set({ isLoading: true, error: null }, false, 'payment/verifyChapaPayment');
        try {
          const result = await paymentService.verifyChapaPayment(txRef);
          set({ isLoading: false }, false, 'payment/verifyChapaPayment/success');
          return result;
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to verify payment';
          set({ error: errorMessage, isLoading: false }, false, 'payment/verifyChapaPayment/error');
          return null;
        }
      },

      chapaCallback: async (trxRef: string) => {
        set({ isLoading: true, error: null }, false, 'payment/chapaCallback');
        try {
          const result = await paymentService.chapaCallback(trxRef);
          set({ isLoading: false }, false, 'payment/chapaCallback/success');
          return result;
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to process callback';
          set({ error: errorMessage, isLoading: false }, false, 'payment/chapaCallback/error');
          return null;
        }
      },

      clearError: () => {
        set({ error: null }, false, 'payment/clearError');
      },
    }),
    { name: 'PaymentStore' }
  )
);