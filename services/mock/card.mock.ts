// mocks/card.mock.ts

import { Card, CardStatus, CardWithAppointment, CardFilters, CardStats, CardValidationResult, CardGenerationRequest } from '@/types/entities/card.types';

// Mock Cards
export const mockCards: Card[] = [
  {
    id: 1,
    appointmentId: 101,
    cardNumber: '4512-7893-1023-6745',
    cardNumberHash: '$2y$10$xyz789abcdef1234567890',
    status: 'Active',
    createdAt: '2026-01-27T09:00:00Z',
    expiresAt: '2026-01-28T09:00:00Z',
    usedAt: null
  },
  {
    id: 2,
    appointmentId: 102,
    cardNumber: '5234-8910-2345-7861',
    cardNumberHash: '$2y$10$abc123def4567890123456',
    status: 'Used',
    createdAt: '2026-01-27T08:30:00Z',
    expiresAt: '2026-01-28T08:30:00Z',
    usedAt: '2026-01-27T10:15:00Z'
  },
  {
    id: 3,
    appointmentId: 103,
    cardNumber: '6789-0123-4567-8901',
    cardNumberHash: '$2y$10$ghi789jkl0123456789012',
    status: 'Expired',
    createdAt: '2026-01-25T14:00:00Z',
    expiresAt: '2026-01-26T14:00:00Z',
    usedAt: null
  },
  {
    id: 4,
    appointmentId: 104,
    cardNumber: '7890-1234-5678-9012',
    cardNumberHash: '$2y$10$mno345pqr6789012345678',
    status: 'Active',
    createdAt: '2026-01-27T10:00:00Z',
    expiresAt: '2026-01-28T10:00:00Z',
    usedAt: null
  },
  {
    id: 5,
    appointmentId: 105,
    cardNumber: '8901-2345-6789-0123',
    cardNumberHash: '$2y$10$stu901vwx2345678901234',
    status: 'Used',
    createdAt: '2026-01-26T11:20:00Z',
    expiresAt: '2026-01-27T11:20:00Z',
    usedAt: '2026-01-26T13:45:00Z'
  },
  {
    id: 6,
    appointmentId: 106,
    cardNumber: '9012-3456-7890-1234',
    cardNumberHash: '$2y$10$yza567bcd8901234567890',
    status: 'Expired',
    createdAt: '2026-01-24T16:30:00Z',
    expiresAt: '2026-01-25T16:30:00Z',
    usedAt: null
  },
  {
    id: 7,
    appointmentId: 107,
    cardNumber: '3456-7890-1234-5678',
    cardNumberHash: '$2y$10$efg123hij4567890123456',
    status: 'Active',
    createdAt: '2026-01-27T07:45:00Z',
    expiresAt: '2026-01-28T07:45:00Z',
    usedAt: null
  },
  {
    id: 8,
    appointmentId: 108,
    cardNumber: '4567-8901-2345-6789',
    cardNumberHash: '$2y$10$klm789nop0123456789012',
    status: 'Used',
    createdAt: '2026-01-26T09:15:00Z',
    expiresAt: '2026-01-27T09:15:00Z',
    usedAt: '2026-01-26T11:30:00Z'
  }
];

// Mock Cards with Appointment Details (updated with providerType and providerName)
export const mockCardsWithAppointments: CardWithAppointment[] = [
  {
    ...mockCards[0],
    appointment: {
      id: 101,
      patientId: 201,
      patientName: 'John Smith',
      scheduledDateTime: '2026-01-27T10:00:00Z',
      serviceName: 'Dental Cleaning',
      providerType: 'clinic',
      providerName: 'Hayat General Clinic'
    }
  },
  {
    ...mockCards[1],
    appointment: {
      id: 102,
      patientId: 202,
      patientName: 'Sarah Johnson',
      scheduledDateTime: '2026-01-27T09:30:00Z',
      serviceName: 'Root Canal',
      providerType: 'clinic',
      providerName: 'Hayat General Clinic'
    }
  },
  {
    ...mockCards[2],
    appointment: {
      id: 103,
      patientId: 203,
      patientName: 'Michael Brown',
      scheduledDateTime: '2026-01-25T15:00:00Z',
      serviceName: 'X-Ray',
      providerType: 'diagnostic_center',
      providerName: 'Ethio Diagnostic Center'
    }
  },
  {
    ...mockCards[3],
    appointment: {
      id: 104,
      patientId: 204,
      patientName: 'Emily Davis',
      scheduledDateTime: '2026-01-27T14:00:00Z',
      serviceName: 'Consultation',
      providerType: 'doctor',
      providerName: 'Dr. Robsan Chimdi'
    }
  },
  {
    ...mockCards[4],
    appointment: {
      id: 105,
      patientId: 205,
      patientName: 'David Wilson',
      scheduledDateTime: '2026-01-26T13:00:00Z',
      serviceName: 'Vaccination',
      providerType: 'clinic',
      providerName: 'Bole Medical Center'
    }
  },
  {
    ...mockCards[5],
    appointment: {
      id: 106,
      patientId: 206,
      patientName: 'Lisa Anderson',
      scheduledDateTime: '2026-01-24T17:00:00Z',
      serviceName: 'Follow-up',
      providerType: 'doctor',
      providerName: 'Dr. Robera Shimelis'
    }
  },
  {
    ...mockCards[6],
    appointment: {
      id: 107,
      patientId: 207,
      patientName: 'Robert Taylor',
      scheduledDateTime: '2026-01-27T08:00:00Z',
      serviceName: 'Emergency Procedure',
      providerType: 'clinic',
      providerName: 'St. Paul Clinic'
    }
  },
  {
    ...mockCards[7],
    appointment: {
      id: 108,
      patientId: 208,
      patientName: 'Jennifer Martinez',
      scheduledDateTime: '2026-01-26T10:00:00Z',
      serviceName: 'Dental Filling',
      providerType: 'clinic',
      providerName: 'Hayat General Clinic'
    }
  }
];

