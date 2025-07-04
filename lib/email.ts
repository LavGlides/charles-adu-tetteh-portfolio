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
                <a href="https://charles-adu-tetteh-portfolio.vercel.app/" class="portfolio-link">
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
                • Review portfolio: <a href="https://charles-adu-tetteh-portfolio.vercel.app/">Visit Site</a><br>
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
                <a href="https://charles-adu-tetteh-portfolio.vercel.app/" class="portfolio-link">
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
