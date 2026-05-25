// types/entities/profile.types.ts

import { ProviderType, VerificationStatus, ProfessionalVerificationStatus, StaffSubRole } from './auth.types';

// ===============================
// BASE PROFILE TYPES
// ===============================

export interface BaseProfile {
  id: number;
  user_id: number;
  email: string;
  phone_number: string;
  profile_photo?: string;
  created_at: string;
  updated_at?: string;
}

// ===============================
// PATIENT PROFILE (has first_name, last_name)
// ===============================

export interface PatientProfile extends BaseProfile {
  role: 'patient';
  first_name: string;
  last_name: string;
  date_of_birth?: string;
  gender?: 'Male' | 'Female' | 'Other';
  blood_type?: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
  address?: string;
  
  // Medical history
  allergies: string[];
  chronic_conditions: string[];
  current_medications: string[];
  

  
  // Statistics
  total_appointments?: number;
  last_visit?: string;
  health_score?: number;
}

export interface PatientProfileUpdate {
  first_name?: string;
  last_name?: string;
  phone_number?: string;
  date_of_birth?: string;
  gender?: string;
  blood_type?: string;
  address?: string;
  allergies?: string[];
  chronic_conditions?: string[];
  current_medications?: string[];

}

// ===============================
// DOCTOR PROFILE (has first_name, last_name)
// ===============================

export interface DoctorProfile extends BaseProfile {
  role: 'doctor';
  provider_type: 'doctor';
  first_name: string;
  last_name: string;
  specialization: string;
  license_number: string;
  years_of_experience: number;
  consultation_fee: number | string;
  qualifications: string;
  bio?: string;
  education?: string;
  location: string;
  description?: string;
  
  // Working hours
  available_days?: string[];
  available_hours?: string;
  
  // Images
  logo_url?: string;
  cover_image_url?: string;
  
  // Documents
  license_document_url?: string;
  degree_document_url?: string;
  
  // Status
  verification_status: VerificationStatus;
  professional_verification_status: ProfessionalVerificationStatus;
  is_active: boolean;
  joined_date: string;
  
  // Statistics
  rating?: number;
  total_reviews?: number;
  total_appointments?: number;
  total_patients?: number;
  average_rating?: number;
}

export interface DoctorProfileUpdate {
  first_name?: string;
  last_name?: string;
  phone?: string;
  location?: string;
  description?: string;
  specialization?: string;
  license_number?: string;
  years_of_experience?: number;
  consultation_fee?: number | string;
  qualifications?: string;
  bio?: string;
  education?: string;
  hospital_affiliation?: string;
  available_days?: string[];
  available_hours?: string;
  logo_url?: string;
  cover_image_url?: string;
}

// ===============================
// CLINIC PROFILE (has name, no first_name/last_name)
// ===============================

export interface ClinicProfile extends BaseProfile {
  role: 'clinic';
  provider_type: 'clinic';
  name: string;  // Consistent: just 'name' for organizations
  address: string;
  phone: string;
  license_number: string;
  tin_number: string;
  operating_hours: string;
  description: string;
  established_year?: string;
  emergency_contact?: string;
  website?: string;
  location: string;
  
  // Images
  logo_url?: string;
  cover_image_url?: string;
  
  // Documents
  registration_document_url?: string;
  
  // Status
  verification_status: VerificationStatus;
  professional_verification_status: ProfessionalVerificationStatus;
  is_active: boolean;
  joined_date: string;
  
  // Statistics
  rating?: number;
  total_reviews?: number;
  total_doctors: number;
  total_staff: number;
  total_patients_served: number;
}

export interface ClinicProfileUpdate {
  name?: string;
  address?: string;
  phone?: string;
  license_number?: string;
  tin_number?: string;
  operating_hours?: string;
  description?: string;
  established_year?: string;
  emergency_contact?: string;
  website?: string;
  location?: string;
  logo_url?: string;
  cover_image_url?: string;
}

// ===============================
// DIAGNOSTIC CENTER PROFILE (has name, no first_name/last_name)
// ===============================

