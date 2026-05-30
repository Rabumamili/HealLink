// services/review.service.ts

import { ApiService } from './api.service';
import {
  Review,
  ReviewWithDetails,
  ReviewFilters,
  CreateReviewDTO,
  UpdateReviewDTO,
  ProviderReviewStats,
  PatientReviewStats,
  OverallReviewStats,
  ReviewListResponse,
  ReviewResponse
} from '@/types/entities/review.types';
import {
  mockReviews,
  mockReviewsWithPatient,
  mockProviderReviewStats,
  mockOverallReviewStats,
  filterMockReviews,
  getProviderReviewStats
} from './mock/review.mock';

class ReviewService extends ApiService {
  // Get all reviews with filters
  async getReviews(filters?: ReviewFilters, page: number = 1, limit: number = 10): Promise<ReviewListResponse> {
    try {
      const queryParams = new URLSearchParams();
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== 'all') {
            queryParams.append(key, value.toString());
          }
        });
      }
      queryParams.append('page', page.toString());
      queryParams.append('limit', limit.toString());
      
      const endpoint = `/reviews${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      return await this.get<ReviewListResponse>(endpoint);
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('Using mock data for getReviews:', error);
        
        let filtered = filterMockReviews(filters || {});
        const total = filtered.length;
        const start = (page - 1) * limit;
        const end = start + limit;
        const paginated = filtered.slice(start, end);
        
        const data = paginated.map(review => {
          const enriched = mockReviewsWithPatient.find(r => r.review_id === review.review_id);
          return enriched || { ...review, patient: undefined, provider: undefined };
        });
        
        const stats = filters?.provider_id 
          ? getProviderReviewStats(filters.provider_id)
          : undefined;
        
        return {
          success: true,
          data: data,
          pagination: {
            page,
            limit,
            total,
            total_pages: Math.ceil(total / limit)
          },
          stats
        };
      }
      throw error;
    }
  }

  // Get review by ID
  async getReviewById(id: number): Promise<ReviewWithDetails | null> {
    try {
      return await this.get<ReviewWithDetails>(`/reviews/${id}`);
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('Using mock data for getReviewById:', error);
        const review = mockReviewsWithPatient.find(r => r.review_id === id);
        return review || null;
      }
      throw error;
    }
  }

  // Get reviews by patient
  async getReviewsByPatient(patientId: number): Promise<ReviewWithDetails[]> {
    try {
      return await this.get<ReviewWithDetails[]>(`/reviews/patient/${patientId}`);
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('Using mock data for getReviewsByPatient:', error);
        return mockReviewsWithPatient.filter(r => r.patient_id === patientId);
      }
      throw error;
    }
  }

  // Get reviews by provider
  async getReviewsByProvider(providerId: number): Promise<ReviewWithDetails[]> {
    try {
      return await this.get<ReviewWithDetails[]>(`/reviews/provider/${providerId}`);
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('Using mock data for getReviewsByProvider:', error);
        return mockReviewsWithPatient.filter(r => r.provider_id === providerId);
      }
      throw error;
    }
  }

  // Get provider review statistics
  async getProviderReviewStats(providerId: number): Promise<ProviderReviewStats | null> {
    try {
      return await this.get<ProviderReviewStats>(`/reviews/stats/provider/${providerId}`);
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('Using mock data for getProviderReviewStats:', error);
        return getProviderReviewStats(providerId) || null;
      }
      throw error;
    }
  }

  // Get patient review statistics
  async getPatientReviewStats(patientId: number): Promise<PatientReviewStats | null> {
    try {
      return await this.get<PatientReviewStats>(`/reviews/stats/patient/${patientId}`);
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('Using mock data for getPatientReviewStats:', error);
        const reviews = mockReviews.filter(r => r.patient_id === patientId);
        const patient = mockReviewsWithPatient.find(r => r.patient_id === patientId)?.patient;
        
        if (reviews.length === 0) return null;
        
        let sum = 0;
        reviews.forEach(r => sum += r.rating);
        const avgRating = sum / reviews.length;
        
        return {
          patient_id: patientId,
          patient_name: patient ? `${patient.first_name} ${patient.last_name}` : "Unknown",
          total_reviews: reviews.length,
          average_rating_given: avgRating,
          recent_reviews: mockReviewsWithPatient.filter(r => r.patient_id === patientId)
        };
      }
      throw error;
    }
  }

  // Get overall review statistics
  async getOverallReviewStats(): Promise<OverallReviewStats> {
    try {
      return await this.get<OverallReviewStats>('/reviews/stats/overall');
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('Using mock data for getOverallReviewStats:', error);
        return mockOverallReviewStats;
      }
      throw error;
    }
  }

  // Create a new review
  async createReview(data: CreateReviewDTO): Promise<ReviewResponse> {
    try {
      return await this.post<ReviewResponse>('/reviews', data);
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('Using mock data for createReview:', error);
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const newReview: Review = {
          review_id: mockReviews.length + 1,
          patient_id: data.patient_id,
          provider_id: data.provider_id,
          rating: data.rating,
          comment: data.comment,
          created_at: new Date().toISOString()
        };
        
        mockReviews.push(newReview);
        
        return {
          success: true,
          data: newReview,
          message: "Review submitted successfully"
        };
      }
      throw error;
    }
  }

  // Update a review
  async updateReview(id: number, data: UpdateReviewDTO): Promise<ReviewResponse> {
    try {
      return await this.put<ReviewResponse>(`/reviews/${id}`, data);
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('Using mock data for updateReview:', error);
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const index = mockReviews.findIndex(r => r.review_id === id);
        if (index === -1) {
          return {
            success: false,
            message: "Review not found"
          };
        }
        
        mockReviews[index] = {
          ...mockReviews[index],
          ...data,
          rating: data.rating || mockReviews[index].rating,
          comment: data.comment || mockReviews[index].comment
        };
        
        return {
          success: true,
          data: mockReviews[index],
          message: "Review updated successfully"
        };
      }
      throw error;
    }
  }

  // Delete a review
  async deleteReview(id: number): Promise<{ success: boolean; message: string }> {
    try {
      return await this.delete<{ success: boolean; message: string }>(`/reviews/${id}`);
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('Using mock data for deleteReview:', error);
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const index = mockReviews.findIndex(r => r.review_id === id);
        if (index === -1) {
          return {
            success: false,
            message: "Review not found"
          };
        }
        
        mockReviews.splice(index, 1);
        
        return {
          success: true,
          message: "Review deleted successfully"
        };
      }
      throw error;
    }
  }

  // Check if patient can review a provider (after completed appointment)
  async canReview(patientId: number, providerId: number): Promise<{ canReview: boolean; message?: string }> {
    try {
      return await this.get<{ canReview: boolean; message?: string }>(
        `/reviews/can-review?patientId=${patientId}&providerId=${providerId}`
      );
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('Using mock data for canReview:', error);
        // Check if patient already reviewed this provider
        const existingReview = mockReviews.find(
          r => r.patient_id === patientId && r.provider_id === providerId
        );
        
        if (existingReview) {
          return {
            canReview: false,
            message: "You have already reviewed this provider"
          };
        }
        
        return {
          canReview: true,
          message: "You can submit a review"
        };
      }
      throw error;
    }
  }
}

export const reviewService = new ReviewService();