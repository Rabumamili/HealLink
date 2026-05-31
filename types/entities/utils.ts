// types/utils.ts

// Helper to make specific fields required
export type WithRequired<T, K extends keyof T> = T & { [P in K]-?: T[P] };

// Helper to make specific fields optional
export type WithOptional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

// API Response wrapper
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  statusCode: number;
}

// Pagination types
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// Date range type
export interface DateRange {
  startDate: string;
  endDate: string;
}

// Validation result type
export interface ValidationResult {
  isValid: boolean;
  errors?: Record<string, string[]>;
}