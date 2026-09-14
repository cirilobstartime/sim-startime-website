import configPromise from "@payload-config";
import { unstable_cache } from "next/cache";
import { getPayload } from "payload";
import { cache } from "react";
import { getSimfMicrositePage } from "./simfMicrositeDefaults";
import {
  getSimfContentPage,
  type SimfContentPageKey,
} from "./simfContentPagesDefaults";
import { getSimfUpdates, getSimfUpdatesPage } from "./simfUpdatesDefaults";
import type {
  Locale,
  MarketingSettings,
  MediaValue,
  PageSection,
  PublicNavigationManifest,
  PublicPage,
  PublicUpdate,
  SiteSettings,
} from "./types";
import { PUBLIC_CACHE_TAGS } from "@/payload/hooks/revalidatePublicContent";

const PUBLIC_CONTENT_REVALIDATE_SECONDS = 60 * 60;

function normalizeSections(value: unknown): PageSection[] {
  if (!Array.isArray(value)) return [];
  return [...value]
    .filter((item): item is PageSection =>
      Boolean(
        item &&
        typeof item === "object" &&
        "blockType" in item &&
        (item as { visible?: boolean }).visible !== false,
      ),
    )
    .sort((a, b) => Number(a.displayOrder || 0) - Number(b.displayOrder || 0));
}

async function fetchPage(
  locale: Locale,
  route: string,
): Promise<PublicPage | null> {
  const contentKey = route.startsWith("simf-microsite/")
    ? (route.replace("simf-microsite/", "") as SimfContentPageKey)
    : undefined;
  const contentKeys: SimfContentPageKey[] = [
    "contact",
    "legacy",
    "programme",
    "speakers",
    "partners",
    "government-b2g",
  ];
  const isPartnersBeta = route === "simf-microsite/partners-beta";
  const isPartnersPage = route === "simf-microsite/partners";
  const isContentPage = Boolean(contentKey && contentKeys.includes(contentKey));
  const pageType =
    route === "simf-microsite/sponsor"
      ? "simf-microsite-sponsor"
      : route === "simf-microsite/new-homepage"
        ? "simf-microsite-home-review"
        : route === "simf-microsite/about"
          ? "simf-microsite-about"
          : route === "simf-microsite/updates"
            ? "simf-microsite-updates"
            : isPartnersBeta
              ? "simf-microsite-partners"
              : isContentPage
                ? `simf-microsite-${contentKey}`
                : "simf-microsite-home";
  try {
    const payload = await getPayload({ config: configPromise });
    const result = await payload.find({
      collection: "pages",
      depth: 2,
      draft: false,
      fallbackLocale: false,
      limit: 1,
      locale,
      overrideAccess: true,
      where: {
        and: [
          isPartnersPage
            ? {
                or: [
                  { slug: { equals: route } },
                  { slug: { equals: "simf-microsite/sponsorspartners" } },
                ],
              }
            : { slug: { equals: route } },
          { visible: { equals: true } },
          { _status: { equals: "published" } },
        ],
      },
    });
    const page = result.docs[0];
    if (!page?.title) return null;
    const now = Date.now();
    if (
      (page.publishFrom && new Date(page.publishFrom).getTime() > now) ||
      (page.publishUntil && new Date(page.publishUntil).getTime() <= now)
    ) {
      return null;
    }
    const resolvedPage: PublicPage = {
      pageType: String(page.pageType || pageType),
      sections: normalizeSections(page.sections),
      seo: page.seo as PublicPage["seo"],
      slug: String(page.slug || ""),
      summary: page.summary,
      title: page.title,
    };
    return resolvedPage;
  } catch {
    return pageType === "simf-microsite-updates"
      ? getSimfUpdatesPage(locale)
      : pageType === "simf-microsite-sponsor"
        ? {
            ...getSimfContentPage(locale, "sponsors"),
            pageType: "simf-microsite-sponsor",
            slug: "simf-microsite/sponsor",
          }
        : isContentPage && contentKey
          ? getSimfContentPage(locale, contentKey)
          : pageType === "simf-microsite-home-review"
            ? getSimfMicrositePage(locale, "simf-microsite-home-review")
            : pageType === "simf-microsite-about"
              ? getSimfMicrositePage(locale, "simf-microsite-about")
              : getSimfMicrositePage(
                  locale,
                  pageType === "simf-microsite-sponsor"
                    ? "simf-microsite-sponsor"
                    : "simf-microsite-home",
                );
  }
}

