// services/payment.service.ts
import { ApiService } from './api.service';

export interface ChapaInitializeRequest {
  email: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  callback_url: string;
  return_url: string;
}

export interface ChapaInitializeResponse {
  tx_ref: string;
  checkout_url: string;
}

export interface ChapaVerifyResponse {
  id: number;
  patient_id: number;
  appointment_id: number;
  provider: string;
  tx_ref: string;
  amount: string;
  currency: string;
  status: string;
  checkout_url: string;
  chapa_reference: string;
}

class PaymentService extends ApiService {
  private readonly basePath = '/payments';

  async initializeChapaPayment(appointmentId: number, data: ChapaInitializeRequest): Promise<ChapaInitializeResponse> {
    return this.post<ChapaInitializeResponse>(`${this.basePath}/appointments/${appointmentId}/chapa/initialize`, data, undefined, false);
  }

  async verifyChapaPayment(txRef: string): Promise<ChapaVerifyResponse> {
    return this.get<ChapaVerifyResponse>(`${this.basePath}/chapa/verify/${txRef}`, undefined, false);
  }

  async chapaCallback(trxRef: string): Promise<ChapaVerifyResponse> {
    return this.get<ChapaVerifyResponse>(`${this.basePath}/chapa/callback?trx_ref=${trxRef}`, undefined, false);
  }
}

export const paymentService = new PaymentService();