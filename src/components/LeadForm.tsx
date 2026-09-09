"use client";

import { ArrowRight, CheckCircle, CircleNotch } from "@phosphor-icons/react";
import { useState } from "react";
import type { FormDefinition, Locale } from "@/content/types";
import {
  attributionDataLayerFields,
  readClientAttribution,
  type AttributionContext,
} from "@/lib/clientAttribution";
import { getOrCreateSessionID } from "@/lib/clientSession";
import { pushDataLayerEvent } from "@/lib/dataLayer";

type Props = {
  ctaID?: string | null;
  form: FormDefinition;
  locale: Locale;
  pagePath: string;
  privacyNote?: string | null;
  sectionID?: string | null;
  successHeading: string;
  successMessage: string;
  token: string;
};

const arabicFieldLabels: Record<string, string> = {
  organizationName: "اسم الجهة",
  organization: "الجهة",
  website: "الموقع الإلكتروني للجهة",
  organizationWebsite: "الموقع الإلكتروني للجهة",
  headquartersCountry: "دولة المقر الرئيسي",
  operatingCountries: "الدول الرئيسية التي تعمل فيها الجهة",
  industry: "القطاع والمجال",
  organizationOverview: "نبذة عن الجهة",
  capabilities: "المنتجات أو الخدمات أو القدرات ذات الصلة",
  name: "الاسم الكامل",
  fullName: "الاسم الكامل",
  contactPerson: "اسم مسؤول التواصل",
  jobTitle: "المسمى الوظيفي",
  department: "الإدارة",
  email: "البريد الإلكتروني للعمل",
  workEmail: "البريد الإلكتروني للعمل",
  phone: "رقم الهاتف",
  mobileNumber: "رقم الجوال مع رمز الدولة",
  country: "الدولة",
  organizationSector: "قطاع الجهة",
  relevantCapabilities: "القدرات أو الحلول ذات الصلة",
  preferredStakeholders: "الجهات التي تفضّلون التواصل معها",
  meetingObjectives: "الأهداف الرئيسية للاجتماعات المطلوبة",
  discussionTopics: "موضوعات النقاش المقترحة",
  representatives: "عدد ممثلي الجهة ومستوياتهم الوظيفية",
  companyProfile: "ملف تعريفي بالجهة",
  enquiryType: "نوع الاستفسار",
  message: "كيف يمكن لفريق ملتقى 2026 مساعدتك؟",
  preferredCategory: "فئة الرعاية المفضلة",
  alternativeCategory: "الفئة البديلة",
  primaryObjective: "هدف الرعاية الرئيسي",
  secondaryObjective: "هدف الرعاية الثانوي",
  interestB2G: "الاهتمام باجتماعات الأعمال الحكومية",
  governmentInterests: "القطاعات أو الجهات الحكومية ذات الصلة",
  exhibitionRequirements: "متطلبات مساحة المعرض",
  programmeMediaInterest: "الاهتمام بالمشاركة في البرنامج أو الإعلام",
  regionalPresence: "الحضور الحالي في السعودية أو دول مجلس التعاون",
  saudiPartnerships: "الشراكات أو المشاريع الحالية في السعودية",
  localizationObjectives: "أهداف التوطين أو تطوير السوق",
  previousParticipation: "مشاركات سابقة في رعاية أو معارض",
  additionalInformation: "معلومات أو متطلبات إضافية",
  consent: "أوافق على تواصل فريق ملتقى 2026 معي ومعالجة الطلب.",
};

const arabicOptionLabels: Record<string, string> = {
  programme: "البرنامج",
  speakers: "المتحدثون",
  partnership: "الشراكات",
  sponsorship: "الرعاية",
  b2g: "فرص الأعمال الحكومية",
  media: "الإعلام",
  other: "أخرى",
  strategic: "الراعي الاستراتيجي",
  sector: "راعي القطاع",
  diamond: "الراعي الماسي",
  platinum: "الراعي البلاتيني",
  gold: "الراعي الذهبي",
  silver: "الراعي الفضي",
  "co-sponsor": "الراعي المشارك",
  "official-carrier": "الناقل الرسمي",
  hospitality: "راعي الضيافة",
};

const arabicGroupHeadings: Record<string, string> = {
  "Organization Information": "بيانات الجهة",
  "Primary Contact": "مسؤول التواصل",
  "Sponsorship Interest": "الاهتمام بالرعاية",
  "Strategic Context": "السياق الاستراتيجي",
  "Consent and Submission": "الموافقة والإرسال",
};

function normalizeConsentText(value: string) {
  return value
    .replace(/^[□☐\s]+/u, "")
    .replace(/[.،\s]+$/u, "")
    .replace(/\s+/g, " ")
    .trim();
}

function submitLabel(formKey: string, locale: Locale, fallback: string) {
  if (fallback.trim()) return fallback;
  if (locale !== "ar") return "Submit";
  if (formKey === "simf-b2g-application")
    return "طلب التواصل بشأن فرص الأعمال الحكومية";
  if (formKey === "simf-contact") return "إرسال الاستفسار";
  if (formKey === "simf-microsite-sponsorship")
    return "طلب التواصل بشأن الرعاية";
  return "إرسال طلب الرعاية";
}

