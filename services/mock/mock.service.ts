// services/mock/mock.service.ts
import { Service, ServiceStats, ServiceStatus, ServiceType, CreateServiceDTO, UpdateServiceDTO } from '@/types/entities/service.types';
import { Appointment, AppointmentStats, EnrichedAppointment, AppointmentWithDetails, AppointmentStatus, AppointmentType } from '@/types/entities/appointment.types';
import { 
  PatientProfile, 
  UserProfile,
  DoctorProfile
} from '@/types/entities/profile.types';

// Base Repository with generic CRUD operations
export abstract class BaseRepository<T extends { id: number }> {
  protected items: T[] = [];

  findById(id: number): T | undefined {
    return this.items.find(item => item.id === id);
  }

  findAll(): T[] {
    return [...this.items];
  }

  create(data: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): T {
    const newItem = {
      ...data,
      id: this.generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    } as unknown as T;
    this.items.push(newItem);
    return newItem;
  }

  update(id: number, data: Partial<T>): T | undefined {
    const index = this.items.findIndex(item => item.id === id);
    if (index === -1) return undefined;
    
    this.items[index] = {
      ...this.items[index],
      ...data,
      updatedAt: new Date().toISOString()
    } as T;
    return this.items[index];
  }

  delete(id: number): boolean {
    const index = this.items.findIndex(item => item.id === id);
    if (index === -1) return false;
    this.items.splice(index, 1);
    return true;
  }

  private generateId(): number {
    return Date.now();
  }
}

// Service Repository
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
        serviceType: "Consultation",
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
        serviceType: "Consultation",
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
        serviceType: "Consultation",
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
        serviceType: "Consultation",
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
        serviceType: "Consultation",
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
        serviceType: "Vaccination",
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
        serviceType: "Procedure",
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
        serviceType: "Procedure",
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
        serviceType: "Procedure",
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
        serviceType: "Diagnostic",
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
        serviceType: "Diagnostic",
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
        serviceType: "Diagnostic",
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
        serviceType: "Diagnostic",
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
        serviceType: "Diagnostic",
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
        serviceType: "Diagnostic",
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
        serviceType: "Diagnostic",
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
      // Map provider type to provider IDs
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
      Consultation: 0,
      Diagnostic: 0,
      Vaccination: 0,
      Procedure: 0
    };
    
    services.forEach(s => {
      byType[s.serviceType]++;
    });
    
    return {
      total,
      active,
      inactive,
      totalRevenue,
      averageFee,
      byType
    };
  }

  createService(data: CreateServiceDTO): Service {
    // Use the inherited create method from BaseRepository
    return this.create(data);
  }

  updateService(id: number, data: UpdateServiceDTO): Service | undefined {
    // Use the inherited update method from BaseRepository
    return this.update(id, data);
  }

  deleteService(id: number): boolean {
    // Use the inherited delete method from BaseRepository
    return this.delete(id);
  }

  toggleStatus(id: number): Service | undefined {
    const service = this.findById(id);
    if (!service) return undefined;
    
    const newStatus = service.status === "Active" ? "Inactive" : "Active";
    return this.updateService(id, { status: newStatus });
  }
}

// Patient Repository
export class PatientRepository extends BaseRepository<PatientProfile> {
  private static instance: PatientRepository;
  
  private constructor() {
    super();
    this.initializeMockData();
  }

  static getInstance(): PatientRepository {
    if (!PatientRepository.instance) {
      PatientRepository.instance = new PatientRepository();
    }
    return PatientRepository.instance;
  }

  private initializeMockData(): void {
    this.items = [
      {
        id: 201,
        user_id: 1001,
        email: "abebe.kebede@example.com",
        phone_number: "+251-911-234-567",
        role: 'patient',
        first_name: "Abebe",
        last_name: "Kebede",
        date_of_birth: "1985-06-15",
        gender: "Male",
        blood_type: "O+",
        address: "Bole Road, Addis Ababa",
        allergies: ["Penicillin"],
        chronic_conditions: ["Hypertension"],
        current_medications: ["Lisinopril"],
        total_appointments: 12,
        last_visit: "2024-05-10",
        health_score: 85,
        created_at: "2023-01-15T00:00:00Z",
        updated_at: "2024-05-10T00:00:00Z",
      },
      {
        id: 202,
        user_id: 1002,
        email: "tigist.haile@example.com",
        phone_number: "+251-911-456-789",
        role: 'patient',
        first_name: "Tigist",
        last_name: "Haile",
        date_of_birth: "1990-09-22",
        gender: "Female",
        blood_type: "A+",
        address: "CMC Road, Addis Ababa",
        allergies: [],
        chronic_conditions: [],
        current_medications: [],
        total_appointments: 5,
        last_visit: "2024-05-12",
        health_score: 92,
        created_at: "2023-03-10T00:00:00Z",
        updated_at: "2024-05-12T00:00:00Z"
      }
    ];
  }

