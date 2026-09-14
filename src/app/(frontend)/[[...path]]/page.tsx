import type { Metadata } from "next";
import { headers } from "next/headers";
import { notFound, permanentRedirect, redirect } from "next/navigation";
import { SimfMicrosite } from "@/components/simf/SimfMicrosite";
import { SimfContentPage } from "@/components/simf/SimfContentPage";
import { SimfHomepageOption } from "@/components/simf/SimfHomepageOption";
import { SimfComingSoon } from "@/components/simf/SimfComingSoon";
import {
  SimfUpdateArticle,
  SimfUpdatesArchive,
} from "@/components/simf/SimfUpdates";
import {
  getCMSRedirect,
  getMarketingSettings,
  getNavigationManifest,
  getPage,
  getSiteSettings,
  getUpdate,
  getUpdates,
} from "@/content/payload";
import type {
  Locale,
  MediaValue,
  PublicPage,
  PublicNavigationManifest,
  SiteSettings,
} from "@/content/types";
import type { SimfContentPageKey } from "@/content/simfContentPagesDefaults";

type PageProps = {
  params: Promise<{ path?: string[] }>;
};

const legacySEOTitles: Record<
  Locale,
  Partial<
    Record<PublicPage["pageType"], { current: string; optimized: string }>
  >
> = {
  en: {
    "simf-microsite-home": {
      current: "Saudi International Maritime Forum 2026 | Riyadh",
      optimized: "Saudi International Maritime Forum 2026 | Riyadh",
    },
    "simf-microsite-programme": {
      current: "Programme | SIM 2026",
      optimized: "SIM 2026 Programme | Maritime Security Forum",
    },
    "simf-microsite-speakers": {
      current: "Speakers | SIM 2026",
      optimized: "SIM 2026 Speakers | Naval & Maritime Leaders",
    },
    "simf-microsite-partners": {
      current: "Sponsors and Partners | SIM 2026",
      optimized: "SIM 2026 Sponsors & Partners | Maritime Forum",
    },
    "simf-microsite-government-b2g": {
      current: "B2G Opportunities | SIM 2026",
      optimized: "B2G Opportunities | SIM 2026 Riyadh",
    },
    "simf-microsite-legacy": {
      current: "Legacy | SIM 2026",
      optimized: "SIMF Legacy | Saudi International Maritime Forum",
    },
    "simf-microsite-updates": {
      current: "News & Insights | SIMF 2026",
      optimized: "SIMF 2026 News & Media Center | Riyadh",
    },
    "simf-microsite-contact": {
      current: "Contact | SIM 2026",
      optimized: "Contact SIM 2026 | Saudi Maritime Forum Riyadh",
    },
    "simf-microsite-sponsor": {
      current: "Sponsorship Opportunities | SIM 2026",
      optimized: "SIM 2026 Sponsorship Opportunities | Riyadh",
    },
  },
  ar: {
    "simf-microsite-home": {
      current: "الملتقى البحري السعودي الدولي 2026",
      optimized: "الملتقى البحري السعودي الدولي 2026 | الرياض",
    },
    "simf-microsite-programme": {
      current: "برنامج | ملتقى 2026",
      optimized: "برنامج ملتقى 2026 | الأمن البحري في الرياض",
    },
    "simf-microsite-speakers": {
      current: "المتحدثون | ملتقى 2026",
      optimized: "متحدثو ملتقى 2026 | قادة وخبراء الأمن البحري",
    },
    "simf-microsite-partners": {
      current: "رعاة وشركاء | ملتقى 2026",
      optimized: "رعاة وشركاء ملتقى 2026 | الرياض",
    },
    "simf-microsite-government-b2g": {
      current: "فرص B2G | ملتقى 2026",
      optimized: "فرص الأعمال الحكومية B2G | ملتقى 2026",
    },
    "simf-microsite-legacy": {
      current: "الإرث | ملتقى 2026",
      optimized: "إرث الملتقى البحري السعودي الدولي | ملتقى 2026",
    },
    "simf-microsite-updates": {
      current: "أخبار ورؤى الملتقى البحري السعودي الدولي",
      optimized: "أخبار ومركز إعلام ملتقى 2026 | الأمن البحري",
    },
    "simf-microsite-contact": {
      current: "تواصل معنا | ملتقى 2026",
      optimized: "تواصل مع فريق ملتقى 2026 | الرياض",
    },
    "simf-microsite-sponsor": {
      current: "فرص الرعاية | ملتقى 2026",
      optimized: "فرص رعاية ملتقى 2026 | الرياض",
    },
  },
};

