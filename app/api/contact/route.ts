import { type NextRequest, NextResponse } from "next/server";
import { sendContactEmails } from "@/lib/email";

export async function POST(request: NextRequest) {
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

    // Send both notification and confirmation emails
    const emailResult = await sendContactEmails({
      name,
      email,
      subject,
      message,
    });

    if (!emailResult.success) {
      console.error("Failed to send emails:", emailResult.error);
      return NextResponse.json(
        { success: false, message: "Failed to send email" },
        { status: 500 }
      );
    }

    // Log the successful submission
    console.log("Contact form submission processed:", {
      name,
      email,
      subject,
      notification: emailResult.notification?.messageId,
      confirmation: emailResult.confirmation?.messageId,
    });

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
}
