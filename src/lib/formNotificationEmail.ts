type Locale = "ar" | "en";

type FormField = {
  label?: string | null;
  name: string;
  type?: string | null;
};

type NotificationInput = {
  attribution: {
    firstTouch?: Record<string, unknown>;
    latestTouch?: Record<string, unknown>;
  };
  ctaID?: string;
  fields: FormField[];
  formKey: string;
  formTitle: string;
  locale: Locale;
  pagePath?: string;
  reference: string;
  sectionID?: string;
  submissionID: number | string;
  submittedAt: Date;
  uploads: Array<{ fieldName: string; originalName: string }>;
  values: Record<string, boolean | string>;
};

const escapeHTML = (value: unknown) =>
  String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

const displayValue = (value: boolean | string, locale: Locale) => {
  if (typeof value === "boolean") {
    if (value) return locale === "ar" ? "نعم" : "Yes";
    return locale === "ar" ? "لا" : "No";
  }
  return value || "—";
};

const campaignRows = (
  touch: Record<string, unknown> | undefined,
): Array<[string, string]> => {
  if (!touch) return [];
  const campaign =
    touch.campaign && typeof touch.campaign === "object"
      ? (touch.campaign as Record<string, unknown>)
      : {};
  return Object.entries(campaign)
    .filter(([, value]) => Boolean(value))
    .map(([key, value]) => [key, String(value)]);
};

