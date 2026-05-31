// services/profile.service.ts
import axios from 'axios';
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
  ProfileResponse,
  ProfileUploadResponse,
  ChangePasswordData,
  ChangePasswordResponse,
  PatientStatistics,
  DoctorStatistics,
  ClinicStatistics,
  DiagnosticCenterStatistics,
  StaffStatistics,
  Profile
} from '@/types/entities/profile.types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

// Define allowed role types for API endpoints
export type ProfileRoleType = 'patient' | 'doctor' | 'clinic' | 'diagnostic_center' | 'staff';
export type ProviderRoleType = 'doctor' | 'clinic' | 'diagnostic_center';

class ProfileService {
  private baseUrl = `${API_BASE_URL}/profiles`;

  // ===============================
  // GENERAL PROFILE METHODS
  // ===============================

  async getMyProfile(): Promise<ProfileResponse<Profile>> {
    const response = await axios.get(`${this.baseUrl}/me`);
    return response.data;
  }

  async getProfileById(userId: number, role: ProfileRoleType): Promise<ProfileResponse<Profile>> {
    const response = await axios.get(`${this.baseUrl}/${role}/${userId}`);
    return response.data;
  }

  // ===============================
  // PATIENT PROFILE METHODS
  // ===============================

  async getPatientProfile(userId: number): Promise<ProfileResponse<PatientProfile>> {
    const response = await axios.get(`${this.baseUrl}/patient/${userId}`);
    return response.data;
  }

  async updatePatientProfile(
    userId: number,
    data: PatientProfileUpdate
  ): Promise<ProfileResponse<PatientProfile>> {
    const response = await axios.patch(`${this.baseUrl}/patient/${userId}`, data);
    return response.data;
  }

  async getPatientStatistics(userId: number): Promise<ProfileResponse<PatientStatistics>> {
    const response = await axios.get(`${this.baseUrl}/patient/${userId}/statistics`);
    return response.data;
  }

  // ===============================
  // DOCTOR PROFILE METHODS
  // ===============================

  async getDoctorProfile(userId: number): Promise<ProfileResponse<DoctorProfile>> {
    const response = await axios.get(`${this.baseUrl}/doctor/${userId}`);
    return response.data;
  }

  async updateDoctorProfile(
    userId: number,
    data: DoctorProfileUpdate
  ): Promise<ProfileResponse<DoctorProfile>> {
    const response = await axios.patch(`${this.baseUrl}/doctor/${userId}`, data);
    return response.data;
  }

  async getDoctorStatistics(userId: number): Promise<ProfileResponse<DoctorStatistics>> {
    const response = await axios.get(`${this.baseUrl}/doctor/${userId}/statistics`);
    return response.data;
  }

  async getAllDoctors(params?: {
    specialization?: string;
    is_active?: boolean;
    verification_status?: string;
  }): Promise<ProfileResponse<DoctorProfile[]>> {
    const response = await axios.get(`${this.baseUrl}/doctors`, { params });
    return response.data;
  }

  // ===============================
  // CLINIC PROFILE METHODS
  // ===============================

  async getClinicProfile(userId: number): Promise<ProfileResponse<ClinicProfile>> {
    const response = await axios.get(`${this.baseUrl}/clinic/${userId}`);
    return response.data;
  }

  async updateClinicProfile(
    userId: number,
    data: ClinicProfileUpdate
  ): Promise<ProfileResponse<ClinicProfile>> {
    const response = await axios.patch(`${this.baseUrl}/clinic/${userId}`, data);
    return response.data;
  }

  async getClinicStatistics(userId: number): Promise<ProfileResponse<ClinicStatistics>> {
    const response = await axios.get(`${this.baseUrl}/clinic/${userId}/statistics`);
    return response.data;
  }

  async getAllClinics(params?: {
    location?: string;
    is_active?: boolean;
    verification_status?: string;
  }): Promise<ProfileResponse<ClinicProfile[]>> {
    const response = await axios.get(`${this.baseUrl}/clinics`, { params });
    return response.data;
  }

  // ===============================
  // DIAGNOSTIC CENTER PROFILE METHODS
  // ===============================

  async getDiagnosticCenterProfile(userId: number): Promise<ProfileResponse<DiagnosticCenterProfile>> {
    const response = await axios.get(`${this.baseUrl}/diagnostic-center/${userId}`);
    return response.data;
  }

