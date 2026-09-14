import type { CollectionConfig, Where } from "payload";
import { absoluteHttpURLValidation } from "@/lib/publicHref";
import { authenticatedStaff } from "../access";
import {
  PUBLIC_CACHE_TAGS,
  revalidateCollectionAfterChange,
  revalidateCollectionAfterDelete,
} from "../hooks/revalidatePublicContent";

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

function addAutomaticPublicationDate(
  doc: Record<string, unknown>,
  originalDoc?: Record<string, unknown>,
) {
  const status = doc._status ?? originalDoc?._status;
  const publishedAt = doc.publishedAt ?? originalDoc?.publishedAt;
  if (status === "published" && !publishedAt) {
    return {
      ...doc,
      publishedAt: new Date().toISOString(),
    };
  }
  return doc;
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
    afterChange: [revalidateCollectionAfterChange([PUBLIC_CACHE_TAGS.updates])],
    afterDelete: [revalidateCollectionAfterDelete([PUBLIC_CACHE_TAGS.updates])],
    afterRead: [({ doc }) => normalizeLegacyArticleContent(doc)],
    beforeChange: [
      ({ data, originalDoc }) => addAutomaticPublicationDate(data, originalDoc),
    ],
    beforeValidate: [
      ({ data }) => (data ? normalizeLegacyArticleContent(data) : data),
    ],
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
              admin: {
                description:
                  "Optional card and SEO summary. When empty, the website automatically uses the opening text from the article content.",
              },
            },
            {
              name: "intro",
              type: "textarea",
              localized: true,
              admin: {
                description:
                  "Optional introduction beneath the article title. When empty, the website automatically uses the opening text from the article content.",
              },
            },
            {
              name: "featuredImage",
              label:
                "Featured article image — 1600 × 900 px (2×: 3200 × 1800; 3×: 4800 × 2700)",
              type: "upload",
              relationTo: "media",
              required: true,
              admin: {
                description:
                  "Article hero/section image. Use a 16:9 landscape image; larger 2× or 3× files are allowed at the same aspect ratio. JPEG/PNG uploads are converted to WebP automatically.",
              },
            },
            {
              name: "mobileFeaturedImage",
              label:
                "Optional mobile featured image — 1080 × 1350 px (2×: 2160 × 2700; 3×: 3240 × 4050)",
              type: "upload",
              relationTo: "media",
              admin: {
                description:
                  "Optional portrait article image for phones (4:5). Leave empty to use the desktop featured image automatically. JPEG/PNG uploads become WebP automatically.",
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
                  label:
                    "Article section image — 1200 × 675 px (2×: 2400 × 1350; 3×: 3600 × 2025)",
                  type: "upload",
                  relationTo: "media",
                  admin: {
                    description:
                      "Optional section image. Use a 16:9 landscape image; 2× or 3× files are allowed. JPEG/PNG uploads are converted to WebP automatically.",
                  },
                },
                {
                  name: "mobileMedia",
                  label:
                    "Optional mobile article section image — 1080 × 1350 px (2×: 2160 × 2700; 3×: 3240 × 4050)",
                  type: "upload",
                  relationTo: "media",
                  admin: {
                    description:
                      "Optional portrait section image for phones (4:5). Leave empty to use the desktop section image automatically. JPEG/PNG uploads become WebP automatically.",
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
                  label:
                    "Optional article-specific social image — 1200 × 630 px (2×: 2400 × 1260; 3×: 3600 × 1890)",
                  type: "upload",
                  relationTo: "media",
                  admin: {
                    description:
                      "Overrides the website-wide Open Graph image for this article. Leave empty to use the shared image from Website branding & languages. Keep the 1.91:1 ratio and important content away from the edges. JPEG/PNG uploads become WebP automatically.",
                  },
                },
                {
                  name: "canonicalURL",
                  type: "text",
                  localized: true,
                  validate: absoluteHttpURLValidation,
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
              admin: {
                description:
                  "Optional custom publisher/date line. When empty, the website automatically generates a localized Saudi International Maritime Forum label from the publish date.",
              },
            },
            {
              name: "publishedAt",
              type: "date",
              admin: {
                description:
                  "Optional override. When empty, the current date is assigned automatically when the update is published.",
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
