import {
  AnchorSimple,
  ArrowRight,
  ArrowUpRight,
  Buildings,
  CalendarBlank,
  ChartLineUp,
  Check,
  Circuitry,
  Compass,
  DownloadSimple,
  EnvelopeSimple,
  Factory,
  Gear,
  GlobeHemisphereWest,
  Handshake,
  Heartbeat,
  Lightbulb,
  MapPin,
  Megaphone,
  Mountains,
  ShieldChevron,
  Sparkle,
  Phone,
  UsersThree,
} from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import type { CSSProperties } from "react";
import type {
  BaseSection,
  Button,
  CallToActionSection,
  CardGridSection,
  FormSection,
  Locale,
  MediaFeatureSection,
  MetricRailSection,
  PartnerCategorySection,
  PublicPage,
  SimfFooterSection,
  SimfHeaderSection,
  TimelineSection,
  VideoFeatureSection,
  SpeakerDirectorySection,
} from "@/content/types";
import { createFormToken } from "@/lib/formSecurity";
import { standardPageSchema } from "@/lib/structuredData";
import { CmsImage, getMediaURL } from "../CmsImage";
import { LeadForm } from "../LeadForm";
import { SimfFooter } from "./SimfFooter";
import { formatMetricValue } from "./formatMetricValue";
import { SimfHeader } from "./SimfHeader";
import { SimfContentMotion } from "./SimfContentMotion";
import { SimfPartnerRail } from "./SimfPartnerRail";
import { SimfPartnerCategoryLayout } from "./SimfPartnerCategoryLayout";
import { SimfSpeakerDirectory } from "./SimfSpeakerDirectory";
import { SimfStickySponsor } from "./SimfStickySponsor";

type Props = {
  locale: Locale;
  nonce?: string;
  page: PublicPage;
  pagePath: string;
  showLanguageSwitcher?: boolean;
};

const imageAboveCopySections = new Set([
  "official-framework",
  "programme-days",
  "programme-highlights",
  "sponsor-reasons",
]);

function findSection<T extends PublicPage["sections"][number]>(
  page: PublicPage,
  anchorID: string,
) {
  return page.sections.find((section) => section.anchorID === anchorID) as
    | T
    | undefined;
}

function Action({ button }: { button: Button }) {
  const external = /^https?:\/\//.test(button.href);
  const icon =
    button.icon === "none" ? null
    : button.icon === "arrow-right" ? <ArrowRight aria-hidden />
    : button.icon === "download" ? <DownloadSimple aria-hidden />
    : button.icon === "calendar" ? <CalendarBlank aria-hidden />
    : button.icon === "envelope" ? <EnvelopeSimple aria-hidden />
    : <ArrowUpRight aria-hidden />;
  return (
    <Link
      className={`simf-button simf-button--${button.style || "primary"}`}
      data-track={button.trackingID || undefined}
      href={button.href}
      rel={external ? "noopener noreferrer" : undefined}
      target={button.openInNewTab || external ? "_blank" : undefined}
    >
      {button.label}
      {icon}
    </Link>
  );
}

type SectionStyle = CSSProperties & {
  "--simf-section-bg"?: string;
  "--simf-section-image"?: string;
  "--simf-section-mobile-image"?: string;
  "--simf-section-overlay"?: string;
};

function appearance(section: BaseSection) {
  const settings = section.appearance;
  const backgroundImage = getMediaURL(settings?.backgroundImage);
  const mobileBackgroundImage = getMediaURL(settings?.mobileBackgroundImage);
  const className = [
    settings?.theme ? `simf-content-section--theme-${settings.theme}` : "",
    settings?.spacing ? `simf-content-section--spacing-${settings.spacing}` : "",
    backgroundImage ? "simf-content-section--has-background" : "",
  ]
    .filter(Boolean)
    .join(" ");
  const style: SectionStyle = {};
  if (settings?.backgroundColor) style["--simf-section-bg"] = settings.backgroundColor;
  if (backgroundImage) style["--simf-section-image"] = `url("${backgroundImage}")`;
  if (mobileBackgroundImage) {
    style["--simf-section-mobile-image"] = `url("${mobileBackgroundImage}")`;
  }
  if (settings?.overlayOpacity != null) {
    style["--simf-section-overlay"] = String(settings.overlayOpacity / 100);
  }
  return { className, style };
}

