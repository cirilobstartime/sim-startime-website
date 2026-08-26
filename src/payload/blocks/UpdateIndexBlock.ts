import type { Block } from "payload";
import { sectionControls } from "./shared";

export const UpdateIndexBlock: Block = {
  slug: "updateIndex",
  labels: {
    singular: "Updates listing labels",
    plural: "Updates listing labels",
  },
  fields: [
    ...sectionControls,
    { name: "readLabel", type: "text", required: true },
    { name: "backLabel", type: "text", required: true },
    { name: "relatedHeading", type: "text", required: true },
    { name: "viewAllLabel", type: "text", required: true },
  ],
};
