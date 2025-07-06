import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/database";

// GET /api/admin/dashboard - Get dashboard statistics
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get("action") || "stats";

    switch (action) {
      case "stats":
        // Get dashboard statistics using direct Prisma queries
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
          prisma.serviceRequest.count({ where: { status: "PENDING" } }),
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

      case "messages":
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "10");
        const skip = (page - 1) * limit;
        const isRead =
          searchParams.get("isRead") === "true"
            ? true
            : searchParams.get("isRead") === "false"
            ? false
            : undefined;

        const whereClause: any = {};
        if (isRead !== undefined) {
          whereClause.isRead = isRead;
        }

        const [messages, total] = await Promise.all([
          prisma.contactMessage.findMany({
            where: whereClause,
            orderBy: { createdAt: "desc" },
            skip,
            take: limit,
          }),
          prisma.contactMessage.count({ where: whereClause }),
        ]);

        return NextResponse.json({
          success: true,
          data: { messages, total, page, limit },
        });

      case "requests":
        const requestsPage = parseInt(searchParams.get("page") || "1");
        const requestsLimit = parseInt(searchParams.get("limit") || "10");
        const requestsSkip = (requestsPage - 1) * requestsLimit;
        const status = searchParams.get("status") || undefined;
        const priority = searchParams.get("priority") || undefined;

        const requestsWhere: any = {};
        if (status) requestsWhere.status = status;
        if (priority) requestsWhere.priority = priority;

        const [requests, requestsTotal] = await Promise.all([
          prisma.serviceRequest.findMany({
            where: requestsWhere,
            orderBy: { createdAt: "desc" },
            skip: requestsSkip,
            take: requestsLimit,
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

      case "testimonials":
        const testimonialsPage = parseInt(searchParams.get("page") || "1");
        const testimonialsLimit = parseInt(searchParams.get("limit") || "10");
        const testimonialsSkip = (testimonialsPage - 1) * testimonialsLimit;
        const approved =
          searchParams.get("approved") === "true"
            ? true
            : searchParams.get("approved") === "false"
            ? false
            : undefined;

        const testimonialsWhere: any = {};
        if (approved !== undefined) testimonialsWhere.isApproved = approved;

        const [testimonials, testimonialsTotal] = await Promise.all([
          prisma.testimonial.findMany({
            where: testimonialsWhere,
            orderBy: { createdAt: "desc" },
            skip: testimonialsSkip,
            take: testimonialsLimit,
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

      case "projects":
        const projectsPage = parseInt(searchParams.get("page") || "1");
        const projectsLimit = parseInt(searchParams.get("limit") || "10");
        const projectsSkip = (projectsPage - 1) * projectsLimit;
        const projectStatus = searchParams.get("status") || undefined;

        const projectsWhere: any = {};
        if (projectStatus) projectsWhere.status = projectStatus;

        const [projects, projectsTotal] = await Promise.all([
          prisma.project.findMany({
            where: projectsWhere,
            orderBy: { createdAt: "desc" },
            skip: projectsSkip,
            take: projectsLimit,
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
          { success: false, message: "Invalid action" },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error("Admin dashboard API error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}


export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, id, data } = body;

    switch (action) {
      case "mark-message-read":
        await prisma.contactMessage.update({
          where: { id },
          data: { isRead: true },
        });
        return NextResponse.json({ success: true });

      case "mark-message-replied":
        await prisma.contactMessage.update({
          where: { id },
          data: { isReplied: true, replyNotes: data.replyNotes },
        });
        return NextResponse.json({ success: true });

      case "update-request-status":
        await prisma.serviceRequest.update({
          where: { id },
          data: { status: data.status },
        });
        return NextResponse.json({ success: true });

      case "update-request-priority":
        await prisma.serviceRequest.update({
          where: { id },
          data: { priority: data.priority },
        });
        return NextResponse.json({ success: true });

      case "approve-testimonial":
        await prisma.testimonial.update({
          where: { id },
          data: { isApproved: true },
        });
        return NextResponse.json({ success: true });

      case "reject-testimonial":
        await prisma.testimonial.delete({
          where: { id },
        });
        return NextResponse.json({ success: true });

      case "feature-testimonial":
        await prisma.testimonial.update({
          where: { id },
          data: { featured: data.featured },
        });
        return NextResponse.json({ success: true });

      case "update-project-status":
        await prisma.project.update({
          where: { id },
          data: { status: data.status },
        });
        return NextResponse.json({ success: true });

      default:
        return NextResponse.json(
          { success: false, message: "Invalid action" },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error("Admin dashboard POST error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
