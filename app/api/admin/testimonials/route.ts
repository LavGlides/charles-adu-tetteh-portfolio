import { NextRequest, NextResponse } from "next/server";
import { TestimonialService } from "@/lib/db-services";

// GET /api/admin/testimonials - Get testimonials
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const approved =
      searchParams.get("approved") === "true"
        ? true
        : searchParams.get("approved") === "false"
        ? false
        : undefined;
    const featured =
      searchParams.get("featured") === "true"
        ? true
        : searchParams.get("featured") === "false"
        ? false
        : undefined;

    const result = await TestimonialService.getAll({
      page,
      limit,
      approved,
      featured,
      orderBy: "createdAt",
      order: "desc",
    });

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Testimonials GET error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch testimonials" },
      { status: 500 }
    );
  }
}

// POST /api/admin/testimonials - Update testimonial
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, id, data } = body;

    switch (action) {
      case "approve":
        await TestimonialService.approve(id);
        return NextResponse.json({ success: true });

      case "setFeatured":
        await TestimonialService.setFeatured(id, data.featured);
        return NextResponse.json({ success: true });

      case "update":
        const updatedTestimonial = await TestimonialService.update(id, data);
        return NextResponse.json({
          success: true,
          data: updatedTestimonial,
        });

      case "delete":
        await TestimonialService.delete(id);
        return NextResponse.json({ success: true });

      default:
        return NextResponse.json(
          { success: false, message: "Invalid action" },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error("Testimonials POST error:", error);
    return NextResponse.json(
      { success: false, message: "Operation failed" },
      { status: 500 }
    );
  }
}
