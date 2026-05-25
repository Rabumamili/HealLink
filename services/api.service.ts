// services/api.service.ts

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

export class ApiService {
  protected async get<T>(endpoint: string, headers?: HeadersInit): Promise<T> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...headers,
      },
    });
    if (!response.ok) throw new Error(`API Error: ${response.status}`);
    return response.json();
  }

  protected async post<T>(endpoint: string, data: any, headers?: HeadersInit): Promise<T> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...headers,
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error(`API Error: ${response.status}`);
    return response.json();
  }

  protected async put<T>(endpoint: string, data: any, headers?: HeadersInit): Promise<T> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...headers,
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error(`API Error: ${response.status}`);
    return response.json();
  }

  protected async patch<T>(endpoint: string, data: any, headers?: HeadersInit): Promise<T> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...headers,
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error(`API Error: ${response.status}`);
    return response.json();
  }

  // Fixed delete method - always returns the parsed JSON response
  protected async delete<T = void>(endpoint: string, headers?: HeadersInit): Promise<T> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...headers,
      },
    });
    if (!response.ok) throw new Error(`API Error: ${response.status}`);
    
    // Check if response has content before parsing JSON
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return response.json();
    }
    // Return empty object as T (which could be void, object, etc.)
    return {} as T;
  }

  protected async postFormData<T>(endpoint: string, formData: FormData, headers?: HeadersInit): Promise<T> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...headers,
      },
      body: formData,
    });
    if (!response.ok) throw new Error(`API Error: ${response.status}`);
    return response.json();
  }

  protected async putFormData<T>(endpoint: string, formData: FormData, headers?: HeadersInit): Promise<T> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers: {
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...headers,
      },
      body: formData,
    });
    if (!response.ok) throw new Error(`API Error: ${response.status}`);
    return response.json();
  }
}