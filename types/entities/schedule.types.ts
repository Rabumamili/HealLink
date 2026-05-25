// types/schedule.ts
export interface TimeSlot {
  id: string
  startTime: string
  endTime: string
  shift: string
}

export interface DaySchedule {
  day: string
  isActive: boolean
  slots: TimeSlot[]
  note?: string
}

export interface ScheduleSettings {
  slotDuration: number
  bufferTime: number
  maxAppointmentsPerDay: number
}

export type WeekDay = "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday"