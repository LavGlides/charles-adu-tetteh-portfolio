import { prisma } from "./database";
import type { ContactMessage, ServiceRequest, Prisma } from "@prisma/client";

// Contact Message Services
export class ContactMessageService {
  // Save a new contact message to the database
  static async create(data: {
    name: string;
    email: string;
    subject: string;
    message: string;
    emailSent?: boolean;
    emailId?: string;
    ipAddress?: string;
    userAgent?: string;
  }): Promise<ContactMessage> {
    try {
      const contactMessage = await prisma.contactMessage.create({
        data: {
          name: data.name,
          email: data.email,
          subject: data.subject,
          message: data.message,
          emailSent: data.emailSent ?? false,
          emailId: data.emailId,
          ipAddress: data.ipAddress,
          userAgent: data.userAgent,
        },
      });

      return contactMessage;
    } catch (error) {
      console.error("❌ Failed to save contact message:", error);
      throw new Error("Failed to save contact message to database");
    }
  }

  // Get all contact messages with pagination
  static async getAll(
    options: {
      page?: number;
      limit?: number;
      isRead?: boolean;
      orderBy?: "createdAt" | "updatedAt";
      order?: "asc" | "desc";
    } = {}
  ): Promise<{
    messages: ContactMessage[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const {
      page = 1,
      limit = 10,
      isRead,
      orderBy = "createdAt",
      order = "desc",
    } = options;

    const skip = (page - 1) * limit;
    const where: Prisma.ContactMessageWhereInput = {};

    if (isRead !== undefined) {
      where.isRead = isRead;
    }

    const [messages, total] = await Promise.all([
      prisma.contactMessage.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [orderBy]: order },
      }),
      prisma.contactMessage.count({ where }),
    ]);

    return {
      messages,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  // Mark message as read
  static async markAsRead(id: string): Promise<ContactMessage> {
    return prisma.contactMessage.update({
      where: { id },
      data: { isRead: true, updatedAt: new Date() },
    });
  }

  // Mark message as replied
  static async markAsReplied(
    id: string,
    replyNotes?: string
  ): Promise<ContactMessage> {
    return prisma.contactMessage.update({
      where: { id },
      data: {
        isReplied: true,
        replyNotes: replyNotes || null,
        updatedAt: new Date(),
      },
    });
  }

  // Update email status
  static async updateEmailStatus(
    id: string,
    emailSent: boolean,
    emailId?: string
  ): Promise<ContactMessage> {
    return prisma.contactMessage.update({
      where: { id },
      data: { emailSent, emailId, updatedAt: new Date() },
    });
  }

  // Get unread count
  static async getUnreadCount(): Promise<number> {
    return prisma.contactMessage.count({
      where: { isRead: false },
    });
  }

  // Delete message
  static async delete(id: string): Promise<ContactMessage> {
    return prisma.contactMessage.delete({
      where: { id },
    });
  }
}

// Service Request Services
export class ServiceRequestService {
  // Save a new service request to the database
  static async create(data: {
    clientName: string;
    clientEmail: string;
    projectType: string;
    budget: string;
    timeline: string;
    projectDescription: string;
    emailSent?: boolean;
    emailId?: string;
    ipAddress?: string;
    userAgent?: string;
  }): Promise<ServiceRequest> {
    try {
      const serviceRequest = await prisma.serviceRequest.create({
        data: {
          clientName: data.clientName,
          clientEmail: data.clientEmail,
          projectType: data.projectType,
          budget: data.budget,
          timeline: data.timeline,
          projectDescription: data.projectDescription,
          emailSent: data.emailSent ?? false,
          emailId: data.emailId,
          ipAddress: data.ipAddress,
          userAgent: data.userAgent,
          status: "PENDING",
          priority: "MEDIUM",
        },
      });

      
      return serviceRequest;
    } catch (error) {
      console.error("❌ Failed to save service request:", error);
      throw new Error("Failed to save service request to database");
    }
  }