  search(query: string): PatientProfile[] {
    const lowerQuery = query.toLowerCase();
    return this.items.filter(patient => 
      patient.first_name.toLowerCase().includes(lowerQuery) ||
      patient.last_name.toLowerCase().includes(lowerQuery) ||
      patient.email.toLowerCase().includes(lowerQuery) ||
      patient.phone_number.includes(query)
    );
  }

  getPatientDisplayName(patient: PatientProfile): string {
    return `${patient.first_name} ${patient.last_name}`;
  }
}

// Provider Repository - Hospital names not exposed
export interface Provider {
  id: number;
  name: string;
  type: 'doctor' | 'clinic' | 'diagnostic';
  specialty: string;
  rating: number;
  reviews: number;
  image?: string;
  location: string;
  locationDetail?: string;
  contactPhone: string;
  contactEmail: string;
  bio: string;
  experience?: string;
  education?: string;
  services: { name: string; fee: number }[];
}

export class ProviderRepository extends BaseRepository<Provider> {
  private static instance: ProviderRepository;
  
  private constructor() {
    super();
    this.initializeMockData();
  }

  static getInstance(): ProviderRepository {
    if (!ProviderRepository.instance) {
      ProviderRepository.instance = new ProviderRepository();
    }
    return ProviderRepository.instance;
  }

