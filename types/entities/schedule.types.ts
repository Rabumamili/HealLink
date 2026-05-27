// types/entities/schedule.types.ts

export interface ScheduleSlot {
  id: number;
  service_id: number;
  provider_id: number;
  date: string;
  start_time: string;
  end_time: string;
  max_capacity: number;
  booked_count: number;
  is_available: boolean;
  created_at: string;
  updated_at: string;
}

// Frontend friendly camelCase version
export interface TimeSlot {
  id: number;
  serviceId: number;
  providerId: number;
  date: string;
  startTime: string;
  endTime: string;
  maxCapacity: number;
  bookedCount: number;
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
  availableSlots?: number;
}

// For schedule configuration (templates)
export interface TimeSlotTemplate {
  id: string;
  startTime: string;
  endTime: string;
  shift: string;
  maxCapacity: number;
}

export interface DaySchedule {
  day: string;
  isActive: boolean;
  slots: TimeSlotTemplate[];
  note?: string;
}

export interface ScheduleSettings {
  slotDuration: number;
  bufferTime: number;
  maxAppointmentsPerDay: number;
  defaultMaxCapacity: number;
  breakDuration?: number;
  resultTurnaroundTime?: number;
  walkInAllowed?: boolean;
  requireAppointment?: boolean;
}

export type WeekDay = "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday";

// DTOs for creating/updating slots
export interface CreateSlotDTO {
  serviceId: number;
  providerId: number;
  date: string;
  startTime: string;
  endTime: string;
  maxCapacity: number;
}

export interface UpdateSlotDTO extends Partial<CreateSlotDTO> {
  slotId: number;
  isAvailable?: boolean;
  bookedCount?: number;
}

export interface SlotAvailability {
  slotId: number;
  date: string;
  startTime: string;
  endTime: string;
  totalCapacity: number;
  bookedCount: number;
  availableCount: number;
  isAvailable: boolean;
}

export interface BulkSlotCreateDTO {
  serviceId: number;
  providerId: number;
  dateRange: {
    startDate: string;
    endDate: string;
  };
  weekDaysOnly?: WeekDay[];
  timeSlots: Omit<CreateSlotDTO, 'serviceId' | 'providerId' | 'date'>[];
}

// Helper function to convert ScheduleSlot to TimeSlot
export function toTimeSlot(slot: ScheduleSlot): TimeSlot {
  return {
    id: slot.id,
    serviceId: slot.service_id,
    providerId: slot.provider_id,
    date: slot.date,
    startTime: slot.start_time,
    endTime: slot.end_time,
    maxCapacity: slot.max_capacity,
    bookedCount: slot.booked_count,
    isAvailable: slot.is_available,
    createdAt: slot.created_at,
    updatedAt: slot.updated_at,
    availableSlots: slot.max_capacity - slot.booked_count,
  };
}

// Helper to convert TimeSlot to ScheduleSlot
export function toScheduleSlot(slot: TimeSlot): Omit<ScheduleSlot, 'id' | 'created_at' | 'updated_at'> {
  return {
    service_id: slot.serviceId,
    provider_id: slot.providerId,
    date: slot.date,
    start_time: slot.startTime,
    end_time: slot.endTime,
    max_capacity: slot.maxCapacity,
    booked_count: slot.bookedCount,
    is_available: slot.isAvailable,
  };
}