export function LeadForm({
  ctaID,
  form,
  locale,
  pagePath,
  privacyNote,
  sectionID,
  successHeading,
  successMessage,
  token,
}: Props) {
  const [state, setState] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [error, setError] = useState("");
  const normalizedPrivacyNote = privacyNote
    ? normalizeConsentText(privacyNote)
    : "";
  const privacyRepeatsCheckbox = Boolean(
    normalizedPrivacyNote &&
      form.fields?.some(
        (field) =>
          field.type === "checkbox" &&
          normalizeConsentText(
            field.label ||
              (locale === "ar"
                ? arabicFieldLabels[field.name] || field.name
                : field.name),
          ) === normalizedPrivacyNote,
      ),
  );

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    setState("submitting");
    setError("");
    const data = new FormData(event.currentTarget);
    data.set("_formKey", form.formKey);
    data.set("_locale", locale);
    data.set("_pagePath", pagePath);
    data.set("_sectionID", sectionID || "");
    data.set("_ctaID", ctaID || "");
    data.set("_token", token);
    data.set("_sessionID", getOrCreateSessionID());
    data.set("_attribution", JSON.stringify(readClientAttribution()));

    const response = await fetch("/api/forms/submit", {
      body: data,
      credentials: "same-origin",
      method: "POST",
    });
    const result = (await response.json().catch(() => ({}))) as {
      conversionCurrency?: string;
      conversionValue?: number;
      attribution?: AttributionContext;
      error?: string;
      reference?: string;
    };
    if (!response.ok) {
      pushDataLayerEvent({
        event: "startime_form_error",
        form_key: form.formKey,
        page_path: pagePath,
        response_status: response.status,
      });
      setError(
        result.error ||
          (locale === "ar"
            ? "تعذر إرسال الطلب. يرجى المحاولة مرة أخرى."
            : "We could not send your request. Please try again."),
      );
      setState("error");
      return;
    }
    const conversionValue = Number(result.conversionValue || 0);
    const conversionCurrency = result.conversionCurrency || undefined;
    const attribution = attributionDataLayerFields(result.attribution);
    pushDataLayerEvent({
      event: "startime_form_success",
      ...attribution,
      conversion_currency: conversionCurrency,
      conversion_value: conversionValue,
      form_key: form.formKey,
      page_path: pagePath,
      submission_reference: result.reference || "",
    });
    pushDataLayerEvent({
      event: "generate_lead",
      ...attribution,
      currency: conversionCurrency,
      form_key: form.formKey,
      page_path: pagePath,
      submission_reference: result.reference || "",
      value: conversionValue,
    });
    setState("success");
    formElement.reset();
  }

  if (state === "success") {
    return (
      <div className="lead-form__success" role="status">
        <CheckCircle aria-hidden weight="fill" />
        <h3>{successHeading}</h3>
        <p>{successMessage}</p>
      </div>
    );
  }

  return (
    <form
      className="lead-form"
      data-form-key={form.formKey}
      encType="multipart/form-data"
      onSubmit={submit}
    >
      <div aria-hidden className="lead-form__trap">
        <label>
          {locale === "ar" ? "الموقع الإلكتروني" : "Website"}
          <input autoComplete="off" name="companyWebsite" tabIndex={-1} />
        </label>
      </div>
      <div className="lead-form__grid">
        {form.fields?.map((field) => {
          const configuredFieldLabel =
            field.label ||
            (locale === "ar"
              ? arabicFieldLabels[field.name] || field.name
              : field.name);
          const fieldLabel =
            field.type === "checkbox"
              ? configuredFieldLabel.replace(/^[□☐\s]+/u, "")
              : configuredFieldLabel;
          const groupHeading =
            locale === "ar" && field.groupHeading
              ? arabicGroupHeadings[field.groupHeading] || field.groupHeading
              : field.groupHeading;
          const common = {
            "aria-describedby": field.helpText
              ? `${field.name}-help`
              : undefined,
            autoComplete: field.autocomplete || undefined,
            id: field.name,
            maxLength: field.maxLength || undefined,
            name: field.name,
            placeholder: field.placeholder || undefined,
            required: Boolean(field.required),
          };
          return (
            <div
              className={`lead-form__field lead-form__field--${
                field.width || "full"
              }`}
              key={field.id || field.name}
            >
              {groupHeading ? (
                <h3 className="lead-form__group-heading">
                  {groupHeading}
                </h3>
              ) : null}
              {field.type === "checkbox" ? (
                <label className="lead-form__checkbox">
                  <input {...common} type="checkbox" value="yes" />
                  <span>{fieldLabel}</span>
                </label>
              ) : (
                <>
                  <label htmlFor={field.name}>
                    {fieldLabel}
                    {field.required ? <span aria-hidden> *</span> : null}
                  </label>
                  {field.type === "textarea" ? (
                    <textarea {...common} rows={5} />
                  ) : field.type === "select" ? (
                    <select {...common} defaultValue="">
                      <option disabled value="">
                        {field.placeholder || fieldLabel}
                      </option>
                      {field.options?.map((option) => (
                        <option key={option.value} value={option.value}>
                          {locale === "ar"
                            ? option.label ||
                              arabicOptionLabels[option.value] ||
                              option.value
                            : option.label || option.value}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      {...common}
                      accept={field.allowedFileTypes?.join(",")}
                      type={field.type}
                    />
                  )}
                </>
              )}
              {field.helpText ? (
                <small id={`${field.name}-help`}>{field.helpText}</small>
              ) : null}
            </div>
          );
        })}
      </div>
      {privacyNote && !privacyRepeatsCheckbox ? (
        <p className="lead-form__privacy">{privacyNote}</p>
      ) : null}
      {error ? (
        <p className="lead-form__error" role="alert">
          {error}
        </p>
      ) : null}
      <button
        className="button button--primary"
        disabled={state === "submitting"}
      >
        {state === "submitting" ? (
          <CircleNotch aria-hidden className="spin" />
        ) : (
          <ArrowRight aria-hidden />
        )}
        {submitLabel(form.formKey, locale, form.submitLabel)}
      </button>
    </form>
  );
}
