// hooks/useReview.ts
import { useEffect, useCallback, useMemo } from 'react';
import { useReviewStore } from '@/stores/slices/reviewSlice';
import { reviewService, CreateReviewRequest, Review, ProviderReviewsResponse } from '@/services/review.service';

interface UseReviewOptions {
  autoFetch?: boolean;
  providerId?: number;
  appointmentId?: number;
  patientId?: number;
}

export const useReview = (options: UseReviewOptions = {}) => {
  const {
    reviews,
    providerReviews,
    currentReview,
    isLoading,
    error,
    submitReview,
    getProviderReviews,
    getReviewForAppointment,
    clearCurrentReview,
    clearError,
    reset,
  } = useReviewStore();

  const { autoFetch = false, providerId, appointmentId, patientId } = options;

  useEffect(() => {
    if (autoFetch) {
      if (providerId) {
        getProviderReviews(providerId);
      } else if (appointmentId) {
        getReviewForAppointment(appointmentId);
      }
    }
  }, [autoFetch, providerId, appointmentId, getProviderReviews, getReviewForAppointment]);

  const averageRating = useMemo(() => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return sum / reviews.length;
  }, [reviews]);

  const submit = useCallback(async (data: CreateReviewRequest) => {
    return await submitReview(data);
  }, [submitReview]);

  const createReview = useCallback(async (data: CreateReviewRequest) => {
    return await submitReview(data);
  }, [submitReview]);

  const fetchReviewsByPatient = useCallback(async (patientId: number, limit: number = 20, offset: number = 0) => {
    console.warn('fetchReviewsByPatient not available in new API');
    return [];
  }, []);

  const fetchReviewsByProvider = useCallback(async (providerId: number, limit: number = 20, offset: number = 0) => {
    await getProviderReviews(providerId, limit, offset);
    return reviews;
  }, [getProviderReviews, reviews]);

  const fetchProviderStats = useCallback(async (providerId: number) => {
    await getProviderReviews(providerId, 1, 0);
    if (providerReviews) {
      return {
        provider_name: '',
        average_rating: providerReviews.average_rating,
        total_reviews: providerReviews.review_count,
      };
    }
    return null;
  }, [getProviderReviews, providerReviews]);

  const providerStats = useMemo(() => {
    if (providerReviews) {
      return {
        provider_name: '',
        average_rating: providerReviews.average_rating,
        total_reviews: providerReviews.review_count,
      };
    }
    return null;
  }, [providerReviews]);

  return {
    reviews,
    providerReviews,
    currentReview,
    averageRating,
    isLoading,
    error,
    submitReview: submit,
    createReview,
    fetchReviewsByPatient,
    fetchReviewsByProvider,
    fetchProviderStats,
    providerStats,
    getProviderReviews,
    getReviewForAppointment,
    clearCurrentReview,
    clearError,
    reset,
  };
};