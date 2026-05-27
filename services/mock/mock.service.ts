// services/mock/mock.service.ts
import { Service, ServiceStats, ServiceStatus, ServiceType, CreateServiceDTO, UpdateServiceDTO } from '@/types/entities/service.types';
import { Appointment, AppointmentStats, EnrichedAppointment, AppointmentWithDetails, AppointmentStatus, BookAppointmentRequest, BookAppointmentResponse } from '@/types/entities/appointment.types';
import { 
  PatientProfile, 
  UserProfile,
  DoctorProfile
} from '@/types/entities/profile.types';
import { Card, CardCheckInResult, CardGenerationRequest, CardStats, CardStatus, CardValidationResult } from '@/types/entities/card.types';

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

// Fixed CardRepository

export class CardRepository extends BaseRepository<Card> {
  private static instance: CardRepository;
  
  private constructor() {
    super();
    this.initializeMockData();
  }

  static getInstance(): CardRepository {
    if (!CardRepository.instance) {
      CardRepository.instance = new CardRepository();
    }
    return CardRepository.instance;
  }

  private initializeMockData(): void {
    this.items = [
      {
        id: 1,
        appointmentId: 2,
        cardNumber: '4512-7893-1023-6745',
        cardNumberHash: 'hashed_value_1',
        status: 'Active',
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        usedAt: null
      }
    ];
  }

  generateCard(request: CardGenerationRequest): Card {
    const cardNumber = this.generateCardNumber();
    const now = new Date();
    const expiresAt = new Date(now.getTime() + (request.validityHours || 24) * 60 * 60 * 1000);
    
    const newCard = this.create({
      appointmentId: request.appointmentId,
      cardNumber: cardNumber,
      cardNumberHash: this.hashCardNumber(cardNumber),
      status: 'Active',
      expiresAt: expiresAt.toISOString(),
      usedAt: null
    });
    
    return newCard;
  }

  private generateCardNumber(): string {
    const groups = [];
    for (let i = 0; i < 4; i++) {
      groups.push(Math.floor(Math.random() * 10000).toString().padStart(4, '0'));
    }
    return groups.join('-');
  }

  private hashCardNumber(cardNumber: string): string {
    // Simple hash for demo - use proper hashing in production
    return Buffer.from(cardNumber).toString('base64');
  }

  findByCardNumber(cardNumber: string): Card | undefined {
    return this.items.find(card => card.cardNumber === cardNumber);
  }

  findByAppointmentId(appointmentId: number): Card | undefined {
    return this.items.find(card => card.appointmentId === appointmentId);
  }

  useCard(cardId: number, usedAt: string = new Date().toISOString()): Card | undefined {
    return this.update(cardId, { status: 'Used' as CardStatus, usedAt });
  }

  getStats(): CardStats {
    const total = this.items.length;
    const active = this.items.filter(c => c.status === 'Active').length;
    const used = this.items.filter(c => c.status === 'Used').length;
    const expired = this.items.filter(c => c.status === 'Expired').length;
    const utilizationRate = total > 0 ? (used / total) * 100 : 0;
    
    // Calculate average time to use
    const usedCards = this.items.filter(c => c.status === 'Used' && c.usedAt);
    let averageTimeToUseMinutes = null;
    if (usedCards.length > 0) {
      const totalMinutes = usedCards.reduce((sum, card) => {
        const created = new Date(card.createdAt);
        const used = new Date(card.usedAt!);
        const minutes = (used.getTime() - created.getTime()) / (1000 * 60);
        return sum + minutes;
      }, 0);
      averageTimeToUseMinutes = totalMinutes / usedCards.length;
    }
    
    return {
      total,
      active,
      used,
      expired,
      utilizationRate,
      averageTimeToUseMinutes
    };
  }

