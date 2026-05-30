// repositories/card.repository.ts
import { BaseRepository } from './base.repository';
import { 
  Card, 
  CardStatus, 
  CardWithAppointment, 
  CardFilters, 
  CardStats, 
  CardValidationResult, 
  CardGenerationRequest, 
  CardCheckInResult, 
  CardGenerationResult 
} from '@/types/entities/card.types';

// Mock appointment data for enrichment
interface AppointmentReference {
  id: number;
  patientId: number;
  patientName: string;
  scheduledDateTime: string;
  serviceName: string;
  providerType: 'doctor' | 'clinic' | 'diagnostic_center';
  providerName: string;
}

const mockAppointmentsForCards: Record<number, AppointmentReference> = {
  101: { id: 101, patientId: 201, patientName: 'John Smith', scheduledDateTime: '2026-01-27T10:00:00Z', serviceName: 'Dental Cleaning', providerType: 'clinic', providerName: 'Hayat General Clinic' },
  102: { id: 102, patientId: 202, patientName: 'Sarah Johnson', scheduledDateTime: '2026-01-27T09:30:00Z', serviceName: 'Root Canal', providerType: 'clinic', providerName: 'Hayat General Clinic' },
  103: { id: 103, patientId: 203, patientName: 'Michael Brown', scheduledDateTime: '2026-01-25T15:00:00Z', serviceName: 'X-Ray', providerType: 'diagnostic_center', providerName: 'Ethio Diagnostic Center' },
  104: { id: 104, patientId: 204, patientName: 'Emily Davis', scheduledDateTime: '2026-01-27T14:00:00Z', serviceName: 'Consultation', providerType: 'doctor', providerName: 'Dr. Robsan Chimdi' },
  105: { id: 105, patientId: 205, patientName: 'David Wilson', scheduledDateTime: '2026-01-26T13:00:00Z', serviceName: 'Vaccination', providerType: 'clinic', providerName: 'Bole Medical Center' },
  106: { id: 106, patientId: 206, patientName: 'Lisa Anderson', scheduledDateTime: '2026-01-24T17:00:00Z', serviceName: 'Follow-up', providerType: 'doctor', providerName: 'Dr. Robera Shimelis' },
  107: { id: 107, patientId: 207, patientName: 'Robert Taylor', scheduledDateTime: '2026-01-27T08:00:00Z', serviceName: 'Emergency Procedure', providerType: 'clinic', providerName: 'St. Paul Clinic' },
  108: { id: 108, patientId: 208, patientName: 'Jennifer Martinez', scheduledDateTime: '2026-01-26T10:00:00Z', serviceName: 'Dental Filling', providerType: 'clinic', providerName: 'Hayat General Clinic' }
};

export class CardRepository extends BaseRepository<Card> {
  private static instance: CardRepository;
  
  private constructor() {
    super();
    this.initializeMockData();
  }

  static getInstance(): CardRepository {
    if (!CardRepository.instance) {
      CardRepository.instance = new CardRepository();
    }
    return CardRepository.instance;
  }

