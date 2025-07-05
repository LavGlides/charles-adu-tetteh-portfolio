import { type NextRequest, NextResponse } from "next/server";
import { sendServiceRequestEmails } from "@/lib/email";
import { ServiceRequestService, dbUtils } from "@/lib/db-services";

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

    // Validate email format
    if (!dbUtils.validateEmail(clientEmail)) {
      return NextResponse.json(
        { success: false, message: "Please provide a valid email address" },
        { status: 400 }
      );
    }

    // Sanitize input data
    const sanitizedData = {
      clientName: dbUtils.sanitizeText(clientName),
      clientEmail: clientEmail.toLowerCase().trim(),
      projectType: dbUtils.sanitizeText(projectType),
      budget: dbUtils.sanitizeText(budget),
      timeline: dbUtils.sanitizeText(timeline),
      projectDescription: dbUtils.sanitizeText(projectDescription),
    };

    // Get client information
    const ipAddress = dbUtils.getClientIP(request);
    const userAgent = dbUtils.getUserAgent(request);

    // Save to database first
    let savedRequest;
    try {
      savedRequest = await ServiceRequestService.create({
        ...sanitizedData,
        ipAddress,
        userAgent,
        emailSent: false, // Will update after email is sent
      });
    } catch (dbError) {
      console.error("Database save failed:", dbError);
      // Continue with email sending even if database fails
    }

    // Send both notification and confirmation emails
    const emailResult = await sendServiceRequestEmails(sanitizedData);

    // Update database with email status
    if (savedRequest && emailResult.success) {
      try {
        await ServiceRequestService.updateEmailStatus(
          savedRequest.id,
          true,
          emailResult.notification?.messageId
        );
        // Also update status to REVIEWING
        await ServiceRequestService.updateStatus(
          savedRequest.id,
          "REVIEWING",
          `Email sent successfully at ${new Date().toISOString()}`
        );
      } catch (updateError) {
        console.error("Failed to update email status:", updateError);
      }
    }

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
