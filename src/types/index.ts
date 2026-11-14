export interface InquiryFormData {
  name: string;
  phone: string;
  email: string;
  eventType: string;
  preferredDate: string;
  eventLocation: string;
  estimatedBudget: string;
  message: string;
}

export type InquiryStatus = 'new' | 'contacted' | 'in_progress' | 'completed' | 'rejected';

export interface InquiryItem {
  id: string | number;
  customer_name: string;
  email: string;
  phone: string;
  event_type: string;
  event_date: string;
  event_location: string;
  budget?: string;
  message: string;
  status: InquiryStatus;
  admin_notes?: string;
  created_at: string;
}

// Alias for backwards compatibility with UI components
export type ClientQueryItem = InquiryItem & {
  name?: string;
  preferred_date?: string;
  estimated_budget?: string;
};

export type ReviewApprovalStatus = 'pending' | 'approved' | 'rejected';

export interface ReviewItem {
  id: string | number;
  customer_name: string;
  rating: number;
  review_text: string;
  event_type?: string;
  event_location?: string;
  approval_status: ReviewApprovalStatus;
  approved_at?: string;
  created_at: string;
}

// Alias for backwards compatibility
export type CustomerReview = ReviewItem & {
  name?: string;
  status?: ReviewApprovalStatus;
};

export interface FeedbackItem {
  id: string | number;
  customer_name: string;
  email: string;
  feedback_type: string;
  rating?: number;
  message: string;
  status: 'new' | 'reviewed' | 'archived';
  admin_notes?: string;
  created_at: string;
  // Compatibility fields
  name?: string;
  contact?: string;
  category?: string;
}

export interface GalleryItem {
  id: string | number;
  title: string;
  category: string;
  image_url?: string;
  description?: string;
  display_order?: number;
  storage_path?: string;
  created_at?: string;
  // Compatibility fields for existing UI components
  location?: string;
  image?: string;
  aspect?: 'landscape' | 'portrait' | 'square';
  caption?: string;
  is_featured?: number;
}

// Alias for backwards compatibility
export type GalleryImageItem = GalleryItem;

export interface EventCategory {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  iconName: string;
  image: string;
  badge?: string;
  popularFor?: string;
}

export interface SignatureService {
  id: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  iconName: string;
  image: string;
  features: string[];
  deliverables: string[];
}

export interface ProcessStep {
  step: string;
  number: string;
  title: string;
  description: string;
  details: string;
  iconName: string;
}

export interface WhyChooseItem {
  id: string;
  title: string;
  highlight: string;
  description: string;
  iconName: string;
}

export interface AdminUser {
  id: string;
  email: string;
  role: 'admin' | 'super_admin';
  full_name?: string;
  username?: string;
}

export interface AdminStats {
  queries: { total: number; new: number };
  reviews: { total: number; pending: number; approved: number };
  feedback: { total: number; new: number };
  gallery: { total: number };
}
