import {
  ArrowUpRight,
  CalendarBlank,
  MapPin,
} from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import type {
  CallToActionSection,
  CardGridSection,
  CountdownSection,
  HeroSection,
  LegacySection,
  Locale,
  MediaFeatureSection,
  MetricRailSection,
  PublicPage,
  SimfFooterSection,
  SimfHeaderSection,
  VideoFeatureSection,
} from "@/content/types";
import { eventPageSchema } from "@/lib/structuredData";
import { CmsImage } from "../CmsImage";
import { SimfCountdown } from "./SimfCountdown";
import { SimfFooter } from "./SimfFooter";
import { SimfHeader } from "./SimfHeader";
import { SimfMetricSwiper } from "./SimfMetricSwiper";
import { SimfOptionMotion } from "./SimfOptionMotion";
import { SimfPartnerRail } from "./SimfPartnerRail";
import { SimfSpeakerRail } from "./SimfSpeakerRail";
import { SimfStickySponsor } from "./SimfStickySponsor";
import { SimfVideoPlayer } from "./SimfVideoPlayer";

type Props = {
  locale: Locale;
  nonce?: string;
  page: PublicPage;
  showLanguageSwitcher?: boolean;
  variant?: "about" | "approved" | "client-review";
};

function section<T extends PublicPage["sections"][number]>(
  page: PublicPage,
  id: string,
): T | undefined {
  return page.sections.find((item) => item.anchorID === id) as T | undefined;
}

function localePath(locale: Locale, path = "") {
  return `${locale === "ar" ? "/ar" : ""}${path}` || "/";
}

function audienceHeading(title: string) {
  return title.replace(/^\s*0[1-5](?:[\s.:\-–—]+|$)/, "").trim();
}

function ConceptButton({
  href,
  label,
  style = "primary",
  trackingID,
}: {
  href: string;
  label: string;
  style?: "outline" | "primary" | "text";
  trackingID?: string;
}) {
  return (
    <Link
      className={`simf-button simf-button--${style}`}
      data-track={trackingID}
      href={href}
    >
      {label}
      <ArrowUpRight aria-hidden />
    </Link>
  );
}

