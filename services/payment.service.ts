// services/payment.service.ts
import { PaymentRepository } from './mock/payment.repository';
import { Payment } from '@/types/entities/payment.types';
import { PaymentStatus } from '@/types/entities/appointment.types';

export interface CreatePaymentData {
  patientId: number;
  appointmentId: number;
  provider: 'chapa';
  txRef: string;
  amount: number;
  currency?: string;
  status: PaymentStatus;
  checkoutUrl?: string | null;
  chapaReference?: string | null;
}

export interface UpdatePaymentStatusData {
  status: PaymentStatus;
}

class PaymentService {
  private repository: PaymentRepository;

  constructor() {
    this.repository = PaymentRepository.getInstance();
  }

  /**
   * Create a new payment
   */
  async createPayment(data: CreatePaymentData): Promise<Payment> {
    try {
      // Validate required fields
      if (!data.patientId || !data.appointmentId || !data.txRef || !data.amount) {
        throw new Error('Missing required payment fields');
      }

      const payment = this.repository.create({
        patientId: data.patientId,
        appointmentId: data.appointmentId,
        provider: data.provider,
        txRef: data.txRef,
        amount: data.amount,
        currency: data.currency || 'ETB',
        status: data.status,
        checkoutUrl: data.checkoutUrl || null,
        chapaReference: data.chapaReference || null,
      });

      return payment;
    } catch (error) {
      console.error('Error creating payment:', error);
      throw error;
    }
  }

  /**
   * Get payment by ID
   */
  async getPaymentById(id: number): Promise<Payment | null> {
    try {
      const payment = this.repository.findById(id);
      return payment || null;
    } catch (error) {
      console.error('Error fetching payment:', error);
      throw error;
    }
  }

  /**
   * Get payment by appointment ID
   */
  async getPaymentByAppointmentId(appointmentId: number): Promise<Payment | null> {
    try {
      const payment = this.repository.findByAppointmentId(appointmentId);
      return payment || null;
    } catch (error) {
      console.error('Error fetching payment by appointment:', error);
      throw error;
    }
  }

  /**
   * Get all payments for a patient
   */
  async getPatientPayments(patientId: number): Promise<Payment[]> {
    try {
      const payments = this.repository.findByPatientId(patientId);
      return payments.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    } catch (error) {
      console.error('Error fetching patient payments:', error);
      throw error;
    }
  }

  /**
   * Update payment status
   */
  async updatePaymentStatus(id: number, status: PaymentStatus): Promise<boolean> {
    try {
      const success = this.repository.updateStatus(id, status);
      if (!success) {
        throw new Error(`Payment with ID ${id} not found`);
      }
      return success;
    } catch (error) {
      console.error('Error updating payment status:', error);
      throw error;
    }
  }

  /**
   * Initialize Chapa payment
   * This would integrate with your actual Chapa API
   */
  async initializeChapaPayment(data: {
    amount: number;
    email: string;
    firstName: string;
    lastName: string;
    txRef: string;
    callbackUrl: string;
    returnUrl: string;
  }): Promise<{ checkoutUrl: string; reference: string }> {
    try {
      // This is a mock implementation
      // Replace with actual Chapa API integration
      const response = await fetch('/api/chapa/initialize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to initialize payment');
      }

      const result = await response.json();
      return {
        checkoutUrl: result.data.checkout_url,
        reference: result.data.reference,
      };
    } catch (error) {
      console.error('Error initializing Chapa payment:', error);
      throw error;
    }
  }

  /**
   * Verify payment status from Chapa
   */
  async verifyPaymentStatus(reference: string): Promise<PaymentStatus> {
    try {
      // This is a mock implementation
      // Replace with actual Chapa API integration
      const response = await fetch(`/api/chapa/verify/${reference}`, {
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error('Failed to verify payment');
      }

      const result = await response.json();
      return result.data.status === 'success' ? 'SUCCESS' : 'FAILED';
    } catch (error) {
      console.error('Error verifying payment:', error);
      throw error;
    }
  }
}

export const paymentService = new PaymentService();