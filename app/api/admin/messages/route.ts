import { NextRequest, NextResponse } from "next/server";
import { ContactService } from "@/lib/db-services";

// GET /api/admin/messages - Get contact messages
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const status = searchParams.get("status") || undefined;
    const type = searchParams.get("type") || undefined;

    const result = await ContactService.getAll({
      page,
      limit,
      status,
      type,
      orderBy: "createdAt",
      order: "desc",
    });

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Messages GET error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch messages" },
      { status: 500 }
    );
  }
}

// POST /api/admin/messages - Update message status
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, id, data } = body;

    switch (action) {
      case "updateStatus":
        await ContactService.updateStatus(id, data.status);
        return NextResponse.json({ success: true });

      case "markAsRead":
        await ContactService.updateStatus(id, "read");
        return NextResponse.json({ success: true });

      case "markAsReplied":
        await ContactService.markAsReplied(id, data?.replyNotes);
        return NextResponse.json({ success: true });

      case "archive":
        await ContactService.updateStatus(id, "archived");
        return NextResponse.json({ success: true });

      case "delete":
        await ContactService.delete(id);
        return NextResponse.json({ success: true });

      default:
        return NextResponse.json(
          { success: false, message: "Invalid action" },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error("Messages POST error:", error);
    return NextResponse.json(
      { success: false, message: "Operation failed" },
      { status: 500 }
    );
  }
}
