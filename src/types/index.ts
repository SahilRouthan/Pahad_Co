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

export interface ClientQueryItem {
  id: number;
  name: string;
  phone: string;
  email: string;
  event_type: string;
  preferred_date: string;
  event_location: string;
  estimated_budget?: string;
  message: string;
  status: 'new' | 'contacted' | 'in_progress' | 'completed' | 'archived';
  admin_notes?: string;
  created_at: string;
}

export interface CustomerReview {
  id: number;
  name: string;
  rating: number;
  review_text: string;
  event_type?: string;
  event_location?: string;
  status?: 'pending' | 'approved' | 'rejected';
  approved_at?: string;
  created_at: string;
}

export interface FeedbackItem {
  id: number;
  name: string;
  contact: string;
  rating: number;
  category: string;
  message: string;
  status: 'new' | 'reviewed' | 'archived';
  admin_notes?: string;
  created_at: string;
}

export interface GalleryImageItem {
  id: number;
  title: string;
  category: string;
  location: string;
  image_url: string;
  aspect: 'landscape' | 'portrait' | 'square';
  caption?: string;
  is_featured?: number;
  display_order?: number;
  created_at?: string;
}

export interface GalleryItem {
  id: string | number;
  title: string;
  category: string;
  location: string;
  image: string;
  aspect: 'landscape' | 'portrait' | 'square';
  caption: string;
}

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
  id: number;
  username: string;
  role: string;
}

export interface AdminStats {
  queries: { total: number; new: number };
  reviews: { total: number; pending: number; approved: number };
  feedback: { total: number; new: number };
  gallery: { total: number };
}