  // Get all service requests with pagination and filtering
  static async getAll(
    options: {
      page?: number;
      limit?: number;
      status?: string;
      priority?: string;
      isRead?: boolean;
      orderBy?: "createdAt" | "updatedAt";
      order?: "asc" | "desc";
    } = {}
  ): Promise<{
    requests: ServiceRequest[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const {
      page = 1,
      limit = 10,
      status,
      priority,
      isRead,
      orderBy = "createdAt",
      order = "desc",
    } = options;

    const skip = (page - 1) * limit;
    const where: Prisma.ServiceRequestWhereInput = {};

    if (status) where.status = status as any;
    if (priority) where.priority = priority as any;
    if (isRead !== undefined) where.isRead = isRead;

    const [requests, total] = await Promise.all([
      prisma.serviceRequest.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [orderBy]: order },
        include: {
          project: {
            select: { id: true, title: true, status: true },
          },
        },
      }),
      prisma.serviceRequest.count({ where }),
    ]);

    return {
      requests,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  // Update service request status
  static async updateStatus(
    id: string,
    status: string,
    notes?: string
  ): Promise<ServiceRequest> {
    return prisma.serviceRequest.update({
      where: { id },
      data: {
        status: status as any,
        notes,
        updatedAt: new Date(),
      },
    });
  }

  // Update priority
  static async updatePriority(
    id: string,
    priority: string
  ): Promise<ServiceRequest> {
    return prisma.serviceRequest.update({
      where: { id },
      data: {
        priority: priority as any,
        updatedAt: new Date(),
      },
    });
  }

  // Mark as read
  static async markAsRead(id: string): Promise<ServiceRequest> {
    return prisma.serviceRequest.update({
      where: { id },
      data: { isRead: true, updatedAt: new Date() },
    });
  }

  // Update proposal status
  static async updateProposal(
    id: string,
    proposalSent: boolean
  ): Promise<ServiceRequest> {
    return prisma.serviceRequest.update({
      where: { id },
      data: {
        proposalSent,
        proposalSentAt: proposalSent ? new Date() : null,
        updatedAt: new Date(),
      },
    });
  }

  // Update contract status
  static async updateContract(
    id: string,
    contractSigned: boolean
  ): Promise<ServiceRequest> {
    return prisma.serviceRequest.update({
      where: { id },
      data: {
        contractSigned,
        contractSignedAt: contractSigned ? new Date() : null,
        updatedAt: new Date(),
      },
    });
  }

  // Update email status
  static async updateEmailStatus(
    id: string,
    emailSent: boolean,
    emailId?: string
  ): Promise<ServiceRequest> {
    return prisma.serviceRequest.update({
      where: { id },
      data: { emailSent, emailId, updatedAt: new Date() },
    });
  }

  // Get pending requests count
  static async getPendingCount(): Promise<number> {
    return prisma.serviceRequest.count({
      where: { status: "PENDING" },
    });
  }

  // Get unread count
  static async getUnreadCount(): Promise<number> {
    return prisma.serviceRequest.count({
      where: { isRead: false },
    });
  }
}

// Testimonial Services
export class TestimonialService {
  // Save a new testimonial to the database
  static async create(data: {
    name: string;
    email: string;
    role: string;
    company: string;
    projectType: string;
    rating: number;
    content: string;
    consent: boolean;
    approved?: boolean;
    featured?: boolean;
    clientImage?: string;
    emailSent?: boolean;
    emailId?: string;
    ipAddress?: string;
    userAgent?: string;
  }) {
    try {
      const testimonial = await prisma.testimonial.create({
        data: {
          clientName: data.name,
          clientEmail: data.email,
          clientTitle: data.role,
          clientCompany: data.company,
          serviceType: data.projectType,
          rating: data.rating,
          testimonial: data.content,
          clientImage: data.clientImage,
          isApproved: data.approved ?? false, // Default to false, requires manual approval
          featured: data.featured ?? false,
          emailSent: data.emailSent ?? false,
          emailId: data.emailId,
          consent: data.consent,
          ipAddress: data.ipAddress,
          userAgent: data.userAgent,
        },
      });

      return testimonial;
    } catch (error) {
      console.error("❌ Failed to save testimonial:", error);
      throw new Error("Failed to save testimonial to database");
    }
  }