  validateCard(cardNumber: string): CardValidationResult {
    // Validate format
    const cardNumberRegex = /^\d{4}-\d{4}-\d{4}-\d{4}$/;
    if (!cardNumberRegex.test(cardNumber)) {
      return {
        isValid: false,
        error: 'invalid_format',
        message: 'Invalid card number format. Please use format: XXXX-XXXX-XXXX-XXXX'
      };
    }

    const card = this.findByCardNumber(cardNumber);
    if (!card) {
      return {
        isValid: false,
        error: 'not_found',
        message: 'Card number not found in system'
      };
    }

    const now = new Date();
    const expiresAt = new Date(card.expiresAt);
    
    if (expiresAt < now) {
      return {
        isValid: false,
        card,
        error: 'expired',
        message: 'Card has expired. Please contact reception for assistance.'
      };
    }

    if (card.status === 'Used') {
      return {
        isValid: false,
        card,
        error: 'already_used',
        message: 'This card has already been used for check-in'
      };
    }

    return {
      isValid: true,
      card,
      message: 'Card is valid and ready for check-in'
    };
  }

  checkInWithCard(cardNumber: string, verifiedByStaffId: number, verifiedByType: 'doctor' | 'staff' | 'clinic' | 'diagnostic_center'): CardCheckInResult {
    const validation = this.validateCard(cardNumber);
    
    if (!validation.isValid || !validation.card) {
      return {
        success: false,
        message: validation.message || 'Invalid card'
      };
    }

    const card = validation.card;
    const usedCard = this.useCard(card.id);
    
    if (!usedCard) {
      return {
        success: false,
        message: 'Failed to update card status'
      };
    }

    // Get appointment details (would come from AppointmentRepository in real implementation)
    const appointmentDetails = {
      id: card.appointmentId,
      patientId: 201,
      patientName: 'John Smith',
      serviceName: 'Dental Cleaning',
      scheduledDateTime: '2026-01-27T10:00:00Z'
    };

    return {
      success: true,
      appointmentId: appointmentDetails.id,
      patientId: appointmentDetails.patientId,
      patientName: appointmentDetails.patientName,
      serviceName: appointmentDetails.serviceName,
      scheduledDateTime: appointmentDetails.scheduledDateTime,
      message: 'Successfully checked in. Please proceed to waiting area.'
    };
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

// services/mock/mock.service.ts - Fixed AppointmentRepository with Chapa Payment

export class AppointmentRepository extends BaseRepository<Appointment> {
  private static instance: AppointmentRepository;
  private patientRepo: PatientRepository;
  private serviceRepo: ServiceRepository;
  private providerRepo: ProviderRepository;
  private cardRepo: CardRepository;
  
  private constructor() {
    super();
    this.patientRepo = PatientRepository.getInstance();
    this.serviceRepo = ServiceRepository.getInstance();
    this.providerRepo = ProviderRepository.getInstance();
    this.cardRepo = CardRepository.getInstance();
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
        cardId: 1
      },
      {
        id: 3,
        patientId: 201,
        serviceId: 10,
        slotId: 7,
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
    
    let cardNumber = undefined;
    let cardStatus = undefined;
    if (appointment.cardId) {
      const card = this.cardRepo.findById(appointment.cardId);
      if (card) {
        cardNumber = card.cardNumber;
        cardStatus = card.status;
      }
    }
    
    return {
      ...appointment,
      patientName: patient ? `${patient.first_name} ${patient.last_name}` : 'Unknown Patient',
      patientEmail: patient?.email,
      patientPhone: patient?.phone_number,
      serviceName: service ? service.name : 'No Service',
      serviceType: service?.serviceType,
      slotTime: this.formatSlotTime(appointment.slotId),
      providerName,
      providerType,
      location,
      locationDetail,
      fee,
      providerImage,
      paymentStatus: appointment.paymentId ? 'Paid' : 'Pending',
      cardNumber,
      cardStatus
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

  /**
   * BOOKING FLOW WITH CHAPA PAYMENT
   * 
   * Flow:
   * 1. Patient selects doctor and time slot
   * 2. Request booking for selected slot
   * 3. Create appointment (status = Booked)
   * 4. Appointment ID generated
   * 5. Process payment via Chapa (amount)
   * 6. Chapa payment confirmation
   * 7. Update appointment status = Confirmed
   * 8. Generate and send card number (replaces QR code)
   * 9. Card number received
   * 10. Display booking confirmation
   */
  async bookAppointment(request: BookAppointmentRequest): Promise<BookAppointmentResponse> {
    // Step 1 & 2: Check if slot is available
    const existingAppointment = this.items.find(
      a => a.slotId === request.slotId && 
           a.scheduledDateTime === request.scheduledDateTime &&
           a.status !== 'Cancelled' && a.status !== 'Completed'
    );
    
    if (existingAppointment) {
      return {
        success: false,
        message: 'This time slot is already booked. Please select another time.'
      };
    }

    // Step 3 & 4: Create appointment with status = "Booked"
    const appointmentData: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'> = {
      patientId: request.patientId,
      serviceId: request.serviceId,
      slotId: request.slotId,
      scheduledDateTime: request.scheduledDateTime,
      status: 'Scheduled', // "Booked" status
      checkInTime: null,
      startTime: null,
      endTime: null,
      estimatedWaitMinutes: null,
      notes: request.notes || null,
      paymentId: null,
      cardId: null
    };
    
    const appointment = this.create(appointmentData);
    
    // Step 5 & 6: Process payment via Chapa
    const chapaResult = await this.processChapaPayment(request, appointment);
    
    if (!chapaResult.success) {
      return {
        success: false,
        appointment,
        message: chapaResult.message || 'Chapa payment failed. Please try again.'
      };
    }
    
    // Step 7: Update appointment status = Confirmed
    const updatedAppointment = this.update(appointment.id, { 
      status: 'Confirmed',
      paymentId: chapaResult.paymentId
    });
    
    // Step 8: Generate and send card number (replacing QR code)
    const card = this.cardRepo.generateCard({
      appointmentId: appointment.id,
      validityHours: 24
    });
    
    // Link card to appointment
    this.update(appointment.id, { cardId: card.id });
    
    // Step 9 & 10: Return card number for confirmation display
    return {
      success: true,
      appointment: updatedAppointment || appointment,
      card: card,
      paymentId: chapaResult.paymentId,
      message: `Appointment confirmed! Your card number: ${card.cardNumber}. Please save it for check-in.`
    };
  }

  /**
   * Process payment through Chapa API
   * In production, this would call the actual Chapa API endpoint
   */
  private async processChapaPayment(
    request: BookAppointmentRequest, 
    appointment: Appointment
  ): Promise<{ success: boolean; paymentId?: number; transactionId?: string; message?: string }> {
    const service = this.serviceRepo.findById(request.serviceId);
    const amount = service?.standardFee || 0;
    const email = this.patientRepo.findById(request.patientId)?.email || 'customer@example.com';
    const phone = this.patientRepo.findById(request.patientId)?.phone_number || '0912345678';
    
    // Simulate Chapa API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    if (request.paymentConfirmed) {
      // Generate Chapa transaction ID (mock)
      const txRef = `CHAPA-${Date.now()}-${Math.random().toString(36).substring(2, 10)}`;
      
      return {
        success: true,
        paymentId: Date.now(),
        transactionId: txRef,
        message: `Chapa payment of ETB ${amount} successful. Transaction: ${txRef}`
      };
    }
    
    return {
      success: false,
      message: 'Chapa payment not completed. Please complete the payment to confirm your appointment.'
    };
  }

  /**
   * Create Chapa payment link/checkout URL
   * Returns a URL that redirects the patient to Chapa payment page
   */
  async createChapaCheckout(request: BookAppointmentRequest): Promise<{ checkoutUrl: string; txRef: string }> {
    const service = this.serviceRepo.findById(request.serviceId);
    const amount = service?.standardFee || 0;
    const patient = this.patientRepo.findById(request.patientId);
    
    // Generate unique transaction reference
    const txRef = `CHAPA-${Date.now()}-${Math.random().toString(36).substring(2, 10)}`;
    
    // In production, this would call Chapa API: POST https://api.chapa.co/v1/transaction/initialize
    const checkoutUrl = `https://checkout.chapa.co/checkout?tx_ref=${txRef}&amount=${amount}&email=${patient?.email}&currency=ETB`;
    
    return {
      checkoutUrl,
      txRef
    };
  }

  /**
   * Verify Chapa payment (webhook callback)
   * Called by Chapa webhook after payment is completed
   */
  async verifyChapaPayment(txRef: string): Promise<{ verified: boolean; amount: number; status: string }> {
    // In production, this would call Chapa API: GET https://api.chapa.co/v1/transaction/verify/{tx_ref}
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      verified: true,
      amount: 500,
      status: 'success'
    };
  }

  /**
   * Book appointment with pending payment (pay later at clinic)
   * No Chapa payment required upfront
   */
  async bookAppointmentWithPendingPayment(request: BookAppointmentRequest): Promise<BookAppointmentResponse> {
    const existingAppointment = this.items.find(
      a => a.slotId === request.slotId && 
           a.scheduledDateTime === request.scheduledDateTime &&
           a.status !== 'Cancelled' && a.status !== 'Completed'
    );
    
    if (existingAppointment) {
      return {
        success: false,
        message: 'This time slot is already booked.'
      };
    }

    const appointmentData: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'> = {
      patientId: request.patientId,
      serviceId: request.serviceId,
      slotId: request.slotId,
      scheduledDateTime: request.scheduledDateTime,
      status: 'Scheduled',
      checkInTime: null,
      startTime: null,
      endTime: null,
      estimatedWaitMinutes: null,
      notes: request.notes || null,
      paymentId: null,
      cardId: null
    };
    
    const appointment = this.create(appointmentData);
    
    return {
      success: true,
      appointment,
      message: 'Appointment booked. Please complete payment at the clinic to confirm.'
    };
  }

