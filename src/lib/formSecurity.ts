import { createHmac, timingSafeEqual } from "node:crypto";

const configuredSecret =
  process.env.FORM_SECURITY_SECRET || process.env.PAYLOAD_SECRET;
const secret = configuredSecret || "startime-local-development-form-secret";

if (
  process.env.NODE_ENV === "production" &&
  (!configuredSecret || configuredSecret.length < 32)
) {
  throw new Error(
    "FORM_SECURITY_SECRET or PAYLOAD_SECRET must be at least 32 characters in production.",
  );
}

export function createFormToken(formKey: string): string {
  const timestamp = Date.now().toString();
  const payload = `${formKey}.${timestamp}`;
  const signature = createHmac("sha256", secret).update(payload).digest("hex");
  return `${timestamp}.${signature}`;
}

export function verifyFormToken(
  formKey: string,
  token: string,
): { valid: boolean; age: number } {
  const [timestamp, supplied] = token.split(".");
  if (!timestamp || !supplied) return { valid: false, age: 0 };
  const parsed = Number(timestamp);
  if (!Number.isFinite(parsed)) return { valid: false, age: 0 };
  const expected = createHmac("sha256", secret)
    .update(`${formKey}.${timestamp}`)
    .digest("hex");
  const a = Buffer.from(supplied);
  const b = Buffer.from(expected);
  const age = Date.now() - parsed;
  return {
    valid:
      a.length === b.length &&
      timingSafeEqual(a, b) &&
      age >= 1500 &&
      age <= 2 * 60 * 60 * 1000,
    age,
  };
}

export function hashIP(value: string): string {
  return createHmac("sha256", secret).update(value).digest("hex");
}
