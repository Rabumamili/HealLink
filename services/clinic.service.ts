// services/clinic.service.ts
import { ApiService } from './api.service'
import { Clinic, ClinicStats } from '@/types/entities/clinic.types'

class ClinicService extends ApiService {
  async getClinicProfile(): Promise<Clinic> {
    return this.get<Clinic>('/clinic/profile')
  }

  async updateClinicProfile(data: Partial<Clinic>): Promise<Clinic> {
    return this.put<Clinic>('/clinic/profile', data)
  }

  async getClinicStats(): Promise<ClinicStats> {
    return this.get<ClinicStats>('/clinic/stats')
  }

  async uploadLogo(file: File): Promise<{ logoUrl: string }> {
    const formData = new FormData()
    formData.append('logo', file)
    const response = await fetch('/api/clinic/logo', {
      method: 'POST',
      body: formData,
    })
    return response.json()
  }

  async uploadCover(file: File): Promise<{ coverUrl: string }> {
    const formData = new FormData()
    formData.append('cover', file)
    const response = await fetch('/api/clinic/cover', {
      method: 'POST',
      body: formData,
    })
    return response.json()
  }
}

export const clinicService = new ClinicService()