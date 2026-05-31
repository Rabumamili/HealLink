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

// Mock user data for development
const MOCK_USER: AuthUser = {
  id: 1,
  email: 'demo@heallink.com',
  phone_number: '+1234567890',
  role: 'staff', // Change this to 'patient', 'doctor', 'clinic', 'diagnostic_center' as needed
  is_active: true,
  is_verified: true,
  verification_status: 'verified',
  created_at: new Date().toISOString(),
  first_name: 'Demo',
  last_name: 'User',
  staff_sub_role: 'lab assistant', // For staff role
  employer_id: 1,
  employer_type: 'clinic',
  professional_verification_status: 'approved',
};

class AuthService extends ApiService {
  private readonly basePath = '/auth';

  // ===============================
  // AUTHENTICATION
  // ===============================

  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    // Bypass actual login and return mock data
    console.log('Login attempt (bypassed):', credentials);
    
    const mockResponse: LoginResponse = {
      token: 'mock-jwt-token',
      refreshToken: 'mock-refresh-token',
      user: { ...MOCK_USER, email: credentials.email },
    };
    
    if (mockResponse.token) {
      localStorage.setItem('token', mockResponse.token);
      localStorage.setItem('refreshToken', mockResponse.refreshToken);
      localStorage.setItem('user', JSON.stringify(mockResponse.user));
    }
    
