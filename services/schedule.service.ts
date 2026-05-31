// services/schedule.service.ts
import { 
  ScheduleSlotDB,
  TimeSlot,
  TimeSlotWithAvailability,
  CreateSlotDTO,
  UpdateSlotDTO,
  BulkSlotCreateDTO,
  WeekDay,
  toTimeSlot,
  isSlotBookable
} from '../types/entities/schedule.types';
import { ServiceService } from './service.service';

export class ScheduleService {
  private slots: Map<number, ScheduleSlotDB> = new Map();
  private currentId: number = 1;
  
  constructor(private serviceService: ServiceService) {}
  
  async createSlot(data: CreateSlotDTO): Promise<TimeSlotWithAvailability> {
    // Validate service exists
    const service = await this.serviceService.getServiceById(data.serviceId);
    if (!service) {
      throw new Error('Service not found');
    }
    
    // Check for overlapping slots
    const overlapping = await this.findOverlappingSlots(
      data.providerId,
      data.date,
      data.startTime,
      data.endTime
    );
    
    if (overlapping.length > 0) {
      throw new Error('Overlapping slot exists for this provider at the same time');
    }
    
    // Validate time range
    if (data.startTime >= data.endTime) {
      throw new Error('Start time must be before end time');
    }
    
    const slot: ScheduleSlotDB = {
      id: this.currentId++,
      service_id: data.serviceId,
      provider_id: data.providerId,
      date: data.date,
      start_time: data.startTime,
      end_time: data.endTime,
      max_capacity: data.maxCapacity,
      booked_count: 0,
      is_available: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    this.slots.set(slot.id, slot);
    return toTimeSlot(slot);
  }
  
  async bulkCreateSlots(data: BulkSlotCreateDTO): Promise<TimeSlotWithAvailability[]> {
    const createdSlots: TimeSlotWithAvailability[] = [];
    const startDate = new Date(data.dateRange.startDate);
    const endDate = new Date(data.dateRange.endDate);
    
    for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
      const dateStr = date.toISOString().split('T')[0];
      const dayOfWeek = date.toLocaleString('en-US', { weekday: 'long' }) as WeekDay;
      
      // Skip if we're only creating for specific weekdays and this isn't one of them
      if (data.weekDaysOnly && !data.weekDaysOnly.includes(dayOfWeek)) {
        continue;
      }
      
      // Create slots for each time slot on this date
      for (const timeSlot of data.timeSlots) {
        const slot = await this.createSlot({
          serviceId: data.serviceId,
          providerId: data.providerId,
          date: dateStr,
          startTime: timeSlot.startTime,
          endTime: timeSlot.endTime,
          maxCapacity: timeSlot.maxCapacity
        });
        createdSlots.push(slot);
      }
    }
    
    return createdSlots;
  }
  
  async getSlotById(id: number): Promise<TimeSlotWithAvailability | null> {
    const slot = this.slots.get(id);
    return slot ? toTimeSlot(slot) : null;
  }
  
  async getAllSlots(
    serviceId?: number,
    providerId?: number,
    date?: string
  ): Promise<TimeSlotWithAvailability[]> {
    let slots = Array.from(this.slots.values());
    
    if (serviceId) {
      slots = slots.filter(s => s.service_id === serviceId);
    }
    if (providerId) {
      slots = slots.filter(s => s.provider_id === providerId);
    }
    if (date) {
      slots = slots.filter(s => s.date === date);
    }
    
    return slots
      .map(s => toTimeSlot(s))
      .sort((a, b) => {
        const dateCompare = a.date.localeCompare(b.date);
        if (dateCompare !== 0) return dateCompare;
        return a.startTime.localeCompare(b.startTime);
      });
  }
  