export function buildFormNotificationEmail(input: NotificationInput) {
  const isArabic = input.locale === "ar";
  const subject = isArabic
    ? input.formKey === "simf-microsite-sponsorship"
      ? `طلب جديد لفرص الأعمال الحكومية في SIM 2026 — ${input.reference}`
      : input.formKey === "simf-b2g-application"
        ? `طلب جديد لفرص الأعمال الحكومية في SIM 2026 — ${input.reference}`
        : input.formKey === "simf-contact"
          ? `استفسار تواصل جديد عبر SIM 2026 — ${input.reference}`
          : `طلب جديد عبر موقع SIM 2026 — ${input.reference}`
    : input.formKey === "simf-microsite-sponsorship"
      ? `New SIM 2026 B2G application — ${input.reference}`
      : input.formKey === "simf-b2g-application"
        ? `New SIM 2026 B2G application — ${input.reference}`
        : input.formKey === "simf-contact"
          ? `New SIM 2026 contact enquiry — ${input.reference}`
          : `New SIM 2026 form submission — ${input.reference}`;
  const copy = isArabic
    ? {
        attribution: "بيانات الحملة",
        cta: "معرّف الدعوة لاتخاذ إجراء",
        field: "الحقل",
        form: "النموذج",
        intro:
          "تم استلام طلب جديد عبر موقع الملتقى البحري السعودي الدولي.",
        language: "اللغة",
        page: "صفحة الإرسال",
        received: "وقت الاستلام",
        reference: "الرقم المرجعي",
        section: "معرّف القسم",
        title: "طلب جديد عبر موقع SIM 2026",
        upload: "ملف مرفوع",
        value: "القيمة",
        view: "عرض الطلب في نظام إدارة المحتوى",
      }
    : {
        attribution: "Campaign attribution",
        cta: "CTA ID",
        field: "Field",
        form: "Form",
        intro:
          "A new enquiry has been submitted through the Saudi International Maritime Forum website.",
        language: "Language",
        page: "Submitted from",
        received: "Received",
        reference: "Reference",
        section: "Section ID",
        title: "New SIM 2026 website submission",
        upload: "Uploaded file",
        value: "Value",
        view: "View submission in the CMS",
      };
  const origin = (
    process.env.NEXT_PUBLIC_APP_URL || "https://sim.startime.sa"
  ).replace(/\/$/, "");
  const cmsURL = `${origin}/content-admin/collections/form-submissions/${input.submissionID}`;
  const fieldRows = input.fields.map(
    (field) =>
      [
        field.label || field.name,
        displayValue(input.values[field.name] ?? "", input.locale),
      ] as [string, string],
  );
  const uploadRows = input.uploads.map(
    (upload) =>
      [`${copy.upload} (${upload.fieldName})`, upload.originalName] as [
        string,
        string,
      ],
  );
  const latestCampaign = campaignRows(input.attribution.latestTouch);
  const details: Array<[string, string]> = [
    [copy.reference, input.reference],
    [copy.form, input.formTitle],
    [
      copy.received,
      input.submittedAt.toLocaleString(isArabic ? "ar-SA" : "en-GB", {
        dateStyle: "full",
        timeStyle: "long",
        timeZone: "Asia/Riyadh",
      }),
    ],
    [copy.language, isArabic ? "العربية" : "English"],
    [copy.page, input.pagePath || "—"],
    ...(input.sectionID
      ? ([[copy.section, input.sectionID]] as Array<[string, string]>)
      : []),
    ...(input.ctaID
      ? ([[copy.cta, input.ctaID]] as Array<[string, string]>)
      : []),
  ];
  const rows = [...details, ...fieldRows, ...uploadRows];
  const htmlRows = rows
    .map(
      ([label, value]) =>
        `<tr><th style="padding:10px 12px;border:1px solid #d9e0e7;background:#f5f7fa;text-align:${isArabic ? "right" : "left"};vertical-align:top;width:34%;font-weight:600">${escapeHTML(label)}</th><td style="padding:10px 12px;border:1px solid #d9e0e7;vertical-align:top;white-space:pre-wrap">${escapeHTML(value)}</td></tr>`,
    )
    .join("");
  const campaignHTML = latestCampaign.length
    ? `<h2 style="font-size:18px;margin:26px 0 10px;color:#152b4f">${escapeHTML(copy.attribution)}</h2><table role="presentation" style="width:100%;border-collapse:collapse">${latestCampaign
        .map(
          ([label, value]) =>
            `<tr><th style="padding:8px 12px;border:1px solid #d9e0e7;background:#f5f7fa;text-align:${isArabic ? "right" : "left"};width:34%">${escapeHTML(label)}</th><td style="padding:8px 12px;border:1px solid #d9e0e7">${escapeHTML(value)}</td></tr>`,
        )
        .join("")}</table>`
    : "";
  const textRows = rows
    .map(([label, value]) => `${label}: ${value}`)
    .join("\n");
  const campaignText = latestCampaign.length
    ? `\n\n${copy.attribution}\n${latestCampaign.map(([key, value]) => `${key}: ${value}`).join("\n")}`
    : "";

  return {
    html: `<!doctype html><html lang="${input.locale}" dir="${isArabic ? "rtl" : "ltr"}"><body style="margin:0;background:#eef2f6;color:#172235;font-family:Arial,Tahoma,sans-serif"><div style="max-width:760px;margin:0 auto;padding:28px 16px"><div style="background:#152b4f;color:#fff;padding:22px 26px;border-radius:10px 10px 0 0"><h1 style="margin:0;font-size:23px">${escapeHTML(copy.title)}</h1></div><div style="background:#fff;padding:26px;border-radius:0 0 10px 10px"><p style="margin:0 0 20px;line-height:1.7">${escapeHTML(copy.intro)}</p><table role="presentation" style="width:100%;border-collapse:collapse">${htmlRows}</table>${campaignHTML}<p style="margin:26px 0 0"><a href="${escapeHTML(cmsURL)}" style="display:inline-block;background:#152b4f;color:#fff;text-decoration:none;padding:12px 18px;border-radius:6px;font-weight:600">${escapeHTML(copy.view)}</a></p></div></div></body></html>`,
    subject,
    text: `${copy.title}\n\n${copy.intro}\n\n${textRows}${campaignText}\n\n${copy.view}: ${cmsURL}`,
  };
}
