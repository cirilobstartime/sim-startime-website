import type { Block } from "payload";
import { buttonFields, sectionControls } from "./shared";

export const CallToActionBlock: Block = {
  slug: "callToAction",
  labels: {
    singular: "Conversion / sponsorship CTA",
    plural: "Conversion / sponsorship CTAs",
  },
  fields: [
    ...sectionControls,
    { name: "eyebrow", type: "text" },
    { name: "heading", type: "textarea", required: true },
    { name: "body", type: "textarea" },
    {
      name: "media",
      label: "Call-to-action background image — 1920 × 1080 px (2×: 3840 × 2160; 3×: 5760 × 3240)",
      type: "upload",
      relationTo: "media",
      admin: {
        description:
          "Full-width CTA background (16:9). Keep the focal subject away from overlaid text; 2×/3× files are allowed and JPEG/PNG uploads become WebP automatically.",
      },
    },
    {
      name: "mobileMedia",
      label: "Optional mobile call-to-action image — 1080 × 1350 px (2×: 2160 × 2700; 3×: 3240 × 4050)",
      type: "upload",
      relationTo: "media",
      admin: {
        description:
          "Optional portrait CTA image for phones (4:5). Leave empty to use the desktop CTA image automatically. JPEG/PNG uploads become WebP automatically.",
      },
    },
    {
      name: "buttons",
      type: "array",
      minRows: 1,
      maxRows: 3,
      fields: buttonFields,
    },
  ],
};
