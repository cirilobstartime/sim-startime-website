import type { PayloadHandler } from "payload";

type Submission = Record<string, unknown> & {
  attribution?: Record<string, unknown>;
  data?: Record<string, unknown>;
};

function scalar(value: unknown): string {
  if (value === null || value === undefined) return "";
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean")
    return String(value);
  return JSON.stringify(value);
}

function safeCell(value: unknown): string {
  let text = scalar(value).replaceAll("\r\n", "\n").replaceAll("\r", "\n");
  if (/^[=+\-@]/.test(text)) text = `'${text}`;
  return `"${text.replaceAll('"', '""')}"`;
}

function touchColumns(
  row: Record<string, unknown>,
  touch: unknown,
  prefix: "first_touch" | "latest_touch",
) {
  if (!touch || typeof touch !== "object") return;
  const value = touch as Record<string, unknown>;
  row[`${prefix}.capturedAt`] = value.capturedAt;
  row[`${prefix}.landingPage`] = value.landingPage;
  row[`${prefix}.referrer`] = value.referrer;
  row[`${prefix}.sessionID`] = value.sessionID;
  if (value.campaign && typeof value.campaign === "object") {
    for (const [key, campaignValue] of Object.entries(
      value.campaign as Record<string, unknown>,
    )) {
      row[`${prefix}.${key}`] = campaignValue;
    }
  }
}

function flattenSubmission(doc: Submission): Record<string, unknown> {
  const attribution =
    doc.attribution && typeof doc.attribution === "object"
      ? doc.attribution
      : {};
  const row: Record<string, unknown> = {
    reference: doc.reference,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
    status: doc.status,
    formKey: doc.formKey,
    locale: doc.locale,
    pagePath: doc.pagePath,
    sectionID: doc.sectionID,
    ctaID: doc.ctaID,
    conversionValue: doc.conversionValue,
    conversionCurrency: doc.conversionCurrency,
    visitorID: attribution.visitorID,
    currentSessionID: attribution.currentSessionID,
    conversionLandingPage: attribution.landingPage,
    conversionReferrer: attribution.referrer,
    uploads: Array.isArray(doc.uploads)
      ? doc.uploads
          .map((upload) =>
            upload && typeof upload === "object" && "id" in upload
              ? (upload as { id: unknown }).id
              : upload,
          )
          .join("|")
      : doc.uploads,
    notes: doc.notes,
  };
  touchColumns(row, attribution.firstTouch, "first_touch");
  touchColumns(row, attribution.latestTouch, "latest_touch");
  if (doc.data && typeof doc.data === "object") {
    for (const [key, value] of Object.entries(doc.data)) {
      row[`form.${key}`] = value;
    }
  }
  return row;
}

export const exportFormSubmissionsCSV: PayloadHandler = async (req) => {
  if (!req.user) {
    return Response.json({ error: "Authentication required." }, { status: 401 });
  }

  const rows: Record<string, unknown>[] = [];
  let page = 1;
  let hasNextPage = true;
  while (hasNextPage) {
    const result = await req.payload.find({
      collection: "form-submissions",
      depth: 0,
      limit: 500,
      overrideAccess: false,
      page,
      req,
      sort: "-createdAt",
    });
    rows.push(
      ...(result.docs as unknown as Submission[]).map(flattenSubmission),
    );
    hasNextPage = result.hasNextPage;
    page += 1;
  }

  const preferred = [
    "reference",
    "createdAt",
    "updatedAt",
    "status",
    "formKey",
    "locale",
    "pagePath",
    "sectionID",
    "ctaID",
    "conversionValue",
    "conversionCurrency",
    "visitorID",
    "currentSessionID",
    "conversionLandingPage",
    "conversionReferrer",
    "uploads",
    "notes",
  ];
  const discovered = new Set(rows.flatMap((row) => Object.keys(row)));
  const headers = [
    ...preferred,
    ...[...discovered]
      .filter((key) => !preferred.includes(key))
      .sort((a, b) => a.localeCompare(b)),
  ];
  const csv = [
    headers.map(safeCell).join(","),
    ...rows.map((row) =>
      headers.map((header) => safeCell(row[header])).join(","),
    ),
  ].join("\r\n");
  const stamp = new Date().toISOString().slice(0, 10);

  return new Response(`\uFEFF${csv}`, {
    headers: {
      "cache-control": "no-store",
      "content-disposition": `attachment; filename="simf-form-submissions-${stamp}.csv"`,
      "content-type": "text/csv; charset=utf-8",
      "x-content-type-options": "nosniff",
    },
  });
};
