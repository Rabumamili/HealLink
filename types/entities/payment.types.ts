// types/entities/payment.types.ts

export const PAYMENT_STATUS = {
  PENDING: 'PENDING',
  SUCCESS: 'SUCCESS',
  FAILED: 'FAILED'
} as const;

export type PaymentStatus = typeof PAYMENT_STATUS[keyof typeof PAYMENT_STATUS];

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
  currency?: string; // Default to 'ETB'
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

// Chapa webhook payload - keep snake_case as it comes from external API
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

// Fixed: Use undefined instead of 'all'
export interface PaymentFilters {
  patientId?: number;
  appointmentId?: number;
  status?: PaymentStatus;
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
  successRate: number; // percentage
}

// Helper with proper typing
export const getPaymentStatusConfig = (status: PaymentStatus) => {
  const configs: Record<PaymentStatus, { label: string; color: 'warning' | 'success' | 'error'; icon: string }> = {
    PENDING: { label: 'Pending', color: 'warning', icon: 'clock' },
    SUCCESS: { label: 'Success', color: 'success', icon: 'check-circle' },
    FAILED: { label: 'Failed', color: 'error', icon: 'x-circle' },
  };
  return configs[status];
};