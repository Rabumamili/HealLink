// services/auth.service.ts
import { ApiService } from './api.service';
import { notImplemented } from '@/lib/api-error';
import { BackendProvider } from '@/types/entities/provider.types';
import {
  LoginCredentials,
  LoginResponse,
  UserRegisterData,
  DoctorRegisterData,
  ClinicRegisterData,
  DiagnosticCenterRegisterData,
  ProviderType,
  UserRole,
  VerifyEmailData,
  ResendVerificationData,
  ForgotPasswordData,
  ResetPasswordData,
  RefreshTokenResponse,
  AuthUser,
  VerificationStatus,
  StaffRegisterData,
  StaffSubRole,
  ProfessionalVerificationSubmitData,
  ProfessionalVerificationStatus,
  BackendPatient,
  BackendAuthenticatedUser,
  BackendPatientRegisterRequest,
  BackendProviderRegisterPayload,
  BackendTokenResponse,
} from '@/types/entities/auth.types';

function buildFullName(firstName?: string | null, lastName?: string | null, fallback = ''): string {
  const fullName = [firstName, lastName].filter(Boolean).join(' ').trim();
  return fullName || fallback;
}

function mapPatientToAuthUser(patient: BackendPatient): AuthUser {
  const first_name = patient.first_name ?? undefined;
  const last_name = patient.last_name ?? undefined;

  return {
    id: patient.id,
    email: patient.email,
    phone_number: patient.phone_number ?? '',
    role: 'patient',
    is_active: patient.is_active,
    is_verified: patient.is_verified,
    verification_status: patient.verification_status,
    created_at: patient.created_at,
    updated_at: patient.updated_at ?? undefined,
    first_name,
    last_name,
    full_name: buildFullName(first_name, last_name, patient.email),
    date_of_birth: patient.date_of_birth ?? undefined,
    gender: patient.gender ?? undefined,
  };
}

function mapProviderTypeToRole(providerType: string): UserRole {
  const normalized = providerType.toLowerCase().replace(/-/g, '_');

  if (normalized === 'doctor') return 'doctor';
  if (normalized === 'clinic') return 'clinic';
  if (normalized === 'diagnostic_center' || normalized === 'diagnostic') {
    return 'diagnostic_center';
  }

  return 'doctor';
}

function mapProviderToAuthUser(provider: BackendProvider): AuthUser {
  const role = mapProviderTypeToRole(provider.provider_type);

  const user: AuthUser = {
    id: provider.id,
    email: provider.email,
    phone_number: provider.phone ?? '',
    role,
    created_at: provider.created_at,
    full_name: provider.name,
    provider_id: provider.id,
    provider_type: role as ProviderType,
    specialization: provider.specialization ?? undefined,
    license_number: provider.license_number ?? undefined,
    tin_number: provider.tin_number ?? undefined,
    location: provider.location,
    address: provider.address ?? undefined,
    description: provider.description ?? undefined,
    license_document: provider.license_document ?? undefined,
  };

  if (provider.is_active !== undefined) {
    user.is_active = provider.is_active;
  }

  if (provider.is_verified !== undefined) {
    user.is_verified = provider.is_verified;
  }

  if (provider.verification_status !== undefined) {
    user.verification_status = provider.verification_status as VerificationStatus;
    user.professional_verification_status = normalizeProviderVerificationStatus(provider.verification_status);
  }

  return user;
}

function buildRegisterPayload(data: UserRegisterData): BackendPatientRegisterRequest {
  const payload: BackendPatientRegisterRequest = {
    email: data.email,
    password: data.password,
    role: 'patient',
    first_name: data.first_name,
    last_name: data.last_name,
    phone_number: data.phone_number,
  };

  if (data.date_of_birth) payload.date_of_birth = data.date_of_birth;
  if (data.gender) payload.gender = data.gender;

  return payload;
}

function normalizeProviderVerificationStatus(status?: string): ProfessionalVerificationStatus {
  if (status === 'approved' || status === 'verified') return 'approved';
  if (status === 'rejected') return 'rejected';
  return 'submitted';
}