  private initializeMockData(): void {
    this.items = [
      {
        id: 1,
        appointmentId: 101,
        cardNumber: '4512-7893-1023-6745',
        status: 'Active',
        createdAt: '2026-01-27T09:00:00Z',
        expiresAt: '2026-01-28T09:00:00Z',
        usedAt: null,
        updatedAt: '2026-01-27T09:00:00Z'
      },
      {
        id: 2,
        appointmentId: 102,
        cardNumber: '5234-8910-2345-7861',
        status: 'Used',
        createdAt: '2026-01-27T08:30:00Z',
        expiresAt: '2026-01-28T08:30:00Z',
        usedAt: '2026-01-27T10:15:00Z',
        updatedAt: '2026-01-27T10:15:00Z'
      },
      {
        id: 3,
        appointmentId: 103,
        cardNumber: '6789-0123-4567-8901',
        status: 'Expired',
        createdAt: '2026-01-25T14:00:00Z',
        expiresAt: '2026-01-26T14:00:00Z',
        usedAt: null,
        updatedAt: '2026-01-26T14:00:00Z'
      },
      {
        id: 4,
        appointmentId: 104,
        cardNumber: '7890-1234-5678-9012',
        status: 'Active',
        createdAt: '2026-01-27T10:00:00Z',
        expiresAt: '2026-01-28T10:00:00Z',
        usedAt: null,
        updatedAt: '2026-01-27T10:00:00Z'
      },
      {
        id: 5,
        appointmentId: 105,
        cardNumber: '8901-2345-6789-0123',
        status: 'Used',
        createdAt: '2026-01-26T11:20:00Z',
        expiresAt: '2026-01-27T11:20:00Z',
        usedAt: '2026-01-26T13:45:00Z',
        updatedAt: '2026-01-26T13:45:00Z'
      },
      {
        id: 6,
        appointmentId: 106,
        cardNumber: '9012-3456-7890-1234',
        status: 'Expired',
        createdAt: '2026-01-24T16:30:00Z',
        expiresAt: '2026-01-25T16:30:00Z',
        usedAt: null,
        updatedAt: '2026-01-25T16:30:00Z'
      },
      {
        id: 7,
        appointmentId: 107,
        cardNumber: '3456-7890-1234-5678',
        status: 'Active',
        createdAt: '2026-01-27T07:45:00Z',
        expiresAt: '2026-01-28T07:45:00Z',
        usedAt: null,
        updatedAt: '2026-01-27T07:45:00Z'
      },
      {
        id: 8,
        appointmentId: 108,
        cardNumber: '4567-8901-2345-6789',
        status: 'Used',
        createdAt: '2026-01-26T09:15:00Z',
        expiresAt: '2026-01-27T09:15:00Z',
        usedAt: '2026-01-26T11:30:00Z',
        updatedAt: '2026-01-26T11:30:00Z'
      }
    ];
  }

  private generateCardNumber(): string {
    const groups = [];
    for (let i = 0; i < 4; i++) {
      groups.push(Math.floor(Math.random() * 10000).toString().padStart(4, '0'));
    }
    return groups.join('-');
  }

  create(data: Omit<Card, 'id' | 'createdAt' | 'updatedAt'>): Card {
    const newCard: Card = {
      id: Date.now(),
      appointmentId: data.appointmentId,
      cardNumber: data.cardNumber,
      status: data.status,
      createdAt: new Date().toISOString(),
      expiresAt: data.expiresAt,
      usedAt: data.usedAt || null,
      updatedAt: new Date().toISOString()
    };
    this.items.push(newCard);
    return newCard;
  }

  generateCard(request: CardGenerationRequest): CardGenerationResult {
    const existingCard = this.findByAppointmentId(request.appointmentId);
    if (existingCard) {
      return {
        success: false,
        card: existingCard,
        message: 'A card has already been generated for this appointment'
      };
    }

    const cardNumber = this.generateCardNumber();
    const now = new Date();
    const expiresAt = new Date(now.getTime() + (request.validityHours || 24) * 60 * 60 * 1000);
    
    const newCard = this.create({
      appointmentId: request.appointmentId,
      cardNumber: cardNumber,
      status: 'Active',
      expiresAt: expiresAt.toISOString(),
      usedAt: null
    });
    
    return {
      success: true,
      card: newCard,
      message: `Card generated successfully: ${cardNumber}`
    };
  }

  findByCardNumber(cardNumber: string): Card | undefined {
    return this.items.find(card => card.cardNumber === cardNumber);
  }

  findByAppointmentId(appointmentId: number): Card | undefined {
    return this.items.find(card => card.appointmentId === appointmentId);
  }

