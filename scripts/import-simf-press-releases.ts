import configPromise from "@payload-config";
import { copyFile, mkdir, readFile } from "node:fs/promises";
import path from "node:path";
import { getPayload } from "payload";

type Locale = "en" | "ar";
type ArticleLocale = {
  bodies: string[];
  category: string;
  heading?: string;
  seoDescription: string;
  seoTitle: string;
  title: string;
};
type Article = {
  ar: ArticleLocale;
  en: ArticleLocale;
  image: string;
  number: number;
  slug: string;
};

const root = process.cwd();
const dataPath = path.join(root, "scripts/data/simf-press-releases.json");

const arabicPageSeoTitles: Record<string, string> = {
  "simf-microsite-home":
    "الملتقى البحري السعودي الدولي 2026 | الأمن البحري في الرياض",
  "simf-microsite-programme":
    "برنامج الملتقى البحري السعودي الدولي 2026 | الرياض",
  "simf-microsite-speakers":
    "متحدثو الملتقى البحري السعودي الدولي 2026 | قادة وخبراء",
  "simf-microsite-partners":
    "رعاة وشركاء الملتقى البحري السعودي الدولي 2026",
  "simf-microsite-government-b2g":
    "اجتماعات الأعمال الحكومية B2G | الملتقى البحري السعودي 2026",
  "simf-microsite-legacy":
    "تاريخ الملتقى البحري السعودي الدولي | من 2019 إلى 2026",
  "simf-microsite-updates":
    "أخبار الملتقى البحري السعودي الدولي 2026 | المركز الإعلامي",
  "simf-microsite-contact":
    "تواصل مع فريق الملتقى البحري السعودي الدولي 2026",
  "simf-microsite-sponsor":
    "فرص رعاية الملتقى البحري السعودي الدولي 2026",
};

function lexicalParagraph(text: string) {
  return {
    root: {
      children: [
        {
          children: [
            {
              detail: 0,
              format: 0,
              mode: "normal",
              style: "",
              text,
              type: "text",
              version: 1,
            },
          ],
          direction: null,
          format: "",
          indent: 0,
          textFormat: 0,
          textStyle: "",
          type: "paragraph",
          version: 1,
        },
      ],
      direction: null,
      format: "",
      indent: 0,
      type: "root",
      version: 1,
    },
  };
}

function localizedArticleData(
  article: Article,
  locale: Locale,
  mediaID: number | string,
) {
  const copy = article[locale];
  return {
    _status: "published",
    category: copy.category,
    content: copy.bodies.map((body, index) => ({
      heading: index === 0 ? copy.heading || null : null,
      highlight: false,
      richBody: lexicalParagraph(body),
      visible: true,
    })),
    featured: article.number === 8,
    featuredImage: mediaID,
    featuredImageCaption: null,
    internalTitle: `Press release ${article.number} — ${article.en.title}`,
    intro: null,
    publicationLabel: null,
    publishedAt: `2026-09-09T${String(8 + article.number).padStart(2, "0")}:00:00.000Z`,
    seo: {
      canonicalURL: null,
      description: copy.seoDescription,
      followLinks: true,
      includeInSitemap: true,
      indexable: true,
      openGraphImage: mediaID,
      title: copy.seoTitle,
    },
    slug: article.slug,
    summary: null,
    title: copy.title,
    visible: true,
  };
}

async function backupDatabase() {
  const backupRoot = path.join(root, ".runtime");
  await mkdir(backupRoot, { recursive: true });
  const stamp = new Date().toISOString().replaceAll(":", "-").replaceAll(".", "-");
  for (const filename of ["simf.db", "simf.db-wal", "simf.db-shm"]) {
    try {
      await copyFile(
        path.join(root, filename),
        path.join(backupRoot, `${filename}.before-press-releases-${stamp}`),
      );
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
    }
  }
}

async function main() {
  await backupDatabase();
  const articles = JSON.parse(await readFile(dataPath, "utf8")) as Article[];
  if (articles.length !== 8) throw new Error(`Expected 8 articles, found ${articles.length}.`);

  const payload = await getPayload({ config: configPromise });
  try {
    const media = await payload.find({
      collection: "media",
      depth: 0,
      limit: 1000,
      overrideAccess: true,
    });
    const mediaByFilename = new Map(
      media.docs.map((item) => [item.filename, item.id] as const),
    );
    const retainedIDs = new Set<number | string>();

    for (const article of articles) {
      const mediaID = mediaByFilename.get(article.image);
      if (mediaID == null) throw new Error(`Missing selected feature image: ${article.image}`);

      const existing = await payload.find({
        collection: "updates",
        depth: 0,
        fallbackLocale: false,
        limit: 1,
        locale: "en",
        overrideAccess: true,
        where: { slug: { equals: article.slug } },
      });
      const englishData = localizedArticleData(article, "en", mediaID);
      const saved = existing.docs[0]
        ? await payload.update({
            collection: "updates",
            data: englishData as never,
            draft: false,
            id: existing.docs[0].id,
            locale: "en",
            overrideAccess: true,
          })
        : await payload.create({
            collection: "updates",
            data: englishData as never,
            draft: false,
            locale: "en",
            overrideAccess: true,
          });
      retainedIDs.add(saved.id);

      await payload.update({
        collection: "updates",
        data: localizedArticleData(article, "ar", mediaID) as never,
        draft: false,
        id: saved.id,
        locale: "ar",
        overrideAccess: true,
      });
    }

    const allUpdates = await payload.find({
      collection: "updates",
      depth: 0,
      fallbackLocale: false,
      limit: 500,
      locale: "en",
      overrideAccess: true,
    });
    for (const update of allUpdates.docs) {
      if (retainedIDs.has(update.id)) continue;
      for (const locale of ["en", "ar"] as const) {
        // Legacy updates can be missing one or more required localized values.
        // Payload validates the complete localized document even for a narrow
        // visibility change, so carry forward the current locale with English
        // fallback while hiding it. This keeps legacy copy intact and makes
        // the importer safe to rerun against older production data.
        const localizedUpdate = await payload.findByID({
          collection: "updates",
          depth: 0,
          fallbackLocale: "en",
          id: update.id,
          locale,
          overrideAccess: true,
        });
        await payload.update({
          collection: "updates",
          data: {
            category: localizedUpdate.category,
            content: localizedUpdate.content,
            featured: false,
            slug: localizedUpdate.slug,
            title: localizedUpdate.title,
            visible: false,
          },
          id: update.id,
          locale,
          overrideAccess: true,
        });
      }
    }

    const pages = await payload.find({
      collection: "pages",
      depth: 0,
      fallbackLocale: false,
      limit: 100,
      locale: "ar",
      overrideAccess: true,
    });
    for (const page of pages.docs) {
      const title = arabicPageSeoTitles[page.pageType];
      if (!title) continue;
      await payload.update({
        collection: "pages",
        data: {
          seo: {
            ...(page.seo || {}),
            followLinks: true,
            includeInSitemap: true,
            indexable: true,
            title,
          },
        } as never,
        draft: false,
        id: page.id,
        locale: "ar",
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
          hiddenPreviousUpdates: allUpdates.docs.length - retainedIDs.size,
          importedArticles: retainedIDs.size,
          optimizedArabicPages: Object.keys(arabicPageSeoTitles).length,
        },
        null,
        2,
      ),
    );
  } finally {
    await payload.destroy();
  }
}

await main();
