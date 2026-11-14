/// <reference types="vite/client" />
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import {
  InquiryFormData,
  InquiryItem,
  ReviewItem,
  GalleryItem,
  FeedbackItem,
  AdminUser,
  AdminStats
} from '../types';

const env = (import.meta as unknown as { env: Record<string, string> }).env || {};
const supabaseUrl = env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = (): boolean => {
  return Boolean(
    supabaseUrl &&
    supabaseAnonKey &&
    supabaseUrl.startsWith('https://') &&
    !supabaseUrl.includes('your-project-id') &&
    supabaseAnonKey.length > 20
  );
};

// Create the Supabase client
export const supabase: SupabaseClient = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-anon-key',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    }
  }
);

export const BUCKET_NAME = 'gallery-images';

// ============================================================================
// 1. INQUIRIES API
// ============================================================================
export const inquiriesApi = {
  submit: async (formData: InquiryFormData): Promise<{ success: boolean; id?: string | number; message: string }> => {
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase is not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.');
    }

    const { error } = await supabase
      .from('inquiries')
      .insert([
        {
          customer_name: formData.name.trim(),
          email: formData.email.trim().toLowerCase(),
          phone: formData.phone.trim(),
          event_type: formData.eventType,
          event_date: formData.preferredDate,
          event_location: formData.eventLocation.trim(),
          budget: formData.estimatedBudget,
          message: formData.message.trim(),
          status: 'new'
        }
      ]);

    if (error) {
      console.error('Supabase inquiries insert error:', error);
      throw new Error(error.message || 'Failed to submit inquiry.');
    }

    return {
      success: true,
      message: 'Your inquiry has been submitted successfully! The PAHAD.co team will contact you within 24 hours.'
    };
  },

  getAll: async (params?: { status?: string; search?: string }): Promise<InquiryItem[]> => {
    if (!isSupabaseConfigured()) return [];

    let query = supabase
      .from('inquiries')
      .select('*')
      .order('created_at', { ascending: false });

    if (params?.status && params.status !== 'all') {
      query = query.eq('status', params.status);
    }

    if (params?.search) {
      const term = `%${params.search}%`;
      query = query.or(`customer_name.ilike.${term},email.ilike.${term},phone.ilike.${term},event_location.ilike.${term}`);
    }

    const { data, error } = await query;
    if (error) throw new Error(error.message);

    return (data || []).map((row) => ({
      ...row,
      // Map backwards compatible fields
      name: row.customer_name,
      preferred_date: row.event_date,
      estimated_budget: row.budget
    }));
  },

  updateStatus: async (id: string | number, status: string, adminNotes?: string): Promise<void> => {
    if (!isSupabaseConfigured()) return;

    const updates: Record<string, unknown> = { status };
    if (adminNotes !== undefined) {
      updates.admin_notes = adminNotes;
    }

    const { error } = await supabase
      .from('inquiries')
      .update(updates)
      .eq('id', id);

    if (error) throw new Error(error.message);
  },

  delete: async (id: string | number): Promise<void> => {
    if (!isSupabaseConfigured()) return;

    const { error } = await supabase
      .from('inquiries')
      .delete()
      .eq('id', id);

    if (error) throw new Error(error.message);
  }
};

// ============================================================================
// 2. REVIEWS API
// ============================================================================
export const reviewsApi = {
  getApproved: async (): Promise<ReviewItem[]> => {
    if (!isSupabaseConfigured()) return [];

    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('approval_status', 'approved')
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);

    return (data || []).map((row) => ({
      ...row,
      name: row.customer_name,
      status: row.approval_status
    }));
  },

  submit: async (review: {
    customer_name: string;
    rating: number;
    review_text: string;
    event_type?: string;
    event_location?: string;
  }): Promise<{ success: boolean; id?: string | number; message: string }> => {
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase is not configured. Please set your credentials in .env.');
    }

    const { error } = await supabase
      .from('reviews')
      .insert([
        {
          customer_name: review.customer_name.trim(),
          rating: Number(review.rating),
          review_text: review.review_text.trim(),
          event_type: review.event_type || 'Event Celebration',
          event_location: review.event_location || 'Uttarakhand',
          approval_status: 'pending'
        }
      ]);

    if (error) {
      console.error('Supabase review insert error:', error);
      throw new Error(error.message || 'Failed to submit review.');
    }

    return {
      success: true,
      message: 'Thank you! Your review has been submitted for moderation and will appear on the website once approved.'
    };
  },

  getAll: async (status?: string): Promise<ReviewItem[]> => {
    if (!isSupabaseConfigured()) return [];

    let query = supabase
      .from('reviews')
      .select('*')
      .order('created_at', { ascending: false });

    if (status && status !== 'all') {
      query = query.eq('approval_status', status);
    }

    const { data, error } = await query;
    if (error) throw new Error(error.message);

    return (data || []).map((row) => ({
      ...row,
      name: row.customer_name,
      status: row.approval_status
    }));
  },

  updateStatus: async (id: string | number, status: 'approved' | 'rejected' | 'pending'): Promise<void> => {
    if (!isSupabaseConfigured()) return;

    const updates: Record<string, unknown> = {
      approval_status: status
    };
    if (status === 'approved') {
      updates.approved_at = new Date().toISOString();
    }

    const { error } = await supabase
      .from('reviews')
      .update(updates)
      .eq('id', id);

    if (error) throw new Error(error.message);
  },

  delete: async (id: string | number): Promise<void> => {
    if (!isSupabaseConfigured()) return;

    const { error } = await supabase
      .from('reviews')
      .delete()
      .eq('id', id);

    if (error) throw new Error(error.message);
  }
};

