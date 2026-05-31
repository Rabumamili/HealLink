// types/entities/appointment.types.ts
import { TimeSlot } from './schedule.types';
import { PatientProfile } from './profile.types';
import { Service, ServiceType } from './service.types';
import { Card, CardStatus } from './card.types';
import { PaymentStatus } from './payment.types';

// Use const assertion for better type safety
export const APPOINTMENT_STATUS = {
  SCHEDULED: 'Scheduled',
  CONFIRMED: 'Confirmed',
  CHECKED_IN: 'Checked-in',
  IN_PROGRESS: 'In Progress',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
  NO_SHOW: 'No-show'
} as const;

export type AppointmentStatus = typeof APPOINTMENT_STATUS[keyof typeof APPOINTMENT_STATUS];

// Consistent camelCase naming (converted from DB snake_case at API layer)
export interface Appointment {
  id: number;
  patientId: number;
  serviceId: number;
  providerId: number;
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

// DTOs use the same consistent naming
export interface CreateAppointmentDTO {
  patientId: number;
  serviceId: number;
  slotId: number;
  notes?: string | null;
}

export interface BookAppointmentRequest {
  patientId: number;
  serviceId: number;
  slotId: number;
  paymentConfirmed: boolean;
  notes?: string | null;
}

export interface BookAppointmentResponse {
  success: boolean;
  appointment?: Appointment;
  card?: Card;
  paymentId?: number;
  paymentStatus?: PaymentStatus;
  message?: string;
}

// Fixed: Use undefined instead of 'all' literal
export interface AppointmentFilters {
  searchTerm?: string;
  status?: AppointmentStatus;
  startDate?: string;
  endDate?: string;
  patientId?: number;
  serviceId?: number;
  slotId?: number;
  type?: ServiceType;
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
  estimatedWaitMinutes: number;
  cardId?: number;
  appointmentId?: number;
}

// Improved: Use composition instead of extension
export interface AppointmentEnrichment {
  serviceDescription?: string;
  serviceDuration?: number;
  paymentStatus: PaymentStatus;
  fee: number;
  patientName: string;
  patientImage?: string;
  patientEmail?: string;
  patientPhone?: string;
  serviceName?: string;
  serviceType?: ServiceType;
  slotTime?: string;
  cardNumber?: string;
  cardStatus?: CardStatus;
  providerName?: string;
  providerType?: ProviderType;
  providerImage?: string;
  providerEmail: string;
  providerPhone?: string;
  location?: string;
  locationDetail?: string;
}

export type EnrichedAppointment = Appointment & AppointmentEnrichment;

// Added missing ProviderType
export type ProviderType = 'doctor' | 'clinic' | 'diagnostic_center';

export interface AppointmentWithDetails extends EnrichedAppointment {
  patient?: PatientProfile;
  service?: Service;
  card?: Card;
}

export type { PaymentStatus };

// Helper functions remain the same but with better types
export const canConfirmAppointment = (paymentStatus: PaymentStatus): boolean => {
  return paymentStatus === 'SUCCESS';
};

export const getAppointmentStatusFromPayment = (
  paymentStatus: PaymentStatus,
  defaultStatus: Extract<AppointmentStatus, 'Scheduled' | 'Confirmed' | 'Cancelled'> = 'Scheduled'
): Extract<AppointmentStatus, 'Scheduled' | 'Confirmed' | 'Cancelled'> => {
  switch (paymentStatus) {
    case 'SUCCESS':
      return 'Confirmed';
    case 'FAILED':
      return 'Cancelled';
    case 'PENDING':
      return defaultStatus;
    default:
      return defaultStatus;
  }
};