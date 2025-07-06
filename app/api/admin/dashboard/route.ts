import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/database";
import { z } from "zod";
import { Prisma, ServiceStatus, Priority, ProjectStatus } from "@prisma/client";

// Define enums for actions (not schema-related, so kept as is)
enum GetAction {
  STATS = "stats",
  MESSAGES = "messages",
  REQUESTS = "requests",
  TESTIMONIALS = "testimonials",
  PROJECTS = "projects",
}

enum PostAction {
  MARK_MESSAGE_READ = "mark-message-read",
  MARK_MESSAGE_REPLIED = "mark-message-replied",
  UPDATE_REQUEST_STATUS = "update-request-status",
  UPDATE_REQUEST_PRIORITY = "update-request-priority",
  APPROVE_TESTIMONIAL = "approve-testimonial",
  REJECT_TESTIMONIAL = "reject-testimonial",
  FEATURE_TESTIMONIAL = "feature-testimonial",
  UPDATE_PROJECT_STATUS = "update-project-status",
}

// Zod schemas for query parameters
const PaginationSchema = z.object({
  page: z
    .string()
    .transform((val) => parseInt(val, 10))
    .refine((val) => !isNaN(val) && val >= 1, {
      message: "Page must be a positive integer",
    })
    .default("1"),
  limit: z
    .string()
    .transform((val) => parseInt(val, 10))
    .refine((val) => !isNaN(val) && val >= 1 && val <= 100, {
      message: "Limit must be between 1 and 100",
    })
    .default("10"),
});

const MessagesQuerySchema = PaginationSchema.extend({
  isRead: z
    .enum(["true", "false"])
    .optional()
    .transform((val) =>
      val === "true" ? true : val === "false" ? false : undefined
    ),
});

const RequestsQuerySchema = PaginationSchema.extend({
  status: z.string().optional(),
  priority: z.string().optional(),
});

const TestimonialsQuerySchema = PaginationSchema.extend({
  approved: z
    .enum(["true", "false"])
    .optional()
    .transform((val) =>
      val === "true" ? true : val === "false" ? false : undefined
    ),
});

const ProjectsQuerySchema = PaginationSchema.extend({
  status: z.string().optional(),
});

// Zod schemas for POST request body
const PostBodySchema = z.object({
  action: z.enum([
    PostAction.MARK_MESSAGE_READ,
    PostAction.MARK_MESSAGE_REPLIED,
    PostAction.UPDATE_REQUEST_STATUS,
    PostAction.UPDATE_REQUEST_PRIORITY,
    PostAction.APPROVE_TESTIMONIAL,
    PostAction.REJECT_TESTIMONIAL,
    PostAction.FEATURE_TESTIMONIAL,
    PostAction.UPDATE_PROJECT_STATUS,
  ]),
  id: z.string().cuid(),
  data: z.record(z.unknown()).optional(),
});

const MarkMessageRepliedSchema = z.object({
  replyNotes: z.string().nullable().optional(),
});

const UpdateRequestStatusSchema = z.object({
  status: z.string(),
});

const UpdateRequestPrioritySchema = z.object({
  priority: z.string().nullable().optional(),
});

const FeatureTestimonialSchema = z.object({
  featured: z.boolean(),
});

const UpdateProjectStatusSchema = z.object({
  status: z.enum([
    "PLANNING",
    "DEVELOPMENT",
    "TESTING",
    "DEPLOYED",
    "MAINTENANCE",
    "COMPLETED",
    "CANCELLED",
  ]),
});

