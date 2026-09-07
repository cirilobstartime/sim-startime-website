import type { Locale } from "@/content/types";

export function formatMetricValue(locale: Locale, value: string) {
  if (locale !== "ar") return value;

  const trimmed = value.trim();
  const hasPlus = /^\+/.test(trimmed) || /\+$/.test(trimmed);
  const hasPercent = /^%/.test(trimmed) || /%$/.test(trimmed);

  if (!hasPlus && !hasPercent) return value;

  const core = trimmed.replace(/^\+|\+$/g, "").replace(/^%|%$/g, "").trim();
  return `${hasPercent ? "%" : ""}${core}${hasPlus ? "+" : ""}`;
}
