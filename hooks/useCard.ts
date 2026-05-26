// hooks/useCard.ts

import { useCallback, useEffect, useMemo } from 'react';
import { useCardStore } from '@/stores/slices/cardSlice';
import React from 'react';
import { Card } from '@/types/entities/card.types';
import { 
  CardFilters, 
  CardCheckInRequest, 
  CardGenerationRequest,
  CardStatus 
} from '@/types/entities/card.types';

interface UseCardOptions {
  autoFetch?: boolean;
  autoFetchStats?: boolean;
  filters?: CardFilters;
}

export const useCard = (options: UseCardOptions = {}) => {
  const {
    cards,
    currentCard,
    cardStats,
    validationResult,
    checkInResult,
    generationResult,
    isLoading,
    error,
    filters,
    pagination,
    fetchCards,
    fetchCardById,
    fetchCardByNumber,
    fetchCardStats,
    validateCard,
    checkIn,
    generateCard,
    expireCard,
    bulkGenerateCards,
    getExpiringCards,
    clearCurrentCard,
    clearValidationResult,
    clearCheckInResult,
    clearGenerationResult,
    setFilters,
    clearError,
    reset,
  } = useCardStore();

  // Auto-fetch cards on mount if enabled
  useEffect(() => {
    if (options.autoFetch) {
      fetchCards(options.filters);
    }
  }, [options.autoFetch, options.filters, fetchCards]);

  // Auto-fetch card stats on mount if enabled
  useEffect(() => {
    if (options.autoFetchStats) {
      fetchCardStats();
    }
  }, [options.autoFetchStats, fetchCardStats]);

  // Computed values
  const activeCards = useMemo(() => 
    cards.filter(card => card.status === 'Active'), 
    [cards]
  );

  const usedCards = useMemo(() => 
    cards.filter(card => card.status === 'Used'), 
    [cards]
  );

  const expiredCards = useMemo(() => 
    cards.filter(card => card.status === 'Expired'), 
    [cards]
  );

  const activeCount = useMemo(() => activeCards.length, [activeCards]);
  const usedCount = useMemo(() => usedCards.length, [usedCards]);
  const expiredCount = useMemo(() => expiredCards.length, [expiredCards]);

  const utilizationRate = useMemo(() => {
    if (!cardStats) return 0;
    return cardStats.utilizationRate;
  }, [cardStats]);

  const averageCheckInTime = useMemo(() => {
    if (!cardStats) return null;
    return cardStats.averageTimeToUseMinutes;
  }, [cardStats]);

  // Actions with additional logic
  const searchCard = useCallback(async (cardNumber: string) => {
    await fetchCardByNumber(cardNumber);
  }, [fetchCardByNumber]);

  const verifyAndCheckIn = useCallback(async (
    cardNumber: string, 
    verifiedByStaffId: number,
    verifiedByType: 'doctor' | 'staff' | 'clinic' | 'diagnostic_center'
  ) => {
    // First validate the card
    const validation = await validateCard(cardNumber);
    
    if (!validation.isValid) {
      return {
        success: false,
        message: validation.message,
        validationResult: validation
      };
    }

    // If valid, proceed with check-in
    const checkInRequest: CardCheckInRequest = {
      cardNumber,
      verifiedByStaffId,
      verifiedByType,
      checkInTime: new Date().toISOString(),
    };

    const result = await checkIn(checkInRequest);
    return result;
  }, [validateCard, checkIn]);

  const generateCardForAppointment = useCallback(async (
    appointmentId: number,
    validityHours: number = 24
  ) => {
    const request: CardGenerationRequest = {
      appointmentId,
      validityHours,
    };
    return await generateCard(request);
  }, [generateCard]);

  const filterByStatus = useCallback((status: CardStatus | 'all') => {
    setFilters({ ...filters, status });
  }, [filters, setFilters]);

  const filterByDateRange = useCallback((dateFrom?: string, dateTo?: string) => {
    setFilters({ ...filters, dateFrom, dateTo });
  }, [filters, setFilters]);

  const filterByPatient = useCallback((patientId?: number) => {
    setFilters({ ...filters, patientId });
  }, [filters, setFilters]);

  const filterByProvider = useCallback((providerId?: number) => {
    setFilters({ ...filters, providerId });
  }, [filters, setFilters]);

  const searchByTerm = useCallback((searchTerm: string) => {
    setFilters({ ...filters, searchTerm });
  }, [filters, setFilters]);

  const clearFilters = useCallback(() => {
    setFilters({});
  }, [setFilters]);

  const resetState = useCallback(() => {
    clearValidationResult();
    clearCheckInResult();
    clearGenerationResult();
    clearCurrentCard();
    clearError();
  }, [clearValidationResult, clearCheckInResult, clearGenerationResult, clearCurrentCard, clearError]);

  return {
    // State
    cards,
    currentCard,
    cardStats,
    validationResult,
    checkInResult,
    generationResult,
    isLoading,
    error,
    filters,
    pagination,
    
    // Computed
    activeCards,
    usedCards,
    expiredCards,
    activeCount,
    usedCount,
    expiredCount,
    utilizationRate,
    averageCheckInTime,
    
    // Actions
    fetchCards,
    fetchCardById,
    fetchCardByNumber,
    fetchCardStats,
    validateCard,
    checkIn,
    generateCard,
    expireCard,
    bulkGenerateCards,
    getExpiringCards,
    searchCard,
    verifyAndCheckIn,
    generateCardForAppointment,
    filterByStatus,
    filterByDateRange,
    filterByPatient,
    filterByProvider,
    searchByTerm,
    clearFilters,
    clearCurrentCard,
    clearValidationResult,
    clearCheckInResult,
    clearGenerationResult,
    setFilters,
    clearError,
    resetState,
    reset,
  };
};