// ============================================================================
// 3. GALLERY & STORAGE API
// ============================================================================
export const galleryApi = {
  getAll: async (category?: string): Promise<GalleryItem[]> => {
    if (!isSupabaseConfigured()) return [];

    let query = supabase
      .from('gallery')
      .select('*')
      .order('display_order', { ascending: true })
      .order('created_at', { ascending: false });

    if (category && category !== 'All') {
      query = query.eq('category', category);
    }

    const { data, error } = await query;
    if (error) throw new Error(error.message);

    return (data || []).map((row) => ({
      ...row,
      image: row.image_url,
      caption: row.description || row.title
    }));
  },

  uploadImageFile: async (file: File): Promise<{ publicUrl: string; storagePath: string }> => {
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase is not configured.');
    }

    // Generate safe unique filename
    const fileExt = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const cleanFileName = file.name.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
    const storagePath = `gallery/${Date.now()}_${cleanFileName}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(storagePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      console.error('Storage upload error:', uploadError);
      throw new Error(`Storage upload failed: ${uploadError.message}`);
    }

    const { data } = supabase.storage.from(BUCKET_NAME).getPublicUrl(storagePath);
    return {
      publicUrl: data.publicUrl,
      storagePath
    };
  },

  add: async (item: {
    image_url: string;
    title: string;
    description?: string;
    category: string;
    display_order?: number;
    storage_path?: string;
  }): Promise<GalleryItem> => {
    if (!isSupabaseConfigured()) throw new Error('Supabase not configured.');

    const { data, error } = await supabase
      .from('gallery')
      .insert([
        {
          image_url: item.image_url,
          title: item.title,
          description: item.description || '',
          category: item.category,
          display_order: item.display_order || 0,
          storage_path: item.storage_path || null
        }
      ])
      .select('*')
      .single();

    if (error) throw new Error(error.message);

    return {
      ...data,
      image: data.image_url,
      caption: data.description || data.title
    };
  },

  update: async (id: string | number, updates: Partial<GalleryItem>): Promise<void> => {
    if (!isSupabaseConfigured()) return;

    const payload: Record<string, unknown> = {};
    if (updates.title !== undefined) payload.title = updates.title;
    if (updates.description !== undefined) payload.description = updates.description;
    if (updates.category !== undefined) payload.category = updates.category;
    if (updates.display_order !== undefined) payload.display_order = updates.display_order;
    if (updates.image_url !== undefined) payload.image_url = updates.image_url;

    const { error } = await supabase
      .from('gallery')
      .update(payload)
      .eq('id', id);

    if (error) throw new Error(error.message);
  },

  delete: async (id: string | number, storagePath?: string): Promise<void> => {
    if (!isSupabaseConfigured()) return;

    // 1. Delete row from database
    const { error: dbError } = await supabase
      .from('gallery')
      .delete()
      .eq('id', id);

    if (dbError) throw new Error(dbError.message);

    // 2. Safe file deletion from Supabase Storage if storagePath provided
    if (storagePath) {
      try {
        await supabase.storage.from(BUCKET_NAME).remove([storagePath]);
      } catch (storageErr) {
        console.warn('Could not delete storage object:', storageErr);
      }
    }
  }
};

// ============================================================================
// 4. FEEDBACK API
// ============================================================================
export const feedbackApi = {
  submit: async (feedback: {
    customer_name: string;
    email: string;
    feedback_type: string;
    rating?: number;
    message: string;
  }): Promise<{ success: boolean; id?: string | number; message: string }> => {
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase is not configured.');
    }

    const { error } = await supabase
      .from('feedback')
      .insert([
        {
          customer_name: feedback.customer_name.trim(),
          email: feedback.email.trim().toLowerCase(),
          feedback_type: feedback.feedback_type || 'General Feedback',
          rating: feedback.rating || 5,
          message: feedback.message.trim(),
          status: 'new'
        }
      ]);

    if (error) {
      console.error('Supabase feedback insert error:', error);
      throw new Error(error.message || 'Failed to submit feedback.');
    }

    return {
      success: true,
      message: 'Thank you for your valuable feedback! We truly appreciate your time and suggestions.'
    };
  },

  getAll: async (status?: string): Promise<FeedbackItem[]> => {
    if (!isSupabaseConfigured()) return [];

    let query = supabase
      .from('feedback')
      .select('*')
      .order('created_at', { ascending: false });

    if (status && status !== 'all') {
      query = query.eq('status', status);
    }

    const { data, error } = await query;
    if (error) throw new Error(error.message);

    return (data || []).map((row) => ({
      ...row,
      name: row.customer_name,
      contact: row.email,
      category: row.feedback_type
    }));
  },

  update: async (id: string | number, data: { status?: string; admin_notes?: string }): Promise<void> => {
    if (!isSupabaseConfigured()) return;

    const { error } = await supabase
      .from('feedback')
      .update(data)
      .eq('id', id);

    if (error) throw new Error(error.message);
  },

  delete: async (id: string | number): Promise<void> => {
    if (!isSupabaseConfigured()) return;

    const { error } = await supabase
      .from('feedback')
      .delete()
      .eq('id', id);

    if (error) throw new Error(error.message);
  }
};

// ============================================================================
// 5. ADMIN AUTHENTICATION & STATS API
// ============================================================================
export const adminAuthApi = {
  login: async (email: string, password: string): Promise<AdminUser> => {
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase is not configured. Please add your credentials in .env.');
    }

    // 1. Supabase Auth sign in
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password: password.trim()
    });

    if (authError || !authData.user) {
      throw new Error(authError?.message || 'Invalid email or password.');
    }

    // 2. Verify admin role in public.admin_users
    const { data: adminRecord, error: adminError } = await supabase
      .from('admin_users')
      .select('*')
      .eq('id', authData.user.id)
      .single();

    if (adminError || !adminRecord) {
      // If user signed in but not an authorized admin, sign out immediately
      await supabase.auth.signOut();
      throw new Error('Access denied. This account does not possess administrator privileges for PAHAD.co.');
    }

    return {
      id: adminRecord.id,
      email: adminRecord.email,
      role: adminRecord.role,
      full_name: adminRecord.full_name || 'Admin',
      username: adminRecord.email.split('@')[0]
    };
  },

  logout: async (): Promise<void> => {
    if (isSupabaseConfigured()) {
      await supabase.auth.signOut();
    }
  },

  getCurrentAdmin: async (): Promise<AdminUser | null> => {
    if (!isSupabaseConfigured()) return null;

    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !session?.user) return null;

    const { data: adminRecord, error } = await supabase
      .from('admin_users')
      .select('*')
      .eq('id', session.user.id)
      .single();

    if (error || !adminRecord) {
      return null;
    }

    return {
      id: adminRecord.id,
      email: adminRecord.email,
      role: adminRecord.role,
      full_name: adminRecord.full_name || 'Admin',
      username: adminRecord.email.split('@')[0]
    };
  },

  getStats: async (): Promise<AdminStats> => {
    if (!isSupabaseConfigured()) {
      return {
        queries: { total: 0, new: 0 },
        reviews: { total: 0, pending: 0, approved: 0 },
        feedback: { total: 0, new: 0 },
        gallery: { total: 0 }
      };
    }

    // Run parallel counts for fast response
    const [
      inquiriesTotal,
      inquiriesNew,
      reviewsTotal,
      reviewsPending,
      reviewsApproved,
      feedbackTotal,
      feedbackNew,
      galleryTotal
    ] = await Promise.all([
      supabase.from('inquiries').select('*', { count: 'exact', head: true }),
      supabase.from('inquiries').select('*', { count: 'exact', head: true }).eq('status', 'new'),
      supabase.from('reviews').select('*', { count: 'exact', head: true }),
      supabase.from('reviews').select('*', { count: 'exact', head: true }).eq('approval_status', 'pending'),
      supabase.from('reviews').select('*', { count: 'exact', head: true }).eq('approval_status', 'approved'),
      supabase.from('feedback').select('*', { count: 'exact', head: true }),
      supabase.from('feedback').select('*', { count: 'exact', head: true }).eq('status', 'new'),
      supabase.from('gallery').select('*', { count: 'exact', head: true })
    ]);

    return {
      queries: {
        total: inquiriesTotal.count || 0,
        new: inquiriesNew.count || 0
      },
      reviews: {
        total: reviewsTotal.count || 0,
        pending: reviewsPending.count || 0,
        approved: reviewsApproved.count || 0
      },
      feedback: {
        total: feedbackTotal.count || 0,
        new: feedbackNew.count || 0
      },
      gallery: {
        total: galleryTotal.count || 0
      }
    };
  },

  changePassword: async (newPassword: string): Promise<void> => {
    if (!isSupabaseConfigured()) throw new Error('Supabase not configured.');

    const { error } = await supabase.auth.updateUser({
      password: newPassword
    });

    if (error) throw new Error(error.message);
  }
};
