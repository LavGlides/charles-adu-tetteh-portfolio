import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/database";
import { withRateLimit, publicApiLimiter } from "@/lib/rate-limit";

export async function GET(request: NextRequest) {
  return withRateLimit(request, publicApiLimiter, async () => {
    try {
      const { searchParams } = new URL(request.url);
      const featured = searchParams.get("featured");
      const category = searchParams.get("category");
      const status = searchParams.get("status");

      const whereClause: any = {
        isPublic: true,
      };

      if (featured === "true") {
        whereClause.featured = true;
      }

      if (category) {
        whereClause.category = category;
      }

      if (status) {
        whereClause.status = status;
      }

      const projects = await prisma.project.findMany({
        where: whereClause,
        orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
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
          demoUrl: true,
          imageUrl: true,
          images: true,
          startDate: true,
          endDate: true,
          clientName: true,
          clientCompany: true,
          duration: true,
          challenges: true,
          solutions: true,
          results: true,
          slug: true,
          tags: true,
          views: true,
          likes: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      return NextResponse.json({
        success: true,
        data: projects,
        count: projects.length,
      });
    } catch (error) {
      console.error("❌ Error fetching projects:", error);
      return NextResponse.json(
        {
          success: false,
          message: "Failed to fetch projects",
          error: error instanceof Error ? error.message : "Unknown error",
        },
        { status: 500 }
      );
    }
  });
}
