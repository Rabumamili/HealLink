// hooks/useCard.ts
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useCardStore } from '@/stores/slices/cardSlice';
import { 
  Card, 
  CardFilters, 
  CardCheckInRequest, 
  CardGenerationRequest,
  CardStatus,
  CardWithAppointment,
  CardValidationResult,
  CardCheckInResult,
  CardGenerationResult
} from '@/types/entities/card.types';
import { cardService } from '@/services/card.service';

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
  const activeCards = useMemo((): Card[] => 
    cards.filter((card: Card) => card.status === 'Active'), 
    [cards]
  );

  const usedCards = useMemo((): Card[] => 
    cards.filter((card: Card) => card.status === 'Used'), 
    [cards]
  );

  const expiredCards = useMemo((): Card[] => 
    cards.filter((card: Card) => card.status === 'Expired'), 
    [cards]
  );

  const activeCount = useMemo((): number => activeCards.length, [activeCards]);
  const usedCount = useMemo((): number => usedCards.length, [usedCards]);
  const expiredCount = useMemo((): number => expiredCards.length, [expiredCards]);

  const utilizationRate = useMemo((): number => {
    if (!cardStats) return 0;
    return cardStats.utilizationRate;
  }, [cardStats]);

  const averageCheckInTime = useMemo((): number | null => {
    if (!cardStats) return null;
    return cardStats.averageTimeToUseMinutes;
  }, [cardStats]);

  const getCardWithAppointment = useCallback(async (cardNumber: string): Promise<CardWithAppointment | null> => {
    const card = await fetchCardByNumber(cardNumber);
    return card;
  }, [fetchCardByNumber]);

  // Actions with additional logic
  const searchCard = useCallback(async (cardNumber: string): Promise<CardWithAppointment | null> => {
    return await fetchCardByNumber(cardNumber);
  }, [fetchCardByNumber]);

  const verifyAndCheckIn = useCallback(async (
    cardNumber: string, 
    verifiedByStaffId: number,
    verifiedByType: 'doctor' | 'staff' | 'clinic' | 'diagnostic_center'
  ): Promise<{ success: boolean; message?: string; validationResult?: CardValidationResult; appointmentId?: number; patientId?: number; patientName?: string; serviceName?: string; scheduledDateTime?: string }> => {
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
    return { ...result, validationResult: validation };
  }, [validateCard, checkIn]);

  const generateCardForAppointment = useCallback(async (
    appointmentId: number,
    validityHours: number = 24
  ): Promise<CardGenerationResult> => {
    const request: CardGenerationRequest = {
      appointmentId,
      validityHours,
    };
    return await generateCard(request);
  }, [generateCard]);

  const filterByStatus = useCallback((status: CardStatus | 'all'): void => {
    setFilters({ ...filters, status: status === 'all' ? undefined : status });
  }, [filters, setFilters]);

  const filterByDateRange = useCallback((dateFrom?: string, dateTo?: string): void => {
    setFilters({ ...filters, dateFrom, dateTo });
  }, [filters, setFilters]);

  const filterByPatient = useCallback((patientId?: number): void => {
    setFilters({ ...filters, patientId });
  }, [filters, setFilters]);

  const filterByProvider = useCallback((providerId?: number): void => {
    setFilters({ ...filters, providerId });
  }, [filters, setFilters]);

  const searchByTerm = useCallback((searchTerm: string): void => {
    setFilters({ ...filters, searchTerm: searchTerm || undefined });
  }, [filters, setFilters]);

  const clearFilters = useCallback((): void => {
    setFilters({});
    // Also reset local filters state
    if (options.filters) {
      fetchCards({});
    }
  }, [setFilters, fetchCards, options.filters]);

  const resetState = useCallback((): void => {
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
    getCardWithAppointment,
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

  const [expiringCards, setExpiringCards] = useState<Card[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    const loadData = async (): Promise<void> => {
      await fetchCards();
      await fetchCardStats();
      await loadExpiringCards();
    };
    loadData();
  }, [fetchCards, fetchCardStats]);

  const loadExpiringCards = useCallback(async (): Promise<void> => {
    const expiring = await getExpiringCards(24);
    setExpiringCards(expiring);
  }, [getExpiringCards]);

  const handleSearch = useCallback((query: string): void => {
    setSearchQuery(query);
    setFilters({ searchTerm: query || undefined });
  }, [setFilters]);

  const handleStatusFilter = useCallback((status: CardStatus | 'all'): void => {
    setFilters({ status: status === 'all' ? undefined : status });
  }, [setFilters]);

  const refresh = useCallback(async (): Promise<void> => {
    await fetchCards();
    await fetchCardStats();
    await loadExpiringCards();
  }, [fetchCards, fetchCardStats, loadExpiringCards]);

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
  const [cardNumber, setCardNumber] = useState<string>('');
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  
  const {
    validateCard,
    checkIn,
    validationResult,
    checkInResult,
    isLoading,
    clearValidationResult,
    clearCheckInResult,
  } = useCardStore();

  const handleValidate = useCallback(async (): Promise<CardValidationResult | { success: boolean; message: string }> => {
    if (!cardNumber.trim()) {
      return { success: false, message: 'Please enter a card number' };
    }
    
    setIsVerifying(true);
    try {
      const result = await validateCard(cardNumber);
      return result;
    } finally {
      setIsVerifying(false);
    }
  }, [cardNumber, validateCard]);

  const handleCheckIn = useCallback(async (
    staffId: number,
    staffType: 'doctor' | 'staff' | 'clinic' | 'diagnostic_center'
  ): Promise<CardCheckInResult> => {
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
      clearValidationResult();
      clearCheckInResult();
    }
    
    return result;
  }, [cardNumber, checkIn, clearValidationResult, clearCheckInResult]);

  const reset = useCallback((): void => {
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

  const [selectedCards, setSelectedCards] = useState<number[]>([]);

  useEffect(() => {
    const loadData = async (): Promise<void> => {
      await fetchCards();
      await fetchCardStats();
    };
    loadData();
  }, [fetchCards, fetchCardStats]);

  const handleExpireSelected = useCallback(async (): Promise<void> => {
    await Promise.all(
      selectedCards.map((id: number) => expireCard(id))
    );
    setSelectedCards([]);
    await fetchCards(); // Refresh after expiration
  }, [selectedCards, expireCard, fetchCards]);

  const handleBulkGenerate = useCallback(async (
    appointmentIds: number[],
    validityHours: number = 24
  ): Promise<CardGenerationResult[]> => {
    const requests: CardGenerationRequest[] = appointmentIds.map((appointmentId: number) => ({
      appointmentId,
      validityHours,
    }));
    const results = await bulkGenerateCards(requests);
    await fetchCards(); // Refresh after generation
    return results;
  }, [bulkGenerateCards, fetchCards]);

  const toggleSelectCard = useCallback((cardId: number): void => {
    setSelectedCards((prev: number[]) =>
      prev.includes(cardId)
        ? prev.filter((id: number) => id !== cardId)
        : [...prev, cardId]
    );
  }, []);

  const selectAllCards = useCallback((): void => {
    setSelectedCards(cards.map((card: Card) => card.id));
  }, [cards]);

  const clearSelection = useCallback((): void => {
    setSelectedCards([]);
  }, []);

  const handleStatusFilter = useCallback((status: CardStatus | 'all'): void => {
    setFilters({ status: status === 'all' ? undefined : status });
  }, [setFilters]);

  const handleSearch = useCallback((searchTerm: string): void => {
    setFilters({ searchTerm: searchTerm || undefined });
  }, [setFilters]);

  const refresh = useCallback(async (): Promise<void> => {
    await fetchCards();
    await fetchCardStats();
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
