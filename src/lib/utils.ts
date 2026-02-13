import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Converts a relative photo URL from the backend to a full URL
 * @param photoUrl - The photo URL (can be relative or absolute)
 * @returns Full URL to the photo or null if no photo URL provided
 */
export function getImageUrl(photoUrl: string | null | undefined): string | null {
  if (!photoUrl) return null;
  
  // If already a full URL, return as is
  if (photoUrl.startsWith('http://') || photoUrl.startsWith('https://')) {
    return photoUrl;
  }
  
  // Otherwise, prepend backend URL
  const backendUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:8000';
  return `${backendUrl}${photoUrl}`;
}
