// services/review.service.ts
import { ApiService } from './api.service';

export interface CreateReviewRequest {
  appointment_id: number;
  rating: number;
  comment: string;
}

export interface Review {
  id: number;
  patient_id: number;
  provider_id: number;
  appointment_id: number;
  rating: number;
  comment: string;
  created_at: string;
}

export interface ProviderReviewsResponse {
  provider_id: number;
  average_rating: number;
  review_count: number;
  reviews: Review[];
}

class ReviewService extends ApiService {
  private readonly basePath = '/reviews';

  async submitReview(data: CreateReviewRequest): Promise<Review> {
    return this.post<Review>(this.basePath, data, undefined, false);
  }

  async getProviderReviews(providerId: number, limit: number = 20, offset: number = 0): Promise<ProviderReviewsResponse> {
    const queryParams = new URLSearchParams();
    queryParams.append('limit', limit.toString());
    queryParams.append('offset', offset.toString());

    return this.get<ProviderReviewsResponse>(`${this.basePath}/providers/${providerId}?${queryParams.toString()}`, undefined, false);
  }

  async getReviewForAppointment(appointmentId: number): Promise<Review> {
    return this.get<Review>(`${this.basePath}/appointments/${appointmentId}`, undefined, false);
  }
}

export const reviewService = new ReviewService();