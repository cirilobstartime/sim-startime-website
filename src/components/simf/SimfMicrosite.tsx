import {
  ArrowDown,
  ArrowUpRight,
  CalendarBlank,
  CheckCircle,
  MapPin,
} from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import type {
  Button,
  CardGridSection,
  CountdownSection,
  FormSection,
  HeroSection,
  LegacySection,
  Locale,
  MediaFeatureSection,
  MetricRailSection,
  NewsMosaicSection,
  PublicPage,
  PublicUpdate,
  SimfFooterSection,
  SimfHeaderSection,
  TimelineSection,
  VideoFeatureSection,
} from "@/content/types";
import { createFormToken } from "@/lib/formSecurity";
import {
  eventPageSchema,
  standardPageSchema,
} from "@/lib/structuredData";
import { CmsImage, getMediaURL } from "../CmsImage";
import { LeadForm } from "../LeadForm";
import { CmsHeroBackground } from "./CmsHeroBackground";
import { CmsText } from "./CmsText";
import { SimfHeader } from "./SimfHeader";
import { SimfMetricSwiper } from "./SimfMetricSwiper";
import { SimfCountdown } from "./SimfCountdown";
import { SimfFooter } from "./SimfFooter";
import { formatMetricValue } from "./formatMetricValue";
import { SimfSpeakerRail } from "./SimfSpeakerRail";
import { SimfStickySponsor } from "./SimfStickySponsor";

type Props = {
  isSubdomain: boolean;
  locale: Locale;
  nonce?: string;
  page: PublicPage;
  pagePath: string;
  showLanguageSwitcher?: boolean;
  updates?: PublicUpdate[];
};

function section<T extends PublicPage["sections"][number]>(
  page: PublicPage,
  id: string,
): T | undefined {
  return page.sections.find((item) => item.anchorID === id) as T | undefined;
}

function pathFor(locale: Locale, isSubdomain: boolean, destination = "") {
  const root = isSubdomain ? "" : "/simf-microsite";
  const localizedRoot = locale === "ar" ? `/ar${root}` : root;
  return `${localizedRoot}${destination}` || "/";
}

function resolveHref(
  href: string,
  locale: Locale,
  isSubdomain: boolean,
): string {
  if (href === "/sponsor" || href === "/ar/sponsor") {
    return pathFor(locale, isSubdomain, "/sponsor");
  }
  return href;
}

function SimfButton({
  button,
  isSubdomain,
  locale,
}: {
  button: Button;
  isSubdomain: boolean;
  locale: Locale;
}) {
  return (
    <Link
      className={`simf-button simf-button--${button.style || "primary"}`}
      data-track={button.trackingID || undefined}
      href={resolveHref(button.href, locale, isSubdomain)}
      target={button.openInNewTab ? "_blank" : undefined}
    >
      <CmsText value={button.label} />
      <ArrowUpRight aria-hidden />
    </Link>
  );
}

function SectionHead({
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
      {eyebrow ? <p className="simf-eyebrow"><CmsText value={eyebrow} /></p> : null}
      <h2><CmsText value={heading} /></h2>
      {body ? <p><CmsText value={body} /></p> : null}
    </div>
  );
}

