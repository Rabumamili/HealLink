// services/provider.service.ts
import { ApiService } from './api.service';
import { BackendProvider, ProviderListFilters } from '@/types/entities/provider.types';

class ProviderService extends ApiService {
  async listProviders(filters?: ProviderListFilters): Promise<BackendProvider[]> {
    const params = new URLSearchParams();
    if (filters?.provider_type) params.append('provider_type', filters.provider_type);
    if (filters?.location) params.append('location', filters.location);

    const query = params.toString();
    return this.get<BackendProvider[]>(`/providers${query ? `?${query}` : ''}`, undefined, false);
  }
}

export const providerService = new ProviderService();
