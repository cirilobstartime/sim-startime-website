import type { CollectionConfig } from "payload";
import { authenticatedStaff } from "../access";

type LegacyUpdateSection = {
  body?: unknown;
  richBody?: unknown;
} & Record<string, unknown>;

function plainTextToLexical(value: string) {
  const paragraphs = value.split(/\n\s*\n/).filter(Boolean);
  return {
    root: {
      type: "root",
      children: (paragraphs.length ? paragraphs : [""]).map((text) => ({
        type: "paragraph",
        children: [
          {
            type: "text",
            detail: 0,
            format: 0,
            mode: "normal",
            style: "",
            text,
            version: 1,
          },
        ],
        direction: null,
        format: "",
        indent: 0,
        textFormat: 0,
        textStyle: "",
        version: 1,
      })),
      direction: null,
      format: "",
      indent: 0,
      version: 1,
    },
  };
}

function normalizeLegacyArticleContent(doc: Record<string, unknown>) {
  if (!Array.isArray(doc.content)) return doc;
  return {
    ...doc,
    content: doc.content.map((item: LegacyUpdateSection) =>
      !item.richBody && typeof item.body === "string"
        ? { ...item, richBody: plainTextToLexical(item.body) }
        : item,
    ),
  };
}

export const Updates: CollectionConfig = {
  slug: "updates",
  admin: {
    group: "Content",
    useAsTitle: "internalTitle",
    defaultColumns: [
      "internalTitle",
      "category",
      "publishedAt",
      "visible",
      "_status",
    ],
    description:
      "Publish bilingual SIMF news and intelligence. Switch locale before editing; each language has independent copy, URL, visibility, SEO and publish status.",
  },
  access: {
    create: authenticatedStaff,
    delete: authenticatedStaff,
    read: ({ req }) =>
      req.user
        ? true
        : {
            _status: {
              equals: "published",
            },
          },
    update: authenticatedStaff,
  },
  hooks: {
    afterRead: [({ doc }) => normalizeLegacyArticleContent(doc)],
    beforeValidate: [({ data }) => data ? normalizeLegacyArticleContent(data) : data],
  },
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: "Update content",
          fields: [
            {
              name: "title",
              type: "textarea",
              localized: true,
              required: true,
            },
            {
              name: "category",
              type: "text",
              localized: true,
              required: true,
            },
            {
              name: "summary",
              type: "textarea",
              localized: true,
              required: true,
            },
            {
              name: "intro",
              type: "textarea",
              localized: true,
              required: true,
            },
            {
              name: "featuredImage",
              label: "Featured article image — 1600 × 900 px (2×: 3200 × 1800; 3×: 4800 × 2700)",
              type: "upload",
              relationTo: "media",
              required: true,
              admin: {
                description:
                  "Article hero/section image. Use a 16:9 landscape image; larger 2× or 3× files are allowed at the same aspect ratio. JPEG/PNG uploads are converted to WebP automatically.",
              },
            },
            {
              name: "featuredImageCaption",
              type: "text",
              localized: true,
            },
            {
              name: "content",
              type: "array",
              localized: true,
              minRows: 1,
              admin: {
                description:
                  "Add, reorder or remove article sections independently for this language.",
                initCollapsed: true,
              },
              fields: [
                {
                  name: "heading",
                  type: "text",
                },
                {
                  name: "body",
                  label: "Legacy plain-text content",
                  type: "textarea",
                  admin: {
                    hidden: true,
                  },
                },
                {
                  name: "richBody",
                  label: "Section content (WYSIWYG)",
                  type: "richText",
                  admin: {
                    description:
                      "Format paragraphs and headings, add links, lists, bold/italic text, quotes, and use undo/redo directly in the editor. Existing plain-text articles are loaded into this editor automatically.",
                  },
                },
                {
                  name: "media",
                  label: "Article section image — 1200 × 675 px (2×: 2400 × 1350; 3×: 3600 × 2025)",
                  type: "upload",
                  relationTo: "media",
                  admin: {
                    description:
                      "Optional section image. Use a 16:9 landscape image; 2× or 3× files are allowed. JPEG/PNG uploads are converted to WebP automatically.",
                  },
                },
                {
                  name: "mediaAlt",
                  type: "text",
                },
                {
                  name: "mediaCaption",
                  type: "text",
                },
                {
                  name: "highlight",
                  type: "checkbox",
                  defaultValue: false,
                  admin: {
                    description:
                      "Show this section as a highlighted key takeaway.",
                  },
                },
                {
                  name: "visible",
                  type: "checkbox",
                  defaultValue: true,
                },
              ],
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
                      "SEO/social preview image. Keep the 1.91:1 ratio and important content away from the edges. JPEG/PNG uploads become WebP automatically.",
                  },
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
              ],
            },
          ],
        },
        {
          label: "Publishing",
          fields: [
            {
              name: "internalTitle",
              type: "text",
              required: true,
            },
            {
              name: "slug",
              type: "text",
              localized: true,
              required: true,
              unique: true,
              index: true,
            },
            {
              name: "publicationLabel",
              type: "text",
              localized: true,
              required: true,
              admin: {
                description:
                  "Reader-facing publisher and date line, for example “Startime | 18 September 2026”.",
              },
            },
            {
              name: "publishedAt",
              type: "date",
              required: true,
              admin: {
                date: { pickerAppearance: "dayOnly" },
              },
            },
            {
              name: "visible",
              type: "checkbox",
              localized: true,
              defaultValue: true,
            },
            {
              name: "featured",
              type: "checkbox",
              localized: true,
              defaultValue: false,
              admin: {
                description:
                  "Use as the lead story on the Updates archive when it is the newest featured item.",
              },
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
