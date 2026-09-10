"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { pushDataLayerEvent } from "@/lib/dataLayer";

function labelFor(element: HTMLElement): string {
  return (element.getAttribute("aria-label") || element.textContent || "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 160);
}

export function EventTracking() {
  const pathname = usePathname();
  const startedForms = useRef(new WeakSet<HTMLFormElement>());
  const playedVideos = useRef(new WeakSet<HTMLVideoElement>());

  useEffect(() => {
    document.documentElement.dataset.trackingReady = "true";
    pushDataLayerEvent({
      event: "startime_page_view",
      page_location: window.location.href,
      page_path: `${window.location.pathname}${window.location.search}`,
      page_title: document.title,
    });
  }, [pathname]);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const target =
        event.target instanceof Element
          ? event.target.closest<HTMLElement>("a, button")
          : null;
      if (!target) return;
      const href =
        target instanceof HTMLAnchorElement
          ? target.getAttribute("href") || ""
          : "";
      if (target.classList.contains("locale-switch")) {
        pushDataLayerEvent({
          event: "startime_language_switch",
          destination: href,
          label: labelFor(target),
        });
      }
      if (
        target.matches(
          "[data-track], .button, .text-link, .header-cta, .mobile-menu a",
        )
      ) {
        pushDataLayerEvent({
          event: "startime_cta_click",
          cta_id: target.dataset.track || "",
          destination: href,
          label: labelFor(target),
          page_path: window.location.pathname,
        });
      }
      if (target instanceof HTMLAnchorElement && href) {
        const resolved = new URL(target.href, window.location.href);
        const extension = resolved.pathname.split(".").pop()?.toLowerCase();
        const downloadExtensions = new Set([
          "pdf",
          "doc",
          "docx",
          "xls",
          "xlsx",
          "ppt",
          "pptx",
          "zip",
        ]);
        const eventName = href.startsWith("mailto:")
          ? "startime_email_click"
          : href.startsWith("tel:")
            ? "startime_phone_click"
            : resolved.origin !== window.location.origin
              ? "startime_outbound_click"
              : extension && downloadExtensions.has(extension)
                ? "startime_file_download"
                : "startime_internal_link_click";
        pushDataLayerEvent({
          event: eventName,
          destination: href,
          label: labelFor(target),
          page_path: window.location.pathname,
        });
      }
    };

    const onFocus = (event: FocusEvent) => {
      const form =
        event.target instanceof Element
          ? event.target.closest<HTMLFormElement>(".lead-form")
          : null;
      if (!form || startedForms.current.has(form)) return;
      startedForms.current.add(form);
      pushDataLayerEvent({
        event: "startime_form_start",
        form_key: form.dataset.formKey || "",
        page_path: window.location.pathname,
      });
    };

    const onSubmit = (event: SubmitEvent) => {
      const form =
        event.target instanceof HTMLFormElement ? event.target : null;
      if (!form?.classList.contains("lead-form")) return;
      pushDataLayerEvent({
        event: "startime_form_submit",
        form_key: form.dataset.formKey || "",
        page_path: window.location.pathname,
      });
    };

    const onPlay = (event: Event) => {
      const video =
        event.target instanceof HTMLVideoElement ? event.target : null;
      if (
        !video ||
        video.dataset.backgroundVideo === "true" ||
        playedVideos.current.has(video)
      ) return;
      playedVideos.current.add(video);
      pushDataLayerEvent({
        event: "startime_video_start",
        page_path: window.location.pathname,
        video_source: video.currentSrc || video.getAttribute("src") || "",
      });
    };

    const reached = new Set<number>();
    let scrollFrame: number | null = null;
    const onScroll = () => {
      if (scrollFrame !== null) return;
      scrollFrame = window.requestAnimationFrame(() => {
        scrollFrame = null;
        const available =
          document.documentElement.scrollHeight - window.innerHeight;
        if (available <= 0) return;
        const depth = Math.round((window.scrollY / available) * 100);
        for (const threshold of [25, 50, 75, 90]) {
          if (depth >= threshold && !reached.has(threshold)) {
            reached.add(threshold);
            pushDataLayerEvent({
              event: "startime_scroll_depth",
              page_path: window.location.pathname,
              percent_scrolled: threshold,
            });
          }
        }
      });
    };

    document.addEventListener("click", onClick);
    document.addEventListener("focusin", onFocus);
    document.addEventListener("play", onPlay, true);
    document.addEventListener("submit", onSubmit);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      document.removeEventListener("click", onClick);
      document.removeEventListener("focusin", onFocus);
      document.removeEventListener("play", onPlay, true);
      document.removeEventListener("submit", onSubmit);
      window.removeEventListener("scroll", onScroll);
      if (scrollFrame !== null) window.cancelAnimationFrame(scrollFrame);
    };
  }, []);

  return null;
}
