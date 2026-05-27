// services/card.service.ts

import { ApiService } from './api.service';
import { 
  Card, 
  CardFilters, 
  CardStats, 
  CardValidationResult,
  CardCheckInRequest,
  CardCheckInResult,
  CardGenerationRequest,
  CardGenerationResult,
  CardWithAppointment
} from '@/types/entities/card.types';

// Mock data imports (only for development fallback)
import { 
  mockCards, 
  mockCardsWithAppointments, 
  mockCardStats,
  filterMockCards 
} from '@/services/mock/card.mock';

class CardService extends ApiService {
  // Get all cards with optional filters
  async getCards(filters?: CardFilters): Promise<Card[]> {
    try {
      const queryParams = new URLSearchParams();
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== 'all') {
            queryParams.append(key, value.toString());
          }
        });
      }
      const queryString = queryParams.toString();
      const endpoint = `/cards${queryString ? `?${queryString}` : ''}`;
      return await this.get<Card[]>(endpoint);
    } catch (error) {
      // Fallback to mock data in development
      if (process.env.NODE_ENV === 'development') {
        console.warn('Using mock data for getCards:', error);
        return filterMockCards(filters || {});
      }
      throw error;
    }
  }

  // Get card by ID
  async getCardById(id: number): Promise<CardWithAppointment | null> {
    try {
      return await this.get<CardWithAppointment>(`/cards/${id}`);
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('Using mock data for getCardById:', error);
        const card = mockCardsWithAppointments.find(c => c.id === id);
        return card || null;
      }
      throw error;
    }
  }

  // Get card by card number
  async getCardByNumber(cardNumber: string): Promise<CardWithAppointment | null> {
    try {
      return await this.get<CardWithAppointment>(`/cards/number/${encodeURIComponent(cardNumber)}`);
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('Using mock data for getCardByNumber:', error);
        const card = mockCardsWithAppointments.find(c => c.cardNumber === cardNumber);
        return card || null;
      }
      throw error;
    }
  }

  // In card.service.ts - Fix the error type mapping