  private initializeMockData(): void {
    this.items = [
      // Doctors (No hospital names mentioned)
      {
        id: 101,
        name: "Dr. Abraham Yosef",
        type: "doctor",
        specialty: "General Practitioner",
        rating: 4.9,
        reviews: 128,
        image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=200&h=200&fit=crop",
        location: "Bole Road, Addis Ababa",
        locationDetail: "2nd Floor, Bole Medical Plaza",
        contactPhone: "+251-911-234-567",
        contactEmail: "dr.abraham@medicalpractice.com",
        bio: "Dr. Abraham Yosef is a general practitioner with over 15 years of experience. He specializes in family medicine and general consultations.",
        experience: "15+ years",
        education: "MD from Addis Ababa University",
        services: [
          { name: "General Consultation", fee: 500 },
          { name: "Health Checkup", fee: 600 }
        ]
      },
      {
        id: 102,
        name: "Dr. Selam Tesfaye",
        type: "doctor",
        specialty: "Pediatrician",
        rating: 4.8,
        reviews: 94,
        image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=200&h=200&fit=crop",
        location: "Kazanchis, Addis Ababa",
        locationDetail: "Children's Medical Center, Suite 305",
        contactPhone: "+251-911-345-678",
        contactEmail: "dr.selam@pediatriccare.com",
        bio: "Dr. Selam Tesfaye is a dedicated pediatrician passionate about child healthcare from newborns to adolescents.",
        experience: "10+ years",
        education: "MD from Gondar University",
        services: [
          { name: "Pediatric Consultation", fee: 650 },
          { name: "Child Development Check", fee: 500 }
        ]
      },
      {
        id: 105,
        name: "Dr. Tewodros Mulugeta",
        type: "doctor",
        specialty: "Cardiologist",
        rating: 4.9,
        reviews: 156,
        image: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=200&h=200&fit=crop",
        location: "CMC Road, Addis Ababa",
        locationDetail: "Heart Care Clinic, 1st Floor",
        contactPhone: "+251-911-456-789",
        contactEmail: "dr.tewodros@heartcare.com",
        bio: "Dr. Tewodros Mulugeta is a cardiologist focusing on heart health and cardiovascular diseases.",
        experience: "12+ years",
        education: "MD from Jimma University",
        services: [
          { name: "Cardiology Consultation", fee: 850 },
          { name: "Heart Health Assessment", fee: 700 }
        ]
      },
      {
        id: 106,
        name: "Dr. Hanna Gebremariam",
        type: "doctor",
        specialty: "Dermatologist",
        rating: 4.9,
        reviews: 87,
        image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200&h=200&fit=crop",
        location: "Kazanchis, Addis Ababa",
        locationDetail: "2nd Floor, Room 205",
        contactPhone: "+251-911-567-890",
        contactEmail: "dr.hanna@dermatologycenter.com",
        bio: "Dr. Hanna Gebremariam is a dermatologist specializing in skin health and cosmetic dermatology.",
        experience: "8+ years",
        education: "MD from Addis Ababa University",
        services: [
          { name: "Dermatology Consultation", fee: 550 },
          { name: "Skin Treatment", fee: 700 }
        ]
      },
      
      // Clinics (Only provide non-consultation services)
      {
        id: 103,
        name: "Bethel Medical Center",
        type: "clinic",
        specialty: "Primary Care Clinic",
        rating: 4.7,
        reviews: 203,
        image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=200&h=200&fit=crop",
        location: "Bole Road, Addis Ababa",
        locationDetail: "Near Bole Medhanialem Church",
        contactPhone: "+251-911-678-901",
        contactEmail: "info@bethelclinic.com",
        bio: "Bethel Medical Center provides primary care services including vaccinations and minor procedures.",
        services: [
          { name: "Influenza Vaccination", fee: 600 },
          { name: "Minor Procedure", fee: 800 }
        ]
      },
      {
        id: 107,
        name: "Roha Medical Center",
        type: "clinic",
        specialty: "Wellness Clinic",
        rating: 4.8,
        reviews: 178,
        image: "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=200&h=200&fit=crop",
        location: "Piassa, Addis Ababa",
        locationDetail: "Main Building, 2nd Floor",
        contactPhone: "+251-911-789-012",
        contactEmail: "info@rohamedcenter.com",
        bio: "Roha Medical Center offers wellness services and routine health checkups.",
        services: [
          { name: "General Checkup", fee: 400 },
          { name: "Wellness Checkup", fee: 350 }
        ]
      },
      
      // Diagnostic Centers
      {
        id: 104,
        name: "Addis Diagnostic Center",
        type: "diagnostic",
        specialty: "Laboratory & Imaging",
        rating: 4.9,
        reviews: 892,
        image: "https://images.unsplash.com/photo-1579154204601-0158f351e67f?w=200&h=200&fit=crop",
        location: "Bole, Addis Ababa",
        locationDetail: "Behind Bole Medhanialem Church",
        contactPhone: "+251-911-890-123",
        contactEmail: "info@addisdiagnostic.com",
        bio: "State-of-the-art diagnostic center providing accurate laboratory testing services.",
        services: [
          { name: "Complete Blood Count", fee: 350 },
          { name: "Lipid Profile", fee: 400 },
          { name: "Thyroid Function Test", fee: 500 },
          { name: "Blood Sugar Test", fee: 250 }
        ]
      },
      {
        id: 108,
        name: "Selam Diagnostic Lab",
        type: "diagnostic",
        specialty: "Clinical Laboratory",
        rating: 4.8,
        reviews: 567,
        image: "https://images.unsplash.com/photo-1581595219319-a1f4f5acf069?w=200&h=200&fit=crop",
        location: "Kazanchis, Addis Ababa",
        locationDetail: "Near Kazanchis Roundabout",
        contactPhone: "+251-911-901-234",
        contactEmail: "info@selamlab.com",
        bio: "Selam Diagnostic Lab offers comprehensive laboratory testing services with quick turnaround.",
        services: [
          { name: "Liver Function Test", fee: 450 },
          { name: "Kidney Function Test", fee: 400 },
          { name: "Urinalysis", fee: 200 }
        ]
      }
    ];
  }

  findByType(type: Provider['type']): Provider[] {
    return this.items.filter(provider => provider.type === type);
  }

  findDoctors(): Provider[] {
    return this.items.filter(provider => provider.type === 'doctor');
  }

  findClinics(): Provider[] {
    return this.items.filter(provider => provider.type === 'clinic');
  }

  findDiagnosticCenters(): Provider[] {
    return this.items.filter(provider => provider.type === 'diagnostic');
  }
}

// Appointment Repository - Fixed
export class AppointmentRepository extends BaseRepository<Appointment> {
  private static instance: AppointmentRepository;
  private patientRepo: PatientRepository;
  private serviceRepo: ServiceRepository;
  private providerRepo: ProviderRepository;
  
  private constructor() {
    super();
    this.patientRepo = PatientRepository.getInstance();
    this.serviceRepo = ServiceRepository.getInstance();
    this.providerRepo = ProviderRepository.getInstance();
    this.initializeMockData();
  }

  static getInstance(): AppointmentRepository {
    if (!AppointmentRepository.instance) {
      AppointmentRepository.instance = new AppointmentRepository();
    }
    return AppointmentRepository.instance;
  }

