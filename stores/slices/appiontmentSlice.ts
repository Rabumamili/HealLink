// stores/slices/appointmentSlice.ts
import { create } from 'zustand';
import { 
  Service,
  ServiceSlot
} from '@/services/appointment.service';
import { EnrichedAppointment } from '@/types/entities/appointment.types';
import { toast } from 'sonner';

interface AppointmentState {
  appointments: EnrichedAppointment[];
  services: Service[];
  serviceSlots: ServiceSlot[];
  isLoading: boolean;
  error: string | null;

  // Service methods
  fetchServices: (serviceType?: string | null, location?: string | null) => Promise<void>;

  // Appointment methods
  fetchMyAppointments: () => Promise<void>;
  createAppointment: (serviceId: number, slotId: number, note?: string) => Promise<EnrichedAppointment | null>;
  cancelAppointment: (appointmentId: number) => Promise<void>;
  
  // Provider appointment actions
  markVisitCompleted: (providerId: number, appointmentId: number) => Promise<void>;
  markNeedsRecheck: (providerId: number, appointmentId: number, reason: string) => Promise<void>;
  bookRecheckVisit: (providerId: number, appointmentId: number, slotId: number) => Promise<void>;
  
  // Service slots
  fetchServiceSlots: (serviceId: number, onlyAvailable?: boolean) => Promise<void>;
  
  clearError: () => void;
}

export const useAppointmentStore = create<AppointmentState>((set, get) => ({
  appointments: [],
  services: [],
  serviceSlots: [],
  isLoading: false,
  error: null,

  fetchServices: async (serviceType?: string | null, location?: string | null) => {
    set({ isLoading: true, error: null });
    try {
      const { appointmentService } = await import('@/services/appointment.service');
      const services = await appointmentService.listServices(serviceType, location);
      set({ services, isLoading: false });
    } catch (error) {
      console.error('Failed to fetch services:', error);
      set({ error: 'Failed to fetch services', isLoading: false });
      toast.error('Failed to fetch services');
    }
  },

  fetchMyAppointments: async () => {
    set({ isLoading: true, error: null });
    try {
      const { appointmentService } = await import('@/services/appointment.service');
      const appointments = await appointmentService.listMyAppointments();
      set({ appointments, isLoading: false });
    } catch (error) {
      console.error('Failed to fetch appointments:', error);
      set({ error: 'Failed to fetch appointments', isLoading: false });
      toast.error('Failed to fetch appointments');
    }
  },

  createAppointment: async (serviceId: number, slotId: number, note?: string) => {
    set({ isLoading: true, error: null });
    try {
      const { appointmentService } = await import('@/services/appointment.service');
      const newAppointment = await appointmentService.createAppointment(serviceId, slotId, note);
      set((state) => ({
        appointments: [...state.appointments, newAppointment],
        isLoading: false,
      }));
      toast.success('Appointment created successfully');
      return newAppointment;
    } catch (error) {
      console.error('Failed to create appointment:', error);
      set({ error: 'Failed to create appointment', isLoading: false });
      toast.error('Failed to create appointment');
      return null;
    }
  },

  cancelAppointment: async (appointmentId: number) => {
    set({ isLoading: true });
    try {
      const { appointmentService } = await import('@/services/appointment.service');
      await appointmentService.cancelAppointmentById(appointmentId);
      set((state) => ({
        appointments: state.appointments.filter((a) => a.id !== appointmentId),
        isLoading: false,
      }));
      toast.success('Appointment cancelled successfully');
    } catch (error) {
      console.error('Failed to cancel appointment:', error);
      set({ error: 'Failed to cancel appointment', isLoading: false });
      toast.error('Failed to cancel appointment');
    }
  },

  markVisitCompleted: async (providerId: number, appointmentId: number) => {
    set({ isLoading: true });
    try {
      const { appointmentService } = await import('@/services/appointment.service');
      const updated = await appointmentService.markVisitCompleted(providerId, appointmentId);
      set((state) => ({
        appointments: state.appointments.map((a) => a.id === appointmentId ? updated : a),
        isLoading: false,
      }));
      toast.success('Visit marked as completed');
    } catch (error) {
      console.error('Failed to mark visit completed:', error);
      set({ error: 'Failed to mark visit completed', isLoading: false });
      toast.error('Failed to mark visit completed');
    }
  },

  markNeedsRecheck: async (providerId: number, appointmentId: number, reason: string) => {
    set({ isLoading: true });
    try {
      const { appointmentService } = await import('@/services/appointment.service');
      const updated = await appointmentService.markNeedsRecheck(providerId, appointmentId, reason);
      set((state) => ({
        appointments: state.appointments.map((a) => a.id === appointmentId ? updated : a),
        isLoading: false,
      }));
      toast.success('Appointment marked for recheck');
    } catch (error) {
      console.error('Failed to mark needs recheck:', error);
      set({ error: 'Failed to mark needs recheck', isLoading: false });
      toast.error('Failed to mark needs recheck');
    }
  },

  bookRecheckVisit: async (providerId: number, appointmentId: number, slotId: number) => {
    set({ isLoading: true });
    try {
      const { appointmentService } = await import('@/services/appointment.service');
      const updated = await appointmentService.bookRecheckVisit(providerId, appointmentId, slotId);
      set((state) => ({
        appointments: state.appointments.map((a) => a.id === appointmentId ? updated : a),
        isLoading: false,
      }));
      toast.success('Recheck visit booked successfully');
    } catch (error) {
      console.error('Failed to book recheck visit:', error);
      set({ error: 'Failed to book recheck visit', isLoading: false });
      toast.error('Failed to book recheck visit');
    }
  },

  fetchServiceSlots: async (serviceId: number, onlyAvailable: boolean = true) => {
    set({ isLoading: true, error: null });
    try {
      const { serviceService } = await import('@/services/service.service');
      const slots = await serviceService.listServiceSlots(serviceId, onlyAvailable);
      set({ serviceSlots: slots, isLoading: false });
    } catch (error) {
      console.error('Failed to fetch service slots:', error);
      set({ error: 'Failed to fetch service slots', isLoading: false });
      toast.error('Failed to fetch service slots');
    }
  },

  clearError: () => set({ error: null }),
}));