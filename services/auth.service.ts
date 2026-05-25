// services/auth.service.ts
import axios from 'axios';
import { useAuthStore } from '@/stores/slices/authSlice';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export interface RegisterData {
  email: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  date_of_birth?: string;
  password: string;
  role: 'patient' | 'doctor' | 'clinic_admin' | 'diagnostic_admin';
}

export interface LoginData {
  email: string;
  password: string;
}

export interface VerifyEmailData {
  email: string;
  code: string;
  role?: string;
}

export interface ResendCodeData {
  email: string;
}

export interface ProfessionalRegistrationData {
  userId: number;
  role: string;
  license_number?: string;
  specialization?: string;
  qualifications?: string;
  years_of_experience?: number;
  consultation_fee?: number;
  bio?: string;
  location?: string;
  clinic_name?: string;
  clinic_address?: string;
  clinic_license_number?: string;
  clinic_tin_number?: string;
  operating_hours?: string;
  center_name?: string;
  center_address?: string;
  center_license_number?: string;
  center_tin_number?: string;
  center_accreditation?: string;
  services_description?: string;
  license_document?: File;
  degree_document?: File;
  clinic_registration_document?: File;
  center_registration_document?: File;
}

class AuthService {
  private getAuthHeader() {
    const token = useAuthStore.getState().accessToken;
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  async register(data: RegisterData): Promise<any> {
    try {
      const response = await axios.post(`${API_URL}/auth/register/`, data);
      return response.data;
    } catch (error: any) {
      throw error;
    }
  }

  async login(data: LoginData): Promise<any> {
    try {
      const response = await axios.post(`${API_URL}/auth/login/`, data);
      const { access, refresh, user } = response.data;
      
      localStorage.setItem('accessToken', access);
      localStorage.setItem('refreshToken', refresh);
      
      useAuthStore.getState().setAuth(user, access, refresh);
      
      return response.data;
    } catch (error: any) {
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        await axios.post(`${API_URL}/auth/logout/`, { refresh: refreshToken });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      useAuthStore.getState().clearAuth();
    }
  }

  async refreshToken(refreshToken: string): Promise<any> {
    try {
      const response = await axios.post(`${API_URL}/auth/refresh/`, { refresh: refreshToken });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async verifyEmail(data: VerifyEmailData): Promise<any> {
    try {
      const response = await axios.post(`${API_URL}/auth/verify-email/`, data);
      return response.data;
    } catch (error: any) {
      throw error;
    }
  }

  async resendVerificationCode(data: ResendCodeData): Promise<any> {
    try {
      const response = await axios.post(`${API_URL}/auth/resend-verification/`, data);
      return response.data;
    } catch (error: any) {
      throw error;
    }
  }

  async registerProfessional(formData: FormData): Promise<any> {
    try {
      const response = await axios.post(`${API_URL}/auth/professional-register/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error: any) {
      throw error;
    }
  }

  async getProfile(): Promise<any> {
    try {
      const response = await axios.get(`${API_URL}/auth/profile/`, {
        headers: this.getAuthHeader(),
      });
      return response.data;
    } catch (error: any) {
      throw error;
    }
  }

  async updateProfile(data: any): Promise<any> {
    try {
      const response = await axios.patch(`${API_URL}/auth/profile/`, data, {
        headers: this.getAuthHeader(),
      });
      return response.data;
    } catch (error: any) {
      throw error;
    }
  }

  async getVerificationStatus(): Promise<any> {
    try {
      const response = await axios.get(`${API_URL}/auth/verification-status/`, {
        headers: this.getAuthHeader(),
      });
      return response.data;
    } catch (error: any) {
      throw error;
    }
  }

  async changePassword(oldPassword: string, newPassword: string): Promise<any> {
    try {
      const response = await axios.post(
        `${API_URL}/auth/change-password/`,
        { old_password: oldPassword, new_password: newPassword },
        { headers: this.getAuthHeader() }
      );
      return response.data;
    } catch (error: any) {
      throw error;
    }
  }

  async requestPasswordReset(email: string): Promise<any> {
    try {
      const response = await axios.post(`${API_URL}/auth/password-reset/`, { email });
      return response.data;
    } catch (error: any) {
      throw error;
    }
  }

  async resetPassword(email: string, code: string, newPassword: string): Promise<any> {
    try {
      const response = await axios.post(`${API_URL}/auth/password-reset-confirm/`, {
        email,
        code,
        new_password: newPassword,
      });
      return response.data;
    } catch (error: any) {
      throw error;
    }
  }
}

export const authService = new AuthService();