  private initializeMockData(): void {
    this.items = [
      {
        id: 1,
        patientId: 201,
        serviceId: 1,
        slotId: 5,
        type: 'Consultation',
        scheduledDateTime: '2026-05-10 09:00:00',
        status: 'Confirmed',
        checkInTime: '2026-05-10 08:55:00',
        startTime: '2026-05-10 09:00:00',
        endTime: '2026-05-10 09:30:00',
        estimatedWaitMinutes: 10,
        notes: 'First-time patient',
        createdAt: '2026-05-01 10:00:00',
        updatedAt: '2026-05-10 08:55:00',
        paymentId: 5001,
        cardId: null
      },
      {
        id: 2,
        patientId: 202,
        serviceId: 2,
        slotId: 6,
        type: 'Consultation',
        scheduledDateTime: '2026-05-10 10:30:00',
        status: 'Checked-in',
        checkInTime: '2026-05-10 10:15:00',
        startTime: null,
        endTime: null,
        estimatedWaitMinutes: 15,
        notes: null,
        createdAt: '2026-05-02 14:30:00',
        updatedAt: '2026-05-10 10:15:00',
        paymentId: null,
        cardId: 1  // Example card ID
      },
      {
        id: 3,
        patientId: 201,
        serviceId: 10,
        slotId: 7,
        type: 'Diagnostic',
        scheduledDateTime: '2026-05-11 14:00:00',
        status: 'Scheduled',
        checkInTime: null,
        startTime: null,
        endTime: null,
        estimatedWaitMinutes: null,
        notes: 'Requires fasting',
        createdAt: '2026-05-03 09:15:00',
        updatedAt: '2026-05-03 09:15:00',
        paymentId: null,
        cardId: null
      },
      {
        id: 4,
        patientId: 202,
        serviceId: 6,
        slotId: 8,
        type: 'Vaccination',
        scheduledDateTime: '2026-05-12 11:00:00',
        status: 'Scheduled',
        checkInTime: null,
        startTime: null,
        endTime: null,
        estimatedWaitMinutes: null,
        notes: null,
        createdAt: '2026-05-04 10:00:00',
        updatedAt: '2026-05-04 10:00:00',
        paymentId: null,
        cardId: null
      }
    ];
  }

  private enrichAppointment(appointment: Appointment): EnrichedAppointment {
    const patient = this.patientRepo.findById(appointment.patientId);
    const service = appointment.serviceId ? this.serviceRepo.findById(appointment.serviceId) : null;
    
    let providerName = '';
    let providerType: 'doctor' | 'clinic' | 'diagnostic_center' = 'doctor';
    let location = '';
    let locationDetail = '';
    let fee = service?.standardFee || 0;
    let providerImage = '';
    
    if (service) {
      const provider = this.providerRepo.findById(service.providerId);
      if (provider) {
        providerName = provider.name;
        providerType = provider.type === 'diagnostic' ? 'diagnostic_center' : provider.type;
        location = provider.location;
        locationDetail = provider.locationDetail || '';
        providerImage = provider.image || '';
      }
      fee = service.standardFee;
    }
    
    return {
      ...appointment,
      patientName: patient ? `${patient.first_name} ${patient.last_name}` : 'Unknown Patient',
      patientEmail: patient?.email,
      patientPhone: patient?.phone_number,
      serviceName: service ? service.name : 'No Service',
      slotTime: this.formatSlotTime(appointment.slotId),
      providerName,
      providerType,
      location,
      locationDetail,
      fee,
      providerImage,
      paymentStatus: appointment.paymentId ? 'Paid' : 'Pending'
    };
  }

  private formatSlotTime(slotId: number): string {
    const slotMap: Record<number, string> = {
      1: '09:00 AM - 09:30 AM',
      2: '09:30 AM - 10:00 AM',
      3: '10:00 AM - 10:30 AM',
      4: '10:30 AM - 11:00 AM',
      5: '11:00 AM - 11:30 AM',
      6: '11:30 AM - 12:00 PM',
      7: '02:00 PM - 02:30 PM',
      8: '02:30 PM - 03:00 PM'
    };
    return slotMap[slotId] || 'Time not specified';
  }

  findById(id: number): EnrichedAppointment | undefined {
    const appointment = super.findById(id);
    if (!appointment) return undefined;
    return this.enrichAppointment(appointment);
  }

  findAll(): EnrichedAppointment[] {
    return this.items.map(appointment => this.enrichAppointment(appointment));
  }

  findByPatientId(patientId: number): EnrichedAppointment[] {
    const appointments = this.items.filter(appointment => appointment.patientId === patientId);
    return appointments.map(appointment => this.enrichAppointment(appointment));
  }

  findByProviderId(providerId: number): EnrichedAppointment[] {
    const appointments = this.items.filter(appointment => {
      const service = this.serviceRepo.findById(appointment.serviceId);
      return service?.providerId === providerId;
    });
    return appointments.map(appointment => this.enrichAppointment(appointment));
  }

