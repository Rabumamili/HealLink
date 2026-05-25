// types/entities/auth.types.ts (updated with missing types)
export type UserRole = 
  | 'patient' 
  | 'doctor' 
  | 'clinic_admin' 
  | 'diagnostic_admin'
  | 'staff';

export type StaffSubRole = 
  | 'receptionist' 
  | 'technician' 
  | 'nurse' 
  | 'lab_assistant' 
  | 'card_checker';

export type VerificationStatus = 'pending' | 'verified' | 'rejected';
export type ProfessionalVerificationStatus = 'pending' | 'submitted' | 'approved' | 'rejected';

export interface AuthUser {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  role: UserRole;
  staff_sub_role?: StaffSubRole;
  employer_id?: number;
  employer_type?: 'doctor' | 'clinic' | 'diagnostic_center';
  is_active: boolean;
  is_verified: boolean;
  verification_status: VerificationStatus;
  professional_verification_status?: ProfessionalVerificationStatus;
  profile_photo?: string;
  created_at: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

// BASE REGISTRATION - Same for all users (patients AND providers)
export interface BaseRegisterData {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  date_of_birth?: string;
  gender?: string;
  role: 'patient' | 'doctor' | 'clinic_admin' | 'diagnostic_admin';
}

// PROFESSIONAL REGISTRATION - Only for providers (after email verification)
export interface ProfessionalRegistrationData {
  userId: number;
  role: 'doctor' | 'clinic_admin' | 'diagnostic_admin';
  // Doctor specific
  license_number?: string;
  specialization?: string;
  qualifications?: string;
  years_of_experience?: number;
  consultation_fee?: number;
  bio?: string;
  location?: string;
  license_document?: File;
  degree_document?: File;
  // Clinic specific
  clinic_name?: string;
  clinic_address?: string;
  clinic_license_number?: string;
  clinic_tin_number?: string;
  operating_hours?: string;
  clinic_registration_document?: File;
  // Diagnostic center specific
  center_name?: string;
  center_address?: string;
  center_license_number?: string;
  center_tin_number?: string;
  center_accreditation?: string;
  services_description?: string;
  center_registration_document?: File;
}

export interface StaffRegisterData {
  employer_id: number;
  employer_type: 'doctor' | 'clinic' | 'diagnostic_center';
  email: string;
  full_name: string;
  phone_number: string;
  role: StaffSubRole;
}

export interface VerifyEmailData {
  email: string;
  code: string;
  role: string;
}

export interface ResendVerificationData {
  email: string;
}

export interface AuthResponse {
  token: string;
  refreshToken: string;
  user: AuthUser;
}

export interface ForgotPasswordData {
  email: string;
}

export interface ResetPasswordData {
  token: string;
  password: string;
  confirmPassword: string;
}

export interface RefreshTokenResponse {
  token: string;
}

export interface ApiError {
  message: string;
  statusCode?: number;
  errors?: Record<string, string[]>;
}