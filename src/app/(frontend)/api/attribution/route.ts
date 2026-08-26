import configPromise from "@payload-config";
import { randomUUID } from "node:crypto";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getPayload } from "payload";
import { signAttributionTouch } from "@/lib/attributionSecurity";
import { isTrustedMutationOrigin } from "@/lib/requestSecurity";

const defaultParameters = [
  "utm_id",
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
  "utm_source_platform",
  "gclid",
  "gbraid",
  "wbraid",
  "fbclid",
  "msclkid",
  "ttclid",
  "li_fat_id",
  "twclid",
];

function clean(value: unknown, max = 500): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export async function POST(request: Request) {
  if (!isTrustedMutationOrigin(request)) {
    return NextResponse.json({ ok: false }, { status: 403 });
  }
  if (Number(request.headers.get("content-length") || 0) > 16 * 1024) {
    return NextResponse.json({ ok: false }, { status: 413 });
  }

  let body: Record<string, unknown>;
  try {
    const raw = await request.text();
    if (Buffer.byteLength(raw, "utf8") > 16 * 1024) {
      return NextResponse.json({ ok: false }, { status: 413 });
    }
    body = JSON.parse(raw) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const payload = await getPayload({ config: configPromise });
  const settings = await payload.findGlobal({
    slug: "marketing-settings",
    draft: false,
    locale: "en",
    overrideAccess: true,
  });
  const allowed = new Set(
    [
      ...defaultParameters,
      ...(settings.acceptedCampaignParameters || "")
        .split(",")
        .map((key) => key.trim())
        .filter((key) => /^[a-z][a-z0-9_]{0,63}$/i.test(key)),
    ].slice(0, 30),
  );
  const publicOrigin = new URL(process.env.NEXT_PUBLIC_APP_URL || request.url)
    .origin;
  let landingURL: URL | null = null;
  try {
    const referer = request.headers.get("referer");
    const parsed = referer ? new URL(referer) : null;
    if (parsed && parsed.origin === publicOrigin) {
      landingURL = parsed;
    }
  } catch {
    landingURL = null;
  }
  const campaign = Object.fromEntries(
    [...(landingURL?.searchParams.entries() || [])]
      .filter(([key]) => allowed.has(key))
      .map(([key, value]) => [key, clean(value, 200)])
      .filter(([, value]) => Boolean(value)),
  );
  let externalReferrer = "";
  try {
    const candidate = new URL(clean(body.referrer));
    if (candidate.origin !== publicOrigin) {
      externalReferrer = candidate.toString().slice(0, 500);
    }
  } catch {
    externalReferrer = "";
  }
  const touch = signAttributionTouch({
    campaign,
    capturedAt: new Date().toISOString(),
    landingPage: landingURL
      ? `${landingURL.pathname}${landingURL.search}`.slice(0, 500)
      : "",
    referrer: externalReferrer,
    sessionID: clean(body.sessionID, 100),
  });
  const store = await cookies();
  const retentionDays = Math.max(
    1,
    Math.min(395, Number(settings.attributionCookieDays || 90)),
  );
  const forwardedProtocol = request.headers.get("x-forwarded-proto");
  const secure =
    forwardedProtocol === "https" ||
    (!forwardedProtocol && new URL(request.url).protocol === "https:");
  const options = {
    httpOnly: true,
    maxAge: retentionDays * 24 * 60 * 60,
    path: "/",
    sameSite: "lax" as const,
    secure,
    ...(safeCookieDomain(
      clean(settings.attributionCookieDomain, 200),
      request.headers.get("host") || "",
    )
      ? {
          domain: safeCookieDomain(
            clean(settings.attributionCookieDomain, 200),
            request.headers.get("host") || "",
          ),
        }
      : {}),
  };
  if (!store.has("st_visitor_id")) {
    store.set("st_visitor_id", randomUUID(), options);
  }
  if (Object.keys(campaign).length || externalReferrer) {
    if (!store.has("st_first_touch")) {
      store.set("st_first_touch", touch, options);
    }
    store.set("st_latest_touch", touch, options);
  }

  return NextResponse.json(
    { ok: true },
    { headers: { "cache-control": "no-store" } },
  );
}

function safeCookieDomain(value: string, requestHost: string): string | undefined {
  const normalized = value.trim().toLowerCase();
  if (!/^\.?[a-z0-9.-]+$/.test(normalized)) return undefined;
  const base = normalized.replace(/^\./, "");
  const host = requestHost.split(":")[0].toLowerCase();
  if (host !== base && !host.endsWith(`.${base}`)) return undefined;
  return `.${base}`;
}
