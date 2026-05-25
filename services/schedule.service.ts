// // services/schedule.service.ts
// import { ApiService } from './api.service'
// import { DaySchedule, ScheduleSettings, TimeSlot, WeekDay } from '@/types/entities/schedule.types'

// class ScheduleService extends ApiService {
//   async getSchedule(): Promise<DaySchedule[]> {
//     return this.get<DaySchedule[]>('/schedule')
//   }

//   async updateDaySchedule(day: WeekDay, schedule: Partial<DaySchedule>): Promise<DaySchedule> {
//     return this.put<DaySchedule>(`/schedule/${day}`, schedule)
//   }

//   async addTimeSlot(day: WeekDay, slot: Omit<TimeSlot, 'id'>): Promise<DaySchedule> {
//     return this.post<DaySchedule>(`/schedule/${day}/slots`, slot)
//   }

//   async removeTimeSlot(day: WeekDay, slotId: string): Promise<DaySchedule> {
//     return this.delete(`/schedule/${day}/slots/${slotId}`)
//   }

//   async getScheduleSettings(): Promise<ScheduleSettings> {
//     return this.get<ScheduleSettings>('/schedule/settings')
//   }

//   async updateScheduleSettings(settings: Partial<ScheduleSettings>): Promise<ScheduleSettings> {
//     return this.put<ScheduleSettings>('/schedule/settings', settings)
//   }
// }

// export const scheduleService = new ScheduleService()