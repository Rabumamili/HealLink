// services/appointment.service.ts
import { ApiService } from './api.service';
import { Appointment, AppointmentFilters, AppointmentStats, CheckedInPatient } from '@/types/entities/appointment.types';
import { mockAppointments, mockAppointmentStats, mockCheckedInPatients } from './mock/appointments.mock';

class AppointmentService extends ApiService {
  private useMock = true;

  async getAppointments(filters?: AppointmentFilters): Promise<Appointment[]> {
    if (this.useMock) {
      let filtered = [...mockAppointments];
      
      if (filters?.searchTerm) {
        const search = filters.searchTerm.toLowerCase();
        filtered = filtered.filter(a => 
          a.patientName.toLowerCase().includes(search) ||
          a.patientId.toLowerCase().includes(search) ||
          a.serviceName.toLowerCase().includes(search)
        );
      }
      
      if (filters?.status && filters.status !== 'all') {
        filtered = filtered.filter(a => a.status === filters.status);
      }
      
      if (filters?.date) {
        filtered = filtered.filter(a => a.date === filters.date);
      }
      
      if (filters?.providerId) {
        filtered = filtered.filter(a => a.providerId === filters.providerId);
      }
      
      if (filters?.patientId) {
        filtered = filtered.filter(a => a.patientId === filters.patientId);
      }
      
      return filtered;
    }
    
    let endpoint = '/appointments';
    if (filters) {
      const params = new URLSearchParams();
      if (filters.searchTerm) params.append('search', filters.searchTerm);
      if (filters.status && filters.status !== 'all') params.append('status', filters.status);
      if (filters.date) params.append('date', filters.date);
      if (params.toString()) endpoint += `?${params.toString()}`;
    }
    return this.get<Appointment[]>(endpoint);
  }

  async getAppointmentById(id: string): Promise<Appointment> {
    if (this.useMock) {
      const appointment = mockAppointments.find(a => a.id === id);
      if (!appointment) throw new Error('Appointment not found');
      return appointment;
    }
    return this.get<Appointment>(`/appointments/${id}`);
  }

  async getAppointmentStats(providerId?: string): Promise<AppointmentStats> {
    if (this.useMock) {
      let filtered = mockAppointments;
      if (providerId) {
        filtered = filtered.filter(a => a.providerId === providerId);
      }
      return {
        total: filtered.length,
        today: filtered.filter(a => a.date === "2024-05-20").length,
        completed: filtered.filter(a => a.status === "Completed").length,
        cancelled: filtered.filter(a => a.status === "Cancelled").length,
        noShow: filtered.filter(a => a.status === "No-show").length,
        revenue: filtered.filter(a => a.status === "Completed").reduce((sum, a) => sum + a.fee, 0),
        upcoming: filtered.filter(a => a.status === "Scheduled" || a.status === "Checked-in").length
      };
    }
    return this.get<AppointmentStats>('/appointments/stats');
  }

  async getCheckedInPatients(providerId?: string): Promise<CheckedInPatient[]> {
    if (this.useMock) {
      let filtered = [...mockCheckedInPatients];
      return filtered;
    }
    return this.get<CheckedInPatient[]>('/appointments/checked-in');
  }

  async updateAppointmentStatus(id: string, status: Appointment['status']): Promise<Appointment> {
    if (this.useMock) {
      const appointment = mockAppointments.find(a => a.id === id);
      if (!appointment) throw new Error('Appointment not found');
      const updated = { ...appointment, status, updatedAt: new Date().toISOString() };
      return updated;
    }
    return this.put<Appointment>(`/appointments/${id}/status`, { status });
  }

  async rescheduleAppointment(id: string, date: string, time: string): Promise<Appointment> {
    if (this.useMock) {
      const appointment = mockAppointments.find(a => a.id === id);
      if (!appointment) throw new Error('Appointment not found');
      const updated = { ...appointment, date, time, updatedAt: new Date().toISOString() };
      return updated;
    }
    return this.put<Appointment>(`/appointments/${id}/reschedule`, { date, time });
  }

  async checkinPatient(cardNumber: string, providerId?: string): Promise<Appointment> {
    if (this.useMock) {
      const appointment = mockAppointments.find(a => a.cardNumber === cardNumber);
      if (!appointment) throw new Error('Invalid card number');
      const updated = { ...appointment, status: 'Checked-in' as const, updatedAt: new Date().toISOString() };
      return updated;
    }
    return this.post<Appointment>('/appointments/checkin', { cardNumber });
  }

  async cancelAppointment(id: string): Promise<void> {
    if (this.useMock) {
      return;
    }
    return this.delete(`/appointments/${id}`);
  }

  async getPatientAppointments(patientId: string): Promise<Appointment[]> {
    if (this.useMock) {
      return mockAppointments.filter(a => a.patientId === patientId);
    }
    return this.get<Appointment[]>(`/patients/${patientId}/appointments`);
  }

  async getProviderAppointments(providerId: string, date?: string): Promise<Appointment[]> {
    if (this.useMock) {
      let filtered = mockAppointments.filter(a => a.providerId === providerId);
      if (date) {
        filtered = filtered.filter(a => a.date === date);
      }
      return filtered;
    }
    let endpoint = `/providers/${providerId}/appointments`;
    if (date) endpoint += `?date=${date}`;
    return this.get<Appointment[]>(endpoint);
  }
}

export const appointmentService = new AppointmentService();