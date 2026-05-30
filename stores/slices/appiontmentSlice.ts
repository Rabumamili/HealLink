// stores/slices/appointmentSlice.ts - Fully Fixed
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
} from '@/types/entities/appointment.types';
import { PaymentStatus } from '@/types/entities/payment.types';
import { appointmentService } from '@/services/appointment.service';
import { toast } from 'sonner';

interface AppointmentState {
  appointments: EnrichedAppointment[];
  stats: AppointmentStats | null;
  checkedInPatients: CheckedInPatient[];
  isLoading: boolean;
  error: string | null;
  filters: AppointmentFilters;
  providerContext: number | null;
  patientContext: number | null;
  
  // Core CRUD operations
  fetchAppointments: () => Promise<void>;
  fetchStats: () => Promise<void>;
  fetchCheckedInPatients: () => Promise<void>;
  updateStatus: (id: number, status: AppointmentStatus) => Promise<void>;
  updateTiming: (id: number, startTime: string, endTime: string) => Promise<void>;
  checkinPatient: (id: number, checkInTime: string, estimatedWaitMinutes: number) => Promise<EnrichedAppointment | null>;
  cancelAppointment: (id: number) => Promise<void>;
  createAppointment: (data: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Appointment | null>;
  
  // Patient-specific methods
  fetchPatientAppointments: (patientId: number) => Promise<void>;
  fetchUpcomingPatientAppointments: (patientId: number) => Promise<EnrichedAppointment[]>;
  fetchPastPatientAppointments: (patientId: number) => Promise<EnrichedAppointment[]>;
  
  // Provider-specific methods
  fetchProviderAppointments: (providerId: number) => Promise<void>;
  fetchUpcomingProviderAppointments: (providerId: number) => Promise<EnrichedAppointment[]>;
  fetchTodayProviderAppointments: (providerId: number) => Promise<EnrichedAppointment[]>;
  
  // Payment-related methods
  bookAppointment: (request: BookAppointmentRequest) => Promise<BookAppointmentResponse | null>;
  bookAppointmentWithPendingPayment: (request: BookAppointmentRequest) => Promise<BookAppointmentResponse | null>;
  createChapaCheckout: (request: BookAppointmentRequest) => Promise<{ checkoutUrl: string; txRef: string } | null>;
  confirmAfterChapaPayment: (appointmentId: number, paymentId: number, txRef: string) => Promise<BookAppointmentResponse | null>;
  getAppointmentPaymentStatus: (appointmentId: number) => Promise<PaymentStatus | null>;
  updateAppointmentPaymentStatus: (appointmentId: number, status: PaymentStatus) => Promise<boolean>;
  retryFailedPayment: (appointmentId: number) => Promise<{ checkoutUrl: string; txRef: string } | null>;
  
  // Filter and utility methods
  setFilters: (filters: Partial<AppointmentFilters>) => void;
  clearError: () => void;
  getAppointmentsByStatus: (status: AppointmentStatus | 'upcoming' | 'past') => EnrichedAppointment[];
  getAppointmentsByPaymentStatus: (status: PaymentStatus) => EnrichedAppointment[];
  getTodayAppointments: () => EnrichedAppointment[];
  getAppointmentsByDate: (date: string) => EnrichedAppointment[];
  setProviderContext: (providerId: number) => void;
  setPatientContext: (patientId: number) => void;
  clearContexts: () => void;
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
  patientContext: null,

  // Core CRUD operations
  fetchAppointments: async () => {
    set({ isLoading: true, error: null });
    try {
      const filters = { ...get().filters };
      
      // Apply context filters
      if (get().providerContext) {
        filters.providerId = get().providerContext!;
      }
      if (get().patientContext) {
        filters.patientId = get().patientContext!;
      }
      
      const appointments = await appointmentService.getAppointments(filters);
      set({ appointments, isLoading: false });
    } catch (error) {
      console.error('Failed to fetch appointments:', error);
      set({ error: 'Failed to fetch appointments', isLoading: false });
      toast.error('Failed to fetch appointments');
    }
  },

  fetchStats: async () => {
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

  fetchCheckedInPatients: async () => {
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
          appointments: state.appointments.map((a) => a.id === id ? updated : a),
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
          appointments: state.appointments.map((a) => a.id === id ? updated : a),
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
          appointments: state.appointments.map((a) => a.id === appointment.id ? appointment : a),
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

  // Patient-specific methods
  fetchPatientAppointments: async (patientId: number) => {
    set({ isLoading: true, error: null, patientContext: patientId });
    try {
      const appointments = await appointmentService.getPatientAppointments(patientId);
      set({ appointments, isLoading: false });
    } catch (error) {
      console.error('Failed to fetch patient appointments:', error);
      set({ error: 'Failed to fetch patient appointments', isLoading: false });
      toast.error('Failed to fetch your appointments');
    }
  },

  fetchUpcomingPatientAppointments: async (patientId: number) => {
    try {
      return await appointmentService.getUpcomingPatientAppointments(patientId);
    } catch (error) {
      console.error('Failed to fetch upcoming appointments:', error);
      toast.error('Failed to fetch upcoming appointments');
      return [];
    }
  },

  fetchPastPatientAppointments: async (patientId: number) => {
    try {
      return await appointmentService.getPastPatientAppointments(patientId);
    } catch (error) {
      console.error('Failed to fetch past appointments:', error);
      toast.error('Failed to fetch past appointments');
      return [];
    }
  },

  // Provider-specific methods
  fetchProviderAppointments: async (providerId: number) => {
    set({ isLoading: true, error: null, providerContext: providerId });
    try {
      const appointments = await appointmentService.getProviderAppointments(providerId);
      set({ appointments, isLoading: false });
    } catch (error) {
      console.error('Failed to fetch provider appointments:', error);
      set({ error: 'Failed to fetch appointments', isLoading: false });
      toast.error('Failed to fetch appointments');
    }
  },

  fetchUpcomingProviderAppointments: async (providerId: number) => {
    try {
      return await appointmentService.getUpcomingProviderAppointments(providerId);
    } catch (error) {
      console.error('Failed to fetch upcoming provider appointments:', error);
      toast.error('Failed to fetch upcoming appointments');
      return [];
    }
  },

  fetchTodayProviderAppointments: async (providerId: number) => {
    try {
      return await appointmentService.getTodayProviderAppointments(providerId);
    } catch (error) {
      console.error('Failed to fetch today\'s appointments:', error);
      toast.error('Failed to fetch today\'s appointments');
      return [];
    }
  },

  // Payment-related methods
  bookAppointment: async (request: BookAppointmentRequest) => {
    set({ isLoading: true, error: null });
    try {
      const response = await appointmentService.bookAppointment(request);
      
      if (response.appointment) {
        set((state) => ({
          appointments: [...state.appointments, response.appointment as EnrichedAppointment],
          isLoading: false,
        }));
        await get().fetchStats();
        
        if (response.paymentStatus === 'SUCCESS' && response.card) {
          toast.success(`APPOINTMENT CONFIRMED!`, {
            description: `Payment SUCCESSFUL. Card: ${response.card.cardNumber}`,
            duration: 10000,
          });
        } else if (response.paymentStatus === 'SUCCESS') {
          toast.success('Appointment confirmed successfully');
        } else if (response.paymentStatus === 'FAILED') {
          toast.error('Payment FAILED. Please try again.', {
            description: response.message,
            duration: 5000,
          });
        } else {
          toast.warning('Payment PENDING. Complete payment to confirm appointment.', {
            description: response.message,
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
        toast.info('Appointment booked. Payment is pending. Please complete payment at the clinic.', {
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

  confirmAfterChapaPayment: async (appointmentId: number, paymentId: number, txRef: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await appointmentService.confirmAfterChapaPayment(appointmentId, paymentId, txRef);
      
      if (response.success && response.card) {
        set((state) => ({
          appointments: state.appointments.map((a) => {
            if (a.id === appointmentId) {
              return {
                ...a,
                status: 'Confirmed' as AppointmentStatus,
                cardId: response.card?.id ?? null,
                cardNumber: response.card?.cardNumber,
                paymentId: paymentId,
                paymentStatus: 'SUCCESS',
              };
            }
            return a;
          }),
          isLoading: false,
        }));
        
        await get().fetchStats();
        
        toast.success(`Payment CONFIRMED! Appointment confirmed.`, {
          description: `Transaction: ${txRef}. Card: ${response.card.cardNumber}`,
          duration: 10000,
        });
      } else {
        toast.error(response.message || 'Failed to confirm payment');
      }
      
      return response;
    } catch (error) {
      console.error('Failed to confirm payment:', error);
      set({ error: 'Failed to confirm payment', isLoading: false });
      toast.error('Failed to confirm payment');
      return null;
    }
  },

  getAppointmentPaymentStatus: async (appointmentId: number) => {
    try {
      return await appointmentService.getAppointmentPaymentStatus(appointmentId);
    } catch (error) {
      console.error('Failed to get payment status:', error);
      return null;
    }
  },

  updateAppointmentPaymentStatus: async (appointmentId: number, status: PaymentStatus) => {
    set({ isLoading: true });
    try {
      const success = await appointmentService.updateAppointmentPaymentStatus(appointmentId, status);
      if (success) {
        set((state) => ({
          appointments: state.appointments.map((a) => 
            a.id === appointmentId ? { ...a, paymentStatus: status } : a
          ),
          isLoading: false,
        }));
        toast.success(`Payment status updated to ${status}`);
      }
      return success;
    } catch (error) {
      console.error('Failed to update payment status:', error);
      set({ isLoading: false });
      toast.error('Failed to update payment status');
      return false;
    }
  },

  retryFailedPayment: async (appointmentId: number) => {
    set({ isLoading: true, error: null });
    try {
      const result = await appointmentService.retryFailedPayment(appointmentId);
      set({ isLoading: false });
      toast.info('Redirecting to payment page...');
      return result;
    } catch (error) {
      console.error('Failed to retry payment:', error);
      set({ error: 'Failed to retry payment', isLoading: false });
      toast.error('Failed to retry payment');
      return null;
    }
  },

  // Filter and utility methods
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
        a.status === 'Scheduled' || a.status === 'Confirmed' || a.status === 'Checked-in'
      );
    }
    
    if (status === 'past') {
      return appointments.filter(a => 
        a.status === 'Completed' || a.status === 'Cancelled' || a.status === 'No-show'
      );
    }
    
    return appointments.filter(a => a.status === status);
  },

  getAppointmentsByPaymentStatus: (status: PaymentStatus) => {
    const { appointments } = get();
    return appointments.filter(a => a.paymentStatus === status);
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

  setProviderContext: (providerId: number) => {
    set({ providerContext: providerId, patientContext: null });
    get().fetchAppointments();
  },

  setPatientContext: (patientId: number) => {
    set({ patientContext: patientId, providerContext: null });
    get().fetchAppointments();
  },

  clearContexts: () => {
    set({ providerContext: null, patientContext: null });
    get().fetchAppointments();
  },

  refreshData: async () => {
    await Promise.all([
      get().fetchAppointments(),
      get().fetchStats(),
      get().fetchCheckedInPatients()
    ]);
  },
}));