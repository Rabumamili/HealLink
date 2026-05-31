// services/service.service.ts
import {
  Service,
  ServiceStatus,
  SERVICE_STATUS,
  ServiceType,
  SERVICE_TYPE,
  CreateServiceDTO,
  UpdateServiceDTO,
  ServiceFilters,
  ServiceStats,
  isServiceAvailable
} from '../types/entities/service.types';

export class ServiceService {
  private services: Map<number, Service> = new Map();
  private currentId: number = 1;
  
  constructor() {
    // Initialize with some default services
    this.initializeDefaultServices();
  }
  
  private initializeDefaultServices(): void {
    const defaultServices: CreateServiceDTO[] = [
      {
        providerId: 1,
        name: 'General Consultation',
        description: 'Standard medical consultation with a general practitioner',
        durationMinutes: 30,
        standardFee: 500,
        preparationInstructions: 'Bring any relevant medical records',
        serviceType: SERVICE_TYPE.CONSULTATION,
        status: SERVICE_STATUS.ACTIVE
      },
      {
        providerId: 1,
        name: 'Blood Test',
        description: 'Complete blood count and basic metabolic panel',
        durationMinutes: 15,
        standardFee: 800,
        preparationInstructions: 'Fast for 8 hours before the test',
        serviceType: SERVICE_TYPE.DIAGNOSTIC,
        status: SERVICE_STATUS.ACTIVE
      },
      {
        providerId: 1,
        name: 'COVID-19 Vaccination',
        description: 'COVID-19 vaccine administration',
        durationMinutes: 20,
        standardFee: 0,
        preparationInstructions: 'Bring ID and previous vaccination card if available',
        serviceType: SERVICE_TYPE.ClinicServices,
        status: SERVICE_STATUS.ACTIVE
      },
      {
        providerId: 1,
        name: 'Minor Surgery',
        description: 'Minor surgical procedures',
        durationMinutes: 60,
        standardFee: 3000,
        preparationInstructions: 'Do not eat or drink 6 hours before procedure',
        serviceType: SERVICE_TYPE.ClinicServices,
        status: SERVICE_STATUS.ACTIVE
      }
    ];
    
    defaultServices.forEach(service => {
      this.createService(service);
    });
  }
  
