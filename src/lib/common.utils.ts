export type CloudinaryAssetType = "image" | "video" | "unknown";

export function detectCloudinaryAssetType(url: string): CloudinaryAssetType {
  try {
    const parsed = new URL(url);

    // Cloudinary typically has '/image/' or '/video/' in the pathname
    if (parsed.pathname.includes("/image/")) return "image";
    if (parsed.pathname.includes("/video/")) return "video";

    // Fallback: check file extension
    const ext = parsed.pathname.split(".").pop()?.toLowerCase();

    const imageExtensions = [
      "jpg",
      "jpeg",
      "png",
      "gif",
      "webp",
      "svg",
      "avif",
    ];
    const videoExtensions = ["mp4", "mov", "webm", "mkv", "avi"];

    if (ext && imageExtensions.includes(ext)) return "image";
    if (ext && videoExtensions.includes(ext)) return "video";

    return "unknown";
  } catch (error) {
    return "unknown";
  }
}
