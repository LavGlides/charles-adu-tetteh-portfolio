import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/database";
import { withRateLimit, publicApiLimiter } from "@/lib/rate-limit";

export async function GET(request: NextRequest) {
  return withRateLimit(request, publicApiLimiter, async () => {
    try {
      const { searchParams } = new URL(request.url);
      const approved = searchParams.get("approved");
      const featured = searchParams.get("featured");
      const limit = searchParams.get("limit");

      const whereClause: any = {};

    if (approved !== null) {
      whereClause.isApproved = approved === "true";
    }

    if (featured === "true") {
      whereClause.featured = true;
    }

    const testimonials = await prisma.testimonial.findMany({
      where: whereClause,
      orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
      take: limit ? parseInt(limit) : undefined,
      select: {
        id: true,
        clientName: true,
        clientTitle: true,
        clientCompany: true,
        clientEmail: true,
        clientImage: true,
        testimonial: true,
        rating: true,
        serviceType: true,
        projectId: true,
        isApproved: true,
        featured: true,
        isPublic: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: testimonials,
      count: testimonials.length,
    });
  } catch (error) {
    console.error("❌ Error fetching testimonials:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch testimonials",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
  });
}
