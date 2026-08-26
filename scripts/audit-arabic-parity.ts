export {};

const baseURL = (process.env.AUDIT_BASE_URL || "http://localhost:3004").replace(
  /\/+$/,
  "",
);

const routes = [
  "/",
  "/programme",
  "/speakers",
  "/partners",
  "/b2g",
  "/legacy",
  "/updates",
  "/updates/future-seabed-security-maritime-supply-chains",
  "/updates/startime-signs-contract-organize-fourth-simf",
  "/updates/preparatory-activities-fourth-simf-november-2026",
  "/contact",
  "/sponsor",
];

function normalizeImage(source: string): string {
  const decoded = source.replaceAll("&amp;", "&");
  const url = new URL(decoded, baseURL);
  const normalizeDirectionalVariant = (pathname: string) =>
    pathname.replace(
      /\/simf-hero-approved-v2-ar\.webp$/,
      "/simf-hero-approved-v2.webp",
    );
  if (url.pathname === "/_next/image") {
    const optimizedSource = decodeURIComponent(url.searchParams.get("url") || "");
    return normalizeDirectionalVariant(new URL(optimizedSource, baseURL).pathname);
  }
  return normalizeDirectionalVariant(url.pathname);
}

function imageSet(html: string): string[] {
  return [
    ...new Set(
      [...html.matchAll(/<img\b[^>]*\bsrc="([^"]+)"/gi)]
        .map((match) => normalizeImage(match[1]))
        .filter(Boolean),
    ),
  ].sort();
}

function sectionIDs(html: string): string[] {
  return [...html.matchAll(/<section\b[^>]*\bid="([^"]+)"/gi)].map(
    (match) => match[1],
  );
}

function arabicCharacterCount(html: string): number {
  return (html.match(/[\u0600-\u06ff]/g) || []).length;
}

let failed = false;
const results = [];

for (const route of routes) {
  const arabicRoute = route === "/" ? "/ar" : `/ar${route}`;
  const [englishResponse, arabicResponse] = await Promise.all([
    fetch(`${baseURL}${route}`),
    fetch(`${baseURL}${arabicRoute}`),
  ]);
  const [englishHTML, arabicHTML] = await Promise.all([
    englishResponse.text(),
    arabicResponse.text(),
  ]);
  const englishImages = imageSet(englishHTML);
  const arabicImages = imageSet(arabicHTML);
  const englishSections = sectionIDs(englishHTML);
  const arabicSections = sectionIDs(arabicHTML);
  const missingFromArabic = englishImages.filter(
    (image) => !arabicImages.includes(image),
  );
  const extraInArabic = arabicImages.filter(
    (image) => !englishImages.includes(image),
  );
  const layoutMatches =
    JSON.stringify(englishSections) === JSON.stringify(arabicSections);
  const hasRTL =
    /<html[^>]*\bdir="rtl"[^>]*\blang="ar"/i.test(arabicHTML) ||
    /<html[^>]*\blang="ar"[^>]*\bdir="rtl"/i.test(arabicHTML);
  const arabicCharacters = arabicCharacterCount(arabicHTML);
  const passed =
    englishResponse.ok &&
    arabicResponse.ok &&
    hasRTL &&
    arabicCharacters >= 100 &&
    layoutMatches &&
    missingFromArabic.length === 0 &&
    extraInArabic.length === 0;
  failed ||= !passed;
  results.push({
    arabicCharacters,
    arabicStatus: arabicResponse.status,
    englishStatus: englishResponse.status,
    extraInArabic,
    hasRTL,
    imageCount: englishImages.length,
    layoutMatches,
    missingFromArabic,
    passed,
    route,
    sectionCount: englishSections.length,
  });
}

console.log(JSON.stringify({ baseURL, passed: !failed, results }, null, 2));
if (failed) process.exitCode = 1;
