// services/mock/schedule.repository.ts
import { BaseRepository } from '.';
import { 
  ScheduleSlot, 
  TimeSlot, 
  toTimeSlot,
  CreateSlotDTO, 
  UpdateSlotDTO, 
  SlotAvailability,
  BulkSlotCreateDTO,
  DaySchedule,
  ScheduleSettings,
  WeekDay
} from '@/types/entities/schedule.types';

export class ScheduleRepository extends BaseRepository<ScheduleSlot> {
  private static instance: ScheduleRepository;
  private dayScheduleTemplates: Map<number, DaySchedule[]> = new Map();
  private scheduleSettings: Map<number, ScheduleSettings> = new Map();

  private constructor() {
    super();
    this.initializeMockData();
    this.initializeTemplates();
    this.initializeSettings();
  }

  static getInstance(): ScheduleRepository {
    if (!ScheduleRepository.instance) {
      ScheduleRepository.instance = new ScheduleRepository();
    }
    return ScheduleRepository.instance;
  }

  private initializeMockData(): void {
    this.items = [
      // Doctor Slots (provider_id: 101 - Dr. Abraham)
      {
        id: 1001,
        service_id: 1,
        provider_id: 101,
        date: '2024-05-20',
        start_time: '09:00:00',
        end_time: '09:30:00',
        max_capacity: 1,
        booked_count: 1,
        is_available: false,
        created_at: '2024-05-01T10:00:00Z',
        updated_at: '2024-05-20T08:55:00Z'
      },
      {
        id: 1002,
        service_id: 1,
        provider_id: 101,
        date: '2024-05-20',
        start_time: '09:30:00',
        end_time: '10:00:00',
        max_capacity: 1,
        booked_count: 0,
        is_available: true,
        created_at: '2024-05-01T10:00:00Z',
        updated_at: '2024-05-01T10:00:00Z'
      },
      {
        id: 1003,
        service_id: 1,
        provider_id: 101,
        date: '2024-05-20',
        start_time: '10:00:00',
        end_time: '10:30:00',
        max_capacity: 1,
        booked_count: 0,
        is_available: true,
        created_at: '2024-05-01T10:00:00Z',
        updated_at: '2024-05-01T10:00:00Z'
      },
      {
        id: 1004,
        service_id: 1,
        provider_id: 101,
        date: '2024-05-20',
        start_time: '14:00:00',
        end_time: '14:30:00',
        max_capacity: 1,
        booked_count: 0,
        is_available: true,
        created_at: '2024-05-01T10:00:00Z',
        updated_at: '2024-05-01T10:00:00Z'
      },
      {
        id: 1005,
        service_id: 1,
        provider_id: 101,
        date: '2024-05-21',
        start_time: '09:00:00',
        end_time: '09:30:00',
        max_capacity: 1,
        booked_count: 0,
        is_available: true,
        created_at: '2024-05-01T10:00:00Z',
        updated_at: '2024-05-01T10:00:00Z'
      },
      {
        id: 1006,
        service_id: 2,
        provider_id: 102,
        date: '2024-05-20',
        start_time: '10:30:00',
        end_time: '11:15:00',
        max_capacity: 1,
        booked_count: 1,
        is_available: false,
        created_at: '2024-05-01T10:00:00Z',
        updated_at: '2024-05-20T10:15:00Z'
      },
      {
        id: 1007,
        service_id: 2,
        provider_id: 102,
        date: '2024-05-20',
        start_time: '11:15:00',
        end_time: '12:00:00',
        max_capacity: 1,
        booked_count: 0,
        is_available: true,
        created_at: '2024-05-01T10:00:00Z',
        updated_at: '2024-05-01T10:00:00Z'
      },
      // Clinic Slots (provider_id: 103 - Bethel Medical Center)
      {
        id: 2001,
        service_id: 6,
        provider_id: 103,
        date: '2024-05-20',
        start_time: '09:00:00',
        end_time: '12:00:00',
        max_capacity: 20,
        booked_count: 5,
        is_available: true,
        created_at: '2024-05-01T10:00:00Z',
        updated_at: '2024-05-20T09:00:00Z'
      },
      {
        id: 2002,
        service_id: 6,
        provider_id: 103,
        date: '2024-05-20',
        start_time: '14:00:00',
        end_time: '17:00:00',
        max_capacity: 20,
        booked_count: 3,
        is_available: true,
        created_at: '2024-05-01T10:00:00Z',
        updated_at: '2024-05-20T14:00:00Z'
      },
      // Diagnostic Center Slots (provider_id: 104 - Addis Diagnostic Center)
      {
        id: 3001,
        service_id: 10,
        provider_id: 104,
        date: '2024-05-20',
        start_time: '08:00:00',
        end_time: '12:00:00',
        max_capacity: 30,
        booked_count: 12,
        is_available: true,
        created_at: '2024-05-01T10:00:00Z',
        updated_at: '2024-05-20T08:00:00Z'
      },
      {
        id: 3002,
        service_id: 10,
        provider_id: 104,
        date: '2024-05-20',
        start_time: '13:00:00',
        end_time: '17:00:00',
        max_capacity: 30,
        booked_count: 8,
        is_available: true,
        created_at: '2024-05-01T10:00:00Z',
        updated_at: '2024-05-20T13:00:00Z'
      }
    ];
  }

