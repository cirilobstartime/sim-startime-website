import type { Block } from "payload";
import { mediaField, sectionControls } from "./shared";

export const MediaFeatureBlock: Block = {
  slug: "mediaFeature",
  labels: {
    singular: "Media feature",
    plural: "Media features",
  },
  fields: [
    ...sectionControls,
    { name: "eyebrow", type: "text" },
    { name: "heading", type: "textarea", required: true },
    { name: "body", type: "textarea" },
    mediaField,
    {
      name: "mediaPosition",
      type: "select",
      defaultValue: "start",
      options: [
        { label: "Start", value: "start" },
        { label: "End", value: "end" },
        { label: "Background", value: "background" },
      ],
    },
    {
      name: "theme",
      type: "select",
      defaultValue: "dark",
      options: [
        { label: "Dark", value: "dark" },
        { label: "Light", value: "light" },
      ],
    },
    { name: "ctaLabel", type: "text" },
    { name: "ctaHref", type: "text" },
  ],
};
