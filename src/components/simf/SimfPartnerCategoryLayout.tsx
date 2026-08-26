"use client";

import { ArrowLeft, ArrowRight } from "@phosphor-icons/react";
import type { ReactNode } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Locale } from "@/content/types";

export function SimfPartnerCategoryLayout({
  children,
  layout,
  locale,
}: {
  children: ReactNode;
  layout: "grid" | "swiper";
  locale: Locale;
}) {
  const rail = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ end: false, progress: 0, start: true });
  const ar = locale === "ar";

  const update = useCallback(() => {
    const element = rail.current;
    if (!element) return;
    const max = element.scrollWidth - element.clientWidth;
    const current = Math.abs(element.scrollLeft);
    setPosition({
      end: max <= 2 || current >= max - 4,
      progress: max <= 2 ? 1 : Math.min(1, current / max),
      start: current <= 24,
    });
  }, []);

  const move = useCallback(
    (direction: -1 | 1) => {
      const element = rail.current;
      if (!element) return;
      const max = Math.max(0, element.scrollWidth - element.clientWidth);
      const current = Math.abs(element.scrollLeft);
      const distance = Math.max(240, element.clientWidth * 0.72);
      const target = Math.max(0, Math.min(max, current + direction * distance));
      element.scrollLeft = ar ? -target : target;
      window.requestAnimationFrame(update);
    },
    [ar, update],
  );

  useEffect(() => {
    if (layout !== "swiper") return;
    const element = rail.current;
    if (!element) return;
    update();
    const frame = window.requestAnimationFrame(update);
    const settle = window.setTimeout(update, 180);
    element.addEventListener("scroll", update, { passive: true });
    const observer = new ResizeObserver(update);
    observer.observe(element);
    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(settle);
      element.removeEventListener("scroll", update);
      observer.disconnect();
    };
  }, [layout, update]);

  useEffect(() => {
    if (layout !== "swiper") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => {
      const element = rail.current;
      if (!element) return;
      const max = element.scrollWidth - element.clientWidth;
      const current = Math.abs(element.scrollLeft);
      if (max <= 2) return;
      if (current >= max - 4) {
        element.scrollTo({ behavior: "smooth", left: 0 });
        return;
      }
      move(1);
    }, 4800);
    return () => window.clearInterval(timer);
  }, [layout, move]);

  if (layout === "grid") {
    return (
      <div className="simf-content-cards__grid simf-content-cards__grid--columns simf-partner-category__grid">
        {children}
      </div>
    );
  }

  return (
    <div className="simf-partner-category-rail">
      <div
        className="simf-content-cards__grid simf-content-cards__grid--columns simf-partner-category-rail__track"
        ref={rail}
      >
        {children}
      </div>
      <div className="simf-partner-rail__controls">
        <span aria-hidden className="simf-partner-rail__progress">
          <span style={{ transform: `scaleX(${Math.max(0.14, position.progress)})` }} />
        </span>
        <button
          aria-label={ar ? "الشعارات السابقة" : "Previous logos"}
          disabled={position.start}
          onClick={() => move(-1)}
          type="button"
        >
          {ar ? <ArrowRight aria-hidden /> : <ArrowLeft aria-hidden />}
        </button>
        <button
          aria-label={ar ? "المزيد من الشعارات" : "Next logos"}
          disabled={position.end}
          onClick={() => move(1)}
          type="button"
        >
          {ar ? <ArrowLeft aria-hidden /> : <ArrowRight aria-hidden />}
        </button>
      </div>
    </div>
  );
}
