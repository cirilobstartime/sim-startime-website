import Image, { getImageProps } from "next/image";
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
  const version =
    typeof media === "object" && media?.updatedAt
      ? String(Date.parse(media.updatedAt))
      : "";

  const withVersion = (value: string) => {
    if (!version || !value.startsWith("/api/media/file/")) return value;
    const separator = value.includes("?") ? "&" : "?";
    return `${value}${separator}cmsv=${encodeURIComponent(version)}`;
  };

  if (appURL && url.startsWith(appURL)) {
    return withVersion(url.slice(appURL.length) || "/");
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
      return withVersion(
        `${parsedURL.pathname}${parsedURL.search}${parsedURL.hash}`,
      );
    }
  } catch {
    // Relative URLs and local asset paths are already portable.
  }

  return withVersion(url);
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

  const mobileSource = mobileSrc
    ? getImageProps({
        alt: "",
        fill: true,
        priority,
        sizes: "100vw",
        src: mobileSrc,
        unoptimized: mobileSrc.endsWith(".svg"),
      }).props.srcSet || mobileSrc
    : "";

  return (
    <picture className="cms-image">
      {mobileSource ? (
        <source media="(max-width: 767px)" sizes="100vw" srcSet={mobileSource} />
      ) : null}
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
