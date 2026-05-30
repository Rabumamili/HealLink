// hooks/useReview.ts - Updated

import { useCallback, useEffect, useMemo } from 'react';
import { useReviewStore } from '@/stores/slices/reviewSlice';
import {
  ReviewFilters,
  CreateReviewDTO,
  UpdateReviewDTO,
  RatingDistribution
} from '@/types/entities/review.types';

interface UseReviewOptions {
  autoFetch?: boolean;
  autoFetchStats?: boolean;
  filters?: ReviewFilters;
  providerId?: number;
  patientId?: number;
}

export const useReview = (options: UseReviewOptions = {}) => {
  const {
    reviews,
    currentReview,
    providerStats,
    patientStats,
    overallStats,
    isLoading,
    error,
    filters,
    pagination,
    fetchReviews,
    fetchReviewById,
    fetchReviewsByPatient,
    fetchReviewsByProvider,
    fetchProviderStats,
    fetchPatientStats,
    fetchOverallStats,
    createReview,
    updateReview,
    deleteReview,
    canReview,
    clearCurrentReview,
    setFilters,
    clearError,
    reset
  } = useReviewStore();

  // Auto-fetch reviews on mount if enabled
  useEffect(() => {
    if (options.autoFetch) {
      fetchReviews(options.filters);
    }
  }, [options.autoFetch, options.filters, fetchReviews]);

  // Auto-fetch provider stats if providerId provided
  useEffect(() => {
    if (options.autoFetchStats && options.providerId) {
      fetchProviderStats(options.providerId);
    }
  }, [options.autoFetchStats, options.providerId, fetchProviderStats]);

  // Auto-fetch patient stats if patientId provided
  useEffect(() => {
    if (options.autoFetchStats && options.patientId) {
      fetchPatientStats(options.patientId);
    }
  }, [options.autoFetchStats, options.patientId, fetchPatientStats]);

  // Auto-fetch overall stats if enabled
  useEffect(() => {
    if (options.autoFetchStats && !options.providerId && !options.patientId) {
      fetchOverallStats();
    }
  }, [options.autoFetchStats, options.providerId, options.patientId, fetchOverallStats]);

  // Computed values
  const averageRating = useMemo(() => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return sum / reviews.length;
  }, [reviews]);

  const ratingDistribution = useMemo(() => {
    const distribution: RatingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    reviews.forEach(review => {
      distribution[review.rating as keyof RatingDistribution]++;
    });
    return distribution;
  }, [reviews]);

  const fiveStarPercentage = useMemo(() => {
    if (reviews.length === 0) return 0;
    return (ratingDistribution[5] / reviews.length) * 100;
  }, [ratingDistribution, reviews.length]);

  const fourStarPercentage = useMemo(() => {
    if (reviews.length === 0) return 0;
    return (ratingDistribution[4] / reviews.length) * 100;
  }, [ratingDistribution, reviews.length]);

  // Actions
  const filterByProvider = useCallback((providerId: number) => {
    setFilters({ ...filters, provider_id: providerId });
  }, [filters, setFilters]);

  const filterByPatient = useCallback((patientId: number) => {
    setFilters({ ...filters, patient_id: patientId });
  }, [filters, setFilters]);

  const filterByRating = useCallback((minRating?: number, maxRating?: number) => {
    setFilters({ ...filters, min_rating: minRating, max_rating: maxRating });
  }, [filters, setFilters]);

  const filterByDateRange = useCallback((dateFrom?: string, dateTo?: string) => {
    setFilters({ ...filters, date_from: dateFrom, date_to: dateTo });
  }, [filters, setFilters]);

  const searchReviews = useCallback((searchTerm: string) => {
    setFilters({ ...filters, search_term: searchTerm || undefined });
  }, [filters, setFilters]);

  const clearFilters = useCallback(() => {
    setFilters({});
  }, [setFilters]);

  const submitReview = useCallback(async (data: CreateReviewDTO) => {
    return await createReview(data);
  }, [createReview]);

  const editReview = useCallback(async (id: number, data: UpdateReviewDTO) => {
    return await updateReview(id, data);
  }, [updateReview]);

  const removeReview = useCallback(async (id: number) => {
    return await deleteReview(id);
  }, [deleteReview]);

  const checkCanReview = useCallback(async (patientId: number, providerId: number) => {
    return await canReview(patientId, providerId);
  }, [canReview]);

  const loadProviderReviews = useCallback((providerId: number) => {
    fetchReviewsByProvider(providerId);
  }, [fetchReviewsByProvider]);

  const loadPatientReviews = useCallback((patientId: number) => {
    fetchReviewsByPatient(patientId);
  }, [fetchReviewsByPatient]);

  return {
    // State
    reviews,
    currentReview,
    providerStats,
    patientStats,
    overallStats,
    isLoading,
    error,
    filters,
    pagination,
    
    // Computed
    averageRating,
    ratingDistribution,
    fiveStarPercentage,
    fourStarPercentage,
    totalReviews: reviews.length,
    
    // Actions - Full store actions
    fetchReviews,
    fetchReviewById,
    fetchReviewsByPatient,
    fetchReviewsByProvider,
    fetchProviderStats,
    fetchPatientStats,
    fetchOverallStats,
    createReview: submitReview,
    updateReview: editReview,
    deleteReview: removeReview,
    canReview: checkCanReview,
    
    // Filter actions
    filterByProvider,
    filterByPatient,
    filterByRating,
    filterByDateRange,
    searchReviews,
    clearFilters,
    
    // Convenience actions
    loadProviderReviews,
    loadPatientReviews,
    clearCurrentReview,
    setFilters,
    clearError,
    reset
  };
};

