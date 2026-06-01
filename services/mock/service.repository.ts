import { BaseRepository } from './base.repository';
import { SERVICE_TYPE, Service, ServiceStats, ServiceStatus, ServiceType, CreateServiceDTO, UpdateServiceDTO } from '@/types/entities/service.types';

export class ServiceRepository extends BaseRepository<Service> {
  private static instance: ServiceRepository;
  
  private constructor() {
    super();
    this.initializeMockData();
  }

  static getInstance(): ServiceRepository {
    if (!ServiceRepository.instance) {
      ServiceRepository.instance = new ServiceRepository();
    }
    return ServiceRepository.instance;
  }

  private initializeMockData(): void {
    this.items = [
      // Doctor Services (Consultations - only doctors provide consultations)
      {
        id: 1,
        providerId: 101,
        name: "General Consultation",
        description: "Standard medical consultation with a general physician",
        durationMinutes: 30,
        standardFee: 500,
        preparationInstructions: "Please arrive 15 minutes early",
        serviceType: SERVICE_TYPE.CONSULTATION,
        status: "Active",
        createdAt: "2023-01-01T00:00:00Z",
        updatedAt: "2023-01-01T00:00:00Z"
      },
      {
        id: 2,
        providerId: 102,
        name: "Pediatric Consultation",
        description: "Comprehensive health checkup for children",
        durationMinutes: 45,
        standardFee: 650,
        preparationInstructions: "Bring immunization records",
        serviceType: SERVICE_TYPE.CONSULTATION,
        status: "Active",
        createdAt: "2023-01-01T00:00:00Z",
        updatedAt: "2023-01-01T00:00:00Z"
      },
      {
        id: 3,
        providerId: 105,
        name: "Cardiology Consultation",
        description: "Specialized cardiology consultation for heart-related concerns",
        durationMinutes: 45,
        standardFee: 850,
        preparationInstructions: "Bring previous medical records",
        serviceType: SERVICE_TYPE.CONSULTATION,
        status: "Active",
        createdAt: "2023-01-01T00:00:00Z",
        updatedAt: "2023-01-01T00:00:00Z"
      },
      {
        id: 4,
        providerId: 106,
        name: "Dermatology Consultation",
        description: "Skin health consultation and diagnosis",
        durationMinutes: 30,
        standardFee: 550,
        preparationInstructions: "Remove makeup before appointment",
        serviceType: SERVICE_TYPE.CONSULTATION,
        status: "Active",
        createdAt: "2023-01-01T00:00:00Z",
        updatedAt: "2023-01-01T00:00:00Z"
      },
      {
        id: 5,
        providerId: 105,
        name: "Internal Medicine Consultation",
        description: "Comprehensive adult health consultation",
        durationMinutes: 45,
        standardFee: 600,
        preparationInstructions: "Bring medical history",
        serviceType: SERVICE_TYPE.CONSULTATION,
        status: "Active",
        createdAt: "2023-01-01T00:00:00Z",
        updatedAt: "2023-01-01T00:00:00Z"
      },
      
      // Clinic Services (Only non-consultation services like vaccinations, procedures)
      {
        id: 6,
        providerId: 103,
        name: "Influenza Vaccination",
        description: "Annual flu vaccination",
        durationMinutes: 20,
        standardFee: 600,
        preparationInstructions: null,
        serviceType: SERVICE_TYPE.ClinicServices,
        status: "Active",
        createdAt: "2023-01-01T00:00:00Z",
        updatedAt: "2023-01-01T00:00:00Z"
      },
      {
        id: 7,
        providerId: 103,
        name: "Minor Procedure",
        description: "Minor surgical procedures and wound care",
        durationMinutes: 30,
        standardFee: 800,
        preparationInstructions: "Clean the area before appointment",
        serviceType: SERVICE_TYPE.ClinicServices,
        status: "Active",
        createdAt: "2023-01-01T00:00:00Z",
        updatedAt: "2023-01-01T00:00:00Z"
      },
      {
        id: 8,
        providerId: 107,
        name: "General Checkup",
        description: "Routine health checkup including vital signs",
        durationMinutes: 30,
        standardFee: 400,
        preparationInstructions: "Fast for 4 hours",
        serviceType: SERVICE_TYPE.ClinicServices,
        status: "Active",
        createdAt: "2023-01-01T00:00:00Z",
        updatedAt: "2023-01-01T00:00:00Z"
      },
      {
        id: 9,
        providerId: 107,
        name: "Wellness Checkup",
        description: "Comprehensive wellness examination",
        durationMinutes: 45,
        standardFee: 350,
        preparationInstructions: "Bring ID and insurance card",
        serviceType: SERVICE_TYPE.ClinicServices,
        status: "Active",
        createdAt: "2023-01-01T00:00:00Z",
        updatedAt: "2023-01-01T00:00:00Z"
      },
      
      // Diagnostic Center Services
      {
        id: 10,
        providerId: 104,
        name: "Complete Blood Count",
        description: "Full blood cell analysis",
        durationMinutes: 15,
        standardFee: 350,
        preparationInstructions: "No special preparation required",
        serviceType: SERVICE_TYPE.DIAGNOSTIC,
        status: "Active",
        createdAt: "2023-01-01T00:00:00Z",
        updatedAt: "2023-01-01T00:00:00Z"
      },
      {
        id: 11,
        providerId: 104,
        name: "Lipid Profile",
        description: "Complete cholesterol and triglyceride panel",
        durationMinutes: 15,
        standardFee: 400,
        preparationInstructions: "Fast for 10-12 hours before the test",
        serviceType: SERVICE_TYPE.DIAGNOSTIC,
        status: "Active",
        createdAt: "2023-01-01T00:00:00Z",
        updatedAt: "2023-01-01T00:00:00Z"
      },
      {
        id: 12,
        providerId: 104,
        name: "Thyroid Function Test",
        description: "TSH, T3, and T4 comprehensive testing",
        durationMinutes: 20,
        standardFee: 500,
        preparationInstructions: null,
        serviceType: SERVICE_TYPE.DIAGNOSTIC,
        status: "Active",
        createdAt: "2023-01-01T00:00:00Z",
        updatedAt: "2023-01-01T00:00:00Z"
      },
      {
        id: 13,
        providerId: 108,
        name: "Liver Function Test",
        description: "Comprehensive liver enzyme panel",
        durationMinutes: 15,
        standardFee: 450,
        preparationInstructions: "Fast for 8 hours before the test",
        serviceType: SERVICE_TYPE.DIAGNOSTIC,
        status: "Active",
        createdAt: "2023-01-01T00:00:00Z",
        updatedAt: "2023-01-01T00:00:00Z"
      },
      {
        id: 14,
        providerId: 108,
        name: "Kidney Function Test",
        description: "BUN, Creatinine, and other kidney markers",
        durationMinutes: 15,
        standardFee: 400,
        preparationInstructions: "No special preparation required",
        serviceType: SERVICE_TYPE.DIAGNOSTIC,
        status: "Active",
        createdAt: "2023-01-01T00:00:00Z",
        updatedAt: "2023-01-01T00:00:00Z"
      },
      {
        id: 15,
        providerId: 108,
        name: "Urinalysis",
        description: "Complete urine analysis",
        durationMinutes: 10,
        standardFee: 200,
        preparationInstructions: "First morning urine sample preferred",
        serviceType: SERVICE_TYPE.DIAGNOSTIC,
        status: "Active",
        createdAt: "2023-01-01T00:00:00Z",
        updatedAt: "2023-01-01T00:00:00Z"
      },
      {
        id: 16,
        providerId: 104,
        name: "Blood Sugar Test",
        description: "Fasting and random blood glucose testing",
        durationMinutes: 10,
        standardFee: 250,
        preparationInstructions: "Fast for 8 hours for fasting test",
        serviceType: SERVICE_TYPE.DIAGNOSTIC,
        status: "Active",
        createdAt: "2023-01-01T00:00:00Z",
        updatedAt: "2023-01-01T00:00:00Z"
      }
    ];
  }

