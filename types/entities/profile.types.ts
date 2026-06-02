// types/entities/profile.types.ts

import { ProviderType, VerificationStatus, ProfessionalVerificationStatus, StaffSubRole } from './auth.types';
import { PaymentStatus } from './payment.types';

// ===============================
// PATIENT PROFILE
// ===============================

export interface PatientProfile {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  date_of_birth?: string;
  gender: string;
  role: 'patient';
  is_active: boolean;
  is_verified: boolean;
  verification_status: string;
  profile_photo?: string;
  profile_picture?: string;
  created_at: string;
  updated_at: string;
}

export interface PatientProfileUpdate {
  email?: string | null;
  first_name?: string | null;
  last_name?: string | null;
  phone_number?: string | null;
  date_of_birth?: string | null;
  gender?: string | null;
  profile_picture?: string;
}

// ===============================
// PROVIDER BASE (Common provider fields)
// ===============================

export interface BaseProviderProfile {
  id: number;
  name: string;
  provider_type: string;
  email: string;
  phone: string;
  specialization: string;
  license_number: string;
  tin_number: string;
  location: string;
  address: string;
  description: string;
  profile_picture: string;
  is_verified: boolean;
  verification_status: string;
  created_at: string;
  // Legacy fields for backward compatibility
  full_name?: string;
  profile_photo?: string;
  is_active?: boolean;
  license_document?: string;
  joined_date?: string;
}

// ===============================
// DOCTOR PROVIDER PROFILE
// ===============================

export interface DoctorProfile extends BaseProviderProfile {
  role: 'doctor';
  provider_type: 'doctor';

  // Professional details
  years_of_experience?: number;
  consultation_fee?: number | string;
  qualifications?: string;
  bio?: string;
  education?: string;

  // Statistics
  total_appointments?: number;
  total_patients?: number;
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
// CLINIC PROVIDER PROFILE
// ===============================

export interface ClinicProfile extends BaseProviderProfile {
  role: 'clinic';
  provider_type: 'clinic';

  // Clinic specific
  operating_hours?: string;
  established_year?: string;

  // Statistics
  total_doctors?: number;
  total_staff?: number;
  total_appointments?: number;
  total_patients_served?: number;
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
// DIAGNOSTIC CENTER PROVIDER PROFILE
// ===============================

export interface DiagnosticCenterProfile extends BaseProviderProfile {
  role: 'diagnostic_center';
  provider_type: 'diagnostic_center';

  // Diagnostic center specific
  accreditation?: string;
  services_description?: string;
  operating_hours?: string;
  established_year?: string;

  // Services offered
  services_offered?: string[];

  // Statistics
  total_tests_performed?: number;
  total_patients_served?: number;
  monthly_tests?: number;
}

export interface DiagnosticCenterProfileUpdate {
  full_name?: string;
  address?: string;
  phone_number?: string;
  email?: string;
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
  role: 'staff';
  email: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  profile_photo?: string;
  
  // Employment info
  employer_id: number;
  employer_type: ProviderType;
  employer_name?: string;
  
  // Staff role
  staff_sub_role: StaffSubRole;
  
  // Status
  is_active: boolean;
  
  // Statistics
  total_appointments_handled?: number;
  total_patients_served?: number;
  average_response_time?: number;
  task_completion_rate?: number;
  
  created_at: string;
  updated_at?: string;
}

export interface StaffProfileUpdate {
  first_name?: string;
  last_name?: string;
  phone_number?: string;
  profile_photo?: string;
  is_active?: boolean;
  staff_sub_role?: StaffSubRole;
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
  upcoming_appointments: number;
  completed_appointments: number;
  cancellation_rate: number;
  average_rating?: number;
  total_reviews?: number;
}

export interface ClinicStatistics {
  total_doctors: number;
  total_staff: number;
  total_appointments: number;
  total_patients_served: number;
  monthly_appointments: number;
  revenue?: number;
  occupancy_rate?: number;
  average_rating?: number;
}

export interface DiagnosticCenterStatistics {
  total_tests_performed: number;
  total_patients_served: number;
  total_doctors: number;
  total_staff: number;
  monthly_tests: number;
  average_processing_time?: number;
  patient_satisfaction_rate?: number;
  average_rating?: number;
}

export interface StaffStatistics {
  total_appointments_handled: number;
  total_patients_served: number;
  average_response_time?: number;
  task_completion_rate?: number;
}

// ===============================
// TYPE GUARDS & HELPER FUNCTIONS
// ===============================

export function getDisplayName(profile: Profile): string {
  if (isStaff(profile)) {
    return `${profile.first_name} ${profile.last_name}`.trim();
  }
  
  if (isPatient(profile)) {
    return `${profile.first_name} ${profile.last_name}`.trim();
  }

  if (isProvider(profile)) {
    return profile.full_name || profile.name || 'Provider';
  }

  return 'User';
}

export function getProfilePhoto(profile: Profile | null): string | undefined {
  if (!profile) return undefined;
  if ('profile_picture' in profile) return profile.profile_picture;
  if ('profile_photo' in profile) return profile.profile_photo;
  return undefined;
}

export function getProfileRole(profile: Profile): string {
  return profile.role;
}

export function getProviderType(profile: Profile): ProviderType | null {
  if (isProvider(profile)) {
    return profile.provider_type;
  }
  return null;
}

// Type guards
export function isProvider(profile: Profile): profile is DoctorProfile | ClinicProfile | DiagnosticCenterProfile {
  return 'provider_type' in profile;
}

export function isPatient(profile: Profile): profile is PatientProfile {
  return profile.role === 'patient';
}

export function isDoctor(profile: Profile): profile is DoctorProfile {
  return profile.role === 'doctor' && 'provider_type' in profile && profile.provider_type === 'doctor';
}

export function isClinic(profile: Profile): profile is ClinicProfile {
  return profile.role === 'clinic' && 'provider_type' in profile && profile.provider_type === 'clinic';
}

export function isDiagnosticCenter(profile: Profile): profile is DiagnosticCenterProfile {
  return profile.role === 'diagnostic_center' && 'provider_type' in profile && profile.provider_type === 'diagnostic_center';
}

export function isStaff(profile: Profile): profile is StaffProfile {
  return profile.role === 'staff';
}

export function getStaffSubRole(profile: Profile): StaffSubRole | null {
  if (isStaff(profile)) {
    return profile.staff_sub_role;
  }
  return null;
}

// Get statistics by profile type
export function getStatisticsByProfileType(profile: Profile, statistics: any) {
  if (isPatient(profile)) return statistics as PatientStatistics;
  if (isDoctor(profile)) return statistics as DoctorStatistics;
  if (isClinic(profile)) return statistics as ClinicStatistics;
  if (isDiagnosticCenter(profile)) return statistics as DiagnosticCenterStatistics;
  if (isStaff(profile)) return statistics as StaffStatistics;
  return null;
}