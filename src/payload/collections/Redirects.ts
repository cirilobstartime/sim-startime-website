import type { CollectionConfig } from "payload";
import { authenticatedStaff } from "../access";

function pathValidation(value: unknown) {
  if (typeof value !== "string" || !value.startsWith("/")) {
    return "Enter a path beginning with /, for example /old-about-page.";
  }
  if (value.startsWith("//") || value.includes("://")) {
    return "Use an internal path only, not a full external URL.";
  }
  return true;
}

export const Redirects: CollectionConfig = {
  slug: "redirects",
  labels: {
    singular: "Redirect",
    plural: "Redirects",
  },
  admin: {
    group: "Marketing and SEO",
    useAsTitle: "internalTitle",
    defaultColumns: [
      "internalTitle",
      "fromPath",
      "sourceLocale",
      "targetPage",
      "permanent",
      "active",
    ],
    description:
      "Map indexed WordPress URLs and other retired paths to the most relevant current page.",
  },
  access: {
    create: authenticatedStaff,
    delete: authenticatedStaff,
    read: ({ req }) => Boolean(req.user),
    update: authenticatedStaff,
  },
  fields: [
    {
      name: "internalTitle",
      label: "Internal redirect name",
      type: "text",
      required: true,
      admin: {
        description:
          "For CMS organization only, for example “Old About page → About Startime”.",
      },
    },
    {
      type: "row",
      fields: [
        {
          name: "sourceLocale",
          label: "Old URL language",
          type: "select",
          defaultValue: "en",
          required: true,
          options: [
            { label: "English", value: "en" },
            { label: "Arabic", value: "ar" },
          ],
        },
        {
          name: "fromPath",
          label: "Old WordPress path",
          type: "text",
          required: true,
          validate: pathValidation,
          admin: {
            description:
              "Include the complete old path, such as /en/about-us or /old-event-page.",
          },
        },
      ],
    },
    {
      name: "targetPage",
      label: "Redirect to current page",
      type: "relationship",
      relationTo: "pages",
      required: true,
      admin: {
        description:
          "Choose the current CMS page. Its published URL for the selected language is used automatically.",
      },
    },
    {
      type: "row",
      fields: [
        {
          name: "permanent",
          label: "Permanent redirect (301/308)",
          type: "checkbox",
          defaultValue: true,
        },
        {
          name: "active",
          label: "Active",
          type: "checkbox",
          defaultValue: true,
        },
      ],
    },
    {
      name: "notes",
      type: "textarea",
      admin: {
        description:
          "Optional migration notes, search-console context, or ownership information.",
      },
    },
  ],
};
