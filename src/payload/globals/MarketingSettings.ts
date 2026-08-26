import type { GlobalConfig } from "payload";
import { authenticatedStaff } from "../access";

export const MarketingSettings: GlobalConfig = {
  slug: "marketing-settings",
  label: "Marketing, verification and consent",
  admin: {
    group: "Marketing and SEO",
    description:
      "Use verified platform IDs and tokens instead of unrestricted scripts. This keeps marketing editable without exposing the site to arbitrary code injection.",
  },
  access: {
    read: () => true,
    update: authenticatedStaff,
  },
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: "Analytics",
          fields: [
            {
              name: "googleTagManagerID",
              label: "Google Tag Manager container ID",
              type: "text",
              admin: {
                description:
                  "Optional. Use GTM to manage GA4 and advertising tags from one container.",
              },
              validate: (value: unknown) =>
                !value ||
                /^GTM-[A-Z0-9]+$/i.test(String(value)) ||
                "Use a valid GTM container ID, for example GTM-ABC1234.",
            },
            {
              name: "ga4MeasurementID",
              label: "GA4 measurement ID",
              type: "text",
              admin: {
                description:
                  "Used directly only when no Google Tag Manager container ID is provided.",
              },
              validate: (value: unknown) =>
                !value ||
                /^G-[A-Z0-9]+$/i.test(String(value)) ||
                "Use a valid GA4 measurement ID.",
            },
            {
              name: "enableAnalytics",
              label: "Enable analytics tags",
              type: "checkbox",
              defaultValue: false,
            },
            {
              name: "defaultConsentDenied",
              type: "checkbox",
              defaultValue: true,
              admin: {
                description:
                  "Recommended: analytics and advertising storage remain denied until consent.",
              },
            },
          ],
        },
        {
          label: "Site verification",
          fields: [
            {
              name: "googleSiteVerification",
              label: "Google Search Console verification token",
              type: "text",
            },
            {
              name: "bingSiteVerification",
              label: "Bing Webmaster Tools verification token",
              type: "text",
            },
            {
              name: "metaDomainVerification",
              label: "Meta domain verification token",
              type: "text",
            },
          ],
        },
        {
          label: "Attribution",
          fields: [
            {
              name: "attributionCookieDays",
              label: "Attribution retention (days)",
              type: "number",
              defaultValue: 90,
              min: 1,
              max: 395,
            },
            {
              name: "acceptedCampaignParameters",
              label: "Accepted campaign and click-ID parameters",
              type: "text",
              defaultValue:
                "utm_id,utm_source,utm_medium,utm_campaign,utm_term,utm_content,utm_source_platform,gclid,gbraid,wbraid,fbclid,msclkid,ttclid,li_fat_id,twclid",
              validate: (value: unknown) => {
                if (typeof value !== "string") {
                  return "Enter a comma-separated list of parameter names.";
                }
                const keys = value
                  .split(",")
                  .map((item) => item.trim())
                  .filter(Boolean);
                if (
                  keys.length > 30 ||
                  keys.some((key) => !/^[a-z][a-z0-9_]{0,63}$/i.test(key))
                ) {
                  return "Use at most 30 comma-separated names containing only letters, numbers and underscores.";
                }
                return true;
              },
            },
            {
              name: "attributionCookieDomain",
              label: "Shared attribution cookie domain",
              type: "text",
              defaultValue: ".startime.sa",
              admin: {
                description:
                  "Use .startime.sa to preserve first-party attribution between SIMF and the main Startime website. Ignored on localhost.",
              },
            },
          ],
        },
        {
          label: "Cookie notice",
          fields: [
            {
              name: "cookieNotice",
              label: "Cookie notice message",
              type: "textarea",
              localized: true,
            },
            {
              name: "acceptLabel",
              label: "Accept button label",
              type: "text",
              localized: true,
            },
            {
              name: "rejectLabel",
              label: "Reject button label",
              type: "text",
              localized: true,
            },
            {
              name: "settingsLabel",
              label: "Privacy policy link label",
              type: "text",
              localized: true,
            },
            {
              name: "privacyHref",
              label: "Privacy policy URL",
              type: "text",
              localized: true,
            },
          ],
        },
      ],
    },
  ],
  versions: {
    max: 20,
    // Payload 3.86 currently passes an undefined locale while counting
    // localized draft versions for Globals in the Admin UI. Keep localized
    // field values and drafts, but use the stable shared publication status
    // for this site-wide configuration singleton.
    drafts: {
      autosave: {
        interval: 10_000,
        showSaveDraftButton: true,
      },
    },
  },
};
