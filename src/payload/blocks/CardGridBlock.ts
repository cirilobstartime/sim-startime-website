import type { Block } from "payload";
import { countryOptions } from "@/content/countries";
import { buttonFields, sectionControls } from "./shared";

export const CardGridBlock: Block = {
  slug: "cardGrid",
  labels: {
    singular: "Flexible card grid",
    plural: "Flexible card grids",
  },
  fields: [
    ...sectionControls,
    { name: "eyebrow", type: "text" },
    { name: "heading", type: "textarea", required: true },
    { name: "body", type: "textarea" },
    {
      name: "layout",
      type: "select",
      defaultValue: "editorial",
      admin: {
        hidden: true,
      },
      options: [
        { label: "Editorial image grid", value: "editorial" },
        { label: "Editorial carousel", value: "swiper" },
        { label: "Corporate icon grid", value: "icons" },
        { label: "Horizontal feature list", value: "list" },
        { label: "Compact proof points", value: "proof" },
        { label: "Open editorial columns", value: "columns" },
        { label: "Dark checklist band", value: "checklist" },
        { label: "Compact sector rail", value: "tabs" },
      ],
    },
    {
      name: "cards",
      type: "array",
      minRows: 1,
      labels: {
        singular: "Entry",
        plural: "Entries",
      },
      admin: {
        description:
          "Repeatable with no maximum. Add, reorder, hide, replace or remove entries—for example organizer, sponsor, partner or speaker logos.",
      },
      fields: [
        { name: "internalLabel", type: "text", admin: { hidden: true } },
        { name: "visible", label: "Show this entry", type: "checkbox", defaultValue: true },
        { name: "eyebrow", label: "Card label", type: "text" },
        { name: "title", label: "Card heading", type: "textarea", required: true },
        { name: "body", label: "Card text", type: "textarea" },
        {
          name: "workplace",
          label: "Workplace / organization",
          type: "textarea",
          admin: {
            condition: (_, siblingData) =>
              String(siblingData?.internalLabel || "").startsWith("Speaker"),
            description:
              "Shown on its own line beneath the speaker's job title.",
          },
        },
        {
          name: "country",
          label: "Country",
          type: "select",
          options: countryOptions,
          admin: {
            condition: (_, siblingData) =>
              String(siblingData?.internalLabel || "").startsWith("Speaker"),
            description:
              "Select the country. Its flag is added automatically.",
            isClearable: true,
          },
        },
        {
          name: "media",
          label: "Image — speaker 900 × 1200; logo 800 × 450; editorial 1200 × 800 px (2×/3× allowed)",
          type: "upload",
          relationTo: "media",
          admin: {
            description:
              "Speaker portrait: 900 × 1200 px (2×: 1800 × 2400; 3×: 2700 × 3600). Organizer/logo: 800 × 450 px (2×: 1600 × 900; 3×: 2400 × 1350), transparent and centered. Editorial card: 1200 × 800 px (2×: 2400 × 1600; 3×: 3600 × 2400). JPEG/PNG uploads become WebP automatically.",
          },
        },
        {
          name: "icon",
          label: "Card icon",
          type: "select",
          options: [
            { label: "Shield", value: "shield" },
            { label: "Anchor", value: "anchor" },
            { label: "Circuitry", value: "circuitry" },
            { label: "Factory", value: "factory" },
            { label: "Buildings", value: "buildings" },
            { label: "Mountains", value: "mountains" },
            { label: "Heartbeat", value: "heartbeat" },
            { label: "Globe", value: "globe" },
            { label: "Handshake", value: "handshake" },
            { label: "Chart", value: "chart" },
            { label: "Users", value: "users" },
            { label: "Sparkle", value: "sparkle" },
            { label: "Compass", value: "compass" },
            { label: "Lightbulb", value: "lightbulb" },
            { label: "Gear", value: "gear" },
            { label: "Check", value: "check" },
            { label: "Megaphone", value: "megaphone" },
            { label: "Calendar", value: "calendar" },
            { label: "Envelope", value: "envelope" },
            { label: "Phone", value: "phone" },
            { label: "Map pin", value: "map-pin" },
          ],
        },
        { name: "meta", type: "text", admin: { hidden: true } },
        {
          name: "button",
          label: "Card link",
          type: "group",
          admin: {
            description: "Use only when this card links to another page.",
          },
          fields: buttonFields.map((field) =>
            "required" in field ? { ...field, required: false } : field,
          ),
        },
      ],
    },
    {
      name: "buttons",
      type: "array",
      maxRows: 2,
      fields: buttonFields,
    },
  ],
};
