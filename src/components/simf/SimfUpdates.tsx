import { ArrowLeft, ArrowRight, ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { RichText } from "@payloadcms/richtext-lexical/react";
import Link from "next/link";
import type {
  CallToActionSection,
  HeroSection,
  Locale,
  PublicPage,
  PublicUpdate,
  RichTextValue,
  SimfFooterSection,
  SimfHeaderSection,
  UpdateIndexSection,
} from "@/content/types";
import {
  standardPageSchema,
  updateArticleSchema,
} from "@/lib/structuredData";
import { CmsImage } from "../CmsImage";
import { CmsHeroBackground } from "./CmsHeroBackground";
import { CmsText } from "./CmsText";
import { SimfFooter } from "./SimfFooter";
import { SimfHeader } from "./SimfHeader";
import { SimfStickySponsor } from "./SimfStickySponsor";

type BaseProps = {
  locale: Locale;
  nonce?: string;
  page: PublicPage;
  showLanguageSwitcher?: boolean;
  updates: PublicUpdate[];
};

function section<T extends PublicPage["sections"][number]>(
  page: PublicPage,
  id: string,
) {
  return page.sections.find((item) => item.anchorID === id) as T | undefined;
}

function routes(locale: Locale) {
  const ar = locale === "ar";
  const root = ar ? "/ar" : "";
  return {
    archive: `${root}/updates`,
    home: root || "/",
    sponsor: `${root}/sponsor`,
  };
}

function siteNav(locale: Locale) {
  const ar = locale === "ar";
  const root = ar ? "/ar" : "";
  return [
    { href: `${root}/#legacy`, label: ar ? "الإرث" : "Legacy" },
    { href: `${root}/#programme`, label: ar ? "المحاور" : "Programme" },
    { href: `${root}/#speakers`, label: ar ? "المتحدثون" : "Speakers" },
    { href: `${root}/#partners`, label: ar ? "الشركاء" : "Partners" },
  ];
}

function JsonLd({
  nonce,
  value,
}: {
  nonce?: string;
  value: Record<string, unknown>;
}) {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(value).replaceAll("<", "\\u003c"),
      }}
      nonce={nonce}
      suppressHydrationWarning
      type="application/ld+json"
    />
  );
}

function ArticleRichText({ value }: { value: string | RichTextValue }) {
  if (typeof value === "string") return <p><CmsText value={value} /></p>;
  return <RichText className="simf-update-richtext" data={value} />;
}

function SponsorCTA({
  cta,
}: {
  cta?: CallToActionSection;
}) {
  if (!cta) return null;
  return (
    <section className="simf-update-cta">
      <div className="simf-update-cta__media">
        <CmsImage alt="" media={cta.media} mobileMedia={cta.mobileMedia} sizes="100vw" />
      </div>
      <div className="simf-update-cta__veil" />
      <div className="simf-shell simf-update-cta__content">
        <div>
          {cta.eyebrow ? <p className="simf-eyebrow"><CmsText value={cta.eyebrow} /></p> : null}
          <h2><CmsText value={cta.heading} /></h2>
          {cta.body ? <p><CmsText value={cta.body} /></p> : null}
        </div>
        {cta.buttons?.map((button) => (
          <Link
            className="simf-button"
            data-track={button.trackingID || undefined}
            href={button.href}
            key={`${button.label}-${button.href}`}
          >
            <CmsText value={button.label} />
            <ArrowUpRight aria-hidden />
          </Link>
        ))}
      </div>
    </section>
  );
}

function UpdateCard({
  locale,
  readLabel,
  update,
}: {
  locale: Locale;
  readLabel: string;
  update: PublicUpdate;
}) {
  const href = `${routes(locale).archive}/${update.slug}`;
  return (
    <Link className="simf-update-card" href={href}>
      <div className="simf-update-card__image">
        <CmsImage alt="" media={update.featuredImage} mobileMedia={update.mobileFeaturedImage} sizes="(max-width: 760px) 100vw, 33vw" />
      </div>
      <div className="simf-update-card__copy">
        <p className="simf-update-card__meta">
          <CmsText value={update.publicationLabel} />
          {update.category ? <span><CmsText value={update.category} /></span> : null}
        </p>
        <h2><CmsText value={update.title} /></h2>
        <p><CmsText value={update.summary} /></p>
        <span className="simf-update-card__link">
          <CmsText value={readLabel} />
          <ArrowUpRight aria-hidden />
        </span>
      </div>
    </Link>
  );
}