  // Get all testimonials with filtering
  static async getAll(
    options: {
      approved?: boolean;
      featured?: boolean;
      page?: number;
      limit?: number;
      orderBy?: "createdAt" | "rating" | "updatedAt";
      order?: "asc" | "desc";
    } = {}
  ) {
    const {
      approved,
      featured,
      page = 1,
      limit = 10,
      orderBy = "createdAt",
      order = "desc",
    } = options;

    try {
      const where: any = {};
      if (approved !== undefined) where.isApproved = approved;
      if (featured !== undefined) where.featured = featured;

      const [testimonials, total] = await Promise.all([
        prisma.testimonial.findMany({
          where,
          orderBy: { [orderBy]: order },
          skip: (page - 1) * limit,
          take: limit,
        }),
        prisma.testimonial.count({ where }),
      ]);

      return {
        testimonials,
        total,
        pages: Math.ceil(total / limit),
        currentPage: page,
      };
    } catch (error) {
      console.error("❌ Failed to fetch testimonials:", error);
      throw new Error("Failed to fetch testimonials");
    }
  }

  // Update testimonial (for approval, featuring, etc.)
  static async update(
    id: string,
    data: {
      approved?: boolean;
      featured?: boolean;
      emailSent?: boolean;
      emailId?: string;
    }
  ) {
    try {
      const testimonial = await prisma.testimonial.update({
        where: { id },
        data,
      });

      return testimonial;
    } catch (error) {
      console.error("❌ Failed to update testimonial:", error);
      throw new Error("Failed to update testimonial");
    }
  }

  // Delete testimonial
  static async delete(id: string) {
    try {
      await prisma.testimonial.delete({
        where: { id },
      });

      
      return { success: true };
    } catch (error) {
      console.error("❌ Failed to delete testimonial:", error);
      throw new Error("Failed to delete testimonial");
    }
  }

  // Approve testimonial
  static async approve(id: string) {
    try {
      const testimonial = await prisma.testimonial.update({
        where: { id },
        data: { isApproved: true, updatedAt: new Date() },
      });

     
      return testimonial;
    } catch (error) {
      console.error("❌ Failed to approve testimonial:", error);
      throw new Error("Failed to approve testimonial");
    }
  }

  // Set featured status
  static async setFeatured(id: string, featured: boolean) {
    try {
      const testimonial = await prisma.testimonial.update({
        where: { id },
        data: { featured, updatedAt: new Date() },
      });

      
      return testimonial;
    } catch (error) {
      console.error("❌ Failed to set featured status:", error);
      throw new Error("Failed to set featured status");
    }
  }
}

// Convenience function for saving testimonials (for API routes)
export async function saveTestimonial(data: {
  name: string;
  email: string;
  role: string;
  company: string;
  projectType: string;
  rating: number;
  content: string;
  consent: boolean;
  approved?: boolean;
  featured?: boolean;
  clientImage?: string;
}) {
  return TestimonialService.create(data);
}

// Analytics Services
export class AnalyticsService {
  // Track page views
  static async trackPageView(data: {
    page: string;
    referrer?: string;
    userAgent?: string;
    ipAddress?: string;
    country?: string;
    city?: string;
    device?: string;
    browser?: string;
    os?: string;
  }) {
    try {
      await prisma.pageView.create({ data });
    } catch (error) {
      console.error("❌ Failed to track page view:", error);
    }
  }

  // Get page view statistics
  static async getPageViewStats(days: number = 30) {
    const since = new Date();
    since.setDate(since.getDate() - days);

    const pageViews = await prisma.pageView.groupBy({
      by: ["page"],
      where: {
        createdAt: { gte: since },
      },
      _count: { page: true },
      orderBy: { _count: { page: "desc" } },
    });

    return pageViews.map((item) => ({
      page: item.page,
      views: item._count.page,
    }));
  }

