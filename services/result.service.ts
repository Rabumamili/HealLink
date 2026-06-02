// services/result.service.ts
import { ApiService } from './api.service';

export interface DiagnosticResult {
  id: number;
  appointment_id: number;
  status: string;
  updated_at: string;
}

export interface UpdateResultStatusRequest {
  status: 'pending' | 'ready' | 'collected';
}

class ResultService extends ApiService {
  private readonly basePath = '/diagnostic-results';

  async getResultForAppointment(appointmentId: number): Promise<DiagnosticResult> {
    return this.get<DiagnosticResult>(`${this.basePath}/appointments/${appointmentId}`);
  }

  async updateResultStatus(appointmentId: number, data: UpdateResultStatusRequest): Promise<DiagnosticResult> {
    return this.put<DiagnosticResult>(`${this.basePath}/appointments/${appointmentId}/status`, data);
  }

  async getMyResults(): Promise<DiagnosticResult[]> {
    return this.get<DiagnosticResult[]>(`${this.basePath}/mine`);
  }
}

export const resultService = new ResultService();