async validateCard(cardNumber: string): Promise<CardValidationResult> {
  try {
    return await this.post<CardValidationResult>('/cards/validate', { cardNumber });
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('Using mock data for validateCard:', error);
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const card = mockCards.find(c => c.cardNumber === cardNumber);
      
      if (!card) {
        return {
          isValid: false,
          error: 'not_found',
          message: 'Card number not found in system'
        };
      }
      
      if (card.status === 'Expired') {
        return {
          isValid: false,
          card,
          error: 'expired',  
          message: 'Card has expired. Please contact reception for assistance.'
        };
      }
      
      if (card.status === 'Used') {
        return {
          isValid: false,
          card,
          error: 'already_used',  // FIXED: Added error property
          message: 'This card has already been used for check-in'
        };
      }
      
      return {
        isValid: true,
        card,
        message: 'Card is valid and ready for check-in'
      };
    }
    throw error;
  }
}

  // Check in patient using card
  async checkIn(request: CardCheckInRequest): Promise<CardCheckInResult> {
    try {
      return await this.post<CardCheckInResult>('/cards/check-in', request);
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('Using mock data for checkIn:', error);
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const card = mockCards.find(c => c.cardNumber === request.cardNumber);
        
        if (!card) {
          return {
            success: false,
            message: 'Card number not found'
          };
        }
        
        if (card.status !== 'Active') {
          return {
            success: false,
            message: card.status === 'Expired' 
              ? 'Card has expired. Please contact reception.' 
              : 'Card has already been used'
          };
        }
        
        const cardWithAppt = mockCardsWithAppointments.find(c => c.id === card.id);
        
        return {
          success: true,
          appointmentId: cardWithAppt?.appointment?.id,
          patientId: cardWithAppt?.appointment?.patientId,
          patientName: cardWithAppt?.appointment?.patientName,
          serviceName: cardWithAppt?.appointment?.serviceName,
          scheduledDateTime: cardWithAppt?.appointment?.scheduledDateTime,
          message: 'Successfully checked in'
        };
      }
      throw error;
    }
  }

  // Generate new card for appointment
  async generateCard(request: CardGenerationRequest): Promise<CardGenerationResult> {
    try {
      return await this.post<CardGenerationResult>('/cards/generate', request);
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('Using mock data for generateCard:', error);
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Simulate card generation
        const newCard: Card = {
          id: mockCards.length + 1,
          appointmentId: request.appointmentId,
          cardNumber: this.generateMockCardNumber(),
          cardNumberHash: `$2y$10$mock${Date.now()}`,
          status: 'Active',
          createdAt: new Date().toISOString(),
          expiresAt: new Date(Date.now() + (request.validityHours || 24) * 60 * 60 * 1000).toISOString(),
          usedAt: null
        };
        
        return {
          success: true,
          card: newCard,
          message: 'Card generated successfully'
        };
      }
      throw error;
    }
  }

  // Get card statistics
  async getCardStats(): Promise<CardStats> {
    try {
      return await this.get<CardStats>('/cards/stats');
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('Using mock data for getCardStats:', error);
        return mockCardStats;
      }
      throw error;
    }
  }

  // Get cards by appointment ID
  async getCardsByAppointment(appointmentId: number): Promise<Card[]> {
    return this.getCards({ appointmentId });
  }

  // Get cards by patient ID
  async getCardsByPatient(patientId: number): Promise<CardWithAppointment[]> {
    try {
      return await this.get<CardWithAppointment[]>(`/cards/patient/${patientId}`);
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('Using mock data for getCardsByPatient:', error);
        return mockCardsWithAppointments.filter(
          card => card.appointment?.patientId === patientId
        );
      }
      throw error;
    }
  }

  // Cancel/expire a card
  async expireCard(cardId: number): Promise<Card> {
    try {
      return await this.patch<Card>(`/cards/${cardId}/expire`, {});
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('Using mock data for expireCard:', error);
        const card = mockCards.find(c => c.id === cardId);
        if (card) {
          card.status = 'Expired';
        }
        return card!;
      }
      throw error;
    }
  }

  // Bulk generate cards for multiple appointments
  async bulkGenerateCards(requests: CardGenerationRequest[]): Promise<CardGenerationResult[]> {
    try {
      return await this.post<CardGenerationResult[]>('/cards/bulk-generate', { requests });
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('Using mock data for bulkGenerateCards:', error);
        const results = await Promise.all(requests.map(req => this.generateCard(req)));
        return results;
      }
      throw error;
    }
  }

  // Get cards expiring within a time window
  async getExpiringCards(hoursThreshold: number = 24): Promise<Card[]> {
    try {
      return await this.get<Card[]>(`/cards/expiring?hours=${hoursThreshold}`);
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('Using mock data for getExpiringCards:', error);
        const now = new Date();
        const threshold = new Date(now.getTime() + hoursThreshold * 60 * 60 * 1000);
        return mockCards.filter(card => {
          if (card.status !== 'Active') return false;
          const expiresAt = new Date(card.expiresAt);
          return expiresAt <= threshold && expiresAt > now;
        });
      }
      throw error;
    }
  }

  // Get today's card usage statistics
  async getTodayStats(): Promise<{ used: number; active: number; expired: number }> {
    try {
      return await this.get<{ used: number; active: number; expired: number }>('/cards/stats/today');
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('Using mock data for getTodayStats:', error);
        const today = new Date().toDateString();
        const used = mockCards.filter(c => 
          c.status === 'Used' && c.usedAt && new Date(c.usedAt).toDateString() === today
        ).length;
        const active = mockCards.filter(c => c.status === 'Active').length;
        const expired = mockCards.filter(c => c.status === 'Expired').length;
        return { used, active, expired };
      }
      throw error;
    }
  }

  // Helper method to generate mock card number (only for development)
  private generateMockCardNumber(): string {
    const groups = [];
    for (let i = 0; i < 4; i++) {
      groups.push(Math.floor(Math.random() * 10000).toString().padStart(4, '0'));
    }
    return groups.join('-');
  }
}

// Export singleton instance
export const cardService = new CardService();