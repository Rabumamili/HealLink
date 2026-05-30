// types/entities/payment.types.ts

export type PaymentStatus = 'PENDING' | 'SUCCESS' | 'FAILED';

export interface Payment {
  id: number;
  patientId: number;
  appointmentId: number;
  provider: 'chapa';
  txRef: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  checkoutUrl: string | null;
  chapaReference: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePaymentDTO {
  patientId: number;
  appointmentId: number;
  amount: number;
  currency?: string;
}

export interface InitiatePaymentRequest {
  appointmentId: number;
  amount: number;
  currency?: string;
  patientId: number;
  email: string;
  phone?: string;
  patientName?: string;
}

export interface InitiatePaymentResponse {
  success: boolean;
  paymentId?: number;
  checkoutUrl?: string;
  txRef?: string;
  message?: string;
}

export interface VerifyPaymentResponse {
  success: boolean;
  status: PaymentStatus;
  payment?: Payment;
  message?: string;
}

export interface ChapaWebhookPayload {
  tx_ref: string;
  reference: string;
  status: 'success' | 'failed' | 'pending';
  amount: number;
  currency: string;
  payment_id?: string;
  customer: {
    email: string;
    name?: string;
    phone_number?: string;
  };
}

export interface ChapaInitializeResponse {
  status: string;
  message: string;
  data: {
    checkout_url: string;
    tx_ref: string;
    reference?: string;
  };
}

export interface ChapaVerifyResponse {
  status: string;
  message: string;
  data: {
    tx_ref: string;
    reference: string;
    amount: number;
    currency: string;
    status: 'success' | 'failed' | 'pending';
    payment_id?: string;
    customer?: {
      email: string;
      name?: string;
      phone_number?: string;
    };
    created_at?: string;
    updated_at?: string;
  };
}

export interface PaymentWithDetails extends Payment {
  patientName?: string;
  patientEmail?: string;
  patientPhone?: string;
  appointmentDate?: string;
  serviceName?: string;
}

export interface PaymentFilters {
  patientId?: number;
  appointmentId?: number;
  status?: PaymentStatus | 'all';
  startDate?: string;
  endDate?: string;
  searchTerm?: string;
}

export interface PaymentStats {
  total: number;
  pending: number;
  success: number;
  failed: number;
  totalAmount: number;
  successAmount: number;
  successRate: number;
}

// Helper functions
export const canConfirmAppointment = (paymentStatus: PaymentStatus): boolean => {
  return paymentStatus === 'SUCCESS';
};

export const getAppointmentStatusFromPayment = (
  paymentStatus: PaymentStatus,
  defaultStatus: 'Scheduled' | 'Confirmed' | 'Cancelled' = 'Scheduled'
): 'Scheduled' | 'Confirmed' | 'Cancelled' => {
  switch (paymentStatus) {
    case 'SUCCESS':
      return 'Confirmed';
    case 'FAILED':
      return 'Cancelled';
    case 'PENDING':
      return defaultStatus;
    default:
      return defaultStatus;
  }
};

export const getPaymentStatusConfig = (status: PaymentStatus) => {
  switch (status) {
    case 'PENDING':
      return { label: 'Pending', color: 'warning', icon: 'clock' };
    case 'SUCCESS':
      return { label: 'Success', color: 'success', icon: 'check-circle' };
    case 'FAILED':
      return { label: 'Failed', color: 'error', icon: 'x-circle' };
  }
};