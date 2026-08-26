import type { Block } from "payload";
import { sectionControls } from "./shared";

export const CountdownBlock: Block = {
  slug: "countdown",
  labels: {
    singular: "Event countdown",
    plural: "Event countdowns",
  },
  fields: [
    ...sectionControls,
    { name: "heading", type: "text", required: true },
    { name: "targetDate", type: "date", required: true, admin: { date: { pickerAppearance: "dayAndTime" } } },
    {
      name: "labels",
      type: "group",
      fields: [
        { name: "months", type: "text", required: true },
        { name: "days", type: "text", required: true },
        { name: "hours", type: "text", required: true },
        { name: "minutes", type: "text", required: true },
        { name: "seconds", type: "text", required: true },
      ],
    },
  ],
};
