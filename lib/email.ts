import nodemailer from "nodemailer";

// Email configuration
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Contact form email template
export const createContactEmailTemplate = (data: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) => {
  return {
    subject: `Portfolio Contact: ${data.subject}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>New Contact Message</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #7c3aed, #4f46e5); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center; }
            .content { background: #f8fafc; padding: 30px; border: 1px solid #e2e8f0; }
            .section { margin-bottom: 25px; }
            .label { font-weight: bold; color: #4f46e5; margin-bottom: 5px; display: block; }
            .value { background: white; padding: 15px; border-radius: 8px; border: 1px solid #e2e8f0; }
            .message-box { background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #7c3aed; }
            .footer { background: #1e293b; color: white; padding: 20px; border-radius: 0 0 10px 10px; text-align: center; font-size: 14px; }
            .portfolio-link { color: #7c3aed; text-decoration: none; font-weight: bold; }
            .portfolio-link:hover { text-decoration: underline; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎯 New Contact Message</h1>
              <p>Someone reached out through your portfolio!</p>
            </div>
            
            <div class="content">
              <div class="section">
                <span class="label">👤 From:</span>
                <div class="value">${data.name}</div>
              </div>
              
              <div class="section">
                <span class="label">📧 Email:</span>
                <div class="value">
                  <a href="mailto:${data.email}" style="color: #7c3aed;">${
      data.email
    }</a>
                </div>
              </div>
              
              <div class="section">
                <span class="label">📝 Subject:</span>
                <div class="value">${data.subject}</div>
              </div>
              
              <div class="section">
                <span class="label">💬 Message:</span>
                <div class="message-box">
                  ${data.message.replace(/\n/g, "<br>")}
                </div>
              </div>
            </div>
            
            <div class="footer">
              <p>This message was sent from your portfolio contact form</p>
              <p>📅 ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
              <p>
                <a href="https://charles-adu-tetteh.vercel.app" class="portfolio-link">
                  View Portfolio
                </a>
              </p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `
New Contact Message from Portfolio

From: ${data.name}
Email: ${data.email}
Subject: ${data.subject}

Message:
${data.message}

Sent on: ${new Date().toLocaleString()}
    `,
  };
};

// Service request email template
export const createServiceRequestEmailTemplate = (data: {
  clientName: string;
  clientEmail: string;
  projectType: string;
  budget: string;
  timeline: string;
  projectDescription: string;
}) => {
  return {
    subject: `🚀 New Service Request: ${data.projectType}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>New Service Request</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #059669, #7c3aed); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center; }
            .content { background: #f8fafc; padding: 30px; border: 1px solid #e2e8f0; }
            .section { margin-bottom: 25px; }
            .label { font-weight: bold; color: #059669; margin-bottom: 5px; display: block; }
            .value { background: white; padding: 15px; border-radius: 8px; border: 1px solid #e2e8f0; }
            .project-details { background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #059669; }
            .footer { background: #1e293b; color: white; padding: 20px; border-radius: 0 0 10px 10px; text-align: center; font-size: 14px; }
            .portfolio-link { color: #7c3aed; text-decoration: none; font-weight: bold; }
            .portfolio-link:hover { text-decoration: underline; }
            .highlight { background: #ecfdf5; padding: 10px; border-radius: 6px; margin: 10px 0; }
            .budget-badge { background: #059669; color: white; padding: 5px 15px; border-radius: 20px; font-weight: bold; }
            .timeline-badge { background: #7c3aed; color: white; padding: 5px 15px; border-radius: 20px; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🚀 New Service Request</h1>
              <p>A potential client wants to work with you!</p>
            </div>
            
            <div class="content">
              <div class="section">
                <span class="label">👤 Client Name:</span>
                <div class="value">${data.clientName}</div>
              </div>
              
              <div class="section">
                <span class="label">📧 Client Email:</span>
                <div class="value">
                  <a href="mailto:${
                    data.clientEmail
                  }" style="color: #059669;">${data.clientEmail}</a>
                </div>
              </div>
              
              <div class="section">
                <span class="label">🎯 Project Type:</span>
                <div class="value">
                  <strong>${data.projectType}</strong>
                </div>
              </div>
              
              <div class="section">
                <span class="label">💰 Budget Range:</span>
                <div class="value">
                  <span class="budget-badge">${data.budget}</span>
                </div>
              </div>
              
              <div class="section">
                <span class="label">⏰ Timeline:</span>
                <div class="value">
                  <span class="timeline-badge">${data.timeline}</span>
                </div>
              </div>
              
              <div class="section">
                <span class="label">📋 Project Description:</span>
                <div class="project-details">
                  ${data.projectDescription.replace(/\n/g, "<br>")}
                </div>
              </div>
              
              <div class="highlight">
                <strong>💡 Quick Actions:</strong><br>
                • Reply to client: <a href="mailto:${
                  data.clientEmail
                }">Send Email</a><br>
                • Review portfolio: <a href="https://charles-adu-tetteh.vercel.app">Visit Site</a><br>
                • Schedule meeting: <a href="mailto:${
                  data.clientEmail
                }?subject=Re: ${data.projectType} Project&body=Hi ${
      data.clientName
    },%0D%0A%0D%0AThank you for your interest in my services...">Quick Reply</a>
              </div>
            </div>
            
            <div class="footer">
              <p>This service request was submitted through your portfolio</p>
              <p>📅 ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
              <p>
                <a href="https://charles-adu-tetteh.vercel.app" class="portfolio-link">
                  View Portfolio Admin
                </a>
              </p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `
New Service Request from Portfolio

Client: ${data.clientName}
Email: ${data.clientEmail}
Project Type: ${data.projectType}
Budget: ${data.budget}
Timeline: ${data.timeline}

Project Description:
${data.projectDescription}

Sent on: ${new Date().toLocaleString()}
    `,
  };
};

// Contact form confirmation email template (auto-reply to sender)
export const createContactConfirmationTemplate = (data: {
  name: string;
  subject: string;
}) => {
  return {
    subject: `✅ Thank you for contacting Charles Adu Tetteh - Message Received`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Message Confirmation</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f8fafc; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #7c3aed, #4f46e5); color: white; padding: 40px 30px; border-radius: 15px 15px 0 0; text-align: center; }
            .content { background: white; padding: 40px 30px; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05); }
            .message-box { background: #f0f9ff; padding: 25px; border-radius: 12px; border-left: 4px solid #7c3aed; margin: 25px 0; }
            .next-steps { background: #ecfdf5; padding: 25px; border-radius: 12px; border-left: 4px solid #059669; margin: 25px 0; }
            .footer { background: #1e293b; color: white; padding: 30px; border-radius: 0 0 15px 15px; text-align: center; }
            .signature { margin-top: 30px; padding-top: 20px; border-top: 2px solid #e2e8f0; font-style: italic; color: #64748b; }
            .portfolio-link { color: #7c3aed; text-decoration: none; font-weight: bold; padding: 10px 20px; background: #f1f5f9; border-radius: 8px; display: inline-block; margin: 10px 5px; }
            .portfolio-link:hover { background: #e2e8f0; text-decoration: none; }
            .social-links { margin: 20px 0; }
            .social-link { color: #7c3aed; text-decoration: none; margin: 0 10px; }
            .highlight { color: #7c3aed; font-weight: bold; }
            .emoji { font-size: 1.2em; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 Message Received Successfully!</h1>
              <p>Thank you for reaching out, ${data.name}!</p>
            </div>
            
            <div class="content">
              <div class="message-box">
                <h3 style="margin-top: 0; color: #7c3aed;">✨ Your message has been received</h3>
                <p>Hello <strong>${data.name}</strong>,</p>
                <p>Thank you for contacting me through my portfolio! I've successfully received your message regarding "<strong>${
                  data.subject
                }</strong>" and I'm excited to connect with you.</p>
              </div>

              <div class="next-steps">
                <h3 style="margin-top: 0; color: #059669;"><span class="emoji">⏰</span> What happens next?</h3>
                <ul style="padding-left: 20px;">
                  <li><strong>Response Time:</strong> I typically respond within <span class="highlight">24-48 hours</span> during business days</li>
                  <li><strong>Detailed Review:</strong> I'll carefully review your message and requirements</li>
                  <li><strong>Personal Response:</strong> You'll receive a personalized reply addressing your specific needs</li>
                  <li><strong>Next Steps:</strong> If it's a project inquiry, I'll include relevant information about timelines and process</li>
                </ul>
              </div>

              <div style="text-align: center; margin: 30px 0;">
                <h3 style="color: #64748b; margin-bottom: 20px;">While you wait, feel free to explore:</h3>
                <a href="${
                  process.env.NEXT_PUBLIC_PORTFOLIO_URL ||
                  "https://charles-adu-tetteh.vercel.app"
                }/#projects" class="portfolio-link">
                  <span class="emoji">🚀</span> View My Projects
                </a>
                <a href="${
                  process.env.NEXT_PUBLIC_PORTFOLIO_URL ||
                  "https://charles-adu-tetteh.vercel.app"
                }/#about" class="portfolio-link">
                  <span class="emoji">👨‍💻</span> Learn About Me
                </a>
                <a href="${
                  process.env.NEXT_PUBLIC_PORTFOLIO_URL ||
                  "https://charles-adu-tetteh.vercel.app"
                }/#testimonials" class="portfolio-link">
                  <span class="emoji">⭐</span> Read Testimonials
                </a>
              </div>

              <div class="social-links" style="text-align: center;">
                <p style="margin-bottom: 15px; color: #64748b;">Connect with me on social media:</p>
                <a href="https://www.linkedin.com/in/charles-adu-tetteh-00546a109" class="social-link">LinkedIn</a> |
                <a href="https://github.com/LavGlides" class="social-link">GitHub</a> |
                <a href="mailto:aducharlest@gmail.com" class="social-link">Email</a>
              </div>

              <div class="signature">
                <p><strong>Best regards,</strong></p>
                <p><strong>Charles Adu Tetteh</strong><br>
                Full-Stack Developer & AWS Cloud Solutions Expert<br>
                <span class="emoji">📧</span> aducharlest@gmail.com<br>
                <span class="emoji">📱</span> +233 541 725 256<br>
                <span class="emoji">🌍</span> Accra, Ghana</p>
              </div>
            </div>
            
            <div class="footer">
              <p><span class="emoji">🤖</span> This is an automated confirmation email</p>
              <p>📅 Sent on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
              <p style="font-size: 12px; margin-top: 15px; opacity: 0.8;">
                Please do not reply to this email. If you need immediate assistance, 
                contact me directly at aducharlest@gmail.com
              </p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `
Thank you for contacting Charles Adu Tetteh!

Hello ${data.name},

Your message regarding "${data.subject}" has been successfully received.

What happens next:
- Response Time: I typically respond within 24-48 hours during business days
- Detailed Review: I'll carefully review your message and requirements  
- Personal Response: You'll receive a personalized reply addressing your specific needs

While you wait, feel free to explore my portfolio at: ${
      process.env.NEXT_PUBLIC_PORTFOLIO_URL ||
      "https://charles-adu-tetteh.vercel.app"
    }

Connect with me:
- LinkedIn: https://www.linkedin.com/in/charles-adu-tetteh-00546a109
- GitHub: https://github.com/LavGlides
- Email: aducharlest@gmail.com

Best regards,
Charles Adu Tetteh
Full-Stack Developer & AWS Cloud Solutions Expert
Phone: +233 541 725 256
Location: Accra, Ghana

---
This is an automated confirmation email sent on ${new Date().toLocaleString()}
Please do not reply to this email. For immediate assistance, contact me directly at aducharlest@gmail.com
    `,
  };
};

// Service request confirmation email template (auto-reply to client)
export const createServiceRequestConfirmationTemplate = (data: {
  clientName: string;
  projectType: string;
  budget: string;
  timeline: string;
}) => {
  return {
    subject: `🚀 Service Request Confirmed - Let's Build Something Amazing Together!`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Service Request Confirmation</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f8fafc; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #059669, #7c3aed); color: white; padding: 40px 30px; border-radius: 15px 15px 0 0; text-align: center; }
            .content { background: white; padding: 40px 30px; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05); }
            .project-summary { background: #f0f9ff; padding: 25px; border-radius: 12px; border-left: 4px solid #059669; margin: 25px 0; }
            .next-steps { background: #fef3e2; padding: 25px; border-radius: 12px; border-left: 4px solid #f59e0b; margin: 25px 0; }
            .process-steps { background: #ecfdf5; padding: 25px; border-radius: 12px; margin: 25px 0; }
            .footer { background: #1e293b; color: white; padding: 30px; border-radius: 0 0 15px 15px; text-align: center; }
            .signature { margin-top: 30px; padding-top: 20px; border-top: 2px solid #e2e8f0; font-style: italic; color: #64748b; }
            .badge { padding: 8px 16px; border-radius: 20px; font-weight: bold; margin: 5px; display: inline-block; }
            .budget-badge { background: #059669; color: white; }
            .timeline-badge { background: #7c3aed; color: white; }
            .type-badge { background: #f59e0b; color: white; }
            .portfolio-link { color: #7c3aed; text-decoration: none; font-weight: bold; padding: 10px 20px; background: #f1f5f9; border-radius: 8px; display: inline-block; margin: 10px 5px; }
            .portfolio-link:hover { background: #e2e8f0; text-decoration: none; }
            .highlight { color: #059669; font-weight: bold; }
            .emoji { font-size: 1.2em; }
            .step { margin: 15px 0; padding: 15px; background: #f8fafc; border-radius: 8px; border-left: 3px solid #059669; }
            .step-number { background: #059669; color: white; width: 25px; height: 25px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-weight: bold; margin-right: 10px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎯 Service Request Received!</h1>
              <p>Thank you for choosing me for your project, ${
                data.clientName
              }!</p>
            </div>
            
            <div class="content">
              <div class="project-summary">
                <h3 style="margin-top: 0; color: #059669;"><span class="emoji">📋</span> Project Summary</h3>
                <p>Hello <strong>${data.clientName}</strong>,</p>
                <p>I'm excited about the opportunity to work on your <strong>${
                  data.projectType
                }</strong> project! Here's a summary of your request:</p>
                
                <div style="text-align: center; margin: 20px 0;">
                  <span class="badge type-badge"><span class="emoji">🛠️</span> ${
                    data.projectType
                  }</span>
                  <span class="badge budget-badge"><span class="emoji">💰</span> ${
                    data.budget
                  }</span>
                  <span class="badge timeline-badge"><span class="emoji">⏱️</span> ${
                    data.timeline
                  }</span>
                </div>
              </div>

              <div class="next-steps">
                <h3 style="margin-top: 0; color: #f59e0b;"><span class="emoji">⚡</span> Immediate Next Steps</h3>
                <ul style="padding-left: 20px;">
                  <li><strong>Project Review:</strong> I'll analyze your requirements in detail within the next <span class="highlight">24 hours</span></li>
                  <li><strong>Initial Consultation:</strong> I'll reach out to schedule a call/meeting to discuss your vision</li>
                  <li><strong>Custom Proposal:</strong> You'll receive a detailed proposal with timeline, milestones, and technical approach</li>
                  <li><strong>Q&A Session:</strong> We'll address any questions and finalize project details</li>
                </ul>
              </div>

              <div class="process-steps">
                <h3 style="margin-top: 0; color: #059669;"><span class="emoji">🚀</span> My Development Process</h3>
                
                <div class="step">
                  <span class="step-number">1</span>
                  <strong>Discovery & Planning</strong><br>
                  <small>Requirements gathering, technical architecture, and project roadmap</small>
                </div>
                
                <div class="step">
                  <span class="step-number">2</span>
                  <strong>Design & Prototyping</strong><br>
                  <small>UI/UX design, wireframes, and interactive prototypes</small>
                </div>
                
                <div class="step">
                  <span class="step-number">3</span>
                  <strong>Development & Testing</strong><br>
                  <small>Agile development with regular updates and quality assurance</small>
                </div>
                
                <div class="step">
                  <span class="step-number">4</span>
                  <strong>Deployment & Support</strong><br>
                  <small>Production deployment, training, and ongoing maintenance</small>
                </div>
              </div>

              <div style="text-align: center; margin: 30px 0;">
                <h3 style="color: #64748b; margin-bottom: 20px;">Explore my expertise:</h3>
                <a href="${
                  process.env.NEXT_PUBLIC_PORTFOLIO_URL ||
                  "https://charles-adu-tetteh.vercel.app"
                }/#projects" class="portfolio-link">
                  <span class="emoji">💼</span> Portfolio Projects
                </a>
                <a href="${
                  process.env.NEXT_PUBLIC_PORTFOLIO_URL ||
                  "https://charles-adu-tetteh.vercel.app"
                }/#testimonials" class="portfolio-link">
                  <span class="emoji">⭐</span> Client Reviews
                </a>
                <a href="${
                  process.env.NEXT_PUBLIC_PORTFOLIO_URL ||
                  "https://charles-adu-tetteh.vercel.app"
                }/#about" class="portfolio-link">
                  <span class="emoji">🎯</span> My Expertise
                </a>
              </div>

              <div style="background: #fef3e2; padding: 20px; border-radius: 12px; text-align: center; margin: 25px 0;">
                <h4 style="margin-top: 0; color: #f59e0b;"><span class="emoji">📞</span> Need to discuss urgently?</h4>
                <p style="margin-bottom: 10px;">Feel free to reach out directly:</p>
                <p><strong>📧 Email:</strong> aducharlest@gmail.com</p>
                <p><strong>📱 Phone:</strong> +233 541 725 256</p>
                <p><strong>💼 LinkedIn:</strong> <a href="https://www.linkedin.com/in/charles-adu-tetteh-00546a109" style="color: #f59e0b;">Charles Adu Tetteh</a></p>
              </div>

              <div class="signature">
                <p><strong>Looking forward to building something amazing together!</strong></p>
                <p><strong>Charles Adu Tetteh</strong><br>
                Full-Stack Developer & AWS Cloud Solutions Expert<br>
                <span class="emoji">🏆</span> Delivering scalable solutions since 2020<br>
                <span class="emoji">🌍</span> Based in Accra, Ghana • Available globally</p>
              </div>
            </div>
            
            <div class="footer">
              <p><span class="emoji">🤖</span> This is an automated confirmation email</p>
              <p>📅 Sent on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
              <p style="font-size: 12px; margin-top: 15px; opacity: 0.8;">
                Please do not reply to this email. For direct communication, 
                contact me at aducharlest@gmail.com or call +233 541 725 256
              </p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `
🚀 Service Request Confirmed - Thank you ${data.clientName}!

I'm excited about the opportunity to work on your ${data.projectType} project!

PROJECT SUMMARY:
- Type: ${data.projectType}
- Budget: ${data.budget}  
- Timeline: ${data.timeline}

IMMEDIATE NEXT STEPS:
1. Project Review: I'll analyze your requirements within 24 hours
2. Initial Consultation: I'll reach out to schedule a call/meeting
3. Custom Proposal: You'll receive a detailed proposal with timeline and approach
4. Q&A Session: We'll address questions and finalize project details

MY DEVELOPMENT PROCESS:
1. Discovery & Planning - Requirements and architecture
2. Design & Prototyping - UI/UX design and wireframes  
3. Development & Testing - Agile development with regular updates
4. Deployment & Support - Production deployment and maintenance

CONTACT ME DIRECTLY:
📧 Email: aducharlest@gmail.com
📱 Phone: +233 541 725 256
💼 LinkedIn: https://www.linkedin.com/in/charles-adu-tetteh-00546a109

Portfolio: ${
      process.env.NEXT_PUBLIC_PORTFOLIO_URL ||
      "https://charles-adu-tetteh.vercel.app"
    }

Looking forward to building something amazing together!

Best regards,
Charles Adu Tetteh
Full-Stack Developer & AWS Cloud Solutions Expert
Based in Accra, Ghana • Available globally

---
This is an automated confirmation email sent on ${new Date().toLocaleString()}
Please do not reply to this email. For direct communication, contact me at aducharlest@gmail.com
    `,
  };
};

// Testimonial notification and confirmation emails
export const sendTestimonialNotificationAndConfirmation = async (data: {
  testimonial: {
    name: string;
    email: string;
    role: string;
    company: string;
    projectType: string;
    rating: number;
    content: string;
    consent: boolean;
  };
  testimonialId: string;
}) => {
  try {
    // Admin notification email
    const notificationTemplate = createTestimonialNotificationTemplate(data);
    const notificationResult = await sendEmail({
      to: process.env.EMAIL_USER!,
      subject: notificationTemplate.subject,
      html: notificationTemplate.html,
      text: notificationTemplate.text,
    });

    // User confirmation email
    const confirmationTemplate = createTestimonialConfirmationTemplate(data);
    const confirmationResult = await sendEmail({
      to: data.testimonial.email,
      subject: confirmationTemplate.subject,
      html: confirmationTemplate.html,
      text: confirmationTemplate.text,
    });

    return {
      success: notificationResult.success && confirmationResult.success,
      notification: notificationResult,
      confirmation: confirmationResult,
    };
  } catch (error) {
    console.error("Testimonial emails sending failed:", error);
    return { success: false, error };
  }
};

// Testimonial notification email template (to admin)
export const createTestimonialNotificationTemplate = (data: {
  testimonial: {
    name: string;
    email: string;
    role: string;
    company: string;
    projectType: string;
    rating: number;
    content: string;
    consent: boolean;
  };
  testimonialId: string;
}) => {
  const stars = "⭐".repeat(data.testimonial.rating);

  return {
    subject: `New Testimonial: ${stars} from ${data.testimonial.name}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>New Testimonial Received</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #059669, #10b981); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center; }
            .content { background: #f0f9ff; padding: 30px; border: 1px solid #e2e8f0; }
            .section { margin-bottom: 25px; }
            .label { font-weight: bold; color: #059669; margin-bottom: 5px; display: block; }
            .value { background: white; padding: 15px; border-radius: 8px; border: 1px solid #e2e8f0; }
            .testimonial-box { background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #10b981; }
            .rating { font-size: 24px; margin: 10px 0; }
            .footer { background: #1e293b; color: white; padding: 20px; border-radius: 0 0 10px 10px; text-align: center; font-size: 14px; }
            .action-btn { background: #059669; color: white; padding: 12px 20px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 10px 5px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>⭐ New Testimonial Received!</h1>
              <p>A client has shared their experience working with you!</p>
            </div>
            
            <div class="content">
              <div class="section">
                <span class="label">Client Name:</span>
                <div class="value">${data.testimonial.name}</div>
              </div>
              
              <div class="section">
                <span class="label">Email:</span>
                <div class="value">${data.testimonial.email}</div>
              </div>
              
              <div class="section">
                <span class="label">Role & Company:</span>
                <div class="value">${data.testimonial.role} at ${
      data.testimonial.company
    }</div>
              </div>
              
              <div class="section">
                <span class="label">Project Type:</span>
                <div class="value">${data.testimonial.projectType}</div>
              </div>
              
              <div class="section">
                <span class="label">Rating:</span>
                <div class="value">
                  <div class="rating">${stars}</div>
                  ${data.testimonial.rating}/5 Stars
                </div>
              </div>
              
              <div class="section">
                <span class="label">Testimonial:</span>
                <div class="testimonial-box">
                  "${data.testimonial.content}"
                </div>
              </div>
              
              <div class="section">
                <span class="label">Marketing Consent:</span>
                <div class="value">${
                  data.testimonial.consent ? "✅ Yes" : "❌ No"
                }</div>
              </div>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="http://localhost:5555" class="action-btn">Review in Database</a>
                <a href="http://localhost:3001/admin" class="action-btn">Admin Dashboard</a>
              </div>
            </div>
            
            <div class="footer">
              <p><strong>Action Required:</strong> Review and approve this testimonial to display it on your portfolio.</p>
              <p>Testimonial ID: ${data.testimonialId}</p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `
      New Testimonial Received!
      
      From: ${data.testimonial.name} (${data.testimonial.email})
      Role: ${data.testimonial.role} at ${data.testimonial.company}
      Project: ${data.testimonial.projectType}
      Rating: ${data.testimonial.rating}/5 stars
      
      Testimonial:
      "${data.testimonial.content}"
      
      Marketing Consent: ${data.testimonial.consent ? "Yes" : "No"}
      Testimonial ID: ${data.testimonialId}
      
      Please review and approve this testimonial in your admin dashboard.
    `,
  };
};

// Testimonial confirmation email template (to client)
export const createTestimonialConfirmationTemplate = (data: {
  testimonial: {
    name: string;
    email: string;
    role: string;
    company: string;
    projectType: string;
    rating: number;
    content: string;
    consent: boolean;
  };
  testimonialId: string;
}) => {
  const stars = "⭐".repeat(data.testimonial.rating);

  return {
    subject: "Thank you for your testimonial! ⭐",
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Testimonial Confirmation</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center; }
            .content { background: #f0f9ff; padding: 30px; border: 1px solid #e2e8f0; }
            .section { margin-bottom: 25px; }
            .testimonial-box { background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #10b981; margin: 20px 0; }
            .rating { font-size: 20px; margin: 10px 0; }
            .footer { background: #1e293b; color: white; padding: 20px; border-radius: 0 0 10px 10px; text-align: center; font-size: 14px; }
            .portfolio-link { color: #10b981; text-decoration: none; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Thank You, ${data.testimonial.name}! 🙏</h1>
              <p>Your testimonial has been received and will be reviewed shortly.</p>
            </div>
            
            <div class="content">
              <p>Hi ${data.testimonial.name},</p>
              
              <p>Thank you so much for taking the time to share your experience! Your ${
                data.testimonial.rating
              }-star testimonial means a lot and helps others understand the value of working together.</p>
              
              <div class="testimonial-box">
                <div class="rating">${stars}</div>
                <p><strong>Your testimonial:</strong></p>
                <p>"${data.testimonial.content}"</p>
                <p><em>- ${data.testimonial.name}, ${
      data.testimonial.role
    } at ${data.testimonial.company}</em></p>
              </div>
              
              <p><strong>What happens next?</strong></p>
              <ul>
                <li>Your testimonial will be reviewed for approval</li>
                <li>Once approved, it may be featured on the portfolio website</li>
                <li>You'll be notified if your testimonial is published</li>
              </ul>
              
              <p>If you have any questions or would like to work together again, don't hesitate to reach out!</p>
              
              <p>Best regards,<br>
              <strong>Charles Adu Tetteh</strong><br>
              Full Stack Developer</p>
            </div>
            
            <div class="footer">
              <p>Visit the portfolio: <a href="${
                process.env.NEXT_PUBLIC_PORTFOLIO_URL ||
                "https://charles-adu-tetteh.vercel.app"
              }" class="portfolio-link">charles-adu-tetteh.vercel.app</a></p>
              <p>Reference ID: ${data.testimonialId}</p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `
      Thank You, ${data.testimonial.name}!
      
      Your ${
        data.testimonial.rating
      }-star testimonial has been received and will be reviewed shortly.
      
      Your testimonial:
      "${data.testimonial.content}"
      - ${data.testimonial.name}, ${data.testimonial.role} at ${
      data.testimonial.company
    }
      
      What happens next:
      - Your testimonial will be reviewed for approval
      - Once approved, it may be featured on the portfolio website
      - You'll be notified if your testimonial is published
      
      Thank you for your trust and feedback!
      
      Best regards,
      Charles Adu Tetteh
      Full Stack Developer
      
      Portfolio: ${
        process.env.NEXT_PUBLIC_PORTFOLIO_URL ||
        "https://charles-adu-tetteh.vercel.app"
      }
      Reference ID: ${data.testimonialId}
    `,
  };
};

// Send email function
export const sendEmail = async (options: {
  to: string;
  subject: string;
  html: string;
  text: string;
}) => {
  try {
    const info = await transporter.sendMail({
      from: `"Charles Adu Tetteh Portfolio" <${process.env.EMAIL_USER}>`,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
    });

    console.log("Email sent: %s", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Email sending failed:", error);
    return { success: false, error };
  }
};

// Send contact form emails (notification + confirmation)
export const sendContactEmails = async (data: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) => {
  try {
    // Send notification email to you
    const notificationTemplate = createContactEmailTemplate(data);
    const notificationResult = await sendEmail({
      to: process.env.EMAIL_USER!,
      subject: notificationTemplate.subject,
      html: notificationTemplate.html,
      text: notificationTemplate.text,
    });

    // Send confirmation email to the sender
    const confirmationTemplate = createContactConfirmationTemplate({
      name: data.name,
      subject: data.subject,
    });
    const confirmationResult = await sendEmail({
      to: data.email,
      subject: confirmationTemplate.subject,
      html: confirmationTemplate.html,
      text: confirmationTemplate.text,
    });

    return {
      success: notificationResult.success && confirmationResult.success,
      notification: notificationResult,
      confirmation: confirmationResult,
    };
  } catch (error) {
    console.error("Contact emails sending failed:", error);
    return { success: false, error };
  }
};

// Send service request emails (notification + confirmation)
export const sendServiceRequestEmails = async (data: {
  clientName: string;
  clientEmail: string;
  projectType: string;
  budget: string;
  timeline: string;
  projectDescription: string;
}) => {
  try {
    // Send notification email to you
    const notificationTemplate = createServiceRequestEmailTemplate(data);
    const notificationResult = await sendEmail({
      to: process.env.EMAIL_USER!,
      subject: notificationTemplate.subject,
      html: notificationTemplate.html,
      text: notificationTemplate.text,
    });

    // Send confirmation email to the client
    const confirmationTemplate = createServiceRequestConfirmationTemplate({
      clientName: data.clientName,
      projectType: data.projectType,
      budget: data.budget,
      timeline: data.timeline,
    });
    const confirmationResult = await sendEmail({
      to: data.clientEmail,
      subject: confirmationTemplate.subject,
      html: confirmationTemplate.html,
      text: confirmationTemplate.text,
    });

    return {
      success: notificationResult.success && confirmationResult.success,
      notification: notificationResult,
      confirmation: confirmationResult,
    };
  } catch (error) {
    console.error("Service request emails sending failed:", error);
    return { success: false, error };
  }
};
