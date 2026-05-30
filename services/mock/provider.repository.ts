import { BaseRepository } from './base.repository';

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
      // Doctors
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
        bio: "Dr. Abraham Yosef is a general practitioner with over 15 years of experience.",
        experience: "15+ years",
        education: "MD from Addis Ababa University",
        services: [
          { name: "General Consultation", fee: 500 }
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
        bio: "Dr. Selam Tesfaye is a dedicated pediatrician.",
        experience: "10+ years",
        education: "MD from Gondar University",
        services: [
          { name: "Pediatric Consultation", fee: 650 }
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
        bio: "Dr. Tewodros Mulugeta is a cardiologist.",
        experience: "12+ years",
        education: "MD from Jimma University",
        services: [
          { name: "Cardiology Consultation", fee: 850 }
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
        bio: "Dr. Hanna Gebremariam is a dermatologist.",
        experience: "8+ years",
        education: "MD from Addis Ababa University",
        services: [
          { name: "Dermatology Consultation", fee: 550 }
        ]
      },
      
      // Clinics
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
        bio: "Bethel Medical Center provides primary care services.",
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
        bio: "Roha Medical Center offers wellness services.",
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
        bio: "State-of-the-art diagnostic center.",
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
        bio: "Selam Diagnostic Lab offers comprehensive testing.",
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