export function SimfUpdatesArchive({
  locale,
  nonce,
  page,
  showLanguageSwitcher = true,
  updates,
}: BaseProps) {
  const ar = locale === "ar";
  const route = routes(locale);
  const hero = section<HeroSection>(page, "updates-top");
  const cta = section<CallToActionSection>(page, "updates-cta");
  const footer = section<SimfFooterSection>(page, "footer");
  const header = section<SimfHeaderSection>(page, "header");
  const labels = section<UpdateIndexSection>(page, "updates-index");
  const lead = updates.find((item) => item.featured) || updates[0];
  const remaining = updates.filter((item) => item.slug !== lead?.slug);
  const switchHref = ar ? "/updates" : "/ar/updates";
  const homeHref = header?.links?.[0]?.href || route.home;

  return (
    <div className="simf-site simf-updates-site" dir={ar ? "rtl" : "ltr"} lang={locale}>
      <SimfHeader
        homeHref={homeHref}
        locale={locale}
        logo={header?.logo}
        logoAlt={header?.logoAlt}
        mobileLogo={header?.mobileLogo}
        menuCloseLabel={header?.menuCloseLabel}
        menuOpenLabel={header?.menuOpenLabel}
        nav={header?.links || siteNav(locale)}
        navigationLabel={header?.navigationLabel}
        sponsorHref={header?.sponsorHref || route.sponsor}
        sponsorLabel={header?.sponsorLabel}
        sponsorVisible={header?.sponsorVisible !== false}
        showLanguageSwitcher={showLanguageSwitcher}
        switchHref={switchHref}
        switchLabel={header?.languageSwitchLabel}
      />
      <main id="main-content">
        <JsonLd nonce={nonce} value={standardPageSchema(locale, page, route.archive)} />
        {page.seo?.structuredData ? (
          <JsonLd nonce={nonce} value={page.seo.structuredData} />
        ) : null}
        {hero ? (
          <section className="simf-updates-hero">
            <div className="simf-updates-hero__media">
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
                sizes="(max-width: 760px) 100vw, 55vw"
              />
            </div>
            <div className="simf-updates-hero__veil" />
            <div className="simf-shell simf-updates-hero__copy">
              {hero.eyebrow ? <p className="simf-eyebrow"><CmsText value={hero.eyebrow} /></p> : null}
              <h1><CmsText value={hero.heading} /></h1>
              {hero.body ? <p><CmsText value={hero.body} /></p> : null}
            </div>
          </section>
        ) : null}
        <section className="simf-updates-index">
          <div className="simf-shell">
            {lead ? (
              <Link className="simf-update-feature" href={`${route.archive}/${lead.slug}`}>
                <div className="simf-update-feature__image">
                  <CmsImage alt="" media={lead.featuredImage} mobileMedia={lead.mobileFeaturedImage} sizes="(max-width: 760px) 100vw, 50vw" />
                </div>
                <div className="simf-update-feature__copy">
                  <p className="simf-update-card__meta">
                    <CmsText value={lead.publicationLabel} />
                    {lead.category ? <span><CmsText value={lead.category} /></span> : null}
                  </p>
                  <h2><CmsText value={lead.title} /></h2>
                  <p><CmsText value={lead.summary} /></p>
                  <span className="simf-button simf-update-feature__button">
                    <CmsText value={labels?.readLabel || (ar ? "اقرأ التحديث" : "Read update")} />
                    <ArrowUpRight aria-hidden />
                  </span>
                </div>
              </Link>
            ) : null}
            <div className="simf-updates-grid">
              {remaining.map((update) => (
                <UpdateCard
                  key={update.slug}
                  locale={locale}
                  readLabel={labels?.readLabel || (ar ? "اقرأ التحديث" : "Read update")}
                  update={update}
                />
              ))}
            </div>
          </div>
        </section>
        <SponsorCTA cta={cta} />
      </main>
      {header?.sponsorVisible !== false ? (
        <SimfStickySponsor
          href={header?.sponsorHref || route.sponsor}
          label={header?.sponsorLabel || (ar ? "كن راعيًا" : "Become a Sponsor")}
        />
      ) : null}
      <SimfFooter footer={footer} homeHref={homeHref} locale={locale} />
    </div>
  );
}

