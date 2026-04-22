// Utility functions for the application

/**
 * Normalizes image URLs to ensure they work correctly
 * - Converts /uploads/ paths to /api/uploads/
 * - Handles external URLs (returns as-is)
 * - Handles data URIs (returns as-is)
 */
export function normalizeImageUrl(url: string | null | undefined): string {
  if (!url) return '';
  
  // External URLs - return as-is
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) {
    return url;
  }
  
  // Convert old /uploads/ paths to /api/uploads/
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
