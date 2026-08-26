import type { Block } from "payload";
import { sectionControls } from "./shared";

export const LegacyBlock: Block = {
  slug: "legacy",
  labels: { singular: "Forum legacy", plural: "Forum legacy sections" },
  fields: [
    ...sectionControls,
    { name: "eyebrow", type: "text" },
    { name: "heading", type: "textarea", required: true },
    { name: "body", type: "textarea" },
    {
      name: "metrics",
      type: "array",
      minRows: 1,
      fields: [
        { name: "value", type: "text", required: true },
        { name: "label", type: "text", required: true },
      ],
    },
    {
      name: "editions",
      type: "array",
      fields: [
        { name: "year", type: "text", required: true },
        { name: "title", type: "textarea", required: true },
        { name: "date", type: "text", required: true },
        { name: "location", type: "text", required: true },
        {
          name: "media",
          label: "Legacy edition image — 1400 × 900 px (2×: 2800 × 1800; 3×: 4200 × 2700)",
          type: "upload",
          relationTo: "media",
          admin: {
            description:
              "Editorial section image for an edition (14:9 landscape). 2×/3× files are allowed; JPEG/PNG uploads become WebP automatically.",
          },
        },
        { name: "href", type: "text" },
        { name: "visible", type: "checkbox", defaultValue: true },
      ],
    },
  ],
};