function SectionHeading({
  body,
  eyebrow,
  heading,
}: {
  body?: string | null;
  eyebrow?: string | null;
  heading: string;
}) {
  return (
    <div className="simf-section-head">
      {eyebrow ? <p className="simf-eyebrow">{eyebrow}</p> : null}
      <h2>{heading}</h2>
      {body ? <p>{body}</p> : null}
    </div>
  );
}

function CardIcon({ name }: { name?: string | null }) {
  const props = { "aria-hidden": true, weight: "thin" as const };
  if (name === "anchor") return <AnchorSimple {...props} />;
  if (name === "buildings") return <Buildings {...props} />;
  if (name === "chart") return <ChartLineUp {...props} />;
  if (name === "check") return <Check {...props} />;
  if (name === "circuitry") return <Circuitry {...props} />;
  if (name === "compass") return <Compass {...props} />;
  if (name === "factory") return <Factory {...props} />;
  if (name === "gear") return <Gear {...props} />;
  if (name === "globe") return <GlobeHemisphereWest {...props} />;
  if (name === "handshake") return <Handshake {...props} />;
  if (name === "heartbeat") return <Heartbeat {...props} />;
  if (name === "lightbulb") return <Lightbulb {...props} />;
  if (name === "megaphone") return <Megaphone {...props} />;
  if (name === "mountains") return <Mountains {...props} />;
  if (name === "calendar") return <CalendarBlank {...props} />;
  if (name === "envelope") return <EnvelopeSimple {...props} />;
  if (name === "phone") return <Phone {...props} />;
  if (name === "map-pin") return <MapPin {...props} />;
  if (name === "shield") return <ShieldChevron {...props} />;
  if (name === "sparkle") return <Sparkle {...props} />;
  if (name === "users") return <UsersThree {...props} />;
  return null;
}

function programmeDayTitle(title: string) {
  const separator = title.indexOf(":");
  if (separator < 0) return null;
  const day = title.slice(0, separator).trim();
  const topic = title.slice(separator + 1).trim();
  return day && topic ? { day, topic } : null;
}

