// types/entities/auth.types.ts

export type UserRole =
  | 'patient'
  | 'doctor'
  | 'clinic'
  | 'diagnostic_center'
  | 'staff';

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
  first_name?: string;
  last_name?: string;
  full_name?: string;
  date_of_birth?: string;
  gender?: string;

  provider_id?: number;
  provider_type?: ProviderType;
  employer_id?: number;
  employer_type?: ProviderType;
  professional_verification_status?: ProfessionalVerificationStatus;
  rejection_reason?: string;
  specialization?: string;

  license_number?: string;
  tin_number?: string;
  license_document?: string;
  location?: string;
  address?: string;
  description?: string;

  staff_sub_role?: StaffSubRole;
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

export interface DoctorRegisterData {
  email: string;
  password: string;
  full_name: string;
  phone_number: string;
  role: 'doctor';
  specialization: string;
  license_number: string;
  location: string;
  license_document: File;
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
  license_document: File;
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
  license_document: File;
  description?: string;
}

export type StaffSubRole = 'lab assistant' | 'card_checker';

export interface StaffRegisterData {
  email: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  employer_id: number;
  employer_type: ProviderType;
  staff_sub_role: StaffSubRole;
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
  | DiagnosticCenterRegisterData;

// ===============================
// EMAIL VERIFICATION
// ===============================

export interface VerifyEmailData {
  email: string;
  code: string;
  role?: UserRole;
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
// BACKEND API (snake_case)
// ===============================

export interface BackendPatient {
  id: number;
  email: string;
  first_name: string | null;
  last_name: string | null;
  phone_number: string | null;
  date_of_birth?: string | null;
  gender?: string | null;
  role: string;
  is_active: boolean;
  is_verified: boolean;
  verification_status: VerificationStatus;
  created_at: string;
  updated_at: string | null;
}

export interface BackendPatientRegisterRequest {
  email: string;
  password: string;
  role: 'patient';
  first_name?: string;
  last_name?: string;
  phone_number?: string;
  date_of_birth?: string;
  gender?: string;
}

export interface BackendTokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  patient: BackendPatient;
}

export interface BackendRefreshTokenRequest {
  refresh_token: string;
}

export interface BackendProviderRegisterPayload {
  provider_type: ProviderType;
  email: string;
  license_file: File;
  password?: string;
  name?: string;
  phone_number?: string;
  location?: string;
  address?: string;
  specialization?: string;
  license_number?: string;
  tin_number?: string;
  description?: string;
}

// ===============================
// API ERROR
// ===============================

export interface ApiError {
  message: string;
  statusCode?: number;
  errors?: Record<string, string[]>;
}
