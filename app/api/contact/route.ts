import { type NextRequest, NextResponse } from "next/server";
import { sendEmail, createContactEmailTemplate } from "@/lib/email";

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

    // Create email template
    const emailTemplate = createContactEmailTemplate({
      name,
      email,
      subject,
      message,
    });

    // Send email to your inbox
    const emailResult = await sendEmail({
      to: process.env.EMAIL_USER || "aducharlest@gmail.com",
      subject: emailTemplate.subject,
      html: emailTemplate.html,
      text: emailTemplate.text,
    });

    if (!emailResult.success) {
      console.error("Failed to send email:", emailResult.error);
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
      messageId: emailResult.messageId,
    });

    return NextResponse.json({
      success: true,
      message: "Message sent successfully! I'll get back to you soon.",
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
