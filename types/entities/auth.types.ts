// types/entities/auth.types.ts

export type UserRole = 
  | 'patient' 
  | 'doctor' 
  | 'clinic' 
  | 'diagnostic_center' 
  | 'staff';

export type StaffSubRole =  
  | 'lab assistant' 
  | 'card_checker';

export type ProviderType = 'doctor' | 'clinic' | 'diagnostic_center';

export type VerificationStatus = 'pending' | 'verified' | 'rejected';
export type ProfessionalVerificationStatus = 'pending' | 'submitted' | 'approved' | 'rejected';

export interface AuthUser {
  id: number;
  email: string;
  phone_number: string;
  role: UserRole;
  is_active: boolean;
  is_verified: boolean;
  verification_status: VerificationStatus;
  created_at: string;
  updated_at?: string;
  
  // For Users (patients) and Staff
  first_name?: string;
  last_name?: string;
  
  // For Providers (doctors, clinics, diagnostic centers)
  full_name?: string;
  
  // Staff specific
  staff_sub_role?: StaffSubRole;
  employer_id?: number;
  employer_type?: ProviderType;
  
  // Provider specific
  provider_id?: number;
  provider_type?: ProviderType;
  professional_verification_status?: ProfessionalVerificationStatus;
  rejection_reason?: string;
  
  // Provider fields
  specialization?: string;
  license_number?: string;
  tin_number?: string;
  license_document?: string;
  location?: string;
  address?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  refreshToken: string;
  user: AuthUser;
}

// ===============================
// REGISTRATION
// ===============================

// USER (PATIENT) REGISTRATION
export interface UserRegisterData {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  date_of_birth?: string;
  gender?: string;
  role: 'patient';
}

// PROVIDER REGISTRATION TYPES
export interface DoctorRegisterData {
  email: string;
  password: string;
  full_name: string;
  phone_number: string;
  role: 'doctor';
  specialization: string;
  license_number: string;
  location: string;
  license_document?: File;
}

export interface ClinicRegisterData {
  email: string;
  password: string;
  full_name: string;
  role: 'clinic';
  address: string;
  phone_number: string;
  license_number: string;
  tin_number: string;
  license_document?: File;
}

export interface DiagnosticCenterRegisterData {
  email: string;
  password: string;
  full_name: string;
  role: 'diagnostic_center';
  address: string;
  phone_number: string;
  license_number: string;
  tin_number: string;
  license_document?: File;
}

export interface StaffRegisterData {
  employer_id: number;
  employer_type: ProviderType;
  email: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  role: StaffSubRole;
  send_invitation?: boolean;
}

export interface ProfessionalVerificationSubmitData {
  role: UserRole;
  license_number: string;
  tin_number?: string;
}

export type RegisterData = 
  | UserRegisterData 
  | DoctorRegisterData 
  | ClinicRegisterData 
  | DiagnosticCenterRegisterData
  | StaffRegisterData;

// ===============================
// EMAIL VERIFICATION
// ===============================

export interface VerifyEmailData {
  email: string;
  code: string;
}

export interface ResendVerificationData {
  email: string;
}

// ===============================
// PASSWORD RESET
// ===============================

export interface ForgotPasswordData {
  email: string;
}

export interface ResetPasswordData {
  token: string;
  password: string;
  confirm_password: string;
}

// ===============================
// TOKEN REFRESH
// ===============================

export interface RefreshTokenResponse {
  token: string;
  refreshToken: string;
}

// ===============================
// API ERROR
// ===============================

export interface ApiError {
  message: string;
  statusCode?: number;
  errors?: Record<string, string[]>;
}