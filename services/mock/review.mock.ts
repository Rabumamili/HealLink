// services/mock/review.mock.ts

import { Review, ReviewWithDetails, ReviewFilters, ProviderReviewStats, PatientReviewStats, OverallReviewStats, RatingDistribution } from '@/types/entities/review.types';

// Mock Reviews
export const mockReviews: Review[] = [
  {
    review_id: 1,
    patient_id: 201,
    provider_id: 101, // Dr. Abraham Yosef
    rating: 5,
    comment: "Excellent doctor! Very thorough and caring. Would highly recommend.",
    created_at: "2026-02-01T10:30:00Z"
  },
  {
    review_id: 2,
    patient_id: 202,
    provider_id: 101,
    rating: 4,
    comment: "Good experience overall. Wait time was a bit long but doctor was great.",
    created_at: "2026-02-05T14:20:00Z"
  },
  {
    review_id: 3,
    patient_id: 203,
    provider_id: 102, // Dr. Selam Tesfaye
    rating: 5,
    comment: "Amazing pediatrician! My kids love her. Very patient and knowledgeable.",
    created_at: "2026-02-10T09:15:00Z"
  },
  {
    review_id: 4,
    patient_id: 201,
    provider_id: 103, // Bethel Medical Center
    rating: 4,
    comment: "Clean facility, friendly staff. Vaccination process was smooth.",
    created_at: "2026-02-12T11:00:00Z"
  },
  {
    review_id: 5,
    patient_id: 204,
    provider_id: 104, // Addis Diagnostic Center
    rating: 5,
    comment: "Very professional lab. Results came quickly and staff was helpful.",
    created_at: "2026-02-15T08:45:00Z"
  },
  {
    review_id: 6,
    patient_id: 202,
    provider_id: 105, // Dr. Tewodros Mulugeta
    rating: 5,
    comment: "Excellent cardiologist! Explained everything clearly. Highly recommend.",
    created_at: "2026-02-18T13:30:00Z"
  },
  {
    review_id: 7,
    patient_id: 205,
    provider_id: 106, // Dr. Hanna Gebremariam
    rating: 4,
    comment: "Good dermatologist. Skin cleared up after treatment.",
    created_at: "2026-02-20T10:00:00Z"
  },
  {
    review_id: 8,
    patient_id: 203,
    provider_id: 107, // Roha Medical Center
    rating: 3,
    comment: "Decent clinic but long wait times. Staff was friendly though.",
    created_at: "2026-02-22T15:45:00Z"
  },
  {
    review_id: 9,
    patient_id: 206,
    provider_id: 108, // Selam Diagnostic Lab
    rating: 5,
    comment: "Fast and accurate results. Very professional setup.",
    created_at: "2026-02-25T09:30:00Z"
  },
  {
    review_id: 10,
    patient_id: 207,
    provider_id: 101,
    rating: 5,
    comment: "Dr. Abraham is the best! Saved my life. Forever grateful.",
    created_at: "2026-02-28T11:20:00Z"
  }
];

// Mock Reviews with Patient Details (using undefined instead of null)
export const mockReviewsWithPatient: ReviewWithDetails[] = [
  {
    ...mockReviews[0],
    patient: {
      id: 201,
      first_name: "Abebe",
      last_name: "Kebede",
      profile_photo: undefined
    },
    provider: {
      id: 101,
      name: "Dr. Abraham Yosef",
      provider_type: "doctor",
      profile_photo: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=100&h=100&fit=crop"
    }
  },
  {
    ...mockReviews[1],
    patient: {
      id: 202,
      first_name: "Tigist",
      last_name: "Haile",
      profile_photo: undefined
    },
    provider: {
      id: 101,
      name: "Dr. Abraham Yosef",
      provider_type: "doctor",
      profile_photo: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=100&h=100&fit=crop"
    }
  },
  {
    ...mockReviews[2],
    patient: {
      id: 203,
      first_name: "Michael",
      last_name: "Brown",
      profile_photo: undefined
    },
    provider: {
      id: 102,
      name: "Dr. Selam Tesfaye",
      provider_type: "doctor",
      profile_photo: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=100&h=100&fit=crop"
    }
  },
  {
    ...mockReviews[3],
    patient: {
      id: 201,
      first_name: "Abebe",
      last_name: "Kebede",
      profile_photo: undefined
    },
    provider: {
      id: 103,
      name: "Bethel Medical Center",
      provider_type: "clinic",
      logo_url: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=100&h=100&fit=crop"
    }
  },
  {
    ...mockReviews[4],
    patient: {
      id: 204,
      first_name: "Emily",
      last_name: "Davis",
      profile_photo: undefined
    },
    provider: {
      id: 104,
      name: "Addis Diagnostic Center",
      provider_type: "diagnostic_center",
      logo_url: "https://images.unsplash.com/photo-1579154204601-0158f351e67f?w=100&h=100&fit=crop"
    }
  },
  {
    ...mockReviews[5],
    patient: {
      id: 202,
      first_name: "Tigist",
      last_name: "Haile",
      profile_photo: undefined
    },
    provider: {
      id: 105,
      name: "Dr. Tewodros Mulugeta",
      provider_type: "doctor",
      profile_photo: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=100&h=100&fit=crop"
    }
  },
  {
    ...mockReviews[6],
    patient: {
      id: 205,
      first_name: "David",
      last_name: "Wilson",
      profile_photo: undefined
    },
    provider: {
      id: 106,
      name: "Dr. Hanna Gebremariam",
      provider_type: "doctor",
      profile_photo: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100&h=100&fit=crop"
    }
  },
  {
    ...mockReviews[7],
    patient: {
      id: 203,
      first_name: "Michael",
      last_name: "Brown",
      profile_photo: undefined
    },
    provider: {
      id: 107,
      name: "Roha Medical Center",
      provider_type: "clinic",
      logo_url: "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=100&h=100&fit=crop"
    }
  },
  {
    ...mockReviews[8],
    patient: {
      id: 206,
      first_name: "Lisa",
      last_name: "Anderson",
      profile_photo: undefined
    },
    provider: {
      id: 108,
      name: "Selam Diagnostic Lab",
      provider_type: "diagnostic_center",
      logo_url: "https://images.unsplash.com/photo-1581595219319-a1f4f5acf069?w=100&h=100&fit=crop"
    }
  },
  {
    ...mockReviews[9],
    patient: {
      id: 207,
      first_name: "Robert",
      last_name: "Taylor",
      profile_photo: undefined
    },
    provider: {
      id: 101,
      name: "Dr. Abraham Yosef",
      provider_type: "doctor",
      profile_photo: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=100&h=100&fit=crop"
    }
  }
];