  async updateDiagnosticCenterProfile(
    userId: number,
    data: DiagnosticCenterProfileUpdate
  ): Promise<ProfileResponse<DiagnosticCenterProfile>> {
    const response = await axios.patch(`${this.baseUrl}/diagnostic-center/${userId}`, data);
    return response.data;
  }

  async getDiagnosticCenterStatistics(
    userId: number
  ): Promise<ProfileResponse<DiagnosticCenterStatistics>> {
    const response = await axios.get(`${this.baseUrl}/diagnostic-center/${userId}/statistics`);
    return response.data;
  }

  async getAllDiagnosticCenters(params?: {
    location?: string;
    is_active?: boolean;
    verification_status?: string;
  }): Promise<ProfileResponse<DiagnosticCenterProfile[]>> {
    const response = await axios.get(`${this.baseUrl}/diagnostic-centers`, { params });
    return response.data;
  }

  // ===============================
  // STAFF PROFILE METHODS
  // ===============================

  async getStaffProfile(userId: number): Promise<ProfileResponse<StaffProfile>> {
    const response = await axios.get(`${this.baseUrl}/staff/${userId}`);
    return response.data;
  }

  async updateStaffProfile(
    userId: number,
    data: StaffProfileUpdate
  ): Promise<ProfileResponse<StaffProfile>> {
    const response = await axios.patch(`${this.baseUrl}/staff/${userId}`, data);
    return response.data;
  }

  async getStaffStatistics(userId: number): Promise<ProfileResponse<StaffStatistics>> {
    const response = await axios.get(`${this.baseUrl}/staff/${userId}/statistics`);
    return response.data;
  }

  async getStaffByEmployer(
    employerId: number,
    employerType: string
  ): Promise<ProfileResponse<StaffProfile[]>> {
    const response = await axios.get(`${this.baseUrl}/staff/employer/${employerId}`, {
      params: { employer_type: employerType }
    });
    return response.data;
  }

  // ===============================
  // PROFILE PHOTO METHODS
  // ===============================

  async uploadProfilePhoto(
    userId: number,
    role: ProfileRoleType,
    file: File
  ): Promise<ProfileUploadResponse> {
    const formData = new FormData();
    formData.append('photo', file);
    
    const response = await axios.post(
      `${this.baseUrl}/${role}/${userId}/upload-photo`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  }

  async deleteProfilePhoto(
    userId: number,
    role: ProfileRoleType
  ): Promise<ProfileResponse<null>> {
    const response = await axios.delete(`${this.baseUrl}/${role}/${userId}/photo`);
    return response.data;
  }

  // ===============================
  // DOCUMENT METHODS
  // ===============================

  async uploadLicenseDocument(
    userId: number,
    role: ProviderRoleType,
    file: File
  ): Promise<ProfileUploadResponse> {
    const formData = new FormData();
    formData.append('document', file);
    
    const response = await axios.post(
      `${this.baseUrl}/${role}/${userId}/upload-license`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  }

  async uploadRegistrationDocument(
    userId: number,
    role: 'clinic' | 'diagnostic_center',
    file: File
  ): Promise<ProfileUploadResponse> {
    const formData = new FormData();
    formData.append('document', file);
    
    const response = await axios.post(
      `${this.baseUrl}/${role}/${userId}/upload-registration`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  }

  // ===============================
  // PASSWORD METHODS
  // ===============================

  async changePassword(data: ChangePasswordData): Promise<ChangePasswordResponse> {
    const response = await axios.post(`${this.baseUrl}/change-password`, data);
    return response.data;
  }

  // ===============================
  // VERIFICATION METHODS
  // ===============================

  async requestVerification(
    userId: number,
    role: ProfileRoleType
  ): Promise<ProfileResponse<null>> {
    const response = await axios.post(`${this.baseUrl}/${role}/${userId}/request-verification`);
    return response.data;
  }

  async getVerificationStatus(
    userId: number,
    role: ProfileRoleType
  ): Promise<ProfileResponse<any>> {
    const response = await axios.get(`${this.baseUrl}/${role}/${userId}/verification-status`);
    return response.data;
  }

  // ===============================
  // ACCOUNT MANAGEMENT
  // ===============================

  async deleteAccount(userId: number, role: ProfileRoleType): Promise<ProfileResponse<null>> {
    const response = await axios.delete(`${this.baseUrl}/${role}/${userId}`);
    return response.data;
  }
}

export const profileService = new ProfileService();