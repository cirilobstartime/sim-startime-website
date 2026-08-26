import { createHmac, timingSafeEqual } from "node:crypto";

const configuredSecret =
  process.env.ATTRIBUTION_SECURITY_SECRET ||
  process.env.FORM_SECURITY_SECRET ||
  process.env.PAYLOAD_SECRET;
const secret =
  configuredSecret || "startime-local-development-attribution-secret";

if (
  process.env.NODE_ENV === "production" &&
  (!configuredSecret || configuredSecret.length < 32)
) {
  throw new Error(
    "ATTRIBUTION_SECURITY_SECRET, FORM_SECURITY_SECRET or PAYLOAD_SECRET must be configured with at least 32 characters in production.",
  );
}

export function signAttributionTouch(value: Record<string, unknown>): string {
  const encoded = Buffer.from(JSON.stringify(value)).toString("base64url");
  const signature = createHmac("sha256", secret)
    .update(encoded)
    .digest("base64url");
  return `${encoded}.${signature}`;
}

export function verifyAttributionTouch(
  value: string | undefined,
): Record<string, unknown> | null {
  if (!value) return null;
  const [encoded, supplied] = value.split(".");
  if (!encoded || !supplied) return null;
  const expected = createHmac("sha256", secret)
    .update(encoded)
    .digest("base64url");
  const a = Buffer.from(supplied);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  try {
    const parsed = JSON.parse(
      Buffer.from(encoded, "base64url").toString("utf8"),
    );
    return parsed && typeof parsed === "object"
      ? (parsed as Record<string, unknown>)
      : null;
  } catch {
    return null;
  }
}
