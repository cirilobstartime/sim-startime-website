"use client";

import { ArrowLeft, ArrowRight } from "@phosphor-icons/react";
import { useEffect, useRef } from "react";
import type { Locale, MetricRailSection } from "@/content/types";
import { formatMetricValue } from "./formatMetricValue";

export function SimfMetricSwiper({
  autoPlay = false,
  locale,
  metrics,
}: {
  autoPlay?: boolean;
  locale: Locale;
  metrics: MetricRailSection["metrics"];
}) {
  const rail = useRef<HTMLDivElement>(null);
  const ar = locale === "ar";

  function move(direction: -1 | 1) {
    const element = rail.current;
    if (!element) return;
    element.scrollBy({
      behavior: "smooth",
      left: (ar ? -direction : direction) * Math.max(280, element.clientWidth * 0.72),
    });
  }

  useEffect(() => {
    if (
      !autoPlay ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }
    const timer = window.setInterval(() => {
      const element = rail.current;
      if (!element) return;
      const atEnd =
        Math.abs(element.scrollWidth - element.clientWidth - element.scrollLeft) <
        12;
      if (atEnd && !ar) {
        element.scrollTo({ behavior: "smooth", left: 0 });
        return;
      }
      element.scrollBy({
        behavior: "smooth",
        left: (ar ? -1 : 1) * Math.max(280, element.clientWidth * 0.72),
      });
    }, 4200);
    return () => window.clearInterval(timer);
  }, [ar, autoPlay]);

  return (
    <div className="simf-metric-swiper">
      <div className="simf-indicators__grid" ref={rail}>
        {metrics.map((metric) => (
          <div key={metric.label}>
            <strong
              dir={
                ar && /[\u0600-\u06ff]/.test(metric.value) ? "rtl" : "ltr"
              }
            >
              {formatMetricValue(locale, metric.value)}
            </strong>
            <span>{metric.label}</span>
          </div>
        ))}
      </div>
      <div className="simf-metric-swiper__controls">
        <div>
          <button
            aria-label={ar ? "المؤشرات السابقة" : "Previous indicators"}
            onClick={() => move(-1)}
            type="button"
          >
            {ar ? <ArrowRight aria-hidden /> : <ArrowLeft aria-hidden />}
          </button>
          <button
            aria-label={ar ? "المزيد من المؤشرات" : "Next indicators"}
            onClick={() => move(1)}
            type="button"
          >
            {ar ? <ArrowLeft aria-hidden /> : <ArrowRight aria-hidden />}
          </button>
        </div>
      </div>
    </div>
  );
}
