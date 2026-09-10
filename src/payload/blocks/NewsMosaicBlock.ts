import type { Block } from "payload";
import { publicHrefValidation } from "@/lib/publicHref";
import { sectionControls } from "./shared";

export const NewsMosaicBlock: Block = {
  slug: "newsMosaic",
  labels: {
    singular: "News mosaic",
    plural: "News mosaics",
  },
  fields: [
    ...sectionControls,
    { name: "eyebrow", type: "text" },
    { name: "heading", type: "textarea", required: true },
    {
      name: "layout",
      type: "select",
      defaultValue: "mosaic",
      options: [
        { label: "Editorial grid", value: "grid" },
        { label: "Homepage swiper", value: "swiper" },
        { label: "Feature mosaic", value: "mosaic" },
      ],
      admin: {
        description:
          "Use the swiper for compact homepage news and the editorial grid for archive pages.",
      },
    },
    {
      name: "pageSize",
      type: "number",
      defaultValue: 9,
      min: 3,
      max: 30,
      admin: {
        condition: (_, siblingData) => siblingData?.layout === "grid",
        description:
          "Number of articles revealed at a time on an editorial grid.",
      },
    },
    {
      name: "articles",
      type: "array",
      minRows: 1,
      fields: [
        { name: "kicker", type: "text" },
        { name: "title", type: "textarea", required: true },
        { name: "summary", type: "textarea" },
        {
          name: "media",
          label: "News card image — 1200 × 800 px (2×: 2400 × 1600; 3×: 3600 × 2400)",
          type: "upload",
          relationTo: "media",
          required: true,
          admin: {
            description:
              "News/mosaic section image (3:2). Keep the main subject near center; JPEG/PNG uploads become WebP automatically.",
          },
        },
        {
          name: "mobileMedia",
          label: "Optional mobile news image — 1080 × 1350 px (2×: 2160 × 2700; 3×: 3240 × 4050)",
          type: "upload",
          relationTo: "media",
          admin: {
            description:
              "Optional portrait news image for phones (4:5). Leave empty to use the desktop news image automatically. JPEG/PNG uploads become WebP automatically.",
          },
        },
        { name: "href", type: "text", validate: publicHrefValidation },
      ],
    },
    { name: "ctaLabel", type: "text" },
    { name: "ctaHref", type: "text", validate: publicHrefValidation },
  ],
};
