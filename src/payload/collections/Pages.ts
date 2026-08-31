import type { CollectionConfig, Where } from "payload";
import { authenticatedStaff } from "../access";
import { pageBlocks } from "../blocks";

const pageBlockOptions: Record<string, string[]> = {
  "simf-microsite-home": [
    "simfHeader",
    "hero",
    "countdown",
    "cardGrid",
    "mediaFeature",
    "legacy",
    "metricRail",
    "videoFeature",
    "callToAction",
    "imageStory",
    "simfFooter",
  ],
  "simf-microsite-sponsor": [
    "simfHeader",
    "hero",
    "mediaFeature",
    "cardGrid",
    "timeline",
    "form",
    "callToAction",
    "simfFooter",
  ],
  "simf-microsite-legacy": [
    "simfHeader",
    "hero",
    "mediaFeature",
    "timeline",
    "simfFooter",
  ],
  "simf-microsite-programme": [
    "simfHeader",
    "hero",
    "mediaFeature",
    "cardGrid",
    "timeline",
    "callToAction",
    "simfFooter",
  ],
  "simf-microsite-speakers": [
    "simfHeader",
    "hero",
    "mediaFeature",
    "cardGrid",
    "speakerDirectory",
    "callToAction",
    "simfFooter",
  ],
  "simf-microsite-partners": [
    "simfHeader",
    "hero",
    "mediaFeature",
    "partnerCategory",
    "callToAction",
    "simfFooter",
  ],
  "simf-microsite-government-b2g": [
    "simfHeader",
    "hero",
    "mediaFeature",
    "cardGrid",
    "timeline",
    "form",
    "callToAction",
    "simfFooter",
  ],
  "simf-microsite-updates": [
    "simfHeader",
    "hero",
    "updateIndex",
    "callToAction",
    "simfFooter",
  ],
  "simf-microsite-contact": [
    "simfHeader",
    "hero",
    "cardGrid",
    "form",
    "simfFooter",
  ],
};

function ensureSectionNames<T extends Record<string, unknown> | undefined>(
  data: T,
): T {
  if (!data || !Array.isArray(data.sections)) return data;

  return {
    ...data,
    sections: data.sections.map((value) => {
      if (!value || typeof value !== "object") return value;
      const section = value as Record<string, unknown>;
      const heading =
        typeof section.heading === "string" ? section.heading : undefined;
      const internalLabel =
        typeof section.internalLabel === "string"
          ? section.internalLabel
          : undefined;
      const blockType =
        typeof section.blockType === "string" ? section.blockType : "Section";

      return {
        ...section,
        blockName:
          (typeof section.blockName === "string" && section.blockName.trim()) ||
          internalLabel ||
          heading ||
          blockType,
      };
    }),
  } as T;
}

