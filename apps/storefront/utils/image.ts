/**
 * Formats image URLs to ensure optimal delivery format (e.g. adding &fm=webp to Unsplash CDN URLs).
 */
export function formatImageUrl(url?: string | null, fallback = 'https://via.placeholder.com/400x500'): string {
  if (!url || typeof url !== 'string') return fallback;
  
  if (url.includes('images.unsplash.com')) {
    // If URL already specifies format, ensure fm=webp is added if not present
    if (!url.includes('fm=webp')) {
      const separator = url.includes('?') ? '&' : '?';
      return `${url}${separator}fm=webp`;
    }
  }
  
  return url;
}