  /**
   * Confirm appointment after successful Chapa payment webhook
   */
  async confirmAfterChapaPayment(appointmentId: number, paymentId: number, txRef: string): Promise<BookAppointmentResponse> {
    const appointment = this.findById(appointmentId);
    if (!appointment) {
      return {
        success: false,
        message: 'Appointment not found.'
      };
    }
    
    const updatedAppointment = this.update(appointmentId, { 
      status: 'Confirmed',
      paymentId: paymentId
    });
    
    const card = this.cardRepo.generateCard({
      appointmentId: appointmentId,
      validityHours: 24
    });
    
    this.update(appointmentId, { cardId: card.id });
    
    return {
      success: true,
      appointment: updatedAppointment,
      card: card,
      paymentId: paymentId,
      message: `Chapa payment confirmed (Transaction: ${txRef}). Your card number is: ${card.cardNumber}`
    };
  }
}
// Fix the MockServiceRegistry to properly initialize appointment repository with card repo
export class MockServiceRegistry {
  private static instance: MockServiceRegistry;
  private appointments: AppointmentRepository;
  private patients: PatientRepository;
  private services: ServiceRepository;
  private providers: ProviderRepository;
  private cards: CardRepository;

  private constructor() {
    // Initialize card repository first
    this.cards = CardRepository.getInstance();
    // Initialize appointment repository (which now uses card repo)
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

  getCards() {
    return this.cards;
  }
}

// Update exports
export const getCardRepository = () => CardRepository.getInstance();
export const getMockServiceRegistry = () => MockServiceRegistry.getInstance();
export const getServiceRepository = () => ServiceRepository.getInstance();
export const getPatientRepository = () => PatientRepository.getInstance();
export const getProviderRepository = () => ProviderRepository.getInstance();
export const getAppointmentRepository = () => AppointmentRepository.getInstance();