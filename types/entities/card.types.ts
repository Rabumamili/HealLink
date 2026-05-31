// types/entities/card.types.ts

export const CARD_STATUS = {
  ACTIVE: 'Active',
  USED: 'Used',
  EXPIRED: 'Expired',
  CANCELLED: 'Cancelled',
  PENDING: 'Pending'
} as const;

export type CardStatus = typeof CARD_STATUS[keyof typeof CARD_STATUS];

export interface Card {
  id: number;
  patientId: number;
  cardNumber: string;
  status: CardStatus;
  issuedAt: string;
  expiresAt: string;
  usedAt: string | null;
  appointmentId: number | null;
  serviceId: number | null; // Which service this card is for
  createdAt: string;
  updatedAt: string;
}

export interface CreateCardDTO {
  patientId: number;
  serviceId?: number;
  discountPercentage?: number;
  validDays?: number; // Days until expiration, defaults to 30
}

export interface UpdateCardDTO {
  status?: CardStatus;
  usedAt?: string | null;
  appointmentId?: number | null;
}

export interface CardFilters {
  patientId?: number;
  providerId?: number;
  appointmentId?: number;
  status?: CardStatus;
  isExpired?: boolean;
  serviceId?: number;
  dateFrom?: string;
  dateTo?: string;
  searchTerm?: string;
}

export interface CardStats {
  total: number;
  active: number;
  used: number;
  expired: number;
  cancelled: number;
  pending: number;
  utilizationRate: number; // percentage
  averageTimeToUseMinutes?: number | null;
}

export interface CardAppointmentSummary {
  id: number;
  patientId: number;
  patientName: string;
  scheduledDateTime: string;
  serviceName: string;
  providerType: 'doctor' | 'clinic' | 'diagnostic_center';
  providerName: string;
}

export interface CardWithAppointment extends Card {
  appointment?: CardAppointmentSummary;
}

export interface CardGenerationRequest {
  appointmentId: number;
  validityHours?: number;
}

export interface CardGenerationResult {
  success: boolean;
  card?: Card;
  message: string;
}

export interface CardValidationResult {
  isValid: boolean;
  card?: Card;
  error?: 'invalid_format' | 'not_found' | 'expired' | 'already_used';
  message: string;
}

export interface CardCheckInRequest {
  cardNumber: string;
  verifiedByStaffId: number;
  verifiedByType: 'doctor' | 'staff' | 'clinic' | 'diagnostic_center';
}

export interface CardCheckInResult {
  success: boolean;
  message: string;
  appointmentId?: number;
  patientId?: number;
  patientName?: string;
  serviceName?: string;
  scheduledDateTime?: string;
}

// Helper functions
export function isCardValid(card: Card): boolean {
  if (card.status !== CARD_STATUS.ACTIVE) return false;
  if (new Date(card.expiresAt) < new Date()) return false;
  return true;
}

export function canCardBeUsed(card: Card, serviceId?: number): boolean {
  if (!isCardValid(card)) return false;
  if (card.serviceId && card.serviceId !== serviceId) return false;
  return true;
}

export function getCardDisplayStatus(card: Card): { label: string; color: string } {
  if (!isCardValid(card) && card.status === CARD_STATUS.ACTIVE) {
    return { label: 'Expired', color: 'error' };
  }
  
  const statusMap: Record<CardStatus, { label: string; color: string }> = {
    Active: { label: 'Active', color: 'success' },
    Used: { label: 'Used', color: 'default' },
    Expired: { label: 'Expired', color: 'error' },
    Cancelled: { label: 'Cancelled', color: 'warning' },
    Pending: { label: 'Pending', color: 'info' }
  };
  
  return statusMap[card.status];
}