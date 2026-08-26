import type { CollectionConfig } from "payload";
import { exportFormSubmissionsCSV } from "../endpoints/exportFormSubmissionsCSV";

const staffOnly = ({ req }: { req: { user?: unknown } }) => Boolean(req.user);

export const FormSubmissions: CollectionConfig = {
  slug: "form-submissions",
  labels: { singular: "Form submission", plural: "Form submissions" },
  admin: {
    group: "Lead capture",
    useAsTitle: "reference",
    defaultColumns: ["reference", "formKey", "status", "locale", "createdAt"],
    description:
      "First-party conversion records. IP addresses are irreversibly hashed before storage.",
    components: {
      beforeList: [
        {
          path: "./src/payload/admin/FormSubmissionsExport",
          exportName: "FormSubmissionsExport",
        },
      ],
    },
  },
  endpoints: [
    {
      handler: exportFormSubmissionsCSV,
      method: "get",
      path: "/export",
    },
  ],
  access: {
    create: staffOnly,
    delete: staffOnly,
    read: staffOnly,
    update: staffOnly,
  },
  fields: [
    {
      name: "reference",
      type: "text",
      required: true,
      unique: true,
      index: true,
    },
    { name: "form", type: "relationship", relationTo: "forms", required: true },
    { name: "formKey", type: "text", required: true, index: true },
    {
      name: "status",
      type: "select",
      defaultValue: "new",
      options: [
        { label: "New", value: "new" },
        { label: "In progress", value: "in-progress" },
        { label: "Qualified", value: "qualified" },
        { label: "Closed", value: "closed" },
        { label: "Spam", value: "spam" },
      ],
      required: true,
      index: true,
    },
    { name: "locale", type: "select", options: ["en", "ar"], required: true },
    { name: "pagePath", type: "text" },
    { name: "sectionID", type: "text" },
    { name: "ctaID", type: "text" },
    {
      name: "conversionValue",
      type: "number",
      min: 0,
      admin: {
        description:
          "Initial value comes from the form and can be updated when the opportunity is qualified.",
      },
    },
    { name: "conversionCurrency", type: "text", maxLength: 3 },
    {
      name: "data",
      type: "json",
      required: true,
      admin: {
        readOnly: true,
        components: {
          Field: {
            path: "./src/payload/admin/FormSubmissionDataField",
            exportName: "FormSubmissionDataField",
          },
        },
      },
    },
    {
      name: "uploads",
      type: "relationship",
      relationTo: "form-uploads",
      hasMany: true,
    },
    {
      name: "attribution",
      type: "group",
      fields: [
        { name: "visitorID", type: "text", index: true },
        { name: "currentSessionID", type: "text", index: true },
        {
          name: "firstTouch",
          type: "json",
          admin: {
            readOnly: true,
            components: {
              Field: {
                path: "./src/payload/admin/FormSubmissionDataField",
                exportName: "FormSubmissionDataField",
              },
            },
          },
        },
        {
          name: "latestTouch",
          type: "json",
          admin: {
            readOnly: true,
            components: {
              Field: {
                path: "./src/payload/admin/FormSubmissionDataField",
                exportName: "FormSubmissionDataField",
              },
            },
          },
        },
        { name: "landingPage", type: "text" },
        { name: "referrer", type: "text" },
      ],
    },
    { name: "ipHash", type: "text", required: true, index: true },
    { name: "userAgent", type: "text" },
    { name: "notes", type: "textarea" },
  ],
};
