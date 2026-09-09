"use client";

import { ArrowLeft, ArrowRight } from "@phosphor-icons/react";
import { useRef } from "react";
import type { Locale, SpeakerDirectorySection } from "@/content/types";
import { CmsImage } from "../CmsImage";
import { SimfCountryFlag } from "./SimfCountryFlag";
import { SimfSpeakerRole } from "./SimfSpeakerRole";

export function SimfSpeakerDirectory({
  locale,
  speakers,
}: {
  locale: Locale;
  speakers: SpeakerDirectorySection["speakers"];
}) {
  const rail = useRef<HTMLDivElement>(null);
  const ar = locale === "ar";

  function move(direction: -1 | 1) {
    const element = rail.current;
    if (!element) return;
    element.scrollBy({
      behavior: "smooth",
      left: (ar ? -direction : direction) * Math.max(280, element.clientWidth * 0.82),
    });
  }

  return (
    <>
      <div className="simf-directory-speakers__grid" ref={rail}>
        {speakers.map((speaker, index) => {
          return (
            <article className={index < 3 ? "is-senior" : ""} key={speaker.id || speaker.name}>
              <div className="simf-directory-speakers__portrait">
                <CmsImage
                  alt={speaker.name}
                  media={speaker.portrait}
                  mobileMedia={speaker.mobilePortrait}
                  sizes="(max-width: 720px) 82vw, (max-width: 1100px) 33vw, 24vw"
                />
                <SimfCountryFlag
                  className="simf-directory-speakers__flag"
                  country={speaker.country}
                />
              </div>
              <div className="simf-directory-speakers__copy">
                {speaker.eyebrow ? <span>{speaker.eyebrow}</span> : null}
                <h3>{speaker.name}</h3>
                {speaker.role ? (
                  <SimfSpeakerRole
                    value={speaker.role}
                    workplace={speaker.workplace}
                  />
                ) : null}
              </div>
            </article>
          );
        })}
      </div>
      <div className="simf-directory-speakers__mobile-controls">
        <button
          aria-label={ar ? "المتحدثون السابقون" : "Previous speakers"}
          onClick={() => move(-1)}
          type="button"
        >
          {ar ? <ArrowRight aria-hidden /> : <ArrowLeft aria-hidden />}
        </button>
        <p>{ar ? "اسحب لاستعراض المشاركين" : "Swipe to explore participants"}</p>
        <button
          aria-label={ar ? "المزيد من المتحدثين" : "Next speakers"}
          onClick={() => move(1)}
          type="button"
        >
          {ar ? <ArrowLeft aria-hidden /> : <ArrowRight aria-hidden />}
        </button>
      </div>
    </>
  );
}
