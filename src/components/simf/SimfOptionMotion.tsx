"use client";

import { useEffect } from "react";

export function SimfOptionMotion() {
  useEffect(() => {
    const root = document.querySelector<HTMLElement>(
      '.simf-site[data-page="homepage-option"]',
    );
    if (!root) return;

    const sections = Array.from(
      root.querySelectorAll<HTMLElement>("main > section:not(.simf-option-hero)"),
    );
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    root.classList.add("simf-option-motion-ready");

    if (reducedMotion) {
      sections.forEach((item) => item.classList.add("is-revealed"));
      return () => root.classList.remove("simf-option-motion-ready");
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-revealed");
          observer.unobserve(entry.target);
        });
      },
      {
        rootMargin: "0px 0px -8% 0px",
        threshold: 0.1,
      },
    );

    sections.forEach((item) => observer.observe(item));

    return () => {
      observer.disconnect();
      root.classList.remove("simf-option-motion-ready");
    };
  }, []);

  return null;
}
