// stores/cardStore.ts

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { 
  Card, 
  CardWithAppointment, 
  CardFilters, 
  CardStats,
  CardValidationResult,
  CardCheckInRequest,
  CardCheckInResult,
  CardGenerationRequest,
  CardGenerationResult
} from '@/types/entities/card.types';
import { cardService } from '@/services/card.service';

interface CardState {
  // State
  cards: Card[];
  currentCard: CardWithAppointment | null;
  cardStats: CardStats | null;
  validationResult: CardValidationResult | null;
  checkInResult: CardCheckInResult | null;
  generationResult: CardGenerationResult | null;
  isLoading: boolean;
  error: string | null;
  filters: CardFilters;
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
  
  // Actions
  fetchCards: (filters?: CardFilters) => Promise<void>;
  fetchCardById: (id: number) => Promise<void>;
  fetchCardByNumber: (cardNumber: string) => Promise<void>;
  fetchCardStats: () => Promise<void>;
  validateCard: (cardNumber: string) => Promise<CardValidationResult>;
  checkIn: (request: CardCheckInRequest) => Promise<CardCheckInResult>;
  generateCard: (request: CardGenerationRequest) => Promise<CardGenerationResult>;
  expireCard: (cardId: number) => Promise<void>;
  bulkGenerateCards: (requests: CardGenerationRequest[]) => Promise<CardGenerationResult[]>;
  getExpiringCards: (hoursThreshold?: number) => Promise<Card[]>;
  clearCurrentCard: () => void;
  clearValidationResult: () => void;
  clearCheckInResult: () => void;
  clearGenerationResult: () => void;
  setFilters: (filters: CardFilters) => void;
  clearError: () => void;
  reset: () => void;
}

const initialState = {
  cards: [],
  currentCard: null,
  cardStats: null,
  validationResult: null,
  checkInResult: null,
  generationResult: null,
  isLoading: false,
  error: null,
  filters: {},
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
  },
};

export const useCardStore = create<CardState>()(
  devtools(
    (set, get) => ({
      ...initialState,

      fetchCards: async (filters?: CardFilters) => {
        set({ isLoading: true, error: null });
        try {
          const mergedFilters = { ...get().filters, ...filters };
          const cards = await cardService.getCards(mergedFilters);
          set({ 
            cards, 
            filters: mergedFilters,
            isLoading: false,
            pagination: { ...get().pagination, total: cards.length }
          });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to fetch cards', 
            isLoading: false 
          });
        }
      },

      fetchCardById: async (id: number) => {
        set({ isLoading: true, error: null });
        try {
          const card = await cardService.getCardById(id);
          set({ currentCard: card, isLoading: false });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to fetch card', 
            isLoading: false 
          });
        }
      },

      fetchCardByNumber: async (cardNumber: string) => {
        set({ isLoading: true, error: null });
        try {
          const card = await cardService.getCardByNumber(cardNumber);
          set({ currentCard: card, isLoading: false });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to fetch card', 
            isLoading: false 
          });
        }
      },

      fetchCardStats: async () => {
        set({ isLoading: true, error: null });
        try {
          const stats = await cardService.getCardStats();
          set({ cardStats: stats, isLoading: false });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to fetch card stats', 
            isLoading: false 
          });
        }
      },

      validateCard: async (cardNumber: string) => {
        set({ isLoading: true, error: null, validationResult: null });
        try {
          const result = await cardService.validateCard(cardNumber);
          set({ validationResult: result, isLoading: false });
          return result;
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to validate card';
          set({ error: errorMessage, isLoading: false });
          throw error;
        }
      },

      checkIn: async (request: CardCheckInRequest) => {
        set({ isLoading: true, error: null, checkInResult: null });
        try {
          const result = await cardService.checkIn(request);
          set({ checkInResult: result, isLoading: false });
          
          // Refresh cards list if check-in was successful
          if (result.success) {
            await get().fetchCards();
          }
          
          return result;
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to check in';
          set({ error: errorMessage, isLoading: false });
          throw error;
        }
      },

      generateCard: async (request: CardGenerationRequest) => {
        set({ isLoading: true, error: null, generationResult: null });
        try {
          const result = await cardService.generateCard(request);
          set({ generationResult: result, isLoading: false });
          
          // Refresh cards list if generation was successful
          if (result.success) {
            await get().fetchCards();
          }
          
          return result;
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to generate card';
          set({ error: errorMessage, isLoading: false });
          throw error;
        }
      },

      expireCard: async (cardId: number) => {
        set({ isLoading: true, error: null });
        try {
          await cardService.expireCard(cardId);
          await get().fetchCards();
          set({ isLoading: false });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to expire card', 
            isLoading: false 
          });
        }
      },

      bulkGenerateCards: async (requests: CardGenerationRequest[]) => {
        set({ isLoading: true, error: null });
        try {
          const results = await cardService.bulkGenerateCards(requests);
          await get().fetchCards();
          set({ isLoading: false });
          return results;
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to bulk generate cards', 
            isLoading: false 
          });
          throw error;
        }
      },

      getExpiringCards: async (hoursThreshold?: number) => {
        set({ isLoading: true, error: null });
        try {
          const cards = await cardService.getExpiringCards(hoursThreshold);
          set({ isLoading: false });
          return cards;
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to fetch expiring cards', 
            isLoading: false 
          });
          throw error;
        }
      },

      clearCurrentCard: () => {
        set({ currentCard: null });
      },

      clearValidationResult: () => {
        set({ validationResult: null });
      },

      clearCheckInResult: () => {
        set({ checkInResult: null });
      },

      clearGenerationResult: () => {
        set({ generationResult: null });
      },

      setFilters: (filters: CardFilters) => {
        set({ filters });
        get().fetchCards(filters);
      },

      clearError: () => {
        set({ error: null });
      },

      reset: () => {
        set(initialState);
      },
    }),
    { name: 'CardStore' }
  )
);