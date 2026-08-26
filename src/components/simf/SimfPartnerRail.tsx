"use client";

import { ArrowLeft, ArrowRight } from "@phosphor-icons/react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { CardGridSection, Locale } from "@/content/types";
import { CmsImage } from "../CmsImage";

export function SimfPartnerRail({
  locale,
  partners,
  showNames = true,
}: {
  locale: Locale;
  partners: CardGridSection["cards"];
  showNames?: boolean;
}) {
  const rail = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({
    end: false,
    progress: 0,
    start: true,
  });
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
      element.scrollBy({
        behavior: "smooth",
        left:
          (ar ? -direction : direction) *
          Math.max(250, element.clientWidth * 0.72),
      });
    },
    [ar],
  );

  useEffect(() => {
    const element = rail.current;
    if (!element) return;
    update();
    element.addEventListener("scroll", update, { passive: true });
    const observer = new ResizeObserver(update);
    observer.observe(element);
    return () => {
      element.removeEventListener("scroll", update);
      observer.disconnect();
    };
  }, [update]);

  useEffect(() => {
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
  }, [move]);

  return (
    <div className="simf-partner-rail">
      <div className="simf-option-partners__logos" ref={rail}>
        {partners.map((card) => (
          <article key={card.id || card.title}>
            <div>
              <CmsImage alt={card.title} media={card.media} sizes="220px" />
            </div>
            {showNames ? <span>{card.title}</span> : null}
          </article>
        ))}
      </div>
      <div className="simf-partner-rail__controls">
        <span aria-hidden className="simf-partner-rail__progress">
          <span
            style={{
              transform: `scaleX(${Math.max(0.14, position.progress)})`,
            }}
          />
        </span>
        <button
          aria-label={ar ? "الشركاء السابقون" : "Previous partners"}
          disabled={position.start}
          onClick={() => move(-1)}
          type="button"
        >
          {ar ? <ArrowRight aria-hidden /> : <ArrowLeft aria-hidden />}
        </button>
        <button
          aria-label={ar ? "المزيد من الشركاء" : "Next partners"}
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