function Landing({
  isSubdomain,
  locale,
  page,
  updates = [],
}: Omit<Props, "pagePath">) {
  const ar = locale === "ar";
  const hero = section<HeroSection>(page, "top");
  const authority = section<CardGridSection>(page, "authority");
  const countdown = section<CountdownSection>(page, "countdown");
  const about = section<MediaFeatureSection>(page, "about");
  const legacy = section<LegacySection>(page, "legacy");
  const indicators = section<MetricRailSection>(page, "indicators");
  const programme = section<CardGridSection>(page, "programme");
  const goals = section<MediaFeatureSection>(page, "goals");
  const sessions = section<CardGridSection>(page, "sessions");
  const experience = section<VideoFeatureSection>(page, "experience");
  const sponsorship = section<TimelineSection>(page, "sponsorship");
  const speakers = section<CardGridSection>(page, "speakers");
  const partners = section<CardGridSection>(page, "partners");
  const news = section<NewsMosaicSection>(page, "news");
  const contact = page.sections.find(
    (item) => item.anchorID === "contact" && item.blockType === "callToAction",
  );

  return (
    <>
      {hero ? (
        <section className="simf-hero" id="top">
          <div className="simf-hero__media">
            <CmsHeroBackground
              desktopBackgroundType={hero.desktopBackgroundType}
              desktopBackgroundVideo={hero.desktopBackgroundVideo}
              desktopBackgroundYouTubeURL={hero.desktopBackgroundYouTubeURL}
              locale={locale}
              media={hero.media}
              mobileBackgroundType={hero.mobileBackgroundType}
              mobileBackgroundVideo={hero.mobileBackgroundVideo}
              mobileBackgroundYouTubeURL={hero.mobileBackgroundYouTubeURL}
              mobileMedia={hero.mobileMedia}
              priority
              sizes="100vw"
            />
          </div>
          <div className="simf-hero__veil" />
          <div className="simf-shell simf-hero__content">
            <div className="simf-hero__copy">
              {hero.eyebrow ? <p className="simf-hero__patronage"><CmsText value={hero.eyebrow} /></p> : null}
              <h1><CmsText value={hero.heading} /></h1>
              {hero.body ? <p className="simf-hero__lead"><CmsText value={hero.body} /></p> : null}
              <div className="simf-hero__actions">
                {hero.buttons?.map((button) => (
                  <SimfButton
                    button={button}
                    isSubdomain={isSubdomain}
                    key={`${button.href}-${button.label}`}
                    locale={locale}
                  />
                ))}
              </div>
            </div>
            <div className="simf-hero__details">
              {hero.eventDetails?.map((detail, index) => (
                <div key={detail.label}>
                  {index === 0 ? <CalendarBlank aria-hidden /> : <MapPin aria-hidden />}
                  <span>
                    <small><CmsText value={detail.label} /></small>
                    <strong><CmsText value={detail.value} /></strong>
                  </span>
                </div>
              ))}
            </div>
          </div>
          <a
            aria-label={ar ? "انتقل إلى نبذة الملتقى" : "Explore the forum"}
            className="simf-hero__scroll"
            href="#about"
          >
            <ArrowDown aria-hidden />
          </a>
        </section>
      ) : null}

      {countdown ? <SimfCountdown section={countdown} /> : null}

      {authority ? (
        <section className="simf-authority">
          <div className="simf-shell">
            <p className="simf-authority__title"><CmsText value={authority.heading} /></p>
            <div className="simf-authority__grid">
              {authority.cards.filter((card) => card.visible !== false).map((card) => (
                <article key={card.title}>
                  <div className="simf-authority__logo">
                    <CmsImage alt={card.title} media={card.media} mobileMedia={card.mobileMedia} sizes="220px" />
                  </div>
                  <div>
                    {card.meta ? <span><CmsText value={card.meta} /></span> : null}
                    <h3><CmsText value={card.title} /></h3>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {about ? (
        <section className="simf-about simf-section" id="about">
          <div className="simf-shell simf-split">
            <div className="simf-split__copy">
              <SectionHead body={about.body} eyebrow={about.eyebrow} heading={about.heading} />
              {about.ctaLabel && about.ctaHref ? (
                <SimfButton
                  button={{ href: about.ctaHref, label: about.ctaLabel, style: "text" }}
                  isSubdomain={isSubdomain}
                  locale={locale}
                />
              ) : null}
            </div>
            <div className="simf-about__visual simf-media-frame">
              <CmsImage alt={about.heading} media={about.media} mobileMedia={about.mobileMedia} sizes="(max-width: 800px) 100vw, 50vw" />
            </div>
          </div>
        </section>
      ) : null}

      {legacy ? (
        <section className="simf-legacy simf-section" id="legacy">
          <div className="simf-shell">
            <SectionHead body={legacy.body} eyebrow={legacy.eyebrow} heading={legacy.heading} />
            <div className="simf-legacy__metrics">
              {legacy.metrics.map((metric) => (
                <div key={metric.label}><strong dir="ltr">{formatMetricValue(locale, metric.value)}</strong><span><CmsText value={metric.label} /></span></div>
              ))}
            </div>
            {legacy.editions.some((edition) => edition.visible !== false) ? (
              <div className="simf-legacy__editions">
                {legacy.editions.filter((edition) => edition.visible !== false).map((edition, index, editions) => (
                  <article key={edition.year}>
                    <div className="simf-legacy__milestone" aria-hidden="true">
                      <span>{String(index + 1).padStart(2, "0")} / {String(editions.length).padStart(2, "0")}</span>
                      <strong><CmsText value={edition.year} /></strong>
                    </div>
                    <div className="simf-legacy__copy">
                      <h3><CmsText value={edition.title} /></h3>
                    </div>
                    {edition.media ? (
                      <div className="simf-legacy__image">
                        <CmsImage alt="" media={edition.media} mobileMedia={edition.mobileMedia} sizes="(max-width: 800px) 82vw, 33vw" />
                      </div>
                    ) : null}
                  </article>
                ))}
              </div>
            ) : null}
          </div>
        </section>
      ) : null}

      {indicators ? (
        <section className="simf-indicators simf-section" id="indicators">
          <div className="simf-shell simf-indicators__layout">
            <div className="simf-indicators__intro">
              <SectionHead body={indicators.body} eyebrow={indicators.eyebrow} heading={indicators.heading} />
            </div>
            <SimfMetricSwiper locale={locale} metrics={indicators.metrics} />
          </div>
        </section>
      ) : null}

      {programme ? (
        <section className="simf-programme simf-section" id="programme">
          <div className="simf-shell">
            <SectionHead body={programme.body} eyebrow={programme.eyebrow} heading={programme.heading} />
            <div className="simf-programme__grid">
              {programme.cards.filter((card) => card.visible !== false).map((card, index) => (
                <article className="simf-programme__card" key={card.title}>
                  <div className="simf-programme__content">
                    <span><CmsText value={card.eyebrow || `0${index + 1}`} /></span>
                    <h3><CmsText value={card.title} /></h3>
                    {card.body ? <p><CmsText value={card.body} /></p> : null}
                  </div>
                  <div className="simf-programme__image">
                    <CmsImage alt="" media={card.media} mobileMedia={card.mobileMedia} sizes="(max-width: 800px) 100vw, 46vw" />
                  </div>
                </article>
              ))}
            </div>
            {programme.buttons?.length ? (
              <div className="simf-section-actions">
                {programme.buttons.map((button) => (
                  <SimfButton
                    button={button}
                    isSubdomain={isSubdomain}
                    key={`${button.href}-${button.label}`}
                    locale={locale}
                  />
                ))}
              </div>
            ) : null}
          </div>
        </section>
      ) : null}

      {goals ? (
        <section className="simf-goals simf-section">
          <div className="simf-shell simf-goals__grid">
            <div className="simf-goals__image"><CmsImage alt="" media={goals.media} mobileMedia={goals.mobileMedia} sizes="(max-width: 800px) 100vw, 50vw" /></div>
            <SectionHead body={goals.body} eyebrow={goals.eyebrow} heading={goals.heading} />
          </div>
        </section>
      ) : null}

      {sessions ? (
        <section className="simf-sessions simf-section">
          <div className="simf-shell">
            <SectionHead body={sessions.body} eyebrow={sessions.eyebrow} heading={sessions.heading} />
            <div className="simf-sessions__grid">
              {sessions.cards.filter((card) => card.visible !== false).map((card, index) => (
                <article key={card.title}><span>0{index + 1}</span><h3><CmsText value={card.title} /></h3></article>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {experience ? (
        <section className="simf-video simf-section" id="experience">
          <div className="simf-shell">
            <div className="simf-video__intro">
              <SectionHead
                body={experience.body}
                eyebrow={experience.eyebrow}
                heading={experience.heading}
              />
            </div>
            <div className="simf-video__frame">
              <video
                controls
                playsInline
                poster={getMediaURL(experience.poster)}
                preload="metadata"
              >
                <source src={getMediaURL(experience.video)} type="video/mp4" />
              </video>
            </div>
          </div>
        </section>
      ) : null}

      {sponsorship ? (
        <section className="simf-sponsorship simf-section" id="sponsorship">
          <div className="simf-sponsorship__media">
            <CmsImage
              alt=""
              media={
                sponsorship.steps?.find(
                  (step) => step.visible !== false && step.media,
                )?.media
              }
              mobileMedia={
                sponsorship.steps?.find(
                  (step) => step.visible !== false && step.media,
                )?.mobileMedia
              }
              sizes="100vw"
            />
          </div>
          <div className="simf-sponsorship__shade" />
          <div className="simf-shell simf-sponsorship__content">
            <div>
              <SectionHead body={sponsorship.body} eyebrow={sponsorship.eyebrow} heading={sponsorship.heading} />
              <SimfButton
                button={{
                  href: ar ? "/ar/b2g-partnerships" : "/b2g-partnerships",
                  label: ar ? "استكشف فرص الشراكة B2G" : "Explore B2G Partnership Value",
                  style: "primary",
                  trackingID: "simf-value-sponsor",
                }}
                isSubdomain={isSubdomain}
                locale={locale}
              />
            </div>
            <div className="simf-sponsorship__steps">
              {sponsorship.steps.filter((step) => step.visible !== false).map((step, index) => (
                <article key={step.title}>
                  <span>0{index + 1}</span>
                  <div>
                    {step.label ? <small><CmsText value={step.label} /></small> : null}
                    <h3><CmsText value={step.title} /></h3>
                    {step.body ? <p><CmsText value={step.body} /></p> : null}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {speakers ? (
        <section className="simf-speakers simf-section" id="speakers">
          <div className="simf-shell">
            <SectionHead body={speakers.body} eyebrow={speakers.eyebrow} heading={speakers.heading} />
          </div>
          <SimfSpeakerRail
            action={
              speakers.buttons?.length
                ? speakers.buttons.map((button) => (
                    <SimfButton
                      button={button}
                      isSubdomain={isSubdomain}
                      key={`${button.href}-${button.label}`}
                      locale={locale}
                    />
                  ))
                : undefined
            }
            locale={locale}
            speakers={speakers.cards.filter((card) => card.visible !== false)}
          />
        </section>
      ) : null}

      {partners ? (
        <section className="simf-partners simf-section" id="partners">
          <div className="simf-shell">
            <SectionHead body={partners.body} eyebrow={partners.eyebrow} heading={partners.heading} />
            <div className="simf-partners__grid">
              {partners.cards.filter((card) => card.visible !== false).map((card) => {
                return (
                  <article key={card.title}>
                    <span>{card.meta ? <CmsText value={card.meta} /> : null}</span>
                    <div className="simf-partners__logo">
                      <CmsImage alt={card.title} media={card.media} mobileMedia={card.mobileMedia} sizes="230px" />
                    </div>
                    <h3><CmsText value={card.title} /></h3>
                  </article>
                );
              })}
            </div>
          </div>
        </section>
      ) : null}

      {news ? (
        <section className="simf-news simf-section" id="news">
          <div className="simf-shell">
            <SectionHead eyebrow={news.eyebrow} heading={news.heading} />
            <div className="simf-news__grid">
              {(updates.length
                ? updates.slice(0, 3).map((update) => ({
                    href: `${locale === "ar" ? "/ar" : ""}/updates/${update.slug}`,
                    kicker: `${update.publicationLabel} · ${update.category || ""}`,
                    media: update.featuredImage,
                    mobileMedia: update.mobileFeaturedImage,
                    summary: update.summary,
                    title: update.title,
                  }))
                : news.articles
              ).map((article, index) => (
                <Link className={index === 0 ? "is-featured" : ""} href={resolveHref(article.href || "#", locale, isSubdomain)} key={article.title}>
                  <div className="simf-news__image">
                    <CmsImage alt="" media={article.media} mobileMedia={article.mobileMedia} sizes={index === 0 ? "60vw" : "40vw"} />
                  </div>
                  <div className="simf-news__copy">
                    {article.kicker ? <span><CmsText value={article.kicker} /></span> : null}
                    <h3><CmsText value={article.title} /></h3>
                    {article.summary ? <p><CmsText value={article.summary} /></p> : null}
                    <span className="simf-news__read">
                      {ar ? "اقرأ التحديث" : "Read update"}
                      <ArrowUpRight aria-hidden />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
            {news.ctaHref && news.ctaLabel ? (
              <div className="simf-news__archive-link">
                <Link
                  className="simf-button simf-button--outline"
                  href={resolveHref(news.ctaHref, locale, isSubdomain)}
                >
                  {news.ctaLabel}
                  <ArrowUpRight aria-hidden />
                </Link>
              </div>
            ) : null}
          </div>
        </section>
      ) : null}

      {contact?.blockType === "callToAction" ? (
        <section className="simf-final-cta simf-section" id="contact">
          <div className="simf-final-cta__media">
            <CmsImage alt="" media={contact.media} mobileMedia={contact.mobileMedia} sizes="100vw" />
          </div>
          <div className="simf-final-cta__shade" />
          <div className="simf-shell simf-final-cta__content">
            <SectionHead body={contact.body} eyebrow={contact.eyebrow} heading={contact.heading} />
            <div className="simf-final-cta__actions">
              {contact.buttons?.map((button) => (
                <SimfButton button={button} isSubdomain={isSubdomain} key={button.label} locale={locale} />
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
}

function SponsorPage({
  locale,
  page,
  pagePath,
}: Props) {
  const ar = locale === "ar";
  const hero = section<HeroSection>(page, "sponsor-intro");
  const formSection = section<FormSection>(page, "sponsor-form");
  const reassurance = section<CardGridSection>(page, "sponsor-reassurance");
  const form =
    formSection && typeof formSection.form === "object" ? formSection.form : null;

  return (
    <>
      {hero ? (
        <section className="simf-inner-hero simf-sponsor-hero">
          <div className="simf-inner-hero__media">
            <CmsHeroBackground
              desktopBackgroundType={hero.desktopBackgroundType}
              desktopBackgroundVideo={hero.desktopBackgroundVideo}
              desktopBackgroundYouTubeURL={hero.desktopBackgroundYouTubeURL}
              locale={locale}
              media={hero.media}
              mobileBackgroundType={hero.mobileBackgroundType}
              mobileBackgroundVideo={hero.mobileBackgroundVideo}
              mobileBackgroundYouTubeURL={hero.mobileBackgroundYouTubeURL}
              mobileMedia={hero.mobileMedia}
              priority
              sizes="100vw"
            />
          </div>
          <div className="simf-inner-hero__shade" />
          <div className="simf-shell simf-inner-hero__content">
            {hero.eyebrow ? <p className="simf-eyebrow"><CmsText value={hero.eyebrow} /></p> : null}
            <h1><CmsText value={hero.heading} /></h1>
            {hero.body ? <p><CmsText value={hero.body} /></p> : null}
            {hero.eventDetails?.length ? (
              <div className="simf-inner-hero__details">
                {hero.eventDetails.map((detail, index) => (
                  <div key={detail.label}>
                    {index === 0 ? <CalendarBlank aria-hidden /> : <MapPin aria-hidden />}
                    <span>
                      <small><CmsText value={detail.label} /></small>
                      <strong><CmsText value={detail.value} /></strong>
                    </span>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        </section>
      ) : null}
      {reassurance ? (
        <section className="simf-reassurance simf-section">
          <div className="simf-shell">
            <SectionHead
              eyebrow={reassurance.eyebrow}
              heading={reassurance.heading}
            />
            <div className="simf-reassurance__grid">
              {reassurance.cards.filter((card) => card.visible !== false).map((card, index) => (
                <article key={card.title}>
                  <span>0{index + 1}</span>
                  <h3><CmsText value={card.title} /></h3>
                  {card.body ? <p><CmsText value={card.body} /></p> : null}
                </article>
              ))}
            </div>
          </div>
        </section>
      ) : null}
      {formSection && form ? (
        <section className="simf-form-section simf-section" id="sponsor-form">
          <div className="simf-shell simf-form-section__grid">
            <div className="simf-form-section__intro">
              <SectionHead body={formSection.body} eyebrow={formSection.eyebrow} heading={formSection.heading} />
              <div className="simf-form-section__promise">
                {[ar ? "مراجعة مباشرة من فريق الشراكات" : "Direct partnership-team review", ar ? "التعامل بسرية مع معلومات الطلب" : "Confidential handling of your inquiry", ar ? "مسار شراكة مصمم وفق أهدافكم" : "A route tailored to your objectives"].map((item) => (
                  <p key={item}><CheckCircle aria-hidden weight="fill" />{item}</p>
                ))}
              </div>
            </div>
            <div className="simf-form-section__form">
              <LeadForm
                ctaID="simf-sponsor-registration"
                form={form}
                locale={locale}
                pagePath={pagePath}
                privacyNote={formSection.privacyNote}
                sectionID={formSection.anchorID}
                successHeading={formSection.successHeading}
                successMessage={formSection.successMessage}
                token={createFormToken(form.formKey)}
              />
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
}

export function SimfMicrosite({
  isSubdomain,
  locale,
  nonce,
  page,
  pagePath,
  showLanguageSwitcher = true,
  updates = [],
}: Props) {
  const ar = locale === "ar";
  const isSponsor = page.pageType === "simf-microsite-sponsor";
  const header = section<SimfHeaderSection>(page, "header");
  const homeHref = pathFor(locale, isSubdomain);
  const sponsorHref =
    header?.sponsorHref || pathFor(locale, isSubdomain, "/sponsor");
  const switchHref = pathFor(ar ? "en" : "ar", isSubdomain, isSponsor ? "/sponsor" : "");
  const internalNav = [
    { href: homeHref, label: ar ? "الرئيسية" : "Home" },
    { href: pathFor(locale, isSubdomain, "/programme"), label: ar ? "البرنامج" : "Programme" },
    { href: pathFor(locale, isSubdomain, "/speakers"), label: ar ? "المتحدثون" : "Speakers" },
    { href: pathFor(locale, isSubdomain, "/partners"), label: ar ? "الرعاة والشركاء" : "Sponsors & Partners" },
    { href: pathFor(locale, isSubdomain, "/b2g"), label: ar ? "فرص B2G" : "B2G Opportunities" },
    { href: pathFor(locale, isSubdomain, "/legacy"), label: ar ? "نسخ سابقة" : "Legacy" },
    { href: pathFor(locale, isSubdomain, "/updates"), label: ar ? "الأخبار والمركز الإعلامي" : "News & Media Center" },
    { href: pathFor(locale, isSubdomain, "/contact"), label: ar ? "تواصل معنا" : "Contact" },
  ];
  const nav = isSponsor
    ? internalNav
    : header?.links?.length
      ? header.links.filter(
          (item) => !item.href.endsWith("/about") && item.href !== "/about",
        )
      : internalNav;
  const footer = section<SimfFooterSection>(page, "footer");
  const structuredData =
    page.pageType === "simf-microsite-home"
      ? eventPageSchema(locale, page)
      : standardPageSchema(locale, page, pagePath);

  return (
    <div className="simf-site" data-page={isSponsor ? "sponsor" : "landing"} dir={ar ? "rtl" : "ltr"} lang={locale}>
      <SimfHeader
        homeHref={homeHref}
        locale={locale}
        logo={header?.logo}
        logoAlt={header?.logoAlt}
        mobileLogo={header?.mobileLogo}
        menuCloseLabel={header?.menuCloseLabel}
        menuOpenLabel={header?.menuOpenLabel}
        nav={nav}
        navigationLabel={header?.navigationLabel}
        sponsorHref={sponsorHref}
        sponsorLabel={header?.sponsorLabel}
        sponsorVisible={header?.sponsorVisible !== false}
        showLanguageSwitcher={showLanguageSwitcher}
        switchHref={switchHref}
        switchLabel={header?.languageSwitchLabel}
      />
      <main id="main-content">
        <script
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData).replaceAll("<", "\\u003c"),
          }}
          nonce={nonce}
          suppressHydrationWarning
          type="application/ld+json"
        />
        {page.seo?.structuredData ? (
          <script
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(page.seo.structuredData).replaceAll("<", "\\u003c"),
            }}
            nonce={nonce}
            suppressHydrationWarning
            type="application/ld+json"
          />
        ) : null}
        {isSponsor ? (
          <SponsorPage
            isSubdomain={isSubdomain}
            locale={locale}
            page={page}
            pagePath={pagePath}
          />
        ) : (
          <Landing
            isSubdomain={isSubdomain}
            locale={locale}
            page={page}
            updates={updates}
          />
        )}
      </main>
      {!isSponsor && header?.sponsorVisible !== false ? (
        <SimfStickySponsor
          href={sponsorHref}
          label={header?.sponsorLabel || (ar ? "كن راعيًا" : "Become a Sponsor")}
        />
      ) : null}
      <SimfFooter footer={footer} homeHref={homeHref} locale={locale} />
    </div>
  );
}
