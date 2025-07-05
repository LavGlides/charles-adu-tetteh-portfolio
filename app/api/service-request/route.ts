import { type NextRequest, NextResponse } from "next/server";
import { sendServiceRequestEmails } from "@/lib/email";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      clientName,
      clientEmail,
      projectType,
      budget,
      timeline,
      projectDescription,
    } = body;

    // Validate required fields
    if (
      !clientName ||
      !clientEmail ||
      !projectType ||
      !budget ||
      !timeline ||
      !projectDescription
    ) {
      return NextResponse.json(
        { success: false, message: "All fields are required" },
        { status: 400 }
      );
    }

    // Send both notification and confirmation emails
    const emailResult = await sendServiceRequestEmails({
      clientName,
      clientEmail,
      projectType,
      budget,
      timeline,
      projectDescription,
    });

    if (!emailResult.success) {
      console.error(
        "Failed to send service request emails:",
        emailResult.error
      );
      return NextResponse.json(
        { success: false, message: "Failed to send service request" },
        { status: 500 }
      );
    }

    // Log the successful submission
    // Log the successful submission
    console.log("Service request processed:", {
      clientName,
      clientEmail,
      projectType,
      budget,
      timeline,
      notification: emailResult.notification?.messageId,
      confirmation: emailResult.confirmation?.messageId,
    });

    return NextResponse.json({
      success: true,
      message:
        "Service request submitted successfully! You should receive a confirmation email shortly. I'll review your project details and get back to you within 24 hours.",
    });
  } catch (error) {
    console.error("Service request error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "An error occurred while submitting your service request",
      },
      { status: 500 }
    );
  }
}
