// types/entities/auth.types.ts

export type UserRole = 
  | 'patient' 
  | 'doctor' 
  | 'clinic' 
  | 'diagnostic_center' 
  | 'staff';

export type StaffSubRole = 
  | 'receptionist' 
  | 'technician' 
  | 'nurse' 
  | 'lab_assistant' 
  | 'card_checker';

export type ProviderType = 'doctor' | 'clinic' | 'diagnostic_center';

export type VerificationStatus = 'pending' | 'verified' | 'rejected';
export type ProfessionalVerificationStatus = 'pending' | 'submitted' | 'approved' | 'rejected';

// ===============================
// AUTH USER (BACKEND RESPONSE)
// ===============================

export interface AuthUser {
  id: number;
  email: string;
  phone_number: string;
  role: UserRole;
  
  // For Users (patients) and Staff
  first_name?: string;
  last_name?: string;
  
  // For Providers (doctors, clinics, diagnostic centers)
  full_name?: string;
  
  // Staff specific
  staff_sub_role?: StaffSubRole;
  
  // Provider specific (for doctors, clinics, diagnostic centers)
  provider_id?: number;
  provider_type?: ProviderType;
  
  // Status
  is_active: boolean;
  is_verified: boolean;
  verification_status: VerificationStatus;
  professional_verification_status?: ProfessionalVerificationStatus;
  
  // Profile
  profile_photo?: string;
  created_at: string;
}

// ===============================
// LOGIN
// ===============================

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
  
  // Professional details
  specialization: string;
  license_number: string;
  years_of_experience: number;
  consultation_fee: number;
  qualifications: string;
  bio?: string;
  location: string;
  
  // Documents
  license_document?: File;
  degree_document?: File;
}

export interface ClinicRegisterData {
  email: string;
  password: string;
  full_name: string;
  role: 'clinic';
  
  // Clinic details
  address: string;
  phone: string;
  license_number: string;
  tin_number: string;
  operating_hours: string;
  description?: string;
  established_year?: string;
  
  // Documents
  registration_document?: File;
}

export interface DiagnosticCenterRegisterData {
  email: string;
  password: string;
  full_name: string;
  role: 'diagnostic_center';
  
  // Center details
  address: string;
  phone: string;
  license_number: string;
  tin_number: string;
  accreditation: string;
  services_description: string;
  operating_hours: string;
  established_year?: string;
  
  // Documents
  registration_document?: File;
}

// STAFF REGISTRATION
export interface StaffRegisterData {
  employer_id: number;
  employer_type: ProviderType;
  email: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  role: StaffSubRole;
}

// Union type for all registration data
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