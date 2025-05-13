import { storage } from "@/services/appwrite";
import { AppwriteConfig } from "@/constants/AppwriteConfig";

export const isValidUrl = (url?: string): boolean => {
  if (!url) return false;
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const getImageUrl = (image?: string): string =>
  isValidUrl(image)
    ? image!
    : image
    ? storage.getFileView(AppwriteConfig.BUCKET_ID, image).href
    : "";
