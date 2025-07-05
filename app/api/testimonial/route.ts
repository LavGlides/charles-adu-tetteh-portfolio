import { type NextRequest, NextResponse } from "next/server";
import { saveTestimonial } from "@/lib/db-services";
import { sendTestimonialNotificationAndConfirmation } from "@/lib/email";
import {
  generateGravatarUrl,
  uploadImageToS3,
  validateImageFile,
  fileToBuffer,
} from "@/lib/image-utils";

export async function POST(request: NextRequest) {
  try {
    // Parse form data (to handle file uploads)
    const formData = await request.formData();

    // Extract text fields
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const role = formData.get("role") as string;
    const company = formData.get("company") as string;
    const projectType = formData.get("projectType") as string;
    const rating = formData.get("rating") as string;
    const content = formData.get("content") as string;
    const consent = formData.get("consent") === "on";

    // Extract image file (optional)
    const imageFile = formData.get("image") as File | null;

    // Validate required fields
    if (
      !name ||
      !email ||
      !role ||
      !company ||
      !projectType ||
      !rating ||
      !content
    ) {
      return NextResponse.json(
        { success: false, message: "All fields are required" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, message: "Please provide a valid email address" },
        { status: 400 }
      );
    }

    // Validate rating is a number between 1-5
    const ratingNum = parseInt(rating);
    if (isNaN(ratingNum) || ratingNum < 1 || ratingNum > 5) {
      return NextResponse.json(
        { success: false, message: "Rating must be between 1 and 5" },
        { status: 400 }
      );
    }

    // Handle image upload
    let clientImageUrl = generateGravatarUrl(email, 150); // Default to Gravatar

    if (imageFile && imageFile.size > 0) {
      // Validate uploaded image
      const validation = validateImageFile(imageFile);
      if (!validation.valid) {
        return NextResponse.json(
          { success: false, message: validation.error },
          { status: 400 }
        );
      }

      try {
        // Upload to S3
        const imageBuffer = await fileToBuffer(imageFile);
        clientImageUrl = await uploadImageToS3(
          imageBuffer,
          imageFile.name,
          "testimonials"
        );
      } catch (uploadError) {
        // Continue with Gravatar if S3 upload fails
        clientImageUrl = generateGravatarUrl(email, 150);
      }
    }

    // Save testimonial to database
    const testimonialData = {
      name,
      email,
      role,
      company,
      projectType,
      rating: ratingNum,
      content,
      consent,
      approved: false, // Testimonials require manual approval
      featured: false,
      clientImage: clientImageUrl,
    };

    const savedTestimonial = await saveTestimonial(testimonialData);

    // Send email notifications
    const emailResult = await sendTestimonialNotificationAndConfirmation({
      testimonial: testimonialData,
      testimonialId: savedTestimonial.id,
    });

    // Return success
    return NextResponse.json({
      success: true,
      message:
        "Thank you for your testimonial! It will be reviewed and published soon.",
      testimonialId: savedTestimonial.id,
      emailSent: emailResult.success,
      imageUploaded: imageFile && imageFile.size > 0,
      imageUrl: clientImageUrl,
    });
  } catch (error) {
    console.error("Testimonial submission error:", error);

    // Return user-friendly error message
    const errorMessage =
      error instanceof Error ? error.message : "An unexpected error occurred";

    return NextResponse.json(
      { success: false, message: errorMessage },
      { status: 500 }
    );
  }
}
