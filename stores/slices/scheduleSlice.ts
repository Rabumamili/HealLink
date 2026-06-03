// stores/slices/schedule.slice.ts

import { create } from 'zustand';

import { devtools } from 'zustand/middleware';

import { scheduleService, Schedule, CreateScheduleRequest, UpdateScheduleRequest, GenerateSlotsRequest, GenerateSlotsResponse } from '@/services/schedule.service';

import { toast } from 'sonner';



interface ScheduleState {

  schedules: Schedule[];

  currentSchedule: Schedule | null;

  isLoading: boolean;

  error: string | null;

  

  listSchedules: (serviceId?: number | null, providerId?: number | null, isActive?: boolean | null) => Promise<void>;

  getSchedule: (scheduleId: number) => Promise<void>;

  createSchedule: (data: CreateScheduleRequest) => Promise<Schedule | null>;

  updateSchedule: (scheduleId: number, data: UpdateScheduleRequest) => Promise<Schedule | null>;

  deleteSchedule: (scheduleId: number) => Promise<boolean>;

  generateSlots: (scheduleId: number, data: GenerateSlotsRequest) => Promise<GenerateSlotsResponse | null>;

  clearCurrentSchedule: () => void;

  clearError: () => void;

}



export const useScheduleStore = create<ScheduleState>((set, get) => ({

  schedules: [],

  currentSchedule: null,

  isLoading: false,

  error: null,



  listSchedules: async (serviceId?: number | null, providerId?: number | null, isActive?: boolean | null) => {

    set({ isLoading: true, error: null });

    try {

      const schedules = await scheduleService.listSchedules(serviceId, providerId, isActive);

      set({ schedules, isLoading: false });

    } catch (error) {

      set({ error: 'Failed to fetch schedules', isLoading: false });

      toast.error('Failed to fetch schedules');

    }

  },



  getSchedule: async (scheduleId: number) => {

    set({ isLoading: true, error: null });

    try {

      const schedule = await scheduleService.getSchedule(scheduleId);

      set({ currentSchedule: schedule, isLoading: false });

    } catch (error) {

      set({ error: 'Failed to fetch schedule', isLoading: false });

      toast.error('Failed to fetch schedule');

    }

  },



  createSchedule: async (data: CreateScheduleRequest) => {

    set({ isLoading: true });

    try {

      const newSchedule = await scheduleService.createSchedule(data);

      set((state) => ({

        schedules: [...state.schedules, newSchedule],

        isLoading: false,

      }));

      toast.success('Schedule created successfully');

      return newSchedule;

    } catch (error) {

      set({ error: 'Failed to create schedule', isLoading: false });

      toast.error('Failed to create schedule');

      return null;

    }

  },



  updateSchedule: async (scheduleId: number, data: UpdateScheduleRequest) => {

    set({ isLoading: true });

    try {

      const updatedSchedule = await scheduleService.updateSchedule(scheduleId, data);

      set((state) => ({

        schedules: state.schedules.map(s => s.id === scheduleId ? updatedSchedule : s),

        currentSchedule: state.currentSchedule?.id === scheduleId ? updatedSchedule : state.currentSchedule,

        isLoading: false,

      }));

      toast.success('Schedule updated successfully');

      return updatedSchedule;

    } catch (error) {

      set({ error: 'Failed to update schedule', isLoading: false });

      toast.error('Failed to update schedule');

      return null;

    }

  },



  deleteSchedule: async (scheduleId: number) => {

    set({ isLoading: true });

    try {

      await scheduleService.deleteSchedule(scheduleId);

      set((state) => ({

        schedules: state.schedules.filter(s => s.id !== scheduleId),

        currentSchedule: state.currentSchedule?.id === scheduleId ? null : state.currentSchedule,

        isLoading: false,

      }));

      toast.success('Schedule deleted successfully');

      return true;

    } catch (error) {

      set({ error: 'Failed to delete schedule', isLoading: false });

      toast.error('Failed to delete schedule');

      return false;

    }

  },



  generateSlots: async (scheduleId: number, data: GenerateSlotsRequest) => {

    set({ isLoading: true });

    try {

      const result = await scheduleService.generateSlots(scheduleId, data);

      set({ isLoading: false });

      toast.success(`${result.slots_created} slots generated successfully`);

      return result;

    } catch (error) {

      set({ error: 'Failed to generate slots', isLoading: false });

      toast.error('Failed to generate slots');

      return null;

    }

  },



  clearCurrentSchedule: () => {

    set({ currentSchedule: null });

  },



  clearError: () => set({ error: null }),

}));

