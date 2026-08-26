import { createClient, type InStatement } from "@libsql/client";

const databaseURL = process.env.DATABASE_URL;
if (!databaseURL) throw new Error("DATABASE_URL is required.");

const mediaFieldNames = new Set([
  "backgroundImage",
  "logo",
  "media",
  "mobileBackgroundImage",
  "mobileMedia",
  "portrait",
  "poster",
  "video",
]);

type JsonObject = Record<string, unknown>;

function isObject(value: unknown): value is JsonObject {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function containsMedia(value: unknown): boolean {
  if (Array.isArray(value)) return value.some(containsMedia);
  if (!isObject(value)) return false;

  return Object.entries(value).some(
    ([key, child]) =>
      (mediaFieldNames.has(key) && child !== null && child !== undefined) ||
      containsMedia(child),
  );
}

function comparableWithoutMedia(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(comparableWithoutMedia);
  if (!isObject(value)) return value;

  return Object.fromEntries(
    Object.entries(value).map(([key, child]) => [
      key,
      mediaFieldNames.has(key)
        ? "__MEDIA_REFERENCE__"
        : comparableWithoutMedia(child),
    ]),
  );
}

function mirrorMedia(
  english: unknown,
  arabic: unknown,
  path: string,
  changes: string[],
  additions: string[],
): unknown {
  if (Array.isArray(arabic)) {
    if (!Array.isArray(english)) return arabic;

    const mirrored = arabic.map((arabicItem, index) =>
      mirrorMedia(
        english[index],
        arabicItem,
        `${path}[${index}]`,
        changes,
        additions,
      ),
    );

    for (let index = arabic.length; index < english.length; index += 1) {
      const englishItem = english[index];
      if (!containsMedia(englishItem)) continue;
      mirrored.push(structuredClone(englishItem));
      additions.push(`${path}[${index}]`);
    }

    return mirrored;
  }

  if (!isObject(arabic) || !isObject(english)) return arabic;

  const mirrored: JsonObject = { ...arabic };

  for (const [key, englishValue] of Object.entries(english)) {
    const childPath = `${path}.${key}`;

    if (mediaFieldNames.has(key)) {
      if (mirrored[key] !== englishValue) {
        changes.push(
          `${childPath}: ${String(mirrored[key])} -> ${String(englishValue)}`,
        );
        mirrored[key] = englishValue;
      }
      continue;
    }

    if (key in mirrored) {
      mirrored[key] = mirrorMedia(
        englishValue,
        mirrored[key],
        childPath,
        changes,
        additions,
      );
    }
  }

  return mirrored;
}

const database = createClient({ url: databaseURL });

try {
  const pageResult = await database.execute(
    "select id, _parent_id, _locale, sections from pages_locales order by _parent_id, _locale",
  );
  const pagesByLocale = new Map(
    pageResult.rows.map((row) => [
      `${String(row._parent_id)}:${String(row._locale)}`,
      row,
    ]),
  );

  const statements: InStatement[] = [];
  let pageReferenceChanges = 0;
  let addedMediaCards = 0;

  for (const arabicRow of pageResult.rows.filter(
    (row) => row._locale === "ar",
  )) {
    const parentID = String(arabicRow._parent_id);
    const englishRow = pagesByLocale.get(`${parentID}:en`);
    if (!englishRow) throw new Error(`English page ${parentID} is missing.`);

    const englishSections = JSON.parse(String(englishRow.sections || "[]"));
    const arabicSections = JSON.parse(String(arabicRow.sections || "[]"));
    const changes: string[] = [];
    const additions: string[] = [];
    const mirroredSections = mirrorMedia(
      englishSections,
      arabicSections,
      `page:${parentID}.sections`,
      changes,
      additions,
    );

    if (additions.length === 0) {
      const beforeText = JSON.stringify(comparableWithoutMedia(arabicSections));
      const afterText = JSON.stringify(comparableWithoutMedia(mirroredSections));
      if (beforeText !== afterText) {
        throw new Error(`Non-media Arabic content changed for page ${parentID}.`);
      }
    }

    if (changes.length > 0 || additions.length > 0) {
      statements.push({
        sql: "update pages_locales set sections = ? where id = ?",
        args: [JSON.stringify(mirroredSections), arabicRow.id],
      });
      pageReferenceChanges += changes.length;
      addedMediaCards += additions.length;
      console.log(
        `Page ${parentID}: mirrored ${changes.length} references and added ${additions.length} missing media cards.`,
      );
    }
  }

  statements.push({
    sql: `update updates_content as arabic
          set media_id = (
            select english.media_id
            from updates_content as english
            where english._parent_id = arabic._parent_id
              and english._locale = 'en'
              and english._order = arabic._order
          )
          where arabic._locale = 'ar'
            and exists (
              select 1
              from updates_content as english
              where english._parent_id = arabic._parent_id
                and english._locale = 'en'
                and english._order = arabic._order
                and english.media_id is not arabic.media_id
            )`,
    args: [],
  });
  statements.push({
    sql: `insert into media_locales (alt, caption, _locale, _parent_id)
          select english.alt, english.caption, 'ar', english._parent_id
          from media_locales as english
          where english._locale = 'en'
            and not exists (
              select 1
              from media_locales as arabic
              where arabic._parent_id = english._parent_id
                and arabic._locale = 'ar'
            )`,
    args: [],
  });
  statements.push({
    sql: "update site_settings set enable_arabic = 1, updated_at = ? where id = 1",
    args: [new Date().toISOString()],
  });

  await database.batch(statements, "write");

  const arabicMediaResult = await database.execute(
    "select count(*) as count from media_locales where _locale = 'ar'",
  );

  console.log(
    JSON.stringify(
      {
        addedMediaCards,
        arabicEnabled: true,
        arabicMediaLocalizations: Number(
          arabicMediaResult.rows[0]?.count || 0,
        ),
        pageReferenceChanges,
      },
      null,
      2,
    ),
  );
} finally {
  database.close();
}