function mapAuthenticatedUser(user: BackendAuthenticatedUser): AuthUser {
  if (user.provider_type) {
    const role = mapProviderTypeToRole(user.provider_type);
    const professional_verification_status = normalizeProviderVerificationStatus(user.verification_status);

    return {
      id: user.id,
      email: user.email,
      phone_number: user.phone_number ?? '',
      role,
      is_active: user.is_active,
      is_verified: user.is_verified,
      verification_status: user.verification_status,
      professional_verification_status,
      created_at: user.created_at,
      updated_at: user.updated_at ?? undefined,
      full_name: buildFullName(user.first_name, user.last_name, user.email),
      first_name: user.first_name ?? undefined,
      last_name: user.last_name ?? undefined,
      provider_id: user.id,
      provider_type: role as ProviderType,
      specialization: user.specialization ?? undefined,
      license_number: user.license_number ?? undefined,
      tin_number: user.tin_number ?? undefined,
      location: user.location,
      address: user.address ?? undefined,
      description: user.description ?? undefined,
    };
  }

  return mapPatientToAuthUser(user);
}

function persistAuthSession(response: BackendTokenResponse): LoginResponse {
  const user = mapAuthenticatedUser(response.patient);

  localStorage.setItem('token', response.access_token);
  localStorage.setItem('refreshToken', response.refresh_token);
  localStorage.setItem('user', JSON.stringify(user));

  return {
    token: response.access_token,
    refreshToken: response.refresh_token,
    user,
  };
}

function persistUserWithoutSession(user: AuthUser): LoginResponse {
  localStorage.removeItem('token');
  localStorage.removeItem('refreshToken');
  localStorage.setItem('user', JSON.stringify(user));

  return {
    token: '',
    refreshToken: '',
    user,
  };
}

class AuthService extends ApiService {
  private readonly basePath = '/auth';

  // ===============================
  // AUTHENTICATION (live API)
  // ===============================

  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const response = await this.post<BackendTokenResponse>(
      `${this.basePath}/login`,
      {
        email: credentials.email,
        password: credentials.password,
      },
      undefined,
      false
    );