    return mockResponse;
  }

  async logout(): Promise<void> {
    console.log('Logout (bypassed)');
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  }

  // ===============================
  // REGISTRATION
  // ===============================

  async registerUser(data: UserRegisterData): Promise<LoginResponse> {
    console.log('User registration (bypassed):', data);
    
    const mockResponse: LoginResponse = {
      token: 'mock-jwt-token',
      refreshToken: 'mock-refresh-token',
      user: {
        ...MOCK_USER,
        email: data.email,
        first_name: data.first_name,
        last_name: data.last_name,
        phone_number: data.phone_number,
        role: 'patient',
      },
    };
    
    if (mockResponse.token) {
      localStorage.setItem('token', mockResponse.token);
      localStorage.setItem('refreshToken', mockResponse.refreshToken);
      localStorage.setItem('user', JSON.stringify(mockResponse.user));
    }
    
    return mockResponse;
  }

  async registerDoctor(data: DoctorRegisterData): Promise<LoginResponse> {
    console.log('Doctor registration (bypassed):', data);
    
    const mockResponse: LoginResponse = {
      token: 'mock-jwt-token',
      refreshToken: 'mock-refresh-token',
      user: {
        ...MOCK_USER,
        email: data.email,
        full_name: data.full_name,
        phone_number: data.phone_number,
        role: 'doctor',
        specialization: data.specialization,
        license_number: data.license_number,
        location: data.location,
      },
    };
    
    if (mockResponse.token) {
      localStorage.setItem('token', mockResponse.token);
      localStorage.setItem('refreshToken', mockResponse.refreshToken);
      localStorage.setItem('user', JSON.stringify(mockResponse.user));
    }
    
    return mockResponse;
  }

  async registerClinic(data: ClinicRegisterData): Promise<LoginResponse> {
    console.log('Clinic registration (bypassed):', data);
    
    const mockResponse: LoginResponse = {
      token: 'mock-jwt-token',
      refreshToken: 'mock-refresh-token',
      user: {
        ...MOCK_USER,
        email: data.email,
        full_name: data.full_name,
        phone_number: data.phone_number,
        role: 'clinic',
        license_number: data.license_number,
        tin_number: data.tin_number,
        address: data.address,
      },
    };
    
    if (mockResponse.token) {
      localStorage.setItem('token', mockResponse.token);
      localStorage.setItem('refreshToken', mockResponse.refreshToken);
      localStorage.setItem('user', JSON.stringify(mockResponse.user));
    }
    
    return mockResponse;
  }

  async registerDiagnosticCenter(data: DiagnosticCenterRegisterData): Promise<LoginResponse> {
    console.log('Diagnostic center registration (bypassed):', data);
    
    const mockResponse: LoginResponse = {
      token: 'mock-jwt-token',
      refreshToken: 'mock-refresh-token',
      user: {
        ...MOCK_USER,
        email: data.email,
        full_name: data.full_name,
        phone_number: data.phone_number,
        role: 'diagnostic_center',
        license_number: data.license_number,
        tin_number: data.tin_number,
        address: data.address,
      },
    };
    
    if (mockResponse.token) {
      localStorage.setItem('token', mockResponse.token);
      localStorage.setItem('refreshToken', mockResponse.refreshToken);
      localStorage.setItem('user', JSON.stringify(mockResponse.user));
    }
    
    return mockResponse;
  }

  async registerStaff(data: StaffRegisterData): Promise<{ message: string; staff_id: number; email: string }> {
    console.log('Staff registration (bypassed):', data);
    
    return {
      message: 'Staff registered successfully',
      staff_id: Math.floor(Math.random() * 1000),
      email: data.email,
    };
  }

  async completeStaffRegistration(token: string, password: string, confirmPassword: string): Promise<LoginResponse> {
    console.log('Complete staff registration (bypassed):', { token, password, confirmPassword });
    
    const mockResponse: LoginResponse = {
      token: 'mock-jwt-token',
      refreshToken: 'mock-refresh-token',
      user: {
        ...MOCK_USER,
        role: 'staff',
      },
    };
    
    if (mockResponse.token) {
      localStorage.setItem('token', mockResponse.token);
      localStorage.setItem('refreshToken', mockResponse.refreshToken);
      localStorage.setItem('user', JSON.stringify(mockResponse.user));
    }
    
    return mockResponse;
  }

  async resendStaffInvitation(email: string): Promise<{ message: string }> {
    console.log('Resend staff invitation (bypassed):', email);
    return { message: 'Invitation resent successfully' };
  }

  // ===============================
  // PROFESSIONAL VERIFICATION
  // ===============================

  async submitProfessionalVerification(data: ProfessionalVerificationSubmitData): Promise<{ message: string }> {
    console.log('Submit professional verification (bypassed):', data);
    return { message: 'Verification submitted successfully' };
  }

  async getProfessionalVerificationStatus(): Promise<{ status: string; rejection_reason?: string }> {
    console.log('Get professional verification status (bypassed)');
    return { status: 'approved' };
  }

  // ===============================
  // EMAIL VERIFICATION
  // ===============================

  async verifyEmail(data: VerifyEmailData): Promise<{ message: string }> {
    console.log('Verify email (bypassed):', data);
    return { message: 'Email verified successfully' };
  }

  async resendVerificationCode(data: ResendVerificationData): Promise<{ message: string }> {
    console.log('Resend verification code (bypassed):', data);
    return { message: 'Verification code sent' };
  }

  // ===============================
  // PASSWORD MANAGEMENT
  // ===============================

  async forgotPassword(data: ForgotPasswordData): Promise<{ message: string }> {
    console.log('Forgot password (bypassed):', data);
    return { message: 'Password reset link sent to your email' };
  }

  async resetPassword(data: ResetPasswordData): Promise<{ message: string }> {
    console.log('Reset password (bypassed):', data);
    return { message: 'Password reset successfully' };
  }

  async changePassword(oldPassword: string, newPassword: string): Promise<{ message: string }> {
    console.log('Change password (bypassed):', { oldPassword, newPassword });
    return { message: 'Password changed successfully' };
  }

  // ===============================
  // TOKEN MANAGEMENT
  // ===============================

  async refreshToken(): Promise<RefreshTokenResponse> {
    console.log('Refresh token (bypassed)');
    return {
      token: 'mock-refreshed-jwt-token',
      refreshToken: 'mock-refreshed-refresh-token',
    };
  }

  // ===============================
  // USER PROFILE
  // ===============================

  async getCurrentUser(): Promise<AuthUser> {
    console.log('Get current user (bypassed)');
    const cachedUser = localStorage.getItem('user');
    if (cachedUser) {
      try {
        return JSON.parse(cachedUser);
      } catch (e) {
        // Invalid JSON, return mock user
      }
    }
    return MOCK_USER;
  }

  async updateProfile(data: Partial<AuthUser>): Promise<AuthUser> {
    console.log('Update profile (bypassed):', data);
    const currentUser = this.getCurrentUserSync() || MOCK_USER;
    const updatedUser = { ...currentUser, ...data };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    return updatedUser;
  }

  // ===============================
  // STAFF MANAGEMENT
  // ===============================

  async getStaffMembers(employerId: number, employerType: string): Promise<AuthUser[]> {
    console.log('Get staff members (bypassed):', { employerId, employerType });
    return [
      {
        ...MOCK_USER,
        id: 1,
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@example.com',
        role: 'staff',
        staff_sub_role: 'lab assistant',
      },
      {
        ...MOCK_USER,
        id: 2,
        first_name: 'Jane',
        last_name: 'Smith',
        email: 'jane.smith@example.com',
        role: 'staff',
        staff_sub_role: 'card_checker',
      },
    ];
  }

  async updateStaffRole(staffId: number, role: StaffSubRole): Promise<AuthUser> {
    console.log('Update staff role (bypassed):', { staffId, role });
    return {
      ...MOCK_USER,
      id: staffId,
      role: 'staff',
      staff_sub_role: role,
    };
  }

  async deactivateStaff(staffId: number): Promise<{ message: string }> {
    console.log('Deactivate staff (bypassed):', staffId);
    return { message: 'Staff deactivated successfully' };
  }

  async activateStaff(staffId: number): Promise<{ message: string }> {
    console.log('Activate staff (bypassed):', staffId);
    return { message: 'Staff activated successfully' };
  }

  async deleteStaff(staffId: number): Promise<{ message: string }> {
    console.log('Delete staff (bypassed):', staffId);
    return { message: 'Staff deleted successfully' };
  }

  // ===============================
  // HELPER METHODS
  // ===============================

  isAuthenticated(): boolean {
    // Always return true for development
    return true;
  }

  getToken(): string | null {
    return localStorage.getItem('token') || 'mock-jwt-token';
  }

  getRefreshToken(): string | null {
    return localStorage.getItem('refreshToken') || 'mock-refresh-token';
  }

  getCurrentUserSync(): AuthUser | null {
    const user = localStorage.getItem('user');
    if (user) {
      try {
        return JSON.parse(user);
      } catch (e) {
        return MOCK_USER;
      }
    }
    return MOCK_USER;
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
      // Return mock employer info for development
      return { id: 1, type: 'clinic' };
    }
    return {
      id: user.employer_id,
      type: user.employer_type
    };
  }

  shouldRedirectToProfessionalVerification(): boolean {
    // Always return false for development
    return false;
  }
}

export const authService = new AuthService();