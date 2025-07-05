import { NextRequest, NextResponse } from "next/server";
import { ProjectService } from "@/lib/db-services";

// GET /api/admin/projects - Get projects
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const status = searchParams.get("status") || undefined;
    const category = searchParams.get("category") || undefined;
    const featured =
      searchParams.get("featured") === "true"
        ? true
        : searchParams.get("featured") === "false"
        ? false
        : undefined;

    const result = await ProjectService.getAll({
      page,
      limit,
      status,
      category,
      featured,
      orderBy: "createdAt",
      order: "desc",
    });

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Projects GET error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch projects" },
      { status: 500 }
    );
  }
}

// POST /api/admin/projects - Create or update project
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, id, data } = body;

    switch (action) {
      case "create":
        const newProject = await ProjectService.create(data);
        return NextResponse.json({
          success: true,
          data: newProject,
        });

      case "update":
        const updatedProject = await ProjectService.update(id, data);
        return NextResponse.json({
          success: true,
          data: updatedProject,
        });

      case "updateStatus":
        await ProjectService.updateStatus(id, data.status);
        return NextResponse.json({ success: true });

      case "setFeatured":
        await ProjectService.setFeatured(id, data.featured);
        return NextResponse.json({ success: true });

      case "delete":
        await ProjectService.delete(id);
        return NextResponse.json({ success: true });

      default:
        return NextResponse.json(
          { success: false, message: "Invalid action" },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error("Projects POST error:", error);
    return NextResponse.json(
      { success: false, message: "Operation failed" },
      { status: 500 }
    );
  }
}
