// services/schedule.service.ts
import { ApiService } from './api.service';

export interface Schedule {
  id: number;
  provider_id: number;
  service_id: number;
  schedule_type: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  slot_duration_minutes: number;
  valid_from: string;
  valid_until: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateScheduleRequest {
  service_id: number;
  schedule_type: 'daily' | 'weekly';
  day_of_week: number;
  start_time: string;
  end_time: string;
  slot_duration_minutes: number;
  valid_from: string;
  valid_until: string;
}

export interface UpdateScheduleRequest {
  start_time?: string;
  end_time?: string;
  slot_duration_minutes?: number;
  valid_from?: string;
  valid_until?: string;
  is_active?: boolean;
}

export interface GenerateSlotsRequest {
  date: string;
}

export interface GenerateSlotsResponse {
  message: string;
  slots_created: number;
}

class ScheduleService extends ApiService {
  private readonly basePath = '/schedules';

  async createSchedule(data: CreateScheduleRequest): Promise<Schedule> {
    return this.post<Schedule>(this.basePath, data, undefined, false);
  }

  async listSchedules(serviceId?: number | null, isActive?: boolean | null): Promise<Schedule[]> {
    const queryParams = new URLSearchParams();
    if (serviceId !== undefined && serviceId !== null) {
      queryParams.append('service_id', serviceId.toString());
    }
    if (isActive !== undefined && isActive !== null) {
      queryParams.append('is_active', isActive.toString());
    }

    const query = queryParams.toString();
    return this.get<Schedule[]>(`${this.basePath}${query ? `?${query}` : ''}`, undefined, false);
  }

  async getSchedule(scheduleId: number): Promise<Schedule> {
    return this.get<Schedule>(`${this.basePath}/${scheduleId}`, undefined, false);
  }

  async updateSchedule(scheduleId: number, data: UpdateScheduleRequest): Promise<Schedule> {
    return this.put<Schedule>(`${this.basePath}/${scheduleId}`, data);
  }

  async deleteSchedule(scheduleId: number): Promise<any> {
    return this.delete<any>(`${this.basePath}/${scheduleId}`);
  }

  async generateSlots(scheduleId: number, data: GenerateSlotsRequest): Promise<GenerateSlotsResponse> {
    return this.post<GenerateSlotsResponse>(`${this.basePath}/${scheduleId}/generate-slots`, data, undefined, false);
  }
}

export const scheduleService = new ScheduleService();