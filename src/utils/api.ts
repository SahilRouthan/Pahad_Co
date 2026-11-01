import {
  InquiryFormData,
  CustomerReview,
  FeedbackItem,
  ClientQueryItem,
  GalleryImageItem,
  AdminStats,
  AdminUser
} from '../types';

const API_BASE = '/api';

export function getAuthToken(): string | null {
  return localStorage.getItem('pahad_admin_token');
}

export function setAuthToken(token: string): void {
  localStorage.setItem('pahad_admin_token', token);
}

export function removeAuthToken(): void {
  localStorage.removeItem('pahad_admin_token');
}

async function fetchJSON<T>(url: string, options: RequestInit = {}): Promise<T> {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string> || {})
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // If not FormData, default to application/json
  if (!(options.body instanceof FormData) && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  const response = await fetch(`${API_BASE}${url}`, {
    ...options,
    headers
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || `Request failed with status ${response.status}`);
  }

  return data;
}

export const api = {
  // Queries
  queries: {
    submit: (formData: InquiryFormData) =>
      fetchJSON<{ success: boolean; id: number; message: string }>('/queries', {
        method: 'POST',
        body: JSON.stringify(formData)
      }),
    getAll: (params?: { status?: string; search?: string }) => {
      const q = new URLSearchParams();
      if (params?.status) q.append('status', params.status);
      if (params?.search) q.append('search', params.search);
      return fetchJSON<{ success: boolean; count: number; data: ClientQueryItem[] }>(`/queries?${q.toString()}`);
    },
    update: (id: number, data: { status?: string; adminNotes?: string }) =>
      fetchJSON<{ success: boolean; message: string }>(`/queries/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data)
      }),
    delete: (id: number) =>
      fetchJSON<{ success: boolean; message: string }>(`/queries/${id}`, {
        method: 'DELETE'
      })
  },

  // Customer Reviews
  reviews: {
    getApproved: () =>
      fetchJSON<{ success: boolean; count: number; data: CustomerReview[] }>('/reviews'),
    submit: (review: {
      name: string;
      rating: number;
      reviewText: string;
      eventType?: string;
      eventLocation?: string;
    }) =>
      fetchJSON<{ success: boolean; id: number; message: string }>('/reviews', {
        method: 'POST',
        body: JSON.stringify(review)
      }),
    getAll: (status?: string) => {
      const q = status ? `?status=${status}` : '';
      return fetchJSON<{ success: boolean; count: number; data: CustomerReview[] }>(`/reviews/all${q}`);
    },
    updateStatus: (id: number, status: 'approved' | 'rejected' | 'pending') =>
      fetchJSON<{ success: boolean; message: string }>(`/reviews/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status })
      }),
    delete: (id: number) =>
      fetchJSON<{ success: boolean; message: string }>(`/reviews/${id}`, {
        method: 'DELETE'
      })
  },

  // Feedback
  feedback: {
    submit: (feedback: {
      name: string;
      contact: string;
      rating: number;
      category: string;
      message: string;
    }) =>
      fetchJSON<{ success: boolean; id: number; message: string }>('/feedback', {
        method: 'POST',
        body: JSON.stringify(feedback)
      }),
    getAll: (params?: { category?: string; rating?: string; status?: string }) => {
      const q = new URLSearchParams();
      if (params?.category) q.append('category', params.category);
      if (params?.rating) q.append('rating', params.rating);
      if (params?.status) q.append('status', params.status);
      return fetchJSON<{ success: boolean; count: number; data: FeedbackItem[] }>(`/feedback?${q.toString()}`);
    },
    update: (id: number, data: { status?: string; adminNotes?: string }) =>
      fetchJSON<{ success: boolean; message: string }>(`/feedback/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data)
      }),
    delete: (id: number) =>
      fetchJSON<{ success: boolean; message: string }>(`/feedback/${id}`, {
        method: 'DELETE'
      })
  },

  // Gallery
  gallery: {
    getAll: (category?: string) => {
      const q = category && category !== 'All' ? `?category=${encodeURIComponent(category)}` : '';
      return fetchJSON<{ success: boolean; count: number; data: GalleryImageItem[] }>(`/gallery${q}`);
    },
    add: (body: FormData | Record<string, unknown>) => {
      const isFormData = body instanceof FormData;
      return fetchJSON<{ success: boolean; id: number; imageUrl: string; message: string }>('/gallery', {
        method: 'POST',
        body: isFormData ? body : JSON.stringify(body)
      });
    },
    update: (id: number, data: Partial<GalleryImageItem>) =>
      fetchJSON<{ success: boolean; message: string }>(`/gallery/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
      }),
    delete: (id: number) =>
      fetchJSON<{ success: boolean; message: string }>(`/gallery/${id}`, {
        method: 'DELETE'
      })
  },

  // Admin
  admin: {
    login: (username: string, password: string) =>
      fetchJSON<{ success: boolean; token: string; admin: AdminUser; message: string }>('/admin/login', {
        method: 'POST',
        body: JSON.stringify({ username, password })
      }),
    getMe: () =>
      fetchJSON<{ success: boolean; user: AdminUser }>('/admin/me'),
    getStats: () =>
      fetchJSON<{ success: boolean; stats: AdminStats }>('/admin/stats'),
    changePassword: (currentPassword: string, newPassword: string) =>
      fetchJSON<{ success: boolean; message: string }>('/admin/change-password', {
        method: 'POST',
        body: JSON.stringify({ currentPassword, newPassword })
      })
  }
};
