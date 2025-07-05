import { NextRequest, NextResponse } from "next/server";
import { seedCharlesData } from "@/scripts/seed-charles-data";

export async function POST(request: NextRequest) {
  try {
    console.log("🌱 Starting database seed from API...");

    await seedCharlesData();

    return NextResponse.json({
      success: true,
      message: "Database seeded successfully with Charles's portfolio data",
      data: {
        projects: 3,
        testimonials: 7,
        contactMessages: 2,
        serviceRequests: 2,
      },
    });
  } catch (error) {
    console.error("❌ Seed API error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to seed database",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
