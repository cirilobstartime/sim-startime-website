import type { Block } from "payload";
import { sectionControls } from "./shared";

export const SimfHeaderBlock: Block = {
  slug: "simfHeader",
  labels: { singular: "SIMF header", plural: "SIMF headers" },
  fields: [
    ...sectionControls,
    {
      name: "logo",
      label: "Page-specific header logo override — 800 × 300 px (2×: 1600 × 600; 3×: 2400 × 900)",
      type: "upload",
      relationTo: "media",
      admin: {
        description:
          "Page-specific logo override — 800 × 300 px (2×: 1600 × 600; 3×: 2400 × 900). Usually leave unchanged and manage the shared logo in Website settings. Transparent JPEG/PNG uploads become WebP automatically.",
      },
    },
    { name: "logoAlt", label: "Header logo accessible name", type: "text", required: true },
    {
      name: "navigationLabel",
      type: "text",
      required: true,
      admin: { hidden: true },
    },
    {
      name: "links",
      type: "array",
      fields: [
        { name: "label", type: "text", required: true },
        { name: "href", type: "text", required: true },
      ],
    },
    { name: "sponsorLabel", type: "text", required: true },
    { name: "sponsorHref", type: "text", required: true },
    {
      name: "languageSwitchLabel",
      type: "text",
      required: true,
      admin: { hidden: true },
    },
    {
      name: "menuOpenLabel",
      type: "text",
      required: true,
      admin: { hidden: true },
    },
    {
      name: "menuCloseLabel",
      type: "text",
      required: true,
      admin: { hidden: true },
    },
  ],
};
