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
  CardWithAppointment,
  CardStatus,
  CARD_STATUS
} from '@/types/entities/card.types';
import { CardRepository } from './mock/card.repository';

class CardService extends ApiService {
  private repository: CardRepository;

  constructor() {
    super();
    this.repository = CardRepository.getInstance();
  }

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
      if (process.env.NODE_ENV === 'development') {
        console.warn('Using repository fallback for getCards:', error);
        return this.repository.filterCards(filters || {});
      }
      throw error;
    }
  }

  async getCardById(id: number): Promise<CardWithAppointment | null> {
    try {
      return await this.get<CardWithAppointment>(`/cards/${id}`);
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('Using repository fallback for getCardById:', error);
        const card = this.repository.getCardWithAppointment(id);
        return card || null;
      }
      throw error;
    }
  }

  async getCardByNumber(cardNumber: string): Promise<CardWithAppointment | null> {
    try {
      return await this.get<CardWithAppointment>(`/cards/number/${encodeURIComponent(cardNumber)}`);
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('Using repository fallback for getCardByNumber:', error);
        const card: Card | undefined = this.repository.findByCardNumber(cardNumber);
        if (!card) return null;
        return this.repository.getCardWithAppointment(card.id) || null;
      }
      throw error;
    }
  }

  async validateCard(cardNumber: string): Promise<CardValidationResult> {
    try {
      return await this.post<CardValidationResult>('/cards/validate', { cardNumber });
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('Using repository fallback for validateCard:', error);
        await new Promise(resolve => setTimeout(resolve, 500));
        return this.repository.validateCard(cardNumber);
      }
      throw error;
    }
  }

  async checkIn(request: CardCheckInRequest): Promise<CardCheckInResult> {
    try {
      return await this.post<CardCheckInResult>('/cards/check-in', request);
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('Using repository fallback for checkIn:', error);
        await new Promise(resolve => setTimeout(resolve, 1000));
        return this.repository.checkInWithCard(
          request.cardNumber,
          request.verifiedByStaffId,
          request.verifiedByType
        );
      }
      throw error;
    }
  }

  async generateCard(request: CardGenerationRequest): Promise<CardGenerationResult> {
    try {
      return await this.post<CardGenerationResult>('/cards/generate', request);
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('Using repository fallback for generateCard:', error);
        await new Promise(resolve => setTimeout(resolve, 500));
        return this.repository.generateCard(request);
      }
      throw error;
    }
  }

  async getCardStats(): Promise<CardStats> {
    try {
      return await this.get<CardStats>('/cards/stats');
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('Using repository fallback for getCardStats:', error);
        return this.repository.getCardStats();
      }
      throw error;
    }
  }

  async getCardsByAppointment(appointmentId: number): Promise<Card[]> {
    try {
      return await this.getCards({ appointmentId });
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('Using repository fallback for getCardsByAppointment:', error);
        const card: Card | undefined = this.repository.findByAppointmentId(appointmentId);
        return card ? [card] : [];
      }
      throw error;
    }
  }

  async getPatientCards(patientId: number): Promise<CardWithAppointment[]> {
    try {
      return await this.get<CardWithAppointment[]>(`/cards/patient/${patientId}`);
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('Using repository fallback for getPatientCards:', error);
        const cards: CardWithAppointment[] = this.repository.findByPatientId(patientId);
        return cards;
      }
      throw error;
    }
  }

  async expireCard(cardId: number): Promise<Card> {
    try {
      return await this.patch<Card>(`/cards/${cardId}/expire`, {});
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('Using repository fallback for expireCard:', error);
        const expiredCard: Card | undefined = this.repository.revokeCard(cardId);
        if (!expiredCard) {
          throw new Error(`Card with ID ${cardId} not found`);
        }
        return expiredCard;
      }
      throw error;
    }
  }

  async bulkGenerateCards(requests: CardGenerationRequest[]): Promise<CardGenerationResult[]> {
    try {
      return await this.post<CardGenerationResult[]>('/cards/bulk-generate', { requests });
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('Using repository fallback for bulkGenerateCards:', error);
        return this.repository.bulkGenerateCards(requests);
      }
      throw error;
    }
  }

  async getExpiringCards(hoursThreshold: number = 24): Promise<Card[]> {
    try {
      return await this.get<Card[]>(`/cards/expiring?hours=${hoursThreshold}`);
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('Using repository fallback for getExpiringCards:', error);
        return this.repository.findCardsExpiringSoon(hoursThreshold);
      }
      throw error;
    }
  }

  async getTodayStats(): Promise<{ used: number; active: number; expired: number }> {
    try {
      return await this.get<{ used: number; active: number; expired: number }>('/cards/stats/today');
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('Using repository fallback for getTodayStats:', error);
        const today: string = new Date().toDateString();
        const cards: CardWithAppointment[] = this.repository.getAllCardsWithAppointments();
        const used: number = cards.filter((card: CardWithAppointment) => 
          card.status === CARD_STATUS.USED && card.usedAt && new Date(card.usedAt).toDateString() === today
        ).length;
        const active: number = this.repository.findActiveCards().length;
        const expired: number = this.repository.findExpiredCards().length;
        return { used, active, expired };
      }
      throw error;
    }
  }

  async getRecentCheckIns(limit: number = 10): Promise<{
    cardNumber: string;
    patientName: string;
    serviceName: string;
    checkInTime: string;
    appointmentTime: string;
  }[]> {
    try {
      return await this.get<{
        cardNumber: string;
        patientName: string;
        serviceName: string;
        checkInTime: string;
        appointmentTime: string;
      }[]>(`/cards/recent-checkins?limit=${limit}`);
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('Using repository fallback for getRecentCheckIns:', error);
        return this.repository.getRecentCheckIns(limit);
      }
      throw error;
    }
  }

  async getExpiringSoonCards(hoursThreshold: number = 2): Promise<{
    id: number;
    cardNumber: string;
    patientName: string;
    expiresAt: string;
    minutesUntilExpiry: number;
  }[]> {
    try {
      return await this.get<{
        id: number;
        cardNumber: string;
        patientName: string;
        expiresAt: string;
        minutesUntilExpiry: number;
      }[]>(`/cards/expiring-soon?hours=${hoursThreshold}`);
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('Using repository fallback for getExpiringSoonCards:', error);
        return this.repository.getExpiringSoonCards(hoursThreshold);
      }
      throw error;
    }
  }

  async getCardUsageStats(startDate: string, endDate: string): Promise<{
    totalUsed: number;
    averageTimeToUse: number | null;
    usageByHour: Record<number, number>;
  }> {
    try {
      return await this.get<{
        totalUsed: number;
        averageTimeToUse: number | null;
        usageByHour: Record<number, number>;
      }>(`/cards/usage-stats?startDate=${startDate}&endDate=${endDate}`);
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('Using repository fallback for getCardUsageStats:', error);
        return this.repository.getCardUsageStats(startDate, endDate);
      }
      throw error;
    }
  }

  async isCardValid(cardNumber: string): Promise<boolean> {
    try {
      const result: CardValidationResult = await this.validateCard(cardNumber);
      return result.isValid;
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('Using repository fallback for isCardValid:', error);
        return this.repository.isCardValidForCheckIn(cardNumber);
      }
      throw error;
    }
  }

  async updateCardStatus(cardId: number, status: CardStatus): Promise<Card> {
    try {
      return await this.patch<Card>(`/cards/${cardId}/status`, { status });
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('Using repository fallback for updateCardStatus:', error);
        const updatedCard: Card | undefined = this.repository.update(cardId, { status });
        if (!updatedCard) {
          throw new Error(`Card with ID ${cardId} not found`);
        }
        return updatedCard;
      }
      throw error;
    }
  }
}

export const cardService = new CardService();