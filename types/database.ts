// Types for the portfolio data from the database

export interface Project {
  id: string;
  title: string;
  description: string;
  shortDescription?: string;
  technologies: string[];
  category: string;
  status: string;
  featured: boolean;
  githubUrl?: string;
  liveUrl?: string;
  demoUrl?: string;
  imageUrl?: string;
  images: string[];
  startDate?: string;
  endDate?: string;
  clientName?: string;
  clientCompany?: string;
  duration?: string;
  challenges?: string;
  solutions?: string;
  results?: string;
  slug: string;
  tags: string[];
  views: number;
  likes: number;
  createdAt: string;
  updatedAt: string;
}

export interface Testimonial {
  id: string;
  clientName: string;
  clientTitle: string;
  clientCompany: string;
  clientEmail: string;
  clientImage?: string;
  testimonial: string;
  rating: number;
  serviceType: string;
  projectId?: string;
  isApproved: boolean;
  featured: boolean;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  emailSent: boolean;
  emailId?: string;
  isRead: boolean;
  isReplied: boolean;
  replyNotes?: string;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ServiceRequest {
  id: string;
  clientName: string;
  clientEmail: string;
  projectType: string;
  budget: string;
  timeline: string;
  projectDescription: string;
  status: string;
  priority: string;
  emailSent: boolean;
  emailId?: string;
  isRead: boolean;
  estimatedCost?: number;
  proposalSent: boolean;
  proposalSentAt?: string;
  contractSigned: boolean;
  createdAt: string;
  updatedAt: string;
}
