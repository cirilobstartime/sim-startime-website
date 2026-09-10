"use client";

import { useEffect, useState } from "react";
import type { CountdownSection } from "@/content/types";
import { CmsText } from "./CmsText";

function remaining(targetDate: string) {
  const total = Math.max(0, new Date(targetDate).getTime() - Date.now());
  const totalDays = Math.floor(total / 86_400_000);
  const months = Math.floor(totalDays / 30);
  const days = totalDays % 30;
  const hours = Math.floor((total / 3_600_000) % 24);
  const minutes = Math.floor((total / 60_000) % 60);
  const seconds = Math.floor((total / 1_000) % 60);
  return { days, hours, minutes, months, seconds };
}

export function SimfCountdown({
  section,
}: {
  section: CountdownSection;
}) {
  // Keep the server and first client render deterministic; the live value is
  // applied immediately after hydration.
  const [time, setTime] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    months: 0,
    seconds: 0,
  });

  useEffect(() => {
    const update = () => setTime(remaining(section.targetDate));
    update();
    const timer = window.setInterval(update, 1000);
    return () => window.clearInterval(timer);
  }, [section.targetDate]);

  return (
    <section className="simf-countdown" id={section.anchorID || undefined}>
      <div className="simf-shell simf-countdown__inner">
        <p><CmsText value={section.heading} /></p>
        <div className="simf-countdown__values" aria-live="off">
          {(
            [
              ["months", time.months],
              ["days", time.days],
              ["hours", time.hours],
              ["minutes", time.minutes],
              ["seconds", time.seconds],
            ] as const
          ).map(([key, value]) => (
            <div key={key}>
              <strong>{String(value).padStart(2, "0")}</strong>
              <span><CmsText value={section.labels[key]} /></span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
