// types/entities/card.types.ts
export type CardStatus = 'Active' | 'Used' | 'Expired';

export interface Card {
  id: number;
  appointmentId: number;
  cardNumber: string;     
  status: CardStatus;
  createdAt: string;
  expiresAt: string;
  usedAt: string | null;
  updatedAt: string; // Added missing field
}

export interface CardWithAppointment extends Card {
  appointment?: {
    id: number;
    patientId: number;
    patientName?: string;
    scheduledDateTime?: string;
    serviceName?: string;
    providerType?: 'doctor' | 'clinic' | 'diagnostic_center';
    providerName?: string;
  };
}

export interface CardValidationResult {
  isValid: boolean;
  card?: Card;
  error?: 'not_found' | 'invalid_format' | 'expired' | 'already_used';
  message?: string;
}

export interface CardCheckInRequest {
  cardNumber: string;
  verifiedByStaffId: number;
  verifiedByType: 'doctor' | 'staff' | 'clinic' | 'diagnostic_center';
  checkInTime?: string;
}

export interface CardCheckInResult {
  success: boolean;
  appointmentId?: number;
  patientId?: number;
  patientName?: string;
  serviceName?: string;
  scheduledDateTime?: string;
  message?: string;
}

export interface CardGenerationRequest {
  appointmentId: number;
  validityHours?: number;
}

export interface CardGenerationResult {
  success: boolean;
  card?: Card;
  message?: string;
}

export interface CardStats {
  total: number;
  active: number;
  used: number;
  expired: number;
  utilizationRate: number;
  averageTimeToUseMinutes: number | null;
}

export interface CardFilters {
  status?: CardStatus | 'all';
  appointmentId?: number;
  patientId?: number;
  providerId?: number;
  dateFrom?: string;
  dateTo?: string;
  searchTerm?: string;
}