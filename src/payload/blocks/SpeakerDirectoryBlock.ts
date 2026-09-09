import type { Block } from "payload";
import { countryOptions } from "@/content/countries";
import { sectionControls } from "./shared";

export const SpeakerDirectoryBlock: Block = {
  slug: "speakerDirectory",
  labels: {
    singular: "Speaker directory",
    plural: "Speaker directories",
  },
  fields: [
    ...sectionControls,
    { name: "eyebrow", label: "Section label", type: "text" },
    { name: "heading", label: "Section heading", type: "textarea", required: true },
    { name: "body", label: "Section introduction", type: "textarea" },
    {
      name: "speakers",
      label: "Speakers and participants",
      type: "array",
      minRows: 1,
      labels: {
        singular: "Speaker",
        plural: "Speakers",
      },
      admin: {
        description:
          "Add, remove, duplicate, and reorder speakers. There is no maximum.",
        initCollapsed: true,
      },
      fields: [
        {
          name: "visible",
          label: "Show this speaker",
          type: "checkbox",
          defaultValue: true,
        },
        {
          name: "name",
          label: "Name",
          type: "text",
          required: true,
        },
        {
          name: "role",
          label: "Job title / area of expertise",
          type: "textarea",
        },
        {
          name: "workplace",
          label: "Workplace / organization",
          type: "textarea",
        },
        {
          name: "country",
          label: "Country",
          type: "select",
          options: countryOptions,
          admin: {
            description:
              "Select the country. Its flag is added automatically.",
            isClearable: true,
          },
        },
        {
          name: "eyebrow",
          label: "Optional card label",
          type: "text",
        },
        {
          name: "portrait",
          label: "Speaker portrait — 900 × 1200 px (2×: 1800 × 2400; 3×: 2700 × 3600)",
          type: "upload",
          relationTo: "media",
          required: true,
          admin: {
            description:
              "Portrait section image (3:4), framed from head to at least mid-torso. 2×/3× files are allowed; JPEG/PNG uploads become WebP automatically.",
          },
        },
        {
          name: "mobilePortrait",
          label: "Optional mobile speaker portrait — 900 × 1200 px (2×: 1800 × 2400; 3×: 2700 × 3600)",
          type: "upload",
          relationTo: "media",
          admin: {
            description:
              "Optional phone-specific portrait using the same 3:4 ratio. Leave empty to use the desktop portrait automatically. JPEG/PNG uploads become WebP automatically.",
          },
        },
      ],
    },
  ],
};
