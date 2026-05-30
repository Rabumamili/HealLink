import { BaseRepository } from './base.repository';
import { PatientProfile } from '@/types/entities/profile.types';

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
        total_appointments: 12,
        last_visit: "2024-05-10",
        health_score: 85,
        created_at: "2023-01-15T00:00:00Z",
        updated_at: "2024-05-10T00:00:00Z",
        status: 'PENDING'
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
        total_appointments: 5,
        last_visit: "2024-05-12",
        health_score: 92,
        created_at: "2023-03-10T00:00:00Z",
        updated_at: "2024-05-12T00:00:00Z",
        status: 'PENDING'
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