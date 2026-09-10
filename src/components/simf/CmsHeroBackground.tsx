"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import type { Locale, MediaValue } from "@/content/types";
import { CmsImage, getMediaURL } from "../CmsImage";

const MOBILE_QUERY = "(max-width: 767px)";
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";
const HERO_VIDEO_DELAY_MS = 900;
const YOUTUBE_ID_PATTERN =
  /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{6,})/i;

function subscribeToQuery(query: string, callback: () => void) {
  const mediaQuery = window.matchMedia(query);
  mediaQuery.addEventListener("change", callback);
  return () => mediaQuery.removeEventListener("change", callback);
}

function useMediaQuery(query: string) {
  return useSyncExternalStore(
    (callback) => subscribeToQuery(query, callback),
    () => window.matchMedia(query).matches,
    () => false,
  );
}

function youtubeID(url?: string | null) {
  return url?.match(YOUTUBE_ID_PATTERN)?.[1] || null;
}

type HeroBackgroundProps = {
  desktopBackgroundType?: "image" | "upload" | "youtube" | null;
  desktopBackgroundVideo?: MediaValue;
  desktopBackgroundYouTubeURL?: string | null;
  locale: Locale;
  media?: MediaValue;
  mobileBackgroundType?: "inherit" | "image" | "upload" | "youtube" | null;
  mobileBackgroundVideo?: MediaValue;
  mobileBackgroundYouTubeURL?: string | null;
  mobileMedia?: MediaValue;
  priority?: boolean;
  sizes?: string;
};

export function CmsHeroBackground({
  desktopBackgroundType,
  desktopBackgroundVideo,
  desktopBackgroundYouTubeURL,
  locale,
  media,
  mobileBackgroundType,
  mobileBackgroundVideo,
  mobileBackgroundYouTubeURL,
  mobileMedia,
  priority = false,
  sizes = "100vw",
}: HeroBackgroundProps) {
  const mobile = useMediaQuery(MOBILE_QUERY);
  const reducedMotion = useMediaQuery(REDUCED_MOTION_QUERY);
  const container = useRef<HTMLDivElement>(null);
  const [readySource, setReadySource] = useState<string | null>(null);
  const desktopType = desktopBackgroundType || "image";
  const mobileType = mobileBackgroundType || "inherit";
  const useMobileSource = mobile && mobileType !== "inherit";
  const activeType = useMobileSource ? mobileType : desktopType;
  const uploadedVideo: MediaValue | undefined = useMobileSource
    ? mobileBackgroundVideo
    : desktopBackgroundVideo;
  const youtubeURL = useMobileSource
    ? mobileBackgroundYouTubeURL
    : desktopBackgroundYouTubeURL;
  const videoURL = getMediaURL(uploadedVideo);
  const activeYoutubeID = youtubeID(youtubeURL);
  const sourceKey =
    activeType === "upload" && videoURL
      ? `upload:${videoURL}`
      : activeType === "youtube" && activeYoutubeID
        ? `youtube:${activeYoutubeID}`
        : "image";
  const videoReady = sourceKey !== "image" && readySource === sourceKey;
  const posterURL = getMediaURL(mobile && mobileMedia ? mobileMedia : media);
  const title =
    locale === "ar"
      ? "فيديو خلفية القسم الرئيسي"
      : "Hero background video";

  useEffect(() => {
    if (reducedMotion || sourceKey === "image") return;

    const element = container.current;
    if (!element) return;

    let delayID: number | undefined;
    let idleID: number | undefined;
    let cancelled = false;
    let delayElapsed = false;

    const activate = () => {
      if (cancelled || document.visibilityState !== "visible") return;
      setReadySource(sourceKey);
    };

    const schedule = () => {
      if (delayID !== undefined) return;
      delayID = window.setTimeout(() => {
        delayElapsed = true;
        if ("requestIdleCallback" in window) {
          idleID = window.requestIdleCallback(activate, { timeout: 600 });
        } else {
          activate();
        }
      }, HERO_VIDEO_DELAY_MS);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          schedule();
          observer.disconnect();
        }
      },
      { rootMargin: "200px 0px", threshold: 0.01 },
    );

    observer.observe(element);
    const onVisibilityChange = () => {
      if (document.visibilityState === "visible" && delayElapsed) {
        activate();
      }
    };
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      cancelled = true;
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibilityChange);
      if (delayID !== undefined) window.clearTimeout(delayID);
      if (idleID !== undefined && "cancelIdleCallback" in window) {
        window.cancelIdleCallback(idleID);
      }
    };
  }, [reducedMotion, sourceKey]);

  return (
    <div className="simf-cms-hero-background" ref={container}>
      <CmsImage
        alt=""
        media={media}
        mobileMedia={mobileMedia}
        priority={priority}
        sizes={sizes}
      />
      {videoReady && activeType === "upload" && videoURL ? (
        <video
          aria-hidden="true"
          autoPlay
          className="simf-cms-hero-background__video"
          data-background-video="true"
          disablePictureInPicture
          loop
          muted
          playsInline
          poster={posterURL || undefined}
          preload="none"
          tabIndex={-1}
        >
          <source src={videoURL} />
        </video>
      ) : null}
      {videoReady && activeType === "youtube" && activeYoutubeID ? (
        <iframe
          allow="autoplay; encrypted-media"
          aria-hidden="true"
          className="simf-cms-hero-background__youtube"
          loading="lazy"
          src={`https://www.youtube.com/embed/${activeYoutubeID}?autoplay=1&mute=1&controls=0&disablekb=1&loop=1&playlist=${activeYoutubeID}&playsinline=1&rel=0&modestbranding=1`}
          tabIndex={-1}
          title={title}
        />
      ) : null}
    </div>
  );
}
