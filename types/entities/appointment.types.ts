// types/entities/appointment.types.ts
import { TimeSlot } from './schedule.types';
import { PatientProfile } from './profile.types';
import { Service, ServiceType } from './service.types';
import { Card, CardStatus } from './card.types';

export type AppointmentStatus = 
  | 'Scheduled' 
  | 'Confirmed' 
  | 'Checked-in'   
  | 'In Progress' 
  | 'Completed' 
  | 'Cancelled' 
  | 'No-show';

export type PaymentStatus = 'Paid' | 'Pending' | 'Failed' | 'Refunded';

export interface Appointment {
  id: number;
  patientId: number;
  serviceId: number;
  slotId: number;
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
  cardId: number | null;
}

export interface CreateAppointmentDTO {
  patientId: number;
  serviceId: number;
  slotId: number;
  scheduledDateTime: string;
  notes?: string | null;
}

export interface BookAppointmentRequest {
  patientId: number;
  serviceId: number;
  slotId: number;
  scheduledDateTime: string;
  paymentConfirmed: boolean;
  notes?: string | null;
}

export interface BookAppointmentResponse {
  success: boolean;
  appointment?: Appointment;
  card?: Card;
  paymentId?: number;
  message?: string;
}

export interface AppointmentFilters {
  searchTerm?: string;
  status?: AppointmentStatus | 'all';
  startDate?: string;
  endDate?: string;
  patientId?: number;
  serviceId?: number;
  slotId?: number;
  type?: ServiceType | 'all';
  hasCard?: boolean;
  cardStatus?: CardStatus;
  providerId?: number;
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
  cardsIssued: number;
  cardsUtilized: number;
}

export interface CheckedInPatient {
  id: number;
  patientName: string;
  cardNumber: string;
  serviceName: string;
  serviceType?: ServiceType;
  checkInTime: string;
  scheduledTime: string;
  status: 'waiting' | 'in-progress' | 'completed';
  queueNumber: number;
  estimatedWaitMinutes: number;
  cardId?: number;
  appointmentId?: number;
}

export interface EnrichedAppointment extends Appointment {
  paymentStatus: PaymentStatus;
  fee: number;
  patientName: string;
  patientEmail?: string;
  patientPhone?: string;
  serviceName?: string;
  serviceType?: ServiceType;
  slotTime?: string;
  cardNumber?: string;
  cardStatus?: CardStatus;
  providerName?: string;
  providerType?: 'doctor' | 'clinic' | 'diagnostic_center';
  providerImage?: string;
  location?: string;
  locationDetail?: string;
}

export interface AppointmentWithDetails extends EnrichedAppointment {
  patient?: PatientProfile;
  service?: Service;
  card?: Card;
}