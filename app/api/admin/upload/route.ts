import { NextRequest, NextResponse } from "next/server";
import {
  uploadImageToS3,
  validateImageFile,
  fileToBuffer,
} from "@/lib/image-utils";

export async function POST(request: NextRequest) {
  try {
    // Parse form data (to handle file uploads)
    const formData = await request.formData();

    // Extract image file
    const imageFile = formData.get("image") as File | null;
    const folder = (formData.get("folder") as string) || "projects";

    if (!imageFile || imageFile.size === 0) {
      return NextResponse.json(
        { success: false, message: "No image file provided" },
        { status: 400 }
      );
    }

    // Validate uploaded image
    const validation = validateImageFile(imageFile, 10); // 10MB max for project images
    if (!validation.valid) {
      return NextResponse.json(
        { success: false, message: validation.error },
        { status: 400 }
      );
    }

    try {
      // Upload to S3
      const imageBuffer = await fileToBuffer(imageFile);
      const imageUrl = await uploadImageToS3(
        imageBuffer,
        imageFile.name,
        folder
      );

      return NextResponse.json({
        success: true,
        message: "Image uploaded successfully",
        data: {
          imageUrl,
          fileName: imageFile.name,
          fileSize: imageFile.size,
        },
      });
    } catch (uploadError) {
      console.error("S3 upload error:", uploadError);
      return NextResponse.json(
        {
          success: false,
          message: "Failed to upload image to cloud storage",
          error:
            uploadError instanceof Error
              ? uploadError.message
              : "Unknown error",
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Upload API error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to process upload request",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
