"use client";

const STORAGE_KEY = "st_attribution_context";

export type AttributionTouch = {
  campaign?: Record<string, string>;
  capturedAt?: string;
  landingPage?: string;
  referrer?: string;
  sessionID?: string;
};

export type AttributionContext = {
  expiresAt?: number;
  firstTouch?: AttributionTouch;
  latestTouch?: AttributionTouch;
};

function cleanCampaign(
  campaign: Record<string, unknown> | undefined,
): Record<string, string> {
  return Object.fromEntries(
    Object.entries(campaign || {})
      .filter(([key]) => /^[a-z][a-z0-9_]{0,63}$/i.test(key))
      .slice(0, 30)
      .map(([key, value]) => [key, String(value || "").trim().slice(0, 200)])
      .filter(([, value]) => Boolean(value)),
  );
}

function cleanTouch(touch?: AttributionTouch): AttributionTouch | undefined {
  if (!touch) return undefined;
  return {
    campaign: cleanCampaign(touch.campaign),
    capturedAt: String(touch.capturedAt || "").slice(0, 40),
    landingPage: String(touch.landingPage || "").slice(0, 500),
    referrer: String(touch.referrer || "").slice(0, 500),
    sessionID: String(touch.sessionID || "").slice(0, 100),
  };
}

export function readClientAttribution(): AttributionContext {
  try {
    const parsed = JSON.parse(
      window.localStorage.getItem(STORAGE_KEY) || "{}",
    ) as AttributionContext;
    if (parsed.expiresAt && parsed.expiresAt < Date.now()) {
      window.localStorage.removeItem(STORAGE_KEY);
      return {};
    }
    return {
      expiresAt: parsed.expiresAt,
      firstTouch: cleanTouch(parsed.firstTouch),
      latestTouch: cleanTouch(parsed.latestTouch),
    };
  } catch {
    return {};
  }
}

export function recordClientAttribution({
  campaign,
  landingPage,
  referrer,
  retentionDays,
  sessionID,
}: {
  campaign: Record<string, string>;
  landingPage: string;
  referrer: string;
  retentionDays: number;
  sessionID: string;
}) {
  const sanitizedCampaign = cleanCampaign(campaign);
  if (!Object.keys(sanitizedCampaign).length && !referrer) return;
  const existing = readClientAttribution();
  const touch: AttributionTouch = {
    campaign: sanitizedCampaign,
    capturedAt: new Date().toISOString(),
    landingPage: landingPage.slice(0, 500),
    referrer: referrer.slice(0, 500),
    sessionID: sessionID.slice(0, 100),
  };
  const context: AttributionContext = {
    expiresAt:
      Date.now() +
      Math.max(1, Math.min(395, retentionDays)) * 24 * 60 * 60 * 1000,
    firstTouch: existing.firstTouch || touch,
    latestTouch: touch,
  };
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(context));
  } catch {
    // Signed first-party cookies remain the source of truth when browser
    // storage is unavailable.
  }
}

function flattenTouch(
  target: Record<string, unknown>,
  touch: AttributionTouch | undefined,
  prefix: "first_touch_" | "latest_touch_",
) {
  if (!touch) return;
  for (const [key, value] of Object.entries(cleanCampaign(touch.campaign))) {
    target[`${prefix}${key}`] = value;
    if (prefix === "latest_touch_") target[key] = value;
  }
  if (touch.landingPage) target[`${prefix}landing_page`] = touch.landingPage;
  if (touch.referrer) target[`${prefix}referrer`] = touch.referrer;
  if (touch.capturedAt) target[`${prefix}captured_at`] = touch.capturedAt;
}

export function attributionDataLayerFields(
  context: AttributionContext = readClientAttribution(),
): Record<string, unknown> {
  const fields: Record<string, unknown> = {};
  flattenTouch(fields, context.firstTouch, "first_touch_");
  flattenTouch(fields, context.latestTouch, "latest_touch_");
  return fields;
}
