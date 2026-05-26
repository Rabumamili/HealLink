// types/entities/appointment.types.ts (UPDATED)

export type AppointmentStatus = 
  | 'Scheduled' 
  | 'Confirmed' 
  | 'Checked-in'   
  | 'In Progress' 
  | 'Completed' 
  | 'Cancelled' 
  | 'No-show';

export type AppointmentType = 
  | 'Diagnostic' 
  | 'Consultation' 
  | 'Follow-up' 
  | 'Emergency' 
  | 'Vaccination' 
  | 'Procedure';

export type PaymentStatus = 'Paid' | 'Pending' | 'Failed' | 'Refunded';

// Import from the corrected schedule.types
import { TimeSlot } from './schedule.types';
import { PatientProfile } from './profile.types';
import { Service } from './service.types';
import { Card, CardStatus } from './card.types'; // NEW import

export interface Appointment {
  id: number;
  patientId: number;
  serviceId: number;
  slotId: number;           // References slot_id from schedule table
  type: AppointmentType;
  scheduledDateTime: string;
  status: AppointmentStatus;
  checkInTime: string | null;  // Should match card.used_at
  startTime: string | null;
  endTime: string | null;
  estimatedWaitMinutes: number | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  paymentId: number | null;
  cardId: number | null;        // FIX: Add reference to card (FK → card.id)
}

export interface AppointmentWithSlot extends Appointment {
  slot?: TimeSlot;
  availableSlots?: number;
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
  hasCard?: boolean;            // FIX: Filter by card existence
  cardStatus?: CardStatus;      // FIX: Filter by card status
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
  cardsIssued: number;          // FIX: Track card issuance
  cardsUtilized: number;        // FIX: Track card usage (check-ins)
}

export interface CheckedInPatient {
  id: string;                    // Consider changing to number to match card_id or appointment_id
  patientName: string;
  cardNumber: string;
  serviceName: string;
  checkInTime: string;
  scheduledTime: string;
  status: 'waiting' | 'in-progress' | 'completed';
  queueNumber: number;
  estimatedWaitMinutes: number;
  cardId?: number;               // FIX: Add reference to card
  appointmentId?: number;       // FIX: Add reference to appointment
}

// types/entities/appointment.types.ts

// ... existing imports ...

export interface EnrichedAppointment extends Appointment {
  paymentStatus: string;
  fee: number;
  patientName: string;
  patientEmail?: string;
  patientPhone?: string;
  serviceName?: string;
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