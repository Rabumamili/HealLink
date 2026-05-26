// types/entities/card.types.ts

export type CardStatus = 'Active' | 'Used' | 'Expired';

export interface Card {
  id: number;
  appointmentId: number;        // FK to Appointment
  cardNumber: string;           // Formatted: 4512-7893-1023-6745
  cardNumberHash: string;       // Hashed for security
  status: CardStatus;
  createdAt: string;            // Creation time (ISO datetime)
  expiresAt: string;            // Expiry time (e.g., 24 hours after check-in or creation)
  usedAt: string | null;        // Time of check-in (when patient arrives)
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
  error?: 'not_found' | 'invalid_format';  // Fixed: added missing 'expired' | 'already_used'?
  message?: string;
}

export interface CardCheckInRequest {
  cardNumber: string;
  verifiedByStaffId: number;    
  verifiedByType: 'doctor' | 'staff' | 'clinic' | 'diagnostic_center';  // Fixed: added quotes around each value
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
  validityHours?: number;       // Default: 24 hours from confirmation
}

export interface CardGenerationResult {
  success: boolean;
  card?: Card;
  message?: string;
}

// Statistics for reporting
export interface CardStats {
  total: number;
  active: number;
  used: number;
  expired: number;
  utilizationRate: number;      // (used / total) * 100
  averageTimeToUseMinutes: number | null;
}

export interface CardFilters {
  status?: CardStatus | 'all';
  appointmentId?: number;
  patientId?: number;
  providerId?: number;          // Filter by doctor/clinic/diagnostic center
  dateFrom?: string;
  dateTo?: string;
  searchTerm?: string;          // Search by card number (partial match)
}