// GET Handler
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = (searchParams.get("action") || GetAction.STATS) as GetAction;

    switch (action) {
      case GetAction.STATS:
        const [
          totalMessages,
          unreadMessages,
          totalRequests,
          pendingRequests,
          totalTestimonials,
          pendingTestimonials,
          totalProjects,
          activeProjects,
        ] = await Promise.all([
          prisma.contactMessage.count(),
          prisma.contactMessage.count({ where: { isRead: false } }),
          prisma.serviceRequest.count(),
          prisma.serviceRequest.count({
            where: { status: "PENDING" },
          }),
          prisma.testimonial.count(),
          prisma.testimonial.count({ where: { isApproved: false } }),
          prisma.project.count(),
          prisma.project.count({ where: { status: "DEPLOYED" } }),
        ]);

        return NextResponse.json({
          success: true,
          stats: {
            totalMessages,
            unreadMessages,
            totalRequests,
            pendingRequests,
            totalTestimonials,
            pendingTestimonials,
            totalProjects,
            activeProjects,
          },
        });

      case GetAction.MESSAGES:
        const { page, limit, isRead } = MessagesQuerySchema.parse({
          page: searchParams.get("page"),
          limit: searchParams.get("limit"),
          isRead: searchParams.get("isRead"),
        });
        const skip = (page - 1) * limit;

        const whereClause: Prisma.ContactMessageWhereInput = {
          isRead,
        };

        const [messages, total] = await Promise.all([
          prisma.contactMessage.findMany({
            where: whereClause,
            orderBy: { createdAt: "desc" },
            skip,
            take: limit,
            select: {
              id: true,
              name: true,
              email: true,
              subject: true,
              message: true,
              isRead: true,
              isReplied: true,
              createdAt: true,
            },
          }),
          prisma.contactMessage.count({ where: whereClause }),
        ]);

        return NextResponse.json({
          success: true,
          data: { messages, total, page, limit },
        });

      case GetAction.REQUESTS:
        const {
          page: requestsPage,
          limit: requestsLimit,
          status,
          priority,
        } = RequestsQuerySchema.parse({
          page: searchParams.get("page"),
          limit: searchParams.get("limit"),
          status: searchParams.get("status"),
          priority: searchParams.get("priority"),
        });
        const requestsSkip = (requestsPage - 1) * requestsLimit;

        const requestsWhere: Prisma.ServiceRequestWhereInput = {
          status: status as ServiceStatus | undefined,
          priority: priority as Priority | undefined,
        };

        const [requests, requestsTotal] = await Promise.all([
          prisma.serviceRequest.findMany({
            where: requestsWhere,
            orderBy: { createdAt: "desc" },
            skip: requestsSkip,
            take: requestsLimit,
            select: {
              id: true,
              clientName: true,
              clientEmail: true,
              projectType: true,
              budget: true,
              timeline: true,
              projectDescription: true,
              status: true,
              priority: true,
              createdAt: true,
            },
          }),
          prisma.serviceRequest.count({ where: requestsWhere }),
        ]);

        return NextResponse.json({
          success: true,
          data: {
            requests,
            total: requestsTotal,
            page: requestsPage,
            limit: requestsLimit,
          },
        });

      case GetAction.TESTIMONIALS:
        const {
          page: testimonialsPage,
          limit: testimonialsLimit,
          approved,
        } = TestimonialsQuerySchema.parse({
          page: searchParams.get("page"),
          limit: searchParams.get("limit"),
          approved: searchParams.get("approved"),
        });
        const testimonialsSkip = (testimonialsPage - 1) * testimonialsLimit;

        const testimonialsWhere: Prisma.TestimonialWhereInput = {
          isApproved: approved,
        };

        const [testimonials, testimonialsTotal] = await Promise.all([
          prisma.testimonial.findMany({
            where: testimonialsWhere,
            orderBy: { createdAt: "desc" },
            skip: testimonialsSkip,
            take: testimonialsLimit,
            select: {
              id: true,
              clientName: true,
              clientTitle: true,
              clientCompany: true,
              clientEmail: true,
              testimonial: true,
              rating: true,
              serviceType: true,
              isApproved: true,
              featured: true,
              createdAt: true,
            },
          }),
          prisma.testimonial.count({ where: testimonialsWhere }),
        ]);

        return NextResponse.json({
          success: true,
          data: {
            testimonials,
            total: testimonialsTotal,
            page: testimonialsPage,
            limit: testimonialsLimit,
          },
        });

      case GetAction.PROJECTS:
        const {
          page: projectsPage,
          limit: projectsLimit,
          status: projectStatus,
        } = ProjectsQuerySchema.parse({
          page: searchParams.get("page"),
          limit: searchParams.get("limit"),
          status: searchParams.get("status"),
        });
        const projectsSkip = (projectsPage - 1) * projectsLimit;

        const projectsWhere: Prisma.ProjectWhereInput = {
          status: projectStatus as ProjectStatus | undefined,
        };

        const [projects, projectsTotal] = await Promise.all([
          prisma.project.findMany({
            where: projectsWhere,
            orderBy: { createdAt: "desc" },
            skip: projectsSkip,
            take: projectsLimit,
            select: {
              id: true,
              title: true,
              description: true,
              shortDescription: true,
              technologies: true,
              category: true,
              status: true,
              featured: true,
              githubUrl: true,
              liveUrl: true,
              imageUrl: true,
              createdAt: true,
            },
          }),
          prisma.project.count({ where: projectsWhere }),
        ]);

        return NextResponse.json({
          success: true,
          data: {
            projects,
            total: projectsTotal,
            page: projectsPage,
            limit: projectsLimit,
          },
        });

      default:
        return NextResponse.json(
          { success: false, message: `Invalid action: ${action}` },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error("Admin dashboard API error:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid query parameters",
          errors: error.errors,
        },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST Handler
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, id, data } = PostBodySchema.parse(body);

    switch (action) {
      case PostAction.MARK_MESSAGE_READ:
        await prisma.contactMessage.update({
          where: { id },
          data: { isRead: true },
        });
        return NextResponse.json({ success: true });

      case PostAction.MARK_MESSAGE_REPLIED:
        const repliedData = MarkMessageRepliedSchema.parse(data);
        await prisma.contactMessage.update({
          where: { id },
          data: { isReplied: true, replyNotes: repliedData.replyNotes },
        });
        return NextResponse.json({ success: true });

      case PostAction.UPDATE_REQUEST_STATUS:
        const statusData = UpdateRequestStatusSchema.parse(data);
        await prisma.serviceRequest.update({
          where: { id },
          data: { status: statusData.status as ServiceStatus },
        });
        return NextResponse.json({ success: true });

      case PostAction.UPDATE_REQUEST_PRIORITY:
        const priorityData = UpdateRequestPrioritySchema.parse(data);
        await prisma.serviceRequest.update({
          where: { id },
          data: {
            priority: priorityData.priority
              ? (priorityData.priority as Priority)
              : undefined,
          },
        });
        return NextResponse.json({ success: true });

      case PostAction.APPROVE_TESTIMONIAL:
        await prisma.testimonial.update({
          where: { id },
          data: { isApproved: true },
        });
        return NextResponse.json({ success: true });

      case PostAction.REJECT_TESTIMONIAL:
        await prisma.testimonial.delete({
          where: { id },
        });
        return NextResponse.json({ success: true });

      case PostAction.FEATURE_TESTIMONIAL:
        const featureData = FeatureTestimonialSchema.parse(data);
        await prisma.testimonial.update({
          where: { id },
          data: { featured: featureData.featured },
        });
        return NextResponse.json({ success: true });

      case PostAction.UPDATE_PROJECT_STATUS:
        const projectData = UpdateProjectStatusSchema.parse(data);
        await prisma.project.update({
          where: { id },
          data: { status: projectData.status as ProjectStatus },
        });
        return NextResponse.json({ success: true });

      default:
        return NextResponse.json(
          { success: false, message: `Invalid action: ${action}` },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error("Admin dashboard POST error:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid request body",
          errors: error.errors,
        },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
