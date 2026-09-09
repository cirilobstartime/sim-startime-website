import Image from "next/image";
import type { MediaValue } from "@/content/types";

type CmsImageProps = {
  alt?: string;
  className?: string;
  media?: MediaValue;
  mobileMedia?: MediaValue;
  priority?: boolean;
  sizes?: string;
  title?: string;
};

export function getMediaURL(media?: MediaValue): string {
  const url = typeof media === "string" ? media : media?.url || "";
  const appURL = process.env.NEXT_PUBLIC_APP_URL;

  if (appURL && url.startsWith(appURL)) {
    return url.slice(appURL.length) || "/";
  }

  // Payload can persist absolute URLs from the environment where a media
  // record was created. Keep those records portable when a production
  // database is restored locally (or moved between environments) by serving
  // Payload-owned files from the current application origin.
  try {
    const parsedURL = new URL(url);
    if (
      parsedURL.pathname.startsWith("/api/media/file/") ||
      parsedURL.pathname.startsWith("/api/form-uploads/file/")
    ) {
      return `${parsedURL.pathname}${parsedURL.search}${parsedURL.hash}`;
    }
  } catch {
    // Relative URLs and local asset paths are already portable.
  }

  return url;
}

export function getMediaAlt(media?: MediaValue, fallback = ""): string {
  if (typeof media === "object" && media?.alt) return media.alt;
  return fallback;
}

export function getMediaTitle(media?: MediaValue, fallback = ""): string {
  if (typeof media === "object" && media?.title) return media.title;
  if (typeof media === "object" && media?.alt) return media.alt;
  return fallback;
}

export function CmsImage({
  alt,
  className,
  media,
  mobileMedia,
  priority = false,
  sizes = "100vw",
  title,
}: CmsImageProps) {
  const src = getMediaURL(media);
  const mobileSrc = getMediaURL(mobileMedia);

  if (!src) return null;

  return (
    <picture>
      {mobileSrc ? <source media="(max-width: 767px)" srcSet={mobileSrc} /> : null}
      <Image
        alt={alt || getMediaAlt(media)}
        className={className}
        fill
        loading={priority ? "eager" : undefined}
        priority={priority}
        sizes={sizes}
        src={src}
        title={title || getMediaTitle(media, alt) || undefined}
        unoptimized={src.endsWith(".svg")}
      />
    </picture>
  );
}
