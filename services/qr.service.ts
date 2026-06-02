// services/qr.service.ts
import { ApiService } from './api.service';

export interface QrAppointmentResponse {
  id: number;
  appointment_id: number;
  card_number: string;
  qr_image_b64: string;
  status: string;
  created_at: string;
  expires_at: string;
  used_at: string | null;
  used_by_provider_id: number | null;
  is_expired: boolean;
}

export interface VerifyCheckinRequest {
  card_number: string;
}

export interface VerifyCheckinResponse {
  appointment_id: number;
  patient_name: string;
  service_name: string;
  checked_in_at: string;
  provider_id: number;
}

class QrService extends ApiService {
  private readonly basePath = '/qr';

  async getQrByAppointmentId(appointmentId: number): Promise<QrAppointmentResponse> {
    return this.get<QrAppointmentResponse>(`${this.basePath}/appointments/${appointmentId}`, undefined, false);
  }

  async verifyCheckin(request: VerifyCheckinRequest): Promise<VerifyCheckinResponse> {
    return this.post<VerifyCheckinResponse>(`${this.basePath}/verify`, request, undefined, false);
  }
}

export const qrService = new QrService();