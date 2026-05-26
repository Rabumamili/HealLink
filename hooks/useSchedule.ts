// hooks/useSchedule.ts
import { useEffect, useCallback, useMemo } from 'react';
import { useScheduleStore } from '@/stores/slices/scheduleSlice';
import { TimeSlot, DaySchedule, ScheduleSettings, CreateSlotDTO, UpdateSlotDTO, BulkSlotCreateDTO } from '@/types/entities/schedule.types';

interface UseScheduleOptions {
  providerId?: number;
  providerType?: string;
  date?: string;
  autoFetch?: boolean;
}

interface UseScheduleReturn {
  slots: TimeSlot[];
  daySchedule: DaySchedule[];
  settings: ScheduleSettings | null;
  isLoading: boolean;
  error: string | null;
  selectedDate: string | null;
  
  availableSlots: TimeSlot[];
  bookedSlots: TimeSlot[];
  
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

export const useSchedule = (options: UseScheduleOptions = {}): UseScheduleReturn => {
  const { providerId, providerType, date, autoFetch = true } = options;
  
  const {
    slots,
    daySchedule,
    settings,
    isLoading,
    error,
    selectedDate,
    fetchSlotsByProviderAndDate: fetchSlotsByProviderAndDateStore,
    fetchSlotsByDateRange: fetchSlotsByDateRangeStore,
    fetchDayScheduleTemplate: fetchDayScheduleTemplateStore,
    fetchScheduleSettings: fetchScheduleSettingsStore,
    createSlot: createSlotStore,
    updateSlot: updateSlotStore,
    deleteSlot: deleteSlotStore,
    bulkCreateSlots: bulkCreateSlotsStore,
    saveDayScheduleTemplate: saveDayScheduleTemplateStore,
    updateScheduleSettings: updateScheduleSettingsStore,
    generateSlotsFromTemplate: generateSlotsFromTemplateStore,
    bookSlot: bookSlotStore,
    cancelSlotBooking: cancelSlotBookingStore,
    setSelectedDate: setSelectedDateStore,
    clearError: clearErrorStore,
  } = useScheduleStore();

  useEffect(() => {
    if (autoFetch && providerId && date) {
      fetchSlotsByProviderAndDateStore(providerId, date);
    }
    if (autoFetch && providerType) {
      fetchDayScheduleTemplateStore(providerType, providerId);
    }
    if (autoFetch && providerId) {
      fetchScheduleSettingsStore(providerId);
    }
  }, [providerId, providerType, date, autoFetch]);

  const availableSlots = useMemo(() => 
    slots.filter(slot => slot.isAvailable && slot.bookedCount < slot.maxCapacity),
    [slots]
  );

  const bookedSlots = useMemo(() => 
    slots.filter(slot => !slot.isAvailable || slot.bookedCount > 0),
    [slots]
  );

  const fetchSlotsByProviderAndDate = useCallback(async (pid: number, d: string) => {
    await fetchSlotsByProviderAndDateStore(pid, d);
  }, [fetchSlotsByProviderAndDateStore]);

  const fetchSlotsByDateRange = useCallback(async (pid: number, start: string, end: string) => {
    await fetchSlotsByDateRangeStore(pid, start, end);
  }, [fetchSlotsByDateRangeStore]);

  return {
    slots,
    daySchedule,
    settings,
    isLoading,
    error,
    selectedDate,
    availableSlots,
    bookedSlots,
    fetchSlotsByProviderAndDate,
    fetchSlotsByDateRange,
    fetchDayScheduleTemplate: fetchDayScheduleTemplateStore,
    fetchScheduleSettings: fetchScheduleSettingsStore,
    createSlot: createSlotStore,
    updateSlot: updateSlotStore,
    deleteSlot: deleteSlotStore,
    bulkCreateSlots: bulkCreateSlotsStore,
    saveDayScheduleTemplate: saveDayScheduleTemplateStore,
    updateScheduleSettings: updateScheduleSettingsStore,
    generateSlotsFromTemplate: generateSlotsFromTemplateStore,
    bookSlot: bookSlotStore,
    cancelSlotBooking: cancelSlotBookingStore,
    setSelectedDate: setSelectedDateStore,
    clearError: clearErrorStore,
  };
};