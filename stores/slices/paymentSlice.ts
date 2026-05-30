// stores/payment.store.ts
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { Payment } from '@/types/entities/payment.types';
import { PaymentStatus } from '@/types/entities/appointment.types';
import { paymentService, CreatePaymentData } from '@/services/payment.service';

interface PaymentState {
  // State
  payments: Payment[];
  currentPayment: Payment | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchPatientPayments: (patientId: number) => Promise<void>;
  fetchPaymentById: (id: number) => Promise<void>;
  fetchPaymentByAppointmentId: (appointmentId: number) => Promise<void>;
  createPayment: (data: CreatePaymentData) => Promise<Payment | null>;
  updatePaymentStatus: (id: number, status: PaymentStatus) => Promise<boolean>;
  initializeChapaPayment: (data: {
    amount: number;
    email: string;
    firstName: string;
    lastName: string;
    txRef: string;
    callbackUrl: string;
    returnUrl: string;
  }) => Promise<{ checkoutUrl: string; reference: string } | null>;
  clearCurrentPayment: () => void;
  clearError: () => void;
}

export const usePaymentStore = create<PaymentState>()(
  devtools(
    (set, get) => ({
      // Initial state
      payments: [],
      currentPayment: null,
      isLoading: false,
      error: null,

      // Fetch all payments for a patient
      fetchPatientPayments: async (patientId: number) => {
        set({ isLoading: true, error: null }, false, 'payment/fetchPatientPayments');
        try {
          const payments = await paymentService.getPatientPayments(patientId);
          set({ payments, isLoading: false }, false, 'payment/fetchPatientPayments/success');
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to fetch payments';
          set({ error: errorMessage, isLoading: false }, false, 'payment/fetchPatientPayments/error');
        }
      },

      // Fetch payment by ID
      fetchPaymentById: async (id: number) => {
        set({ isLoading: true, error: null }, false, 'payment/fetchPaymentById');
        try {
          const payment = await paymentService.getPaymentById(id);
          set({ currentPayment: payment, isLoading: false }, false, 'payment/fetchPaymentById/success');
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to fetch payment';
          set({ error: errorMessage, isLoading: false }, false, 'payment/fetchPaymentById/error');
        }
      },

      // Fetch payment by appointment ID
      fetchPaymentByAppointmentId: async (appointmentId: number) => {
        set({ isLoading: true, error: null }, false, 'payment/fetchPaymentByAppointmentId');
        try {
          const payment = await paymentService.getPaymentByAppointmentId(appointmentId);
          set({ currentPayment: payment, isLoading: false }, false, 'payment/fetchPaymentByAppointmentId/success');
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to fetch payment';
          set({ error: errorMessage, isLoading: false }, false, 'payment/fetchPaymentByAppointmentId/error');
        }
      },

      // Create a new payment
      createPayment: async (data: CreatePaymentData) => {
        set({ isLoading: true, error: null }, false, 'payment/createPayment');
        try {
          const newPayment = await paymentService.createPayment(data);
          set(state => ({
            payments: [newPayment, ...state.payments],
            currentPayment: newPayment,
            isLoading: false,
          }), false, 'payment/createPayment/success');
          return newPayment;
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to create payment';
          set({ error: errorMessage, isLoading: false }, false, 'payment/createPayment/error');
          return null;
        }
      },

      // Update payment status
      updatePaymentStatus: async (id: number, status: PaymentStatus) => {
        set({ isLoading: true, error: null }, false, 'payment/updatePaymentStatus');
        try {
          const success = await paymentService.updatePaymentStatus(id, status);
          if (success) {
            // Update local state
            set(state => ({
              payments: state.payments.map(payment =>
                payment.id === id ? { ...payment, status, updatedAt: new Date().toISOString() } : payment
              ),
              currentPayment: state.currentPayment?.id === id 
                ? { ...state.currentPayment, status, updatedAt: new Date().toISOString() }
                : state.currentPayment,
              isLoading: false,
            }), false, 'payment/updatePaymentStatus/success');
          }
          return success;
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to update payment status';
          set({ error: errorMessage, isLoading: false }, false, 'payment/updatePaymentStatus/error');
          return false;
        }
      },

      // Initialize Chapa payment
      initializeChapaPayment: async (data) => {
        set({ isLoading: true, error: null }, false, 'payment/initializeChapaPayment');
        try {
          const result = await paymentService.initializeChapaPayment(data);
          set({ isLoading: false }, false, 'payment/initializeChapaPayment/success');
          return result;
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to initialize payment';
          set({ error: errorMessage, isLoading: false }, false, 'payment/initializeChapaPayment/error');
          return null;
        }
      },

      // Clear current payment
      clearCurrentPayment: () => {
        set({ currentPayment: null }, false, 'payment/clearCurrentPayment');
      },

      // Clear error
      clearError: () => {
        set({ error: null }, false, 'payment/clearError');
      },
    }),
    { name: 'PaymentStore' }
  )
);