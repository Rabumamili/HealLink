// services/appointment.service.ts
import { ApiService } from './api.service';
import { EnrichedAppointment } from '@/types/entities/appointment.types';
import { toast } from 'sonner';

export interface Service {
  id: number;
  provider_id: number;
  name: string;
  service_type: string;
  location: string;
  price: string;
  duration_minutes: number;
  description: string;
  is_active: boolean;
  standardFee?: number; // For backward compatibility
}

export interface ApiAppointment {
  id: number;
  patient_id: number;
  service_id: number;
  slot_id: number;
  follow_up_of_id: number;
  continuation_appointment_id: number;
  appointment_at: string;
  status: string;
  note: string;
  provider_recheck_reason: string;
  created_at: string;
  // Enrichment fields from API
  patient_name?: string;
  patient_image?: string;
  patient_email?: string;
  patient_phone?: string;
  service_name?: string;
  service_type?: string;
  slot_time?: string;
  location?: string;
}

export interface ServiceSlot {
  id: number;
  service_id: number;
  starts_at: string;
  ends_at: string;
  is_booked: boolean;
}

class AppointmentService extends ApiService {
  private readonly basePath = '/appointments';

  async listServices(serviceType?: string | null, location?: string | null): Promise<any[]> {
    const queryParams = new URLSearchParams();
    if (serviceType !== undefined && serviceType !== null) {
      queryParams.append('service_type', serviceType);
    }
    if (location !== undefined && location !== null) {
      queryParams.append('location', location);
    }

    const query = queryParams.toString();
    const apiServices = await this.get<any[]>(`${this.basePath}/services${query ? `?${query}` : ''}`, undefined, false);
    
    // Transform API response (snake_case) to internal format (camelCase)
    return apiServices.map(apiService => ({
      id: apiService.id,
      providerId: apiService.provider_id,
      name: apiService.name,
      serviceType: apiService.service_type,
      location: apiService.location,
      standardFee: parseFloat(apiService.price) || 0,
      durationMinutes: apiService.duration_minutes,
      description: apiService.description,
      status: apiService.is_active ? 'Active' : 'Inactive',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      preparationInstructions: null,
    }));
  }

  async createAppointment(serviceId: number, slotId: number, note?: string): Promise<EnrichedAppointment> {
    const payload = {
      service_id: serviceId,
      slot_id: slotId,
      note: note || ''
    };
    const apiAppointment = await this.post<ApiAppointment>(this.basePath, payload);
    return this.transformToEnrichedAppointment(apiAppointment);
  }

  async listMyAppointments(): Promise<EnrichedAppointment[]> {
    // Check if user is a provider (doctor/clinic/diagnostic_center)
    const userStr = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
    const user = userStr ? JSON.parse(userStr) : null;
    const isProvider = user && (user.role === 'doctor' || user.role === 'clinic' || user.role === 'diagnostic_center');

    let apiAppointments: ApiAppointment[];
    
    if (isProvider && user.provider_id) {
      // Try provider-specific endpoint for doctors/clinics/diagnostic centers
      try {
        apiAppointments = await this.get<ApiAppointment[]>(`/providers/${user.provider_id}/appointments`);
      } catch (error: any) {
        // If endpoint doesn't exist, try alternative endpoint or return empty
        toast.info('Provider appointments endpoint not found, trying alternative...');
        // Try the appointments endpoint with provider filter
        try {
          apiAppointments = await this.get<ApiAppointment[]>(`${this.basePath}?provider_id=${user.provider_id}`);
        } catch (altError) {
          // If that also fails, return empty array for providers
          toast.info('Appointments feature not available for providers in current API version');
          apiAppointments = [];
        }
      }
    } else {
      // Use patient endpoint for patients
      apiAppointments = await this.get<ApiAppointment[]>(`${this.basePath}/mine`);
    }
    
    return apiAppointments.map(apt => this.transformToEnrichedAppointment(apt));
  }

  async cancelAppointmentById(appointmentId: number): Promise<EnrichedAppointment> {
    const apiAppointment = await this.post<ApiAppointment>(`${this.basePath}/${appointmentId}/cancel`, {});
    return this.transformToEnrichedAppointment(apiAppointment);
  }

  async deleteAppointment(appointmentId: number): Promise<any> {
    return this.delete<any>(`${this.basePath}/${appointmentId}`);
  }

  // Provider appointment actions
  async markVisitCompleted(providerId: number, appointmentId: number): Promise<EnrichedAppointment> {
    const apiAppointment = await this.post<ApiAppointment>(`/providers/${providerId}/appointments/${appointmentId}/complete`, {});
    return this.transformToEnrichedAppointment(apiAppointment);
  }

  async markNeedsRecheck(providerId: number, appointmentId: number, reason: string): Promise<EnrichedAppointment> {
    const apiAppointment = await this.post<ApiAppointment>(`/providers/${providerId}/appointments/${appointmentId}/needs-recheck`, { reason });
    return this.transformToEnrichedAppointment(apiAppointment);
  }

  async bookRecheckVisit(providerId: number, appointmentId: number, slotId: number): Promise<EnrichedAppointment> {
    const apiAppointment = await this.post<ApiAppointment>(`/providers/${providerId}/appointments/${appointmentId}/book-recheck`, { slot_id: slotId });
    return this.transformToEnrichedAppointment(apiAppointment);
  }

  async rescheduleAppointment(providerId: number, appointmentId: number, slotId: number): Promise<EnrichedAppointment> {
    const apiAppointment = await this.post<ApiAppointment>(`/providers/${providerId}/appointments/${appointmentId}/reschedule`, { slot_id: slotId });
    return this.transformToEnrichedAppointment(apiAppointment);
  }

  async deleteProviderAppointment(providerId: number, appointmentId: number): Promise<any> {
    return this.delete<any>(`/providers/${providerId}/appointments/${appointmentId}`);
  }

  private transformToEnrichedAppointment(apiAppointment: ApiAppointment): EnrichedAppointment {
    return {
      id: apiAppointment.id,
      patientId: apiAppointment.patient_id,
      serviceId: apiAppointment.service_id,
      providerId: 0, // Not provided by API
      slotId: apiAppointment.slot_id,
      scheduledDateTime: apiAppointment.appointment_at,
      status: apiAppointment.status as any,
      checkInTime: null,
      startTime: null,
      endTime: null,
      estimatedWaitMinutes: null,
      notes: apiAppointment.note || null,
      createdAt: apiAppointment.created_at,
      updatedAt: apiAppointment.created_at,
      paymentId: null,
      qrId: null,
      // Enrichment fields
      patientName: apiAppointment.patient_name || '',
      patientImage: apiAppointment.patient_image,
      patientEmail: apiAppointment.patient_email,
      patientPhone: apiAppointment.patient_phone,
      serviceName: apiAppointment.service_name,
      serviceType: apiAppointment.service_type as any,
      slotTime: apiAppointment.slot_time,
      location: apiAppointment.location,
      // Required fields from AppointmentEnrichment
      paymentStatus: 'PENDING' as any,
      fee: 0,
      providerEmail: '',
    };
  }
}

export const appointmentService = new AppointmentService();