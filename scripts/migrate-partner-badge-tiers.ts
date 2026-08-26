import configPromise from "@payload-config";
import { getPayload } from "payload";
import type { Locale } from "../src/content/types";

const locales: Locale[] = ["en", "ar"];
const payload = await getPayload({ config: configPromise });

function legacyTier(
  anchorID: string | null | undefined,
  organizationName: string,
) {
  const name = organizationName.toLowerCase();

  if (anchorID === "partner-category-supervision") {
    if (name.includes("ministry of defense") || name.includes("وزارة الدفاع")) {
      return "supervision" as const;
    }
    if (name.includes("royal saudi naval forces") || name.includes("القوات البحرية")) {
      return "organizer" as const;
    }
  }
  if (anchorID === "partner-category-strategic") return "strategic" as const;
  if (anchorID === "partner-category-media") return "media-partner" as const;
  return "none" as const;
}

try {
  for (const locale of locales) {
    const result = await payload.find({
      collection: "pages",
      depth: 0,
      fallbackLocale: false,
      limit: 1,
      locale,
      overrideAccess: true,
      where: { pageType: { equals: "simf-microsite-partners" } },
    });
    const page = result.docs[0];
    if (!page) continue;

    let changed = false;
    const sections = (page.sections || []).map((section) => {
      if (section.blockType !== "partnerCategory") return section;

      return {
        ...section,
        logos: (section.logos || []).map((logo) => {
          if (logo.tier && logo.tier !== "none") return logo;
          const tier = legacyTier(section.anchorID, logo.name);
          if (logo.tier === tier) return logo;
          changed = true;
          return { ...logo, tier };
        }),
      };
    });

    if (changed) {
      await payload.update({
        collection: "pages",
        id: page.id,
        data: { sections: sections as typeof page.sections },
        locale,
        overrideAccess: true,
      });
      console.log(`Updated partner badge selections for ${locale}.`);
    } else {
      console.log(`Partner badge selections for ${locale} are already current.`);
    }
  }
} finally {
  await payload.destroy();
}
