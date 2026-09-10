import type { Block } from "payload";
import { publicHrefValidation } from "@/lib/publicHref";
import { sectionControls } from "./shared";

export const SimfFooterBlock: Block = {
  slug: "simfFooter",
  labels: { singular: "SIMF footer", plural: "SIMF footers" },
  fields: [
    ...sectionControls,
    {
      name: "logo",
      label: "Page-specific footer logo override — 800 × 300 px (2×: 1600 × 600; 3×: 2400 × 900)",
      type: "upload",
      relationTo: "media",
      admin: {
        description:
          "Page-specific footer logo override — 800 × 300 px (2×: 1600 × 600; 3×: 2400 × 900). Usually leave unchanged and manage the shared logo in Website settings. JPEG/PNG uploads become WebP automatically.",
      },
    },
    {
      name: "mobileLogo",
      label: "Optional mobile footer logo — 800 × 300 px (2×: 1600 × 600; 3×: 2400 × 900)",
      type: "upload",
      relationTo: "media",
      admin: {
        description:
          "Optional phone-specific footer logo. Leave empty to use the desktop footer logo automatically. JPEG/PNG uploads become WebP automatically.",
      },
    },
    { name: "logoAlt", label: "Footer logo accessible name", type: "text", required: true },
    { name: "bio", type: "textarea", required: true },
    { name: "contactHeading", type: "text", required: true },
    { name: "address", type: "textarea", required: true },
    { name: "phone", type: "text", required: true },
    { name: "email", type: "email", required: true },
    {
      name: "socialLinks",
      type: "array",
      fields: [
        { name: "platform", type: "select", options: ["x", "linkedin", "youtube"], required: true },
        { name: "href", type: "text", required: true, validate: publicHrefValidation },
      ],
    },
    {
      name: "importantLinks",
      type: "array",
      fields: [
        { name: "label", type: "text", required: true },
        { name: "href", type: "text", required: true, validate: publicHrefValidation },
      ],
    },
    { name: "linksHeading", type: "text", required: true },
    { name: "privacyLabel", type: "text", required: true },
    { name: "privacyHref", type: "text", required: true, validate: publicHrefValidation },
    { name: "homeLabel", type: "text", required: true },
    { name: "copyright", type: "text", required: true },
  ],
};