  private initializeTemplates(): void {
    const doctorTemplate: DaySchedule[] = [
      { day: "Monday", isActive: true, slots: [
        { id: "mon1", startTime: "08:00", endTime: "12:00", shift: "Morning", maxCapacity: 1 },
        { id: "mon2", startTime: "14:00", endTime: "18:00", shift: "Afternoon", maxCapacity: 1 }
      ]},
      { day: "Tuesday", isActive: true, slots: [
        { id: "tue1", startTime: "08:00", endTime: "12:00", shift: "Morning", maxCapacity: 1 },
        { id: "tue2", startTime: "14:00", endTime: "18:00", shift: "Afternoon", maxCapacity: 1 }
      ]},
      { day: "Wednesday", isActive: true, slots: [
        { id: "wed1", startTime: "09:00", endTime: "17:00", shift: "Full Day", maxCapacity: 1 }
      ]},
      { day: "Thursday", isActive: true, slots: [
        { id: "thu1", startTime: "08:00", endTime: "12:00", shift: "Morning", maxCapacity: 1 },
        { id: "thu2", startTime: "14:00", endTime: "18:00", shift: "Afternoon", maxCapacity: 1 }
      ]},
      { day: "Friday", isActive: true, slots: [
        { id: "fri1", startTime: "08:00", endTime: "12:00", shift: "Morning", maxCapacity: 1 },
        { id: "fri2", startTime: "14:00", endTime: "16:00", shift: "Afternoon", maxCapacity: 1 }
      ]},
      { day: "Saturday", isActive: false, slots: [], note: "Weekend - Clinic closed" },
      { day: "Sunday", isActive: false, slots: [], note: "Weekend - Clinic closed" }
    ];

    const clinicTemplate: DaySchedule[] = [
      { day: "Monday", isActive: true, slots: [
        { id: "mon1", startTime: "08:00", endTime: "12:00", shift: "Morning", maxCapacity: 20 },
        { id: "mon2", startTime: "13:00", endTime: "17:00", shift: "Afternoon", maxCapacity: 20 }
      ]},
      { day: "Tuesday", isActive: true, slots: [
        { id: "tue1", startTime: "08:00", endTime: "12:00", shift: "Morning", maxCapacity: 20 },
        { id: "tue2", startTime: "13:00", endTime: "17:00", shift: "Afternoon", maxCapacity: 20 }
      ]},
      { day: "Wednesday", isActive: true, slots: [
        { id: "wed1", startTime: "09:00", endTime: "16:00", shift: "Full Day", maxCapacity: 30 }
      ]},
      { day: "Thursday", isActive: true, slots: [
        { id: "thu1", startTime: "08:00", endTime: "12:00", shift: "Morning", maxCapacity: 20 },
        { id: "thu2", startTime: "13:00", endTime: "17:00", shift: "Afternoon", maxCapacity: 20 }
      ]},
      { day: "Friday", isActive: true, slots: [
        { id: "fri1", startTime: "08:00", endTime: "12:00", shift: "Morning", maxCapacity: 20 },
        { id: "fri2", startTime: "13:00", endTime: "16:00", shift: "Afternoon", maxCapacity: 15 }
      ]},
      { day: "Saturday", isActive: true, slots: [
        { id: "sat1", startTime: "09:00", endTime: "13:00", shift: "Morning", maxCapacity: 15 }
      ]},
      { day: "Sunday", isActive: false, slots: [], note: "Clinic closed on Sundays" }
    ];

    const diagnosticTemplate: DaySchedule[] = [
      { day: "Monday", isActive: true, slots: [
        { id: "mon1", startTime: "08:00", endTime: "12:00", shift: "Morning", maxCapacity: 30 },
        { id: "mon2", startTime: "13:00", endTime: "17:00", shift: "Afternoon", maxCapacity: 30 }
      ]},
      { day: "Tuesday", isActive: true, slots: [
        { id: "tue1", startTime: "08:00", endTime: "12:00", shift: "Morning", maxCapacity: 30 },
        { id: "tue2", startTime: "13:00", endTime: "17:00", shift: "Afternoon", maxCapacity: 30 }
      ]},
      { day: "Wednesday", isActive: true, slots: [
        { id: "wed1", startTime: "09:00", endTime: "16:00", shift: "Full Day", maxCapacity: 40 }
      ]},
      { day: "Thursday", isActive: true, slots: [
        { id: "thu1", startTime: "08:00", endTime: "12:00", shift: "Morning", maxCapacity: 30 },
        { id: "thu2", startTime: "13:00", endTime: "17:00", shift: "Afternoon", maxCapacity: 30 }
      ]},
      { day: "Friday", isActive: true, slots: [
        { id: "fri1", startTime: "08:00", endTime: "12:00", shift: "Morning", maxCapacity: 30 },
        { id: "fri2", startTime: "13:00", endTime: "16:00", shift: "Afternoon", maxCapacity: 25 }
      ]},
      { day: "Saturday", isActive: true, slots: [
        { id: "sat1", startTime: "09:00", endTime: "13:00", shift: "Morning", maxCapacity: 20 }
      ]},
      { day: "Sunday", isActive: false, slots: [], note: "Center closed on Sundays" }
    ];

    this.dayScheduleTemplates.set(101, doctorTemplate);
    this.dayScheduleTemplates.set(102, doctorTemplate);
    this.dayScheduleTemplates.set(105, doctorTemplate);
    this.dayScheduleTemplates.set(106, doctorTemplate);
    this.dayScheduleTemplates.set(103, clinicTemplate);
    this.dayScheduleTemplates.set(107, clinicTemplate);
    this.dayScheduleTemplates.set(104, diagnosticTemplate);
    this.dayScheduleTemplates.set(108, diagnosticTemplate);
  }

