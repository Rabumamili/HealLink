// stores/slices/schedule.slice.ts
import { create } from 'zustand';
import { 
  TimeSlot, 
  DaySchedule, 
  ScheduleSettings,
  CreateSlotDTO,
  UpdateSlotDTO,
  SlotAvailability,
  BulkSlotCreateDTO
} from '@/types/entities/schedule.types';
import { scheduleService } from '@/services/schedule.service';
//import { toast } from 'sonner';

interface ScheduleState {
  slots: TimeSlot[];
  daySchedule: DaySchedule[];
  settings: ScheduleSettings | null;
  isLoading: boolean;
  error: string | null;
  selectedDate: string | null;
  
  fetchSlotsByProviderAndDate: (providerId: number, date: string) => Promise<void>;
  fetchSlotsByDateRange: (providerId: number, startDate: string, endDate: string) => Promise<void>;
  fetchDayScheduleTemplate: (providerType: string, providerId?: number) => Promise<void>;
  fetchScheduleSettings: (providerId: number) => Promise<void>;
  createSlot: (data: CreateSlotDTO) => Promise<TimeSlot | null>;
  updateSlot: (data: UpdateSlotDTO) => Promise<TimeSlot | null>;
  deleteSlot: (slotId: number) => Promise<boolean>;
  bulkCreateSlots: (data: BulkSlotCreateDTO) => Promise<TimeSlot[] | null>;
  saveDayScheduleTemplate: (providerId: number, schedule: DaySchedule[]) => Promise<void>;
  updateScheduleSettings: (providerId: number, settings: Partial<ScheduleSettings>) => Promise<void>;
  generateSlotsFromTemplate: (providerId: number, serviceId: number, startDate: string, endDate: string) => Promise<void>;
  bookSlot: (slotId: number) => Promise<TimeSlot | null>;
  cancelSlotBooking: (slotId: number) => Promise<TimeSlot | null>;
  setSelectedDate: (date: string) => void;
  clearError: () => void;
}