  // Get total statistics
  static async getTotalStats() {
    const [
      totalContacts,
      totalServiceRequests,
      totalPageViews,
      pendingRequests,
      unreadContacts,
    ] = await Promise.all([
      prisma.contactMessage.count(),
      prisma.serviceRequest.count(),
      prisma.pageView.count(),
      ServiceRequestService.getPendingCount(),
      ContactMessageService.getUnreadCount(),
    ]);

    return {
      totalContacts,
      totalServiceRequests,
      totalPageViews,
      pendingRequests,
      unreadContacts,
    };
  }
}

// Project Services
export class ProjectService {
  // Create a new project
  static async create(data: {
    title: string;
    description: string;
    longDescription?: string;
    technologies: string[];
    category: string;
    status?: string;
    featured?: boolean;
    githubUrl?: string;
    liveUrl?: string;
    imageUrl?: string;
    startDate?: Date;
    endDate?: Date;
    clientName?: string;
    clientEmail?: string;
    budget?: string;
    teamSize?: number;
    challenges?: string;
    solutions?: string;
    outcomes?: string;
    testimonialQuote?: string;
  }) {
    try {
      const project = await prisma.project.create({
        data: {
          title: data.title,
          description: data.description,
          shortDescription: data.longDescription,
          technologies: data.technologies,
          category: data.category as any,
          status: (data.status || "PLANNING") as any,
          featured: data.featured || false,
          githubUrl: data.githubUrl,
          liveUrl: data.liveUrl,
          imageUrl: data.imageUrl,
          startDate: data.startDate,
          endDate: data.endDate,
          clientName: data.clientName,
          // Note: Schema doesn't have clientEmail field, so we skip this
          budget: data.budget ? parseFloat(data.budget) : null,
          challenges: data.challenges,
          solutions: data.solutions,
          results: data.outcomes,
          slug:
            data.title
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, "-")
              .replace(/(^-|-$)/g, "") +
            "-" +
            Date.now(),
        },
      });

      return project;
    } catch (error) {
      console.error("❌ Failed to create project:", error);
      throw new Error("Failed to create project");
    }
  }

  // Get all projects with pagination and filtering
  static async getAll(
    options: {
      page?: number;
      limit?: number;
      status?: string;
      category?: string;
      featured?: boolean;
      orderBy?: "createdAt" | "updatedAt" | "title";
      order?: "asc" | "desc";
    } = {}
  ) {
    const {
      page = 1,
      limit = 10,
      status,
      category,
      featured,
      orderBy = "createdAt",
      order = "desc",
    } = options;

    const skip = (page - 1) * limit;
    const where: any = {};

    if (status) where.status = status;
    if (category) where.category = category;
    if (featured !== undefined) where.featured = featured;

    const [projects, total] = await Promise.all([
      prisma.project.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [orderBy]: order },
        include: {
          serviceRequests: {
            select: { id: true, clientName: true, status: true },
          },
        },
      }),
      prisma.project.count({ where }),
    ]);

    return {
      projects,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  // Get project by ID
  static async getById(id: string) {
    return prisma.project.findUnique({
      where: { id },
      include: {
        serviceRequests: true,
      },
    });
  }

  // Update project
  static async update(id: string, data: any) {
    return prisma.project.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date(),
      },
    });
  }

  // Update project status
  static async updateStatus(id: string, status: string) {
    return prisma.project.update({
      where: { id },
      data: {
        status: status as any,
        updatedAt: new Date(),
      },
    });
  }

  // Set project as featured
  static async setFeatured(id: string, featured: boolean) {
    return prisma.project.update({
      where: { id },
      data: {
        featured,
        updatedAt: new Date(),
      },
    });
  }

  // Delete project
  static async delete(id: string) {
    return prisma.project.delete({
      where: { id },
    });
  }

  // Get featured projects
  static async getFeatured(limit: number = 6) {
    return prisma.project.findMany({
      where: {
        featured: true,
        status: "DEPLOYED" as any,
      },
      take: limit,
      orderBy: { createdAt: "desc" },
    });
  }

  // Get projects by category
  static async getByCategory(category: string, limit: number = 10) {
    return prisma.project.findMany({
      where: {
        category: category as any,
        status: "DEPLOYED" as any,
      },
      take: limit,
      orderBy: { createdAt: "desc" },
    });
  }
}

