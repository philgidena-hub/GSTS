// Content Types
export interface HeroContent {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  primaryButtonText: string;
  primaryButtonLink: string;
  secondaryButtonText: string;
  secondaryButtonLink: string;
  backgroundImage: string;
}

export interface AboutContent {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  mission: string;
  vision: string;
  image: string;
  features: AboutFeature[];
}

export interface AboutFeature {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface ServiceCluster {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  features: string[];
}

export interface Statistic {
  id: string;
  value: string;
  label: string;
  description: string;
  icon: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  image: string;
  status: 'ongoing' | 'completed' | 'upcoming';
  link?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  authorImage: string;
  date: string;
  category: string;
  image: string;
  slug: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  image: string;
  social: {
    linkedin?: string;
    twitter?: string;
    email?: string;
  };
}

export interface ContactInfo {
  id: string;
  address: string;
  city: string;
  country: string;
  email: string;
  phone: string;
  workingHours: string;
  mapEmbed?: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
}

// Membership Types
export interface MembershipPlan {
  id: string;
  name: string;
  price: number;
  currency: string;
  interval: 'monthly' | 'yearly' | 'lifetime';
  features: string[];
  isPopular?: boolean;
  description: string;
}

export interface Member {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  profession: string;
  organization: string;
  country: string;
  membershipPlanId: string;
  membershipStatus: 'active' | 'pending' | 'expired' | 'cancelled';
  joinedDate: string;
  expiryDate?: string;
  avatar?: string;
  bio?: string;
  expertise: string[];
  social?: {
    linkedin?: string;
    twitter?: string;
    website?: string;
  };
}

export interface MembershipApplication {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  profession: string;
  organization: string;
  country: string;
  expertise: string[];
  motivation: string;
  planId: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  notes?: string;
}

// User & Auth Types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'member' | 'guest';
  avatar?: string;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// Form Types
export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

export interface NewsletterFormData {
  email: string;
}

// Navigation Types
export interface NavItem {
  id: string;
  label: string;
  href: string;
  children?: NavItem[];
}

// Site Settings
export interface SiteSettings {
  siteName: string;
  tagline: string;
  logo: string;
  favicon: string;
  social: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
    youtube?: string;
  };
  contact: ContactInfo;
  seo: {
    title: string;
    description: string;
    keywords: string[];
  };
}