// Specialized hook for card validation only
export const useCardValidation = () => {
  const { validateCard, validationResult, isLoading, clearValidationResult } = useCardStore();
  
  return {
    validateCard,
    validationResult,
    isLoading,
    clearValidationResult,
  };
};

// Specialized hook for card check-in only
export const useCardCheckIn = () => {
  const { checkIn, checkInResult, isLoading, clearCheckInResult } = useCardStore();
  
  return {
    checkIn,
    checkInResult,
    isLoading,
    clearCheckInResult,
  };
};

// Specialized hook for card generation only
export const useCardGeneration = () => {
  const { generateCard, generationResult, isLoading, clearGenerationResult } = useCardStore();
  
  return {
    generateCard,
    generationResult,
    isLoading,
    clearGenerationResult,
  };
};

// Specialized hook for card statistics only
export const useCardStats = (autoFetch: boolean = true) => {
  const { cardStats, fetchCardStats, isLoading } = useCardStore();
  
  useEffect(() => {
    if (autoFetch) {
      fetchCardStats();
    }
  }, [autoFetch, fetchCardStats]);
  
  return {
    cardStats,
    isLoading,
    refresh: fetchCardStats,
  };
};

// Hook for dashboard/overview page
export const useCardDashboard = () => {
  const {
    cards,
    cardStats,
    isLoading,
    fetchCards,
    fetchCardStats,
    getExpiringCards,
    setFilters,
  } = useCardStore();

  const [expiringCards, setExpiringCards] = React.useState<Card[]>([]);
  const [searchQuery, setSearchQuery] = React.useState('');

  useEffect(() => {
    fetchCards();
    fetchCardStats();
    loadExpiringCards();
  }, [fetchCards, fetchCardStats]);

  const loadExpiringCards = async () => {
    const expiring = await getExpiringCards(24);
    setExpiringCards(expiring);
  };

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    setFilters({ searchTerm: query || undefined });
  }, [setFilters]);

  const handleStatusFilter = useCallback((status: CardStatus | 'all') => {
    setFilters({ status: status === 'all' ? undefined : status });
  }, [setFilters]);

  const refresh = useCallback(() => {
    fetchCards();
    fetchCardStats();
    loadExpiringCards();
  }, [fetchCards, fetchCardStats]);

  return {
    cards,
    cardStats,
    expiringCards,
    isLoading,
    searchQuery,
    handleSearch,
    handleStatusFilter,
    refresh,
  };
};

