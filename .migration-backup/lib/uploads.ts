/**
 * Supabase Storage Upload Helpers
 * Handle file uploads to player-uploads and franchise-uploads buckets
 */

import imageCompression from "browser-image-compression";
import { supabase } from "./supabase";
import type { UploadResult } from "./database.types";

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const ALLOWED_PDF_TYPES = ["application/pdf"];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

async function compressImageFile(file: File): Promise<File> {
  try {
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      return file;
    }

    const options = {
      maxSizeMB: 1.8,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
      fileType: file.type,
      initialQuality: 0.8,
    };

    if (file.size <= 900_000) {
      return file;
    }

    const compressed = await imageCompression(file, options);
    return compressed instanceof File ? compressed : file;
  } catch {
    return file;
  }
}

/**
 * Generate unique filename with timestamp
 * Prevents filename collisions in storage
 */
function generateFileName(originalName: string): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  const extension = originalName.split(".").pop() || "bin";
  return `${timestamp}-${random}.${extension}`;
}

/**
 * Validate file before upload
 * Checks type, size, and other constraints
 */
function validateFile(
  file: File,
  allowedTypes: string[],
  maxSize: number = MAX_FILE_SIZE
): { valid: boolean; error?: string } {
  if (!file) {
    return { valid: false, error: "No file selected" };
  }

  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `Invalid file type. Allowed: ${allowedTypes.join(", ")}`,
    };
  }

  if (file.size > maxSize) {
    return {
      valid: false,
      error: `File too large. Max size: ${maxSize / 1024 / 1024}MB`,
    };
  }

  return { valid: true };
}

/**
 * Upload player photo to Supabase Storage
 * Returns public URL or error
 */
export async function uploadPlayerPhoto(file: File): Promise<UploadResult> {
  try {
    const validation = validateFile(file, ALLOWED_IMAGE_TYPES);
    if (!validation.valid) {
      return { success: false, error: validation.error };
    }

    const uploadFile = await compressImageFile(file);
    const fileName = generateFileName(file.name);
    const filePath = `photos/${fileName}`;

    const { data, error } = await supabase.storage
      .from("player-uploads")
      .upload(filePath, uploadFile, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      return { success: false, error: error.message };
    }

    // Generate public URL
    const { data: publicData } = supabase.storage
      .from("player-uploads")
      .getPublicUrl(filePath);

    return { success: true, url: publicData.publicUrl };
  } catch {
    return { success: false, error: "Failed to upload photo" };
  }
}

/**
 * Upload player ID to Supabase Storage
 * Accepts jpg, png, webp, or pdf
 */
export async function uploadPlayerID(file: File): Promise<UploadResult> {
  try {
    const allowedTypes = [...ALLOWED_IMAGE_TYPES, ...ALLOWED_PDF_TYPES];
    const validation = validateFile(file, allowedTypes);
    if (!validation.valid) {
      return { success: false, error: validation.error };
    }

    const uploadFile = ALLOWED_IMAGE_TYPES.includes(file.type)
      ? await compressImageFile(file)
      : file;
    const fileName = generateFileName(file.name);
    const filePath = `ids/${fileName}`;

    const { data, error } = await supabase.storage
      .from("player-uploads")
      .upload(filePath, uploadFile, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      return { success: false, error: error.message };
    }

    // Generate public URL
    const { data: publicData } = supabase.storage
      .from("player-uploads")
      .getPublicUrl(filePath);

    return { success: true, url: publicData.publicUrl };
  } catch {
    return { success: false, error: "Failed to upload ID" };
  }
}

/**
 * Upload franchise logo to Supabase Storage
 * Returns public URL or error
 */
export async function uploadFranchiseLogo(file: File): Promise<UploadResult> {
  try {
    const validation = validateFile(file, ALLOWED_IMAGE_TYPES);
    if (!validation.valid) {
      return { success: false, error: validation.error };
    }

    const uploadFile = await compressImageFile(file);
    const fileName = generateFileName(file.name);
    const filePath = `logos/${fileName}`;

    const { data, error } = await supabase.storage
      .from("franchise-uploads")
      .upload(filePath, uploadFile, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      return { success: false, error: error.message };
    }

    // Generate public URL
    const { data: publicData } = supabase.storage
      .from("franchise-uploads")
      .getPublicUrl(filePath);

    return { success: true, url: publicData.publicUrl };
  } catch {
    return { success: false, error: "Failed to upload logo" };
  }
}
