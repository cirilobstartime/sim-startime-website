import { getMediaURL } from "@/components/CmsImage";
import type { Locale, PublicPage, PublicUpdate } from "@/content/types";

const origin = (
  process.env.NEXT_PUBLIC_APP_URL || "https://simf.startime.sa"
).replace(/\/$/, "");

const startimeID = "https://startime.sa/#organization";
const rsnfID = `${origin}/#royal-saudi-naval-forces`;
const eventID = `${origin}/#event`;
const websiteID = `${origin}/#website`;

export function absoluteURL(path = "/") {
  if (/^https?:\/\//i.test(path)) return path;
  return `${origin}${path.startsWith("/") ? path : `/${path}`}`;
}

export function startimeOrganizationSchema() {
  return {
    "@id": startimeID,
    "@type": "Organization",
    name: "Startime",
    url: "https://startime.sa",
    logo: absoluteURL("/assets/brand/startime-dark.svg"),
    email: "sim@startime.sa",
    telephone: "920010500",
    address: {
      "@type": "PostalAddress",
      streetAddress: "3507",
      addressLocality: "Riyadh",
      postalCode: "12341",
      addressCountry: "SA",
    },
    sameAs: [
      origin,
      "https://x.com/startimeevents",
      "https://sa.linkedin.com/company/startimeevents",
      "https://www.youtube.com/@Startime_Events",
    ],
  };
}

function breadcrumbSchema(
  locale: Locale,
  entries: Array<{ name: string; path: string }>,
) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: entries.map((entry, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: entry.name,
      item: absoluteURL(entry.path),
    })),
  };
}

export function eventPageSchema(locale: Locale, page: PublicPage) {
  const ar = locale === "ar";
  const pagePath = ar ? "/ar" : "/";
  const image = getMediaURL(page.seo?.openGraphImage);
  const eventName = ar
    ? "الملتقى البحري السعودي الدولي الرابع (SIMF)"
    : "4th Saudi International Maritime Forum (SIMF)";
  const eventDescription = ar
    ? "الملتقى البحري السعودي الدولي الرابع فعالية سيادية تجمع قادة القوات البحرية وصنّاع القرار في قطاعات الأمن البحري والدفاع."
    : "The 4th Saudi International Maritime Forum is a sovereign event bringing together naval force commanders and decision-makers in the maritime and defense sectors.";
  const venueName = ar
    ? "فندق ومركز مؤتمرات سوفيتل الرياض"
    : "Sofitel Riyadh Hotel & Convention Centre";
  const rsnfName = ar
    ? "القوات البحرية الملكية السعودية"
    : "Royal Saudi Naval Forces";
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@id": eventID,
        "@type": "Event",
        name: eventName,
        description: eventDescription,
        url: absoluteURL(pagePath),
        image: image ? [absoluteURL(image)] : undefined,
        startDate: "2026-11-23T08:00:00+03:00",
        endDate: "2026-11-25T18:00:00+03:00",
        eventAttendanceMode:
          "https://schema.org/OfflineEventAttendanceMode",
        eventStatus: "https://schema.org/EventScheduled",
        inLanguage: ar ? "ar-SA" : "en-US",
        location: {
          "@type": "Place",
          name: venueName,
          address: {
            "@type": "PostalAddress",
            streetAddress: ar
              ? "6218 طريق العروبة، الرحمانية"
              : "6218 Al Urubah Road, Ar Rahmaniyyah",
            addressLocality: "Riyadh",
            addressRegion: ar ? "منطقة الرياض" : "Riyadh Province",
            postalCode: "12342",
            addressCountry: "SA",
          },
        },
        organizer: [{ "@id": rsnfID }, { "@id": startimeID }],
      },
      {
        "@id": rsnfID,
        "@type": "Organization",
        name: rsnfName,
        url: "https://rsnf.gov.sa",
      },
      startimeOrganizationSchema(),
      {
        "@id": websiteID,
        "@type": "WebSite",
        url: absoluteURL("/"),
        name: ar
          ? "الملتقى البحري السعودي الدولي"
          : "Saudi International Maritime Forum",
        inLanguage: ["en-US", "ar-SA"],
        publisher: { "@id": rsnfID },
        copyrightHolder: { "@id": startimeID },
        author: { "@id": startimeID },
      },
      {
        "@id": `${absoluteURL(pagePath)}#webpage`,
        "@type": "WebPage",
        name: eventName,
        description: eventDescription,
        url: absoluteURL(pagePath),
        inLanguage: ar ? "ar-SA" : "en",
        isPartOf: { "@id": websiteID },
        about: { "@id": eventID },
        mainEntity: { "@id": eventID },
        publisher: { "@id": rsnfID },
        author: { "@id": startimeID },
      },
    ],
  };
}

