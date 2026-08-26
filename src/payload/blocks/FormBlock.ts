import type { Block } from "payload";
import { sectionControls } from "./shared";

export const FormBlock: Block = {
  slug: "form",
  labels: {
    singular: "Secure form",
    plural: "Secure forms",
  },
  fields: [
    ...sectionControls,
    { name: "eyebrow", type: "text" },
    { name: "heading", type: "textarea", required: true },
    { name: "body", type: "textarea" },
    {
      name: "form",
      type: "relationship",
      relationTo: "forms",
      required: true,
    },
    { name: "successHeading", type: "text", required: true },
    { name: "successMessage", type: "textarea", required: true },
    { name: "privacyNote", type: "textarea" },
  ],
};
