import { BaseRepository } from './base.repository';
import { Payment } from '@/types/entities/payment.types';
import { PaymentStatus } from '@/types/entities/appointment.types';

export class PaymentRepository extends BaseRepository<Payment> {
  private static instance: PaymentRepository;
  
  private constructor() {
    super();
    this.initializeMockData();
  }
  
  static getInstance(): PaymentRepository {
    if (!PaymentRepository.instance) {
      PaymentRepository.instance = new PaymentRepository();
    }
    return PaymentRepository.instance;
  }
  
  private initializeMockData(): void {
    this.items = [
      {
        id: 5001,
        patientId: 201,
        appointmentId: 1,
        provider: 'chapa',
        txRef: 'CHAPA-1234567890-abc123',
        amount: 500,
        currency: 'ETB',
        status: 'SUCCESS',
        checkoutUrl: null,
        chapaReference: 'CHAPA-REF-001',
        createdAt: '2026-05-01T10:00:00Z',
        updatedAt: '2026-05-01T10:05:00Z'
      }
    ];
  }
  
  create(data: Omit<Payment, 'id' | 'createdAt' | 'updatedAt'>): Payment {
    const newPayment: Payment = {
      id: Date.now(),
      patientId: data.patientId,
      appointmentId: data.appointmentId,
      provider: data.provider,
      txRef: data.txRef,
      amount: data.amount,
      currency: data.currency || 'ETB',
      status: data.status,
      checkoutUrl: data.checkoutUrl ?? null,
      chapaReference: data.chapaReference ?? null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.items.push(newPayment);
    return newPayment;
  }
  
  findById(id: number): Payment | undefined {
    return this.items.find(p => p.id === id);
  }
  
  updateStatus(id: number, status: PaymentStatus): boolean {
    const payment = this.findById(id);
    if (payment) {
      payment.status = status;
      payment.updatedAt = new Date().toISOString();
      return true;
    }
    return false;
  }
  
  findByAppointmentId(appointmentId: number): Payment | undefined {
    return this.items.find(p => p.appointmentId === appointmentId);
  }
  
  findByPatientId(patientId: number): Payment[] {
    return this.items.filter(p => p.patientId === patientId);
  }
}