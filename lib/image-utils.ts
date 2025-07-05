// Utility functions for handling user avatars and images

import crypto from "crypto";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import {
  getS3Client,
  getS3Config,
  generateS3Key,
  generateS3Url,
} from "./s3-config";

/**
 * Generate Gravatar URL from email address
 * @param email - User's email address
 * @param size - Avatar size (default: 150)
 * @param defaultImage - Default image type (default: 'identicon')
 * @returns Gravatar URL
 */
export function generateGravatarUrl(
  email: string,
  size: number = 150,
  defaultImage: string = "identicon"
): string {
  const hash = crypto
    .createHash("md5")
    .update(email.toLowerCase().trim())
    .digest("hex");

  return `https://www.gravatar.com/avatar/${hash}?s=${size}&d=${defaultImage}&r=pg`;
}

/**
 * Get user avatar with fallback to Gravatar
 * @param email - User's email address
 * @param uploadedImage - Optional uploaded image URL
 * @param size - Avatar size for Gravatar fallback
 * @returns Avatar URL (uploaded image or Gravatar)
 */
export function getUserAvatar(
  email: string,
  uploadedImage?: string | null,
  size: number = 150
): string {
  if (uploadedImage && uploadedImage !== "/placeholder.svg") {
    return uploadedImage;
  }

  return generateGravatarUrl(email, size);
}

/**
 * Upload image to S3 bucket
 * @param file - File to upload (as Buffer)
 * @param originalName - Original filename
 * @param folder - S3 folder (e.g., 'testimonials', 'avatars')
 * @returns Promise with uploaded file URL
 */
export async function uploadImageToS3(
  file: Buffer,
  originalName: string,
  folder: string = "testimonials"
): Promise<string> {
  try {
    // Generate unique S3 key
    const key = generateS3Key(folder, originalName);

    // Determine content type from file extension
    const extension = originalName.toLowerCase().split(".").pop();
    let contentType = "image/jpeg"; // default

    switch (extension) {
      case "png":
        contentType = "image/png";
        break;
      case "webp":
        contentType = "image/webp";
        break;
      case "jpg":
      case "jpeg":
        contentType = "image/jpeg";
        break;
    }

    // Get S3 client and config
    const s3Client = getS3Client();
    const config = getS3Config();

    // Upload to S3
    const command = new PutObjectCommand({
      Bucket: config.bucketName,
      Key: key,
      Body: file,
      ContentType: contentType,
      ACL: "public-read", // Make publicly accessible
      CacheControl: "max-age=31536000", // Cache for 1 year
      Metadata: {
        "uploaded-by": "portfolio-testimonials",
        "upload-date": new Date().toISOString(),
      },
    });

    await s3Client.send(command);

    // Return public URL
    const publicUrl = generateS3Url(key);

    return publicUrl;
  } catch (error) {
    throw new Error(
      `Failed to upload image to S3: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

/**
 * Convert File to Buffer (for server-side use)
 * @param file - File object
 * @returns Promise with Buffer
 */
export async function fileToBuffer(file: File): Promise<Buffer> {
  const arrayBuffer = await file.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

/**
 * Validate image file type and size
 * @param file - File to validate
 * @param maxSizeMB - Maximum file size in MB (default: 5)
 * @returns Validation result
 */
export function validateImageFile(
  file: File,
  maxSizeMB: number = 5
): { valid: boolean; error?: string } {
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
  const maxSize = maxSizeMB * 1024 * 1024; // Convert to bytes

  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: "Please upload a valid image file (JPEG, PNG, or WebP)",
    };
  }

  if (file.size > maxSize) {
    return {
      valid: false,
      error: `File size must be less than ${maxSizeMB}MB`,
    };
  }

  return { valid: true };
}

/**
 * Generate optimized filename for S3
 * @param originalName - Original filename
 * @param prefix - Optional prefix (e.g., 'testimonial', 'avatar')
 * @returns Sanitized filename with timestamp
 */
export function generateOptimizedFilename(
  originalName: string,
  prefix?: string
): string {
  const timestamp = Date.now();
  const sanitized = originalName.replace(/[^a-zA-Z0-9.-]/g, "_").toLowerCase();

  return prefix
    ? `${prefix}_${timestamp}_${sanitized}`
    : `${timestamp}_${sanitized}`;
}
