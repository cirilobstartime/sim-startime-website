import type { CollectionConfig } from "payload";
import { authenticatedStaff } from "../access";
import {
  PUBLIC_CACHE_TAGS,
  revalidateCollectionAfterChange,
  revalidateCollectionAfterDelete,
} from "../hooks/revalidatePublicContent";

export const Forms: CollectionConfig = {
  slug: "forms",
  labels: { singular: "Form", plural: "Forms" },
  admin: {
    group: "Lead capture",
    useAsTitle: "internalTitle",
    defaultColumns: ["internalTitle", "formKey", "active", "updatedAt"],
    description:
      "Build reusable forms here. Labels, placeholders, options, validation, consent text, and submit buttons are localized.",
  },
  access: {
    create: authenticatedStaff,
    delete: authenticatedStaff,
    read: ({ req }) => (req.user ? true : { active: { equals: true } }),
    update: authenticatedStaff,
  },
  hooks: {
    afterChange: [revalidateCollectionAfterChange([PUBLIC_CACHE_TAGS.pages])],
    afterDelete: [revalidateCollectionAfterDelete([PUBLIC_CACHE_TAGS.pages])],
  },
  fields: [
    { name: "internalTitle", type: "text", required: true },
    {
      name: "formKey",
      type: "text",
      required: true,
      unique: true,
      index: true,
      validate: (value: unknown) =>
        (typeof value === "string" &&
          /^[a-z][a-z0-9_-]{1,99}$/i.test(value)) ||
        "Use 2–100 letters, numbers, hyphens or underscores.",
      admin: { description: "Stable key used by attribution and reporting." },
    },
    { name: "active", type: "checkbox", defaultValue: true },
    {
      name: "conversionValue",
      label: "Default conversion value",
      type: "number",
      defaultValue: 0,
      min: 0,
      admin: {
        description:
          "Optional value pushed to the data layer and copied into each submission. Use 0 until Marketing assigns a defensible value.",
      },
    },
    {
      name: "conversionCurrency",
      label: "Conversion currency",
      type: "text",
      defaultValue: "SAR",
      maxLength: 3,
      admin: {
        description: "Three-letter ISO currency code, for example SAR or USD.",
      },
    },
    {
      name: "submitLabel",
      type: "text",
      localized: true,
      required: true,
    },
    {
      name: "fields",
      type: "array",
      localized: true,
      minRows: 1,
      fields: [
        {
          name: "name",
          type: "text",
          required: true,
          validate: (value: unknown) =>
            (typeof value === "string" &&
              /^[a-z][a-z0-9_-]{0,63}$/i.test(value) &&
              !value.startsWith("_")) ||
            "Use up to 64 letters, numbers, hyphens or underscores and do not start with an underscore.",
          admin: { description: "Machine name, for example workEmail." },
        },
        {
          name: "groupHeading",
          label: "New group heading",
          type: "text",
          admin: {
            description:
              "Optional. Add only on the first field of a new form group.",
          },
        },
        { name: "label", type: "text", required: true },
        { name: "placeholder", type: "text" },
        { name: "helpText", type: "text" },
        {
          name: "type",
          type: "select",
          defaultValue: "text",
          required: true,
          options: [
            { label: "Text", value: "text" },
            { label: "Email", value: "email" },
            { label: "Telephone", value: "tel" },
            { label: "Long text", value: "textarea" },
            { label: "Select", value: "select" },
            { label: "Checkbox", value: "checkbox" },
            { label: "Number", value: "number" },
            { label: "Date", value: "date" },
            { label: "URL", value: "url" },
            { label: "File upload", value: "file" },
          ],
        },
        { name: "required", type: "checkbox", defaultValue: false },
        {
          name: "width",
          type: "select",
          defaultValue: "full",
          options: [
            { label: "Full", value: "full" },
            { label: "Half", value: "half" },
          ],
        },
        {
          name: "autocomplete",
          type: "text",
          admin: { description: "HTML autocomplete value, if applicable." },
        },
        {
          name: "options",
          type: "array",
          fields: [
            { name: "label", type: "text", required: true },
            { name: "value", type: "text", required: true },
          ],
        },
        { name: "maxLength", type: "number", min: 1, max: 5000 },
        {
          name: "allowedFileTypes",
          type: "select",
          hasMany: true,
          options: [
            { label: "PDF", value: "application/pdf" },
            {
              label: "Word document",
              value:
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            },
            { label: "JPEG image", value: "image/jpeg" },
            { label: "PNG image", value: "image/png" },
          ],
        },
      ],
    },
    {
      name: "consentLabel",
      type: "textarea",
      localized: true,
    },
    {
      name: "notificationEmails",
      label: "Additional notification recipients",
      type: "array",
      fields: [{ name: "email", type: "email", required: true }],
      admin: {
        description:
          "Optional additional recipients for this form. The default SIM notification inboxes are configured securely on the server. Submissions are always retained in the CMS.",
      },
    },
    {
      name: "rateLimit",
      type: "group",
      fields: [
        { name: "requests", type: "number", defaultValue: 5, min: 1, max: 30 },
        {
          name: "windowMinutes",
          type: "number",
          defaultValue: 15,
          min: 1,
          max: 1440,
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