export function standardPageSchema(
  locale: Locale,
  page: PublicPage,
  pagePath: string,
) {
  const ar = locale === "ar";
  const homePath = ar ? "/ar" : "/";
  const isUpdates = page.pageType === "simf-microsite-updates";
  return {
    "@context": "https://schema.org",
    "@graph": [
      startimeOrganizationSchema(),
      {
        "@id": `${absoluteURL(pagePath)}#webpage`,
        "@type": isUpdates ? "CollectionPage" : "WebPage",
        name: page.title,
        description: page.summary,
        url: absoluteURL(pagePath),
        inLanguage: ar ? "ar-SA" : "en",
        publisher: { "@id": startimeID },
        breadcrumb: { "@id": `${absoluteURL(pagePath)}#breadcrumb` },
      },
      {
        "@id": `${absoluteURL(pagePath)}#breadcrumb`,
        ...breadcrumbSchema(locale, [
          { name: ar ? "الرئيسية" : "SIMF", path: homePath },
          {
            name: isUpdates
              ? ar
                ? "الأخبار والتحديثات"
                : "Updates"
              : page.title,
            path: pagePath,
          },
        ]),
      },
    ],
  };
}

export function updateArticleSchema(
  locale: Locale,
  update: PublicUpdate,
  pagePath: string,
) {
  const ar = locale === "ar";
  const homePath = ar ? "/ar" : "/";
  const updatesPath = ar ? "/ar/updates" : "/updates";
  const image = getMediaURL(update.seo?.openGraphImage || update.featuredImage);
  return {
    "@context": "https://schema.org",
    "@graph": [
      startimeOrganizationSchema(),
      {
        "@id": `${absoluteURL(pagePath)}#article`,
        "@type": "NewsArticle",
        headline: update.title,
        description: update.seo?.description || update.summary,
        image: image ? [absoluteURL(image)] : undefined,
        datePublished: update.publishedAt,
        dateModified: update.publishedAt,
        inLanguage: ar ? "ar-SA" : "en",
        mainEntityOfPage: {
          "@id": `${absoluteURL(pagePath)}#webpage`,
        },
        author: {
          "@id": startimeID,
        },
        publisher: {
          "@id": startimeID,
        },
      },
      {
        "@id": `${absoluteURL(pagePath)}#webpage`,
        "@type": "WebPage",
        name: update.title,
        description: update.seo?.description || update.summary,
        url: absoluteURL(pagePath),
        inLanguage: ar ? "ar-SA" : "en",
        breadcrumb: { "@id": `${absoluteURL(pagePath)}#breadcrumb` },
        publisher: { "@id": startimeID },
      },
      {
        "@id": `${absoluteURL(pagePath)}#breadcrumb`,
        ...breadcrumbSchema(locale, [
          { name: ar ? "الرئيسية" : "SIMF", path: homePath },
          {
            name: ar ? "الأخبار والتحديثات" : "Updates",
            path: updatesPath,
          },
          { name: update.title, path: pagePath },
        ]),
      },
    ],
  };
}
