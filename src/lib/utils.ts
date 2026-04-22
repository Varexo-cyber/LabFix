// Utility functions for the application

/**
 * Normalizes image URLs to ensure they work correctly
 * - Converts /uploads/ paths to /api/uploads/ (for local dev)
 * - Handles external URLs (returns as-is)
 * - Handles data URIs/base64 (returns as-is)
 * - Handles base64 URLs from Netlify (returns as-is)
 */
export function normalizeImageUrl(url: string | null | undefined): string {
  if (!url) return '';
  
  // Base64 data URLs - return as-is
  if (url.startsWith('data:')) {
    return url;
  }
  
  // External URLs - return as-is
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  
  // Convert old /uploads/ paths to /api/uploads/ (for local dev)
  if (url.startsWith('/uploads/')) {
    return url.replace('/uploads/', '/api/uploads/');
  }
  
  // Ensure path starts with /
  if (!url.startsWith('/')) {
    return '/' + url;
  }
  
  return url;
}

/**
 * Validates if a URL is a valid image URL
 */
export function isValidImageUrl(url: string | null | undefined): boolean {
  if (!url) return false;
  
  const normalized = normalizeImageUrl(url);
  return normalized.length > 0;
}
