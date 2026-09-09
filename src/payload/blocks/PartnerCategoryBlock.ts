import type { Block } from "payload";
import { sectionControls } from "./shared";

export const PartnerCategoryBlock: Block = {
  slug: "partnerCategory",
  labels: {
    singular: "Partner logo category",
    plural: "Partner logo categories",
  },
  fields: [
    ...sectionControls,
    { name: "eyebrow", label: "Category label", type: "text" },
    { name: "heading", label: "Category title", type: "textarea", required: true },
    { name: "body", label: "Category introduction", type: "textarea" },
    {
      name: "logoLayout",
      label: "Logo display",
      type: "select",
      defaultValue: "grid",
      required: true,
      options: [
        { label: "Grid — show all logos", value: "grid" },
        { label: "Swiper — show navigation below logos", value: "swiper" },
      ],
      admin: {
        description:
          "Choose Grid to show every logo at once (two columns on mobile), or Swiper to add the website’s standard progress and arrow controls below this category.",
      },
    },
    {
      name: "logos",
      label: "Logos",
      type: "array",
      minRows: 1,
      labels: {
        singular: "Logo",
        plural: "Logos",
      },
      admin: {
        description:
          "Add, remove, duplicate, and reorder as many partner logos as needed.",
        initCollapsed: true,
      },
      fields: [
        {
          name: "visible",
          label: "Show this logo",
          type: "checkbox",
          defaultValue: true,
        },
        {
          name: "name",
          label: "Organization name",
          type: "text",
          required: true,
          admin: {
            description:
              "Used as the logo’s accessible name; it is not printed below the logo.",
          },
        },
        {
          name: "logo",
          label:
            "Logo artwork — standard 800 × 450 px; featured Supervision / Organizer 1200 × 675 px",
          type: "upload",
          relationTo: "media",
          required: true,
          admin: {
            description:
              "Standard 2×: 1600 × 900; 3×: 2400 × 1350. Featured 2×: 2400 × 1350; 3×: 3600 × 2025. Use a 16:9 canvas. JPEG/PNG uploads become WebP automatically.",
          },
        },
        {
          name: "tier",
          label: "Sponsor / partner type",
          type: "select",
          defaultValue: "none",
          options: [
            { label: "No badge", value: "none" },
            { label: "Supervision", value: "supervision" },
            { label: "Organizer", value: "organizer" },
            { label: "Media Partner", value: "media-partner" },
            { label: "Strategic Sponsor", value: "strategic" },
            { label: "Platinum Sponsor", value: "platinum" },
            { label: "Gold Sponsor", value: "gold" },
            { label: "Silver Sponsor", value: "silver" },
            { label: "Sector Sponsor", value: "sector" },
            { label: "Diamond Sponsor", value: "diamond" },
            { label: "Co-Sponsor", value: "co-sponsor" },
            { label: "Hospitality Sponsor", value: "hospitality-sponsor" },
            { label: "Official Carrier", value: "official-carrier" },
            { label: "Official Contractor", value: "official-contractor" },
            { label: "Marketing Partner", value: "marketing-partner" },
            { label: "Licensed To", value: "licensed-to" },
            { label: "Advisory Arm", value: "advisory-arm" },
          ],
          admin: {
            description:
              "Choose No badge or select a role/tier. The selected type appears in the approved matching gradient bar attached beneath the logo card.",
          },
        },
        {
          name: "href",
          label: "Organization website",
          type: "text",
        },
        {
          name: "openInNewTab",
          label: "Open website in a new tab",
          type: "checkbox",
          defaultValue: true,
          admin: {
            condition: (_, siblingData) => Boolean(siblingData?.href),
          },
        },
      ],
    },
  ],
};