function optimizedSEOTitle(
  locale: Locale,
  pageType: PublicPage["pageType"],
  title: string,
) {
  const replacement = legacySEOTitles[locale][pageType];
  return replacement?.current === title ? replacement.optimized : title;
}

function resolveRoute(path?: string[]) {
  const locale: Locale = path?.[0] === "ar" ? "ar" : "en";
  const segments = locale === "ar" ? path?.slice(1) || [] : path || [];
  const contentPages: SimfContentPageKey[] = [
    "contact",
    "legacy",
    "programme",
    "speakers",
    "partners",
    "government-b2g",
  ];
  const partnersBeta = segments.length === 1 && segments[0] === "partners-beta";
  const publicContentKey =
    segments.length === 1 && segments[0] === "b2g"
      ? "government-b2g"
      : segments[0];
  const about = segments.length === 1 && segments[0] === "about";
  const homepageReview =
    segments.length === 1 && segments[0] === "new-homepage";
  const updatesArchive = segments.length === 1 && segments[0] === "updates";
  const updateSlug =
    segments.length === 2 && segments[0] === "updates"
      ? segments[1]
      : undefined;
  const contentKey =
    !partnersBeta &&
    segments.length === 1 &&
    contentPages.includes(publicContentKey as SimfContentPageKey)
      ? (publicContentKey as SimfContentPageKey)
      : undefined;
  const sponsor = segments.length === 1 && segments[0] === "sponsor";
  const comingSoon = segments.length === 1 && segments[0] === "coming-soon";
  const genericPage =
    segments.length === 1 &&
    !about &&
    !homepageReview &&
    !updatesArchive &&
    !sponsor &&
    !comingSoon &&
    !partnersBeta &&
    !contentKey;
  const valid =
    segments.length === 0 ||
    about ||
    homepageReview ||
    updatesArchive ||
    Boolean(updateSlug) ||
    sponsor ||
    comingSoon ||
    partnersBeta ||
    genericPage ||
    Boolean(contentKey);
  const pageType = about
    ? ("simf-microsite-about" as const)
    : homepageReview
      ? ("simf-microsite-home-review" as const)
      : updatesArchive || updateSlug
        ? ("simf-microsite-updates" as const)
        : sponsor
          ? ("simf-microsite-sponsor" as const)
          : partnersBeta
            ? ("simf-microsite-partners" as const)
            : genericPage
              ? ("simf-microsite-generic" as const)
              : contentKey
                ? (`simf-microsite-${contentKey}` as const)
                : ("simf-microsite-home" as const);
  const suffix = about
    ? "/about"
    : homepageReview
      ? "/new-homepage"
      : updatesArchive
        ? "/updates"
        : updateSlug
          ? `/updates/${updateSlug}`
          : sponsor
            ? "/sponsor"
            : partnersBeta
              ? "/partners-beta"
              : genericPage
                ? `/${segments[0]}`
                : contentKey
                  ? contentKey === "government-b2g"
                    ? "/b2g"
                    : `/${contentKey}`
                  : "";
  return {
    locale,
    pageType,
    publicPath: `${locale === "ar" ? "/ar" : ""}${suffix}` || "/",
    slug:
      pageType === "simf-microsite-sponsor"
        ? "simf-microsite/sponsor"
        : pageType === "simf-microsite-home-review"
          ? "simf-microsite/new-homepage"
          : pageType === "simf-microsite-about"
            ? "simf-microsite/about"
            : pageType === "simf-microsite-updates"
              ? "simf-microsite/updates"
              : partnersBeta
                ? "simf-microsite/partners-beta"
                : genericPage
                  ? `simf-microsite/${segments[0]}`
                  : contentKey
                    ? `simf-microsite/${contentKey}`
                    : "simf-microsite",
    contentKey,
    partnersBeta,
    genericPage,
    about,
    homepageReview,
    comingSoon,
    updateSlug,
    updatesArchive,
    valid,
  };
}