  findByDate(date: string): EnrichedAppointment[] {
    const appointments = this.items.filter(appointment => 
      appointment.scheduledDateTime.startsWith(date)
    );
    return appointments.map(appointment => this.enrichAppointment(appointment));
  }

  findByDateRange(startDate: string, endDate: string): EnrichedAppointment[] {
    const appointments = this.items.filter(appointment => {
      const appointmentDate = appointment.scheduledDateTime.split(' ')[0];
      return appointmentDate >= startDate && appointmentDate <= endDate;
    });
    return appointments.map(appointment => this.enrichAppointment(appointment));
  }

  getStats(): AppointmentStats {
    const today = new Date().toISOString().split('T')[0];
    const todayAppointments = this.items.filter(a => a.scheduledDateTime.startsWith(today));
    
    const completedAppointments = this.items.filter(a => a.status === 'Completed');
    const checkedInAppointments = this.items.filter(a => a.status === 'Checked-in');
    
    const totalWaitTime = checkedInAppointments.reduce((sum, a) => sum + (a.estimatedWaitMinutes || 0), 0);
    const averageWaitTime = checkedInAppointments.length > 0 ? totalWaitTime / checkedInAppointments.length : 0;

    const revenue = this.items.reduce((sum, appointment) => {
      if (appointment.status === 'Completed') {
        const service = this.serviceRepo.findById(appointment.serviceId);
        return sum + (service?.standardFee || 0);
      }
      return sum;
    }, 0);

    const cardsIssued = this.items.filter(a => a.cardId !== null).length;
    const cardsUtilized = this.items.filter(a => a.status === 'Checked-in').length;

    return {
      total: this.items.length,
      today: todayAppointments.length,
      confirmed: this.items.filter(a => a.status === "Confirmed").length,
      checkedIn: checkedInAppointments.length,
      inProgress: this.items.filter(a => a.status === "In Progress").length,
      completed: completedAppointments.length,
      cancelled: this.items.filter(a => a.status === "Cancelled").length,
      noShow: this.items.filter(a => a.status === "No-show").length,
      averageWaitTime: Math.round(averageWaitTime),
      revenue: revenue,
      upcoming: this.items.filter(a => 
        a.status === "Scheduled" || a.status === "Confirmed" || a.status === "Checked-in"
      ).length,
      cardsIssued: cardsIssued,
      cardsUtilized: cardsUtilized
    };
  }

  updateStatus(id: number, status: AppointmentStatus): EnrichedAppointment | undefined {
    const updated = this.update(id, { status });
    if (!updated) return undefined;
    return this.enrichAppointment(updated);
  }

  updateCheckIn(id: number, checkInTime: string, estimatedWaitMinutes: number): EnrichedAppointment | undefined {
    const updated = this.update(id, { 
      checkInTime, 
      estimatedWaitMinutes,
      status: 'Checked-in'
    });
    if (!updated) return undefined;
    return this.enrichAppointment(updated);
  }

  updateTiming(id: number, startTime: string, endTime: string): EnrichedAppointment | undefined {
    const updated = this.update(id, { startTime, endTime });
    if (!updated) return undefined;
    return this.enrichAppointment(updated);
  }

  createAppointment(data: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'>): Appointment {
    return this.create(data);
  }
}

// Service Registry
export class MockServiceRegistry {
  private static instance: MockServiceRegistry;
  private appointments: AppointmentRepository;
  private patients: PatientRepository;
  private services: ServiceRepository;
  private providers: ProviderRepository;

  private constructor() {
    this.appointments = AppointmentRepository.getInstance();
    this.patients = PatientRepository.getInstance();
    this.services = ServiceRepository.getInstance();
    this.providers = ProviderRepository.getInstance();
  }

  static getInstance(): MockServiceRegistry {
    if (!MockServiceRegistry.instance) {
      MockServiceRegistry.instance = new MockServiceRegistry();
    }
    return MockServiceRegistry.instance;
  }

  getAppointments() {
    return this.appointments;
  }

  getPatients() {
    return this.patients;
  }

  getServices() {
    return this.services;
  }

  getProviders() {
    return this.providers;
  }
}

// Export convenience functions
export const getMockServiceRegistry = () => MockServiceRegistry.getInstance();
export const getServiceRepository = () => ServiceRepository.getInstance();
export const getPatientRepository = () => PatientRepository.getInstance();
export const getProviderRepository = () => ProviderRepository.getInstance();
export const getAppointmentRepository = () => AppointmentRepository.getInstance();