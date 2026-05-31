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
  StaffSubRole,
  ProviderType,
  UserRole,
  VerifyEmailData,
  ResendVerificationData,
  ForgotPasswordData,
  ResetPasswordData,
  RefreshTokenResponse,
  AuthUser,
  ProfessionalVerificationSubmitData,
} from '@/types/entities/auth.types';

class AuthService extends ApiService {
  private readonly basePath = '/auth';

  // ===============================
  // AUTHENTICATION
  // ===============================

  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const response = await this.post<LoginResponse>(
      `${this.basePath}/login`,
      credentials
    );
    
    if (response.token) {
      localStorage.setItem('token', response.token);
      localStorage.setItem('refreshToken', response.refreshToken);
      localStorage.setItem('user', JSON.stringify(response.user));
    }
    
    return response;
  }

  async logout(): Promise<void> {
    try {
      await this.post(`${this.basePath}/logout`, {});
    } catch (error) {
      console.error('Logout API error:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
    }
  }

  // ===============================
  // REGISTRATION
  // ===============================

  async registerUser(data: UserRegisterData): Promise<LoginResponse> {
    const response = await this.post<LoginResponse>(`${this.basePath}/register/user`, data);
    
    if (response.token) {
      localStorage.setItem('token', response.token);
      localStorage.setItem('refreshToken', response.refreshToken);
      localStorage.setItem('user', JSON.stringify(response.user));
    }
    
    return response;
  }

  async registerDoctor(data: DoctorRegisterData): Promise<LoginResponse> {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value instanceof File) {
        formData.append(key, value);
      } else if (value !== undefined && value !== null) {
        formData.append(key, String(value));
      }
    });
    
    const response = await this.postFormData<LoginResponse>(`${this.basePath}/register/doctor`, formData);
    
    if (response.token) {
      localStorage.setItem('token', response.token);
      localStorage.setItem('refreshToken', response.refreshToken);
      localStorage.setItem('user', JSON.stringify(response.user));
    }
    
    return response;
  }

  async registerClinic(data: ClinicRegisterData): Promise<LoginResponse> {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value instanceof File) {
        formData.append(key, value);
      } else if (value !== undefined && value !== null) {
        formData.append(key, String(value));
      }
    });
    
    const response = await this.postFormData<LoginResponse>(`${this.basePath}/register/clinic`, formData);
    
    if (response.token) {
      localStorage.setItem('token', response.token);
      localStorage.setItem('refreshToken', response.refreshToken);
      localStorage.setItem('user', JSON.stringify(response.user));
    }
    
    return response;
  }

  async registerDiagnosticCenter(data: DiagnosticCenterRegisterData): Promise<LoginResponse> {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value instanceof File) {
        formData.append(key, value);
      } else if (value !== undefined && value !== null) {
        formData.append(key, String(value));
      }
    });
    
    const response = await this.postFormData<LoginResponse>(
      `${this.basePath}/register/diagnostic-center`,
      formData
    );
    
    if (response.token) {
      localStorage.setItem('token', response.token);
      localStorage.setItem('refreshToken', response.refreshToken);
      localStorage.setItem('user', JSON.stringify(response.user));
    }
    
    return response;
  }

  async registerStaff(data: StaffRegisterData): Promise<{ message: string; staff_id: number; email: string }> {
    return this.post<{ message: string; staff_id: number; email: string }>(
      `${this.basePath}/register/staff`,
      data
    );
  }

  async completeStaffRegistration(token: string, password: string, confirmPassword: string): Promise<LoginResponse> {
    const response = await this.post<LoginResponse>(`${this.basePath}/staff/complete-registration`, {
      token,
      password,
      confirm_password: confirmPassword
    });
    
    if (response.token) {
      localStorage.setItem('token', response.token);
      localStorage.setItem('refreshToken', response.refreshToken);
      localStorage.setItem('user', JSON.stringify(response.user));
    }
    
    return response;
  }

  async resendStaffInvitation(email: string): Promise<{ message: string }> {
    return this.post<{ message: string }>(`${this.basePath}/staff/resend-invitation`, { email });
  }

  // ===============================
  // PROFESSIONAL VERIFICATION
  // ===============================

  async submitProfessionalVerification(data: ProfessionalVerificationSubmitData): Promise<{ message: string }> {
    const response = await this.post<{ message: string }>(`${this.basePath}/submit-professional-verification`, data);
    
    const updatedUser = await this.getCurrentUser();
    localStorage.setItem('user', JSON.stringify(updatedUser));
    
    return response;
  }

  async getProfessionalVerificationStatus(): Promise<{ status: string; rejection_reason?: string }> {
    return this.get<{ status: string; rejection_reason?: string }>(`${this.basePath}/professional-verification-status`);
  }

  // ===============================
  // EMAIL VERIFICATION
  // ===============================

  async verifyEmail(data: VerifyEmailData): Promise<{ message: string }> {
    const response = await this.post<{ message: string }>(`${this.basePath}/verify-email`, data);
    
    const updatedUser = await this.getCurrentUser();
    localStorage.setItem('user', JSON.stringify(updatedUser));
    
    return response;
  }

  async resendVerificationCode(data: ResendVerificationData): Promise<{ message: string }> {
    return this.post<{ message: string }>(`${this.basePath}/resend-verification`, data);
  }

  // ===============================
  // PASSWORD MANAGEMENT
  // ===============================

  async forgotPassword(data: ForgotPasswordData): Promise<{ message: string }> {
    return this.post<{ message: string }>(`${this.basePath}/forgot-password`, data);
  }

  async resetPassword(data: ResetPasswordData): Promise<{ message: string }> {
    return this.post<{ message: string }>(`${this.basePath}/reset-password`, data);
  }

  async changePassword(oldPassword: string, newPassword: string): Promise<{ message: string }> {
    return this.post<{ message: string }>(`${this.basePath}/change-password`, {
      oldPassword,
      newPassword,
    });
  }

  // ===============================
  // TOKEN MANAGEMENT
  // ===============================

  async refreshToken(): Promise<RefreshTokenResponse> {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await this.post<RefreshTokenResponse>(
      `${this.basePath}/refresh-token`,
      { refreshToken }
    );

    if (response.token) {
      localStorage.setItem('token', response.token);
      localStorage.setItem('refreshToken', response.refreshToken);
    }

    return response;
  }

  // ===============================
  // USER PROFILE
  // ===============================

  async getCurrentUser(): Promise<AuthUser> {
    const cachedUser = localStorage.getItem('user');
    if (cachedUser) {
      try {
        return JSON.parse(cachedUser);
      } catch (e) {
        // Invalid JSON, continue to API call
      }
    }
    
    const user = await this.get<AuthUser>(`${this.basePath}/me`);
    localStorage.setItem('user', JSON.stringify(user));
    return user;
  }

  async updateProfile(data: Partial<AuthUser>): Promise<AuthUser> {
    const user = await this.put<AuthUser>(`${this.basePath}/profile`, data);
    localStorage.setItem('user', JSON.stringify(user));
    return user;
  }

  // ===============================
  // STAFF MANAGEMENT
  // ===============================

  async getStaffMembers(employerId: number, employerType: string): Promise<AuthUser[]> {
    return this.get<AuthUser[]>(`${this.basePath}/staff?employerId=${employerId}&employerType=${employerType}`);
  }

  async updateStaffRole(staffId: number, role: StaffSubRole): Promise<AuthUser> {
    return this.put<AuthUser>(`${this.basePath}/staff/${staffId}/role`, { role });
  }

  async deactivateStaff(staffId: number): Promise<{ message: string }> {
    return this.post<{ message: string }>(`${this.basePath}/staff/${staffId}/deactivate`, {});
  }

  async activateStaff(staffId: number): Promise<{ message: string }> {
    return this.post<{ message: string }>(`${this.basePath}/staff/${staffId}/activate`, {});
  }

  async deleteStaff(staffId: number): Promise<{ message: string }> {
    return this.delete<{ message: string }>(`${this.basePath}/staff/${staffId}`);
  }

  // ===============================
  // HELPER METHODS
  // ===============================

  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    return !!token;
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getRefreshToken(): string | null {
    return localStorage.getItem('refreshToken');
  }

  getCurrentUserSync(): AuthUser | null {
    const user = localStorage.getItem('user');
    if (user) {
      try {
        return JSON.parse(user);
      } catch (e) {
        return null;
      }
    }
    return null;
  }

  hasRole(role: UserRole | UserRole[]): boolean {
    const user = this.getCurrentUserSync();
    if (!user) return false;
    
    if (Array.isArray(role)) {
      return role.includes(user.role);
    }
    return user.role === role;
  }

  isStaffWithRole(subRole?: StaffSubRole | StaffSubRole[]): boolean {
    const user = this.getCurrentUserSync();
    if (!user || user.role !== 'staff') return false;
    
    if (!subRole) return true;
    
    if (Array.isArray(subRole)) {
      return subRole.includes(user.staff_sub_role!);
    }
    return user.staff_sub_role === subRole;
  }

  getEmployerInfo(): { id: number; type: ProviderType } | null {
    const user = this.getCurrentUserSync();
    if (user?.role !== 'staff' || !user.employer_id || !user.employer_type) {
      return null;
    }
    return {
      id: user.employer_id,
      type: user.employer_type
    };
  }

  shouldRedirectToProfessionalVerification(): boolean {
    const user = this.getCurrentUserSync();
    if (!user) return false;
    
    if (user.role !== 'doctor' && user.role !== 'clinic' && user.role !== 'diagnostic_center') {
      return false;
    }
    
    const status = user.professional_verification_status;
    return !status || status === 'pending' || status === 'rejected';
  }
}

export const authService = new AuthService();