"use client";

import { useState } from "react";
import type { CardGridSection, Locale } from "@/content/types";
import { CmsImage } from "../CmsImage";
import { CmsText } from "./CmsText";

export function SimfConceptTopics({
  locale,
  topics,
}: {
  locale: Locale;
  topics: CardGridSection["cards"];
}) {
  const [active, setActive] = useState(0);
  const selected = topics[active] || topics[0];

  if (!selected) return null;

  return (
    <div className="simf-option-topics__grid">
      <div className="simf-option-topics__list" role="tablist">
        {topics.map((topic, index) => (
          <button
            aria-selected={active === index}
            className={active === index ? "is-active" : undefined}
            key={topic.title}
            onClick={() => setActive(index)}
            onFocus={() => setActive(index)}
            onMouseEnter={() => setActive(index)}
            role="tab"
            type="button"
          >
            <span>{String(index + 1).padStart(2, "0")}</span>
            <strong><CmsText value={topic.title} /></strong>
          </button>
        ))}
      </div>
      <div
        aria-live="polite"
        className="simf-option-topics__feature"
        role="tabpanel"
      >
        <div className="simf-option-topics__image">
          <CmsImage
            alt=""
            media={selected.media}
            mobileMedia={selected.mobileMedia}
            sizes="(max-width: 800px) 100vw, 54vw"
          />
        </div>
        {selected.body ? <p><CmsText value={selected.body} /></p> : null}
        <span>
          {locale === "ar"
            ? `${String(active + 1).padStart(2, "0")} من ${String(topics.length).padStart(2, "0")}`
            : `${String(active + 1).padStart(2, "0")} / ${String(topics.length).padStart(2, "0")}`}
        </span>
      </div>
    </div>
  );
}
