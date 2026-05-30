// services/appointment.service.ts - Fully Fixed
import { ApiService } from './api.service';
import { 
  Appointment, 
  AppointmentFilters, 
  AppointmentStats, 
  CheckedInPatient,
  EnrichedAppointment,
  AppointmentStatus,
  BookAppointmentRequest,
  BookAppointmentResponse
} from '@/types/entities/appointment.types';
import { PaymentStatus } from '@/types/entities/payment.types';
import { MockServiceRegistry } from './mock';

class AppointmentService extends ApiService {
  private useMock = true;
  private registry: MockServiceRegistry;

  constructor() {
    super();
    this.registry = MockServiceRegistry.getInstance();
  }

  async getAppointments(filters?: AppointmentFilters): Promise<EnrichedAppointment[]> {
    if (this.useMock) {
      // Use the enhanced getAppointmentsWithFilters method from mock service
      return this.registry.getAppointments().getAppointmentsWithFilters(filters || {});
    }
    
    let endpoint = '/appointments';
    if (filters) {
      const params = new URLSearchParams();
      if (filters.searchTerm) params.append('search', filters.searchTerm);
      if (filters.status && filters.status !== 'all') params.append('status', filters.status);
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);
      if (filters.patientId) params.append('patientId', filters.patientId.toString());
      if (filters.serviceId) params.append('serviceId', filters.serviceId.toString());
      if (filters.providerId) params.append('providerId', filters.providerId.toString());
      if (filters.type && filters.type !== 'all') params.append('type', filters.type);
      if (filters.hasCard !== undefined) params.append('hasCard', filters.hasCard.toString());
      if (filters.cardStatus) params.append('cardStatus', filters.cardStatus);
      if (params.toString()) endpoint += `?${params.toString()}`;
    }
    return this.get<EnrichedAppointment[]>(endpoint);
  }

  async getAppointmentById(id: number): Promise<EnrichedAppointment | undefined> {
    if (this.useMock) {
      return this.registry.getAppointments().findById(id);
    }
    return this.get<EnrichedAppointment>(`/appointments/${id}`);
  }

  async getAppointmentStats(): Promise<AppointmentStats> {
    if (this.useMock) {
      return this.registry.getAppointments().getStats();
    }
    return this.get<AppointmentStats>('/appointments/stats');
  }

  async getCheckedInPatients(): Promise<CheckedInPatient[]> {
    if (this.useMock) {
      const appointments = this.registry.getAppointments()
        .findAll()
        .filter(a => a.status === 'Checked-in' || a.status === 'In Progress');
      
      return appointments.map((appointment, index) => ({
        id: appointment.id,
        patientName: appointment.patientName,
        cardNumber: appointment.cardNumber || '',
        serviceName: appointment.serviceName || 'Unknown Service',
        serviceType: appointment.serviceType,
        checkInTime: appointment.checkInTime || new Date().toISOString(),
        scheduledTime: appointment.scheduledDateTime,
        status: appointment.status === 'Checked-in' ? 'waiting' : 'in-progress',
        estimatedWaitMinutes: appointment.estimatedWaitMinutes || 15,
        cardId: appointment.cardId || undefined,
        appointmentId: appointment.id
      }));
    }
    return this.get<CheckedInPatient[]>('/appointments/checked-in');
  }

  async updateAppointmentStatus(id: number, status: AppointmentStatus): Promise<EnrichedAppointment | undefined> {
    if (this.useMock) {
      return this.registry.getAppointments().updateStatus(id, status);
    }
    return this.put<EnrichedAppointment>(`/appointments/${id}/status`, { status });
  }

  async checkInPatient(id: number, checkInTime: string, estimatedWaitMinutes: number): Promise<EnrichedAppointment | undefined> {
    if (this.useMock) {
      return this.registry.getAppointments().updateCheckIn(id, checkInTime, estimatedWaitMinutes);
    }
    return this.put<EnrichedAppointment>(`/appointments/${id}/checkin`, { checkInTime, estimatedWaitMinutes });
  }

  async updateAppointmentTiming(id: number, startTime: string, endTime: string): Promise<EnrichedAppointment | undefined> {
    if (this.useMock) {
      return this.registry.getAppointments().updateTiming(id, startTime, endTime);
    }
    return this.put<EnrichedAppointment>(`/appointments/${id}/timing`, { startTime, endTime });
  }

  async cancelAppointment(id: number): Promise<boolean> {
    if (this.useMock) {
      const updated = this.registry.getAppointments().updateStatus(id, 'Cancelled');
      return !!updated;
    }
    return this.delete(`/appointments/${id}`);
  }

  /**
   * Get appointments for a specific patient
   * This uses the dedicated method from the mock service
   */
  async getPatientAppointments(patientId: number): Promise<EnrichedAppointment[]> {
    if (this.useMock) {
      return this.registry.getAppointments().getAppointmentsForPatient(patientId);
    }
    return this.get<EnrichedAppointment[]>(`/patients/${patientId}/appointments`);
  }

  /**
   * Get upcoming appointments for a patient
   */
  async getUpcomingPatientAppointments(patientId: number): Promise<EnrichedAppointment[]> {
    if (this.useMock) {
      return this.registry.getAppointments().getUpcomingAppointmentsForPatient(patientId);
    }
    return this.get<EnrichedAppointment[]>(`/patients/${patientId}/appointments/upcoming`);
  }

  /**
   * Get past appointments for a patient
   */
  async getPastPatientAppointments(patientId: number): Promise<EnrichedAppointment[]> {
    if (this.useMock) {
      return this.registry.getAppointments().getPastAppointmentsForPatient(patientId);
    }
    return this.get<EnrichedAppointment[]>(`/patients/${patientId}/appointments/past`);
  }

  /**
   * Get appointments for a specific provider (doctor, clinic, diagnostic center)
   */
  async getProviderAppointments(providerId: number): Promise<EnrichedAppointment[]> {
    if (this.useMock) {
      return this.registry.getAppointments().getAppointmentsForProvider(providerId);
    }
    return this.get<EnrichedAppointment[]>(`/providers/${providerId}/appointments`);
  }

  /**
   * Get upcoming appointments for a provider
   */
  async getUpcomingProviderAppointments(providerId: number): Promise<EnrichedAppointment[]> {
    if (this.useMock) {
      return this.registry.getAppointments().getUpcomingAppointmentsForProvider(providerId);
    }
    return this.get<EnrichedAppointment[]>(`/providers/${providerId}/appointments/upcoming`);
  }

  /**
   * Get today's appointments for a provider
   */
  async getTodayProviderAppointments(providerId: number): Promise<EnrichedAppointment[]> {
    if (this.useMock) {
      return this.registry.getAppointments().getTodayAppointmentsForProvider(providerId);
    }
    return this.get<EnrichedAppointment[]>(`/providers/${providerId}/appointments/today`);
  }

  async createAppointment(data: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'>): Promise<Appointment> {
    if (this.useMock) {
      return this.registry.getAppointments().createAppointment(data);
    }
    return this.post<Appointment>('/appointments', data);
  }

  async bookAppointment(request: BookAppointmentRequest): Promise<BookAppointmentResponse> {
    if (this.useMock) {
      return this.registry.getAppointments().bookAppointment(request);
    }
    return this.post<BookAppointmentResponse>('/appointments/book', request);
  }

  async createChapaCheckout(request: BookAppointmentRequest): Promise<{ checkoutUrl: string; txRef: string }> {
    if (this.useMock) {
      return this.registry.getAppointments().createChapaCheckout(request);
    }
    return this.post<{ checkoutUrl: string; txRef: string }>('/appointments/chapa-checkout', request);
  }

  async verifyChapaPayment(txRef: string): Promise<{ verified: boolean; amount: number; status: 'success' | 'failed' | 'pending' }> {
    if (this.useMock) {
      return this.registry.getAppointments().verifyChapaPayment(txRef);
    }
    return this.get<{ verified: boolean; amount: number; status: 'success' | 'failed' | 'pending' }>(`/payments/chapa/verify?tx_ref=${txRef}`);
  }

  async bookAppointmentWithPendingPayment(request: BookAppointmentRequest): Promise<BookAppointmentResponse> {
    if (this.useMock) {
      return this.registry.getAppointments().bookAppointmentWithPendingPayment(request);
    }
    return this.post<BookAppointmentResponse>('/appointments/book-pending', request);
  }

  async confirmAfterChapaPayment(appointmentId: number, paymentId: number, txRef: string): Promise<BookAppointmentResponse> {
    if (this.useMock) {
      return this.registry.getAppointments().confirmAfterChapaPayment(appointmentId, paymentId, txRef);
    }
    return this.post<BookAppointmentResponse>(`/appointments/${appointmentId}/confirm-chapa-payment`, { paymentId, txRef });
  }

  async getAppointmentPaymentStatus(appointmentId: number): Promise<PaymentStatus> {
    if (this.useMock) {
      return this.registry.getAppointments().getPaymentStatus(appointmentId);
    }
    return this.get<PaymentStatus>(`/appointments/${appointmentId}/payment-status`);
  }

  async updateAppointmentPaymentStatus(appointmentId: number, status: PaymentStatus): Promise<boolean> {
    if (this.useMock) {
      return this.registry.getAppointments().updatePaymentStatus(appointmentId, status);
    }
    return this.put<boolean>(`/appointments/${appointmentId}/payment-status`, { status });
  }

  async retryFailedPayment(appointmentId: number): Promise<{ checkoutUrl: string; txRef: string }> {
    if (this.useMock) {
      const appointment = await this.getAppointmentById(appointmentId);
      if (!appointment) {
        throw new Error('Appointment not found');
      }
      
      const request: BookAppointmentRequest = {
        patientId: appointment.patientId,
        serviceId: appointment.serviceId,
        slotId: appointment.slotId,
        scheduledDateTime: appointment.scheduledDateTime,
        paymentConfirmed: false,
        notes: appointment.notes
      };
      
      return this.createChapaCheckout(request);
    }
    return this.post<{ checkoutUrl: string; txRef: string }>(`/appointments/${appointmentId}/retry-payment`, {});
  }

  async getUpcomingAppointments(patientId: number): Promise<EnrichedAppointment[]> {
    if (this.useMock) {
      return this.registry.getAppointments().getUpcomingAppointmentsForPatient(patientId);
    }
    return this.get<EnrichedAppointment[]>(`/patients/${patientId}/appointments/upcoming`);
  }

  async getAppointmentsByDateRange(startDate: string, endDate: string): Promise<EnrichedAppointment[]> {
    if (this.useMock) {
      return this.registry.getAppointments().findByDateRange(startDate, endDate);
    }
    const params = new URLSearchParams({ startDate, endDate });
    return this.get<EnrichedAppointment[]>(`/appointments/range?${params.toString()}`);
  }

  async getTodaysAppointments(): Promise<EnrichedAppointment[]> {
    const today = new Date().toISOString().split('T')[0];
    if (this.useMock) {
      return this.registry.getAppointments().findByDate(today);
    }
    return this.get<EnrichedAppointment[]>(`/appointments?date=${today}`);
  }

  async getAppointmentsByProvider(providerId: number): Promise<EnrichedAppointment[]> {
    if (this.useMock) {
      return this.registry.getAppointments().getAppointmentsForProvider(providerId);
    }
    return this.get<EnrichedAppointment[]>(`/providers/${providerId}/appointments`);
  }
}

export const appointmentService = new AppointmentService();