  private initializeSettings(): void {
    this.scheduleSettings.set(101, { slotDuration: 30, bufferTime: 5, maxAppointmentsPerDay: 16, defaultMaxCapacity: 1, breakDuration: 30 });
    this.scheduleSettings.set(102, { slotDuration: 30, bufferTime: 5, maxAppointmentsPerDay: 16, defaultMaxCapacity: 1, breakDuration: 30 });
    this.scheduleSettings.set(105, { slotDuration: 30, bufferTime: 5, maxAppointmentsPerDay: 16, defaultMaxCapacity: 1, breakDuration: 30 });
    this.scheduleSettings.set(106, { slotDuration: 30, bufferTime: 5, maxAppointmentsPerDay: 16, defaultMaxCapacity: 1, breakDuration: 30 });
    this.scheduleSettings.set(103, { slotDuration: 30, bufferTime: 10, maxAppointmentsPerDay: 100, defaultMaxCapacity: 20, breakDuration: 30, walkInAllowed: true, requireAppointment: false });
    this.scheduleSettings.set(107, { slotDuration: 30, bufferTime: 10, maxAppointmentsPerDay: 100, defaultMaxCapacity: 20, breakDuration: 30, walkInAllowed: true, requireAppointment: false });
    this.scheduleSettings.set(104, { slotDuration: 30, bufferTime: 10, maxAppointmentsPerDay: 150, defaultMaxCapacity: 30, breakDuration: 30, resultTurnaroundTime: 24, walkInAllowed: true, requireAppointment: false });
    this.scheduleSettings.set(108, { slotDuration: 30, bufferTime: 10, maxAppointmentsPerDay: 150, defaultMaxCapacity: 30, breakDuration: 30, resultTurnaroundTime: 24, walkInAllowed: true, requireAppointment: false });
  }

