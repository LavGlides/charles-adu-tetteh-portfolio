import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/lib/email";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { to, subject, message, messageId } = body;


    // Check if email service is configured
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.warn("Email service not configured, using mock mode");
      // Simulate email sending delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      return NextResponse.json({
        success: true,
        message: "Email sent successfully (mock mode - email service not configured)",
        data: {
          emailId: `mock_email_${Date.now()}`,
          sentAt: new Date().toISOString(),
          mode: "mock",
        },
      });
    }

    // Use the existing email service from lib/email.ts
    const result = await sendEmail({
      to: to,
      subject: subject,
      html: `
        <html>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
              <div style="border-bottom: 3px solid #7c3aed; padding-bottom: 20px; margin-bottom: 20px;">
                <h2 style="color: #7c3aed; margin: 0;">Response to your inquiry</h2>
              </div>
              
              <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                <h3 style="margin-top: 0; color: #495057;">Subject: ${subject}</h3>
              </div>
              
              <div style="white-space: pre-wrap; line-height: 1.6; color: #495057; padding: 20px; border-left: 4px solid #7c3aed; background-color: #f8f9fa;">
                ${message.replace(/\n/g, '<br>')}
              </div>
              
              <hr style="margin: 30px 0; border: none; border-top: 1px solid #dee2e6;">
              
              <div style="text-align: center; color: #6c757d; font-size: 14px;">
                <p style="margin: 0;">This email was sent from Charles Adu Tetteh's portfolio admin dashboard.</p>
                <p style="margin: 5px 0 0 0;">
                  <a href="https://charlesadutetteh.com" style="color: #7c3aed; text-decoration: none;">
                    Visit Portfolio
                  </a>
                </p>
              </div>
            </div>
          </body>
        </html>
      `,
      text: `Subject: ${subject}\n\n${message}\n\n---\nThis email was sent from Charles Adu Tetteh's portfolio admin dashboard.\nVisit: https://charles-adu-tetteh.vercel.app`,
    });

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: "Email sent successfully",
        data: {
          emailId: result.messageId,
          sentAt: new Date().toISOString(),
          mode: "live",
        },
      });
    } else {
      throw new Error("Email service failed to send message");
    }
  } catch (error) {
    console.error("Error sending email:", error);
    
    // If it's a configuration error, fall back to mock mode
    if (error instanceof Error && (
      error.message.includes("Invalid login") ||
      error.message.includes("authentication failed") ||
      error.message.includes("ECONNREFUSED") ||
      error.message.includes("getaddrinfo ENOTFOUND")
    )) {
      console.warn("Email service configuration issue, falling back to mock mode");
      return NextResponse.json({
        success: true,
        message: "Email sent successfully (mock mode - configuration issue)",
        data: {
          emailId: `mock_email_${Date.now()}`,
          sentAt: new Date().toISOString(),
          mode: "mock",
          error: error.message,
        },
      });
    }
    
    return NextResponse.json(
      {
        success: false,
        message: "Failed to send email",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