const retiredUpdateRedirects: Record<string, string> = {
  "/updates/preparatory-activities-fourth-simf-november-2026":
    "/updates/preparatory-activities-simf-2026",
  "/ar/updates/preparatory-activities-fourth-simf-november-2026":
    "/ar/updates/preparatory-activities-simf-2026",
  "/updates/startime-signs-contract-organize-fourth-simf":
    "/updates/startime-organizing-contract-simf-2026",
  "/ar/updates/startime-signs-contract-organize-fourth-simf":
    "/ar/updates/startime-organizing-contract-simf-2026",
  "/updates/future-seabed-security-maritime-supply-chains":
    "/updates/maritime-supply-chains-global-environment",
  "/ar/updates/future-seabed-security-maritime-supply-chains":
    "/ar/updates/maritime-supply-chains-global-environment",
  "/updates/saudi-arabia-a-pivotal-forc-in-safeguarding-global-maritime-security":
    "/updates/saudi-arabia-global-maritime-security",
  "/ar/updates/saudi-arabia-a-pivota-force-in-securing-strategic-maritime-corridors-and-safeguarding-seabed-security":
    "/ar/updates/saudi-arabia-global-maritime-security",
};

function mediaURL(media?: MediaValue): string | undefined {
  if (!media) return undefined;
  return typeof media === "string" ? media : media.url || undefined;
}

function applySharedBranding(
  page: PublicPage,
  settings: SiteSettings,
): PublicPage {
  if (
    !settings.headerLogo &&
    !settings.mobileHeaderLogo &&
    !settings.footerLogo &&
    !settings.mobileFooterLogo
  )
    return page;

  return {
    ...page,
    sections: page.sections.map((section) => {
      if (section.blockType === "simfHeader") {
        return {
          ...section,
          logo: settings.headerLogo || section.logo,
          mobileLogo: settings.mobileHeaderLogo || section.mobileLogo,
        };
      }
      if (section.blockType === "simfFooter") {
        return {
          ...section,
          logo: settings.footerLogo || section.logo,
          mobileLogo: settings.mobileFooterLogo || section.mobileLogo,
        };
      }
      return section;
    }),
  };
}

function normalizeNavigationPath(href: string): string {
  if (!href.startsWith("/")) return href;
  return href.replace(/\/+$/, "") || "/";
}