  async findByProviderAndDate(providerId: number, date: string): Promise<TimeSlot[]> {
    const slots = this.items.filter(slot => slot.provider_id === providerId && slot.date === date);
    return slots.map(toTimeSlot);
  }

  async findByServiceAndDate(serviceId: number, date: string): Promise<TimeSlot[]> {
    const slots = this.items.filter(slot => slot.service_id === serviceId && slot.date === date);
    return slots.map(toTimeSlot);
  }

  async findByDateRange(providerId: number, startDate: string, endDate: string): Promise<TimeSlot[]> {
    const slots = this.items.filter(slot => 
      slot.provider_id === providerId && slot.date >= startDate && slot.date <= endDate
    );
    return slots.map(toTimeSlot);
  }

findById(id: number): ScheduleSlot | undefined {
  return super.findById(id);
}

async findTimeSlotById(id: number): Promise<TimeSlot | undefined> {
  const slot = super.findById(id);

  if (!slot) {
    return undefined;
  }

  return toTimeSlot(slot);
}
  async getSlotAvailability(slotId: number): Promise<SlotAvailability> {
    const slot = await this.findById(slotId);
    if (!slot) throw new Error('Slot not found');
    return {
      slotId: slot.id,
      date: slot.date,
      startTime: slot.start_time,
      endTime: slot.end_time,
      totalCapacity: slot.max_capacity,
      bookedCount: slot.booked_count,
      availableCount: slot.max_capacity - slot.booked_count,
      isAvailable: slot.is_available
    };
  }

  async createSlot(data: CreateSlotDTO): Promise<TimeSlot> {
    const newSlot = this.create({
        service_id: data.serviceId,
        provider_id: data.providerId,
        date: data.date,
        start_time: data.startTime,
        end_time: data.endTime,
        max_capacity: data.maxCapacity,
        booked_count: 0,
        is_available: true,
        created_at: '',
        updated_at: ''
    });
    return toTimeSlot(newSlot);
  }

  async updateSlot(data: UpdateSlotDTO): Promise<TimeSlot> {
    const updates: Partial<ScheduleSlot> = {};
    if (data.serviceId !== undefined) updates.service_id = data.serviceId;
    if (data.providerId !== undefined) updates.provider_id = data.providerId;
    if (data.date !== undefined) updates.date = data.date;
    if (data.startTime !== undefined) updates.start_time = data.startTime;
    if (data.endTime !== undefined) updates.end_time = data.endTime;
    if (data.maxCapacity !== undefined) updates.max_capacity = data.maxCapacity;
    if (data.bookedCount !== undefined) updates.booked_count = data.bookedCount;
    if (data.isAvailable !== undefined) updates.is_available = data.isAvailable;
    
    const updated = this.update(data.slotId, updates);
    if (!updated) throw new Error('Slot not found');
    return toTimeSlot(updated);
  }

  async deleteSlot(slotId: number): Promise<boolean> {
    return this.delete(slotId);
  }