  findByPatientId(patientId: number): CardWithAppointment[] {
    const patientAppointmentIds = Object.entries(mockAppointmentsForCards)
      .filter(([_, appointment]) => appointment.patientId === patientId)
      .map(([id, _]) => parseInt(id));
    
    const cards = this.items.filter(card => patientAppointmentIds.includes(card.appointmentId));
    
    return cards.map(card => {
      const appointment = mockAppointmentsForCards[card.appointmentId];
      return {
        ...card,
        appointment: appointment ? {
          id: appointment.id,
          patientId: appointment.patientId,
          patientName: appointment.patientName,
          scheduledDateTime: appointment.scheduledDateTime,
          serviceName: appointment.serviceName,
          providerType: appointment.providerType,
          providerName: appointment.providerName
        } : undefined
      };
    });
  }

  findByStatus(status: CardStatus): Card[] {
    return this.items.filter(card => card.status === status);
  }

  findActiveCards(): Card[] {
    const now = new Date();
    return this.items.filter(card => {
      if (card.status !== 'Active') return false;
      const expiresAt = new Date(card.expiresAt);
      return expiresAt > now;
    });
  }

  findExpiredCards(): Card[] {
    const now = new Date();
    const expiredCards = this.items.filter(card => {
      if (card.status === 'Expired') return true;
      if (card.status === 'Active') {
        const expiresAt = new Date(card.expiresAt);
        return expiresAt <= now;
      }
      return false;
    });
    
    expiredCards.forEach(card => {
      if (card.status === 'Active') {
        this.update(card.id, { status: 'Expired', updatedAt: new Date().toISOString() });
      }
    });
    
    return expiredCards;
  }

  findCardsExpiringSoon(hours: number = 2): Card[] {
    const now = new Date();
    const future = new Date(now.getTime() + hours * 60 * 60 * 1000);
    
    return this.items.filter(card => {
      if (card.status !== 'Active') return false;
      const expiresAt = new Date(card.expiresAt);
      return expiresAt > now && expiresAt <= future;
    });
  }

  useCard(cardId: number, usedAt: string = new Date().toISOString()): Card | undefined {
    const card = this.findById(cardId);
    if (!card) return undefined;
    
    if (card.status === 'Used') return card;
    if (card.status === 'Expired') return undefined;
    
    const expiresAt = new Date(card.expiresAt);
    if (expiresAt < new Date()) {
      this.update(cardId, { status: 'Expired', updatedAt: new Date().toISOString() });
      return undefined;
    }
    
    return this.update(cardId, { 
      status: 'Used', 
      usedAt,
      updatedAt: new Date().toISOString()
    });
  }

  validateCard(cardNumber: string): CardValidationResult {
    const cardNumberRegex = /^\d{4}-\d{4}-\d{4}-\d{4}$/;
    if (!cardNumberRegex.test(cardNumber)) {
      return {
        isValid: false,
        error: 'invalid_format',
        message: 'Invalid card number format. Please use format: XXXX-XXXX-XXXX-XXXX'
      };
    }

    const card = this.findByCardNumber(cardNumber);
    if (!card) {
      return {
        isValid: false,
        error: 'not_found',
        message: 'Card number not found in system'
      };
    }

    const now = new Date();
    const expiresAt = new Date(card.expiresAt);
    
    if (expiresAt < now) {
      if (card.status === 'Active') {
        this.update(card.id, { status: 'Expired', updatedAt: new Date().toISOString() });
        card.status = 'Expired';
      }
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
        error: 'already_used',
        message: 'This card has already been used for check-in'
      };
    }

