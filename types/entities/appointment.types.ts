// types/entities/appointment.types.ts
export type AppointmentStatus = 'Scheduled' | 'Confirmed' | 'Checked-in' | 'In Progress' | 'Completed' | 'Cancelled' | 'No-show';
export type AppointmentType = 'Diagnostic' | 'Consultation' | 'Follow-up' | 'Emergency' | 'Vaccination' | 'Procedure';
export type PaymentStatus = 'Paid' | 'Pending' | 'Failed' | 'Refunded';

export interface Appointment {
  id: number;
  patientId: number;
  serviceId: number;
  slotId: number;
  type: AppointmentType;
  scheduledDateTime: string;
  status: AppointmentStatus;
  checkInTime: string | null;
  startTime: string | null;
  endTime: string | null;
  estimatedWaitMinutes: number | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  paymentId: number | null;
}

export interface AppointmentFilters {
  searchTerm?: string;
  status?: AppointmentStatus | 'all';
  startDate?: string;
  endDate?: string;
  patientId?: number;
  serviceId?: number;
  slotId?: number;
  type?: AppointmentType;
}

export interface AppointmentStats {
  total: number;
  today: number;
  confirmed: number;
  checkedIn: number;
  inProgress: number;
  completed: number;
  cancelled: number;
  noShow: number;
  averageWaitTime: number;
  revenue: number;
  upcoming: number;
}

export interface CheckedInPatient {
  id: string;
  patientName: string;
  cardNumber: string;
  serviceName: string;
  checkInTime: string;
  scheduledTime: string;
  status: 'waiting' | 'in-progress' | 'completed';
  queueNumber: number;
  estimatedWaitMinutes: number;
}

export interface TimeSlot {
  id: number;
  startTime: string;
  endTime: string;
  shift: string;
  isAvailable: boolean;
}

export interface EnrichedAppointment extends Appointment {
  paymentStatus: string;
  fee: number;
  patientName: string;
  patientEmail?: string;
  patientPhone?: string;
  serviceName?: string;
  slotTime?: string;
}

export interface AppointmentWithDetails extends EnrichedAppointment {
  patient?: PatientProfile;
  service?: Service;
}

import { PatientProfile } from './profile.types';
import { Service } from './service.types';