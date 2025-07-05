import { NextRequest, NextResponse } from "next/server";
import { ServiceRequestService } from "@/lib/db-services";

// GET /api/admin/service-requests - Get service requests
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const status = searchParams.get("status") || undefined;

    const result = await ServiceRequestService.getAll({
      page,
      limit,
      status,
      orderBy: "createdAt",
      order: "desc",
    });

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Service requests GET error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch service requests" },
      { status: 500 }
    );
  }
}

// POST /api/admin/service-requests - Update service request
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, id, data } = body;

    switch (action) {
      case "updateStatus":
        await ServiceRequestService.updateStatus(id, data.status);
        return NextResponse.json({ success: true });

      case "archive":
        await ServiceRequestService.updateStatus(id, "ARCHIVED");
        return NextResponse.json({ success: true });

      default:
        return NextResponse.json(
          { success: false, message: "Invalid action" },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error("Service requests POST error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update service request" },
      { status: 500 }
    );
  }
}