  async bulkCreateSlots(data: BulkSlotCreateDTO): Promise<TimeSlot[]> {
    const createdSlots: TimeSlot[] = [];
    const startDate = new Date(data.dateRange.startDate);
    const endDate = new Date(data.dateRange.endDate);
    
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split('T')[0];
      const dayName = d.toLocaleDateString('en-US', { weekday: 'long' }) as WeekDay;
      
      if (data.weekDaysOnly && !data.weekDaysOnly.includes(dayName)) continue;
      
      for (const timeSlot of data.timeSlots) {
        const newSlot = await this.createSlot({
          serviceId: data.serviceId,
          providerId: data.providerId,
          date: dateStr,
          startTime: timeSlot.startTime,
          endTime: timeSlot.endTime,
          maxCapacity: timeSlot.maxCapacity
        });
        createdSlots.push(newSlot);
      }
    }
    return createdSlots;
  }

  async getDayScheduleTemplate(providerType: string, providerId?: number): Promise<DaySchedule[]> {
    if (providerId && this.dayScheduleTemplates.has(providerId)) {
      return JSON.parse(JSON.stringify(this.dayScheduleTemplates.get(providerId)!));
    }
    switch (providerType) {
      case 'doctor': return JSON.parse(JSON.stringify(this.dayScheduleTemplates.get(101)!));
      case 'clinic': return JSON.parse(JSON.stringify(this.dayScheduleTemplates.get(103)!));
      case 'diagnostic': return JSON.parse(JSON.stringify(this.dayScheduleTemplates.get(104)!));
      default: return JSON.parse(JSON.stringify(this.dayScheduleTemplates.get(101)!));
    }
  }

  async saveDayScheduleTemplate(providerId: number, schedule: DaySchedule[]): Promise<DaySchedule[]> {
    this.dayScheduleTemplates.set(providerId, JSON.parse(JSON.stringify(schedule)));
    return schedule;
  }

  async getScheduleSettings(providerId: number): Promise<ScheduleSettings> {
    const settings = this.scheduleSettings.get(providerId);
    if (!settings) throw new Error('Settings not found');
    return JSON.parse(JSON.stringify(settings));
  }

  async updateScheduleSettings(providerId: number, settings: Partial<ScheduleSettings>): Promise<ScheduleSettings> {
    const current = await this.getScheduleSettings(providerId);
    const updated = { ...current, ...settings };
    this.scheduleSettings.set(providerId, updated);
    return updated;
  }

  async generateSlotsFromTemplate(providerId: number, serviceId: number, startDate: string, endDate: string): Promise<TimeSlot[]> {
    const template = await this.getDayScheduleTemplate('', providerId);
    const start = new Date(startDate);
    const end = new Date(endDate);
    const generatedSlots: TimeSlot[] = [];
    
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split('T')[0];
      const dayName = d.toLocaleDateString('en-US', { weekday: 'long' });
      const daySchedule = template.find(day => day.day === dayName);
      
      if (daySchedule?.isActive) {
        for (const slotTemplate of daySchedule.slots) {
          const existing = this.items.find(slot => 
            slot.provider_id === providerId && slot.service_id === serviceId &&
            slot.date === dateStr && slot.start_time === slotTemplate.startTime + ':00'
          );
          if (!existing) {
            const newSlot = await this.createSlot({
              serviceId, providerId, date: dateStr,
              startTime: slotTemplate.startTime + ':00',
              endTime: slotTemplate.endTime + ':00',
              maxCapacity: slotTemplate.maxCapacity
            });
            generatedSlots.push(newSlot);
          }
        }
      }
    }
    return generatedSlots;
  }

  async bookSlot(slotId: number): Promise<TimeSlot> {
    const slot = await this.findById(slotId);
    if (!slot) throw new Error('Slot not found');
    return this.updateSlot({
      slotId,
      bookedCount: slot.booked_count + 1,
      isAvailable: slot.booked_count + 1 < slot.max_capacity
    });
  }

  async cancelSlotBooking(slotId: number): Promise<TimeSlot> {
    const slot = await this.findById(slotId);
    if (!slot) throw new Error('Slot not found');
    return this.updateSlot({
      slotId,
      bookedCount: Math.max(0, slot.booked_count - 1),
      isAvailable: true
    });
  }
}

export const getScheduleRepository = () => ScheduleRepository.getInstance();