export const useScheduleStore = create<ScheduleState>((set, get) => ({
  slots: [],
  daySchedule: [],
  settings: null,
  isLoading: false,
  error: null,
  selectedDate: null,

  fetchSlotsByProviderAndDate: async (providerId: number, date: string) => {
    set({ isLoading: true, error: null });
    try {
      const slots = await scheduleService.getSlotsByProviderAndDate(providerId, date);
      set({ slots, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to fetch slots', isLoading: false });
      toast.error('Failed to fetch slots');
    }
  },

  fetchSlotsByDateRange: async (providerId: number, startDate: string, endDate: string) => {
    set({ isLoading: true, error: null });
    try {
      const slots = await scheduleService.getSlotsByDateRange(providerId, startDate, endDate);
      set({ slots, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to fetch slots', isLoading: false });
      toast.error('Failed to fetch slots');
    }
  },

  fetchDayScheduleTemplate: async (providerType: string, providerId?: number) => {
    set({ isLoading: true });
    try {
      const daySchedule = await scheduleService.getDayScheduleTemplate(providerType, providerId);
      set({ daySchedule, isLoading: false });
    } catch (error) {
      console.error('Failed to fetch day schedule:', error);
      set({ isLoading: false });
    }
  },

  fetchScheduleSettings: async (providerId: number) => {
    set({ isLoading: true });
    try {
      const settings = await scheduleService.getScheduleSettings(providerId);
      set({ settings, isLoading: false });
    } catch (error) {
      console.error('Failed to fetch settings:', error);
      set({ isLoading: false });
    }
  },

  createSlot: async (data: CreateSlotDTO) => {
    set({ isLoading: true });
    try {
      const newSlot = await scheduleService.createSlot(data);
      set((state) => ({
        slots: [...state.slots, newSlot],
        isLoading: false,
      }));
      toast.success('Time slot created successfully');
      return newSlot;
    } catch (error) {
      set({ error: 'Failed to create slot', isLoading: false });
      toast.error('Failed to create time slot');
      return null;
    }
  },

  updateSlot: async (data: UpdateSlotDTO) => {
    set({ isLoading: true });
    try {
      const updatedSlot = await scheduleService.updateSlot(data);
      set((state) => ({
        slots: state.slots.map(s => s.id === updatedSlot.id ? updatedSlot : s),
        isLoading: false,
      }));
      toast.success('Time slot updated successfully');
      return updatedSlot;
    } catch (error) {
      set({ error: 'Failed to update slot', isLoading: false });
      toast.error('Failed to update time slot');
      return null;
    }
  },

  deleteSlot: async (slotId: number) => {
    set({ isLoading: true });
    try {
      const success = await scheduleService.deleteSlot(slotId);
      if (success) {
        set((state) => ({
          slots: state.slots.filter(s => s.id !== slotId),
          isLoading: false,
        }));
        toast.success('Time slot deleted successfully');
        return true;
      }
      throw new Error('Slot not found');
    } catch (error) {
      set({ error: 'Failed to delete slot', isLoading: false });
      toast.error('Failed to delete time slot');
      return false;
    }
  },

  bulkCreateSlots: async (data: BulkSlotCreateDTO) => {
    set({ isLoading: true });
    try {
      const newSlots = await scheduleService.bulkCreateSlots(data);
      set((state) => ({
        slots: [...state.slots, ...newSlots],
        isLoading: false,
      }));
      toast.success(`${newSlots.length} time slots created successfully`);
      return newSlots;
    } catch (error) {
      set({ error: 'Failed to create slots', isLoading: false });
      toast.error('Failed to create time slots');
      return null;
    }
  },

  saveDayScheduleTemplate: async (providerId: number, schedule: DaySchedule[]) => {
    set({ isLoading: true });
    try {
      await scheduleService.saveDayScheduleTemplate(providerId, schedule);
      set({ daySchedule: schedule, isLoading: false });
      toast.success('Schedule template saved successfully');
    } catch (error) {
      set({ error: 'Failed to save schedule', isLoading: false });
      toast.error('Failed to save schedule template');
    }
  },

  updateScheduleSettings: async (providerId: number, settings: Partial<ScheduleSettings>) => {
    set({ isLoading: true });
    try {
      const updatedSettings = await scheduleService.updateScheduleSettings(providerId, settings);
      set({ settings: updatedSettings, isLoading: false });
      toast.success('Settings updated successfully');
    } catch (error) {
      set({ error: 'Failed to update settings', isLoading: false });
      toast.error('Failed to update settings');
    }
  },

  generateSlotsFromTemplate: async (providerId: number, serviceId: number, startDate: string, endDate: string) => {
    set({ isLoading: true });
    try {
      const generatedSlots = await scheduleService.generateSlotsFromTemplate(providerId, serviceId, startDate, endDate);
      set((state) => ({
        slots: [...state.slots, ...generatedSlots],
        isLoading: false,
      }));
      toast.success(`${generatedSlots.length} slots generated successfully`);
    } catch (error) {
      set({ error: 'Failed to generate slots', isLoading: false });
      toast.error('Failed to generate time slots');
    }
  },

  bookSlot: async (slotId: number) => {
    set({ isLoading: true });
    try {
      const updatedSlot = await scheduleService.bookSlot(slotId);
      set((state) => ({
        slots: state.slots.map(s => s.id === updatedSlot.id ? updatedSlot : s),
        isLoading: false,
      }));
      toast.success('Slot booked successfully');
      return updatedSlot;
    } catch (error) {
      set({ error: 'Failed to book slot', isLoading: false });
      toast.error('Failed to book slot');
      return null;
    }
  },

  cancelSlotBooking: async (slotId: number) => {
    set({ isLoading: true });
    try {
      const updatedSlot = await scheduleService.cancelSlotBooking(slotId);
      set((state) => ({
        slots: state.slots.map(s => s.id === updatedSlot.id ? updatedSlot : s),
        isLoading: false,
      }));
      toast.success('Booking cancelled successfully');
      return updatedSlot;
    } catch (error) {
      set({ error: 'Failed to cancel booking', isLoading: false });
      toast.error('Failed to cancel booking');
      return null;
    }
  },

  setSelectedDate: (date: string) => set({ selectedDate: date }),

  clearError: () => set({ error: null }),
}));