    return persistAuthSession(response);
  }

  async logout(): Promise<void> {
    const refreshToken = this.getRefreshToken();

    try {
      if (refreshToken) {
        await this.post(
          `${this.basePath}/logout`,
          { refresh_token: refreshToken },
          undefined,
          false
        );
      }
    } catch (error) {
      console.error('Logout request failed:', error);
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
    const response = await this.post<BackendTokenResponse>(
      `${this.basePath}/register`,
      buildRegisterPayload(data),
      undefined,
      false
    );

    // Store tokens so user can verify email (API requires authentication)
    return persistAuthSession(response);
  }

  async registerDoctor(data: DoctorRegisterData): Promise<LoginResponse> {
    const user = await this.registerProvider({
      provider_type: 'doctor',
      email: data.email,
      password: data.password,
      name: data.full_name,
      phone_number: data.phone_number,
      specialization: data.specialization,
      license_number: data.license_number,
      location: data.location,
      license_file: data.license_document,
    });

    // Don't try to login immediately - providers need to verify email first
    return persistUserWithoutSession(user);
  }

  async registerClinic(data: ClinicRegisterData): Promise<LoginResponse> {
    const user = await this.registerProvider({
      provider_type: 'clinic',
      email: data.email,
      password: data.password,
      name: data.full_name,
      phone_number: data.phone_number,
      address: data.address,
      license_number: data.license_number,
      tin_number: data.tin_number,
      license_file: data.license_document,
    });

    // Don't try to login immediately - providers need to verify email first
    return persistUserWithoutSession(user);
  }

  async registerDiagnosticCenter(data: DiagnosticCenterRegisterData): Promise<LoginResponse> {
    const user = await this.registerProvider({
      provider_type: 'diagnostic_center',
      email: data.email,
      password: data.password,
      name: data.full_name,
      phone_number: data.phone_number,
      address: data.address,
      license_number: data.license_number,
      tin_number: data.tin_number,
      description: data.description,
      license_file: data.license_document,
    });

    // Don't try to login immediately - providers need to verify email first
    return persistUserWithoutSession(user);
  }

  private async registerProvider(payload: BackendProviderRegisterPayload): Promise<AuthUser> {
    const formData = new FormData();
    formData.append('provider_type', payload.provider_type);
    formData.append('email', payload.email);
    formData.append('license_file', payload.license_file);

    if (payload.password) formData.append('password', payload.password);
    if (payload.name) formData.append('name', payload.name);
    if (payload.phone_number) formData.append('phone', payload.phone_number);
    if (payload.location) formData.append('location', payload.location);
    if (payload.address) formData.append('address', payload.address);
    if (payload.specialization) formData.append('specialization', payload.specialization);
    if (payload.license_number) formData.append('license_number', payload.license_number);
    if (payload.tin_number) formData.append('tin_number', payload.tin_number);
    if (payload.description) formData.append('description', payload.description);

    const provider = await this.postFormData<BackendProvider>('/providers', formData, undefined);
    return mapProviderToAuthUser(provider);
  }

  private async tryProviderLogin(
    email: string,
    password: string,
    registeredUser: AuthUser
  ): Promise<LoginResponse> {
    try {
      const session = await this.login({ email, password });
      return {
        ...session,
        user: {
          ...registeredUser,
          ...session.user,
          role: registeredUser.role,
          provider_id: registeredUser.provider_id,
          provider_type: registeredUser.provider_type,
          professional_verification_status: registeredUser.professional_verification_status,
        },
      };
    } catch {
      return persistUserWithoutSession(registeredUser);
    }
  }

  // ===============================
  // PROFESSIONAL VERIFICATION
  // ===============================

  async submitProfessionalVerification(_data: ProfessionalVerificationSubmitData): Promise<{ message: string }> {
    notImplemented('Professional verification submission');
  }

  async getProfessionalVerificationStatus(): Promise<{ status: string; rejection_reason?: string }> {
    notImplemented('Professional verification status');
  }

  // ===============================
  // EMAIL VERIFICATION
  // ===============================

  async verifyEmail(data: VerifyEmailData): Promise<{ message: string }> {
    const isProvider = data.role === 'doctor' || data.role === 'clinic' || data.role === 'diagnostic_center';
    const endpoint = isProvider ? '/providers/verify-email' : '/verify-email';
    
    const response = await this.post<{ message: string }>(
      `${this.basePath}${endpoint}`,
      { token: data.code },
      undefined,
      false
    );
    return response;
  }

  async resendVerificationCode(data: ResendVerificationData): Promise<{ message: string }> {
    const response = await this.post<{ message: string }>(
      `${this.basePath}/resend-verification`,
      { email: data.email },
      undefined,
      false
    );
    return response;
  }

  // ===============================
  // PASSWORD MANAGEMENT
  // ===============================

  async forgotPassword(data: ForgotPasswordData): Promise<{ message: string }> {
    const response = await this.post<{ message: string }>(
      `${this.basePath}/forgot-password`,
      { email: data.email },
      undefined,
      false
    );
    return response;
  }

  async resetPassword(data: ResetPasswordData): Promise<{ message: string }> {
    const response = await this.post<{ message: string }>(
      `${this.basePath}/reset-password`,
      { token: data.token, new_password: data.password },
      undefined,
      false
    );
    return response;
  }

  async changePassword(_oldPassword: string, _newPassword: string): Promise<{ message: string }> {
    notImplemented('Password change');
  }

  // ===============================
  // STAFF REGISTRATION & MANAGEMENT
  // ===============================

  async registerStaff(_data: StaffRegisterData): Promise<{ message: string; staff_id: number; email: string }> {
    notImplemented('Staff registration');
  }

  async completeStaffRegistration(
    _token: string,
    _password: string,
    _confirmPassword: string
  ): Promise<{ user: AuthUser }> {
    notImplemented('Staff registration completion');
  }

  async resendStaffInvitation(_email: string): Promise<{ message: string }> {
    notImplemented('Staff invitation resend');
  }

  async getStaffMembers(_employerId: number, _employerType: string): Promise<AuthUser[]> {
    notImplemented('Staff members list');
  }

  async updateStaffRole(_staffId: number, _role: StaffSubRole): Promise<AuthUser> {
    notImplemented('Staff role update');
  }

  async deactivateStaff(_staffId: number): Promise<{ message: string }> {
    notImplemented('Staff deactivation');
  }

  async activateStaff(_staffId: number): Promise<{ message: string }> {
    notImplemented('Staff activation');
  }

  async deleteStaff(_staffId: number): Promise<{ message: string }> {
    notImplemented('Staff deletion');
  }

  // ===============================
  // TOKEN MANAGEMENT (live API)
  // ===============================

  async refreshToken(): Promise<RefreshTokenResponse> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await this.post<BackendTokenResponse>(
      `${this.basePath}/refresh`,
      { refresh_token: refreshToken },
      undefined,
      false
    );

    const session = persistAuthSession(response);
    return {
      token: session.token,
      refreshToken: session.refreshToken,
    };
  }

  // ===============================
  // USER PROFILE
  // ===============================

  async getCurrentUser(): Promise<AuthUser> {
    if (!this.isAuthenticated()) {
      throw new Error('Not authenticated');
    }

    const cachedUser = this.getCurrentUserSync();
    if (cachedUser && cachedUser.role !== 'patient') {
      return cachedUser;
    }

    const patient = await this.get<BackendPatient>('/patients/me');
    const user = mapPatientToAuthUser(patient);
    localStorage.setItem('user', JSON.stringify(user));
    return user;
  }

  async updateProfile(data: Partial<AuthUser>): Promise<AuthUser> {
    if (!this.isAuthenticated()) {
      throw new Error('Not authenticated');
    }

    const user = this.getCurrentUserSync();
    if (!user) {
      throw new Error('No user found');
    }

    // Build update payload based on user role
    if (user.role === 'patient') {
      const payload: any = {};
      if (data.email) payload.email = data.email;
      if (data.first_name) payload.first_name = data.first_name;
      if (data.last_name) payload.last_name = data.last_name;
      if (data.phone_number) payload.phone_number = data.phone_number;
      if (data.date_of_birth) payload.date_of_birth = data.date_of_birth;
      if (data.gender) payload.gender = data.gender;

      const updatedPatient = await this.patch<BackendPatient>('/patients/me', payload, undefined);
      const updatedUser = mapPatientToAuthUser(updatedPatient);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      return updatedUser;
    } else {
      // Provider profile update would go here
      notImplemented('Provider profile update');
    }
  }

  async deleteAccount(): Promise<void> {
    if (!this.isAuthenticated()) {
      throw new Error('Not authenticated');
    }

    const user = this.getCurrentUserSync();
    if (!user) {
      throw new Error('No user found');
    }

    if (user.role === 'patient') {
      await this.delete('/patients/me', undefined);
    } else {
      notImplemented('Provider account deletion');
    }

    // Clear local storage after successful deletion
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
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
    if (!user) return null;

    try {
      return JSON.parse(user) as AuthUser;
    } catch {
      return null;
    }
  }

  hasRole(role: UserRole | UserRole[]): boolean {
    const user = this.getCurrentUserSync();
    if (!user) return false;

    if (Array.isArray(role)) {
      return role.includes(user.role);
    }
    return user.role === role;
  }

  shouldRedirectToProfessionalVerification(): boolean {
    const user = this.getCurrentUserSync();
    if (!user) return false;

    if (user.role === 'doctor' || user.role === 'clinic' || user.role === 'diagnostic_center') {
      return user.professional_verification_status !== 'approved';
    }

    return false;
  }
}

export const authService = new AuthService();
