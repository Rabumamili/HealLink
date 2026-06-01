// services/provider.service.ts
import { ApiService } from './api.service';
import { BackendProvider, ProviderListFilters } from '@/types/entities/provider.types';

interface BackendProviderRegisterPayload {
  provider_type: string;
  email: string;
  password?: string;
  name?: string;
  phone_number?: string;
  phone?: string;
  location?: string;
  address?: string;
  specialization?: string;
  license_number?: string;
  tin_number?: string;
  description?: string;
  role?: string;
  license_file: File;
}

interface BackendServiceCreatePayload {
  name: string;
  service_type: string;
  location: string;
  price: number;
  duration_minutes: number;
  description: string;
}

interface BackendServiceSlot {
  id: number;
  service_id: number;
  starts_at: string;
  ends_at: string;
  is_booked: boolean;
}

interface BackendSlotCreatePayload {
  starts_at: string;
  ends_at: string;
}

class ProviderService extends ApiService {
  async listProviders(filters?: ProviderListFilters): Promise<BackendProvider[]> {
    const params = new URLSearchParams();
    if (filters?.provider_type) params.append('provider_type', filters.provider_type);
    if (filters?.location) params.append('location', filters.location);

    const query = params.toString();
    return this.get<BackendProvider[]>(`/providers${query ? `?${query}` : ''}`, undefined, false);
  }

  async registerProvider(payload: BackendProviderRegisterPayload): Promise<BackendProvider> {
    const formData = new FormData();
    formData.append('provider_type', payload.provider_type);
    formData.append('email', payload.email);
    formData.append('license_file', payload.license_file);

    if (payload.password) formData.append('password', payload.password);
    if (payload.name) formData.append('name', payload.name);
    if (payload.phone_number) formData.append('phone_number', payload.phone_number);
    if (payload.phone) formData.append('phone', payload.phone);
    if (payload.location) formData.append('location', payload.location);
    if (payload.address) formData.append('address', payload.address);
    if (payload.specialization) formData.append('specialization', payload.specialization);
    if (payload.license_number) formData.append('license_number', payload.license_number);
    if (payload.tin_number) formData.append('tin_number', payload.tin_number);
    if (payload.description) formData.append('description', payload.description);
    if (payload.role) formData.append('role', payload.role);

    return this.postFormData<BackendProvider>('/providers', formData, undefined);
  }

  async createProviderService(providerId: number, payload: BackendServiceCreatePayload) {
    return this.post(`/providers/${providerId}/services`, payload, undefined, false);
  }

  async createServiceSlot(serviceId: number, payload: BackendSlotCreatePayload): Promise<BackendServiceSlot> {
    return this.post<BackendServiceSlot>(`/providers/services/${serviceId}/slots`, payload, undefined, false);
  }

  async listServiceSlots(serviceId: number, onlyAvailable: boolean = true): Promise<BackendServiceSlot[]> {
    return this.get<BackendServiceSlot[]>(`/providers/services/${serviceId}/slots?only_available=${onlyAvailable}`, undefined, false);
  }
}

export const providerService = new ProviderService();
