"use client";

import { ArrowLeft, ArrowRight } from "@phosphor-icons/react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import type { CardGridSection, Locale } from "@/content/types";
import { CmsImage } from "../CmsImage";
import { CmsText } from "./CmsText";
import { SimfCountryFlag } from "./SimfCountryFlag";
import { SimfSpeakerRole } from "./SimfSpeakerRole";

export function SimfSpeakerRail({
  action,
  locale,
  speakers,
  wideDesktop = false,
}: {
  action?: ReactNode;
  locale: Locale;
  speakers: CardGridSection["cards"];
  wideDesktop?: boolean;
}) {
  const rail = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ end: false, start: true });
  const ar = locale === "ar";

  const update = useCallback(() => {
    const element = rail.current;
    if (!element) return;
    const max = element.scrollWidth - element.clientWidth;
    const current = Math.abs(element.scrollLeft);
    setPosition({
      end: max <= 2 || current >= max - 4,
      // The rail's responsive inline padding produces a small initial RTL
      // scroll offset in Chromium, so treat that inset as the logical start.
      start: current <= 24,
    });
  }, []);

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

  function move(direction: -1 | 1) {
    const element = rail.current;
    if (!element) return;
    const logicalDirection = ar ? -direction : direction;
    element.scrollBy({
      behavior: "smooth",
      left: logicalDirection * Math.max(280, element.clientWidth * 0.78),
    });
  }

  return (
    <>
      <div className="simf-speakers__rail" ref={rail}>
        {speakers.map((card, index) => (
          <article className={index < 3 ? "is-senior" : ""} key={card.id || card.title}>
            <div className="simf-speakers__portrait">
              <CmsImage
                alt={card.title}
                media={card.media}
                mobileMedia={card.mobileMedia}
                sizes={
                  wideDesktop && index < 3
                    ? "(min-width: 2200px) 720px, (min-width: 1600px) 600px, 340px"
                    : index < 3
                      ? "340px"
                      : "270px"
                }
              />
              <SimfCountryFlag
                className="simf-speakers__flag simf-speakers__flag--overlay"
                country={card.country || card.meta}
              />
            </div>
            <div className="simf-speakers__copy">
              {card.eyebrow ? <span><CmsText value={card.eyebrow} /></span> : null}
              <h3><CmsText value={card.title} /></h3>
              {card.body ? (
                <SimfSpeakerRole
                  value={card.body}
                  workplace={card.workplace}
                />
              ) : null}
            </div>
          </article>
        ))}
      </div>
      <div className="simf-shell simf-speakers__controls">
        {action ? <div className="simf-speakers__action">{action}</div> : <span />}
        <div>
          <button
            aria-label={ar ? "المشاركون السابقون" : "Previous speakers"}
            disabled={position.start}
            onClick={() => move(-1)}
            type="button"
          >
            {ar ? <ArrowRight aria-hidden /> : <ArrowLeft aria-hidden />}
          </button>
          <button
            aria-label={ar ? "المزيد من المشاركين" : "Next speakers"}
            disabled={position.end}
            onClick={() => move(1)}
            type="button"
          >
            {ar ? <ArrowLeft aria-hidden /> : <ArrowRight aria-hidden />}
          </button>
        </div>
      </div>
    </>
  );
}
