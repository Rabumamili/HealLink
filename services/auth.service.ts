// services/auth.service.ts
import { ApiService } from './api.service';
import { 
  LoginCredentials, 
  LoginResponse, 
  PatientRegisterData,
  DoctorRegisterData,
  ClinicRegisterData,
  DiagnosticCenterRegisterData,
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

  async registerPatient(data: PatientRegisterData): Promise<{ data: { userId: number } }> {
    return this.post(`${this.baseUrl}/register/patient`, data);
  }

  async registerDoctor(data: DoctorRegisterData): Promise<{ data: { userId: number } }> {
    return this.post(`${this.baseUrl}/register/doctor`, data);
  }

  async registerDoctorWithFiles(formData: FormData): Promise<{ data: { userId: number } }> {
    return this.postFormData(`${this.baseUrl}/register/doctor`, formData);
  }

  async registerClinic(data: ClinicRegisterData): Promise<{ data: { userId: number } }> {
    return this.post(`${this.baseUrl}/register/clinic`, data);
  }

  async registerClinicWithFiles(formData: FormData): Promise<{ data: { userId: number } }> {
    return this.postFormData(`${this.baseUrl}/register/clinic`, formData);
  }

  async registerDiagnosticCenter(data: DiagnosticCenterRegisterData): Promise<{ data: { userId: number } }> {
    return this.post(`${this.baseUrl}/register/diagnostic-center`, data);
  }

  async registerDiagnosticCenterWithFiles(formData: FormData): Promise<{ data: { userId: number } }> {
    return this.postFormData(`${this.baseUrl}/register/diagnostic-center`, formData);
  }

  async registerProfessional(formData: FormData): Promise<{ data: { userId: number } }> {
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

  async verifyEmail(data: VerifyEmailData): Promise<{ message: string }> {
    return this.post(`${this.baseUrl}/verify-email`, data);
  }

  async resendVerificationCode(data: ResendVerificationData): Promise<{ message: string }> {
    return this.post(`${this.baseUrl}/resend-verification`, data);
  }

  async forgotPassword(data: ForgotPasswordData): Promise<{ message: string }> {
    return this.post(`${this.baseUrl}/forgot-password`, data);
  }

  async resetPassword(data: ResetPasswordData): Promise<{ message: string }> {
    return this.post(`${this.baseUrl}/reset-password`, data);
  }

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

  // Helper to get user's display name based on role
  getUserDisplayName(user: AuthUser): string {
    if (user.role === 'patient' || user.role === 'doctor') {
      return `${user.first_name || ''} ${user.last_name || ''}`.trim();
    }
    if (user.role === 'clinic' || user.role === 'diagnostic_center') {
      return user.name || '';
    }
    if (user.role === 'staff') {
      return user.first_name ? `${user.first_name} ${user.last_name || ''}`.trim() : '';
    }
    return user.email;
  }
}

export const authService = new AuthService();