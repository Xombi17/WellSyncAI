// Simple API client wrapper for use-verification hook
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export const apiClient = {
  async post<T>(endpoint: string, data: any): Promise<{ data: T }> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    const url = `${API_URL}/api/v1${cleanEndpoint}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Unknown error' }));
      throw new Error(error.detail || `API error: ${response.status}`);
    }

    const responseData = await response.json();
    return { data: responseData };
  },

  async get<T>(endpoint: string): Promise<{ data: T }> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    const url = `${API_URL}/api/v1${cleanEndpoint}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Unknown error' }));
      throw new Error(error.detail || `API error: ${response.status}`);
    }

    const responseData = await response.json();
    return { data: responseData };
  },
};