// Specialized hook for provider reviews
export const useProviderReviews = (providerId: number, autoFetch: boolean = true) => {
  const {
    reviews,
    providerStats,
    isLoading,
    fetchReviewsByProvider,
    fetchProviderStats,
    deleteReview,
    updateReview
  } = useReviewStore();

  useEffect(() => {
    if (autoFetch && providerId) {
      fetchReviewsByProvider(providerId);
      fetchProviderStats(providerId);
    }
  }, [autoFetch, providerId, fetchReviewsByProvider, fetchProviderStats]);

  // Filter reviews to only show this provider's reviews
  const providerReviews = reviews.filter(r => r.provider_id === providerId);

  return {
    reviews: providerReviews,
    stats: providerStats,
    isLoading,
    refresh: () => {
      fetchReviewsByProvider(providerId);
      fetchProviderStats(providerId);
    },
    deleteReview,
    updateReview
  };
};

// Specialized hook for patient reviews
export const usePatientReviews = (patientId: number, autoFetch: boolean = true) => {
  const {
    reviews,
    patientStats,
    isLoading,
    fetchReviewsByPatient,
    fetchPatientStats,
    deleteReview,
    updateReview,
    createReview
  } = useReviewStore();

  useEffect(() => {
    if (autoFetch && patientId) {
      fetchReviewsByPatient(patientId);
      fetchPatientStats(patientId);
    }
  }, [autoFetch, patientId, fetchReviewsByPatient, fetchPatientStats]);

  // Filter reviews to only show this patient's reviews
  const patientReviews = reviews.filter(r => r.patient_id === patientId);

  return {
    reviews: patientReviews,
    stats: patientStats,
    isLoading,
    refresh: () => {
      fetchReviewsByPatient(patientId);
      fetchPatientStats(patientId);
    },
    deleteReview,
    updateReview,
    createReview
  };
};

// Specialized hook for review submission
export const useReviewSubmission = () => {
  const { createReview, canReview, isLoading } = useReviewStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitWithCheck = useCallback(async (
    patientId: number,
    providerId: number,
    rating: number,
    comment: string
  ) => {
    const check = await canReview(patientId, providerId);
    if (!check.canReview) {
      return { success: false, message: check.message };
    }

    setIsSubmitting(true);
    const result = await createReview({
      patient_id: patientId,
      provider_id: providerId,
      rating,
      comment
    });
    setIsSubmitting(false);

    return { success: result, message: result ? 'Review submitted successfully' : 'Failed to submit review' };
  }, [canReview, createReview]);

  return {
    submitReview: submitWithCheck,
    isSubmitting: isSubmitting || isLoading
  };
};

import { useState } from 'react';