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

export interface GalleryItem {
  id: string;
  title: string;
  category: 'Weddings' | 'Corporate' | 'Birthdays' | 'Ceremonies' | 'Dinners';
  location: string;
  image: string;
  aspect: 'landscape' | 'portrait' | 'square';
  caption: string;
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
