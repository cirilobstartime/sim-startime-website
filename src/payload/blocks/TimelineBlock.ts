import type { Block } from "payload";
import { sectionControls } from "./shared";

export const TimelineBlock: Block = {
  slug: "timeline",
  labels: {
    singular: "Timeline or process",
    plural: "Timelines and processes",
  },
  fields: [
    ...sectionControls,
    { name: "eyebrow", type: "text" },
    { name: "heading", type: "textarea", required: true },
    { name: "body", type: "textarea" },
    {
      name: "steps",
      type: "array",
      minRows: 2,
      fields: [
        { name: "visible", type: "checkbox", defaultValue: true },
        { name: "label", type: "text" },
        { name: "title", type: "text", required: true },
        { name: "body", type: "textarea" },
        {
          name: "media",
          label: "Timeline section image — 1200 × 800 px (2×: 2400 × 1600; 3×: 3600 × 2400)",
          type: "upload",
          relationTo: "media",
          admin: {
            description:
              "Optional timeline section image — 1200 × 800 px (2×: 2400 × 1600; 3×: 3600 × 2400). Use 3:2 landscape; JPEG/PNG uploads become WebP automatically.",
          },
        },
        {
          name: "icon",
          type: "select",
          options: [
            { label: "Compass", value: "compass" },
            { label: "Lightbulb", value: "lightbulb" },
            { label: "Handshake", value: "handshake" },
            { label: "Gear", value: "gear" },
            { label: "Megaphone", value: "megaphone" },
            { label: "Check", value: "check" },
            { label: "Chart", value: "chart" },
            { label: "Sparkle", value: "sparkle" },
          ],
        },
      ],
    },
  ],
};
