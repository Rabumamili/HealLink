// stores/reviewSlice.ts

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import {
  Review,
  ReviewWithDetails,
  ReviewFilters,
  CreateReviewDTO,
  UpdateReviewDTO,
  ProviderReviewStats,
  PatientReviewStats,
  OverallReviewStats,
  ReviewListResponse
} from '@/types/entities/review.types';
import { reviewService } from '@/services/review.service';

interface ReviewState {
  // State
  reviews: ReviewWithDetails[];
  currentReview: ReviewWithDetails | null;
  providerStats: ProviderReviewStats | null;
  patientStats: PatientReviewStats | null;
  overallStats: OverallReviewStats | null;
  isLoading: boolean;
  error: string | null;
  filters: ReviewFilters;
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
  
  // Actions
  fetchReviews: (filters?: ReviewFilters, page?: number, limit?: number) => Promise<void>;
  fetchReviewById: (id: number) => Promise<void>;
  fetchReviewsByPatient: (patientId: number) => Promise<void>;
  fetchReviewsByProvider: (providerId: number) => Promise<void>;
  fetchProviderStats: (providerId: number) => Promise<void>;
  fetchPatientStats: (patientId: number) => Promise<void>;
  fetchOverallStats: () => Promise<void>;
  createReview: (data: CreateReviewDTO) => Promise<boolean>;
  updateReview: (id: number, data: UpdateReviewDTO) => Promise<boolean>;
  deleteReview: (id: number) => Promise<boolean>;
  canReview: (patientId: number, providerId: number) => Promise<{ canReview: boolean; message?: string }>;
  clearCurrentReview: () => void;
  setFilters: (filters: ReviewFilters) => void;
  clearError: () => void;
  reset: () => void;
}

const initialState = {
  reviews: [],
  currentReview: null,
  providerStats: null,
  patientStats: null,
  overallStats: null,
  isLoading: false,
  error: null,
  filters: {},
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    total_pages: 0
  }
};

export const useReviewStore = create<ReviewState>()(
  devtools(
    (set, get) => ({
      ...initialState,

      fetchReviews: async (filters?: ReviewFilters, page: number = 1, limit: number = 10) => {
        set({ isLoading: true, error: null });
        try {
          const mergedFilters = { ...get().filters, ...filters };
          const response = await reviewService.getReviews(mergedFilters, page, limit);
          
          set({
            reviews: response.data,
            filters: mergedFilters,
            pagination: response.pagination,
            isLoading: false
          });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to fetch reviews',
            isLoading: false
          });
        }
      },

      fetchReviewById: async (id: number) => {
        set({ isLoading: true, error: null });
        try {
          const review = await reviewService.getReviewById(id);
          set({ currentReview: review, isLoading: false });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to fetch review',
            isLoading: false
          });
        }
      },

      fetchReviewsByPatient: async (patientId: number) => {
        set({ isLoading: true, error: null });
        try {
          const reviews = await reviewService.getReviewsByPatient(patientId);
          set({ reviews, isLoading: false });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to fetch patient reviews',
            isLoading: false
          });
        }
      },

      fetchReviewsByProvider: async (providerId: number) => {
        set({ isLoading: true, error: null });
        try {
          const reviews = await reviewService.getReviewsByProvider(providerId);
          set({ reviews, isLoading: false });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to fetch provider reviews',
            isLoading: false
          });
        }
      },

      fetchProviderStats: async (providerId: number) => {
        set({ isLoading: true, error: null });
        try {
          const stats = await reviewService.getProviderReviewStats(providerId);
          set({ providerStats: stats, isLoading: false });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to fetch provider stats',
            isLoading: false
          });
        }
      },

      fetchPatientStats: async (patientId: number) => {
        set({ isLoading: true, error: null });
        try {
          const stats = await reviewService.getPatientReviewStats(patientId);
          set({ patientStats: stats, isLoading: false });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to fetch patient stats',
            isLoading: false
          });
        }
      },

      fetchOverallStats: async () => {
        set({ isLoading: true, error: null });
        try {
          const stats = await reviewService.getOverallReviewStats();
          set({ overallStats: stats, isLoading: false });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to fetch overall stats',
            isLoading: false
          });
        }
      },

      createReview: async (data: CreateReviewDTO) => {
        set({ isLoading: true, error: null });
        try {
          const response = await reviewService.createReview(data);
          if (response.success) {
            await get().fetchReviews();
            set({ isLoading: false });
            return true;
          }
          set({ error: response.message || 'Failed to create review', isLoading: false });
          return false;
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to create review',
            isLoading: false
          });
          return false;
        }
      },

      updateReview: async (id: number, data: UpdateReviewDTO) => {
        set({ isLoading: true, error: null });
        try {
          const response = await reviewService.updateReview(id, data);
          if (response.success) {
            await get().fetchReviews();
            set({ isLoading: false });
            return true;
          }
          set({ error: response.message || 'Failed to update review', isLoading: false });
          return false;
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to update review',
            isLoading: false
          });
          return false;
        }
      },

      deleteReview: async (id: number) => {
        set({ isLoading: true, error: null });
        try {
          const response = await reviewService.deleteReview(id);
          if (response.success) {
            await get().fetchReviews();
            set({ isLoading: false });
            return true;
          }
          set({ error: response.message || 'Failed to delete review', isLoading: false });
          return false;
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to delete review',
            isLoading: false
          });
          return false;
        }
      },

      canReview: async (patientId: number, providerId: number) => {
        try {
          return await reviewService.canReview(patientId, providerId);
        } catch (error) {
          return {
            canReview: false,
            message: error instanceof Error ? error.message : 'Unable to check review eligibility'
          };
        }
      },

      clearCurrentReview: () => {
        set({ currentReview: null });
      },

      setFilters: (filters: ReviewFilters) => {
        set({ filters });
        get().fetchReviews(filters);
      },

      clearError: () => {
        set({ error: null });
      },

      reset: () => {
        set(initialState);
      }
    }),
    { name: 'ReviewStore' }
  )
);