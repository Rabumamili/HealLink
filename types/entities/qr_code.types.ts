// types/qr.ts

// QR filters for querying
export interface QrFilters {
  status?: QrStatus;
  appointmentId?: number;
  dateFrom?: string;
  dateTo?: string;
  searchTerm?: string;
  page?: number;
  limit?: number;
}

// QR statistics
export interface QrStats {
  total: number;
  active: number;
  used: number;
  expired: number;
  pending: number;
  utilizationRate: number;
}

// QR generation request
export interface QrGenerationRequest {
  appointmentId: number;
  validityHours?: number;
}

// QR generation result
export interface QrGenerationResult {
  success: boolean;
  message?: string;
  qrData?: QrAppointmentResponse;
  cardNumber?: string;
}

// GET /api/v1/qr/appointments/{appointment_id} - Response
export interface QrAppointmentResponse {
  id: number;
  appointment_id: number;
  card_number: string;
  qr_image_b64: string;
  status: string;
  created_at: string; // ISO date string
  expires_at: string; // ISO date string
  used_at: string | null; // Can be null if not used
  used_by_provider_id: number | null; // Can be null if not used
  is_expired: boolean;
}

// POST /api/v1/qr/verify - Request Body
export interface VerifyCheckinRequest {
  card_number: string;
}

// POST /api/v1/qr/verify - Response
export interface VerifyCheckinResponse {
  appointment_id: number;
  patient_name: string;
  service_name: string;
  checked_in_at: string; // ISO date string
  provider_id: number;
}

// Optional: Enhanced types with proper date objects
export interface QrAppointmentResponseWithDates extends Omit<QrAppointmentResponse, 'created_at' | 'expires_at' | 'used_at'> {
  created_at: Date;
  expires_at: Date;
  used_at: Date | null;
}

export interface VerifyCheckinResponseWithDates extends Omit<VerifyCheckinResponse, 'checked_in_at'> {
  checked_in_at: Date;
}

// Optional: Status enum for better type safety
export type QrStatus = 'active' | 'used' | 'expired' | 'pending';

// Optional: Extended QR info for UI display
export interface QrDisplayInfo {
  qrCode: string; // base64 image data
  cardNumber: string;
  appointmentId: number;
  expiresAt: Date;
  isExpired: boolean;
  status: QrStatus;
}

// Optional: Check-in result for UI feedback
export interface CheckinResult {
  success: boolean;
  appointmentId?: number;
  patientName?: string;
  serviceName?: string;
  checkedInAt?: Date;
  providerId?: number;
  message?: string;
}

// Utility functions
export function parseQrDates(qrData: QrAppointmentResponse): QrAppointmentResponseWithDates {
  return {
    ...qrData,
    created_at: new Date(qrData.created_at),
    expires_at: new Date(qrData.expires_at),
    used_at: qrData.used_at ? new Date(qrData.used_at) : null,
  };
}

export function parseCheckinResponse(response: VerifyCheckinResponse): VerifyCheckinResponseWithDates {
  return {
    ...response,
    checked_in_at: new Date(response.checked_in_at),
  };
}

export function isQrValid(qrData: QrAppointmentResponse): boolean {
  return !qrData.is_expired && 
         qrData.status === 'active' && 
         new Date(qrData.expires_at) > new Date();
}

export function getQrStatus(qrData: QrAppointmentResponse): QrStatus {
  if (qrData.is_expired) return 'expired';
  if (qrData.used_at) return 'used';
  if (qrData.status === 'active') return 'active';
  return 'pending';
}
