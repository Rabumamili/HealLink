// stores/reviewSlice.ts
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { reviewService, CreateReviewRequest, Review, ProviderReviewsResponse } from '@/services/review.service';

interface ReviewState {
  reviews: Review[];
  providerReviews: ProviderReviewsResponse | null;
  currentReview: Review | null;
  isLoading: boolean;
  error: string | null;
  
  submitReview: (data: CreateReviewRequest) => Promise<Review | null>;
  getProviderReviews: (providerId: number, limit?: number, offset?: number) => Promise<void>;
  getReviewForAppointment: (appointmentId: number) => Promise<void>;
  clearCurrentReview: () => void;
  clearError: () => void;
  reset: () => void;
}

const initialState = {
  reviews: [],
  providerReviews: null,
  currentReview: null,
  isLoading: false,
  error: null,
};

export const useReviewStore = create<ReviewState>()(
  devtools(
    (set) => ({
      ...initialState,

      submitReview: async (data: CreateReviewRequest) => {
        set({ isLoading: true, error: null });
        try {
          const review = await reviewService.submitReview(data);
          set((state) => ({
            reviews: [review, ...state.reviews],
            currentReview: review,
            isLoading: false,
          }));
          return review;
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to submit review',
            isLoading: false
          });
          return null;
        }
      },

      getProviderReviews: async (providerId: number, limit: number = 20, offset: number = 0) => {
        set({ isLoading: true, error: null });
        try {
          const response = await reviewService.getProviderReviews(providerId, limit, offset);
          set({ 
            providerReviews: response,
            reviews: response.reviews,
            isLoading: false 
          });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to fetch provider reviews',
            isLoading: false
          });
        }
      },

      getReviewForAppointment: async (appointmentId: number) => {
        set({ isLoading: true, error: null });
        try {
          const review = await reviewService.getReviewForAppointment(appointmentId);
          set({ currentReview: review, isLoading: false });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to fetch review',
            isLoading: false
          });
        }
      },

      clearCurrentReview: () => {
        set({ currentReview: null });
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