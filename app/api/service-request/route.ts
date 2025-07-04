import { type NextRequest, NextResponse } from "next/server";
import { sendEmail, createServiceRequestEmailTemplate } from "@/lib/email";

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

    // Create email template
    const emailTemplate = createServiceRequestEmailTemplate({
      clientName,
      clientEmail,
      projectType,
      budget,
      timeline,
      projectDescription,
    });

    // Send email to your inbox
    const emailResult = await sendEmail({
      to: process.env.EMAIL_USER || "aducharlest@gmail.com",
      subject: emailTemplate.subject,
      html: emailTemplate.html,
      text: emailTemplate.text,
    });

    if (!emailResult.success) {
      console.error("Failed to send service request email:", emailResult.error);
      return NextResponse.json(
        { success: false, message: "Failed to send service request" },
        { status: 500 }
      );
    }

    // Log the successful submission
    console.log("Service request processed:", {
      clientName,
      clientEmail,
      projectType,
      budget,
      timeline,
      messageId: emailResult.messageId,
    });

    return NextResponse.json({
      success: true,
      message:
        "Service request submitted successfully! I'll review your project details and get back to you within 24 hours.",
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