export function SimfHomepageOption({
  locale,
  nonce,
  page,
  showLanguageSwitcher = true,
  variant = "approved",
}: Props) {
  const ar = locale === "ar";
  const aboutPage = variant === "about" || variant === "client-review";
  const clientReview = variant === "client-review";
  const clientReviewRoute =
    clientReview && page.slug.endsWith("/new-homepage");
  const header = section<SimfHeaderSection>(page, "header");
  const hero = section<HeroSection>(page, "top");
  const countdown = section<CountdownSection>(page, "countdown");
  const authority = section<CardGridSection>(page, "authority");
  const about = section<MediaFeatureSection>(page, "about");
  const legacy = section<LegacySection>(page, "legacy");
  const indicators = section<MetricRailSection>(page, "indicators");
  const experience = section<VideoFeatureSection>(page, "experience");
  const audience = section<CardGridSection>(page, "audience");
  const sponsorship = section<CallToActionSection>(page, "sponsorship");
  const speakers = section<CardGridSection>(page, "speakers");
  const partners = section<CardGridSection>(page, "partners");
  const footer = section<SimfFooterSection>(page, "footer");
  const homeHref = localePath(locale);
  const sponsorHref = header?.sponsorHref || localePath(locale, "/sponsor");
  const switchHref = clientReviewRoute
    ? locale === "ar"
      ? "/new-homepage"
      : "/ar/new-homepage"
    : locale === "ar"
      ? "/"
      : "/ar";
  const nav = header?.links?.length
    ? header.links
    : [
        { href: homeHref, label: ar ? "الرئيسية" : "Home" },
        { href: localePath(locale, "/legacy"), label: ar ? "نسخ سابقة" : "Legacy" },
        { href: localePath(locale, "/programme"), label: ar ? "البرنامج" : "Programme" },
        { href: localePath(locale, "/speakers"), label: ar ? "المتحدثون" : "Speakers" },
        { href: localePath(locale, "/b2g"), label: ar ? "فرص B2G" : "Government B2G" },
        { href: localePath(locale, "/sponsor"), label: ar ? "الرعاية" : "Sponsorship" },
        { href: localePath(locale, "/partners"), label: ar ? "الشركاء" : "Partners" },
      ];

  return (
    <div
      className={`simf-site simf-homepage-option${aboutPage ? " simf-homepage-about" : ""}`}
      data-page="homepage-option"
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
        nav={nav}
        navigationLabel={header?.navigationLabel}
        sponsorHref={sponsorHref}
        sponsorLabel={header?.sponsorLabel}
        showLanguageSwitcher={showLanguageSwitcher}
        switchHref={switchHref}
        switchLabel={header?.languageSwitchLabel}
      />
      <SimfOptionMotion />
      <main id="main-content">
        <script
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(eventPageSchema(locale, page)).replaceAll(
              "<",
              "\\u003c",
            ),
          }}
          nonce={nonce}
          type="application/ld+json"
        />

        {hero ? (
          <section className="simf-option-hero" id="top">
            <div className="simf-option-hero__media">
              <CmsImage
                alt=""
                media={hero.media}
                priority
                sizes="100vw"
              />
            </div>
            <div className="simf-option-hero__veil" />
            <div className="simf-shell simf-option-hero__content">
              <div className="simf-option-hero__copy">
                {hero.eyebrow ? (
                  <p className="simf-option-hero__patronage">
                    {aboutPage
                      ? hero.eyebrow.split("\n").map((line) => {
                          const [copy, role] = line.split(" | ");

                          return (
                            <span key={line}>
                              {copy}
                              {role ? (
                                <span className="simf-option-hero__minister">
                                  {" | "}
                                  {role}
                                </span>
                              ) : null}
                            </span>
                          );
                        })
                      : hero.eyebrow}
                  </p>
                ) : null}
                <h1 className={clientReview ? "simf-option-hero__review-title" : undefined}>
                  {aboutPage
                    ? hero.heading.split("\n").map((line, index, lines) => (
                        <span
                          className={
                            lines.length > 1 && index === 0
                              ? "simf-option-hero__ordinal"
                              : undefined
                          }
                          key={line}
                        >
                          {line}
                        </span>
                      ))
                    : hero.heading}
                </h1>
                {hero.body ? (
                  <p
                    className={`simf-option-hero__lead${clientReview ? " simf-option-hero__review-lead" : ""}`}
                  >
                    {hero.body}
                  </p>
                ) : null}
                <div className="simf-option-hero__actions">
                  {hero.buttons?.map((button) => (
                    <ConceptButton
                      href={button.href}
                      key={`${button.href}-${button.label}`}
                      label={button.label}
                      style={button.style}
                      trackingID={button.trackingID || undefined}
                    />
                  ))}
                </div>
              </div>
              <div className="simf-option-hero__rail">
                <div className="simf-option-hero__details">
                  {hero.eventDetails?.map((detail, index) => (
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
                {countdown ? <SimfCountdown section={countdown} /> : null}
              </div>
            </div>
          </section>
        ) : null}

        {authority ? (
          <section className="simf-option-authority">
            <div className="simf-shell simf-option-authority__inner">
              <p>{authority.heading}</p>
              <div>
                {authority.cards
                  .filter((card) => card.visible !== false)
                  .map((card) => (
                    <article
                      className={
                        card.title.includes("Naval") || card.title.includes("البحرية")
                          ? "simf-option-authority__naval"
                          : undefined
                      }
                      key={card.title}
                    >
                      <div>
                        <CmsImage
                          alt={card.title}
                          media={card.media}
                          sizes="190px"
                        />
                      </div>
                      <span>{card.title}</span>
                    </article>
                  ))}
              </div>
            </div>
          </section>
        ) : null}

        {about ? (
          <section className="simf-option-about" id="about">
            <div className="simf-shell simf-option-about__grid">
              <div className="simf-option-about__copy">
                {about.eyebrow ? <p className="simf-eyebrow">{about.eyebrow}</p> : null}
                <h2>{about.heading}</h2>
                {about.body ? <p>{about.body}</p> : null}
                <ConceptButton
                  href={about.ctaHref || localePath(locale, "/legacy")}
                  label={
                    about.ctaLabel ||
                    (ar ? "اكتشف الملتقى وإرثه" : "Discover SIMF and Its Legacy")
                  }
                  style="text"
                  trackingID="simf-option-about"
                />
              </div>
              <div className="simf-option-about__image">
                <CmsImage
                  alt=""
                  media={about.media}
                  sizes="(max-width: 800px) 100vw, 52vw"
                />
              </div>
            </div>
          </section>
        ) : null}

        {legacy ? (
          <section className="simf-option-legacy">
            <div className="simf-shell simf-option-legacy__grid">
              <div className="simf-option-legacy__intro">
                {legacy.eyebrow ? <p className="simf-eyebrow">{legacy.eyebrow}</p> : null}
                <h2>{legacy.heading}</h2>
                <ConceptButton
                  href={localePath(
                    locale,
                    aboutPage ? "/programme" : "/legacy",
                  )}
                  label={
                    aboutPage
                      ? ar
                        ? "استكشف البرنامج"
                        : "Explore the Programme"
                      : ar
                        ? "استكشف إرث الملتقى"
                        : "Explore the SIMF Legacy"
                  }
                  style="text"
                  trackingID="simf-option-legacy"
                />
              </div>
              <div className="simf-option-legacy__metrics">
                {legacy.metrics.map((metric) => (
                  <div key={metric.label}>
                    <strong dir="ltr">{metric.value}</strong>
                    <span>{metric.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        ) : null}

        {indicators ? (
          <section className="simf-option-indicators" id="indicators">
            <div className="simf-shell">
              <div className="simf-option-section-head">
                {indicators.eyebrow ? (
                  <p className="simf-eyebrow">{indicators.eyebrow}</p>
                ) : null}
                <h2>{indicators.heading}</h2>
              </div>
              <SimfMetricSwiper
                autoPlay={aboutPage}
                locale={locale}
                metrics={indicators.metrics}
              />
            </div>
          </section>
        ) : null}

        {experience ? (
          <section className="simf-option-film" id="experience">
            <div className="simf-option-film__frame">
              {aboutPage ? (
                <SimfVideoPlayer
                  autoplay={experience.autoplay !== false}
                  locale={locale}
                  poster={experience.poster}
                  video={experience.video}
                  youtubeURL={experience.youtubeURL}
                />
              ) : (
                <SimfVideoPlayer
                  autoplay={experience.autoplay !== false}
                  locale={locale}
                  poster={experience.poster}
                  video={experience.video}
                  youtubeURL={experience.youtubeURL}
                />
              )}
            </div>
          </section>
        ) : null}

        {audience ? (
          <section className="simf-option-audience">
            <div className="simf-shell">
              <div className="simf-option-section-head">
                {audience.eyebrow ? (
                  <p className="simf-eyebrow">{audience.eyebrow}</p>
                ) : null}
                <h2>{audience.heading}</h2>
                {audience.body ? <p>{audience.body}</p> : null}
              </div>
              <div className="simf-option-audience__list">
                {audience.cards
                  .filter((card) => card.visible !== false)
                  .map((card, index) => {
                    const heading = audienceHeading(card.title);

                    return (
                      <article key={card.title}>
                        {card.media ? (
                          <div className="simf-option-audience__media" aria-hidden="true">
                            <CmsImage
                              alt=""
                              media={card.media}
                              sizes={
                                index === 0
                                  ? "(max-width: 800px) 86vw, 40vw"
                                  : "(max-width: 800px) 86vw, 30vw"
                              }
                            />
                          </div>
                        ) : null}
                        <span>{String(index + 1).padStart(2, "0")}</span>
                        <div>
                          <h3>{heading}</h3>
                          {card.body ? <p>{card.body}</p> : null}
                        </div>
                      </article>
                    );
                  })}
              </div>
              {audience.buttons?.length ? (
                <div className="simf-option-audience__actions">
                  {audience.buttons.map((button) => (
                    <ConceptButton
                      href={button.href}
                      key={`${button.href}-${button.label}`}
                      label={button.label}
                      style={button.style}
                      trackingID={button.trackingID || undefined}
                    />
                  ))}
                </div>
              ) : null}
            </div>
          </section>
        ) : null}

        {speakers ? (
          <section className="simf-option-speakers" id="speakers">
            <div className="simf-shell simf-option-section-head simf-option-section-head--split">
              <div>
                {speakers.eyebrow ? <p className="simf-eyebrow">{speakers.eyebrow}</p> : null}
                <h2>{speakers.heading}</h2>
              </div>
              {speakers.body ? <p>{speakers.body}</p> : null}
            </div>
            <SimfSpeakerRail
              action={
                <ConceptButton
                  href={localePath(locale, "/speakers")}
                  label={ar ? "استعرض جميع المشاركين" : "Explore All Participants"}
                  style="outline"
                  trackingID="simf-option-speakers"
                />
              }
              locale={locale}
              speakers={speakers.cards
                .filter((card) => card.visible !== false)
                .slice(0, 3)}
              wideDesktop
            />
          </section>
        ) : null}

        {partners ? (
          <section className="simf-option-partners" id="partners">
            <div className="simf-shell simf-option-partners__grid">
              <div className="simf-option-partners__intro">
                {partners.eyebrow ? <p className="simf-eyebrow">{partners.eyebrow}</p> : null}
                <h2>{partners.heading}</h2>
              </div>
              {aboutPage ? (
                <SimfPartnerRail
                  locale={locale}
                  partners={partners.cards.filter(
                    (card) => card.visible !== false,
                  )}
                  showNames={false}
                />
              ) : (
                <div className="simf-option-partners__logos">
                  {partners.cards
                    .filter((card) => card.visible !== false)
                    .slice(0, 4)
                    .map((card) => (
                      <article key={card.title}>
                        <div>
                          <CmsImage
                            alt={card.title}
                            media={card.media}
                            sizes="220px"
                          />
                        </div>
                        {card.meta ? (
                          <span className="simf-option-partners__type">
                            {card.meta}
                          </span>
                        ) : null}
                      </article>
                    ))}
                </div>
              )}
            </div>
          </section>
        ) : null}

        {sponsorship ? (
          <section className="simf-option-sponsor">
            <div className="simf-option-sponsor__media">
              <CmsImage
                alt=""
                media={sponsorship.media}
                sizes="100vw"
              />
            </div>
            <div className="simf-option-sponsor__veil" />
            <div className="simf-shell simf-option-sponsor__content">
              <div>
                {sponsorship.eyebrow ? (
                  <p className="simf-eyebrow">{sponsorship.eyebrow}</p>
                ) : null}
                <h2>{sponsorship.heading}</h2>
                {sponsorship.body ? <p>{sponsorship.body}</p> : null}
              </div>
              <div className="simf-option-sponsor__actions">
                {sponsorship.buttons?.map((button) => (
                  <ConceptButton
                    href={button.href}
                    key={`${button.href}-${button.label}`}
                    label={button.label}
                    style={button.style}
                    trackingID={button.trackingID || undefined}
                  />
                ))}
              </div>
            </div>
          </section>
        ) : null}
      </main>
      <SimfStickySponsor
        href={sponsorHref}
        label={header?.sponsorLabel || (ar ? "كن راعيًا" : "Become a Sponsor")}
      />
      <SimfFooter footer={footer} homeHref={homeHref} locale={locale} />
    </div>
  );
}