// Hook for check-in screen (reception/kiosk)
export const useCheckInScreen = () => {
  const [cardNumber, setCardNumber] = React.useState('');
  const [isVerifying, setIsVerifying] = React.useState(false);
  
  const {
    validateCard,
    checkIn,
    validationResult,
    checkInResult,
    isLoading,
    clearValidationResult,
    clearCheckInResult,
  } = useCardStore();

  const handleValidate = useCallback(async () => {
    if (!cardNumber.trim()) {
      return { success: false, message: 'Please enter a card number' };
    }
    
    setIsVerifying(true);
    const result = await validateCard(cardNumber);
    setIsVerifying(false);
    return result;
  }, [cardNumber, validateCard]);

  const handleCheckIn = useCallback(async (
    staffId: number,
    staffType: 'doctor' | 'staff' | 'clinic' | 'diagnostic_center'
  ) => {
    if (!cardNumber.trim()) {
      return { success: false, message: 'Please enter a card number' };
    }
    
    const result = await checkIn({
      cardNumber,
      verifiedByStaffId: staffId,
      verifiedByType: staffType,
      checkInTime: new Date().toISOString(),
    });
    
    if (result.success) {
      // Clear input on success
      setCardNumber('');
    }
    
    return result;
  }, [cardNumber, checkIn]);

  const reset = useCallback(() => {
    setCardNumber('');
    clearValidationResult();
    clearCheckInResult();
  }, [clearValidationResult, clearCheckInResult]);

  return {
    cardNumber,
    setCardNumber,
    isVerifying,
    validationResult,
    checkInResult,
    isLoading: isLoading || isVerifying,
    handleValidate,
    handleCheckIn,
    reset,
  };
};

// Hook for card management page (admin)
export const useCardManagement = () => {
  const {
    cards,
    cardStats,
    isLoading,
    fetchCards,
    fetchCardStats,
    expireCard,
    bulkGenerateCards,
    setFilters,
  } = useCardStore();

  const [selectedCards, setSelectedCards] = React.useState<number[]>([]);

  useEffect(() => {
    fetchCards();
    fetchCardStats();
  }, [fetchCards, fetchCardStats]);

  const handleExpireSelected = useCallback(async () => {
    const results = await Promise.all(
      selectedCards.map(id => expireCard(id))
    );
    setSelectedCards([]);
    return results;
  }, [selectedCards, expireCard]);

  const handleBulkGenerate = useCallback(async (
    appointmentIds: number[],
    validityHours: number = 24
  ) => {
    const requests = appointmentIds.map(appointmentId => ({
      appointmentId,
      validityHours,
    }));
    const results = await bulkGenerateCards(requests);
    return results;
  }, [bulkGenerateCards]);

  const toggleSelectCard = useCallback((cardId: number) => {
    setSelectedCards(prev =>
      prev.includes(cardId)
        ? prev.filter(id => id !== cardId)
        : [...prev, cardId]
    );
  }, []);

  const selectAllCards = useCallback(() => {
    setSelectedCards(cards.map(card => card.id));
  }, [cards]);

  const clearSelection = useCallback(() => {
    setSelectedCards([]);
  }, []);

  const handleStatusFilter = useCallback((status: CardStatus | 'all') => {
    setFilters({ status: status === 'all' ? undefined : status });
  }, [setFilters]);

  const handleSearch = useCallback((searchTerm: string) => {
    setFilters({ searchTerm: searchTerm || undefined });
  }, [setFilters]);

  const refresh = useCallback(() => {
    fetchCards();
    fetchCardStats();
  }, [fetchCards, fetchCardStats]);

  return {
    cards,
    cardStats,
    isLoading,
    selectedCards,
    selectedCount: selectedCards.length,
    handleExpireSelected,
    handleBulkGenerate,
    toggleSelectCard,
    selectAllCards,
    clearSelection,
    handleStatusFilter,
    handleSearch,
    refresh,
    setFilters,
  };
};

