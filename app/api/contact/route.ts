import { type NextRequest, NextResponse } from "next/server";
import { sendContactEmails } from "@/lib/email";
import { ContactMessageService, dbUtils } from "@/lib/db-services";
import { withRateLimit, contactLimiter } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  return withRateLimit(request, contactLimiter, async () => {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { success: false, message: "All fields are required" },
        { status: 400 }
      );
    }

    // Validate email format
    if (!dbUtils.validateEmail(email)) {
      return NextResponse.json(
        { success: false, message: "Please provide a valid email address" },
        { status: 400 }
      );
    }

    // Sanitize input data
    const sanitizedData = {
      name: dbUtils.sanitizeText(name),
      email: email.toLowerCase().trim(),
      subject: dbUtils.sanitizeText(subject),
      message: dbUtils.sanitizeText(message),
    };

    // Get client information
    const ipAddress = dbUtils.getClientIP(request);
    const userAgent = dbUtils.getUserAgent(request);

    // Save to database first
    let savedMessage;
    try {
      savedMessage = await ContactMessageService.create({
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
    const emailResult = await sendContactEmails(sanitizedData);

    // Update database with email status
    if (savedMessage && emailResult.success) {
      try {
        await ContactMessageService.updateEmailStatus(
          savedMessage.id,
          true,
          emailResult.notification?.messageId
        );
      } catch (updateError) {
        console.error("Failed to update email status:", updateError);
      }
    }

    if (!emailResult.success) {
      console.error("Failed to send emails:", emailResult.error);
      return NextResponse.json(
        { success: false, message: "Failed to send email" },
        { status: 500 }
      );
    }


    return NextResponse.json({
      success: true,
      message:
        "Thank you for your message! I've received it and you should receive a confirmation email shortly. I'll get back to you within 24-48 hours.",
    });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "An error occurred while sending your message",
      },
      { status: 500 }
    );
  }
  });
}
