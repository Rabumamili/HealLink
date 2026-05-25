// services/service.service.ts
import { ApiService } from './api.service';
import { 
  Service, 
  ServiceFilters, 
  ServiceStats, 
  CreateServiceDTO, 
  UpdateServiceDTO,
  ServiceStatus,
  ServiceType
} from '@/types/entities/service.types';
import { MockServiceRegistry } from './mock/mock.service';

class ServiceService extends ApiService {
  private useMock = true;
  private registry: MockServiceRegistry;

  constructor() {
    super();
    this.registry = MockServiceRegistry.getInstance();
  }

  async getServices(filters?: ServiceFilters, providerId?: number): Promise<Service[]> {
    if (this.useMock) {
      let services: Service[];
      
      if (providerId) {
        services = this.registry.getServices().findByProvider(undefined, providerId);
      } else {
        services = this.registry.getServices().findAll();
      }
      
      if (filters?.searchTerm) {
        const search = filters.searchTerm.toLowerCase();
        services = services.filter(s => 
          s.name.toLowerCase().includes(search) ||
          (s.description && s.description.toLowerCase().includes(search))
        );
      }
      
      if (filters?.status && filters.status !== 'all') {
        services = services.filter(s => s.status === filters.status);
      }
      
      if (filters?.serviceType && filters.serviceType !== 'all') {
        services = services.filter(s => s.serviceType === filters.serviceType);
      }
      
      return services;
    }
    
    let endpoint = '/services';
    const params = new URLSearchParams();
    if (filters?.searchTerm) params.append('search', filters.searchTerm);
    if (filters?.status && filters.status !== 'all') params.append('status', filters.status);
    if (filters?.serviceType && filters.serviceType !== 'all') params.append('serviceType', filters.serviceType);
    if (providerId) params.append('providerId', providerId.toString());
    if (params.toString()) endpoint += `?${params.toString()}`;
    
    return this.get<Service[]>(endpoint);
  }

  async getServicesByProvider(providerId: number, filters?: ServiceFilters): Promise<Service[]> {
    return this.getServices(filters, providerId);
  }

  async getServiceById(id: number): Promise<Service | undefined> {
    if (this.useMock) {
      return this.registry.getServices().findById(id);
    }
    return this.get<Service>(`/services/${id}`);
  }

  async getServiceStats(providerId?: number): Promise<ServiceStats> {
    if (this.useMock) {
      return this.registry.getServices().getStats(undefined, providerId);
    }
    let endpoint = '/services/stats';
    const params = new URLSearchParams();
    if (providerId) params.append('providerId', providerId.toString());
    if (params.toString()) endpoint += `?${params.toString()}`;
    return this.get<ServiceStats>(endpoint);
  }

  async createService(data: CreateServiceDTO): Promise<Service> {
    if (this.useMock) {
      return this.registry.getServices().createService(data);
    }
    return this.post<Service>('/services', data);
  }

  async updateService(id: number, data: UpdateServiceDTO): Promise<Service | undefined> {
    if (this.useMock) {
      return this.registry.getServices().updateService(id, data);
    }
    return this.put<Service>(`/services/${id}`, data);
  }

  async deleteService(id: number): Promise<boolean> {
    if (this.useMock) {
      return this.registry.getServices().deleteService(id);
    }
    return this.delete(`/services/${id}`);
  }

  async toggleServiceStatus(id: number): Promise<Service | undefined> {
    if (this.useMock) {
      return this.registry.getServices().toggleStatus(id);
    }
    // Send empty object as the data parameter
    return this.patch<Service>(`/services/${id}/toggle-status`, {});
  }
}

export const serviceService = new ServiceService();