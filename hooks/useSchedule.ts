// hooks/useSchedule.ts
import { useEffect, useCallback, useMemo } from 'react';
import { useScheduleStore } from '@/stores/slices/scheduleSlice';
import { Schedule, CreateScheduleRequest, UpdateScheduleRequest, GenerateSlotsRequest, GenerateSlotsResponse } from '@/services/schedule.service';

interface UseScheduleOptions {
  serviceId?: number;
  providerId?: number;
  autoFetch?: boolean;
}

export const useSchedule = (options: UseScheduleOptions = {}) => {
  const store = useScheduleStore();
  const {
    schedules,
    currentSchedule,
    isLoading,
    error,
    listSchedules: listSchedulesFromStore,
    getSchedule,
    createSchedule,
    updateSchedule,
    deleteSchedule,
    generateSlots,
    clearCurrentSchedule,
    clearError,
  } = store;

  const { serviceId, providerId, autoFetch = true } = options;

  const listSchedules = useCallback((serviceId?: number | null, providerId?: number | null, isActive?: boolean | null) => {
    return listSchedulesFromStore(serviceId, providerId, isActive);
  }, [listSchedulesFromStore]);

  useEffect(() => {
    if (autoFetch) {
      listSchedules(serviceId, providerId, true);
    }
  }, [autoFetch, serviceId, providerId, listSchedules]);

  const create = useCallback(async (data: CreateScheduleRequest) => {
    return await createSchedule(data);
  }, [createSchedule]);

  const update = useCallback(async (scheduleId: number, data: UpdateScheduleRequest) => {
    return await updateSchedule(scheduleId, data);
  }, [updateSchedule]);

  const remove = useCallback(async (scheduleId: number) => {
    return await deleteSchedule(scheduleId);
  }, [deleteSchedule]);

  const generate = useCallback(async (scheduleId: number, data: GenerateSlotsRequest) => {
    return await generateSlots(scheduleId, data);
  }, [generateSlots]);

  return {
    schedules,
    currentSchedule,
    isLoading,
    error,
    listSchedules,
    getSchedule,
    createSchedule: create,
    updateSchedule: update,
    deleteSchedule: remove,
    generateSlots: generate,
    clearCurrentSchedule,
    clearError,
  };
};