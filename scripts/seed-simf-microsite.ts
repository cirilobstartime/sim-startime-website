import path from "node:path";
import configPromise from "@payload-config";
import { getPayload } from "payload";
import {
  getSimfMicrositePage,
} from "../src/content/simfMicrositeDefaults";
import {
  getSimfContentPage,
  type SimfContentPageKey,
} from "../src/content/simfContentPagesDefaults";
import {
  getSimfUpdates,
  getSimfUpdatesPage,
} from "../src/content/simfUpdatesDefaults";
import { countryCodeFromValue } from "../src/content/countries";
import type {
  FormDefinition,
  Locale,
  PageSection,
} from "../src/content/types";

const projectRoot = process.cwd();
const locales: Locale[] = ["en", "ar"];
const pageTypes = [
  "simf-microsite-home",
  "simf-microsite-sponsor",
  "simf-microsite-legacy",
  "simf-microsite-programme",
  "simf-microsite-speakers",
  "simf-microsite-partners",
  "simf-microsite-government-b2g",
  "simf-microsite-contact",
  "simf-microsite-updates",
] as const;
const requestedPageTypes = new Set(
  (process.env.SIMF_SEED_ONLY || "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean),
);
const selectedPageTypes = requestedPageTypes.size
  ? pageTypes.filter((pageType) => requestedPageTypes.has(pageType))
  : pageTypes;

function pageSource(locale: Locale, pageType: (typeof pageTypes)[number]) {
  if (pageType === "simf-microsite-sponsor") {
    const page = getSimfContentPage(locale, "sponsors");
    return {
      ...page,
      pageType,
      slug: "simf-microsite/sponsor",
    };
  }
  if (pageType === "simf-microsite-home") {
    return getSimfMicrositePage(locale, pageType);
  }
  if (pageType === "simf-microsite-updates") {
    return getSimfUpdatesPage(locale);
  }
  return getSimfContentPage(
    locale,
    pageType.replace("simf-microsite-", "") as SimfContentPageKey,
  );
}

function collectMedia(value: unknown, paths = new Set<string>()): Set<string> {
  if (typeof value === "string" && value.startsWith("/assets/")) {
    paths.add(value);
  } else if (Array.isArray(value)) {
    value.forEach((entry) => collectMedia(entry, paths));
  } else if (value && typeof value === "object") {
    Object.values(value).forEach((entry) => collectMedia(entry, paths));
  }
  return paths;
}

function replaceMedia(
  value: unknown,
  mediaIDs: Map<string, number | string>,
): unknown {
  if (typeof value === "string" && value.startsWith("/assets/")) {
    return mediaIDs.get(value) || value;
  }
  if (Array.isArray(value)) {
    return value.map((entry) => replaceMedia(entry, mediaIDs));
  }
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, entry]) => [
        key,
        key === "country" && typeof entry === "string"
          ? countryCodeFromValue(entry) || entry
          : replaceMedia(entry, mediaIDs),
      ]),
    );
  }
  return value;
}

function nameSections(sections: PageSection[]): PageSection[] {
  return sections.map((section) => ({
    ...section,
    blockName:
      section.blockName ||
      section.internalLabel ||
      ("heading" in section && typeof section.heading === "string"
        ? section.heading
        : section.blockType),
  }));
}

