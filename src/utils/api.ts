import {
  InquiryFormData,
  CustomerReview,
  FeedbackItem,
  ClientQueryItem,
  GalleryImageItem,
  AdminStats,
  AdminUser
} from '../types';
import {
  isSupabaseConfigured,
  inquiriesApi,
  reviewsApi,
  galleryApi,
  feedbackApi,
  adminAuthApi
} from './supabase';

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
  // Client Queries / Inquiries
  queries: {
    submit: async (formData: InquiryFormData): Promise<{ success: boolean; id: string | number; message: string }> => {
      if (isSupabaseConfigured()) {
        const res = await inquiriesApi.submit(formData);
        return { success: true, id: res.id || 'new', message: res.message };
      }
      return fetchJSON<{ success: boolean; id: number; message: string }>('/queries', {
        method: 'POST',
        body: JSON.stringify(formData)
      });
    },

    getAll: async (params?: { status?: string; search?: string }): Promise<{ success: boolean; count: number; data: ClientQueryItem[] }> => {
      if (isSupabaseConfigured()) {
        const data = await inquiriesApi.getAll(params);
        return { success: true, count: data.length, data };
      }
      const q = new URLSearchParams();
      if (params?.status) q.append('status', params.status);
      if (params?.search) q.append('search', params.search);
      return fetchJSON<{ success: boolean; count: number; data: ClientQueryItem[] }>(`/queries?${q.toString()}`);
    },

    update: async (id: string | number, data: { status?: string; adminNotes?: string }): Promise<{ success: boolean; message: string }> => {
      if (isSupabaseConfigured()) {
        await inquiriesApi.updateStatus(id, data.status || 'new', data.adminNotes);
        return { success: true, message: 'Inquiry status updated successfully.' };
      }
      return fetchJSON<{ success: boolean; message: string }>(`/queries/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data)
      });
    },

    delete: async (id: string | number): Promise<{ success: boolean; message: string }> => {
      if (isSupabaseConfigured()) {
        await inquiriesApi.delete(id);
        return { success: true, message: 'Inquiry deleted successfully.' };
      }
      return fetchJSON<{ success: boolean; message: string }>(`/queries/${id}`, {
        method: 'DELETE'
      });
    }
  },

  // Customer Reviews
  reviews: {
    getApproved: async (): Promise<{ success: boolean; count: number; data: CustomerReview[] }> => {
      if (isSupabaseConfigured()) {
        const data = await reviewsApi.getApproved();
        return { success: true, count: data.length, data };
      }
      return fetchJSON<{ success: boolean; count: number; data: CustomerReview[] }>('/reviews');
    },

    submit: async (review: {
      name: string;
      rating: number;
      reviewText: string;
      eventType?: string;
      eventLocation?: string;
    }): Promise<{ success: boolean; id: string | number; message: string }> => {
      if (isSupabaseConfigured()) {
        const res = await reviewsApi.submit({
          customer_name: review.name,
          rating: review.rating,
          review_text: review.reviewText,
          event_type: review.eventType,
          event_location: review.eventLocation
        });
        return { success: true, id: res.id || 'new', message: res.message };
      }
      return fetchJSON<{ success: boolean; id: number; message: string }>('/reviews', {
        method: 'POST',
        body: JSON.stringify(review)
      });
    },

    getAll: async (status?: string): Promise<{ success: boolean; count: number; data: CustomerReview[] }> => {
      if (isSupabaseConfigured()) {
        const data = await reviewsApi.getAll(status);
        return { success: true, count: data.length, data };
      }
      const q = status ? `?status=${status}` : '';
      return fetchJSON<{ success: boolean; count: number; data: CustomerReview[] }>(`/reviews/all${q}`);
    },

    updateStatus: async (id: string | number, status: 'approved' | 'rejected' | 'pending'): Promise<{ success: boolean; message: string }> => {
      if (isSupabaseConfigured()) {
        await reviewsApi.updateStatus(id, status);
        return { success: true, message: `Review ${status} successfully.` };
      }
      return fetchJSON<{ success: boolean; message: string }>(`/reviews/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status })
      });
    },

    delete: async (id: string | number): Promise<{ success: boolean; message: string }> => {
      if (isSupabaseConfigured()) {
        await reviewsApi.delete(id);
        return { success: true, message: 'Review deleted successfully.' };
      }
      return fetchJSON<{ success: boolean; message: string }>(`/reviews/${id}`, {
        method: 'DELETE'
      });
    }
  },

  // Feedback
  feedback: {
    submit: async (feedback: {
      name: string;
      contact: string;
      rating: number;
      category: string;
      message: string;
    }): Promise<{ success: boolean; id: string | number; message: string }> => {
      if (isSupabaseConfigured()) {
        const res = await feedbackApi.submit({
          customer_name: feedback.name,
          email: feedback.contact,
          feedback_type: feedback.category,
          rating: feedback.rating,
          message: feedback.message
        });
        return { success: true, id: res.id || 'new', message: res.message };
      }
      return fetchJSON<{ success: boolean; id: number; message: string }>('/feedback', {
        method: 'POST',
        body: JSON.stringify(feedback)
      });
    },

    getAll: async (params?: { category?: string; rating?: string; status?: string }): Promise<{ success: boolean; count: number; data: FeedbackItem[] }> => {
      if (isSupabaseConfigured()) {
        const data = await feedbackApi.getAll(params?.status);
        return { success: true, count: data.length, data };
      }
      const q = new URLSearchParams();
      if (params?.category) q.append('category', params.category);
      if (params?.rating) q.append('rating', params.rating);
      if (params?.status) q.append('status', params.status);
      return fetchJSON<{ success: boolean; count: number; data: FeedbackItem[] }>(`/feedback?${q.toString()}`);
    },

    update: async (id: string | number, data: { status?: string; adminNotes?: string }): Promise<{ success: boolean; message: string }> => {
      if (isSupabaseConfigured()) {
        await feedbackApi.update(id, { status: data.status, admin_notes: data.adminNotes });
        return { success: true, message: 'Feedback updated successfully.' };
      }
      return fetchJSON<{ success: boolean; message: string }>(`/feedback/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data)
      });
    },

    delete: async (id: string | number): Promise<{ success: boolean; message: string }> => {
      if (isSupabaseConfigured()) {
        await feedbackApi.delete(id);
        return { success: true, message: 'Feedback deleted successfully.' };
      }
      return fetchJSON<{ success: boolean; message: string }>(`/feedback/${id}`, {
        method: 'DELETE'
      });
    }
  },

  // Gallery
  gallery: {
    getAll: async (category?: string): Promise<{ success: boolean; count: number; data: GalleryImageItem[] }> => {
      if (isSupabaseConfigured()) {
        const data = await galleryApi.getAll(category);
        return { success: true, count: data.length, data };
      }
      const q = category && category !== 'All' ? `?category=${encodeURIComponent(category)}` : '';
      return fetchJSON<{ success: boolean; count: number; data: GalleryImageItem[] }>(`/gallery${q}`);
    },

    add: async (body: FormData | Record<string, unknown>): Promise<{ success: boolean; id: string | number; imageUrl: string; message: string }> => {
      if (isSupabaseConfigured()) {
        if (body instanceof FormData) {
          const file = body.get('image') as File | null;
          const title = (body.get('title') as string) || 'Gallery Photograph';
          const description = (body.get('caption') as string) || (body.get('description') as string) || '';
          const category = (body.get('category') as string) || 'Weddings';
          const displayOrder = parseInt((body.get('display_order') as string) || '0', 10);

          let imageUrl = (body.get('image_url') as string) || '';
          let storagePath: string | undefined = undefined;

          if (file && file.size > 0) {
            const uploadRes = await galleryApi.uploadImageFile(file);
            imageUrl = uploadRes.publicUrl;
            storagePath = uploadRes.storagePath;
          }

          if (!imageUrl) {
            throw new Error('Please select an image file or provide an image URL.');
          }

          const created = await galleryApi.add({
            image_url: imageUrl,
            title,
            description,
            category,
            display_order: displayOrder,
            storage_path: storagePath
          });

          return {
            success: true,
            id: created.id,
            imageUrl: created.image_url || '',
            message: 'Gallery image uploaded and published to Supabase.'
          };
        } else {
          const record = body as Record<string, any>;
          const created = await galleryApi.add({
            image_url: record.image_url || record.imageUrl,
            title: record.title,
            description: record.caption || record.description,
            category: record.category || 'Weddings',
            display_order: record.display_order || 0
          });
          return {
            success: true,
            id: created.id,
            imageUrl: created.image_url || '',
            message: 'Gallery item published.'
          };
        }
      }

      const isFormData = body instanceof FormData;
      return fetchJSON<{ success: boolean; id: number; imageUrl: string; message: string }>('/gallery', {
        method: 'POST',
        body: isFormData ? body : JSON.stringify(body)
      });
    },

    update: async (id: string | number, data: Partial<GalleryImageItem>): Promise<{ success: boolean; message: string }> => {
      if (isSupabaseConfigured()) {
        await galleryApi.update(id, data);
        return { success: true, message: 'Gallery item updated successfully.' };
      }
      return fetchJSON<{ success: boolean; message: string }>(`/gallery/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
      });
    },

    delete: async (id: string | number, storagePath?: string): Promise<{ success: boolean; message: string }> => {
      if (isSupabaseConfigured()) {
        await galleryApi.delete(id, storagePath);
        return { success: true, message: 'Gallery item removed from database and storage.' };
      }
      return fetchJSON<{ success: boolean; message: string }>(`/gallery/${id}`, {
        method: 'DELETE'
      });
    }
  },

  // Admin Portal & Authentication
  admin: {
    login: async (usernameOrEmail: string, password: string): Promise<{ success: boolean; token: string; admin: AdminUser; message: string }> => {
      if (isSupabaseConfigured()) {
        // If username does not have '@', append default domain or use entered value
        const email = usernameOrEmail.includes('@') ? usernameOrEmail : `${usernameOrEmail}@pahad.co`;
        const adminUser = await adminAuthApi.login(email, password);
        const token = `supabase_auth_${adminUser.id}`;
        setAuthToken(token);
        return {
          success: true,
          token,
          admin: adminUser,
          message: 'Welcome back to PAHAD.co Executive Portal.'
        };
      }

      return fetchJSON<{ success: boolean; token: string; admin: AdminUser; message: string }>('/admin/login', {
        method: 'POST',
        body: JSON.stringify({ username: usernameOrEmail, password })
      });
    },

    getMe: async (): Promise<{ success: boolean; user: AdminUser }> => {
      if (isSupabaseConfigured()) {
        const user = await adminAuthApi.getCurrentAdmin();
        if (!user) throw new Error('Not authenticated.');
        return { success: true, user };
      }
      return fetchJSON<{ success: boolean; user: AdminUser }>('/admin/me');
    },

    getStats: async (): Promise<{ success: boolean; stats: AdminStats }> => {
      if (isSupabaseConfigured()) {
        const stats = await adminAuthApi.getStats();
        return { success: true, stats };
      }
      return fetchJSON<{ success: boolean; stats: AdminStats }>('/admin/stats');
    },

    changePassword: async (currentPassword: string, newPassword: string): Promise<{ success: boolean; message: string }> => {
      if (isSupabaseConfigured()) {
        await adminAuthApi.changePassword(newPassword);
        return { success: true, message: 'Password updated successfully in Supabase Auth.' };
      }
      return fetchJSON<{ success: boolean; message: string }>('/admin/change-password', {
        method: 'POST',
        body: JSON.stringify({ currentPassword, newPassword })
      });
    },

    logout: async (): Promise<void> => {
      if (isSupabaseConfigured()) {
        await adminAuthApi.logout();
      }
      removeAuthToken();
    }
  }
};
