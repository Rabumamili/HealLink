// stores/slices/appointment.slice.ts
import { create } from 'zustand';
import { 
  Appointment, 
  AppointmentFilters, 
  AppointmentStats, 
  CheckedInPatient,
  EnrichedAppointment,
  AppointmentStatus,
  BookAppointmentRequest,
  BookAppointmentResponse,
  PaymentStatus  // IMPORTANT: Added this
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
  
  // Fetch operations
  fetchAppointments: () => Promise<void>;
  fetchStats: (providerId?: string) => Promise<void>;
  fetchCheckedInPatients: (providerId?: string) => Promise<void>;
  
  // Appointment management
  updateStatus: (id: number, status: AppointmentStatus) => Promise<void>;
  updateTiming: (id: number, startTime: string, endTime: string) => Promise<void>;
  checkinPatient: (id: number, checkInTime: string, estimatedWaitMinutes: number) => Promise<EnrichedAppointment | null>;
  cancelAppointment: (id: number) => Promise<void>;
  createAppointment: (data: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Appointment | null>;
  
  // Booking with Chapa payment
  bookAppointment: (request: BookAppointmentRequest) => Promise<BookAppointmentResponse | null>;
  bookAppointmentWithPendingPayment: (request: BookAppointmentRequest) => Promise<BookAppointmentResponse | null>;
  createChapaCheckout: (request: BookAppointmentRequest) => Promise<{ checkoutUrl: string; txRef: string } | null>;
  confirmAfterChapaPayment: (appointmentId: number, paymentId: number, txRef: string) => Promise<BookAppointmentResponse | null>;
  
  // Filtering
  setFilters: (filters: Partial<AppointmentFilters>) => void;
  clearError: () => void;
  
  // Helper methods
  getAppointmentsByStatus: (status: AppointmentStatus | 'upcoming' | 'past') => EnrichedAppointment[];
  getTodayAppointments: () => EnrichedAppointment[];
  getAppointmentsByDate: (date: string) => EnrichedAppointment[];
  setProviderContext: (providerId: string) => void;
  refreshData: () => Promise<void>;
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
      const filters = { ...get().filters };
      if (get().providerContext) {
        filters.providerId = parseInt(get().providerContext!);
      }
      const appointments = await appointmentService.getAppointments(filters);
      set({ appointments, isLoading: false });
    } catch (error) {
      console.error('Failed to fetch appointments:', error);
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
      console.error('Failed to update status:', error);
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
      console.error('Failed to update timing:', error);
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
      console.error('Failed to check in patient:', error);
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
      console.error('Failed to cancel appointment:', error);
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
      console.error('Failed to create appointment:', error);
      set({ error: 'Failed to create appointment', isLoading: false });
      toast.error('Failed to create appointment');
      return null;
    }
  },

  /**
   * BOOK APPOINTMENT WITH CHAPA PAYMENT
   * Flow: Create appointment -> Process Chapa payment -> Generate card number
   */
  bookAppointment: async (request: BookAppointmentRequest) => {
    set({ isLoading: true, error: null });
    try {
      const response = await appointmentService.bookAppointment(request);
      
      if (response.success && response.appointment) {
        set((state) => ({
          appointments: [...state.appointments, response.appointment as EnrichedAppointment],
          isLoading: false,
        }));
        await get().fetchStats();
        
        if (request.paymentConfirmed && response.card) {
          toast.success(`Appointment confirmed!`, {
            description: `Your card number: ${response.card.cardNumber}`,
            duration: 10000,
          });
        } else if (request.paymentConfirmed) {
          toast.success('Appointment confirmed successfully');
        } else {
          toast.info('Appointment booked. Please complete Chapa payment to confirm.', {
            duration: 5000,
          });
        }
      } else {
        toast.error(response.message || 'Failed to book appointment');
      }
      
      return response;
    } catch (error) {
      console.error('Failed to book appointment:', error);
      set({ error: 'Failed to book appointment', isLoading: false });
      toast.error('Failed to book appointment');
      return null;
    }
  },

  /**
   * BOOK APPOINTMENT WITH PENDING PAYMENT (Pay later at clinic)
   * No payment required upfront
   */
  bookAppointmentWithPendingPayment: async (request: BookAppointmentRequest) => {
    set({ isLoading: true, error: null });
    try {
      const response = await appointmentService.bookAppointmentWithPendingPayment(request);
      
      if (response.success && response.appointment) {
        set((state) => ({
          appointments: [...state.appointments, response.appointment as EnrichedAppointment],
          isLoading: false,
        }));
        await get().fetchStats();
        toast.info('Appointment booked. Please complete payment at the clinic.', {
          duration: 5000,
        });
      } else {
        toast.error(response.message || 'Failed to book appointment');
      }
      
      return response;
    } catch (error) {
      console.error('Failed to book appointment:', error);
      set({ error: 'Failed to book appointment', isLoading: false });
      toast.error('Failed to book appointment');
      return null;
    }
  },

  /**
   * CREATE CHAPA CHECKOUT URL
   * Returns a URL to redirect patient to Chapa payment page
   */
  createChapaCheckout: async (request: BookAppointmentRequest) => {
    set({ isLoading: true, error: null });
    try {
      const result = await appointmentService.createChapaCheckout(request);
      set({ isLoading: false });
      return result;
    } catch (error) {
      console.error('Failed to create Chapa checkout:', error);
      set({ error: 'Failed to create payment link', isLoading: false });
      toast.error('Failed to create payment link');
      return null;
    }
  },

  /**
   * CONFIRM APPOINTMENT AFTER CHAPA PAYMENT
   * Called after Chapa webhook confirms payment
   */
// stores/slices/appointment.slice.ts - Fixed confirmAfterChapaPayment method

confirmAfterChapaPayment: async (appointmentId: number, paymentId: number, txRef: string) => {
  set({ isLoading: true, error: null });
  try {
    const response = await appointmentService.confirmAfterChapaPayment(appointmentId, paymentId, txRef);
    
    if (response.success && response.card) {
      // Update appointment in store with proper type handling
      set((state) => ({
        appointments: state.appointments.map((a) => {
          if (a.id === appointmentId) {
            // Return updated appointment with proper types
            const updatedAppointment: EnrichedAppointment = {
              ...a,
              status: 'Confirmed' as AppointmentStatus,
              cardId: response.card?.id ?? null,  // number | null - OK
              cardNumber: response.card?.cardNumber ?? undefined,  // string | undefined - FIXED
              paymentId: paymentId,
              paymentStatus: 'Paid' as PaymentStatus,
            };
            return updatedAppointment;
          }
          return a;
        }),
        isLoading: false,
      }));
      
      await get().fetchStats();
      
      toast.success(`Payment confirmed!`, {
        description: `Your card number: ${response.card.cardNumber}`,
        duration: 10000,
      });
    }
    
    return response;
  } catch (error) {
    console.error('Failed to confirm payment:', error);
    set({ error: 'Failed to confirm payment', isLoading: false });
    toast.error('Failed to confirm payment');
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

  refreshData: async () => {
    await Promise.all([
      get().fetchAppointments(),
      get().fetchStats(),
      get().fetchCheckedInPatients()
    ]);
  },
}));