// Mock Card Statistics
export const mockCardStats: CardStats = {
  total: 108,
  active: 42,
  used: 38,
  expired: 28,
  utilizationRate: 35.19,
  averageTimeToUseMinutes: 125.5
};

// Mock Card Validation Results (with updated error types)
export const mockCardValidationResults = {
  valid: {
    isValid: true,
    card: mockCards[0],
    message: 'Card is valid and ready for check-in'
  } as CardValidationResult,
  
  notFound: {
    isValid: false,
    error: 'not_found',
    message: 'Card number not found in system'
  } as CardValidationResult,
  
  expired: {
    isValid: false,
    card: mockCards[2],
    error: 'expired' as any, // Note: Update CardValidationResult error type to include 'expired'
    message: 'Card has expired. Please contact reception for assistance.'
  } as CardValidationResult,
  
  alreadyUsed: {
    isValid: false,
    card: mockCards[1],
    error: 'already_used' as any, // Note: Update CardValidationResult error type to include 'already_used'
    message: 'This card has already been used for check-in'
  } as CardValidationResult,
  
  invalidFormat: {
    isValid: false,
    error: 'invalid_format',
    message: 'Invalid card number format. Please use format: XXXX-XXXX-XXXX-XXXX'
  } as CardValidationResult
};

// Mock Card Generation Requests
export const mockCardGenerationRequests: CardGenerationRequest[] = [
  {
    appointmentId: 109,
    validityHours: 24
  },
  {
    appointmentId: 110,
    validityHours: 48
  },
  {
    appointmentId: 111,
    validityHours: 12
  }
];

// Helper function to filter cards
export const filterMockCards = (filters: CardFilters): Card[] => {
  return mockCards.filter(card => {
    if (filters.status && filters.status !== 'all' && card.status !== filters.status) {
      return false;
    }
    if (filters.appointmentId && card.appointmentId !== filters.appointmentId) {
      return false;
    }
    if (filters.patientId) {
      // Find appointment to check patientId
      const cardWithAppt = mockCardsWithAppointments.find(c => c.id === card.id);
      if (cardWithAppt?.appointment?.patientId !== filters.patientId) {
        return false;
      }
    }
    if (filters.providerId) {
      const cardWithAppt = mockCardsWithAppointments.find(c => c.id === card.id);
      if (cardWithAppt?.appointment?.id !== filters.providerId) {
        return false;
      }
    }
    if (filters.dateFrom && card.createdAt < filters.dateFrom) {
      return false;
    }
    if (filters.dateTo && card.createdAt > filters.dateTo) {
      return false;
    }
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      const cardNumberMatch = card.cardNumber.toLowerCase().includes(searchLower);
      const cardIdMatch = card.id.toString().includes(searchLower);
      if (!cardNumberMatch && !cardIdMatch) {
        return false;
      }
    }
    return true;
  });
};

// Pre-filtered card lists
export const activeCards = filterMockCards({ status: 'Active' });
export const usedCards = filterMockCards({ status: 'Used' });
export const expiredCards = filterMockCards({ status: 'Expired' });
export const todayCards = filterMockCards({ 
  dateFrom: '2026-01-27T00:00:00Z',
  dateTo: '2026-01-27T23:59:59Z'
});

// Recent check-ins (last 5 used cards)
export const recentCheckIns = mockCardsWithAppointments
  .filter(card => card.status === 'Used' && card.usedAt)
  .sort((a, b) => new Date(b.usedAt!).getTime() - new Date(a.usedAt!).getTime())
  .slice(0, 5)
  .map(card => ({
    cardNumber: card.cardNumber,
    patientName: card.appointment?.patientName || 'Unknown',
    serviceName: card.appointment?.serviceName || 'Unknown',
    checkInTime: card.usedAt,
    appointmentTime: card.appointment?.scheduledDateTime
  }));

// Expiring soon cards (next 2 hours)
export const expiringSoonCards = mockCardsWithAppointments
  .filter(card => {
    if (card.status !== 'Active') return false;
    const expiresAt = new Date(card.expiresAt);
    const now = new Date();
    const hoursUntilExpiry = (expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60);
    return hoursUntilExpiry > 0 && hoursUntilExpiry <= 2;
  })
  .map(card => ({
    id: card.id,
    cardNumber: card.cardNumber,
    patientName: card.appointment?.patientName || 'Unknown',
    expiresAt: card.expiresAt,
    minutesUntilExpiry: Math.round(
      (new Date(card.expiresAt).getTime() - new Date().getTime()) / (1000 * 60)
    )
  }));

// Mock Card Check-In Results
export const mockCardCheckInResults = {
  success: {
    success: true,
    appointmentId: 101,
    patientId: 201,
    patientName: 'John Smith',
    serviceName: 'Dental Cleaning',
    scheduledDateTime: '2026-01-27T10:00:00Z',
    message: 'Successfully checked in. Please proceed to waiting area.'
  },
  failure: {
    success: false,
    message: 'Check-in failed. Card is invalid.'
  }
};

// Mock Card Generation Results
export const mockCardGenerationResults = {
  success: {
    success: true,
    card: mockCards[0],
    message: 'Card generated successfully'
  },
  failure: {
    success: false,
    message: 'Failed to generate card. Appointment not found.'
  }
};