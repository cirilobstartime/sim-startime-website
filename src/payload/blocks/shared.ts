import type { Field } from "payload";

export const sectionControls: Field[] = [
  {
    name: "internalLabel",
    label: "Section name in CMS",
    type: "text",
    admin: {
      description:
        "An editor-friendly name for finding this section. It is not displayed on the website.",
    },
  },
  {
    name: "visible",
    type: "checkbox",
    defaultValue: true,
    admin: {
      description: "Turn this off to hide the section without deleting it.",
    },
  },
  {
    name: "anchorID",
    type: "text",
    admin: {
      hidden: true,
    },
  },
  {
    name: "displayOrder",
    type: "number",
    defaultValue: 0,
    min: 0,
    admin: {
      hidden: true,
    },
  },
  {
    name: "appearance",
    type: "group",
    fields: [
      {
        name: "theme",
        label: "Section color style",
        type: "select",
        defaultValue: "light",
        options: [
          { label: "Light", value: "light" },
          { label: "Dark", value: "dark" },
          { label: "SIMF navy", value: "brand" },
          { label: "Transparent", value: "transparent" },
        ],
      },
      {
        name: "backgroundColor",
        label: "Custom background color",
        type: "text",
        admin: {
          description: "Optional CSS color override, for example #101114.",
        },
      },
      {
        name: "backgroundImage",
        label: "Desktop background image — 1920 × 1080 px (2×: 3840 × 2160; 3×: 5760 × 3240)",
        type: "upload",
        relationTo: "media",
        admin: {
          description:
            "Full-width section background image (16:9). Higher-resolution 2× or 3× files are allowed; JPEG/PNG uploads are converted to WebP automatically.",
        },
      },
      {
        name: "mobileBackgroundImage",
        label: "Mobile background image — 1080 × 1350 px (2×: 2160 × 2700; 3×: 3240 × 4050)",
        type: "upload",
        relationTo: "media",
        admin: {
          description:
            "Optional portrait section background for phones (4:5). Leave empty to use the desktop background automatically. Higher-resolution 2× or 3× files are allowed; JPEG/PNG uploads are converted to WebP automatically.",
        },
      },
      {
        name: "overlayOpacity",
        label: "Image overlay strength",
        type: "number",
        defaultValue: 45,
        min: 0,
        max: 90,
      },
      {
        name: "spacing",
        label: "Section spacing",
        type: "select",
        defaultValue: "large",
        options: [
          { label: "Compact", value: "compact" },
          { label: "Standard", value: "standard" },
          { label: "Large", value: "large" },
        ],
      },
    ],
  },
];

export const buttonFields: Field[] = [
  { name: "label", type: "text", required: true },
  { name: "href", type: "text", required: true },
  {
    name: "style",
    type: "select",
    defaultValue: "primary",
    options: [
      { label: "Primary", value: "primary" },
      { label: "Outline", value: "outline" },
      { label: "Text", value: "text" },
    ],
  },
  {
    name: "icon",
    type: "select",
    defaultValue: "arrow-up-right",
    options: [
      { label: "Arrow up right", value: "arrow-up-right" },
      { label: "Arrow right", value: "arrow-right" },
      { label: "Download", value: "download" },
      { label: "Calendar", value: "calendar" },
      { label: "Envelope", value: "envelope" },
      { label: "None", value: "none" },
    ],
  },
  {
    name: "trackingID",
    type: "text",
    admin: {
      hidden: true,
    },
  },
  { name: "openInNewTab", type: "checkbox", defaultValue: false },
];

export const mediaField: Field = {
  name: "media",
  label: "Section image — 1600 × 1000 px (2×: 3200 × 2000; 3×: 4800 × 3000)",
  type: "upload",
  relationTo: "media",
  admin: {
    description:
      "Primary section image (8:5 landscape). Higher-resolution 2× or 3× files are allowed at the same ratio; JPEG/PNG uploads become WebP automatically.",
  },
};

export const mobileMediaField: Field = {
  name: "mobileMedia",
  label: "Optional mobile section image — 1080 × 1350 px (2×: 2160 × 2700; 3×: 3240 × 4050)",
  type: "upload",
  relationTo: "media",
  admin: {
    description:
      "Optional portrait image for phones (4:5). Leave empty to use the desktop section image automatically. Higher-resolution 2× or 3× files are allowed; JPEG/PNG uploads become WebP automatically.",
  },
};
