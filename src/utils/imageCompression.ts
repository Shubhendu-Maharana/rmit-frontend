import imageCompression from "browser-image-compression";
import { toast } from "react-toastify";

/**
 * Validates, compresses, and converts an image file to WebP format.
 * Blocks GIF uploads and returns null if a GIF is uploaded.
 * Passes non-image files through without changes.
 */
export const compressAndConvertToWebP = async (
  file: File
): Promise<File | null> => {
  // 1. Block GIF uploads
  if (file.type === "image/gif" || file.name.toLowerCase().endsWith(".gif")) {
    toast.error("GIF uploads are not allowed.");
    return null;
  }

  // 2. If it's not an image (e.g. PDF, Document), bypass compression
  if (!file.type.startsWith("image/")) {
    return file;
  }

  // 3. Setup compression & conversion options
  const options = {
    maxSizeMB: 0.8, // Target max size of 800KB
    maxWidthOrHeight: 1920, // Downscale if resolution is higher than 1080p
    useWebWorker: true,
    fileType: "image/webp" as const, // Convert output to WebP
  };

  try {
    const compressedBlob = await imageCompression(file, options);

    // Get the base filename without the original extension
    const lastDotIndex = file.name.lastIndexOf(".");
    const baseName =
      lastDotIndex !== -1 ? file.name.substring(0, lastDotIndex) : file.name;
    const newName = `${baseName}.webp`;

    return new File([compressedBlob], newName, {
      type: "image/webp",
      lastModified: Date.now(),
    });
  } catch (error) {
    console.error("Image compression/conversion failed, uploading original:", error);
    // Return original file as fallback
    return file;
  }
};
