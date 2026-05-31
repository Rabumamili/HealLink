// services/result.service.ts
import { ApiService } from './api.service';
import {
  Result,
  CreateResultDTO,
  UpdateResultDTO,
  ResultFilters,
  ResultWithDetails,
  ResultHistoryResponse,
  ResultStats,
  ResultStatus,
} from '@/types/entities/result.types';

class ResultService extends ApiService {
  private readonly basePath = '/results';

  // Get all results with filters
// services/result.service.ts (update getResults method)

async getResults(filters?: ResultFilters): Promise<Result[]> {
  const queryParams = new URLSearchParams();
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== 'all') {
        queryParams.append(key, String(value));
      }
    });
  }
  const queryString = queryParams.toString();
  const endpoint = queryString ? `${this.basePath}?${queryString}` : this.basePath;
  return this.get<Result[]>(endpoint);
}

  // Get result by ID
  async getResultById(id: number): Promise<ResultWithDetails> {
    return this.get<ResultWithDetails>(`${this.basePath}/${id}`);
  }

  // Get results for a specific appointment
  async getResultsByAppointment(appointmentId: number): Promise<ResultHistoryResponse> {
    return this.get<ResultHistoryResponse>(`${this.basePath}/appointment/${appointmentId}`);
  }

  // Get results by diagnostic center
  async getResultsByDiagnosticCenter(diagnosticCenterId: number, filters?: ResultFilters): Promise<Result[]> {
    const queryParams = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== 'all') {
          queryParams.append(key, String(value));
        }
      });
    }
    const queryString = queryParams.toString();
    const endpoint = `${this.basePath}/diagnostic-center/${diagnosticCenterId}${queryString ? `?${queryString}` : ''}`;
    return this.get<Result[]>(endpoint);
  }

  // Create new result
  async createResult(data: CreateResultDTO): Promise<Result> {
    return this.post<Result>(this.basePath, data);
  }

  // Update result status
  async updateResult(id: number, data: UpdateResultDTO): Promise<Result> {
    return this.patch<Result>(`${this.basePath}/${id}`, data);
  }

  // Update diagnostic result (alias for updateResult)
  async updateDiagnosticResult(id: number, data: UpdateResultDTO): Promise<Result> {
    return this.updateResult(id, data);
  }

  // Delete result
  async deleteResult(id: number): Promise<void> {
    return this.delete(`${this.basePath}/${id}`);
  }

  // Get result statistics
  async getResultStats(diagnosticCenterId?: number): Promise<ResultStats> {
    const queryParams = diagnosticCenterId ? `?diagnosticCenterId=${diagnosticCenterId}` : '';
    return this.get<ResultStats>(`${this.basePath}/stats${queryParams}`);
  }

  // Bulk update result statuses
  async bulkUpdateStatus(updates: { id: number; status: ResultStatus }[]): Promise<Result[]> {
    return this.post<Result[]>(`${this.basePath}/bulk-update`, { updates });
  }

  // Get pending results for diagnostic center
  async getPendingResults(diagnosticCenterId: number): Promise<Result[]> {
    return this.get<Result[]>(`${this.basePath}/pending/${diagnosticCenterId}`);
  }

  // Get results by staff member
  async getResultsByStaff(staffId: number): Promise<Result[]> {
    return this.get<Result[]>(`${this.basePath}/staff/${staffId}`);
  }

  // Mark result as ready for collection
  async markAsReady(id: number, staffId: number): Promise<Result> {
    return this.patch<Result>(`${this.basePath}/${id}/ready`, { changed_by_staff_id: staffId });
  }

  // Mark result as collected
  async markAsCollected(id: number, staffId: number): Promise<Result> {
    return this.patch<Result>(`${this.basePath}/${id}/collected`, { changed_by_staff_id: staffId });
  }
}

export const resultService = new ResultService();