"use client";

import {
  FastForward,
  Play,
  Rewind,
  SpeakerHigh,
  SpeakerSlash,
} from "@phosphor-icons/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Locale, MediaValue } from "@/content/types";
import { getMediaURL } from "../CmsImage";

export function SimfVideoPlayer({
  autoplay = true,
  locale,
  mobilePoster,
  poster,
  video,
  youtubeURL,
}: {
  autoplay?: boolean;
  locale: Locale;
  mobilePoster?: MediaValue;
  poster?: MediaValue;
  video?: MediaValue;
  youtubeURL?: string | null;
}) {
  const player = useRef<HTMLDivElement>(null);
  const media = useRef<HTMLVideoElement>(null);
  const youtube = useRef<HTMLIFrameElement>(null);
  const autoplayIntent = useRef(false);
  const autoStarted = useRef(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [muted, setMuted] = useState(true);
  const [playing, setPlaying] = useState(false);
  const ar = locale === "ar";
  const desktopPosterURL = getMediaURL(poster);
  const mobilePosterURL = getMediaURL(mobilePoster);
  const youtubeID = useMemo(() => {
    if (!youtubeURL) return null;
    return youtubeURL.match(
      /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{6,})/i,
    )?.[1] || null;
  }, [youtubeURL]);

  const youtubeTime = useRef(0);

  useEffect(() => {
    const element = media.current;
    if (!element || !mobilePosterURL) return;
    const query = window.matchMedia("(max-width: 767px)");
    const updatePoster = () => {
      element.poster = query.matches ? mobilePosterURL : desktopPosterURL;
    };
    updatePoster();
    query.addEventListener("change", updatePoster);
    return () => query.removeEventListener("change", updatePoster);
  }, [desktopPosterURL, mobilePosterURL]);

  const youtubeCommand = useCallback((command: string, args: Array<boolean | number | string> = []) => {
    youtube.current?.contentWindow?.postMessage(
      JSON.stringify({ event: "command", func: command, args }),
      "https://www.youtube.com",
    );
  }, []);

  useEffect(() => {
    if (!autoplay) return;
    const container = player.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting || entry.intersectionRatio < 0.25 || autoStarted.current) {
          return;
        }

        autoStarted.current = true;
        autoplayIntent.current = true;
        setHasStarted(true);

        if (youtubeID) {
          youtubeCommand("mute");
          youtubeCommand("playVideo");
          setPlaying(true);
        } else if (media.current) {
          media.current.muted = true;
          void media.current.play().catch(() => setPlaying(false));
        }

        observer.disconnect();
      },
      { threshold: [0.25] },
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, [autoplay, youtubeCommand, youtubeID]);

  useEffect(() => {
    if (!youtubeID) return;
    function onMessage(event: MessageEvent) {
      if (event.origin !== "https://www.youtube.com") return;
      try {
        const payload = typeof event.data === "string" ? JSON.parse(event.data) : event.data;
        if (typeof payload?.info?.currentTime === "number") {
          youtubeTime.current = payload.info.currentTime;
        }
        if (typeof payload?.info?.playerState === "number") {
          setPlaying(payload.info.playerState === 1);
          if (payload.info.playerState === 0) setHasStarted(false);
        }
      } catch {
        // Ignore unrelated window messages.
      }
    }
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [youtubeID]);

  function start() {
    autoStarted.current = true;
    autoplayIntent.current = true;
    if (youtubeID) {
      setHasStarted(true);
      setPlaying(true);
      youtubeCommand("playVideo");
      return;
    }
    const element = media.current;
    if (!element) return;
    setHasStarted(true);
    void element.play();
  }

  function toggle() {
    if (youtubeID) {
      youtubeCommand(playing ? "pauseVideo" : "playVideo");
      setHasStarted(true);
      setPlaying((value) => !value);
      return;
    }
    const element = media.current;
    if (!element) return;
    if (element.paused) {
      void element.play();
    } else {
      element.pause();
    }
  }

  function seek(seconds: number) {
    if (youtubeID) {
      youtubeCommand("seekTo", [Math.max(0, youtubeTime.current + seconds), true]);
      return;
    }
    const element = media.current;
    if (!element) return;
    element.currentTime = Math.min(
      Math.max(0, element.currentTime + seconds),
      Number.isFinite(element.duration) ? element.duration : element.currentTime + seconds,
    );
  }

  function toggleMute() {
    const nextMuted = !muted;
    if (youtubeID) {
      youtubeCommand(nextMuted ? "mute" : "unMute");
    } else if (media.current) {
      media.current.muted = nextMuted;
    }
    setMuted(nextMuted);
  }

  return (
    <div
      className={`simf-option-film__player${hasStarted ? " is-started" : ""}`}
      ref={player}
    >
      {youtubeID ? (
        <iframe
          allow="autoplay; encrypted-media; picture-in-picture"
          aria-label={ar ? "فيلم الملتقى البحري السعودي الدولي" : "Saudi International Maritime Forum film"}
          onLoad={() => {
            if (autoplayIntent.current) {
              youtubeCommand("mute");
              youtubeCommand("playVideo");
              setPlaying(true);
            }
          }}
          ref={youtube}
          src={`https://www.youtube.com/embed/${youtubeID}?autoplay=0&mute=1&controls=0&disablekb=1&enablejsapi=1&playsinline=1&rel=0&modestbranding=1`}
          title={ar ? "فيلم الملتقى البحري السعودي الدولي" : "Saudi International Maritime Forum film"}
        />
      ) : (
        <video
        aria-label={ar ? "فيلم الملتقى البحري السعودي الدولي" : "Saudi International Maritime Forum film"}
        onClick={hasStarted ? toggle : undefined}
        onEnded={() => {
          setHasStarted(false);
          setPlaying(false);
        }}
        onKeyDown={(event) => {
          if (!hasStarted || (event.key !== "Enter" && event.key !== " ")) return;
          event.preventDefault();
          toggle();
        }}
        onPause={() => setPlaying(false)}
        onPlay={() => setPlaying(true)}
        playsInline
        muted={muted}
        poster={desktopPosterURL}
        preload="metadata"
        ref={media}
        tabIndex={hasStarted ? 0 : -1}
      >
        <source src={getMediaURL(video)} type="video/mp4" />
        </video>
      )}

      {!hasStarted || !playing ? (
        <button
          aria-label={ar ? "تشغيل الفيلم" : "Play film"}
          className="simf-option-film__play"
          onClick={start}
          type="button"
        >
          <Play aria-hidden weight="fill" />
        </button>
      ) : null}

      {hasStarted ? (
        <div
          aria-label={ar ? "التحكم في وقت الفيديو" : "Video time controls"}
          className="simf-option-film__seek"
          role="group"
        >
          <button
            aria-label={ar ? "الرجوع 10 ثوانٍ" : "Rewind 10 seconds"}
            onClick={() => seek(-10)}
            type="button"
          >
            <Rewind aria-hidden />
            <span>10</span>
          </button>
          <button
            aria-label={ar ? "التقديم 10 ثوانٍ" : "Forward 10 seconds"}
            onClick={() => seek(10)}
            type="button"
          >
            <FastForward aria-hidden />
            <span>10</span>
          </button>
          <button
            aria-label={muted ? (ar ? "تشغيل الصوت" : "Unmute") : (ar ? "كتم الصوت" : "Mute")}
            className="simf-option-film__mute"
            onClick={toggleMute}
            type="button"
          >
            {muted ? <SpeakerSlash aria-hidden /> : <SpeakerHigh aria-hidden />}
          </button>
        </div>
      ) : null}
    </div>
  );
}
