import { NextRequest, NextResponse } from "next/server";
import {
  ContactMessageService,
  ServiceRequestService,
  TestimonialService,
  ProjectService,
} from "@/lib/db-services";

// GET /api/admin/dashboard - Get dashboard statistics
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get("action") || "stats";

    switch (action) {
      case "stats":
        // Get dashboard statistics
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
          ContactMessageService.getAll({ limit: 1000 }).then((r) => r.total),
          ContactMessageService.getUnreadCount(),
          ServiceRequestService.getAll({ limit: 1000 }).then((r) => r.total),
          ServiceRequestService.getAll({ status: "PENDING", limit: 1000 }).then(
            (r) => r.total
          ),
          TestimonialService.getAll({ limit: 1000 }).then((r) => r.total),
          TestimonialService.getAll({ approved: false, limit: 1000 }).then(
            (r) => r.total
          ),
          ProjectService.getAll({ limit: 1000 }).then((r) => r.total),
          ProjectService.getAll({ status: "DEPLOYED", limit: 1000 }).then(
            (r) => r.total
          ),
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
        const isRead =
          searchParams.get("isRead") === "true"
            ? true
            : searchParams.get("isRead") === "false"
            ? false
            : undefined;

        const messagesResult = await ContactMessageService.getAll({
          page,
          limit,
          isRead,
          orderBy: "createdAt",
          order: "desc",
        });

        return NextResponse.json({
          success: true,
          data: messagesResult,
        });

      case "requests":
        const requestsPage = parseInt(searchParams.get("page") || "1");
        const requestsLimit = parseInt(searchParams.get("limit") || "10");
        const status = searchParams.get("status") || undefined;
        const priority = searchParams.get("priority") || undefined;

        const requestsResult = await ServiceRequestService.getAll({
          page: requestsPage,
          limit: requestsLimit,
          status,
          priority,
          orderBy: "createdAt",
          order: "desc",
        });

        return NextResponse.json({
          success: true,
          data: requestsResult,
        });

      case "testimonials":
        const testimonialsPage = parseInt(searchParams.get("page") || "1");
        const testimonialsLimit = parseInt(searchParams.get("limit") || "10");
        const approved =
          searchParams.get("approved") === "true"
            ? true
            : searchParams.get("approved") === "false"
            ? false
            : undefined;

        const testimonialsResult = await TestimonialService.getAll({
          page: testimonialsPage,
          limit: testimonialsLimit,
          approved,
          orderBy: "createdAt",
          order: "desc",
        });

        return NextResponse.json({
          success: true,
          data: testimonialsResult,
        });

      case "projects":
        const projectsPage = parseInt(searchParams.get("page") || "1");
        const projectsLimit = parseInt(searchParams.get("limit") || "10");
        const projectStatus = searchParams.get("status") || undefined;

        const projectsResult = await ProjectService.getAll({
          page: projectsPage,
          limit: projectsLimit,
          status: projectStatus,
          orderBy: "createdAt",
          order: "desc",
        });

        return NextResponse.json({
          success: true,
          data: projectsResult,
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

// POST /api/admin/dashboard - Update records
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, id, data } = body;

    switch (action) {
      case "mark-message-read":
        await ContactMessageService.markAsRead(id);
        return NextResponse.json({ success: true });

      case "mark-message-replied":
        await ContactMessageService.markAsReplied(id, data.replyNotes);
        return NextResponse.json({ success: true });

      case "update-request-status":
        await ServiceRequestService.updateStatus(id, data.status, data.notes);
        return NextResponse.json({ success: true });

      case "update-request-priority":
        await ServiceRequestService.updatePriority(id, data.priority);
        return NextResponse.json({ success: true });

      case "approve-testimonial":
        await TestimonialService.approve(id);
        return NextResponse.json({ success: true });

      case "reject-testimonial":
        await TestimonialService.delete(id);
        return NextResponse.json({ success: true });

      case "feature-testimonial":
        await TestimonialService.setFeatured(id, data.featured);
        return NextResponse.json({ success: true });

      case "update-project-status":
        await ProjectService.updateStatus(id, data.status);
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
