import { createHash, randomBytes } from "node:crypto";
import configPromise from "@payload-config";
import { cookies, headers } from "next/headers";
import { NextResponse } from "next/server";
import { getPayload } from "payload";
import { verifyAttributionTouch } from "@/lib/attributionSecurity";
import { buildFormNotificationEmail } from "@/lib/formNotificationEmail";
import { hashIP, verifyFormToken } from "@/lib/formSecurity";
import { isTrustedMutationOrigin } from "@/lib/requestSecurity";

export const runtime = "nodejs";

const MAX_BODY_BYTES = 8 * 1024 * 1024;
const MAX_FILE_BYTES = 5 * 1024 * 1024;
const activeRateReservations = new Map<string, number>();
const DEFAULT_CAMPAIGN_PARAMETERS = [
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

type PreparedUpload = {
  buffer: Buffer;
  fieldName: string;
  hash: string;
  mimetype: string;
  originalName: string;
  safeName: string;
};

function clean(value: unknown, max = 5000): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export async function POST(request: Request) {
  if (!isTrustedMutationOrigin(request)) {
    return NextResponse.json(
      { error: "Invalid request origin." },
      { status: 403 },
    );
  }
  const length = Number(request.headers.get("content-length") || 0);
  if (length > MAX_BODY_BYTES) {
    return NextResponse.json(
      { error: "Request is too large." },
      { status: 413 },
    );
  }

  const contentType = request.headers.get("content-type") || "";
  if (
    !contentType.startsWith("multipart/form-data") &&
    !contentType.startsWith("application/x-www-form-urlencoded")
  ) {
    return NextResponse.json(
      { error: "Unsupported form content type." },
      { status: 415 },
    );
  }

  let data: FormData;
  try {
    data = await request.formData();
  } catch {
    return NextResponse.json(
      { error: "Malformed form request." },
      { status: 400 },
    );
  }
  let parsedBodyBytes = 0;
  for (const [, entry] of data.entries()) {
    parsedBodyBytes +=
      entry instanceof File ? entry.size : Buffer.byteLength(entry, "utf8");
  }
  if (parsedBodyBytes > MAX_BODY_BYTES) {
    return NextResponse.json(
      { error: "Request is too large." },
      { status: 413 },
    );
  }
  const formKey = clean(data.get("_formKey"), 100);
  const token = clean(data.get("_token"), 300);
  if (!formKey || !verifyFormToken(formKey, token).valid) {
    return NextResponse.json(
      { error: "This form session expired. Refresh the page and try again." },
      { status: 400 },
    );
  }
  if (clean(data.get("companyWebsite"), 200)) {
    return NextResponse.json({ ok: true });
  }

  const payload = await getPayload({ config: configPromise });
  const forms = await payload.find({
    collection: "forms",
    depth: 0,
    limit: 1,
    locale: clean(data.get("_locale"), 2) === "ar" ? "ar" : "en",
    overrideAccess: true,
    where: {
      and: [{ formKey: { equals: formKey } }, { active: { equals: true } }],
    },
  });
  const form = forms.docs[0];
  if (!form) {
    return NextResponse.json(
      { error: "Form is unavailable." },
      { status: 404 },
    );
  }
  const marketingSettings = await payload.findGlobal({
    slug: "marketing-settings",
    draft: false,
    locale: "en",
    overrideAccess: true,
  });
  const acceptedCampaignParameters = new Set(
    [
      ...DEFAULT_CAMPAIGN_PARAMETERS,
      ...String(marketingSettings.acceptedCampaignParameters || "")
        .split(",")
        .map((key) => key.trim())
        .filter((key) => /^[a-z][a-z0-9_]{0,63}$/i.test(key)),
    ].slice(0, 30),
  );

  const headerStore = await headers();
  const forwarded = headerStore
    .get("x-forwarded-for")
    ?.split(",")
    .at(-1)
    ?.trim();
  const ipHash = hashIP(headerStore.get("x-real-ip") || forwarded || "unknown");
  const windowMinutes = Number(form.rateLimit?.windowMinutes || 15);
  const limit = Number(form.rateLimit?.requests || 5);
  const recent = await payload.count({
    collection: "form-submissions",
    overrideAccess: true,
    where: {
      and: [
        { ipHash: { equals: ipHash } },
        { formKey: { equals: formKey } },
        {
          createdAt: {
            greater_than: new Date(
              Date.now() - windowMinutes * 60 * 1000,
            ).toISOString(),
          },
        },
      ],
    },
  });
  const reservationKey = `${formKey}:${ipHash}`;
  const activeReservations = activeRateReservations.get(reservationKey) || 0;
  if (recent.totalDocs + activeReservations >= limit) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429, headers: { "retry-after": String(windowMinutes * 60) } },
    );
  }
  activeRateReservations.set(reservationKey, activeReservations + 1);

  try {
    const values: Record<string, string | boolean> = Object.create(null);
    const preparedUploads: PreparedUpload[] = [];
    for (const field of form.fields || []) {
      const entry = data.get(field.name);
      if (field.type === "file") {
        if (!(entry instanceof File) || !entry.size) {
          if (field.required) {
            return NextResponse.json(
              { error: `${field.label} is required.` },
              { status: 400 },
            );
          }
          continue;
        }
        const allowed = field.allowedFileTypes || [];
        if (
          entry.size > MAX_FILE_BYTES ||
          (allowed.length &&
            !allowed.includes(entry.type as (typeof allowed)[number]))
        ) {
          return NextResponse.json(
            { error: `${field.label} has an unsupported file type or size.` },
            { status: 400 },
          );
        }
        const buffer = Buffer.from(await entry.arrayBuffer());
        const signature = buffer.subarray(0, 8).toString("hex");
        const signatures: Record<string, string[]> = {
          "application/pdf": ["25504446"],
          "image/jpeg": ["ffd8ff"],
          "image/png": ["89504e470d0a1a0a"],
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
            ["504b0304"],
        };
        if (
          signatures[entry.type] &&
          !signatures[entry.type].some((prefix) => signature.startsWith(prefix))
        ) {
          return NextResponse.json(
            { error: `${field.label} could not be verified.` },
            { status: 400 },
          );
        }
        preparedUploads.push({
          buffer,
          fieldName: field.name,
          hash: createHash("sha256").update(buffer).digest("hex"),
          mimetype: entry.type,
          originalName: entry.name.slice(0, 200),
          safeName: entry.name.replace(/[^a-zA-Z0-9._-]/g, "-").slice(-120),
        });
        values[field.name] = preparedUploads.at(-1)?.hash || "";
        continue;
      }
      if (
        typeof entry === "string" &&
        entry.length > Number(field.maxLength || 5000)
      ) {
        return NextResponse.json(
          { error: `${field.label} is too long.` },
          { status: 400 },
        );
      }
      const value =
        field.type === "checkbox"
          ? entry === "yes"
          : clean(entry, Number(field.maxLength || 5000));
      if (field.required && (value === "" || value === false)) {
        return NextResponse.json(
          { error: `${field.label} is required.` },
          { status: 400 },
        );
      }
      if (
        field.type === "email" &&
        value &&
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value))
      ) {
        return NextResponse.json(
          { error: `${field.label} is invalid.` },
          { status: 400 },
        );
      }
      if (
        field.type === "select" &&
        value &&
        !field.options?.some((option) => option.value === value)
      ) {
        return NextResponse.json(
          { error: `${field.label} is invalid.` },
          { status: 400 },
        );
      }
      if (field.type === "number" && value && !Number.isFinite(Number(value))) {
        return NextResponse.json(
          { error: `${field.label} is invalid.` },
          { status: 400 },
        );
      }
      if (
        field.type === "date" &&
        value &&
        (!/^\d{4}-\d{2}-\d{2}$/.test(String(value)) ||
          Number.isNaN(Date.parse(`${value}T00:00:00Z`)))
      ) {
        return NextResponse.json(
          { error: `${field.label} is invalid.` },
          { status: 400 },
        );
      }
      if (field.type === "url" && value) {
        try {
          const parsed = new URL(String(value));
          if (!["http:", "https:"].includes(parsed.protocol)) throw new Error();
        } catch {
          return NextResponse.json(
            { error: `${field.label} is invalid.` },
            { status: 400 },
          );
        }
      }
      if (
        field.type === "tel" &&
        value &&
        !/^[+()\d\s.-]{7,30}$/.test(String(value))
      ) {
        return NextResponse.json(
          { error: `${field.label} is invalid.` },
          { status: 400 },
        );
      }
      values[field.name] = value;
    }

    const cookieStore = await cookies();
    const parseTouch = (name: string) => {
      try {
        const parsed =
          verifyAttributionTouch(cookieStore.get(name)?.value) || {};
        const rawCampaign =
          parsed.campaign && typeof parsed.campaign === "object"
            ? (parsed.campaign as Record<string, unknown>)
            : {};
        return {
          campaign: Object.fromEntries(
            Object.entries(rawCampaign)
              .filter(([key]) => /^[a-z][a-z0-9_]{0,63}$/i.test(key))
              .slice(0, 30)
              .map(([key, value]) => [key, clean(String(value || ""), 200)])
              .filter(([, value]) => Boolean(value)),
          ),
          capturedAt: clean(parsed.capturedAt, 40),
          landingPage: clean(parsed.landingPage, 500),
          referrer: clean(parsed.referrer, 500),
          sessionID: clean(parsed.sessionID, 100),
        };
      } catch {
        return {};
      }
    };
    const parseClientTouch = (
      value: unknown,
    ): Record<string, unknown> | undefined => {
      if (!value || typeof value !== "object") return undefined;
      const touch = value as Record<string, unknown>;
      const rawCampaign =
        touch.campaign && typeof touch.campaign === "object"
          ? (touch.campaign as Record<string, unknown>)
          : {};
      const campaign = Object.fromEntries(
        Object.entries(rawCampaign)
          .filter(([key]) => acceptedCampaignParameters.has(key))
          .map(([key, campaignValue]) => [
            key,
            clean(String(campaignValue || ""), 200),
          ])
          .filter(([, campaignValue]) => Boolean(campaignValue)),
      );
      if (!Object.keys(campaign).length && !clean(touch.referrer, 500))
        return undefined;
      return {
        campaign,
        capturedAt: clean(touch.capturedAt, 40),
        landingPage: clean(touch.landingPage, 500),
        referrer: clean(touch.referrer, 500),
        sessionID: clean(touch.sessionID, 100),
      };
    };
    let clientAttribution: Record<string, unknown> = {};
    try {
      clientAttribution = JSON.parse(
        clean(data.get("_attribution"), 8000) || "{}",
      ) as Record<string, unknown>;
    } catch {
      clientAttribution = {};
    }
    const cookieFirstTouch = parseTouch("st_first_touch");
    const cookieLatestTouch = parseTouch("st_latest_touch");
    const hasTouch = (touch: Record<string, unknown>) =>
      Boolean(
        Object.keys(
          touch.campaign && typeof touch.campaign === "object"
            ? (touch.campaign as Record<string, unknown>)
            : {},
        ).length || clean(touch.referrer, 500),
      );
    const firstTouch =
      hasTouch(cookieFirstTouch)
        ? cookieFirstTouch
        : parseClientTouch(clientAttribution.firstTouch) || {};
    const latestTouch =
      hasTouch(cookieLatestTouch)
        ? cookieLatestTouch
        : parseClientTouch(clientAttribution.latestTouch) || {};
    const reference = `ST-${new Date().toISOString().slice(0, 10).replaceAll("-", "")}-${randomBytes(4).toString("hex").toUpperCase()}`;
    const uploadIDs: number[] = [];
    let submissionID: number | string | undefined;
    try {
      for (const prepared of preparedUploads) {
        const upload = await payload.create({
          collection: "form-uploads",
          data: {
            fieldName: prepared.fieldName,
            formKey,
            originalName: prepared.originalName,
          },
          file: {
            data: prepared.buffer,
            mimetype: prepared.mimetype,
            name: `${Date.now()}-${randomBytes(4).toString("hex")}-${prepared.safeName}`,
            size: prepared.buffer.length,
          },
          overrideAccess: true,
        });
        uploadIDs.push(Number(upload.id));
      }
      const submission = await payload.create({
        collection: "form-submissions",
        data: {
          attribution: {
            currentSessionID: clean(data.get("_sessionID"), 100),
            firstTouch,
            landingPage: clean(data.get("_pagePath"), 500),
            latestTouch,
            referrer: headerStore.get("referer")?.slice(0, 500) || "",
            visitorID: /^[0-9a-f-]{36}$/i.test(
              cookieStore.get("st_visitor_id")?.value || "",
            )
              ? cookieStore.get("st_visitor_id")?.value
              : "",
          },
          ctaID: clean(data.get("_ctaID"), 120),
          conversionCurrency: clean(
            form.conversionCurrency || "",
            3,
          ).toUpperCase(),
          conversionValue: Number(form.conversionValue || 0),
          data: values,
          form: form.id,
          formKey,
          ipHash,
          locale: clean(data.get("_locale"), 2) === "ar" ? "ar" : "en",
          pagePath: clean(data.get("_pagePath"), 500),
          reference,
          sectionID: clean(data.get("_sectionID"), 120),
          status: "new",
          uploads: uploadIDs,
          userAgent: headerStore.get("user-agent")?.slice(0, 500) || "",
        },
        overrideAccess: true,
      });
      submissionID = submission.id;
    } catch {
      await Promise.allSettled(
        uploadIDs.map((id) =>
          payload.delete({
            collection: "form-uploads",
            id,
            overrideAccess: true,
          }),
        ),
      );
      return NextResponse.json(
        {
          error: "We could not securely store this request. Please try again.",
        },
        { status: 500 },
      );
    }

    if (
      submissionID !== undefined &&
      process.env.SMTP_HOST &&
      process.env.SMTP_USER &&
      process.env.SMTP_PASSWORD
    ) {
      const locale = clean(data.get("_locale"), 2) === "ar" ? "ar" : "en";
      const message = buildFormNotificationEmail({
        attribution: { firstTouch, latestTouch },
        ctaID: clean(data.get("_ctaID"), 120),
        fields: (form.fields || []).map((field) => ({
          label: field.label,
          name: field.name,
          type: field.type,
        })),
        formKey,
        formTitle: form.internalTitle,
        locale,
        pagePath: clean(data.get("_pagePath"), 500),
        reference,
        sectionID: clean(data.get("_sectionID"), 120),
        submissionID,
        submittedAt: new Date(),
        uploads: preparedUploads.map(({ fieldName, originalName }) => ({
          fieldName,
          originalName,
        })),
        values,
      });
      const to =
        process.env.FORM_NOTIFICATION_EMAIL?.trim() || "sim@startime.sa";
      const cc =
        process.env.FORM_NOTIFICATION_CC?.trim() || "website@startime.sa";
      const additionalRecipients = (form.notificationEmails || [])
        .map((recipient) => recipient.email?.trim())
        .filter(
          (email): email is string =>
            Boolean(email) &&
            ![to.toLowerCase(), cc.toLowerCase()].includes(
              email.toLowerCase(),
            ),
        );
      const replyTo = (form.fields || [])
        .filter((field) => field.type === "email")
        .map((field) => values[field.name])
        .find(
          (value): value is string =>
            typeof value === "string" && Boolean(value),
        );

      try {
        const delivery = await payload.sendEmail({
          ...(additionalRecipients.length
            ? { bcc: additionalRecipients }
            : {}),
          cc,
          html: message.html,
          ...(replyTo ? { replyTo } : {}),
          subject: message.subject,
          text: message.text,
          to,
        });
        const deliveryResult = delivery as {
          accepted?: unknown[];
          messageId?: string;
          rejected?: unknown[];
        };
        payload.logger.info({
          accepted: deliveryResult.accepted?.map(String) || [],
          messageId: deliveryResult.messageId,
          msg: `Form notification email accepted for ${reference}.`,
          rejected: deliveryResult.rejected?.map(String) || [],
        });
        console.info(
          JSON.stringify({
            accepted: deliveryResult.accepted?.map(String) || [],
            formKey,
            message: "Form notification email accepted.",
            messageId: deliveryResult.messageId,
            reference,
            rejected: deliveryResult.rejected?.map(String) || [],
          }),
        );
      } catch (error) {
        payload.logger.error({
          err: error,
          msg: `Form notification email failed for ${reference}. The submission remains stored in the CMS.`,
        });
        console.error("Form notification email failed.", {
          error,
          formKey,
          reference,
        });
      }
    }

    return NextResponse.json(
      {
        attribution: {
          firstTouch,
          latestTouch,
        },
        conversionCurrency: clean(
          form.conversionCurrency || "",
          3,
        ).toUpperCase(),
        conversionValue: Number(form.conversionValue || 0),
        ok: true,
        reference,
      },
      { headers: { "cache-control": "no-store" } },
    );
  } finally {
    const remaining = (activeRateReservations.get(reservationKey) || 1) - 1;
    if (remaining > 0) {
      activeRateReservations.set(reservationKey, remaining);
    } else {
      activeRateReservations.delete(reservationKey);
    }
  }
}
