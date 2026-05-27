// services/appointment.service.ts
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
import { MockServiceRegistry } from './mock/mock.service';

class AppointmentService extends ApiService {
  private useMock = true;
  private registry: MockServiceRegistry;

  constructor() {
    super();
    this.registry = MockServiceRegistry.getInstance();
  }

  async getAppointments(filters?: AppointmentFilters): Promise<EnrichedAppointment[]> {
    if (this.useMock) {
      let appointments = this.registry.getAppointments().findAll();
      
      if (filters?.searchTerm) {
        const search = filters.searchTerm.toLowerCase();
        appointments = appointments.filter(a => 
          a.patientName.toLowerCase().includes(search) ||
          (a.serviceName && a.serviceName.toLowerCase().includes(search)) ||
          a.id.toString().includes(search) ||
          a.notes?.toLowerCase().includes(search) ||
          (a.cardNumber && a.cardNumber.toLowerCase().includes(search))
        );
      }
      
      if (filters?.status && filters.status !== 'all') {
        appointments = appointments.filter(a => a.status === filters.status);
      }
      
      if (filters?.startDate) {
        appointments = appointments.filter(a => {
          const appointmentDate = a.scheduledDateTime.split(' ')[0];
          return appointmentDate >= filters.startDate!;
        });
      }
      
      if (filters?.endDate) {
        appointments = appointments.filter(a => {
          const appointmentDate = a.scheduledDateTime.split(' ')[0];
          return appointmentDate <= filters.endDate!;
        });
      }
      
      if (filters?.patientId) {
        appointments = appointments.filter(a => a.patientId === filters.patientId);
      }
      
      if (filters?.serviceId) {
        appointments = appointments.filter(a => a.serviceId === filters.serviceId);
      }
      
      if (filters?.type && filters.type !== 'all') {
        appointments = appointments.filter(a => a.serviceType === filters.type);
      }
      
      if (filters?.hasCard !== undefined) {
        if (filters.hasCard) {
          appointments = appointments.filter(a => a.cardId !== null);
        } else {
          appointments = appointments.filter(a => a.cardId === null);
        }
      }
      
      if (filters?.cardStatus) {
        appointments = appointments.filter(a => a.cardStatus === filters.cardStatus);
      }
      
      return appointments;
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
        queueNumber: index + 1,
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

  async getPatientAppointments(patientId: number): Promise<EnrichedAppointment[]> {
    if (this.useMock) {
      return this.registry.getAppointments().findByPatientId(patientId);
    }
    return this.get<EnrichedAppointment[]>(`/patients/${patientId}/appointments`);
  }

  /**
   * Direct appointment creation (admin/internal use)
   */
  async createAppointment(data: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'>): Promise<Appointment> {
    if (this.useMock) {
      const newAppointment = this.registry.getAppointments().createAppointment(data);
      return newAppointment;
    }
    return this.post<Appointment>('/appointments', data);
  }

  /**
   * BOOKING FLOW WITH CHAPA PAYMENT
   * - Creates appointment with status="Booked"
   * - Processes payment via Chapa
   * - Updates status to "Confirmed" after payment
   * - Generates card number (replaces QR code)
   */
  async bookAppointment(request: BookAppointmentRequest): Promise<BookAppointmentResponse> {
    if (this.useMock) {
      return this.registry.getAppointments().bookAppointment(request);
    }
    return this.post<BookAppointmentResponse>('/appointments/book', request);
  }

  /**
   * Create Chapa checkout URL for payment
   */
  async createChapaCheckout(request: BookAppointmentRequest): Promise<{ checkoutUrl: string; txRef: string }> {
    if (this.useMock) {
      return this.registry.getAppointments().createChapaCheckout(request);
    }
    return this.post<{ checkoutUrl: string; txRef: string }>('/appointments/chapa-checkout', request);
  }

  /**
   * Verify Chapa payment (webhook)
   */
  async verifyChapaPayment(txRef: string): Promise<{ verified: boolean; amount: number; status: string }> {
    if (this.useMock) {
      return this.registry.getAppointments().verifyChapaPayment(txRef);
    }
    return this.get<{ verified: boolean; amount: number; status: string }>(`/payments/chapa/verify?tx_ref=${txRef}`);
  }

  /**
   * Book appointment with pending payment (pay later at clinic)
   */
  async bookAppointmentWithPendingPayment(request: BookAppointmentRequest): Promise<BookAppointmentResponse> {
    if (this.useMock) {
      return this.registry.getAppointments().bookAppointmentWithPendingPayment(request);
    }
    return this.post<BookAppointmentResponse>('/appointments/book-pending', request);
  }

  /**
   * Confirm appointment after Chapa payment webhook
   */
  async confirmAfterChapaPayment(appointmentId: number, paymentId: number, txRef: string): Promise<BookAppointmentResponse> {
    if (this.useMock) {
      return this.registry.getAppointments().confirmAfterChapaPayment(appointmentId, paymentId, txRef);
    }
    return this.post<BookAppointmentResponse>(`/appointments/${appointmentId}/confirm-chapa-payment`, { paymentId, txRef });
  }

  async getUpcomingAppointments(patientId: number): Promise<EnrichedAppointment[]> {
    if (this.useMock) {
      const appointments = this.registry.getAppointments().findByPatientId(patientId);
      const now = new Date().toISOString();
      return appointments.filter(a => 
        a.scheduledDateTime >= now && 
        a.status !== 'Completed' && 
        a.status !== 'Cancelled' &&
        a.status !== 'No-show'
      );
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
      return this.registry.getAppointments().findByProviderId(providerId);
    }
    return this.get<EnrichedAppointment[]>(`/providers/${providerId}/appointments`);
  }
}

export const appointmentService = new AppointmentService();