  async createService(data: CreateServiceDTO): Promise<Service> {
    // Validate service type
    if (!Object.values(SERVICE_TYPE).includes(data.serviceType)) {
      throw new Error('Invalid service type');
    }
    
    // Validate status
    if (!Object.values(SERVICE_STATUS).includes(data.status)) {
      throw new Error('Invalid service status');
    }
    
    // Check for duplicate name for same provider
    const existing = await this.findServiceByNameAndProvider(data.name, data.providerId);
    if (existing) {
      throw new Error('Service with this name already exists for this provider');
    }
    
    const service: Service = {
      id: this.currentId++,
      providerId: data.providerId,
      name: data.name,
      description: data.description,
      durationMinutes: data.durationMinutes,
      standardFee: data.standardFee,
      preparationInstructions: data.preparationInstructions || null,
      serviceType: data.serviceType,
      status: data.status,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    this.services.set(service.id, service);
    return service;
  }
  
  async getServiceById(id: number): Promise<Service | null> {
    return this.services.get(id) || null;
  }
  
  async getAllServices(filters?: ServiceFilters): Promise<Service[]> {
    let services = Array.from(this.services.values());
    
    if (filters) {
      if (filters.status) {
        services = services.filter(s => s.status === filters.status);
      }
      if (filters.serviceType) {
        services = services.filter(s => s.serviceType === filters.serviceType);
      }
      if (filters.providerId) {
        services = services.filter(s => s.providerId === filters.providerId);
      }
      if (filters.minFee !== undefined) {
        services = services.filter(s => s.standardFee >= filters.minFee!);
      }
      if (filters.maxFee !== undefined) {
        services = services.filter(s => s.standardFee <= filters.maxFee!);
      }
      if (filters.searchTerm) {
        const term = filters.searchTerm.toLowerCase();
        services = services.filter(s => 
          s.name.toLowerCase().includes(term) || 
          s.description.toLowerCase().includes(term)
        );
      }
    }
    
    return services.sort((a, b) => a.name.localeCompare(b.name));
  }
  
  async getActiveServices(): Promise<Service[]> {
    return this.getAllServices({ status: SERVICE_STATUS.ACTIVE });
  }
  
  async getServicesByType(type: ServiceType): Promise<Service[]> {
    return this.getAllServices({ serviceType: type, status: SERVICE_STATUS.ACTIVE });
  }
  
  async updateService(id: number, data: UpdateServiceDTO): Promise<Service> {
    const service = await this.getServiceById(id);
    if (!service) {
      throw new Error('Service not found');
    }
    
    if (data.name && data.name !== service.name) {
      const existing = await this.findServiceByNameAndProvider(data.name, service.providerId);
      if (existing && existing.id !== id) {
        throw new Error('Service with this name already exists for this provider');
      }
      service.name = data.name;
    }
    
    if (data.description !== undefined) service.description = data.description;
    if (data.durationMinutes !== undefined) service.durationMinutes = data.durationMinutes;
    if (data.standardFee !== undefined) service.standardFee = data.standardFee;
    if (data.preparationInstructions !== undefined) service.preparationInstructions = data.preparationInstructions;
    if (data.serviceType !== undefined) service.serviceType = data.serviceType;
    if (data.status !== undefined) service.status = data.status;
    
    service.updatedAt = new Date().toISOString();
    this.services.set(service.id, service);
    
    return service;
  }
  
  async deleteService(id: number): Promise<boolean> {
    const service = await this.getServiceById(id);
    if (!service) {
      return false;
    }
    
    // Soft delete - just deactivate
    if (service.status === SERVICE_STATUS.ACTIVE) {
      await this.updateService(id, { status: SERVICE_STATUS.INACTIVE });
      return true;
    }
    
    // Hard delete only if inactive
    return this.services.delete(id);
  }
  
  async getServiceStats(): Promise<ServiceStats> {
    const services = await this.getAllServices();
    
    const total = services.length;
    const active = services.filter(s => s.status === SERVICE_STATUS.ACTIVE).length;
    const inactive = services.filter(s => s.status === SERVICE_STATUS.INACTIVE).length;
    
    const totalRevenue = services
      .filter(s => s.status === SERVICE_STATUS.ACTIVE)
      .reduce((sum, s) => sum + s.standardFee, 0);
    
    const averageFee = active > 0 ? totalRevenue / active : 0;
    
    const byType: Record<ServiceType, number> = {
      [SERVICE_TYPE.CONSULTATION]: 0,
      [SERVICE_TYPE.DIAGNOSTIC]: 0,
      [SERVICE_TYPE.ClinicServices]: 0,
    };
    
    services.forEach(service => {
      if (service.status === SERVICE_STATUS.ACTIVE) {
        byType[service.serviceType]++;
      }
    });
    
    const averageDuration = active > 0 
      ? services
          .filter(s => s.status === SERVICE_STATUS.ACTIVE)
          .reduce((sum, s) => sum + s.durationMinutes, 0) / active
      : 0;
    
    return {
      total,
      active,
      inactive,
      totalRevenue,
      averageFee,
      byType,
      averageDuration
    };
  }
  
  async isServiceAvailable(id: number): Promise<boolean> {
    const service = await this.getServiceById(id);
    return service ? isServiceAvailable(service) : false;
  }
  
  async calculateServiceRevenue(id: number, numberOfBookings: number): Promise<number> {
    const service = await this.getServiceById(id);
    if (!service) {
      throw new Error('Service not found');
    }
    return service.standardFee * numberOfBookings;
  }
  
  async getServiceTypeColor(serviceType: ServiceType): Promise<string> {
    const colors: Record<ServiceType, string> = {
      [SERVICE_TYPE.CONSULTATION]: 'blue',
      [SERVICE_TYPE.DIAGNOSTIC]: 'green',
      [SERVICE_TYPE.ClinicServices]: 'orange',
    };
    return colors[serviceType];
  }
  
  private async findServiceByNameAndProvider(name: string, providerId: number): Promise<Service | null> {
    for (const service of this.services.values()) {
      if (service.name.toLowerCase() === name.toLowerCase() && service.providerId === providerId) {
        return service;
      }
    }
    return null;
  }
}