function applyCMSNavigation(
  page: PublicPage,
  navigation: PublicNavigationManifest,
  locale: Locale,
): PublicPage {
  const known = new Set(navigation.knownPaths.map(normalizeNavigationPath));
  const active = new Set(navigation.activePaths.map(normalizeNavigationPath));
  const sponsorPath = locale === "ar" ? "/ar/sponsor" : "/sponsor";
  const mergeLinks = (
    existing: Array<{ href: string; label: string }> = [],
    placePartnersBeforeB2G = false,
  ) => {
    const filtered = existing.filter((link) => {
      const path = normalizeNavigationPath(link.href);
      return !known.has(path) || active.has(path);
    });
    const present = new Set(
      filtered.map((link) => normalizeNavigationPath(link.href)),
    );
    const merged = [
      ...filtered,
      ...navigation.links.filter((link) => {
        const path = normalizeNavigationPath(link.href);
        if (present.has(path)) return false;
        present.add(path);
        return true;
      }),
    ];
    if (!placePartnersBeforeB2G) return merged;

    const partnerIndex = merged.findIndex((link) =>
      /\/(?:partners|partners-beta|sponsorspartners)$/.test(
        normalizeNavigationPath(link.href),
      ),
    );
    const b2gIndex = merged.findIndex((link) =>
      /\/b2g$/.test(normalizeNavigationPath(link.href)),
    );
    if (partnerIndex < 0 || b2gIndex < 0 || partnerIndex < b2gIndex) {
      return merged;
    }

    const reordered = [...merged];
    const [partnerLink] = reordered.splice(partnerIndex, 1);
    const updatedB2GIndex = reordered.findIndex((link) =>
      /\/b2g$/.test(normalizeNavigationPath(link.href)),
    );
    reordered.splice(updatedB2GIndex, 0, partnerLink);
    return reordered;
  };
  return {
    ...page,
    sections: page.sections.map((section) => {
      if (section.blockType === "simfHeader") {
        return {
          ...section,
          links: mergeLinks(section.links, true),
          sponsorVisible: !known.has(sponsorPath) || active.has(sponsorPath),
        };
      }
      if (section.blockType === "simfFooter") {
        return {
          ...section,
          importantLinks: mergeLinks(section.importantLinks || []),
        };
      }
      return section;
    }),
  };
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { path } = await params;
  const route = resolveRoute(path);
  if (!route.valid) {
    return {
      title: "Page Not Found | Saudi International Maritime Forum 2026",
      description:
        "The requested page could not be found on the Saudi International Maritime Forum website.",
      robots: { follow: false, index: false },
    };
  }
  const siteSettings = await getSiteSettings("en");
  const defaultSocialImage = mediaURL(siteSettings.defaultOpenGraphImage);
  if (route.comingSoon) {
    const title =
      siteSettings.comingSoon?.title ||
      "Coming Soon | Saudi International Maritime Forum 2026";
    const description =
      siteSettings.comingSoon?.message ||
      "A new digital experience for the Saudi International Maritime Forum 2026 is coming soon.";
    return {
      title,
      description,
      openGraph: {
        description,
        images: defaultSocialImage
          ? [
              {
                alt: "Saudi International Maritime Forum 2026",
                url: defaultSocialImage,
              },
            ]
          : undefined,
        siteName: "Saudi International Maritime Forum",
        title,
        type: "website",
      },
      robots: { follow: true, index: false },
      twitter: {
        card: defaultSocialImage ? "summary_large_image" : "summary",
        description,
        images: defaultSocialImage ? [defaultSocialImage] : undefined,
        title,
      },
    };
  }
  if (route.locale === "ar" && !siteSettings.enableArabic) {
    return {
      title: "Page Not Found | Saudi International Maritime Forum 2026",
      robots: {
        follow: false,
        index: false,
      },
    };
  }
  if (route.updateSlug) {
    const [update, marketing] = await Promise.all([
      getUpdate(route.locale, route.updateSlug),
      getMarketingSettings(route.locale),
    ]);
    if (!update) return {};
    const siteURL =
      process.env.NEXT_PUBLIC_APP_URL || "https://simf.startime.sa";
    const englishPath = `/updates/${update.slug}`;
    const arabicPath = `/ar/updates/${update.slug}`;
    const canonicalPath = route.locale === "ar" ? arabicPath : englishPath;
    const socialImage =
      mediaURL(update.seo?.openGraphImage) ||
      defaultSocialImage ||
      mediaURL(update.featuredImage);
    const allowIndexing =
      process.env.NEXT_PUBLIC_ALLOW_INDEXING === "true" &&
      update.seo?.indexable !== false;
    const title = update.seo?.title || update.title;
    const description = update.seo?.description || update.summary;
    return {
      title,
      description,
      alternates: {
        canonical: update.seo?.canonicalURL || `${siteURL}${canonicalPath}`,
        languages: {
          en: `${siteURL}${englishPath}`,
          "x-default": `${siteURL}${englishPath}`,
          ...(siteSettings.enableArabic
            ? { ar: `${siteURL}${arabicPath}` }
            : {}),
        },
      },
      openGraph: {
        title,
        description,
        images: socialImage
          ? [{ alt: update.title, url: socialImage }]
          : undefined,
        locale: route.locale === "ar" ? "ar_SA" : "en_US",
        siteName: "Saudi International Maritime Forum",
        type: "article",
        url: `${siteURL}${canonicalPath}`,
        publishedTime: update.publishedAt,
      },
      robots: {
        follow: allowIndexing && update.seo?.followLinks !== false,
        index: allowIndexing,
      },
      twitter: {
        card: socialImage ? "summary_large_image" : "summary",
        title,
        description,
        images: socialImage ? [socialImage] : undefined,
      },
      verification: { google: marketing.googleSiteVerification || undefined },
    };
  }
  const [page, marketing] = await Promise.all([
    getPage(route.locale, route.slug),
    getMarketingSettings(route.locale),
  ]);
  if (!page) return {};

  const firstVisual = page.sections.find(
    (item) => "media" in item && item.media,
  );
  const socialImage =
    mediaURL(page.seo?.openGraphImage) ||
    defaultSocialImage ||
    (firstVisual && "media" in firstVisual
      ? mediaURL(firstVisual.media)
      : undefined);
  const siteURL = process.env.NEXT_PUBLIC_APP_URL || "https://simf.startime.sa";
  const localizedSuffix =
    page.pageType === "simf-microsite-home"
      ? ""
      : page.pageType === "simf-microsite-home-review"
        ? "/new-homepage"
        : page.pageType === "simf-microsite-about"
          ? "/about"
          : page.pageType === "simf-microsite-sponsor"
            ? "/sponsor"
            : page.pageType === "simf-microsite-updates"
              ? "/updates"
              : route.partnersBeta
                ? "/partners-beta"
                : route.genericPage
                  ? route.publicPath.replace(/^\/ar/, "")
                  : route.contentKey
                    ? route.contentKey === "government-b2g"
                      ? "/b2g"
                      : `/${route.contentKey}`
                    : "";
  const englishPath = localizedSuffix || "/";
  const arabicPath = `/ar${localizedSuffix}`;
  const canonicalPath = route.locale === "ar" ? arabicPath : englishPath;
  const allowIndexing =
    process.env.NEXT_PUBLIC_ALLOW_INDEXING === "true" &&
    page.seo?.indexable !== false;
  const title = optimizedSEOTitle(
    route.locale,
    page.pageType,
    page.seo?.title || page.title,
  );
  const description = page.seo?.description || page.summary || undefined;

  return {
    title,
    description,
    alternates: {
      canonical: page.seo?.canonicalURL || `${siteURL}${canonicalPath}`,
      languages: {
        en: `${siteURL}${englishPath}`,
        "x-default": `${siteURL}${englishPath}`,
        ...(siteSettings.enableArabic ? { ar: `${siteURL}${arabicPath}` } : {}),
      },
    },
    openGraph: {
      title: page.seo?.openGraphTitle || title,
      description: page.seo?.openGraphDescription || description,
      images: socialImage ? [{ alt: page.title, url: socialImage }] : undefined,
      locale: route.locale === "ar" ? "ar_SA" : "en_US",
      siteName: "Saudi International Maritime Forum",
      type: "website",
      url: `${siteURL}${canonicalPath}`,
    },
    robots: {
      follow: allowIndexing && page.seo?.followLinks !== false,
      index: allowIndexing,
    },
    twitter: {
      card: socialImage ? "summary_large_image" : "summary",
      title,
      description,
      images: socialImage ? [socialImage] : undefined,
    },
    verification: {
      google: marketing.googleSiteVerification || undefined,
      other:
        marketing.metaDomainVerification || marketing.bingSiteVerification
          ? {
              ...(marketing.metaDomainVerification
                ? {
                    "facebook-domain-verification":
                      marketing.metaDomainVerification,
                  }
                : {}),
              ...(marketing.bingSiteVerification
                ? { "msvalidate.01": marketing.bingSiteVerification }
                : {}),
            }
          : undefined,
    },
  };
}

