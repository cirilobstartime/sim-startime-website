import type { Block } from "payload";
import { sectionControls } from "./shared";

export const ImageStoryBlock: Block = {
  slug: "imageStory",
  labels: {
    singular: "Image story",
    plural: "Image stories",
  },
  fields: [
    ...sectionControls,
    { name: "eyebrow", type: "text" },
    { name: "heading", type: "textarea", required: true },
    { name: "body", type: "textarea" },
    {
      name: "images",
      type: "array",
      minRows: 1,
      maxRows: 4,
      fields: [
        {
          name: "media",
          label: "Image-story section image — 1400 × 1050 px (2×: 2800 × 2100; 3×: 4200 × 3150)",
          type: "upload",
          relationTo: "media",
          required: true,
          admin: {
            description:
              "Editorial section image (4:3). Higher-resolution 2×/3× files are allowed; JPEG/PNG uploads become WebP automatically.",
          },
        },
        { name: "caption", type: "text" },
      ],
    },
    { name: "ctaLabel", type: "text" },
    { name: "ctaHref", type: "text" },
  ],
};