function CardSection({
  locale,
  section,
}: {
  locale: Locale;
  section: CardGridSection;
}) {
  const cards = section.cards.filter((card) => card.visible !== false);
  const visual = appearance(section);
  if (section.anchorID === "all-speakers") {
    const speakers = section.cards.map((speaker) => ({
      country: speaker.country || speaker.meta,
      eyebrow: speaker.eyebrow,
      id: speaker.id,
      name: speaker.title,
      portrait: speaker.media || null,
      role: speaker.body,
      visible: speaker.visible,
      workplace: speaker.workplace,
    }));
    return (
      <section
        className={`simf-directory-speakers simf-content-section ${visual.className}`}
        id={section.anchorID}
        style={visual.style}
      >
        <div className="simf-shell">
          <SectionHeading body={section.body} eyebrow={section.eyebrow} heading={section.heading} />
          <SimfSpeakerDirectory
            locale={locale}
            speakers={speakers.filter((speaker) => speaker.visible !== false)}
          />
        </div>
      </section>
    );
  }

  const partnerCategory = section.anchorID?.startsWith("partner-category-");
  const imageAboveCopy = imageAboveCopySections.has(section.anchorID || "");
  if (section.anchorID === "sponsor-slider") {
    return (
      <section
        className={`simf-content-sponsor-rail simf-content-section ${visual.className}`}
        id={section.anchorID}
        style={visual.style}
      >
        <div className="simf-shell simf-content-sponsor-rail__layout">
          <SectionHeading
            body={section.body}
            eyebrow={section.eyebrow}
            heading={section.heading}
          />
          <SimfPartnerRail locale={locale} partners={cards} />
        </div>
      </section>
    );
  }
  if (section.layout === "tabs") {
    return (
      <section
        className={`simf-content-accordion simf-content-section simf-content-section--${section.anchorID || "accordion"} ${visual.className}`}
        id={section.anchorID || undefined}
        style={visual.style}
      >
        <div className="simf-shell simf-content-accordion__layout">
          <SectionHeading
            body={section.body}
            eyebrow={section.eyebrow}
            heading={section.heading}
          />
          <div className="simf-content-accordion__items">
            {cards.map((card, index) => (
              <details key={card.id || card.title} open={index === 0}>
                <summary>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <strong>{card.title}</strong>
                </summary>
                {card.body ? <p>{card.body}</p> : null}
              </details>
            ))}
          </div>
        </div>
      </section>
    );
  }
  return (
    <section
      className={`simf-content-cards simf-content-section simf-content-section--${section.anchorID || "cards"}${partnerCategory ? " simf-content-cards--logos" : ""} ${visual.className}`}
      id={section.anchorID || undefined}
      style={visual.style}
    >
      <div className="simf-shell">
        <SectionHeading body={section.body} eyebrow={section.eyebrow} heading={section.heading} />
        <div className={`simf-content-cards__grid simf-content-cards__grid--${section.layout || "editorial"}`}>
          {cards.map((card, index) => {
            const imageOverlay = Boolean(
              card.media && !partnerCategory && !imageAboveCopy,
            );
            const programmeTitle =
              section.anchorID === "programme-days"
                ? programmeDayTitle(card.title)
                : null;
            const content = (
              <>
                {card.media ? (
                  <div className="simf-content-card__media">
                    <CmsImage
                      alt={partnerCategory ? card.title : ""}
                      media={card.media}
                      sizes={partnerCategory ? "230px" : "(max-width: 720px) 100vw, 34vw"}
                    />
                  </div>
                ) : null}
                <div className="simf-content-card__copy">
                  {card.icon ? (
                    <div className="simf-content-card__icon">
                      <CardIcon name={card.icon} />
                    </div>
                  ) : null}
                  {card.eyebrow ? <span>{card.eyebrow}</span> : null}
                  {card.meta && partnerCategory ? <small>{card.meta}</small> : null}
                  {programmeTitle ? (
                    <h3 className="simf-programme-day-title">
                      <span>{programmeTitle.day}</span>
                      <small>{programmeTitle.topic}</small>
                    </h3>
                  ) : (
                    <h3>{card.title}</h3>
                  )}
                  {card.body ? <p>{card.body}</p> : null}
                  {card.button?.label ? (
                    <span className="simf-content-card__link">
                      {card.button.label}
                      <ArrowUpRight aria-hidden />
                    </span>
                  ) : null}
                </div>
              </>
            );
            const className = `simf-content-card${imageOverlay ? " simf-content-card--image-overlay" : ""} simf-reveal simf-reveal--${(index % 3) + 1}`;
            return card.button?.href ? (
              <Link
                className={className}
                href={card.button.href}
                key={card.id || card.title}
                rel={card.button.openInNewTab ? "noopener noreferrer" : undefined}
                target={card.button.openInNewTab ? "_blank" : undefined}
              >
                {content}
              </Link>
            ) : (
              <article className={className} key={card.id || card.title}>
                {content}
              </article>
            );
          })}
        </div>
        {section.buttons?.length ? (
          <div className="simf-content-section__actions">
            {section.buttons.map((item) => (
              <Action button={item} key={`${item.href}-${item.label}`} />
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}

function SpeakerDirectory({
  locale,
  section,
}: {
  locale: Locale;
  section: SpeakerDirectorySection;
}) {
  const visual = appearance(section);
  const speakers = section.speakers.filter((speaker) => speaker.visible !== false);
  return (
    <section
      className={`simf-directory-speakers simf-content-section ${visual.className}`}
      id={section.anchorID || undefined}
      style={visual.style}
    >
      <div className="simf-shell">
        <SectionHeading
          body={section.body}
          eyebrow={section.eyebrow}
          heading={section.heading}
        />
        <SimfSpeakerDirectory locale={locale} speakers={speakers} />
      </div>
    </section>
  );
}

function PartnerCategory({
  locale,
  section,
}: {
  locale: Locale;
  section: PartnerCategorySection;
}) {
  const visual = appearance(section);
  const logos = section.logos.filter((logo) => logo.visible !== false);
  const ar = locale === "ar";
  const inferredTier = section.heading.toLowerCase().includes("strategic") || section.heading.includes("الاستراتيجي")
    ? "strategic"
    : section.heading.toLowerCase().includes("media") || section.heading.includes("الإعلامي")
      ? "media-partner"
      : null;
  const tierLabels = {
    supervision: ar ? "إشراف" : "Supervision",
    organizer: ar ? "المنظم" : "Organizer",
    strategic: ar ? "استراتيجي" : "Strategic",
    diamond: ar ? "ماسي" : "Diamond",
    platinum: ar ? "بلاتيني" : "Platinum",
    gold: ar ? "ذهبي" : "Gold",
    silver: ar ? "فضي" : "Silver",
    sector: ar ? "راعٍ قطاعي" : "Sector Sponsor",
    "co-sponsor": ar ? "راعٍ مشارك" : "Co-Sponsor",
    "hospitality-sponsor": ar ? "راعي الضيافة" : "Hospitality Sponsor",
    "official-carrier": ar ? "الناقل الرسمي" : "Official Carrier",
    "official-contractor": ar ? "المقاول الرسمي" : "Official Contractor",
    "media-partner": ar ? "شريك إعلامي" : "Media Partner",
    "marketing-partner": ar ? "شريك تسويقي" : "Marketing Partner",
    "licensed-to": ar ? "الجهة المرخّص لها" : "Licensed To",
    "advisory-arm": ar ? "الذراع الاستشاري" : "Advisory Arm",
    partner: ar ? "شريك" : "Partner",
  } as const;
  return (
    <section
      className={`simf-content-cards simf-content-cards--logos simf-partner-category simf-content-section ${visual.className}`}
      id={section.anchorID || undefined}
      style={visual.style}
    >
      <div className="simf-shell">
        <SectionHeading
          body={section.body}
          eyebrow={section.eyebrow}
          heading={section.heading}
        />
        <SimfPartnerCategoryLayout
          layout={section.logoLayout === "swiper" ? "swiper" : "grid"}
          locale={locale}
        >
          {logos.map((logo, index) => {
            const featured =
              index < 2 && section.anchorID === "partner-category-supervision";
            const officialTier = featured
              ? index === 0
                ? "supervision"
                : "organizer"
              : null;
            const selectedTier = officialTier ||
              (logo.tier === "none" ? null : logo.tier || inferredTier);
            const media = (
              <>
                <div className="simf-content-card__media">
                  <div className="simf-content-card__logo-stage">
                    <CmsImage
                      alt={logo.name}
                      media={logo.logo}
                      sizes={featured ? "410px" : "340px"}
                    />
                  </div>
                </div>
                {selectedTier ? (
                  <span
                    className={`simf-partner-category__footer-label simf-partner-category__footer-label--${selectedTier}`}
                  >
                    {tierLabels[selectedTier]}
                  </span>
                ) : null}
              </>
            );
            const className = `simf-content-card simf-content-card--footer-label simf-reveal${featured ? " simf-content-card--featured-footer" : ""}`;
            const href = logo.href?.trim();
            const linkedMedia = href ? (
              <a
                aria-label={ar ? `زيارة موقع ${logo.name}` : `Visit ${logo.name} website`}
                className="simf-partner-category__card-link"
                href={href}
                rel="noopener noreferrer"
                target={logo.openInNewTab === false ? undefined : "_blank"}
              >
                {media}
              </a>
            ) : (
              media
            );
            return (
              <article
                aria-label={logo.name}
                className={className}
                key={logo.id || logo.name}
              >
                {linkedMedia}
              </article>
            );
          })}
        </SimfPartnerCategoryLayout>
      </div>
    </section>
  );
}

function MediaSection({
  isIntro = false,
  section,
}: {
  isIntro?: boolean;
  section: MediaFeatureSection;
}) {
  const visual = appearance(section);
  return (
    <section
      className={`simf-content-media simf-content-section simf-content-section--${section.anchorID || "media"} simf-content-media--${section.theme || "light"} simf-content-media--${section.mediaPosition || "start"}${isIntro ? " simf-content-media--intro" : ""} ${visual.className}`}
      id={section.anchorID || undefined}
      style={visual.style}
    >
      <div className="simf-shell simf-content-media__layout">
        <div className="simf-content-media__visual">
          <CmsImage alt="" media={section.media} sizes="(max-width: 800px) 100vw, 50vw" />
        </div>
        <div className="simf-content-media__copy">
          <SectionHeading body={section.body} eyebrow={section.eyebrow} heading={section.heading} />
          {section.ctaLabel && section.ctaHref ? (
            <Action
              button={{
                href: section.ctaHref,
                label: section.ctaLabel,
                style: "primary",
              }}
            />
          ) : null}
        </div>
      </div>
    </section>
  );
}

function Metrics({ locale, section }: { locale: Locale; section: MetricRailSection }) {
  const visual = appearance(section);
  return (
    <section
      className={`simf-content-metrics simf-content-section simf-content-section--${section.anchorID || "metrics"} ${visual.className}`}
      id={section.anchorID || undefined}
      style={visual.style}
    >
      <div className="simf-shell simf-content-metrics__layout">
        <SectionHeading body={section.body} eyebrow={section.eyebrow} heading={section.heading} />
        <div className="simf-content-metrics__rail">
          {section.metrics.map((metric) => (
            <div key={`${metric.value}-${metric.label}`}>
              <strong dir="ltr">{formatMetricValue(locale, metric.value)}</strong>
              <span>{metric.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ValueTimeline({ section }: { section: TimelineSection }) {
  const editionTimeline =
    section.anchorID === "edition-timeline" ||
    section.anchorID === "previous-editions" ||
    section.anchorID === "strategic-evolution";
  const visual = appearance(section);
  const hasMedia = section.steps.some((step) => Boolean(step.media));
  return (
    <section
      className={`simf-content-value simf-content-section simf-content-section--${section.anchorID || "timeline"}${hasMedia ? " simf-content-value--media" : ""} ${visual.className}`}
      id={section.anchorID || undefined}
      style={visual.style}
    >
      <div className="simf-shell simf-content-value__layout">
        <SectionHeading body={section.body} eyebrow={section.eyebrow} heading={section.heading} />
        <div className="simf-content-value__steps">
          {section.steps.filter((step) => step.visible !== false).map((step, index) => (
            <article key={step.title}>
              {step.media ? (
                <div className="simf-content-value__media">
                  <CmsImage
                    alt=""
                    media={step.media}
                    sizes="(max-width: 800px) 82vw, 25vw"
                  />
                </div>
              ) : null}
              <span>
                {editionTimeline
                  ? step.label?.match(/\b20\d{2}\b/)?.[0] || String(index + 1).padStart(2, "0")
                  : String(index + 1).padStart(2, "0")}
              </span>
              <div>
                {step.label ? <small>{step.label}</small> : null}
                <h3>{step.title}</h3>
                {step.body ? <p>{step.body}</p> : null}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Film({ section }: { section: VideoFeatureSection }) {
  const src = getMediaURL(section.video);
  const visual = appearance(section);
  return (
    <section
      className={`simf-content-film simf-content-section simf-content-section--${section.anchorID || "film"} ${visual.className}`}
      id={section.anchorID || undefined}
      style={visual.style}
    >
      <div className="simf-shell">
        <SectionHeading body={section.body} eyebrow={section.eyebrow} heading={section.heading} />
        {src ? (
          <video
            autoPlay={Boolean(section.autoplay)}
            controls
            loop={Boolean(section.autoplay)}
            muted={Boolean(section.autoplay)}
            playsInline
            poster={getMediaURL(section.poster)}
            preload="metadata"
          >
            <source src={src} />
          </video>
        ) : null}
      </div>
    </section>
  );
}

function CTA({ section }: { section: CallToActionSection }) {
  const visual = appearance(section);
  return (
    <section
      className={`simf-content-cta simf-content-section simf-content-section--${section.anchorID || "cta"} ${visual.className}`}
      id={section.anchorID || undefined}
      style={visual.style}
    >
      <div className="simf-content-cta__media">
        <CmsImage alt="" media={section.media} sizes="100vw" />
      </div>
      <div className="simf-content-cta__shade" />
      <div className="simf-shell simf-content-cta__content">
        <SectionHeading body={section.body} eyebrow={section.eyebrow} heading={section.heading} />
        {section.buttons?.length ? (
          <div className="simf-content-section__actions">
            {section.buttons.map((item) => (
              <Action button={item} key={`${item.href}-${item.label}`} />
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}

function SecureForm({
  locale,
  pagePath,
  section,
}: {
  locale: Locale;
  pagePath: string;
  section: FormSection;
}) {
  const form = typeof section.form === "object" ? section.form : null;
  if (!form) return null;
  const visual = appearance(section);
  return (
    <section
      className={`simf-content-form simf-content-section simf-content-section--${section.anchorID || "form"} ${visual.className}`}
      id={section.anchorID || undefined}
      style={visual.style}
    >
      <div className="simf-shell simf-content-form__layout">
        <div className="simf-content-form__intro">
          <SectionHeading
            body={section.body}
            eyebrow={section.eyebrow}
            heading={section.heading}
          />
        </div>
        <div className="simf-content-form__panel">
          <LeadForm
            ctaID={`${section.anchorID || "form"}-submit`}
            form={form}
            locale={locale}
            pagePath={pagePath}
            privacyNote={section.privacyNote}
            sectionID={section.anchorID}
            successHeading={section.successHeading}
            successMessage={section.successMessage}
            token={createFormToken(form.formKey)}
          />
        </div>
      </div>
    </section>
  );
}

export function SimfContentPage({
  locale,
  nonce,
  page,
  pagePath,
  showLanguageSwitcher = true,
}: Props) {
  const ar = locale === "ar";
  const header = findSection<SimfHeaderSection>(page, "header");
  const footer = findSection<SimfFooterSection>(page, "footer");
  const hero = page.sections.find(
    (section) => section.anchorID === "page-hero" && section.blockType === "hero",
  );
  const homeHref = ar ? "/ar" : "/";
  const switchHref = ar ? pagePath.replace(/^\/ar/, "") || "/" : `/ar${pagePath === "/" ? "" : pagePath}`;
  const sponsorHref = header?.sponsorHref || (ar ? "/ar/sponsor" : "/sponsor");
  const navigation = (header?.links || []).filter(
    (item) => !item.href.endsWith("/about") && item.href !== "/about",
  );
  const pageKey = page.pageType.replace("simf-microsite-", "");
  const sponsorPage = pageKey === "sponsor";
  const structuredData = standardPageSchema(locale, page, pagePath);
  const contentSections = page.sections.filter(
    (section) =>
      section.visible !== false &&
      section.anchorID !== "header" &&
      section.anchorID !== "footer" &&
      section.anchorID !== "page-hero",
  );

  return (
    <div
      className={`simf-site simf-content-page simf-content-page--${pageKey}`}
      data-page-key={pageKey}
      dir={ar ? "rtl" : "ltr"}
      lang={locale}
    >
      <SimfHeader
        homeHref={homeHref}
        locale={locale}
        logo={header?.logo}
        logoAlt={header?.logoAlt}
        menuCloseLabel={header?.menuCloseLabel}
        menuOpenLabel={header?.menuOpenLabel}
        nav={navigation}
        navigationLabel={header?.navigationLabel}
        sponsorHref={sponsorHref}
        sponsorLabel={header?.sponsorLabel}
        showLanguageSwitcher={showLanguageSwitcher}
        switchHref={switchHref}
        switchLabel={header?.languageSwitchLabel}
      />
      <SimfContentMotion />
      <main id="main-content">
        <script
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData).replaceAll("<", "\\u003c"),
          }}
          nonce={nonce}
          type="application/ld+json"
        />
        {hero && hero.blockType === "hero" ? (
          <section className="simf-inner-hero">
            <div className="simf-inner-hero__media">
              <CmsImage
                alt=""
                className={hero.mobileMedia ? "simf-inner-hero__image--desktop" : undefined}
                media={hero.media}
                priority
                sizes="100vw"
              />
              {hero.mobileMedia ? (
                <CmsImage
                  alt=""
                  className="simf-inner-hero__image--mobile"
                  media={hero.mobileMedia}
                  priority
                  sizes="100vw"
                />
              ) : null}
            </div>
            <div className="simf-inner-hero__shade" />
            <div className="simf-shell simf-inner-hero__content">
              {hero.eyebrow ? <p className="simf-eyebrow">{hero.eyebrow}</p> : null}
              <h1>{hero.heading}</h1>
              {hero.body ? <p>{hero.body}</p> : null}
              {hero.note ? (
                <p className="simf-inner-hero__note">{hero.note}</p>
              ) : null}
              {hero.eventDetails?.length ? (
                <div className="simf-inner-hero__details">
                  {hero.eventDetails.map((detail, index) => (
                    <div key={detail.label}>
                      {index === 0 ? (
                        <CalendarBlank aria-hidden />
                      ) : (
                        <MapPin aria-hidden />
                      )}
                      <span>
                        <small>{detail.label}</small>
                        <strong>{detail.value}</strong>
                      </span>
                    </div>
                  ))}
                </div>
              ) : null}
              {hero.buttons?.length ? (
                <div className="simf-content-section__actions">
                  {hero.buttons.map((item) => (
                    <Action button={item} key={`${item.href}-${item.label}`} />
                  ))}
                </div>
              ) : null}
            </div>
          </section>
        ) : null}
        {contentSections.map((section, index) => {
          if (section.blockType === "mediaFeature") {
            return (
              <MediaSection
                isIntro={index === 0}
                key={section.id || section.anchorID}
                section={section}
              />
            );
          }
          if (section.blockType === "cardGrid") {
            return (
              <CardSection
                key={section.id || section.anchorID}
                locale={locale}
                section={section}
              />
            );
          }
          if (section.blockType === "speakerDirectory") {
            return (
              <SpeakerDirectory
                key={section.id || section.anchorID}
                locale={locale}
                section={section}
              />
            );
          }
          if (section.blockType === "partnerCategory") {
            return (
              <PartnerCategory
                key={section.id || section.heading}
                locale={locale}
                section={section}
              />
            );
          }
          if (section.blockType === "metricRail") {
            return <Metrics key={section.id || section.anchorID} locale={locale} section={section} />;
          }
          if (section.blockType === "timeline") {
            return <ValueTimeline key={section.id || section.anchorID} section={section} />;
          }
          if (section.blockType === "videoFeature") {
            return <Film key={section.id || section.anchorID} section={section} />;
          }
          if (section.blockType === "callToAction") {
            return <CTA key={section.id || section.anchorID} section={section} />;
          }
          if (section.blockType === "form") {
            return (
              <SecureForm
                key={section.id || section.anchorID}
                locale={locale}
                pagePath={pagePath}
                section={section}
              />
            );
          }
          return null;
        })}
      </main>
      <SimfStickySponsor
        href={sponsorPage ? "#sponsor-form" : sponsorHref}
        label={
          sponsorPage
            ? ar
              ? "قدّم الآن"
              : "Apply Now"
            : header?.sponsorLabel || (ar ? "كن راعيًا" : "Become a Sponsor")
        }
      />
      <SimfFooter footer={footer} homeHref={homeHref} locale={locale} />
    </div>
  );
}
