import { NextRequest, NextResponse } from "next/server";
import {
  ContactMessageService,
  ServiceRequestService,
  AnalyticsService,
} from "@/lib/db-services";

export async function GET(request: NextRequest) {
  try {
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type") || "summary";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    switch (type) {
      case "summary":
        // Get dashboard summary statistics
        const stats = await AnalyticsService.getTotalStats();
        const recentContacts = await ContactMessageService.getAll({
          page: 1,
          limit: 5,
          orderBy: "createdAt",
          order: "desc",
        });
        const recentRequests = await ServiceRequestService.getAll({
          page: 1,
          limit: 5,
          orderBy: "createdAt",
          order: "desc",
        });

        return NextResponse.json({
          success: true,
          data: {
            stats,
            recentContacts: recentContacts.messages,
            recentRequests: recentRequests.requests,
          },
        });

      case "contacts":
        // Get contact messages with pagination
        const isRead =
          searchParams.get("read") === "true"
            ? true
            : searchParams.get("read") === "false"
            ? false
            : undefined;

        const contacts = await ContactMessageService.getAll({
          page,
          limit,
          isRead,
          orderBy: "createdAt",
          order: "desc",
        });

        return NextResponse.json({
          success: true,
          data: contacts,
        });

      case "requests":
        // Get service requests with pagination
        const status = searchParams.get("status") || undefined;
        const priority = searchParams.get("priority") || undefined;
        const requestRead =
          searchParams.get("read") === "true"
            ? true
            : searchParams.get("read") === "false"
            ? false
            : undefined;

        const requests = await ServiceRequestService.getAll({
          page,
          limit,
          status,
          priority,
          isRead: requestRead,
          orderBy: "createdAt",
          order: "desc",
        });

        return NextResponse.json({
          success: true,
          data: requests,
        });

      case "analytics":
        // Get analytics data
        const days = parseInt(searchParams.get("days") || "30");
        const pageViews = await AnalyticsService.getPageViewStats(days);

        return NextResponse.json({
          success: true,
          data: {
            pageViews,
            period: `${days} days`,
          },
        });

      default:
        return NextResponse.json(
          { success: false, message: "Invalid type parameter" },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error("Admin API error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

// Update contact message status
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, id, action, data } = body;

    if (!type || !id || !action) {
      return NextResponse.json(
        { success: false, message: "Missing required parameters" },
        { status: 400 }
      );
    }

    let result;

    switch (type) {
      case "contact":
        switch (action) {
          case "mark_read":
            result = await ContactMessageService.markAsRead(id);
            break;
          case "mark_replied":
            result = await ContactMessageService.markAsReplied(
              id,
              data?.replyNotes
            );
            break;
          case "delete":
            result = await ContactMessageService.delete(id);
            break;
          default:
            return NextResponse.json(
              { success: false, message: "Invalid action for contact" },
              { status: 400 }
            );
        }
        break;

      case "request":
        switch (action) {
          case "mark_read":
            result = await ServiceRequestService.markAsRead(id);
            break;
          case "update_status":
            if (!data?.status) {
              return NextResponse.json(
                { success: false, message: "Status is required" },
                { status: 400 }
              );
            }
            result = await ServiceRequestService.updateStatus(
              id,
              data.status,
              data.notes
            );
            break;
          case "update_priority":
            if (!data?.priority) {
              return NextResponse.json(
                { success: false, message: "Priority is required" },
                { status: 400 }
              );
            }
            result = await ServiceRequestService.updatePriority(
              id,
              data.priority
            );
            break;
          case "update_proposal":
            result = await ServiceRequestService.updateProposal(
              id,
              data?.proposalSent || false
            );
            break;
          case "update_contract":
            result = await ServiceRequestService.updateContract(
              id,
              data?.contractSigned || false
            );
            break;
          default:
            return NextResponse.json(
              { success: false, message: "Invalid action for service request" },
              { status: 400 }
            );
        }
        break;

      default:
        return NextResponse.json(
          { success: false, message: "Invalid type" },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Admin PATCH error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
