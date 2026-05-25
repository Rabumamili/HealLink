// services/profile.service.ts
import { ApiService, API_BASE_URL } from './api.service';
import {
  PatientProfile,
  PatientProfileUpdate,
  DoctorProfile,
  DoctorProfileUpdate,
  ClinicProfile,
  ClinicProfileUpdate,
  DiagnosticCenterProfile,
  DiagnosticCenterProfileUpdate,
  StaffProfile,
  StaffProfileUpdate,
  ChangePasswordData,
  ChangePasswordResponse,
  ProfileUploadResponse,
  PatientStatistics,
  DoctorStatistics,
  ClinicStatistics,
  DiagnosticCenterStatistics
} from '@/types/entities/profile.types';
import { UserRole, AuthUser } from '@/types/entities/auth.types';

// Define response types for delete operations
interface DeleteResponse {
  message: string;
  success: boolean;
}

class ProfileService extends ApiService {
  private readonly baseUrl = '/profiles';

  // Helper to get auth headers
  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('token');
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  }

  // Helper to get form data headers (without Content-Type for multipart)
  private getFormDataHeaders(): HeadersInit {
    const token = localStorage.getItem('token');
    return {
      'Authorization': `Bearer ${token}`,
    };
  }

  // Generic profile fetch based on role
  async getProfileByRole(role: UserRole): Promise<PatientProfile | DoctorProfile | ClinicProfile | DiagnosticCenterProfile | StaffProfile> {
    const roleEndpoints: Record<UserRole, string> = {
      patient: `${this.baseUrl}/patient/me`,
      doctor: `${this.baseUrl}/doctor/me`,
      clinic: `${this.baseUrl}/clinic/me`,
      diagnostic_center: `${this.baseUrl}/diagnostic-center/me`,
      staff: `${this.baseUrl}/staff/me`,
    };

    const endpoint = roleEndpoints[role];
    if (!endpoint) throw new Error(`Invalid role: ${role}`);

    const response = await this.get<{ data: any }>(endpoint, this.getAuthHeaders());
    return response.data;
  }

  // Patient Profile
  async getPatientProfile(): Promise<PatientProfile> {
    const response = await this.get<{ data: PatientProfile }>(
      `${this.baseUrl}/patient/me`,
      this.getAuthHeaders()
    );
    return response.data;
  }

  async updatePatientProfile(data: PatientProfileUpdate): Promise<PatientProfile> {
    const response = await this.put<{ data: PatientProfile }>(
      `${this.baseUrl}/patient/me`,
      data,
      this.getAuthHeaders()
    );
    return response.data;
  }

  // Doctor Profile
  async getDoctorProfile(): Promise<DoctorProfile> {
    const response = await this.get<{ data: DoctorProfile }>(
      `${this.baseUrl}/doctor/me`,
      this.getAuthHeaders()
    );
    return response.data;
  }

  async updateDoctorProfile(data: DoctorProfileUpdate): Promise<DoctorProfile> {
    const response = await this.put<{ data: DoctorProfile }>(
      `${this.baseUrl}/doctor/me`,
      data,
      this.getAuthHeaders()
    );
    return response.data;
  }

  // Clinic Profile
  async getClinicProfile(): Promise<ClinicProfile> {
    const response = await this.get<{ data: ClinicProfile }>(
      `${this.baseUrl}/clinic/me`,
      this.getAuthHeaders()
    );
    return response.data;
  }

  async updateClinicProfile(data: ClinicProfileUpdate): Promise<ClinicProfile> {
    const response = await this.put<{ data: ClinicProfile }>(
      `${this.baseUrl}/clinic/me`,
      data,
      this.getAuthHeaders()
    );
    return response.data;
  }

  // Diagnostic Center Profile
  async getDiagnosticCenterProfile(): Promise<DiagnosticCenterProfile> {
    const response = await this.get<{ data: DiagnosticCenterProfile }>(
      `${this.baseUrl}/diagnostic-center/me`,
      this.getAuthHeaders()
    );
    return response.data;
  }

  async updateDiagnosticCenterProfile(data: DiagnosticCenterProfileUpdate): Promise<DiagnosticCenterProfile> {
    const response = await this.put<{ data: DiagnosticCenterProfile }>(
      `${this.baseUrl}/diagnostic-center/me`,
      data,
      this.getAuthHeaders()
    );
    return response.data;
  }

  // Staff Profile
  async getStaffProfile(): Promise<StaffProfile> {
    const response = await this.get<{ data: StaffProfile }>(
      `${this.baseUrl}/staff/me`,
      this.getAuthHeaders()
    );
    return response.data;
  }

  async updateStaffProfile(data: StaffProfileUpdate): Promise<StaffProfile> {
    const response = await this.put<{ data: StaffProfile }>(
      `${this.baseUrl}/staff/me`,
      data,
      this.getAuthHeaders()
    );
    return response.data;
  }

  // Profile Picture Upload
  async uploadProfilePicture(file: File): Promise<ProfileUploadResponse> {
    const formData = new FormData();
    formData.append('profile_photo', file);
    const response = await this.postFormData<ProfileUploadResponse>(
      `${this.baseUrl}/upload-photo`,
      formData,
      this.getFormDataHeaders()
    );
    return response;
  }

  async uploadCoverImage(file: File): Promise<ProfileUploadResponse> {
    const formData = new FormData();
    formData.append('cover_image', file);
    const response = await this.postFormData<ProfileUploadResponse>(
      `${this.baseUrl}/upload-cover`,
      formData,
      this.getFormDataHeaders()
    );
    return response;
  }

  async uploadLicenseDocument(file: File): Promise<ProfileUploadResponse> {
    const formData = new FormData();
    formData.append('license_document', file);
    const response = await this.postFormData<ProfileUploadResponse>(
      `${this.baseUrl}/upload-license`,
      formData,
      this.getFormDataHeaders()
    );
    return response;
  }

  async uploadRegistrationDocument(file: File): Promise<ProfileUploadResponse> {
    const formData = new FormData();
    formData.append('registration_document', file);
    const response = await this.postFormData<ProfileUploadResponse>(
      `${this.baseUrl}/upload-registration`,
      formData,
      this.getFormDataHeaders()
    );
    return response;
  }

  // Password Change
  async changePassword(data: ChangePasswordData): Promise<ChangePasswordResponse> {
    const response = await this.post<ChangePasswordResponse>(
      `${this.baseUrl}/change-password`,
      data,
      this.getAuthHeaders()
    );
    return response;
  }

  // Statistics
  async getPatientStatistics(): Promise<PatientStatistics> {
    const response = await this.get<{ data: PatientStatistics }>(
      `${this.baseUrl}/patient/statistics`,
      this.getAuthHeaders()
    );
    return response.data;
  }

  async getDoctorStatistics(): Promise<DoctorStatistics> {
    const response = await this.get<{ data: DoctorStatistics }>(
      `${this.baseUrl}/doctor/statistics`,
      this.getAuthHeaders()
    );
    return response.data;
  }

  async getClinicStatistics(): Promise<ClinicStatistics> {
    const response = await this.get<{ data: ClinicStatistics }>(
      `${this.baseUrl}/clinic/statistics`,
      this.getAuthHeaders()
    );
    return response.data;
  }

  async getDiagnosticCenterStatistics(): Promise<DiagnosticCenterStatistics> {
    const response = await this.get<{ data: DiagnosticCenterStatistics }>(
      `${this.baseUrl}/diagnostic-center/statistics`,
      this.getAuthHeaders()
    );
    return response.data;
  }

  // Delete Account - Fixed to return proper type
  async deleteAccount(): Promise<DeleteResponse> {
    const response = await this.delete<DeleteResponse>(`${this.baseUrl}/account`, this.getAuthHeaders());
    return response;
  }

  // Export Data
  async exportHealthData(): Promise<Blob> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}${this.baseUrl}/export-data`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error('Export failed');
    return response.blob();
  }

  // Medical history items for patients - Fixed to return proper type
  async addAllergy(allergy: string): Promise<PatientProfile> {
    const response = await this.post<{ data: PatientProfile }>(
      `${this.baseUrl}/patient/allergies`,
      { allergy },
      this.getAuthHeaders()
    );
    return response.data;
  }

  async removeAllergy(allergy: string): Promise<PatientProfile> {
    const response = await this.delete<{ data: PatientProfile }>(
      `${this.baseUrl}/patient/allergies/${encodeURIComponent(allergy)}`,
      this.getAuthHeaders()
    );
    return response.data;
  }

  async addChronicCondition(condition: string): Promise<PatientProfile> {
    const response = await this.post<{ data: PatientProfile }>(
      `${this.baseUrl}/patient/chronic-conditions`,
      { condition },
      this.getAuthHeaders()
    );
    return response.data;
  }

  async removeChronicCondition(condition: string): Promise<PatientProfile> {
    const response = await this.delete<{ data: PatientProfile }>(
      `${this.baseUrl}/patient/chronic-conditions/${encodeURIComponent(condition)}`,
      this.getAuthHeaders()
    );
    return response.data;
  }

  async addMedication(medication: string): Promise<PatientProfile> {
    const response = await this.post<{ data: PatientProfile }>(
      `${this.baseUrl}/patient/medications`,
      { medication },
      this.getAuthHeaders()
    );
    return response.data;
  }

  async removeMedication(medication: string): Promise<PatientProfile> {
    const response = await this.delete<{ data: PatientProfile }>(
      `${this.baseUrl}/patient/medications/${encodeURIComponent(medication)}`,
      this.getAuthHeaders()
    );
    return response.data;
  }

  // Helper method to get full name from profile
  getProfileDisplayName(profile: PatientProfile | DoctorProfile | ClinicProfile | DiagnosticCenterProfile): string {
    if ('first_name' in profile && profile.first_name) {
      const lastName = 'last_name' in profile ? (profile as any).last_name : '';
      return `${profile.first_name} ${lastName || ''}`.trim();
    }
    if ('name' in profile && profile.name) {
      return profile.name;
    }
    if ('full_name' in profile && (profile as any).full_name) {
      return (profile as any).full_name;
    }
    return 'User';
  }

  // Helper to check if profile is an individual (has first_name)
  isIndividualProfile(profile: any): profile is PatientProfile | DoctorProfile {
    return profile && 'first_name' in profile && profile.first_name !== undefined;
  }

  // Helper to check if profile is an organization (has name)
  isOrganizationProfile(profile: any): profile is ClinicProfile | DiagnosticCenterProfile {
    return profile && 'name' in profile && profile.name !== undefined;
  }
}

export const profileService = new ProfileService();