  async getAvailableSlots(
    serviceId: number,
    date?: string
  ): Promise<TimeSlotWithAvailability[]> {
    let slots = Array.from(this.slots.values())
      .filter(s => s.service_id === serviceId && s.is_available);
    
    if (date) {
      slots = slots.filter(s => s.date === date);
    }
    
    return slots
      .map(s => toTimeSlot(s))
      .filter(slot => isSlotBookable(slot));
  }
  
  async updateSlot(data: UpdateSlotDTO): Promise<TimeSlotWithAvailability> {
    const slot = this.slots.get(data.slotId);
    if (!slot) {
      throw new Error('Slot not found');
    }
    
    if (data.maxCapacity !== undefined) {
      if (data.maxCapacity < slot.booked_count) {
        throw new Error(`Cannot reduce max capacity below current bookings (${slot.booked_count})`);
      }
      slot.max_capacity = data.maxCapacity;
    }
    
    if (data.isAvailable !== undefined) {
      slot.is_available = data.isAvailable;
    }
    
    if (data.bookedCount !== undefined) {
      if (data.bookedCount > slot.max_capacity) {
        throw new Error('Booked count cannot exceed max capacity');
      }
      slot.booked_count = data.bookedCount;
    }
    
    if (data.startTime) {
      slot.start_time = data.startTime;
    }
    if (data.endTime) {
      slot.end_time = data.endTime;
    }
    if (data.date) {
      slot.date = data.date;
    }
    
    slot.updated_at = new Date().toISOString();
    this.slots.set(slot.id, slot);
    
    return toTimeSlot(slot);
  }
  
  async updateSlotBookCount(slotId: number, newBookedCount: number): Promise<void> {
    const slot = this.slots.get(slotId);
    if (!slot) {
      throw new Error('Slot not found');
    }
    
    if (newBookedCount > slot.max_capacity) {
      throw new Error('Booked count cannot exceed max capacity');
    }
    
    slot.booked_count = newBookedCount;
    slot.updated_at = new Date().toISOString();
    this.slots.set(slotId, slot);
  }
  
  async deleteSlot(id: number): Promise<boolean> {
    const slot = this.slots.get(id);
    if (!slot) {
      return false;
    }
    
    if (slot.booked_count > 0) {
      throw new Error('Cannot delete slot with existing bookings');
    }
    
    return this.slots.delete(id);
  }
  
  async getSlotAvailability(slotId: number): Promise<{
    total: number;
    booked: number;
    available: number;
    isAvailable: boolean;
  } | null> {
    const slot = await this.getSlotById(slotId);
    if (!slot) return null;
    
    return {
      total: slot.maxCapacity,
      booked: slot.bookedCount,
      available: slot.maxCapacity - slot.bookedCount,
      isAvailable: slot.isAvailable && (slot.maxCapacity - slot.bookedCount) > 0
    };
  }
  
  private async findOverlappingSlots(
    providerId: number,
    date: string,
    startTime: string,
    endTime: string
  ): Promise<ScheduleSlotDB[]> {
    return Array.from(this.slots.values()).filter(slot => 
      slot.provider_id === providerId &&
      slot.date === date &&
      ((slot.start_time <= startTime && slot.end_time > startTime) ||
       (slot.start_time < endTime && slot.end_time >= endTime) ||
       (slot.start_time >= startTime && slot.end_time <= endTime))
    );
  }
  
  async getScheduleForDay(providerId: number, date: string): Promise<TimeSlotWithAvailability[]> {
    const slots = await this.getAllSlots(undefined, providerId, date);
    return slots.sort((a, b) => a.startTime.localeCompare(b.startTime));
  }
  
  async getScheduleForWeek(providerId: number, startDate: string): Promise<Record<string, TimeSlotWithAvailability[]>> {
    const schedule: Record<string, TimeSlotWithAvailability[]> = {};
    const start = new Date(startDate);
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(start);
      date.setDate(start.getDate() + i);
      const dateStr = date.toISOString().split('T')[0];
      schedule[dateStr] = await this.getScheduleForDay(providerId, dateStr);
    }
    
    return schedule;
  }
}