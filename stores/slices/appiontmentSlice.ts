// stores/slices/appointment.slice.ts
import { create } from 'zustand';
import { Appointment, AppointmentFilters, AppointmentStats, CheckedInPatient } from '@/types/entities/appointment.types';
import { appointmentService } from '@/services/appointment.service';
import { toast } from 'sonner';

interface AppointmentState {
  appointments: Appointment[];
  stats: AppointmentStats | null;
  checkedInPatients: CheckedInPatient[];
  isLoading: boolean;
  error: string | null;
  filters: AppointmentFilters;
  providerContext: string | null; // Add this property
  
  fetchAppointments: () => Promise<void>;
  fetchStats: (providerId?: string) => Promise<void>;
  fetchCheckedInPatients: (providerId?: string) => Promise<void>;
  updateStatus: (id: string, status: Appointment['status']) => Promise<void>;
  reschedule: (id: string, date: string, time: string) => Promise<void>;
  checkinPatient: (cardNumber: string, providerId?: string) => Promise<Appointment | null>;
  cancel: (id: string) => Promise<void>;
  setFilters: (filters: Partial<AppointmentFilters>) => void;
  clearError: () => void;
  getAppointmentsByStatus: (status: Appointment['status'] | 'upcoming' | 'past') => Appointment[];
  getTodayAppointments: () => Appointment[];
  setProviderContext: (providerId: string) => void;
}

export const useAppointmentStore = create<AppointmentState>((set, get) => ({
  appointments: [],
  stats: null,
  checkedInPatients: [],
  isLoading: false,
  error: null,
  filters: { searchTerm: '', status: 'all' },
  providerContext: null, // Initialize here

  fetchAppointments: async () => {
    set({ isLoading: true, error: null });
    try {
      const appointments = await appointmentService.getAppointments(get().filters);
      set({ appointments, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to fetch appointments', isLoading: false });
    }
  },

  fetchStats: async (providerId?: string) => {
    try {
      const stats = await appointmentService.getAppointmentStats(providerId);
      set({ stats });
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  },

  fetchCheckedInPatients: async (providerId?: string) => {
    try {
      const checkedInPatients = await appointmentService.getCheckedInPatients(providerId);
      set({ checkedInPatients });
    } catch (error) {
      console.error('Failed to fetch checked-in patients:', error);
    }
  },

  updateStatus: async (id, status) => {
    try {
      const updated = await appointmentService.updateAppointmentStatus(id, status);
      set((state) => ({
        appointments: state.appointments.map((a) => a.id === id ? updated : a),
      }));
      get().fetchStats();
      toast.success(`Appointment ${status.toLowerCase()} successfully`);
    } catch (error) {
      set({ error: 'Failed to update status' });
      toast.error('Failed to update status');
    }
  },

  reschedule: async (id, date, time) => {
    try {
      const updated = await appointmentService.rescheduleAppointment(id, date, time);
      set((state) => ({
        appointments: state.appointments.map((a) => a.id === id ? updated : a),
      }));
      toast.success('Appointment rescheduled successfully');
    } catch (error) {
      set({ error: 'Failed to reschedule appointment' });
      toast.error('Failed to reschedule appointment');
    }
  },

  checkinPatient: async (cardNumber, providerId) => {
    try {
      const appointment = await appointmentService.checkinPatient(cardNumber);
      set((state) => ({
        appointments: state.appointments.map((a) => 
          a.id === appointment.id ? appointment : a
        ),
      }));
      get().fetchCheckedInPatients(providerId);
      toast.success('Patient checked in successfully');
      return appointment;
    } catch (error) {
      set({ error: 'Invalid card number or appointment not found' });
      toast.error('Invalid card number or appointment not found');
      return null;
    }
  },

  cancel: async (id) => {
    try {
      await appointmentService.cancelAppointment(id);
      set((state) => ({
        appointments: state.appointments.map((a) => 
          a.id === id ? { ...a, status: 'Cancelled' } : a
        ),
      }));
      get().fetchStats();
      toast.success('Appointment cancelled successfully');
    } catch (error) {
      set({ error: 'Failed to cancel appointment' });
      toast.error('Failed to cancel appointment');
    }
  },

  setFilters: (filters) => {
    set((state) => ({
      filters: { ...state.filters, ...filters },
    }));
    get().fetchAppointments();
  },

  clearError: () => set({ error: null }),

  getAppointmentsByStatus: (status) => {
    const { appointments } = get();
    if (status === 'upcoming') {
      return appointments.filter(a => a.status === 'Scheduled' || a.status === 'Checked-in');
    }
    if (status === 'past') {
      return appointments.filter(a => a.status === 'Completed' || a.status === 'Cancelled' || a.status === 'No-show');
    }
    return appointments.filter(a => a.status === status);
  },

  getTodayAppointments: () => {
    const { appointments } = get();
    const today = new Date().toISOString().split('T')[0];
    return appointments.filter(a => a.date === today);
  },

  setProviderContext: (providerId: string) => {
    set({ providerContext: providerId });
  },
}));