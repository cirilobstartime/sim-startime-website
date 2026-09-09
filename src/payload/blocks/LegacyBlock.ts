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
      name: "ctaLabel",
      label: "Call-to-action label",
      type: "text",
      admin: {
        description: "Button text displayed beside the legacy statistics.",
      },
    },
    {
      name: "ctaHref",
      label: "Call-to-action link",
      type: "text",
      admin: {
        description: "Internal path or full URL, for example /programme.",
      },
    },
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
        {
          name: "mobileMedia",
          label: "Optional mobile legacy image — 1080 × 1350 px (2×: 2160 × 2700; 3×: 3240 × 4050)",
          type: "upload",
          relationTo: "media",
          admin: {
            description:
              "Optional portrait edition image for phones (4:5). Leave empty to use the desktop edition image automatically. JPEG/PNG uploads become WebP automatically.",
          },
        },
        { name: "href", type: "text" },
        { name: "visible", type: "checkbox", defaultValue: true },
      ],
    },
  ],
};
