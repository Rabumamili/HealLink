// types/entities/schedule.types.ts

// Keep snake_case for DB entities, but provide conversion utilities
export interface ScheduleSlotDB {
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

// Frontend-friendly camelCase version - this is what components should use
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
}

// Computed property helper
export interface TimeSlotWithAvailability extends TimeSlot {
  availableSlots: number;
}

// For schedule configuration (templates)
export interface TimeSlotTemplate {
  id: string;
  startTime: string;
  endTime: string;
  shift: 'morning' | 'afternoon' | 'evening';
  maxCapacity: number;
}

export interface DaySchedule {
  day: WeekDay;
  isActive: boolean;
  slots: TimeSlotTemplate[];
  note?: string;
}

export interface ScheduleSettings {
  slotDuration: number; // in minutes
  bufferTime: number; // between appointments in minutes
  maxAppointmentsPerDay: number;
  defaultMaxCapacity: number;
  breakDuration?: number;
  resultTurnaroundTime?: number; // for diagnostic centers
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

// Fixed conversion helpers with proper typing
export function toTimeSlot(slot: ScheduleSlotDB): TimeSlotWithAvailability {
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

export function toScheduleSlotDB(slot: TimeSlot): Omit<ScheduleSlotDB, 'id' | 'created_at' | 'updated_at'> {
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

// Helper to check if a slot is bookable
export function isSlotBookable(slot: TimeSlotWithAvailability): boolean {
  return slot.isAvailable && slot.availableSlots > 0;
}

// Helper to get slot display time
export function getSlotDisplayTime(slot: TimeSlot): string {
  return `${slot.startTime} - ${slot.endTime}`;
}