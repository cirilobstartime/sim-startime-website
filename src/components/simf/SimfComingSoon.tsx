import {
  ArrowUpRight,
  CalendarBlank,
  EnvelopeSimple,
  MapPin,
} from "@phosphor-icons/react/dist/ssr";
import Image from "next/image";
import Link from "next/link";
import type { SiteSettings } from "@/content/types";
import { CmsImage } from "@/components/CmsImage";

type Props = {
  settings: SiteSettings;
};

const defaults = {
  contactLabel: "Contact the SIM team",
  eventDate: "23–25 November 2026",
  label: "Saudi International Maritime Forum 2026",
  message:
    "A new digital experience is taking shape. We will be online soon with the latest programme, speakers, partnerships and opportunities.",
  title: "Preparing the next horizon of maritime security.",
  venue: "Sofitel Riyadh Hotel & Convention Centre, Saudi Arabia",
} as const;

export function SimfComingSoon({ settings }: Props) {
  const copy = defaults;
  const content = settings.comingSoon;
  const logo = settings.headerLogo;
  const mobileLogo = settings.mobileHeaderLogo;
  const contactEmail = content?.contactEmail || "sim@startime.sa";

  return (
    <main
      className="simf-site simf-coming-soon"
      dir="ltr"
      lang="en"
    >
      <div className="simf-coming-soon__media" aria-hidden="true">
        {content?.backgroundImage ? (
          <CmsImage
            alt=""
            media={content.backgroundImage}
            mobileMedia={content.mobileBackgroundImage}
            priority
            sizes="100vw"
          />
        ) : (
          <Image
            alt=""
            fill
            priority
            sizes="100vw"
            src="/assets/simf-microsite/photos/naval-formation-sunset.webp"
          />
        )}
      </div>
      <div className="simf-coming-soon__veil" aria-hidden="true" />
      <div className="simf-coming-soon__lines" aria-hidden="true" />

      <div className="simf-coming-soon__frame">
        <header className="simf-coming-soon__header">
          <Link aria-label={copy.label} href="/">
            {logo ? (
              <span className="simf-coming-soon__cms-logo">
                <CmsImage
                  alt={copy.label}
                  media={logo}
                  mobileMedia={mobileLogo}
                  priority
                  sizes="180px"
                />
              </span>
            ) : (
              <Image
                alt={copy.label}
                height={120}
                priority
                src="/assets/simf-microsite/organizers/simf-mark-transparent.png"
                width={120}
              />
            )}
          </Link>
        </header>

        <section className="simf-coming-soon__content">
          <p className="simf-coming-soon__label">
            {content?.label || copy.label}
          </p>
          <h1>{content?.title || copy.title}</h1>
          <p className="simf-coming-soon__message">
            {content?.message || copy.message}
          </p>

          <div className="simf-coming-soon__event" aria-label={copy.label}>
            <div>
              <CalendarBlank aria-hidden weight="light" />
              <span>{content?.eventDate || copy.eventDate}</span>
            </div>
            <div>
              <MapPin aria-hidden weight="light" />
              <span>{content?.venue || copy.venue}</span>
            </div>
          </div>

          <a
            className="simf-coming-soon__contact"
            href={`mailto:${contactEmail}`}
          >
            <EnvelopeSimple aria-hidden weight="light" />
            <span>{content?.contactLabel || copy.contactLabel}</span>
            <ArrowUpRight aria-hidden />
          </a>
        </section>

        <footer className="simf-coming-soon__footer">
          <span>SIM 2026</span>
          <span aria-hidden="true" />
          <span>{content?.eventDate || copy.eventDate}</span>
        </footer>
      </div>
    </main>
  );
}
