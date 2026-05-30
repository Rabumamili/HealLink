// services/auth.service.ts
import { ApiService } from './api.service';
import { 
  LoginCredentials, 
  LoginResponse, 
  UserRegisterData,
  DoctorRegisterData,
  ClinicRegisterData,
  DiagnosticCenterRegisterData,
  StaffRegisterData,
  VerifyEmailData,
  ResendVerificationData,
  ForgotPasswordData,
  ResetPasswordData,
  RefreshTokenResponse,
  AuthUser
} from '@/types/entities/auth.types';

class AuthService extends ApiService {
  private readonly baseUrl = '/auth';

  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const response = await this.post<LoginResponse>(`${this.baseUrl}/login`, credentials);
    
    if (response.token) {
      localStorage.setItem('token', response.token);
      localStorage.setItem('refreshToken', response.refreshToken);
      localStorage.setItem('user', JSON.stringify(response.user));
    }
    
    return response;
  }

  // ===============================
  // USER (PATIENT) REGISTRATION
  // ===============================
  async registerUser(data: UserRegisterData): Promise<{ data: { userId: number; tempUserId?: string } }> {
    return this.post(`${this.baseUrl}/register/patient`, data);
  }

  // ===============================
  // PROVIDER REGISTRATION
  // ===============================
  async registerDoctor(data: DoctorRegisterData): Promise<{ data: { userId: number; tempUserId?: string } }> {
    return this.post(`${this.baseUrl}/register/doctor`, data);
  }

  async registerDoctorWithFiles(formData: FormData): Promise<{ data: { userId: number; tempUserId?: string } }> {
    return this.postFormData(`${this.baseUrl}/register/doctor`, formData);
  }

  async registerClinic(data: ClinicRegisterData): Promise<{ data: { userId: number; tempUserId?: string } }> {
    return this.post(`${this.baseUrl}/register/clinic`, data);
  }

  async registerClinicWithFiles(formData: FormData): Promise<{ data: { userId: number; tempUserId?: string } }> {
    return this.postFormData(`${this.baseUrl}/register/clinic`, formData);
  }

  async registerDiagnosticCenter(data: DiagnosticCenterRegisterData): Promise<{ data: { userId: number; tempUserId?: string } }> {
    return this.post(`${this.baseUrl}/register/diagnostic-center`, data);
  }

  async registerDiagnosticCenterWithFiles(formData: FormData): Promise<{ data: { userId: number; tempUserId?: string } }> {
    return this.postFormData(`${this.baseUrl}/register/diagnostic-center`, formData);
  }

  // Generic professional registration (handles all provider types)
  async registerProfessional(formData: FormData): Promise<{ data: { userId: number; tempUserId?: string } }> {
    const role = formData.get('role');
    let endpoint = '';
    
    switch (role) {
      case 'doctor':
        endpoint = `${this.baseUrl}/register/doctor`;
        break;
      case 'clinic':
        endpoint = `${this.baseUrl}/register/clinic`;
        break;
      case 'diagnostic_center':
        endpoint = `${this.baseUrl}/register/diagnostic-center`;
        break;
      default:
        throw new Error('Invalid professional role');
    }
    
    return this.postFormData(endpoint, formData);
  }

  // ===============================
  // STAFF REGISTRATION (By Provider)
  // ===============================
  async registerStaff(data: StaffRegisterData): Promise<{ data: { userId: number; staffId: number } }> {
    // Only providers can create staff accounts
    return this.post(`${this.baseUrl}/register/staff`, data);
  }

  async getStaffList(employerId: number, employerType: string): Promise<{ data: AuthUser[] }> {
    return this.get(`${this.baseUrl}/staff/${employerType}/${employerId}`);
  }

  async updateStaffRole(staffId: number, role: string): Promise<{ data: AuthUser }> {
    return this.put(`${this.baseUrl}/staff/${staffId}/role`, { role });
  }

  async deactivateStaff(staffId: number): Promise<{ message: string }> {
    return this.put(`${this.baseUrl}/staff/${staffId}/deactivate`, {});
  }

  async activateStaff(staffId: number): Promise<{ message: string }> {
    return this.put(`${this.baseUrl}/staff/${staffId}/activate`, {});
  }

  // ===============================
  // EMAIL VERIFICATION
  // ===============================
  async verifyEmail(data: VerifyEmailData): Promise<{
    user: any;
    token: any;
    refreshToken: any;
    data: any; message: string 
}> {
    return this.post(`${this.baseUrl}/verify-email`, data);
  }

  async resendVerificationCode(data: ResendVerificationData): Promise<{ message: string }> {
    return this.post(`${this.baseUrl}/resend-verification`, data);
  }

  // ===============================
  // PASSWORD RESET
  // ===============================
  async forgotPassword(data: ForgotPasswordData): Promise<{ message: string }> {
    return this.post(`${this.baseUrl}/forgot-password`, data);
  }

  async resetPassword(data: ResetPasswordData): Promise<{ message: string }> {
    return this.post(`${this.baseUrl}/reset-password`, data);
  }

  // ===============================
  // TOKEN MANAGEMENT
  // ===============================
  async refreshToken(): Promise<RefreshTokenResponse> {
    const refreshToken = localStorage.getItem('refreshToken');
    const response = await this.post<RefreshTokenResponse>(`${this.baseUrl}/refresh-token`, {
      refreshToken
    });
    
    if (response.token) {
      localStorage.setItem('token', response.token);
      localStorage.setItem('refreshToken', response.refreshToken);
    }
    
    return response;
  }

  async logout(): Promise<void> {
    try {
      await this.post(`${this.baseUrl}/logout`, {});
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
    }
  }

  // ===============================
  // USER INFO & UTILITIES
  // ===============================
  getCurrentUser(): AuthUser | null {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      return JSON.parse(userStr);
    }
    return null;
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getRefreshToken(): string | null {
    return localStorage.getItem('refreshToken');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  async getMe(): Promise<AuthUser> {
    const response = await this.get<{ data: AuthUser }>(`${this.baseUrl}/me`);
    return response.data;
  }

  // ===============================
  // PROFESSIONAL VERIFICATION STATUS
  // ===============================
  async getProfessionalVerificationStatus(): Promise<{ 
    status: string; 
    submittedAt?: string; 
    approvedAt?: string;
    rejectionReason?: string;
  }> {
    const response = await this.get<{ data: any }>(`${this.baseUrl}/professional-verification/status`);
    return response.data;
  }

  async submitProfessionalVerification(formData: FormData): Promise<{ message: string }> {
    return this.postFormData(`${this.baseUrl}/professional-verification/submit`, formData);
  }

  // Check if provider can access dashboard (professional verification approved)
  async canAccessDashboard(): Promise<boolean> {
    const user = this.getCurrentUser();
    if (!user) return false;
    
    // Patients and staff can always access their dashboard
    if (user.role === 'patient' || user.role === 'staff') {
      return true;
    }
    
    // Providers need professional verification
    const status = user.professional_verification_status;
    return status === 'approved';
  }

  // ===============================
  // HELPER METHODS
  // ===============================
  
  // Get user's display name based on role
  getUserDisplayName(user: AuthUser): string {
    // For Users (patients) and Staff - have first_name & last_name
    if (user.role === 'patient' || user.role === 'staff') {
      return `${user.first_name || ''} ${user.last_name || ''}`.trim();
    }
    
    // For Providers (doctors, clinics, diagnostic centers) - have full_name
    if (user.role === 'doctor' || user.role === 'clinic' || user.role === 'diagnostic_center') {
      return user.full_name || '';
    }
    
    // Fallback
    return user.email;
  }

  // Get user initials for avatar
  getUserInitials(user: AuthUser): string {
    const name = this.getUserDisplayName(user);
    if (!name) return '?';
    
    // For names with spaces
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return (parts[0][0] || '?').toUpperCase();
  }

  // Check if user is a provider (doctor, clinic, diagnostic center)
  isProvider(user: AuthUser): boolean {
    return ['doctor', 'clinic', 'diagnostic_center'].includes(user.role);
  }

  // Check if user is a patient
  isPatient(user: AuthUser): boolean {
    return user.role === 'patient';
  }

  // Check if user is staff
  isStaff(user: AuthUser): boolean {
    return user.role === 'staff';
  }

  // Check if professional verification is required
  requiresProfessionalVerification(user: AuthUser): boolean {
    return this.isProvider(user);
  }

  // Check if professional verification is pending
  isProfessionalVerificationPending(user: AuthUser): boolean {
    return this.isProvider(user) && user.professional_verification_status === 'pending';
  }

  // Check if professional verification is approved
  isProfessionalVerificationApproved(user: AuthUser): boolean {
    return this.isProvider(user) && user.professional_verification_status === 'approved';
  }
}

export const authService = new AuthService();