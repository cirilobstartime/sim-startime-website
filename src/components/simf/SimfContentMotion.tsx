"use client";

import { useEffect } from "react";

export function SimfContentMotion() {
  useEffect(() => {
    const root = document.querySelector<HTMLElement>(".simf-content-page");
    if (!root) return;
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const items = Array.from(
      root.querySelectorAll<HTMLElement>(
        ".simf-section-head, .simf-content-card, .simf-content-media__visual, .simf-content-value__steps article, .simf-content-value__media, .simf-content-metrics__rail > div, .simf-directory-speakers__grid article",
      ),
    );
    root.classList.add("simf-content-motion-ready");
    if (reduced) {
      items.forEach((item) => item.classList.add("is-revealed"));
      return () => root.classList.remove("simf-content-motion-ready");
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-revealed");
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -7% 0px", threshold: 0.08 },
    );
    items.forEach((item) => observer.observe(item));
    return () => {
      observer.disconnect();
      root.classList.remove("simf-content-motion-ready");
    };
  }, []);

  useEffect(() => {
    let frame = 0;
    const timers: number[] = [];

    const getPartnerTarget = () => {
      if (!window.location.hash) return null;
      let anchor = window.location.hash.slice(1);
      try {
        anchor = decodeURIComponent(anchor);
      } catch {
        return null;
      }
      if (!anchor.startsWith("partner-")) return null;
      return document.getElementById(anchor);
    };

    const scrollToPartner = () => {
      getPartnerTarget()?.scrollIntoView({
        behavior: "auto",
        block: "start",
        inline: "nearest",
      });
    };

    const settlePartnerAnchor = () => {
      window.cancelAnimationFrame(frame);
      timers.forEach((timer) => window.clearTimeout(timer));
      timers.length = 0;
      frame = window.requestAnimationFrame(() => {
        scrollToPartner();
        frame = window.requestAnimationFrame(scrollToPartner);
      });
      timers.push(window.setTimeout(scrollToPartner, 180));
      timers.push(window.setTimeout(scrollToPartner, 600));
    };

    settlePartnerAnchor();
    window.addEventListener("hashchange", settlePartnerAnchor);
    document.fonts?.ready.then(scrollToPartner).catch(() => undefined);

    return () => {
      window.removeEventListener("hashchange", settlePartnerAnchor);
      window.cancelAnimationFrame(frame);
      timers.forEach((timer) => window.clearTimeout(timer));
    };
  }, []);

  return null;
}
