// services/api.service.ts

import { parseApiErrorResponse } from '@/lib/api-error';

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

export class ApiService {
  private getAuthHeaders(includeAuth = true): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (includeAuth && typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
    }

    return headers;
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      await parseApiErrorResponse(response);
    }

    const contentType = response.headers.get('content-type');
    if (contentType?.includes('application/json')) {
      return response.json();
    }

    return {} as T;
  }

  protected async get<T>(endpoint: string, headers?: HeadersInit, includeAuth = true): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'GET',
      headers: {
        ...this.getAuthHeaders(includeAuth),
        ...headers,
      },
    });

    return this.handleResponse<T>(response);
  }

  protected async post<T>(
    endpoint: string,
    data?: unknown,
    headers?: HeadersInit,
    includeAuth = true
  ): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        ...this.getAuthHeaders(includeAuth),
        ...headers,
      },
      body: data !== undefined ? JSON.stringify(data) : undefined,
    });

    return this.handleResponse<T>(response);
  }

  protected async put<T>(endpoint: string, data: unknown, headers?: HeadersInit): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers: {
        ...this.getAuthHeaders(),
        ...headers,
      },
      body: JSON.stringify(data),
    });

    return this.handleResponse<T>(response);
  }

  protected async patch<T>(endpoint: string, data: unknown, headers?: HeadersInit): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PATCH',
      headers: {
        ...this.getAuthHeaders(),
        ...headers,
      },
      body: JSON.stringify(data),
    });

    return this.handleResponse<T>(response);
  }

  protected async delete<T = void>(endpoint: string, headers?: HeadersInit): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers: {
        ...this.getAuthHeaders(),
        ...headers,
      },
    });

    return this.handleResponse<T>(response);
  }

  protected async postFormData<T>(endpoint: string, formData: FormData, headers?: HeadersInit): Promise<T> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
        ...headers,
      },
      body: formData,
    });

    return this.handleResponse<T>(response);
  }

  protected async putFormData<T>(endpoint: string, formData: FormData, headers?: HeadersInit): Promise<T> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
        ...headers,
      },
      body: formData,
    });

    return this.handleResponse<T>(response);
  }
}
