import type { Block } from "payload";
import { buttonFields, sectionControls } from "./shared";

export const HeroBlock: Block = {
  slug: "hero",
  labels: {
    singular: "Cinematic hero",
    plural: "Cinematic heroes",
  },
  fields: [
    ...sectionControls,
    {
      type: "tabs",
      tabs: [
        {
          label: "Content",
          fields: [
            { name: "eyebrow", type: "text" },
            { name: "heading", type: "textarea", required: true },
            { name: "body", type: "textarea" },
            {
              name: "note",
              type: "textarea",
              admin: {
                description:
                  "Optional short qualification or protocol note shown below the primary content.",
              },
            },
            {
              name: "eventDetails",
              type: "array",
              maxRows: 4,
              fields: [
                { name: "label", type: "text", required: true },
                { name: "value", type: "text", required: true },
              ],
            },
          ],
        },
        {
          label: "Media",
          fields: [
            {
              name: "media",
              label: "Desktop hero background image — 1920 × 1080 px (2×: 3840 × 2160; 3×: 5760 × 3240)",
              type: "upload",
              relationTo: "media",
              admin: {
                description:
                  "Full-width cinematic hero/background (16:9). Keep the focal subject clear of text; JPEG/PNG uploads become WebP automatically.",
              },
            },
            {
              name: "mobileMedia",
              label: "Mobile hero image — 1080 × 1350 px (2×: 2160 × 2700; 3×: 3240 × 4050)",
              type: "upload",
              relationTo: "media",
              admin: {
                description:
                  "Optional portrait hero/background image for phones (4:5). Leave empty to use the desktop hero automatically. Keep the focal subject clear of text; JPEG/PNG uploads become WebP automatically.",
              },
            },
          ],
        },
        {
          label: "Buttons",
          fields: [
            {
              name: "buttons",
              type: "array",
              maxRows: 3,
              fields: buttonFields,
            },
          ],
        },
      ],
    },
  ],
};