// Provider Review Statistics
export const mockProviderReviewStats: ProviderReviewStats[] = [
  {
    provider_id: 101,
    provider_name: "Dr. Abraham Yosef",
    provider_type: "doctor",
    total_reviews: 3,
    average_rating: 4.67,
    rating_distribution: { 1: 0, 2: 0, 3: 0, 4: 1, 5: 2 },
    recent_reviews: mockReviewsWithPatient.filter(r => r.provider_id === 101)
  },
  {
    provider_id: 102,
    provider_name: "Dr. Selam Tesfaye",
    provider_type: "doctor",
    total_reviews: 1,
    average_rating: 5.0,
    rating_distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 1 },
    recent_reviews: mockReviewsWithPatient.filter(r => r.provider_id === 102)
  },
  {
    provider_id: 103,
    provider_name: "Bethel Medical Center",
    provider_type: "clinic",
    total_reviews: 1,
    average_rating: 4.0,
    rating_distribution: { 1: 0, 2: 0, 3: 0, 4: 1, 5: 0 },
    recent_reviews: mockReviewsWithPatient.filter(r => r.provider_id === 103)
  },
  {
    provider_id: 104,
    provider_name: "Addis Diagnostic Center",
    provider_type: "diagnostic_center",
    total_reviews: 1,
    average_rating: 5.0,
    rating_distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 1 },
    recent_reviews: mockReviewsWithPatient.filter(r => r.provider_id === 104)
  }
];

// Overall Review Statistics
export const mockOverallReviewStats: OverallReviewStats = {
  total_reviews: 10,
  overall_average_rating: 4.5,
  rating_distribution: {
    1: 0,
    2: 0,
    3: 1,
    4: 3,
    5: 6
  },
  top_rated_providers: [
    { provider_id: 102, provider_name: "Dr. Selam Tesfaye", provider_type: "doctor", average_rating: 5.0, total_reviews: 1 },
    { provider_id: 104, provider_name: "Addis Diagnostic Center", provider_type: "diagnostic_center", average_rating: 5.0, total_reviews: 1 },
    { provider_id: 105, provider_name: "Dr. Tewodros Mulugeta", provider_type: "doctor", average_rating: 5.0, total_reviews: 1 },
    { provider_id: 101, provider_name: "Dr. Abraham Yosef", provider_type: "doctor", average_rating: 4.67, total_reviews: 3 },
    { provider_id: 106, provider_name: "Dr. Hanna Gebremariam", provider_type: "doctor", average_rating: 4.0, total_reviews: 1 }
  ],
  most_active_reviewers: [
    { patient_id: 201, patient_name: "Abebe Kebede", total_reviews: 2 },
    { patient_id: 202, patient_name: "Tigist Haile", total_reviews: 2 },
    { patient_id: 203, patient_name: "Michael Brown", total_reviews: 2 }
  ]
};

// Helper function to filter reviews
export const filterMockReviews = (filters: ReviewFilters): Review[] => {
  return mockReviews.filter(review => {
    if (filters.patient_id && review.patient_id !== filters.patient_id) {
      return false;
    }
    if (filters.provider_id && review.provider_id !== filters.provider_id) {
      return false;
    }
    if (filters.min_rating && review.rating < filters.min_rating) {
      return false;
    }
    if (filters.max_rating && review.rating > filters.max_rating) {
      return false;
    }
    if (filters.date_from && review.created_at < filters.date_from) {
      return false;
    }
    if (filters.date_to && review.created_at > filters.date_to) {
      return false;
    }
    if (filters.search_term) {
      const searchLower = filters.search_term.toLowerCase();
      if (!review.comment.toLowerCase().includes(searchLower)) {
        return false;
      }
    }
    return true;
  });
};

// Get provider review stats
export const getProviderReviewStats = (providerId: number): ProviderReviewStats | undefined => {
  const reviews = mockReviews.filter(r => r.provider_id === providerId);
  if (reviews.length === 0) return undefined;
  
  const distribution: RatingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  let sum = 0;
  
  reviews.forEach(review => {
    distribution[review.rating as keyof RatingDistribution]++;
    sum += review.rating;
  });
  
  const avgRating = sum / reviews.length;
  const provider = mockReviewsWithPatient.find(r => r.provider_id === providerId)?.provider;
  
  return {
    provider_id: providerId,
    provider_name: provider?.name || "Unknown",
    provider_type: provider?.provider_type || "doctor",
    total_reviews: reviews.length,
    average_rating: avgRating,
    rating_distribution: distribution,
    recent_reviews: mockReviewsWithPatient.filter(r => r.provider_id === providerId)
  };
};