// Contact Services
export class ContactService {
  // Save a new contact message to the database
  static async create(data: {
    name: string;
    email: string;
    subject: string;
    message: string;
    phone?: string;
    company?: string;
    type?: string;
    ipAddress?: string;
    userAgent?: string;
    emailSent?: boolean;
    emailId?: string;
  }) {
    try {
      const contact = await prisma.contactMessage.create({
        data: {
          ...data,
          isRead: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });

      return contact;
    } catch (error) {
      console.error("Failed to save contact message:", error);
      throw new Error("Failed to save contact message");
    }
  }

  // Get all contact messages with pagination and filtering
  static async getAll(
    options: {
      page?: number;
      limit?: number;
      status?: string;
      type?: string;
      orderBy?: string;
      order?: "asc" | "desc";
    } = {}
  ) {
    const {
      page = 1,
      limit = 10,
      status,
      type,
      orderBy = "createdAt",
      order = "desc",
    } = options;

    const where: any = {};
    if (status && status === "READ") where.isRead = true;
    if (status && status === "UNREAD") where.isRead = false;
    if (type) where.type = type;

    const [messages, total] = await Promise.all([
      prisma.contactMessage.findMany({
        where,
        orderBy: { [orderBy]: order },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.contactMessage.count({ where }),
    ]);

    return {
      messages,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  // Get message by ID
  static async getById(id: string) {
    return prisma.contactMessage.findUnique({
      where: { id },
    });
  }

  // Update message status (using isRead field)
  static async updateStatus(id: string, status: string) {
    const isRead = status === "READ" || status === "read";
    return prisma.contactMessage.update({
      where: { id },
      data: {
        isRead,
        updatedAt: new Date(),
      },
    });
  }

  // Mark as read
  static async markAsRead(id: string) {
    return prisma.contactMessage.update({
      where: { id },
      data: {
        isRead: true,
        updatedAt: new Date(),
      },
    });
  }

  // Mark as replied
  static async markAsReplied(id: string, replyNotes?: string) {
    return prisma.contactMessage.update({
      where: { id },
      data: {
        isReplied: true,
        replyNotes: replyNotes || null,
        updatedAt: new Date(),
      },
    });
  }

  // Delete message
  static async delete(id: string) {
    return prisma.contactMessage.delete({
      where: { id },
    });
  }

  // Update email status
  static async updateEmailStatus(
    id: string,
    emailSent: boolean,
    emailId?: string
  ) {
    return prisma.contactMessage.update({
      where: { id },
      data: { emailSent, emailId, updatedAt: new Date() },
    });
  }

  // Get stats
  static async getStats() {
    const [total, unread, today] = await Promise.all([
      prisma.contactMessage.count(),
      prisma.contactMessage.count({ where: { isRead: false } }),
      prisma.contactMessage.count({
        where: {
          createdAt: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)),
          },
        },
      }),
    ]);

    return { total, unread, today };
  }
}

// Database helper utilities
export const dbUtils = {
  // Get client IP address from request
  getClientIP: (request: Request): string => {
    const forwarded = request.headers.get("x-forwarded-for");
    const real = request.headers.get("x-real-ip");
    const client = request.headers.get("x-client-ip");

    if (forwarded) {
      return forwarded.split(",")[0].trim();
    }

    return real || client || "unknown";
  },

  // Get user agent from request
  getUserAgent: (request: Request): string => {
    return request.headers.get("user-agent") || "unknown";
  },

  // Clean and validate email
  validateEmail: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  // Clean HTML from text (basic sanitization)
  sanitizeText: (text: string): string => {
    return text
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
      .replace(/<[^>]+>/g, "")
      .trim();
  },
};
