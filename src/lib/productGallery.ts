import type { ProductColor } from "@/data/products";

export function normalizeImageUrl(src: string) {
  if (!src) return src;

  try {
    const url = new URL(src);
    // Convert absolute upload URLs to site-relative paths so they work via nginx/vite proxy
    if (url.pathname.startsWith("/uploads/")) {
      return url.pathname;
    }
    // Upgrade http→https for same-host resources when page is on https
    if (
      typeof window !== "undefined" &&
      window.location.protocol === "https:" &&
      url.protocol === "http:" &&
      url.host === window.location.host
    ) {
      url.protocol = "https:";
      return url.toString();
    }
  } catch {
    return src;
  }

  return src;
}

export function getProductGalleryImages(color: ProductColor) {
  return [color.image, ...(color.images || [])].map((src) => normalizeImageUrl(src)).filter((src, index, images): src is string => {
    return Boolean(src) && images.indexOf(src) === index;
  });
}