export default async function PublicPage({ params }: PageProps) {
  const requestHeaders = await headers();
  const nonce = requestHeaders.get("x-nonce") || undefined;
  const { path } = await params;
  if (path?.[0] === "en") {
    permanentRedirect(path.length > 1 ? `/${path.slice(1).join("/")}` : "/");
  }
  const siteSettings = await getSiteSettings("en");
  const isComingSoonPath =
    (path?.length === 1 && path[0] === "coming-soon") ||
    (path?.length === 2 && path[0] === "ar" && path[1] === "coming-soon");
  if (siteSettings.comingSoonEnabled && !isComingSoonPath) {
    redirect("/coming-soon");
  }

  if (isComingSoonPath) {
    if (path?.[0] === "ar") {
      redirect("/coming-soon");
    }
    return <SimfComingSoon settings={siteSettings} />;
  }

  if (path?.[0] === "ar" && !siteSettings.enableArabic) {
    permanentRedirect(
      path.length === 2 && path[1] === "contact" ? "/contact" : "/",
    );
  }
  if (
    (path?.length === 1 && path[0] === "government-b2g") ||
    (path?.length === 2 && path[0] === "ar" && path[1] === "government-b2g")
  ) {
    permanentRedirect(path[0] === "ar" ? "/ar/b2g" : "/b2g");
  }
  if (
    (path?.length === 1 && path[0] === "sponsors") ||
    (path?.length === 2 && path[0] === "ar" && path[1] === "sponsors")
  ) {
    permanentRedirect(path[0] === "ar" ? "/ar/sponsor" : "/sponsor");
  }
  if (
    (path?.length === 1 && path[0] === "sponsorspartners") ||
    (path?.length === 2 && path[0] === "ar" && path[1] === "sponsorspartners")
  ) {
    permanentRedirect(path[0] === "ar" ? "/ar/partners" : "/partners");
  }
  if (
    (path?.length === 1 && path[0] === "partners-beta") ||
    (path?.length === 2 && path[0] === "ar" && path[1] === "partners-beta")
  ) {
    permanentRedirect(path[0] === "ar" ? "/ar/partners" : "/partners");
  }
  if (
    (path?.length === 1 && path[0] === "about") ||
    (path?.length === 2 && path[0] === "ar" && path[1] === "about")
  ) {
    permanentRedirect(path[0] === "ar" ? "/ar" : "/");
  }
  if (
    (path?.length === 1 && path[0] === "new-homepage") ||
    (path?.length === 2 && path[0] === "ar" && path[1] === "new-homepage")
  ) {
    permanentRedirect(path[0] === "ar" ? "/ar" : "/");
  }
  const route = resolveRoute(path);
  const oldPath = `/${path?.join("/") || ""}`;
  const retiredUpdateTarget = retiredUpdateRedirects[oldPath];
  if (retiredUpdateTarget) permanentRedirect(retiredUpdateTarget);
  const redirectTargetLocale: Locale =
    route.locale === "ar" && siteSettings.enableArabic ? "ar" : "en";
  const shouldCheckRedirect =
    !route.valid || route.genericPage || Boolean(route.updateSlug);
  const destination = shouldCheckRedirect
    ? await getCMSRedirect(route.locale, oldPath, redirectTargetLocale)
    : null;
  if (destination) {
    const target = destination.path;
    const normalizedSource = oldPath.replace(/\/+$/, "") || "/";
    if (target !== normalizedSource) {
      if (destination.permanent) permanentRedirect(target);
      redirect(target);
    }
  }
  if (!route.valid) {
    notFound();
  }

  if (route.locale === "ar" && !siteSettings.enableArabic) notFound();
  const counterpartLocale: Locale = route.locale === "ar" ? "en" : "ar";
  const [page, updates, counterpart, navigation] = await Promise.all([
    getPage(route.locale, route.slug),
    route.updatesArchive || route.updateSlug
      ? getUpdates(route.locale)
      : Promise.resolve([]),
    route.updateSlug
      ? getUpdate(counterpartLocale, route.updateSlug)
      : getPage(counterpartLocale, route.slug),
    getNavigationManifest(route.locale),
  ]);
  const showLanguageSwitcher =
    siteSettings.enableArabic && Boolean(counterpart);
  if (!page || !page.pageType.startsWith("simf-microsite")) notFound();
  const brandedPage = applySharedBranding(
    applyCMSNavigation(page, navigation, route.locale),
    siteSettings,
  );
  if (route.updateSlug) {
    const update = await getUpdate(route.locale, route.updateSlug);
    if (!update) notFound();
    return (
      <SimfUpdateArticle
        locale={route.locale}
        nonce={nonce}
        page={brandedPage}
        showLanguageSwitcher={showLanguageSwitcher}
        update={update}
        updates={updates}
      />
    );
  }
  if (route.updatesArchive) {
    return (
      <SimfUpdatesArchive
        locale={route.locale}
        nonce={nonce}
        page={brandedPage}
        showLanguageSwitcher={showLanguageSwitcher}
        updates={updates}
      />
    );
  }
  if (route.contentKey || route.partnersBeta || route.genericPage) {
    return (
      <SimfContentPage
        locale={route.locale}
        nonce={nonce}
        page={brandedPage}
        pagePath={route.publicPath}
        showLanguageSwitcher={showLanguageSwitcher}
      />
    );
  }
  if (route.pageType === "simf-microsite-sponsor") {
    return (
      <SimfContentPage
        locale={route.locale}
        nonce={nonce}
        page={brandedPage}
        pagePath={route.publicPath}
        showLanguageSwitcher={showLanguageSwitcher}
      />
    );
  }
  if (
    route.pageType === "simf-microsite-home" ||
    route.pageType === "simf-microsite-home-review" ||
    route.pageType === "simf-microsite-about"
  ) {
    return (
      <SimfHomepageOption
        locale={route.locale}
        nonce={nonce}
        page={brandedPage}
        showLanguageSwitcher={showLanguageSwitcher}
        variant={
          route.pageType === "simf-microsite-home"
            ? "client-review"
            : route.pageType === "simf-microsite-home-review"
              ? "client-review"
              : "approved"
        }
      />
    );
  }
  return (
    <SimfMicrosite
      isSubdomain
      locale={route.locale}
      nonce={nonce}
      page={brandedPage}
      pagePath={route.publicPath}
      showLanguageSwitcher={showLanguageSwitcher}
      updates={[]}
    />
  );
}
