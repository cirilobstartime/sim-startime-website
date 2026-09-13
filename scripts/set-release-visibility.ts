import configPromise from "@payload-config";
import { getPayload } from "payload";

type Locale = "ar" | "en";

function requiredBoolean(name: string): boolean {
  const value = process.env[name]?.trim().toLowerCase();
  if (value === "true") return true;
  if (value === "false") return false;
  throw new Error(`${name} must be explicitly set to true or false.`);
}

const betaVisible = requiredBoolean("PARTNERS_BETA_VISIBLE");
const comingSoonEnabled = requiredBoolean("COMING_SOON_ENABLED");
const publicContentIndexable = requiredBoolean("PUBLIC_CONTENT_INDEXABLE");
const payload = await getPayload({ config: configPromise });

const beta = await payload.find({
  collection: "pages",
  depth: 0,
  fallbackLocale: false,
  limit: 1,
  locale: "en",
  overrideAccess: true,
  where: { slug: { equals: "simf-microsite/partners-beta" } },
});

if (!beta.docs[0] && betaVisible) {
  throw new Error("Partners Beta page was not found, so it cannot be enabled.");
}

for (const locale of ["en", "ar"] satisfies Locale[]) {
  if (beta.docs[0]) {
    await payload.update({
      collection: "pages",
      id: beta.docs[0].id,
      data: {
        showInNavigation: betaVisible,
        visible: betaVisible,
      },
      draft: false,
      locale,
      overrideAccess: true,
    });
  }

  if (publicContentIndexable) {
    for (const collection of ["pages", "updates"] as const) {
      const publicDocuments = await payload.find({
        collection,
        depth: 0,
        draft: false,
        fallbackLocale: false,
        limit: 500,
        locale,
        overrideAccess: true,
        where: {
          and: [
            { visible: { equals: true } },
            { _status: { equals: "published" } },
          ],
        },
      });

      for (const document of publicDocuments.docs) {
        await payload.update({
          collection,
          id: document.id,
          data: {
            seo: {
              ...(document.seo || {}),
              followLinks: true,
              includeInSitemap: true,
              indexable: true,
            },
          },
          draft: false,
          locale,
          overrideAccess: true,
        });
      }
    }
  }
}

await payload.updateGlobal({
  slug: "site-settings",
  data: { comingSoonEnabled },
  overrideAccess: true,
});

console.log(
  `Release visibility set: partners-beta=${betaVisible}, coming-soon=${comingSoonEnabled}, public-content-indexable=${publicContentIndexable}.`,
);
