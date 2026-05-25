// stores/slices/appointment.slice.ts
import { create } from 'zustand';
import { 
  Appointment, 
  AppointmentFilters, 
  AppointmentStats, 
  CheckedInPatient,
  EnrichedAppointment,
  AppointmentStatus
} from '@/types/entities/appointment.types';
import { appointmentService } from '@/services/appointment.service';
import { toast } from 'sonner';

interface AppointmentState {
  appointments: EnrichedAppointment[];
  stats: AppointmentStats | null;
  checkedInPatients: CheckedInPatient[];
  isLoading: boolean;
  error: string | null;
  filters: AppointmentFilters;
  providerContext: string | null;
  
  fetchAppointments: () => Promise<void>;
  fetchStats: (providerId?: string) => Promise<void>;
  fetchCheckedInPatients: (providerId?: string) => Promise<void>;
  updateStatus: (id: number, status: AppointmentStatus) => Promise<void>;
  updateTiming: (id: number, startTime: string, endTime: string) => Promise<void>;
  checkinPatient: (id: number, checkInTime: string, estimatedWaitMinutes: number) => Promise<EnrichedAppointment | null>;
  cancelAppointment: (id: number) => Promise<void>;
  setFilters: (filters: Partial<AppointmentFilters>) => void;
  clearError: () => void;
  getAppointmentsByStatus: (status: AppointmentStatus | 'upcoming' | 'past') => EnrichedAppointment[];
  getTodayAppointments: () => EnrichedAppointment[];
  getAppointmentsByDate: (date: string) => EnrichedAppointment[];
  setProviderContext: (providerId: string) => void;
  createAppointment: (data: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Appointment | null>;
}

export const useAppointmentStore = create<AppointmentState>((set, get) => ({
  appointments: [],
  stats: null,
  checkedInPatients: [],
  isLoading: false,
  error: null,
  filters: { searchTerm: '', status: 'all' },
  providerContext: null,

  fetchAppointments: async () => {
    set({ isLoading: true, error: null });
    try {
      const appointments = await appointmentService.getAppointments(get().filters);
      set({ appointments, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to fetch appointments', isLoading: false });
      toast.error('Failed to fetch appointments');
    }
  },

  fetchStats: async (providerId?: string) => {
    set({ isLoading: true });
    try {
      const stats = await appointmentService.getAppointmentStats();
      set({ stats, isLoading: false });
    } catch (error) {
      console.error('Failed to fetch stats:', error);
      set({ isLoading: false });
      toast.error('Failed to fetch statistics');
    }
  },

  fetchCheckedInPatients: async (providerId?: string) => {
    set({ isLoading: true });
    try {
      const checkedInPatients = await appointmentService.getCheckedInPatients();
      set({ checkedInPatients, isLoading: false });
    } catch (error) {
      console.error('Failed to fetch checked-in patients:', error);
      set({ isLoading: false });
      toast.error('Failed to fetch checked-in patients');
    }
  },

  updateStatus: async (id: number, status: AppointmentStatus) => {
    set({ isLoading: true });
    try {
      const updated = await appointmentService.updateAppointmentStatus(id, status);
      if (updated) {
        set((state) => ({
          appointments: state.appointments.map((a) => 
            a.id === id ? updated : a
          ),
          isLoading: false,
        }));
        await get().fetchStats();
        toast.success(`Appointment ${status.toLowerCase()} successfully`);
      } else {
        throw new Error('Failed to update status');
      }
    } catch (error) {
      set({ error: 'Failed to update status', isLoading: false });
      toast.error('Failed to update status');
    }
  },

  updateTiming: async (id: number, startTime: string, endTime: string) => {
    set({ isLoading: true });
    try {
      const updated = await appointmentService.updateAppointmentTiming(id, startTime, endTime);
      if (updated) {
        set((state) => ({
          appointments: state.appointments.map((a) => 
            a.id === id ? updated : a
          ),
          isLoading: false,
        }));
        toast.success('Appointment timing updated successfully');
      } else {
        throw new Error('Failed to update timing');
      }
    } catch (error) {
      set({ error: 'Failed to update appointment timing', isLoading: false });
      toast.error('Failed to update timing');
    }
  },

  checkinPatient: async (id: number, checkInTime: string, estimatedWaitMinutes: number) => {
    set({ isLoading: true });
    try {
      const appointment = await appointmentService.checkInPatient(id, checkInTime, estimatedWaitMinutes);
      if (appointment) {
        set((state) => ({
          appointments: state.appointments.map((a) => 
            a.id === appointment.id ? appointment : a
          ),
          isLoading: false,
        }));
        await get().fetchCheckedInPatients();
        await get().fetchStats();
        toast.success('Patient checked in successfully');
        return appointment;
      } else {
        throw new Error('Failed to check in patient');
      }
    } catch (error) {
      set({ error: 'Failed to check in patient', isLoading: false });
      toast.error('Failed to check in patient');
      return null;
    }
  },

  cancelAppointment: async (id: number) => {
    set({ isLoading: true });
    try {
      const success = await appointmentService.cancelAppointment(id);
      if (success) {
        set((state) => ({
          appointments: state.appointments.map((a) => 
            a.id === id ? { ...a, status: 'Cancelled' as AppointmentStatus } : a
          ),
          isLoading: false,
        }));
        await get().fetchStats();
        toast.success('Appointment cancelled successfully');
      } else {
        throw new Error('Failed to cancel appointment');
      }
    } catch (error) {
      set({ error: 'Failed to cancel appointment', isLoading: false });
      toast.error('Failed to cancel appointment');
    }
  },

  createAppointment: async (data: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'>) => {
    set({ isLoading: true });
    try {
      const newAppointment = await appointmentService.createAppointment(data);
      set((state) => ({
        appointments: [...state.appointments, newAppointment as EnrichedAppointment],
        isLoading: false,
      }));
      await get().fetchStats();
      toast.success('Appointment created successfully');
      return newAppointment;
    } catch (error) {
      set({ error: 'Failed to create appointment', isLoading: false });
      toast.error('Failed to create appointment');
      return null;
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
      return appointments.filter(a => 
        a.status === 'Scheduled' || 
        a.status === 'Confirmed' || 
        a.status === 'Checked-in'
      );
    }
    
    if (status === 'past') {
      return appointments.filter(a => 
        a.status === 'Completed' || 
        a.status === 'Cancelled' || 
        a.status === 'No-show'
      );
    }
    
    return appointments.filter(a => a.status === status);
  },

  getTodayAppointments: () => {
    const { appointments } = get();
    const today = new Date().toISOString().split('T')[0];
    return appointments.filter(a => a.scheduledDateTime.startsWith(today));
  },

  getAppointmentsByDate: (date: string) => {
    const { appointments } = get();
    return appointments.filter(a => a.scheduledDateTime.startsWith(date));
  },

  setProviderContext: (providerId: string) => {
    set({ providerContext: providerId });
  },
}));