export function SimfUpdateArticle({
  locale,
  nonce,
  page,
  showLanguageSwitcher = true,
  update,
  updates,
}: BaseProps & { update: PublicUpdate }) {
  const ar = locale === "ar";
  const route = routes(locale);
  const cta = section<CallToActionSection>(page, "updates-cta");
  const footer = section<SimfFooterSection>(page, "footer");
  const header = section<SimfHeaderSection>(page, "header");
  const labels = section<UpdateIndexSection>(page, "updates-index");
  const pagePath = `${route.archive}/${update.slug}`;
  const switchHref = `${ar ? "/updates" : "/ar/updates"}/${update.slug}`;
  const related = updates
    .filter((item) => item.slug !== update.slug)
    .slice(0, 3);
  const BackIcon = ar ? ArrowRight : ArrowLeft;
  const homeHref = header?.links?.[0]?.href || route.home;

  return (
    <div className="simf-site simf-updates-site" dir={ar ? "rtl" : "ltr"} lang={locale}>
      <SimfHeader
        homeHref={homeHref}
        locale={locale}
        logo={header?.logo}
        logoAlt={header?.logoAlt}
        mobileLogo={header?.mobileLogo}
        menuCloseLabel={header?.menuCloseLabel}
        menuOpenLabel={header?.menuOpenLabel}
        nav={header?.links || siteNav(locale)}
        navigationLabel={header?.navigationLabel}
        sponsorHref={header?.sponsorHref || route.sponsor}
        sponsorLabel={header?.sponsorLabel}
        sponsorVisible={header?.sponsorVisible !== false}
        showLanguageSwitcher={showLanguageSwitcher}
        switchHref={switchHref}
        switchLabel={header?.languageSwitchLabel}
      />
      <main id="main-content">
        <JsonLd nonce={nonce} value={updateArticleSchema(locale, update, pagePath)} />
        <article className="simf-update-article">
          <header className="simf-update-article__header">
            <div className="simf-shell">
              <Link className="simf-update-article__back" href={route.archive}>
                <BackIcon aria-hidden />
                <CmsText value={labels?.backLabel || (ar ? "العودة إلى التحديثات" : "Back to Updates")} />
              </Link>
              <p className="simf-update-card__meta">
                <CmsText value={update.publicationLabel} />
                {update.category ? <span><CmsText value={update.category} /></span> : null}
              </p>
              <h1><CmsText value={update.title} /></h1>
              {update.intro ? <p className="simf-update-article__dek"><CmsText value={update.intro} /></p> : null}
            </div>
          </header>
          <figure className="simf-shell simf-update-article__hero">
            <div>
              <CmsImage alt="" media={update.featuredImage} mobileMedia={update.mobileFeaturedImage} priority sizes="100vw" />
            </div>
            {update.featuredImageCaption ? (
              <figcaption><CmsText value={update.featuredImageCaption} /></figcaption>
            ) : null}
          </figure>
          <div className="simf-shell simf-update-article__body">
            {update.content.map((item, index) =>
              item.highlight ? (
                <aside className="simf-update-article__highlight" key={`${item.heading}-${index}`}>
                  {item.heading ? <h2><CmsText value={item.heading} /></h2> : null}
                  {item.richBody || item.body ? (
                    <ArticleRichText value={item.richBody || item.body || ""} />
                  ) : null}
                </aside>
              ) : (
                <section className="simf-update-article__section" key={`${item.heading}-${index}`}>
                  {item.heading ? <h2><CmsText value={item.heading} /></h2> : null}
                  {item.richBody || item.body ? (
                    <ArticleRichText value={item.richBody || item.body || ""} />
                  ) : null}
                  {item.media ? (
                    <figure>
                      <div>
                        <CmsImage
                          alt={item.mediaAlt || ""}
                          media={item.media}
                          mobileMedia={item.mobileMedia}
                          sizes="(max-width: 760px) 100vw, 760px"
                        />
                      </div>
                      {item.mediaCaption ? <figcaption><CmsText value={item.mediaCaption} /></figcaption> : null}
                    </figure>
                  ) : null}
                </section>
              ),
            )}
          </div>
        </article>
        {related.length ? (
          <section className="simf-related-updates">
            <div className="simf-shell">
              <div className="simf-related-updates__head">
                <h2><CmsText value={labels?.relatedHeading || (ar ? "تحديثات ذات صلة" : "Related Updates")} /></h2>
                <Link href={route.archive}>
                  <CmsText value={labels?.viewAllLabel || (ar ? "عرض جميع التحديثات" : "View all updates")} />
                  <ArrowUpRight aria-hidden />
                </Link>
              </div>
              <div className="simf-updates-grid">
                {related.map((item) => (
                  <UpdateCard
                    key={item.slug}
                    locale={locale}
                    readLabel={labels?.readLabel || (ar ? "اقرأ التحديث" : "Read update")}
                    update={item}
                  />
                ))}
              </div>
            </div>
          </section>
        ) : null}
        <SponsorCTA cta={cta} />
      </main>
      {header?.sponsorVisible !== false ? (
        <SimfStickySponsor
          href={header?.sponsorHref || route.sponsor}
          label={header?.sponsorLabel || (ar ? "كن راعيًا" : "Become a Sponsor")}
        />
      ) : null}
      <SimfFooter footer={footer} homeHref={homeHref} locale={locale} />
    </div>
  );
}
