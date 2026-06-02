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

export interface ProviderProfile {
  id: number;
  name: string;
  provider_type: string;
  email: string;
  phone: string;
  specialization: string;
  license_number: string;
  tin_number: string;
  location: string;
  address: string;
  description: string;
  profile_picture: string;
  is_verified: boolean;
  verification_status: string;
  created_at: string;
}

export interface ProviderProfileUpdate {
  name?: string | null;
  phone?: string | null;
  specialization?: string | null;
  location?: string | null;
  address?: string | null;
  description?: string | null;
  profile_picture?: string;
}

class ServiceService extends ApiService {
  private readonly basePath = '/providers';

  async createProviderService(payload: ProviderServiceCreatePayload) {
    return this.post(`${this.basePath}/services`, payload);
  }

  async deleteProviderService(serviceId: number): Promise<any> {
    return this.delete<any>(`${this.basePath}/services/${serviceId}`);
  }

  async createServiceSlot(serviceId: number, payload: SlotCreatePayload): Promise<ServiceSlot> {
    return this.post<ServiceSlot>(`${this.basePath}/services/${serviceId}/slots`, payload);
  }

  async deleteServiceSlot(serviceId: number, slotId: number): Promise<any> {
    return this.delete<any>(`${this.basePath}/services/${serviceId}/slots/${slotId}`);
  }

  async listServiceSlots(serviceId: number, onlyAvailable: boolean = true): Promise<ServiceSlot[]> {
    return this.get<ServiceSlot[]>(`${this.basePath}/services/${serviceId}/slots?only_available=${onlyAvailable}`);
  }

  async listServices(): Promise<Service[]> {
    const apiServices = await this.get<any[]>(`${this.basePath}/services`);

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

  async getMyProfile(): Promise<ProviderProfile> {
    return this.get<ProviderProfile>(`${this.basePath}/me`);
  }

  async updateMyProfile(formData: FormData): Promise<ProviderProfile> {
    return this.patch<ProviderProfile>(`${this.basePath}/me/profile`, formData);
  }
}

export const serviceService = new ServiceService();