function assetAlt(assetPath: string): string {
  return path
    .basename(assetPath, path.extname(assetPath))
    .replace(/^\d+-/, "")
    .replaceAll("-", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function localizedForm(locale: Locale): FormDefinition {
  const sponsorPage = getSimfMicrositePage(
    locale,
    "simf-microsite-sponsor",
  );
  const formSection = sponsorPage.sections.find(
    (item) => item.blockType === "form",
  );
  if (
    !formSection ||
    formSection.blockType !== "form" ||
    typeof formSection.form !== "object"
  ) {
    throw new Error(`Missing ${locale} SIMF sponsorship form definition.`);
  }
  return formSection.form;
}

function localizedContentPageForm(
  locale: Locale,
  key: Extract<SimfContentPageKey, "contact" | "government-b2g">,
): FormDefinition {
  const page = getSimfContentPage(locale, key);
  const formSection = page.sections.find(
    (item) => item.blockType === "form",
  );
  if (
    !formSection ||
    formSection.blockType !== "form" ||
    typeof formSection.form !== "object"
  ) {
    throw new Error(`Missing ${locale} ${key} form definition.`);
  }
  return formSection.form;
}

const payload = await getPayload({ config: configPromise });
const allMediaPaths = new Set<string>();
const retiredPageTypes = [
  "simf-microsite-home-review",
  "simf-microsite-about",
  "simf-microsite-keynote-sessions",
  "simf-microsite-b2g-partnerships",
  "simf-microsite-sponsors",
];

for (const pageType of retiredPageTypes) {
  const retired = await payload.find({
    collection: "pages",
    depth: 0,
    limit: 20,
    overrideAccess: true,
    where: { pageType: { equals: pageType } },
  });
  for (const page of retired.docs) {
    await payload.delete({
      collection: "pages",
      id: page.id,
      overrideAccess: true,
    });
  }
}

for (const locale of locales) {
  for (const pageType of selectedPageTypes) {
    collectMedia(pageSource(locale, pageType), allMediaPaths);
  }
  collectMedia(getSimfUpdates(locale), allMediaPaths);
}

const mediaIDs = new Map<string, number | string>();
for (const assetPath of allMediaPaths) {
  const absolutePath = path.join(projectRoot, "public", assetPath);
  const existing = await payload.find({
    collection: "media",
    depth: 0,
    limit: 1,
    locale: "en",
    overrideAccess: true,
    where: {
      usageNotes: { equals: `SIMF microsite source: ${assetPath}` },
    },
  });
  const media =
    existing.docs[0] ||
    (await payload.create({
      collection: "media",
      data: {
        alt: assetAlt(assetPath),
        title: assetAlt(assetPath),
        usageNotes: `SIMF microsite source: ${assetPath}`,
      },
      filePath: absolutePath,
      locale: "en",
      overrideAccess: true,
    }));
  mediaIDs.set(assetPath, media.id);
}

const formDefinitions = [
  {
    definition: (locale: Locale) => localizedForm(locale),
    internalTitle: "SIMF microsite sponsorship inquiry",
  },
  {
    definition: (locale: Locale) =>
      localizedContentPageForm(locale, "government-b2g"),
    internalTitle: "SIMF B2G application",
  },
  {
    definition: (locale: Locale) =>
      localizedContentPageForm(locale, "contact"),
    internalTitle: "SIMF contact enquiry",
  },
];
const formIDs = new Map<string, number | string>();

for (const entry of formDefinitions) {
  const initial = entry.definition("en");
  const existingForms = await payload.find({
    collection: "forms",
    depth: 0,
    limit: 1,
    overrideAccess: true,
    where: { formKey: { equals: initial.formKey } },
  });
  let formID = existingForms.docs[0]?.id;
  for (const locale of locales) {
    const definition = entry.definition(locale);
    const formData = {
      _status: "published",
      active: true,
      conversionCurrency: definition.conversionCurrency || "SAR",
      conversionValue: definition.conversionValue || 0,
      fields: definition.fields,
      formKey: definition.formKey,
      internalTitle: entry.internalTitle,
      notificationEmails: [{ email: "sim@startime.sa" }],
      rateLimit: { requests: 5, windowMinutes: 15 },
      submitLabel: definition.submitLabel,
    };
    if (!formID) {
      const created = await payload.create({
        collection: "forms",
        data: formData as never,
        draft: false,
        locale,
        overrideAccess: true,
      });
      formID = created.id;
    } else {
      await payload.update({
        collection: "forms",
        id: formID,
        data: formData as never,
        draft: false,
        locale,
        overrideAccess: true,
      });
    }
  }
  formIDs.set(initial.formKey, formID!);
}

for (const pageType of selectedPageTypes) {
  const existing = await payload.find({
    collection: "pages",
    depth: 0,
    limit: 1,
    overrideAccess: true,
    where: { pageType: { equals: pageType } },
  });
  let pageID = existing.docs[0]?.id;

  for (const locale of locales) {
    const page = pageSource(locale, pageType);
    const sections = nameSections(
      replaceMedia(page.sections, mediaIDs) as PageSection[],
    );
    for (const item of sections) {
      if (item.blockType === "form" && typeof item.form === "object") {
        item.form = formIDs.get(item.form.formKey) || item.form;
      }
    }
    const data = {
      _status: "published",
      internalTitle: `SIMF Microsite — ${
        pageType === "simf-microsite-home"
          ? "Home"
          : pageType === "simf-microsite-sponsor"
            ? "Sponsor Registration"
            : pageType
                  .replace("simf-microsite-", "")
                  .replaceAll("-", " ")
                  .replace(/\b\w/g, (letter) => letter.toUpperCase())
      }`,
      pageType,
      sections,
      seo: {
        ...(replaceMedia(page.seo, mediaIDs) as Record<string, unknown>),
        includeInSitemap: true,
        indexable: page.seo?.indexable !== false,
        sitemapChangeFrequency:
          pageType === "simf-microsite-home" ? "weekly" : "monthly",
        sitemapPriority:
          pageType === "simf-microsite-home"
            ? 1
            : 0.8,
      },
      showInNavigation: false,
      slug: page.slug,
      summary: page.summary,
      title: page.title,
      visible: true,
    };
    if (!pageID) {
      const created = await payload.create({
        collection: "pages",
        data: data as never,
        draft: false,
        locale,
        overrideAccess: true,
      });
      pageID = created.id;
    } else {
      await payload.update({
        collection: "pages",
        id: pageID,
        data: data as never,
        draft: false,
        locale,
        overrideAccess: true,
      });
    }
  }
}

const updateIDs = new Map<string, number | string>();
if (!requestedPageTypes.size) {
  const retiredUpdateSlugs = [
    "seabed-security-maritime-supply-chains-simf-2026",
    "global-maritime-leaders-experts-riyadh",
    "five-strategic-priorities-simf-2026",
    "partnership-opportunities-simf-2026",
    "protecting-critical-subsea-infrastructure",
    "ai-modern-technologies-maritime-security",
  ];
  const retiredUpdates = await payload.find({
    collection: "updates",
    depth: 0,
    fallbackLocale: false,
    limit: 100,
    locale: "en",
    overrideAccess: true,
    where: {
      slug: {
        in: retiredUpdateSlugs,
      },
    },
  });
  for (const update of retiredUpdates.docs) {
    await payload.delete({
      collection: "updates",
      id: update.id,
      overrideAccess: true,
    });
  }

  for (const locale of locales) {
    for (const update of getSimfUpdates(locale)) {
    let updateID = updateIDs.get(update.slug);
    if (!updateID) {
      const existing = await payload.find({
        collection: "updates",
        depth: 0,
        limit: 1,
        locale,
        overrideAccess: true,
        where: { slug: { equals: update.slug } },
      });
      updateID = existing.docs[0]?.id;
    }
    const data = {
      ...(replaceMedia(update, mediaIDs) as Record<string, unknown>),
      _status: "published",
      visible: true,
    };
    if (!updateID) {
      const created = await payload.create({
        collection: "updates",
        data: data as never,
        draft: false,
        locale,
        overrideAccess: true,
      });
      updateID = created.id;
    } else {
      await payload.update({
        collection: "updates",
        id: updateID,
        data: data as never,
        draft: false,
        locale,
        overrideAccess: true,
      });
    }
      updateIDs.set(update.slug, updateID);
    }
  }
}

if (!requestedPageTypes.size) {
  for (const locale of locales) {
    const ar = locale === "ar";
    await payload.updateGlobal({
    slug: "marketing-settings",
    data: {
      _status: "published",
      cookieNotice: ar
        ? "نستخدم ملفات تعريف الارتباط الضرورية، وبموافقتك نستخدم التحليلات لتحسين تجربتك وقياس أداء الموقع."
        : "We use essential cookies and, with your permission, analytics to improve your experience and measure website performance.",
      acceptLabel: ar ? "السماح بالتحليلات" : "Allow analytics",
      rejectLabel: ar ? "رفض التحليلات" : "Reject analytics",
      settingsLabel: ar ? "سياسة الخصوصية" : "Privacy policy",
      privacyHref: ar ? "/ar/privacy-policy" : "/privacy-policy",
    },
    draft: false,
    locale,
    overrideAccess: true,
    });
  }
}

console.log(
  `Seeded ${selectedPageTypes.length} bilingual SIMF microsite pages, ${formIDs.size} secure forms, ${updateIDs.size} updates, and ${mediaIDs.size} media assets.`,
);
process.exit(0);