export interface DiagnosticCenterProfile extends BaseProfile {
  role: 'diagnostic_center';
  provider_type: 'diagnostic_center';
  name: string;  // Consistent: just 'name' for organizations
  address: string;
  phone: string;
  email: string;
  license_number: string;
  tin_number: string;
  accreditation: string;
  services_description: string;
  operating_hours: string;
  established_year?: string;
  emergency_contact?: string;
  website?: string;
  location: string;
  
  // Services offered
  services_offered: string[];
  
  // Images
  logo_url?: string;
  cover_image_url?: string;
  
  // Documents
  registration_document_url?: string;
  accreditation_document_url?: string;
  
  // Status
  verification_status: VerificationStatus;
  professional_verification_status: ProfessionalVerificationStatus;
  is_active: boolean;
  joined_date: string;
  
  // Statistics
  rating?: number;
  total_reviews?: number;
  total_tests_performed: number;
  total_doctors: number;
  total_staff: number;
  total_patients_served: number;
}

export interface DiagnosticCenterProfileUpdate {
  name?: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  license_number?: string;
  tin_number?: string;
  accreditation?: string;
  services_description?: string;
  operating_hours?: string;
  established_year?: string;
  emergency_contact?: string;
  services_offered?: string[];
  location?: string;
  logo_url?: string;
  cover_image_url?: string;
}

// ===============================
// STAFF PROFILE
// ===============================

export interface StaffProfile {
  id: number;
  user_id: number;
  employer_id: number;
  employer_type: ProviderType;
  employer_name?: string;
  email: string;
  full_name: string;
  phone_number: string;
  role: StaffSubRole;
  is_active: boolean;
  created_at: string;
  profile_photo?: string;
}

export interface StaffProfileUpdate {
  full_name?: string;
  phone_number?: string;
  profile_photo?: string;
  is_active?: boolean;
}

// ===============================
// PROFILE RESPONSES
// ===============================

export interface ProfileResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface ProfileUploadResponse {
  success: boolean;
  url: string;
  message?: string;
}

// ===============================
// PASSWORD CHANGE
// ===============================

export interface ChangePasswordData {
  current_password: string;
  new_password: string;
  confirm_password: string;
}

export interface ChangePasswordResponse {
  success: boolean;
  message: string;
}

// ===============================
// PROFILE STATISTICS
// ===============================

export interface PatientStatistics {
  total_appointments: number;
  upcoming_appointments: number;
  completed_appointments: number;
  cancelled_appointments: number;
  last_visit?: string;
  health_score: number;
  pending_lab_results: number;
}

export interface DoctorStatistics {
  total_appointments: number;
  total_patients: number;
  average_rating: number;
  total_reviews: number;
  upcoming_appointments: number;
  completed_appointments: number;
  cancellation_rate: number;
}

export interface ClinicStatistics {
  total_doctors: number;
  total_staff: number;
  total_appointments: number;
  total_patients_served: number;
  monthly_appointments: number;
  revenue?: number;
  occupancy_rate?: number;
}

export interface DiagnosticCenterStatistics {
  total_tests_performed: number;
  total_patients_served: number;
  total_doctors: number;
  total_staff: number;
  monthly_tests: number;
  average_processing_time?: number;
  patient_satisfaction_rate?: number;
}

// ===============================
// UNION TYPE FOR ALL PROFILES
// ===============================

export type UserProfile = 
  | PatientProfile 
  | DoctorProfile 
  | ClinicProfile 
  | DiagnosticCenterProfile 
  | StaffProfile;

// Helper type to get display name from profile
export function getDisplayName(profile: UserProfile): string {
  if ('first_name' in profile && profile.first_name) {
    return `${profile.first_name} ${(profile as any).last_name || ''}`.trim();
  }
  if ('name' in profile && profile.name) {
    return profile.name;
  }
  if ('full_name' in profile && profile.full_name) {
    return profile.full_name;
  }
  return 'User';
}