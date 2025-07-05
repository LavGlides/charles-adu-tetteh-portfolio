// AWS S3 Configuration for Charles Portfolio
import { S3Client } from "@aws-sdk/client-s3";

// Lazy S3 Client Creation - only create when needed
let _s3Client: S3Client | null = null;

export const getS3Client = (): S3Client => {
  if (!_s3Client) {
    // Validate required environment variables
    const requiredEnvVars = [
      "AWS_REGION",
      "AWS_ACCESS_KEY_ID",
      "AWS_SECRET_ACCESS_KEY",
      "AWS_S3_BUCKET_NAME",
    ];

    const missing = requiredEnvVars.filter((envVar) => !process.env[envVar]);
    if (missing.length > 0) {
      throw new Error(
        `Missing required environment variables: ${missing.join(", ")}`
      );
    }

    _s3Client = new S3Client({
      region: process.env.AWS_REGION!,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      },
    });
  }
  return _s3Client;
};

// S3 Configuration - lazy evaluation
export const getS3Config = () => {
  if (!process.env.AWS_S3_BUCKET_NAME || !process.env.AWS_REGION) {
    throw new Error("S3 configuration not available");
  }

  return {
    bucketName: process.env.AWS_S3_BUCKET_NAME!,
    region: process.env.AWS_REGION!,

    // Folder structure
    folders: {
      testimonials: "testimonials",
      avatars: "avatars",
      projects: "projects",
      blog: "blog",
    },

    // File constraints
    maxFileSize: 5 * 1024 * 1024, // 5MB
    allowedMimeTypes: ["image/jpeg", "image/jpg", "image/png", "image/webp"],

    // URL settings
    urlExpiryHours: 24, // For signed URLs
    publicRead: true, // Make uploaded files publicly readable
  } as const;
};

// Generate S3 object key (file path)
export function generateS3Key(folder: string, filename: string): string {
  const timestamp = Date.now();
  const sanitizedFilename = filename.replace(/[^a-zA-Z0-9.-]/g, "_");
  return `${folder}/${timestamp}_${sanitizedFilename}`;
}

// Generate public S3 URL
export function generateS3Url(key: string): string {
  const config = getS3Config();
  return `https://${config.bucketName}.s3.${config.region}.amazonaws.com/${key}`;
}

// Validate S3 environment configuration
export function validateS3Config(): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  try {
    // Test environment variables
    if (!process.env.AWS_REGION) errors.push("AWS_REGION not configured");
    if (!process.env.AWS_ACCESS_KEY_ID)
      errors.push("AWS_ACCESS_KEY_ID not configured");
    if (!process.env.AWS_SECRET_ACCESS_KEY)
      errors.push("AWS_SECRET_ACCESS_KEY not configured");
    if (!process.env.AWS_S3_BUCKET_NAME)
      errors.push("AWS_S3_BUCKET_NAME not configured");

    // Test region format
    if (
      process.env.AWS_REGION &&
      !/^[a-z]{2}-[a-z]+-\d{1}$/.test(process.env.AWS_REGION)
    ) {
      errors.push(
        "AWS_REGION format appears invalid (should be like us-east-1)"
      );
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  } catch (error) {
    errors.push(`Configuration validation error: ${error}`);
    return { valid: false, errors };
  }
}
