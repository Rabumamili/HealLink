// types/entities/profile.types.ts

import { ProviderType, VerificationStatus, ProfessionalVerificationStatus, StaffSubRole } from './auth.types';
import { PaymentStatus } from './payment.types';

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
// USER (PATIENT) PROFILE
// ===============================

export interface PatientProfile {
  status: PaymentStatus;
  id: number;
  user_id: number;
  role: 'patient';
  email: string;
  phone_number: string;
  first_name: string;
  last_name: string;
  date_of_birth?: string;
  gender?: 'Male' | 'Female' | 'Other';
  blood_type?: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
  address?: string;
  profile_photo?: string;
  
  
  // Statistics
  total_appointments?: number;
  last_visit?: string;
  health_score?: number;
  
  created_at: string;
  updated_at?: string;
}

export interface PatientProfileUpdate {
  first_name?: string;
  last_name?: string;
  phone_number?: string;
  date_of_birth?: string;
  gender?: string;
  blood_type?: string;
  address?: string;
  profile_photo?: string;
}

// ===============================
// DOCTOR PROFILE (without rating/review stats)
// ===============================

export interface DoctorProfile {
  id: number;
  user_id: number;
  role: 'doctor';
  provider_type: 'doctor';
  email: string;
  phone_number: string;
  full_name: string;
  
  // Professional details
  specialization: string;
  license_number: string;
  years_of_experience: number;
  consultation_fee: number | string;
  qualifications: string;
  bio?: string;
  education?: string;
  location: string;
  description?: string;
  
  
  // Images
  profile_photo?: string;

  
  // Documents
  license_document_url?: string;
  degree_document_url?: string;
  
  // Status
  verification_status: VerificationStatus;
  professional_verification_status: ProfessionalVerificationStatus;
  is_active: boolean;
  joined_date: string;
  
  // Statistics (reviews removed - now in review.types.ts)
  total_appointments?: number;
  total_patients?: number;
  
  created_at: string;
  updated_at?: string;
}

export interface DoctorProfileUpdate {
  full_name?: string;
  phone_number?: string;
  location?: string;
  description?: string;
  specialization?: string;
  license_number?: string;
  years_of_experience?: number;
  consultation_fee?: number | string;
  qualifications?: string;
  bio?: string;
  education?: string;
  profile_photo?: string;
}

// ===============================
// CLINIC PROFILE (without rating/review stats)
// ===============================

export interface ClinicProfile {
  id: number;
  user_id: number;
  role: 'clinic';
  provider_type: 'clinic';
  email: string;
  phone_number: string;
  full_name: string;
  address: string;
  license_number: string;
  tin_number: string;
  operating_hours: string;
  description: string;
  established_year?: string;
  location: string;
  
  // Images
  profile_photo?: string;
  
  // Documents
  registration_document_url?: string;
  
  // Status
  verification_status: VerificationStatus;
  professional_verification_status: ProfessionalVerificationStatus;
  is_active: boolean;
  joined_date: string;
  
  created_at: string;
  updated_at?: string;
}

export interface ClinicProfileUpdate {
  full_name?: string;
  address?: string;
  phone_number?: string;
  license_number?: string;
  tin_number?: string;
  operating_hours?: string;
  description?: string;
  established_year?: string;
  location?: string;
  profile_photo?: string;
}

// ===============================
// DIAGNOSTIC CENTER PROFILE (without rating/review stats)
// ===============================

export interface DiagnosticCenterProfile {
  id: number;
  user_id: number;
  role: 'diagnostic_center';
  provider_type: 'diagnostic_center';
  email: string;
  phone_number: string;
  full_name: string;
  address: string;
  license_number: string;
  tin_number: string;
  accreditation: string;
  services_description: string;
  operating_hours: string;
  established_year?: string;
  location: string;
  
  // Services offered
  services_offered: string[];
  
  // Images
  profile_photo?: string;
  
  // Documents
  registration_document_url?: string;
  
  // Status
  verification_status: VerificationStatus;
  professional_verification_status: ProfessionalVerificationStatus;
  is_active: boolean;
  joined_date: string;
  

  
  created_at: string;
  updated_at?: string;
}

export interface DiagnosticCenterProfileUpdate {
  full_name?: string;
  address?: string;
  phone_number?: string;
  email?: string;
  website?: string;
  license_number?: string;
  tin_number?: string;
  accreditation?: string;
  services_description?: string;
  operating_hours?: string;
  established_year?: string;
  services_offered?: string[];
  location?: string;
  profile_photo?: string;
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
  first_name: string;
  last_name: string;
  phone_number: string;
  role: StaffSubRole;
  is_active: boolean;
  profile_photo?: string;
  created_at: string;
  updated_at?: string;
}

export interface StaffProfileUpdate {
  first_name?: string;
  last_name?: string;
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
// PROFILE STATISTICS (without review stats)
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

export interface StaffStatistics {
  total_appointments_handled: number;
  total_patients_served: number;
  average_response_time?: number;
  task_completion_rate?: number;
}

// ===============================
// UNION TYPE FOR ALL PROFILES
// ===============================

export type Profile = 
  | PatientProfile 
  | DoctorProfile 
  | ClinicProfile 
  | DiagnosticCenterProfile 
  | StaffProfile;

// Helper function to get display name from profile
export function getDisplayName(profile: Profile): string {
  if ('first_name' in profile && profile.first_name) {
    const lastName = (profile as any).last_name || '';
    return `${profile.first_name} ${lastName}`.trim();
  }
  
  if ('full_name' in profile && profile.full_name) {
    return profile.full_name;
  }
  
  return 'User';
}

// Helper function to get profile type
export function getProfileType(profile: Profile): string {
  if ('role' in profile) {
    return profile.role;
  }
  return 'unknown';
}