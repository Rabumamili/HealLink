// services/staff.service.ts
import { ApiService } from './api.service'
import { StaffMember, StaffFilters } from '@/types/entities/staff.types'

class StaffService extends ApiService {
  async getStaff(filters?: StaffFilters): Promise<StaffMember[]> {
    let endpoint = '/staff'
    if (filters) {
      const params = new URLSearchParams()
      if (filters.searchTerm) params.append('search', filters.searchTerm)
      if (filters.role !== 'all') params.append('role', filters.role)
      if (params.toString()) endpoint += `?${params.toString()}`
    }
    return this.get<StaffMember[]>(endpoint)
  }

  async addStaff(data: Omit<StaffMember, 'id' | 'addedDate' | 'initials' | 'status'>): Promise<StaffMember> {
    return this.post<StaffMember>('/staff', data)
  }

  async updateStaff(id: number, data: Partial<StaffMember>): Promise<StaffMember> {
    return this.put<StaffMember>(`/staff/${id}`, data)
  }

  async deleteStaff(id: number): Promise<void> {
    return this.delete(`/staff/${id}`)
  }

  async resendInvitation(email: string): Promise<void> {
    return this.post('/staff/resend-invite', { email })
  }
}

export const staffService = new StaffService()