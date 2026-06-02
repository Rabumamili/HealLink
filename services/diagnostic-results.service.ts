// services/diagnostic-results.service.ts
import { ApiService } from './api.service';

export interface DiagnosticResult {
  id: number;
  appointment_id: number;
  status: string;
  updated_at: string;
  updated_by_provider_id?: number;
  created_at: string;
}

export interface UpdateResultStatusRequest {
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
}

class DiagnosticResultsService extends ApiService {
  private readonly basePath = '/diagnostic-results';

  async getResultForAppointment(appointmentId: number): Promise<DiagnosticResult> {
    return this.get<DiagnosticResult>(`${this.basePath}/appointments/${appointmentId}`, undefined, false);
  }

  async updateResultStatus(appointmentId: number, data: UpdateResultStatusRequest): Promise<DiagnosticResult> {
    return this.put<DiagnosticResult>(`${this.basePath}/appointments/${appointmentId}/status`, data);
  }

  async getMyResults(): Promise<DiagnosticResult[]> {
    return this.get<DiagnosticResult[]>(`${this.basePath}/mine`, undefined, false);
  }
}

export const diagnosticResultsService = new DiagnosticResultsService();