    return {
      isValid: true,
      card,
      message: 'Card is valid and ready for check-in'
    };
  }

  checkInWithCard(
    cardNumber: string, 
    verifiedByStaffId: number, 
    verifiedByType: 'doctor' | 'staff' | 'clinic' | 'diagnostic_center'
  ): CardCheckInResult {
    const validation = this.validateCard(cardNumber);
    
    if (!validation.isValid || !validation.card) {
      return {
        success: false,
        message: validation.message || 'Invalid card'
      };
    }

    const usedCard = this.useCard(validation.card.id);
    if (!usedCard) {
      return {
        success: false,
        message: 'Failed to update card status'
      };
    }

    const appointment = mockAppointmentsForCards[usedCard.appointmentId];
    
    return {
      success: true,
      appointmentId: usedCard.appointmentId,
      patientId: appointment?.patientId,
      patientName: appointment?.patientName,
      serviceName: appointment?.serviceName,
      scheduledDateTime: appointment?.scheduledDateTime,
      message: 'Successfully checked in. Please proceed to waiting area.'
    };
  }

  getCardWithAppointment(cardId: number): CardWithAppointment | undefined {
    const card = this.findById(cardId);
    if (!card) return undefined;
    
    const appointment = mockAppointmentsForCards[card.appointmentId];
    
    return {
      ...card,
      appointment: appointment ? {
        id: appointment.id,
        patientId: appointment.patientId,
        patientName: appointment.patientName,
        scheduledDateTime: appointment.scheduledDateTime,
        serviceName: appointment.serviceName,
        providerType: appointment.providerType,
        providerName: appointment.providerName
      } : undefined
    };
  }

  getAllCardsWithAppointments(): CardWithAppointment[] {
    return this.items.map(card => {
      const appointment = mockAppointmentsForCards[card.appointmentId];
      return {
        ...card,
        appointment: appointment ? {
          id: appointment.id,
          patientId: appointment.patientId,
          patientName: appointment.patientName,
          scheduledDateTime: appointment.scheduledDateTime,
          serviceName: appointment.serviceName,
          providerType: appointment.providerType,
          providerName: appointment.providerName
        } : undefined
      };
    });
  }

  filterCards(filters: CardFilters): Card[] {
    let filtered = [...this.items];
    
    if (filters.status && filters.status !== 'all') {
      filtered = filtered.filter(card => card.status === filters.status);
    }
    
    if (filters.appointmentId) {
      filtered = filtered.filter(card => card.appointmentId === filters.appointmentId);
    }
    
    if (filters.dateFrom) {
      filtered = filtered.filter(card => card.createdAt >= filters.dateFrom!);
    }
    
    if (filters.dateTo) {
      filtered = filtered.filter(card => card.createdAt <= filters.dateTo!);
    }
    
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(card => 
        card.cardNumber.toLowerCase().includes(searchLower) ||
        card.id.toString().includes(searchLower)
      );
    }
    
    if (filters.patientId || filters.providerId) {
      filtered = filtered.filter(card => {
        const appointment = mockAppointmentsForCards[card.appointmentId];
        if (!appointment) return false;
        if (filters.patientId && appointment.patientId !== filters.patientId) return false;
        if (filters.providerId) {
          const providerIdMap: Record<string, number> = {
            'Hayat General Clinic': 1,
            'Ethio Diagnostic Center': 2,
            'Dr. Robsan Chimdi': 3,
            'Bole Medical Center': 4,
            'Dr. Robera Shimelis': 5,
            'St. Paul Clinic': 6
          };
          const providerIdForAppointment = providerIdMap[appointment.providerName];
          if (providerIdForAppointment !== filters.providerId) return false;
        }
        return true;
      });
    }
    
    return filtered;
  }

  getCardStats(): CardStats {
    this.findExpiredCards();
    const cards = this.items;
    const total = cards.length;
    const active = cards.filter(c => c.status === 'Active').length;
    const used = cards.filter(c => c.status === 'Used').length;
    const expired = cards.filter(c => c.status === 'Expired').length;
    const utilizationRate = total > 0 ? (used / total) * 100 : 0;
    
    const usedCards = cards.filter(c => c.status === 'Used' && c.usedAt);
    let averageTimeToUseMinutes: number | null = null;
    
    if (usedCards.length > 0) {
      const totalMinutes = usedCards.reduce((sum, card) => {
        const created = new Date(card.createdAt);
        const used = new Date(card.usedAt!);
        const minutes = (used.getTime() - created.getTime()) / (1000 * 60);
        return sum + minutes;
      }, 0);
      averageTimeToUseMinutes = totalMinutes / usedCards.length;
    }
    
    return { total, active, used, expired, utilizationRate, averageTimeToUseMinutes };
  }

  getRecentCheckIns(limit: number = 5): {
    cardNumber: string;
    patientName: string;
    serviceName: string;
    checkInTime: string;
    appointmentTime: string;
  }[] {
    const usedCardsWithAppointments = this.getAllCardsWithAppointments()
      .filter(card => card.status === 'Used' && card.usedAt && card.appointment)
      .sort((a, b) => new Date(b.usedAt!).getTime() - new Date(a.usedAt!).getTime())
      .slice(0, limit);
    
    return usedCardsWithAppointments.map(card => ({
      cardNumber: card.cardNumber,
      patientName: card.appointment?.patientName || 'Unknown',
      serviceName: card.appointment?.serviceName || 'Unknown',
      checkInTime: card.usedAt!,
      appointmentTime: card.appointment?.scheduledDateTime || ''
    }));
  }

  getExpiringSoonCards(hoursThreshold: number = 2): {
    id: number;
    cardNumber: string;
    patientName: string;
    expiresAt: string;
    minutesUntilExpiry: number;
  }[] {
    const expiringCards = this.findCardsExpiringSoon(hoursThreshold);
    
    return expiringCards.map(card => {
      const appointment = mockAppointmentsForCards[card.appointmentId];
      const minutesUntilExpiry = Math.round(
        (new Date(card.expiresAt).getTime() - new Date().getTime()) / (1000 * 60)
      );
      
      return {
        id: card.id,
        cardNumber: card.cardNumber,
        patientName: appointment?.patientName || 'Unknown',
        expiresAt: card.expiresAt,
        minutesUntilExpiry: Math.max(0, minutesUntilExpiry)
      };
    });
  }

  bulkGenerateCards(requests: CardGenerationRequest[]): CardGenerationResult[] {
    return requests.map(request => this.generateCard(request));
  }

  revokeCard(cardId: number): Card | undefined {
    const card = this.findById(cardId);
    if (!card) return undefined;
    
    return this.update(cardId, { 
      status: 'Expired',
      expiresAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
  }

  isCardValidForCheckIn(cardNumber: string): boolean {
    const validation = this.validateCard(cardNumber);
    return validation.isValid;
  }

  getCardUsageStats(startDate: string, endDate: string): {
    totalUsed: number;
    averageTimeToUse: number | null;
    usageByHour: Record<number, number>;
  } {
    this.findExpiredCards();
    
    const usedCardsInRange = this.items.filter(card => {
      if (card.status !== 'Used' || !card.usedAt) return false;
      const usedDate = new Date(card.usedAt);
      const start = new Date(startDate);
      const end = new Date(endDate);
      return usedDate >= start && usedDate <= end;
    });
    
    const usageByHour: Record<number, number> = {};
    usedCardsInRange.forEach(card => {
      const hour = new Date(card.usedAt!).getHours();
      usageByHour[hour] = (usageByHour[hour] || 0) + 1;
    });
    
    let totalMinutes = 0;
    usedCardsInRange.forEach(card => {
      const created = new Date(card.createdAt);
      const used = new Date(card.usedAt!);
      totalMinutes += (used.getTime() - created.getTime()) / (1000 * 60);
    });
    
    const averageTimeToUse = usedCardsInRange.length > 0 ? totalMinutes / usedCardsInRange.length : null;
    
    return { totalUsed: usedCardsInRange.length, averageTimeToUse, usageByHour };
  }
}

export const getCardRepository = () => CardRepository.getInstance();