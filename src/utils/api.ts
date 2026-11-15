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
  inquiriesApi,
  reviewsApi,
  galleryApi,
  feedbackApi,
  adminAuthApi
} from './supabase';

export function getAuthToken(): string | null {
  return localStorage.getItem('pahad_admin_token');
}

export function setAuthToken(token: string): void {
  localStorage.setItem('pahad_admin_token', token);
}

export function removeAuthToken(): void {
  localStorage.removeItem('pahad_admin_token');
}

export const api = {
  // Client Queries / Inquiries
  queries: {
    submit: async (formData: InquiryFormData): Promise<{ success: boolean; id: string | number; message: string }> => {
      const res = await inquiriesApi.submit(formData);
      return { success: true, id: res.id || 'new', message: res.message };
    },

    getAll: async (params?: { status?: string; search?: string }): Promise<{ success: boolean; count: number; data: ClientQueryItem[] }> => {
      const data = await inquiriesApi.getAll(params);
      return { success: true, count: data.length, data };
    },

    update: async (id: string | number, data: { status?: string; adminNotes?: string }): Promise<{ success: boolean; message: string }> => {
      await inquiriesApi.updateStatus(id, data.status || 'new', data.adminNotes);
      return { success: true, message: 'Inquiry status updated successfully.' };
    },

    delete: async (id: string | number): Promise<{ success: boolean; message: string }> => {
      await inquiriesApi.delete(id);
      return { success: true, message: 'Inquiry deleted successfully.' };
    }
  },

  // Customer Reviews
  reviews: {
    getApproved: async (): Promise<{ success: boolean; count: number; data: CustomerReview[] }> => {
      try {
        const data = await reviewsApi.getApproved();
        return { success: true, count: data.length, data };
      } catch (err) {
        console.warn('reviewsApi.getApproved error:', err);
        return { success: false, count: 0, data: [] };
      }
    },

    submit: async (review: {
      name: string;
      rating: number;
      reviewText: string;
      eventType?: string;
      eventLocation?: string;
    }): Promise<{ success: boolean; id: string | number; message: string }> => {
      const res = await reviewsApi.submit({
        customer_name: review.name,
        rating: review.rating,
        review_text: review.reviewText,
        event_type: review.eventType,
        event_location: review.eventLocation
      });
      return { success: true, id: res.id || 'new', message: res.message };
    },

    getAll: async (status?: string): Promise<{ success: boolean; count: number; data: CustomerReview[] }> => {
      const data = await reviewsApi.getAll(status);
      return { success: true, count: data.length, data };
    },

    updateStatus: async (id: string | number, status: 'approved' | 'rejected' | 'pending'): Promise<{ success: boolean; message: string }> => {
      await reviewsApi.updateStatus(id, status);
      return { success: true, message: `Review ${status} successfully.` };
    },

    delete: async (id: string | number): Promise<{ success: boolean; message: string }> => {
      await reviewsApi.delete(id);
      return { success: true, message: 'Review deleted successfully.' };
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
      const res = await feedbackApi.submit({
        customer_name: feedback.name,
        email: feedback.contact,
        feedback_type: feedback.category,
        rating: feedback.rating,
        message: feedback.message
      });
      return { success: true, id: res.id || 'new', message: res.message };
    },

    getAll: async (params?: { category?: string; rating?: string; status?: string }): Promise<{ success: boolean; count: number; data: FeedbackItem[] }> => {
      const data = await feedbackApi.getAll(params?.status);
      return { success: true, count: data.length, data };
    },

    update: async (id: string | number, data: { status?: string; adminNotes?: string }): Promise<{ success: boolean; message: string }> => {
      await feedbackApi.update(id, { status: data.status, admin_notes: data.adminNotes });
      return { success: true, message: 'Feedback updated successfully.' };
    },

    delete: async (id: string | number): Promise<{ success: boolean; message: string }> => {
      await feedbackApi.delete(id);
      return { success: true, message: 'Feedback deleted successfully.' };
    }
  },

  // Gallery
  gallery: {
    getAll: async (category?: string): Promise<{ success: boolean; count: number; data: GalleryImageItem[] }> => {
      try {
        const data = await galleryApi.getAll(category);
        return { success: true, count: data.length, data };
      } catch (err) {
        console.warn('galleryApi.getAll error:', err);
        return { success: false, count: 0, data: [] };
      }
    },

    add: async (body: FormData | Record<string, unknown>): Promise<{ success: boolean; id: string | number; imageUrl: string; message: string }> => {
      if (body instanceof FormData) {
        // Extract file supporting 'imageFile', 'image', or 'file' form field keys
        const rawFile = body.get('imageFile') || body.get('image') || body.get('file');
        const file = (rawFile && typeof rawFile === 'object' && 'size' in rawFile && (rawFile as File).size > 0)
          ? (rawFile as File)
          : null;

        const title = (body.get('title') as string) || 'Gallery Photograph';
        const location = (body.get('location') as string) || '';
        const caption = (body.get('caption') as string) || (body.get('description') as string) || '';
        const description = location ? (caption ? `${caption} • ${location}` : location) : caption;
        const category = (body.get('category') as string) || 'Weddings';
        const displayOrder = parseInt((body.get('displayOrder') as string) || (body.get('display_order') as string) || '0', 10);

        let imageUrl = (body.get('imageUrl') as string) || (body.get('image_url') as string) || '';
        let storagePath: string | undefined = undefined;

        if (file) {
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
        const location = record.location || '';
        const caption = record.caption || record.description || '';
        const description = location ? (caption ? `${caption} • ${location}` : location) : caption;

        const created = await galleryApi.add({
          image_url: record.image_url || record.imageUrl,
          title: record.title,
          description,
          category: record.category || 'Weddings',
          display_order: record.display_order || record.displayOrder || 0
        });
        return {
          success: true,
          id: created.id,
          imageUrl: created.image_url || '',
          message: 'Gallery item published.'
        };
      }
    },

    update: async (id: string | number, data: Partial<GalleryImageItem> | FormData): Promise<{ success: boolean; message: string }> => {
      if (data instanceof FormData) {
        const rawFile = data.get('imageFile') || data.get('image') || data.get('file');
        const file = (rawFile && typeof rawFile === 'object' && 'size' in rawFile && (rawFile as File).size > 0)
          ? (rawFile as File)
          : null;

        const updates: Partial<GalleryImageItem> = {};
        const title = data.get('title') as string | null;
        if (title) updates.title = title.trim();
        const category = data.get('category') as string | null;
        if (category) updates.category = category;
        const caption = (data.get('caption') || data.get('description')) as string | null;
        const location = data.get('location') as string | null;
        if (caption !== null || location !== null) {
          const c = caption || '';
          const l = location || '';
          updates.description = l ? (c ? `${c} • ${l}` : l) : c;
        }
        const displayOrder = data.get('displayOrder') || data.get('display_order');
        if (displayOrder !== null) updates.display_order = Number(displayOrder);

        let imageUrl = (data.get('imageUrl') || data.get('image_url')) as string | null;
        if (file) {
          const uploadRes = await galleryApi.uploadImageFile(file);
          updates.image_url = uploadRes.publicUrl;
          updates.storage_path = uploadRes.storagePath;
        } else if (imageUrl) {
          updates.image_url = imageUrl.trim();
        }

        await galleryApi.update(id, updates);
        return { success: true, message: 'Gallery item updated successfully.' };
      } else {
        await galleryApi.update(id, data);
        return { success: true, message: 'Gallery item updated successfully.' };
      }
    },

    delete: async (id: string | number, storagePath?: string): Promise<{ success: boolean; message: string }> => {
      await galleryApi.delete(id, storagePath);
      return { success: true, message: 'Gallery item removed from database and storage.' };
    }
  },

  // Admin Portal & Authentication
  admin: {
    login: async (usernameOrEmail: string, password: string): Promise<{ success: boolean; token: string; admin: AdminUser; message: string }> => {
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
    },

    getMe: async (): Promise<{ success: boolean; user: AdminUser }> => {
      const user = await adminAuthApi.getCurrentAdmin();
      if (!user) throw new Error('Not authenticated.');
      return { success: true, user };
    },

    getStats: async (): Promise<{ success: boolean; stats: AdminStats }> => {
      const stats = await adminAuthApi.getStats();
      return { success: true, stats };
    },

    changePassword: async (_currentPassword: string, newPassword: string): Promise<{ success: boolean; message: string }> => {
      await adminAuthApi.changePassword(newPassword);
      return { success: true, message: 'Password updated successfully in Supabase Auth.' };
    },

    logout: async (): Promise<void> => {
      await adminAuthApi.logout();
      removeAuthToken();
    }
  }
};