function navigationPath(
  locale: Locale,
  pageType: string,
  slugValue: unknown,
): string | null {
  const prefix = locale === "ar" ? "/ar" : "";
  if (pageType === "simf-microsite-home") return prefix || "/";
  if (pageType === "simf-microsite-sponsor") return `${prefix}/sponsor`;
  if (pageType === "simf-microsite-government-b2g") return `${prefix}/b2g`;
  if (pageType === "simf-microsite-updates") return `${prefix}/updates`;
  const slug = typeof slugValue === "string" ? slugValue.trim() : "";
  const segment = slug
    .replace(/^simf-microsite\//, "")
    .replace(/^\/+|\/+$/g, "");
  if (pageType === "simf-microsite-partners" && segment !== "partners-beta") {
    return `${prefix}/partners`;
  }
  return segment && !segment.includes("/") ? `${prefix}/${segment}` : null;
}

async function fetchNavigationManifest(
  locale: Locale,
): Promise<PublicNavigationManifest> {
  try {
    const payload = await getPayload({ config: configPromise });
    const result = await payload.find({
      collection: "pages",
      depth: 0,
      draft: false,
      fallbackLocale: false,
      limit: 100,
      locale,
      overrideAccess: true,
    });
    const now = Date.now();
    const knownPaths: string[] = [];
    const activePaths: string[] = [];
    const links: Array<{ href: string; label: string }> = [];
    for (const page of result.docs) {
      const href = navigationPath(
        locale,
        String(page.pageType || ""),
        page.slug,
      );
      if (!href) continue;
      knownPaths.push(href);
      const active =
        page.visible !== false &&
        page._status === "published" &&
        (!page.publishFrom || new Date(page.publishFrom).getTime() <= now) &&
        (!page.publishUntil || new Date(page.publishUntil).getTime() > now);
      if (!active) continue;
      activePaths.push(href);
      if (page.showInNavigation) {
        links.push({
          href,
          label: page.navigationLabel?.trim() || page.title,
        });
      }
    }
    return { activePaths, knownPaths, links };
  } catch {
    return { activePaths: [], knownPaths: [], links: [] };
  }
}

function plainText(value: unknown): string {
  if (!value) return "";
  if (typeof value === "string") return value.trim();
  if (Array.isArray(value))
    return value.map(plainText).filter(Boolean).join(" ");
  if (typeof value !== "object") return "";

  const node = value as Record<string, unknown>;
  if (typeof node.text === "string") return node.text.trim();
  return plainText(node.children);
}

function truncateAtWord(value: string, maxLength: number): string {
  const normalized = value.replace(/\s+/g, " ").trim();
  if (normalized.length <= maxLength) return normalized;
  const shortened = normalized.slice(0, maxLength + 1);
  const lastSpace = shortened.lastIndexOf(" ");
  return `${shortened.slice(0, lastSpace > maxLength * 0.7 ? lastSpace : maxLength).trim()}…`;
}

function articleOpening(update: PublicUpdate): string {
  for (const item of Array.isArray(update.content) ? update.content : []) {
    const body = plainText(item.richBody || item.body);
    if (body) return body;
  }
  return "";
}

function automaticPublicationLabel(
  locale: Locale,
  publishedAt: string,
): string {
  const date = new Intl.DateTimeFormat(
    locale === "ar" ? "ar-SA-u-nu-latn" : "en-GB",
    {
      day: "numeric",
      month: "long",
      timeZone: "UTC",
      year: "numeric",
    },
  ).format(new Date(publishedAt));
  const publisher =
    locale === "ar"
      ? "الملتقى البحري السعودي الدولي"
      : "Saudi International Maritime Forum";
  return `${publisher} | ${date}`;
}

function normalizeUpdate(value: unknown, locale: Locale): PublicUpdate | null {
  if (!value || typeof value !== "object") return null;
  const update = value as PublicUpdate & {
    createdAt?: string | null;
    updatedAt?: string | null;
    visible?: boolean | null;
  };
  const publishedAt =
    update.publishedAt || update.createdAt || update.updatedAt;
  if (
    update.visible === false ||
    !update.title ||
    !update.slug ||
    !publishedAt
  ) {
    return null;
  }
  const content = Array.isArray(update.content)
    ? update.content.filter((item) => item.visible !== false)
    : [];
  const opening = articleOpening({ ...update, content });
  const summary =
    update.summary?.trim() ||
    truncateAtWord(opening, 220) ||
    update.intro?.trim() ||
    update.title;
  const intro =
    update.intro?.trim() ||
    truncateAtWord(opening, 360) ||
    update.summary?.trim() ||
    null;
  return {
    ...update,
    content,
    intro,
    publicationLabel:
      update.publicationLabel?.trim() ||
      automaticPublicationLabel(locale, publishedAt),
    publishedAt,
    summary,
  };
}

async function fetchUpdates(locale: Locale): Promise<PublicUpdate[]> {
  try {
    const payload = await getPayload({ config: configPromise });
    const result = await payload.find({
      collection: "updates",
      depth: 2,
      draft: false,
      fallbackLocale: false,
      limit: 50,
      locale,
      overrideAccess: true,
      sort: "-publishedAt",
      where: {
        and: [
          { visible: { equals: true } },
          { _status: { equals: "published" } },
        ],
      },
    });
    return result.docs
      .map((item) => normalizeUpdate(item, locale))
      .filter((item): item is PublicUpdate => Boolean(item))
      .sort(
        (a, b) =>
          new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
      );
  } catch {
    return getSimfUpdates(locale);
  }
}

async function fetchUpdate(
  locale: Locale,
  slug: string,
): Promise<PublicUpdate | null> {
  try {
    const payload = await getPayload({ config: configPromise });
    const result = await payload.find({
      collection: "updates",
      depth: 2,
      draft: false,
      fallbackLocale: false,
      limit: 1,
      locale,
      overrideAccess: true,
      where: {
        and: [
          { slug: { equals: slug } },
          { visible: { equals: true } },
          { _status: { equals: "published" } },
        ],
      },
    });
    return normalizeUpdate(result.docs[0], locale);
  } catch {
    return getSimfUpdates(locale).find((item) => item.slug === slug) || null;
  }
}

function marketingFallback(locale: Locale): MarketingSettings {
  const ar = locale === "ar";
  return {
    acceptLabel: ar ? "السماح" : "Allow analytics",
    acceptedCampaignParameters:
      "utm_id,utm_source,utm_medium,utm_campaign,utm_term,utm_content,utm_source_platform,gclid,gbraid,wbraid,fbclid,msclkid,ttclid,li_fat_id,twclid",
    attributionCookieDays: 90,
    attributionCookieDomain: ".startime.sa",
    bingSiteVerification: "",
    cookieNotice: ar
      ? "نستخدم ملفات تعريف الارتباط الضرورية، وبموافقتك نستخدم التحليلات لتحسين تجربتك وقياس أداء الموقع."
      : "We use essential cookies and, with your permission, analytics to improve your experience and measure website performance.",
    defaultConsentDenied: true,
    enableAnalytics: false,
    ga4MeasurementID: "",
    googleSiteVerification: "",
    googleTagManagerID: "",
    metaDomainVerification: "",
    privacyHref: ar ? "/ar/privacy-policy" : "/privacy-policy",
    rejectLabel: ar ? "رفض التحليلات" : "Reject analytics",
    settingsLabel: ar ? "سياسة الخصوصية" : "Privacy policy",
  };
}

async function fetchMarketing(locale: Locale): Promise<MarketingSettings> {
  const fallback = marketingFallback(locale);
  try {
    const payload = await getPayload({ config: configPromise });
    const settings = await payload.findGlobal({
      slug: "marketing-settings",
      depth: 0,
      draft: false,
      fallbackLocale: false,
      locale,
      overrideAccess: true,
    });
    if (settings._status !== "published") return fallback;
    return {
      acceptLabel: settings.acceptLabel || fallback.acceptLabel,
      acceptedCampaignParameters:
        settings.acceptedCampaignParameters ||
        fallback.acceptedCampaignParameters,
      attributionCookieDays: Number(
        settings.attributionCookieDays || fallback.attributionCookieDays,
      ),
      attributionCookieDomain:
        settings.attributionCookieDomain || fallback.attributionCookieDomain,
      bingSiteVerification: settings.bingSiteVerification || "",
      cookieNotice: settings.cookieNotice || fallback.cookieNotice,
      defaultConsentDenied: settings.defaultConsentDenied !== false,
      enableAnalytics: Boolean(settings.enableAnalytics),
      ga4MeasurementID: settings.ga4MeasurementID || "",
      googleSiteVerification: settings.googleSiteVerification || "",
      googleTagManagerID: settings.googleTagManagerID || "",
      metaDomainVerification: settings.metaDomainVerification || "",
      privacyHref: settings.privacyHref || fallback.privacyHref,
      rejectLabel: settings.rejectLabel || fallback.rejectLabel,
      settingsLabel: settings.settingsLabel || fallback.settingsLabel,
    };
  } catch {
    return fallback;
  }
}

async function fetchSiteSettings(locale: Locale = "en"): Promise<SiteSettings> {
  try {
    const payload = await getPayload({ config: configPromise });
    const settings = await payload.findGlobal({
      slug: "site-settings",
      depth: 1,
      fallbackLocale: false,
      locale,
      overrideAccess: true,
    });
    return {
      comingSoon: settings.comingSoon
        ? {
            backgroundImage: settings.comingSoon.backgroundImage as
              MediaValue | undefined,
            contactEmail: settings.comingSoon.contactEmail,
            contactLabel: settings.comingSoon.contactLabel,
            eventDate: settings.comingSoon.eventDate,
            label: settings.comingSoon.label,
            message: settings.comingSoon.message,
            mobileBackgroundImage: settings.comingSoon.mobileBackgroundImage as
              MediaValue | undefined,
            title: settings.comingSoon.title,
            venue: settings.comingSoon.venue,
          }
        : undefined,
      comingSoonEnabled: settings.comingSoonEnabled === true,
      defaultOpenGraphImage: settings.defaultOpenGraphImage as
        SiteSettings["defaultOpenGraphImage"] | undefined,
      enableArabic: settings.enableArabic !== false,
      footerLogo: (settings.footerLogo || settings.headerLogo) as
        SiteSettings["footerLogo"] | undefined,
      headerLogo: settings.headerLogo as SiteSettings["headerLogo"] | undefined,
      mobileFooterLogo: (settings.mobileFooterLogo ||
        settings.mobileHeaderLogo) as
        SiteSettings["mobileFooterLogo"] | undefined,
      mobileHeaderLogo: settings.mobileHeaderLogo as
        SiteSettings["mobileHeaderLogo"] | undefined,
    };
  } catch {
    return { comingSoonEnabled: false, enableArabic: false };
  }
}

export async function getCMSRedirect(
  sourceLocale: Locale,
  fromPath: string,
  targetLocale: Locale = sourceLocale,
): Promise<{ path: string; permanent: boolean } | null> {
  try {
    const payload = await getPayload({ config: configPromise });
    const localeRelativePath =
      sourceLocale === "ar"
        ? fromPath.replace(/^\/ar(?=\/|$)/, "") || "/"
        : fromPath;
    const candidatePaths = Array.from(new Set([fromPath, localeRelativePath]));
    const result = await payload.find({
      collection: "redirects",
      depth: 1,
      fallbackLocale: false,
      limit: 500,
      locale: targetLocale,
      overrideAccess: true,
      where: {
        active: { equals: true },
      },
    });
    const redirect = result.docs.find(
      (item) =>
        item.sourceLocale === sourceLocale &&
        candidatePaths.includes(item.fromPath),
    );
    const targetPage =
      redirect?.targetPage && typeof redirect.targetPage === "object"
        ? redirect.targetPage
        : null;
    if (!redirect) return null;
    if (!targetPage?.slug || targetPage.visible === false) return null;
    const targetPath = navigationPath(
      targetLocale,
      String(targetPage.pageType || ""),
      targetPage.slug,
    );
    if (!targetPath) return null;
    return {
      path: targetPath,
      permanent: redirect.permanent !== false,
    };
  } catch (error) {
    console.error("Unable to resolve CMS redirect.", error);
    return null;
  }
}

export const getPage = unstable_cache(fetchPage, ["simf-pages-v51"], {
  revalidate: PUBLIC_CONTENT_REVALIDATE_SECONDS,
  tags: [PUBLIC_CACHE_TAGS.pages],
});

export const getNavigationManifest = unstable_cache(
  fetchNavigationManifest,
  ["simf-navigation-v1"],
  {
    revalidate: PUBLIC_CONTENT_REVALIDATE_SECONDS,
    tags: [PUBLIC_CACHE_TAGS.pages],
  },
);

export const getUpdates = unstable_cache(fetchUpdates, ["simf-updates-v1"], {
  revalidate: PUBLIC_CONTENT_REVALIDATE_SECONDS,
  tags: [PUBLIC_CACHE_TAGS.updates],
});

export const getUpdate = unstable_cache(fetchUpdate, ["simf-update-v1"], {
  revalidate: PUBLIC_CONTENT_REVALIDATE_SECONDS,
  tags: [PUBLIC_CACHE_TAGS.updates],
});

export const getMarketingSettings = unstable_cache(
  fetchMarketing,
  ["simf-marketing-v1"],
  {
    revalidate: PUBLIC_CONTENT_REVALIDATE_SECONDS,
    tags: [PUBLIC_CACHE_TAGS.marketing],
  },
);

export const getSiteSettings = unstable_cache(
  cache(fetchSiteSettings),
  ["simf-site-settings-v1"],
  {
    revalidate: PUBLIC_CONTENT_REVALIDATE_SECONDS,
    tags: [PUBLIC_CACHE_TAGS.siteSettings],
  },
);
