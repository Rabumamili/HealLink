// types/entities/review.types.ts

import { PatientProfile, DoctorProfile, ClinicProfile, DiagnosticCenterProfile } from './profile.types';

// ===============================
// REVIEW STATUS (removed as requested)
// ===============================

// No status enum - reviews are directly visible when created

// ===============================
// REVIEW INTERFACE
// ===============================

export interface Review {
  review_id: number;
  patient_id: number;      // FK to Patient
  provider_id: number;     // FK to Doctor/Clinic/DiagnosticCenter
  rating: number;          // 1-5 rating
  comment: string;         // Review text
  created_at: string;      // ISO datetime
}

// ===============================
// REVIEW WITH RELATIONS
// ===============================

export interface ReviewWithPatient extends Review {
  patient?: {
    id: number;
    first_name: string;
    last_name: string;
    profile_photo?: string;
  };
}

export interface ReviewWithProvider extends Review {
  provider?: {
    id: number;
    name: string;
    provider_type: 'doctor' | 'clinic' | 'diagnostic_center';
    profile_photo?: string;
    logo_url?: string;
  };
}

export interface ReviewWithDetails extends ReviewWithPatient, ReviewWithProvider {}

// ===============================
// REVIEW DTOs
// ===============================

export interface CreateReviewDTO {
  patient_id: number;
  provider_id: number;
  rating: number;
  comment: string;
}

export interface UpdateReviewDTO {
  rating?: number;
  comment?: string;
}

// ===============================
// REVIEW FILTERS
// ===============================

export interface ReviewFilters {
  patient_id?: number;
  provider_id?: number;
  provider_type?: 'doctor' | 'clinic' | 'diagnostic_center';
  min_rating?: number;
  max_rating?: number;
  date_from?: string;
  date_to?: string;
  search_term?: string;  // Search in comment
}

// ===============================
// REVIEW STATISTICS
// ===============================

export interface RatingDistribution {
  1: number;
  2: number;
  3: number;
  4: number;
  5: number;
}

export interface ProviderReviewStats {
  provider_id: number;
  provider_name: string;
  provider_type: string;
  total_reviews: number;
  average_rating: number;
  rating_distribution: RatingDistribution;
  recent_reviews: ReviewWithPatient[];
}

export interface PatientReviewStats {
  patient_id: number;
  patient_name: string;
  total_reviews: number;
  average_rating_given: number;
  recent_reviews: ReviewWithProvider[];
}

export interface OverallReviewStats {
  total_reviews: number;
  overall_average_rating: number;
  rating_distribution: RatingDistribution;
  top_rated_providers: Array<{
    provider_id: number;
    provider_name: string;
    provider_type: string;
    average_rating: number;
    total_reviews: number;
  }>;
  most_active_reviewers: Array<{
    patient_id: number;
    patient_name: string;
    total_reviews: number;
  }>;
}

// ===============================
// REVIEW RESPONSES
// ===============================

export interface ReviewResponse {
  success: boolean;
  data?: Review | Review[];
  message?: string;
}

export interface ReviewListResponse {
  success: boolean;
  data: ReviewWithDetails[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
  stats?: ProviderReviewStats;
}

// ===============================
// REVIEW CONSTANTS
// ===============================

export const RATING_LABELS: Record<number, string> = {
  1: 'Poor',
  2: 'Fair',
  3: 'Good',
  4: 'Very Good',
  5: 'Excellent',
};

export const RATING_COLORS: Record<number, string> = {
  1: 'bg-red-500',
  2: 'bg-orange-500',
  3: 'bg-yellow-500',
  4: 'bg-blue-500',
  5: 'bg-green-500',
};

export const RATING_EMOJIS: Record<number, string> = {
  1: '😞',
  2: '😐',
  3: '🙂',
  4: '😊',
  5: '🌟',
};

// Helper function to get rating label
export function getRatingLabel(rating: number): string {
  return RATING_LABELS[rating] || 'Unknown';
}

// Helper function to get rating color
export function getRatingColor(rating: number): string {
  return RATING_COLORS[rating] || 'bg-gray-500';
}

// Helper function to get rating emoji
export function getRatingEmoji(rating: number): string {
  return RATING_EMOJIS[rating] || '⭐';
}