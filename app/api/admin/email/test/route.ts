import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // Check email configuration status using existing environment variables
    const emailConfigured = !!(
      process.env.EMAIL_USER && process.env.EMAIL_PASS
    );

    const config: any = {
      emailConfigured,
      service: "gmail", // Your existing service
      user: process.env.EMAIL_USER ? "configured" : "not set",
      password: process.env.EMAIL_PASS ? "configured" : "not set",
    };

    return NextResponse.json({
      success: true,
      config,
      message: emailConfigured
        ? "Email service is configured and ready using existing setup"
        : "Email service is NOT configured - emails will run in mock mode",
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
