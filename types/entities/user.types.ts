// types/entities/user.types.ts
export type UserRole = 'patient' | 'doctor' | 'clinic' | 'diagnostic';

export interface BaseUser {
  id: string;
  email: string;
  phone: string;
  role: UserRole;
  isActive: boolean;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
  lastLogin?: string;
  profileImage?: string;
}

export interface Address {
  street: string;
  city: string;
  subcity?: string;
  woreda?: string;
  country: string;
  zipCode?: string;
  latitude?: number;
  longitude?: number;
}

export interface Patient extends BaseUser {
  role: 'patient';
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: 'Male' | 'Female' | 'Other';
  bloodType?: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
  allergies: string[];
  chronicConditions: string[];
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  insuranceInfo?: {
    provider: string;
    policyNumber: string;
    validUntil: string;
  };
  address: Address;
}

export interface Doctor extends BaseUser {
  role: 'doctor';
  firstName: string;
  lastName: string;
  specialization: string;
  subSpecializations?: string[];
  licenseNumber: string;
  yearsOfExperience: number;
  education: {
    degree: string;
    institution: string;
    year: number;
  }[];
  certifications: {
    name: string;
    issuer: string;
    year: number;
  }[];
  languages: string[];
  consultationFee: number;
  rating: number;
  totalReviews: number;
  availability: Availability[];
  clinicId?: string;
  address: Address;
}

export interface Clinic extends BaseUser {
  role: 'clinic';
  name: string;
  licenseNumber: string;
  tinNumber: string;
  description: string;
  operatingHours: OperatingHours[];
  services: ClinicService[];
  staffCount: number;
  facilities: string[];
  emergencyContact?: string;
  rating: number;
  totalReviews: number;
  address: Address;
  logo?: string;
  coverImage?: string;
  joinedDate: string;
}

export interface Diagnostic extends BaseUser {
  role: 'diagnostic';
  name: string;
  licenseNumber: string;
  tinNumber: string;
  description: string;
  operatingHours: OperatingHours[];
  services: DiagnosticService[];
  accreditations: string[];
  equipment: string[];
  staffCount: number;
  turnaroundTime: string;
  rating: number;
  totalReviews: number;
  address: Address;
  logo?: string;
  coverImage?: string;
  joinedDate: string;
}

export interface Availability {
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  slotDuration: number;
}

export interface OperatingHours {
  day: string;
  isOpen: boolean;
  openTime?: string;
  closeTime?: string;
  breaks?: {
    start: string;
    end: string;
  }[];
}

export interface ClinicService {
  id: string;
  name: string;
  description: string;
  durationMinutes: number;
  fee: number;
  isActive: boolean;
  category: string;
  preparationInstructions?: string;
}

export interface DiagnosticService {
  id: string;
  name: string;
  description: string;
  durationMinutes: number;
  fee: number;
  isActive: boolean;
  category: string;
  preparationInstructions?: string;
  requiresFasting?: boolean;
  sampleType?: 'Blood' | 'Urine' | 'Stool' | 'Tissue' | 'Other';
}