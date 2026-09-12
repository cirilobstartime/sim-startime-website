import type { Block } from "payload";
import { publicHrefValidation } from "@/lib/publicHref";
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
    {
      name: "heading",
      label: "Category title",
      type: "textarea",
      required: true,
    },
    { name: "body", label: "Category introduction", type: "textarea" },
    {
      name: "showSectionHeading",
      label: "Show category heading above this section",
      type: "checkbox",
      defaultValue: true,
      admin: {
        description:
          "Turn this off when the logos should appear without a visible section title, for example the Ministry of Defense and Royal Saudi Naval Forces logos.",
      },
    },
    {
      name: "presentationStyle",
      label: "Category design",
      type: "select",
      defaultValue: "logo-cards",
      required: true,
      options: [
        {
          label: "Logo cards — current grid / swiper design",
          value: "logo-cards",
        },
        {
          label: "Partner profiles — description beside each logo",
          value: "partner-profiles",
        },
      ],
      admin: {
        description:
          "Choose the current logo-card design or a profile layout with text on one side and the logo on the other. This setting applies only to this category.",
      },
    },
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
        condition: (_, siblingData) =>
          siblingData?.presentationStyle !== "partner-profiles",
      },
    },
    {
      name: "showProfileCategoryLabels",
      label: "Show category below logos in this profile section",
      type: "checkbox",
      defaultValue: true,
      admin: {
        description:
          "Applies to every logo in this profile section. Turn it off to hide the category bars for this section only; individual logo switches remain available for exceptions.",
        condition: (_, siblingData) =>
          siblingData?.presentationStyle === "partner-profiles",
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
          name: "description",
          label: "Organization description",
          type: "textarea",
          admin: {
            description:
              "Used by the Partner profiles design. Leave empty when this logo is shown only as a logo card.",
            condition: (_, siblingData) => Boolean(siblingData),
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
          name: "mobileLogo",
          label:
            "Optional mobile logo artwork — standard 800 × 450 px; featured 1200 × 675 px",
          type: "upload",
          relationTo: "media",
          admin: {
            description:
              "Optional phone-specific logo artwork using the same 16:9 canvas. Standard 2×: 1600 × 900; 3×: 2400 × 1350. Featured 2×: 2400 × 1350; 3×: 3600 × 2025. Leave empty to use the desktop logo automatically. JPEG/PNG uploads become WebP automatically.",
          },
        },
        {
          name: "tier",
          label: "Sponsor / partner type",
          type: "select",
          defaultValue: "none",
          options: [
            { label: "No badge", value: "none" },
            { label: "Supervision — الإشراف", value: "supervision" },
            { label: "Organizer — المنظم", value: "organizer" },
            {
              label: "Media Partner — الشريك الإعلامي",
              value: "media-partner",
            },
            {
              label: "Strategic Partner — الشريك الاستراتيجي",
              value: "strategic",
            },
            { label: "Platinum Sponsor — الراعي البلاتيني", value: "platinum" },
            { label: "Gold Sponsor — الراعي الذهبي", value: "gold" },
            { label: "Silver Sponsor — الراعي الفضي", value: "silver" },
            { label: "Sector Sponsor — راعي القطاع", value: "sector" },
            { label: "Diamond Sponsor — الراعي الماسي", value: "diamond" },
            { label: "Co-Sponsor — الراعي المشارك", value: "co-sponsor" },
            {
              label: "Hospitality Sponsor — راعي الضيافة",
              value: "hospitality-sponsor",
            },
            {
              label: "Official Carrier — الناقل الرسمي",
              value: "official-carrier",
            },
            {
              label: "Official Contractor — المقاول الرسمي",
              value: "official-contractor",
            },
            {
              label: "Marketing Partner — شريك التسويق",
              value: "marketing-partner",
            },
            { label: "Licensed To — مرخص لـ", value: "licensed-to" },
            { label: "Advisory Arm — الذراع الاستشاري", value: "advisory-arm" },
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
          validate: publicHrefValidation,
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
        {
          name: "showCategoryLabel",
          label: "Show sponsor / partner type below this logo",
          type: "checkbox",
          defaultValue: true,
          admin: {
            description:
              "Turn off to show only the logo. In Partner profiles, the selected type appears below the logo instead of as part of the card.",
          },
        },
      ],
    },
  ],
};
