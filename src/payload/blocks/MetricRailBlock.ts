import type { Block } from "payload";
import { sectionControls } from "./shared";

export const MetricRailBlock: Block = {
  slug: "metricRail",
  labels: { singular: "Moving metric rail", plural: "Moving metric rails" },
  fields: [
    ...sectionControls,
    { name: "eyebrow", type: "text" },
    { name: "heading", type: "textarea", required: true },
    { name: "body", type: "textarea" },
    {
      name: "metrics",
      type: "array",
      minRows: 1,
      admin: { description: "Unlimited repeatable facts. Reorder to control the moving rail." },
      fields: [
        {
          name: "value",
          type: "text",
          required: true,
          admin: {
            description:
              "Enter the complete value exactly as it should appear, including symbol position (for example +40, 40+, %80, or 80%).",
          },
        },
        { name: "label", type: "textarea", required: true },
      ],
    },
  ],
};
