const ALLOWED_PUBLIC_PROTOCOLS = new Set([
  "http:",
  "https:",
  "mailto:",
  "tel:",
]);

export function isSafePublicHref(value: unknown): value is string {
  if (typeof value !== "string") return false;
  const href = value.trim();
  if (!href || /[\u0000-\u001f\u007f]/.test(href)) return false;
  if (href.startsWith("#")) return true;
  if (href.startsWith("/") && !href.startsWith("//")) return true;

  try {
    return ALLOWED_PUBLIC_PROTOCOLS.has(new URL(href).protocol);
  } catch {
    return false;
  }
}

export function publicHrefValidation(value: unknown) {
  if (value === null || value === undefined || value === "") return true;
  return (
    isSafePublicHref(value) ||
    "Use an internal path, anchor, or an http, https, mailto, or tel link."
  );
}

export function absoluteHttpURLValidation(value: unknown) {
  if (value === null || value === undefined || value === "") return true;
  if (typeof value !== "string") return "Enter a valid http or https URL.";
  try {
    const url = new URL(value.trim());
    return (
      ["http:", "https:"].includes(url.protocol) ||
      "Enter a valid http or https URL."
    );
  } catch {
    return "Enter a valid http or https URL.";
  }
}
