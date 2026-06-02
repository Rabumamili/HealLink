// services/service.service.ts
import { ApiService } from './api.service';
import { Service, ServiceType } from '@/types/entities/service.types';

export type { Service };

export interface ServiceSlot {
  id: number;
  service_id: number;
  starts_at: string;
  ends_at: string;
  is_booked: boolean;
}

export interface ProviderServiceCreatePayload {
  name: string;
  service_type: string;
  location: string;
  price: number;
  duration_minutes: number;
  description: string;
}

export interface SlotCreatePayload {
  starts_at: string;
  ends_at: string;
}

class ServiceService extends ApiService {
  private readonly basePath = '/providers';

  async createProviderService(providerId: number, payload: ProviderServiceCreatePayload) {
    return this.post(`${this.basePath}/${providerId}/services`, payload);
  }

  async updateProviderService(providerId: number, serviceId: number, payload: Partial<ProviderServiceCreatePayload>) {
    return this.patch(`${this.basePath}/${providerId}/services/${serviceId}`, payload);
  }

  async deleteProviderService(providerId: number, serviceId: number) {
    return this.delete(`${this.basePath}/${providerId}/services/${serviceId}`);
  }

  async createServiceSlot(serviceId: number, payload: SlotCreatePayload): Promise<ServiceSlot> {
    return this.post<ServiceSlot>(`${this.basePath}/services/${serviceId}/slots`, payload);
  }

  async listServiceSlots(serviceId: number, onlyAvailable: boolean = true): Promise<ServiceSlot[]> {
    return this.get<ServiceSlot[]>(`${this.basePath}/services/${serviceId}/slots?only_available=${onlyAvailable}`, undefined, false);
  }

  async listServices(serviceType?: string | null, location?: string | null): Promise<Service[]> {
    const queryParams = new URLSearchParams();
    if (serviceType !== undefined && serviceType !== null) {
      queryParams.append('service_type', serviceType);
    }
    if (location !== undefined && location !== null) {
      queryParams.append('location', location);
    }

    const query = queryParams.toString();
    const apiServices = await this.get<any[]>(`${this.basePath}/services${query ? `?${query}` : ''}`, undefined, false);

    // Transform API response (snake_case) to internal format (camelCase)
    return apiServices.map(apiService => ({
      id: apiService.id,
      providerId: apiService.provider_id,
      name: apiService.name,
      serviceType: apiService.service_type as ServiceType,
      location: apiService.location,
      standardFee: apiService.price != null ? parseFloat(apiService.price) : 0,
      durationMinutes: apiService.duration_minutes,
      description: apiService.description,
      status: apiService.is_active ? 'Active' : 'Inactive',
      createdAt: apiService.created_at || new Date().toISOString(),
      updatedAt: apiService.updated_at || new Date().toISOString(),
      preparationInstructions: null,
    }));
  }
}

export const serviceService = new ServiceService();