  findByProvider(providerType?: string, providerId?: number): Service[] {
    let services = [...this.items];
    
    if (providerId) {
      services = services.filter(s => s.providerId === providerId);
    } else if (providerType) {
      const providerIds: Record<string, number[]> = {
        'doctor': [101, 102, 105, 106],
        'clinic': [103, 107],
        'diagnostic': [104, 108]
      };
      const ids = providerIds[providerType] || [];
      services = services.filter(s => ids.includes(s.providerId));
    }
    
    return services;
  }

  findByProviderType(providerType: string): Service[] {
    return this.findByProvider(providerType);
  }

  findByStatus(status: ServiceStatus): Service[] {
    return this.items.filter(service => service.status === status);
  }

  findByServiceType(serviceType: ServiceType): Service[] {
    return this.items.filter(service => service.serviceType === serviceType);
  }

  search(query: string): Service[] {
    const lowerQuery = query.toLowerCase();
    return this.items.filter(service => 
      service.name.toLowerCase().includes(lowerQuery) ||
      (service.description && service.description.toLowerCase().includes(lowerQuery))
    );
  }

  getStats(providerType?: string, providerId?: number): ServiceStats {
    let services = [...this.items];
    
    if (providerId) {
      services = services.filter(s => s.providerId === providerId);
    } else if (providerType) {
      const providerIds: Record<string, number[]> = {
        'doctor': [101, 102, 105, 106],
        'clinic': [103, 107],
        'diagnostic': [104, 108]
      };
      const ids = providerIds[providerType] || [];
      services = services.filter(s => ids.includes(s.providerId));
    }
    
    const total = services.length;
    const active = services.filter(s => s.status === "Active").length;
    const inactive = services.filter(s => s.status === "Inactive").length;
    const totalRevenue = services.reduce((sum, s) => sum + s.standardFee, 0);
    const averageFee = total > 0 ? Math.round(totalRevenue / total) : 0;
    
    const byType: Record<ServiceType, number> = {
      [SERVICE_TYPE.CONSULTATION]: 0,
      [SERVICE_TYPE.DIAGNOSTIC]: 0,
      [SERVICE_TYPE.ClinicServices]: 0,
    };
    
    services.forEach(s => {
      byType[s.serviceType]++;
    });

    const averageDuration = active > 0
      ? services
          .filter(s => s.status === 'Active')
          .reduce((sum, s) => sum + s.durationMinutes, 0) / active
      : 0;
    
    return {
      total,
      active,
      inactive,
      totalRevenue,
      averageFee,
      byType,
      averageDuration,
    };
  }

  createService(data: CreateServiceDTO): Service {
    return this.create(data);
  }

  updateService(id: number, data: UpdateServiceDTO): Service | undefined {
    return this.update(id, data);
  }

  deleteService(id: number): boolean {
    return this.delete(id);
  }

  toggleStatus(id: number): Service | undefined {
    const service = this.findById(id);
    if (!service) return undefined;
    
    const newStatus = service.status === "Active" ? "Inactive" : "Active";
    return this.updateService(id, { status: newStatus });
  }
}