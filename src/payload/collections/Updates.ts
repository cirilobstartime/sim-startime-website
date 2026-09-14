import type {
  ArrayFieldValidation,
  CollectionConfig,
  TextFieldSingleValidation,
  Where,
} from "payload";
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

function updateSlug(value: string) {
  return value
    .normalize("NFKC")
    .toLocaleLowerCase("en")
    .replace(/[^\p{Letter}\p{Number}]+/gu, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 90);
}

function addAutomaticUpdateIdentifiers(
  doc: Record<string, unknown>,
  originalDoc?: Record<string, unknown>,
) {
  const title =
    typeof doc.title === "string"
      ? doc.title.trim()
      : typeof originalDoc?.title === "string"
        ? originalDoc.title.trim()
        : "";
  const generatedSlug = title ? updateSlug(title) : "";

  return {
    ...doc,
    internalTitle:
      (typeof doc.internalTitle === "string" && doc.internalTitle.trim()) ||
      (typeof originalDoc?.internalTitle === "string" &&
        originalDoc.internalTitle.trim()) ||
      title ||
      "External update",
    slug:
      (typeof doc.slug === "string" && doc.slug.trim()) ||
      (typeof originalDoc?.slug === "string" && originalDoc.slug.trim()) ||
      generatedSlug ||
      `external-update-${Date.now().toString(36)}`,
  };
}

const externalUpdateURLValidation: TextFieldSingleValidation = (
  value,
  { siblingData },
) => {
  const update = siblingData as { destinationType?: unknown };
  if (
    update.destinationType === "external" &&
    (typeof value !== "string" || !value.trim())
  ) {
    return "Add the external post URL.";
  }
  return absoluteHttpURLValidation(value);
};

const internalUpdateCategoryValidation: TextFieldSingleValidation = (
  value,
  { siblingData },
) => {
  const update = siblingData as { destinationType?: unknown };
  if (
    update.destinationType !== "external" &&
    (typeof value !== "string" || !value.trim())
  ) {
    return "Add a category for an internal article.";
  }
  return true;
};

const internalUpdateContentValidation: ArrayFieldValidation = (
  value,
  { siblingData },
) => {
  const update = siblingData as { destinationType?: unknown };
  if (update.destinationType !== "external" && !value?.length) {
    return "Add at least one content section for an internal article.";
  }
  return true;
};

export const Updates: CollectionConfig = {
  slug: "updates",
  admin: {
    group: "Content",
    useAsTitle: "internalTitle",
    defaultColumns: [
      "internalTitle",
      "destinationType",
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
      ({ data, originalDoc }) =>
        data
          ? addAutomaticUpdateIdentifiers(
              normalizeLegacyArticleContent(data),
              originalDoc,
            )
          : data,
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
              name: "destinationType",
              label: "What should happen when this update is clicked?",
              type: "radio",
              defaultValue: "internal",
              options: [
                {
                  label: "Open a full article on this website",
                  value: "internal",
                },
                {
                  label: "Open an external post or website",
                  value: "external",
                },
              ],
              admin: {
                description:
                  "Choose External post when you only want to add the bilingual title, featured image and destination link.",
                layout: "vertical",
              },
            },
            {
              name: "externalURL",
              label: "External post URL",
              type: "text",
              admin: {
                condition: (_, siblingData) =>
                  siblingData?.destinationType === "external",
                description:
                  "The update card will open this address instead of an article on the SIM website.",
              },
              validate: externalUpdateURLValidation,
            },
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
              validate: internalUpdateCategoryValidation,
              admin: {
                condition: (_, siblingData) =>
                  siblingData?.destinationType !== "external",
              },
            },
            {
              name: "summary",
              type: "textarea",
              localized: true,
              admin: {
                condition: (_, siblingData) =>
                  siblingData?.destinationType !== "external",
                description:
                  "Optional card and SEO summary. When empty, the website automatically uses the opening text from the article content.",
              },
            },
            {
              name: "intro",
              type: "textarea",
              localized: true,
              admin: {
                condition: (_, siblingData) =>
                  siblingData?.destinationType !== "external",
                description:
                  "Optional introduction beneath the article title. When empty, the website automatically uses the opening text from the article content.",
              },
            },
            {
              name: "featuredImage",
              label:
                "Featured update image — 1600 × 900 px (2×: 3200 × 1800; 3×: 4800 × 2700)",
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
              admin: {
                condition: (_, siblingData) =>
                  siblingData?.destinationType !== "external",
              },
            },
            {
              name: "content",
              type: "array",
              localized: true,
              validate: internalUpdateContentValidation,
              admin: {
                condition: (_, siblingData) =>
                  siblingData?.destinationType !== "external",
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
              admin: {
                condition: (_, siblingData) =>
                  siblingData?.destinationType !== "external",
                description:
                  "Optional CMS-only name. When empty, it is generated from the update title.",
              },
            },
            {
              name: "slug",
              type: "text",
              localized: true,
              unique: true,
              index: true,
              admin: {
                condition: (_, siblingData) =>
                  siblingData?.destinationType !== "external",
                description:
                  "Optional internal article URL. When empty, it is generated from the update title.",
              },
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
