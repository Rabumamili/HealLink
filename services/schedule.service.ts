// services/schedule.service.ts
import { ApiService } from './api.service';
import { 
  TimeSlot, 
  CreateSlotDTO, 
  UpdateSlotDTO, 
  SlotAvailability,
  BulkSlotCreateDTO,
  DaySchedule,
  ScheduleSettings
} from '@/types/entities/schedule.types';
import { getScheduleRepository } from './mock/schedule.mock';

class ScheduleService extends ApiService {
  private useMock = true;
  private repository = getScheduleRepository();

  async getSlotsByProviderAndDate(providerId: number, date: string): Promise<TimeSlot[]> {
    if (this.useMock) return this.repository.findByProviderAndDate(providerId, date);
    return this.get<TimeSlot[]>(`/schedules/providers/${providerId}/slots?date=${date}`);
  }

  async getSlotsByServiceAndDate(serviceId: number, date: string): Promise<TimeSlot[]> {
    if (this.useMock) return this.repository.findByServiceAndDate(serviceId, date);
    return this.get<TimeSlot[]>(`/schedules/services/${serviceId}/slots?date=${date}`);
  }

  async getSlotsByDateRange(providerId: number, startDate: string, endDate: string): Promise<TimeSlot[]> {
    if (this.useMock) return this.repository.findByDateRange(providerId, startDate, endDate);
    return this.get<TimeSlot[]>(`/schedules/providers/${providerId}/slots?startDate=${startDate}&endDate=${endDate}`);
  }

  async getSlotById(slotId: number): Promise<TimeSlot | undefined> {
    if (this.useMock) return this.repository.findTimeSlotById(slotId);
    return this.get<TimeSlot>(`/schedules/slots/${slotId}`);
  }

  async getSlotAvailability(slotId: number): Promise<SlotAvailability> {
    if (this.useMock) return this.repository.getSlotAvailability(slotId);
    return this.get<SlotAvailability>(`/schedules/slots/${slotId}/availability`);
  }

  async getAvailableSlots(providerId: number, serviceId: number, date: string): Promise<TimeSlot[]> {
    if (this.useMock) {
      const slots = await this.repository.findByProviderAndDate(providerId, date);
      return slots.filter(slot => slot.serviceId === serviceId && slot.isAvailable && slot.bookedCount < slot.maxCapacity);
    }
    return this.get<TimeSlot[]>(`/schedules/providers/${providerId}/services/${serviceId}/available?date=${date}`);
  }

  async createSlot(data: CreateSlotDTO): Promise<TimeSlot> {
    if (this.useMock) return this.repository.createSlot(data);
    return this.post<TimeSlot>('/schedules/slots', data);
  }

  async bulkCreateSlots(data: BulkSlotCreateDTO): Promise<TimeSlot[]> {
    if (this.useMock) return this.repository.bulkCreateSlots(data);
    return this.post<TimeSlot[]>('/schedules/slots/bulk', data);
  }

  async updateSlot(data: UpdateSlotDTO): Promise<TimeSlot> {
    if (this.useMock) return this.repository.updateSlot(data);
    return this.put<TimeSlot>(`/schedules/slots/${data.slotId}`, data);
  }

  async deleteSlot(slotId: number): Promise<boolean> {
    if (this.useMock) return this.repository.deleteSlot(slotId);
    return this.delete(`/schedules/slots/${slotId}`);
  }

  async getDayScheduleTemplate(providerType: string, providerId?: number): Promise<DaySchedule[]> {
    if (this.useMock) return this.repository.getDayScheduleTemplate(providerType, providerId);
    return this.get<DaySchedule[]>(`/schedules/providers/${providerId}/template`);
  }

  async saveDayScheduleTemplate(providerId: number, schedule: DaySchedule[]): Promise<DaySchedule[]> {
    if (this.useMock) return this.repository.saveDayScheduleTemplate(providerId, schedule);
    return this.post<DaySchedule[]>(`/schedules/providers/${providerId}/template`, schedule);
  }

  async getScheduleSettings(providerId: number): Promise<ScheduleSettings> {
    if (this.useMock) return this.repository.getScheduleSettings(providerId);
    return this.get<ScheduleSettings>(`/schedules/providers/${providerId}/settings`);
  }

  async updateScheduleSettings(providerId: number, settings: Partial<ScheduleSettings>): Promise<ScheduleSettings> {
    if (this.useMock) return this.repository.updateScheduleSettings(providerId, settings);
    return this.patch<ScheduleSettings>(`/schedules/providers/${providerId}/settings`, settings);
  }

  async generateSlotsFromTemplate(providerId: number, serviceId: number, startDate: string, endDate: string): Promise<TimeSlot[]> {
    if (this.useMock) return this.repository.generateSlotsFromTemplate(providerId, serviceId, startDate, endDate);
    return this.post<TimeSlot[]>(`/schedules/providers/${providerId}/generate`, { serviceId, startDate, endDate });
  }

  async bookSlot(slotId: number): Promise<TimeSlot> {
    if (this.useMock) return this.repository.bookSlot(slotId);
    return this.post<TimeSlot>(`/schedules/slots/${slotId}/book`, {});
  }

  async cancelSlotBooking(slotId: number): Promise<TimeSlot> {
    if (this.useMock) return this.repository.cancelSlotBooking(slotId);
    return this.post<TimeSlot>(`/schedules/slots/${slotId}/cancel`, {});
  }
}

export const scheduleService = new ScheduleService();