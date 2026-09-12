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

if (!beta.docs[0]) throw new Error("Partners Beta page was not found.");

for (const locale of ["en", "ar"] satisfies Locale[]) {
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

await payload.updateGlobal({
  slug: "site-settings",
  data: { comingSoonEnabled },
  overrideAccess: true,
});

console.log(
  `Release visibility set: partners-beta=${betaVisible}, coming-soon=${comingSoonEnabled}.`,
);
