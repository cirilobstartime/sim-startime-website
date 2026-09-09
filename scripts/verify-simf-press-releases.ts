import configPromise from "@payload-config";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { getPayload } from "payload";

type Locale = "en" | "ar";
type Article = {
  ar: { bodies: string[]; category: string; title: string };
  en: { bodies: string[]; category: string; title: string };
  image: string;
  slug: string;
};

function richTextValue(value: unknown): string {
  if (!value || typeof value !== "object") return "";
  const root = (value as { root?: { children?: unknown[] } }).root;
  const paragraph = root?.children?.[0] as
    | { children?: Array<{ text?: string }> }
    | undefined;
  return paragraph?.children?.map((item) => item.text || "").join("") || "";
}

const articles = JSON.parse(
  await readFile(
    path.join(process.cwd(), "scripts/data/simf-press-releases.json"),
    "utf8",
  ),
) as Article[];
const payload = await getPayload({ config: configPromise });

try {
  for (const article of articles) {
    for (const locale of ["en", "ar"] as const satisfies Locale[]) {
      const result = await payload.find({
        collection: "updates",
        depth: 1,
        fallbackLocale: false,
        limit: 1,
        locale,
        overrideAccess: true,
        where: { slug: { equals: article.slug } },
      });
      const update = result.docs[0];
      if (!update) throw new Error(`Missing ${locale} article ${article.slug}`);
      const expected = article[locale];
      const actualBodies = (update.content || []).map((item) =>
        richTextValue(item.richBody),
      );
      const image =
        typeof update.featuredImage === "object" ? update.featuredImage : null;
      const checks = [
        update.title === expected.title,
        update.category === expected.category,
        JSON.stringify(actualBodies) === JSON.stringify(expected.bodies),
        update.summary == null,
        update.intro == null,
        update.visible === true,
        update._status === "published",
        image?.filename === article.image,
      ];
      if (checks.some((check) => !check)) {
        throw new Error(`Content mismatch in ${locale} article ${article.slug}`);
      }
    }
  }
  console.log(`Verified ${articles.length * 2} exact localized article records.`);
} finally {
  await payload.destroy();
}