export const Pages: CollectionConfig = {
  slug: "pages",
  disableDuplicate: false,
  admin: {
    group: "Content",
    useAsTitle: "internalTitle",
    defaultColumns: [
      "internalTitle",
      "pageType",
      "visible",
      "_status",
      "updatedAt",
    ],
    description:
      "Switch locale before editing. Each language has its own slug, sections, visibility, SEO, draft and publish status. Use Duplicate in the document menu to make a complete copy.",
  },
  access: {
    create: authenticatedStaff,
    delete: authenticatedStaff,
    read: ({ req }) =>
      req.user
        ? true
        : ({
            and: [
              {
                _status: {
                  equals: "published",
                },
              },
              {
                visible: {
                  equals: true,
                },
              },
            ],
          } as Where),
    update: authenticatedStaff,
  },
  hooks: {
    beforeValidate: [({ data }) => ensureSectionNames(data)],
  },
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: "Page content",
          fields: [
            {
              name: "title",
              type: "text",
              localized: true,
              required: true,
            },
            {
              name: "summary",
              type: "textarea",
              localized: true,
            },
            {
              name: "sections",
              type: "blocks",
              blocks: pageBlocks,
              filterOptions: ({ siblingData }) =>
                pageBlockOptions[
                  String(
                    (siblingData as { pageType?: string } | undefined)
                      ?.pageType || "",
                  )
                ] || true,
              localized: true,
              admin: {
                description:
                  "This language owns a complete section set. Reorder, hide, add, or edit sections here without changing the other language.",
                initCollapsed: true,
              },
            },
          ],
        },
        {
          label: "SEO",
          fields: [
            {
              name: "seo",
              type: "group",
              fields: [
                {
                  name: "title",
                  type: "text",
                  localized: true,
                  maxLength: 70,
                },
                {
                  name: "description",
                  type: "textarea",
                  localized: true,
                  maxLength: 180,
                },
                {
                  name: "openGraphImage",
                  label: "Social sharing image — 1200 × 630 px (2×: 2400 × 1260; 3×: 3600 × 1890)",
                  type: "upload",
                  relationTo: "media",
                  admin: {
                    description:
                      "SEO/social preview image (1.91:1). Keep important content away from the edges; JPEG/PNG uploads become WebP automatically.",
                  },
                },
                {
                  name: "openGraphTitle",
                  type: "text",
                  localized: true,
                  maxLength: 70,
                },
                {
                  name: "openGraphDescription",
                  type: "textarea",
                  localized: true,
                  maxLength: 200,
                },
                {
                  name: "canonicalURL",
                  type: "text",
                  localized: true,
                },
                {
                  name: "indexable",
                  type: "checkbox",
                  localized: true,
                  defaultValue: true,
                },
                {
                  name: "followLinks",
                  type: "checkbox",
                  localized: true,
                  defaultValue: true,
                },
                {
                  name: "includeInSitemap",
                  type: "checkbox",
                  localized: true,
                  defaultValue: true,
                },
                {
                  name: "sitemapPriority",
                  type: "number",
                  localized: true,
                  defaultValue: 0.7,
                  min: 0,
                  max: 1,
                },
                {
                  name: "sitemapChangeFrequency",
                  type: "select",
                  localized: true,
                  defaultValue: "monthly",
                  options: [
                    "always",
                    "hourly",
                    "daily",
                    "weekly",
                    "monthly",
                    "yearly",
                    "never",
                  ],
                },
                {
                  name: "structuredData",
                  type: "json",
                  localized: true,
                  admin: {
                    description:
                      "Optional page-specific JSON-LD. Only valid JSON is rendered.",
                  },
                },
              ],
            },
          ],
        },
        {
          label: "Page settings",
          fields: [
            {
              name: "internalTitle",
              label: "CMS page name",
              type: "text",
              required: true,
              admin: {
                description:
                  "Used only to identify this page in the CMS. It is not shown on the website.",
              },
            },
            {
              name: "pageType",
              type: "select",
              defaultValue: "generic",
              required: true,
              admin: {
                hidden: true,
              },
              options: [
                {
                  label: "SIMF event microsite — landing",
                  value: "simf-microsite-home",
                },
                {
                  label: "SIMF event microsite — sponsor registration",
                  value: "simf-microsite-sponsor",
                },
                {
                  label: "SIMF event microsite — legacy",
                  value: "simf-microsite-legacy",
                },
                {
                  label: "SIMF event microsite — programme",
                  value: "simf-microsite-programme",
                },
                {
                  label: "SIMF event microsite — speakers",
                  value: "simf-microsite-speakers",
                },
                {
                  label: "SIMF event microsite — partners",
                  value: "simf-microsite-partners",
                },
                {
                  label: "SIMF event microsite — government B2G",
                  value: "simf-microsite-government-b2g",
                },
                {
                  label: "SIMF event microsite — news and media",
                  value: "simf-microsite-updates",
                },
                {
                  label: "SIMF event microsite — contact",
                  value: "simf-microsite-contact",
                },
              ],
            },
            {
              name: "slug",
              type: "text",
              localized: true,
              required: true,
            },
            {
              name: "visible",
              type: "checkbox",
              localized: true,
              defaultValue: true,
              admin: {
                description:
                  "Master visibility switch for this language. Hidden pages return 404 even when published.",
              },
            },
            {
              name: "showInNavigation",
              type: "checkbox",
              localized: true,
              defaultValue: false,
            },
            {
              name: "navigationLabel",
              type: "text",
              localized: true,
              admin: {
                condition: (_, siblingData) =>
                  Boolean(siblingData?.showInNavigation),
              },
            },
            {
              name: "publishFrom",
              type: "date",
              localized: true,
              admin: {
                date: { pickerAppearance: "dayAndTime" },
                description:
                  "Optional date and time when the page becomes visible.",
              },
            },
            {
              name: "publishUntil",
              type: "date",
              localized: true,
              admin: {
                date: { pickerAppearance: "dayAndTime" },
                description:
                  "Optional date and time when the page stops being visible.",
              },
            },
          ],
        },
        {
          label: "Redirects",
          fields: [
            {
              name: "redirects",
              type: "array",
              localized: true,
              labels: {
                singular: "Redirect",
                plural: "Redirects",
              },
              admin: {
                description:
                  "Add every previous path for this language. Redirects are applied only while this page is visible and published.",
                initCollapsed: true,
              },
              fields: [
                {
                  name: "fromPath",
                  label: "Previous path",
                  type: "text",
                  required: true,
                  admin: {
                    description:
                      "Start with / and omit the locale, for example /discover.",
                  },
                },
                {
                  name: "permanent",
                  label: "Permanent (301/308)",
                  type: "checkbox",
                  defaultValue: true,
                  admin: {
                    description:
                      "Keep enabled for permanently retired URLs. Disable only for a temporary redirect.",
                  },
                },
              ],
            },
          ],
        },
      ],
    },
  ],
  versions: {
    maxPerDoc: 20,
    drafts: {
      autosave: {
        interval: 10_000,
        showSaveDraftButton: true,
      },
      localizeStatus: true,
    },
  },
};
