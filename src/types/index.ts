// Content Types
export interface Partner {
  id: string;
  name: string;
  logo: string;
  website?: string;
  order?: number;
}

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
  fullName: string;
  // Keep legacy fields for backwards compatibility
  firstName?: string;
  lastName?: string;
  gender: 'M' | 'F';
  academicStatus: string;
  generalFieldOfStudy: string;
  fieldOfSpecialization: string;
  subFieldOfSpecialization: string;
  professionalCareerStatus: string;
  researchInterest?: string;
  rdTeam: string;
  country: string;
  organization: string;
  phone: string;
  orcidScopusId?: string;
  skypeAddress?: string;
  activitiesExperiences?: string;
  comments?: string;
  // Membership fields
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
  fullName: string;
  gender: 'M' | 'F';
  academicStatus: string;
  generalFieldOfStudy: string;
  fieldOfSpecialization: string;
  subFieldOfSpecialization: string;
  professionalCareerStatus: string;
  researchInterest?: string;
  rdTeam: string;
  country: string;
  organization: string;
  email: string;
  phone: string;
  orcidScopusId?: string;
  skypeAddress?: string;
  activitiesExperiences?: string;
  comments?: string;
  // Legacy fields for backwards compatibility
  firstName?: string;
  lastName?: string;
  profession?: string;
  expertise?: string[];
  motivation?: string;
  // Plan and status fields
  planId: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  notes?: string;
  // Payment fields
  paymentStatus?: 'pending' | 'paid' | 'failed';
  paymentSessionId?: string;
  paymentCompletedAt?: string;
}

// User & Auth Types
export type UserRole = 'super_admin' | 'admin' | 'member' | 'guest';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  avatar?: string;
  createdAt: string;
  isDisabled?: boolean;
}

// Role-based permissions
export interface RolePermissions {
  // Content management
  canEditHero: boolean;
  canEditAbout: boolean;
  canEditServices: boolean;
  canEditProjects: boolean;
  canEditBlog: boolean;
  canEditTeam: boolean;
  canEditPartners: boolean;
  canEditStatistics: boolean;
  canEditFAQs: boolean;
  canEditSettings: boolean;
  // Membership management
  canManageMembers: boolean;
  canManageApplications: boolean;
  canViewMessages: boolean;
  // User management (super_admin only)
  canManageUsers: boolean;
  canManageAdmins: boolean;
}

export const rolePermissions: Record<UserRole, RolePermissions> = {
  super_admin: {
    canEditHero: true,
    canEditAbout: true,
    canEditServices: true,
    canEditProjects: true,
    canEditBlog: true,
    canEditTeam: true,
    canEditPartners: true,
    canEditStatistics: true,
    canEditFAQs: true,
    canEditSettings: true,
    canManageMembers: true,
    canManageApplications: true,
    canViewMessages: true,
    canManageUsers: true,
    canManageAdmins: true,
  },
  admin: {
    canEditHero: false,
    canEditAbout: false,
    canEditServices: false,
    canEditProjects: true,
    canEditBlog: true,
    canEditTeam: false,
    canEditPartners: false,
    canEditStatistics: false,
    canEditFAQs: true,
    canEditSettings: false,
    canManageMembers: true,
    canManageApplications: true,
    canViewMessages: true,
    canManageUsers: false,
    canManageAdmins: false,
  },
  member: {
    canEditHero: false,
    canEditAbout: false,
    canEditServices: false,
    canEditProjects: false,
    canEditBlog: false,
    canEditTeam: false,
    canEditPartners: false,
    canEditStatistics: false,
    canEditFAQs: false,
    canEditSettings: false,
    canManageMembers: false,
    canManageApplications: false,
    canViewMessages: false,
    canManageUsers: false,
    canManageAdmins: false,
  },
  guest: {
    canEditHero: false,
    canEditAbout: false,
    canEditServices: false,
    canEditProjects: false,
    canEditBlog: false,
    canEditTeam: false,
    canEditPartners: false,
    canEditStatistics: false,
    canEditFAQs: false,
    canEditSettings: false,
    canManageMembers: false,
    canManageApplications: false,
    canViewMessages: false,
    canManageUsers: false,
    canManageAdmins: false,
  },
};

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
