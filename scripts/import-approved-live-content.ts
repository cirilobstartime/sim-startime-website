import configPromise from "@payload-config";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { getPayload } from "payload";

type JsonRecord = Record<string, unknown>;
type Locale = "en" | "ar";
type Bundle = Record<Locale, { forms: JsonRecord[]; pages: JsonRecord[] }>;

function restoreRelationships(
  value: unknown,
  mediaByFilename: Map<string, number | string>,
  formsByKey: Map<string, number | string>,
): unknown {
  if (Array.isArray(value)) {
    return value.map((item) =>
      restoreRelationships(item, mediaByFilename, formsByKey),
    );
  }
  if (!value || typeof value !== "object") return value;
  const record = value as JsonRecord;
  if (typeof record.__mediaFilename === "string") {
    const id = mediaByFilename.get(record.__mediaFilename);
    if (id == null) throw new Error(`Missing live media: ${record.__mediaFilename}`);
    return id;
  }
  if (typeof record.__formKey === "string") {
    const id = formsByKey.get(record.__formKey);
    if (id == null) throw new Error(`Missing live form: ${record.__formKey}`);
    return id;
  }
  return Object.fromEntries(
    Object.entries(record).map(([key, item]) => [
      key,
      restoreRelationships(item, mediaByFilename, formsByKey),
    ]),
  );
}

const bundle = JSON.parse(
  await readFile(
    path.join(process.cwd(), "scripts/data/approved-live-content.json"),
    "utf8",
  ),
) as Bundle;
const payload = await getPayload({ config: configPromise });

try {
  const media = await payload.find({
    collection: "media",
    depth: 0,
    limit: 2000,
    overrideAccess: true,
  });
  const mediaByFilename = new Map(
    media.docs.flatMap((item) =>
      item.filename ? [[item.filename, item.id] as const] : [],
    ),
  );
  const formsByKey = new Map<string, number | string>();

  for (const english of bundle.en.forms) {
    const formKey = String(english.formKey || "");
    if (!formKey) throw new Error("Approved form is missing formKey.");
    const existing = await payload.find({
      collection: "forms",
      depth: 0,
      limit: 1,
      overrideAccess: true,
      where: { formKey: { equals: formKey } },
    });
    const saved = existing.docs[0]
      ? await payload.update({
          collection: "forms",
          data: english as never,
          draft: false,
          id: existing.docs[0].id,
          locale: "en",
          overrideAccess: true,
        })
      : await payload.create({
          collection: "forms",
          data: english as never,
          draft: false,
          locale: "en",
          overrideAccess: true,
        });
    formsByKey.set(formKey, saved.id);
    const arabic = bundle.ar.forms.find((item) => item.formKey === formKey);
    if (arabic) {
      await payload.update({
        collection: "forms",
        data: arabic as never,
        draft: false,
        id: saved.id,
        locale: "ar",
        overrideAccess: true,
      });
    }
  }

  for (const english of bundle.en.pages) {
    const pageType = String(english.pageType || "");
    const slug = String(english.slug || "");
    if (!pageType) throw new Error("Approved page is missing pageType.");
    if (!slug) throw new Error("Approved page is missing slug.");
    const existing = await payload.find({
      collection: "pages",
      depth: 0,
      fallbackLocale: false,
      limit: 1,
      locale: "en",
      overrideAccess: true,
      where: { slug: { equals: slug } },
    });
    const englishData = restoreRelationships(
      english,
      mediaByFilename,
      formsByKey,
    ) as JsonRecord;
    const saved = existing.docs[0]
      ? await payload.update({
          collection: "pages",
          data: englishData as never,
          draft: false,
          id: existing.docs[0].id,
          locale: "en",
          overrideAccess: true,
        })
      : await payload.create({
          collection: "pages",
          data: englishData as never,
          draft: false,
          locale: "en",
          overrideAccess: true,
        });
    const arabic =
      bundle.ar.pages.find((item) => item.slug === slug) ||
      bundle.ar.pages.find((item) => item.pageType === pageType);
    if (arabic) {
      await payload.update({
        collection: "pages",
        data: restoreRelationships(arabic, mediaByFilename, formsByKey) as never,
        draft: false,
        id: saved.id,
        locale: "ar",
        overrideAccess: true,
      });
      await payload.update({
        collection: "pages",
        data: englishData as never,
        draft: false,
        id: saved.id,
        locale: "en",
        overrideAccess: true,
      });
    }
  }

  const legacyPartners = await payload.find({
    collection: "pages",
    depth: 0,
    fallbackLocale: false,
    limit: 10,
    locale: "en",
    overrideAccess: true,
    where: {
      slug: {
        equals: "simf-microsite/partners",
      },
    },
  });
  for (const page of legacyPartners.docs) {
    for (const locale of ["en", "ar"] as const) {
      await payload.update({
        collection: "pages",
        data: { showInNavigation: false, visible: false },
        draft: false,
        id: page.id,
        locale,
        overrideAccess: true,
      });
    }
  }

  const obsoletePartnersBeta = await payload.find({
    collection: "pages",
    depth: 0,
    fallbackLocale: false,
    limit: 10,
    locale: "en",
    overrideAccess: true,
    where: { slug: { equals: "simf-microsite/partners-beta" } },
  });
  for (const page of obsoletePartnersBeta.docs) {
    await payload.delete({
      collection: "pages",
      id: page.id,
      overrideAccess: true,
    });
  }

  await payload.updateGlobal({
    slug: "site-settings",
    data: { enableArabic: true },
    locale: "en",
    overrideAccess: true,
  });
  await payload.updateGlobal({
    slug: "site-settings",
    data: { enableArabic: true },
    locale: "ar",
    overrideAccess: true,
  });
  console.log(
    JSON.stringify(
      {
        arabicEnabled: true,
        forms: formsByKey.size,
        pages: bundle.en.pages.length,
        reusedMedia: mediaByFilename.size,
      },
      null,
      2,
    ),
  );
} finally {
  await payload.destroy();
}
