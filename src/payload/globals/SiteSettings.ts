import type { GlobalConfig } from "payload";
import { authenticatedStaff } from "../access";

export const SiteSettings: GlobalConfig = {
  slug: "site-settings",
  label: "Website branding & languages",
  admin: {
    group: "Website settings",
    description:
      "Change the shared header and footer logos once for the whole website, and control which public languages are available.",
  },
  access: {
    read: () => true,
    update: authenticatedStaff,
  },
  fields: [
    {
      type: "collapsible",
      label: "Shared header and footer logos",
      admin: {
        initCollapsed: false,
      },
      fields: [
        {
          name: "headerLogo",
          label: "Header logo — 800 × 300 px (2×: 1600 × 600; 3×: 2400 × 900)",
          type: "upload",
          relationTo: "media",
          admin: {
            description:
              "Shared header logo — 800 × 300 px (2×: 1600 × 600; 3×: 2400 × 900). Use transparent artwork with safe space around the complete mark. JPEG/PNG uploads become WebP automatically.",
          },
        },
        {
          name: "mobileHeaderLogo",
          label: "Optional mobile header logo — 800 × 300 px (2×: 1600 × 600; 3×: 2400 × 900)",
          type: "upload",
          relationTo: "media",
          admin: {
            description:
              "Optional phone-specific shared header logo. Leave empty to use the desktop header logo automatically. JPEG/PNG uploads become WebP automatically.",
          },
        },
        {
          name: "footerLogo",
          label: "Footer logo — 800 × 300 px (2×: 1600 × 600; 3×: 2400 × 900)",
          type: "upload",
          relationTo: "media",
          admin: {
            description:
              "Shared footer logo — 800 × 300 px (2×: 1600 × 600; 3×: 2400 × 900). Use transparent artwork; leave empty to reuse the header logo. JPEG/PNG uploads become WebP automatically.",
          },
        },
        {
          name: "mobileFooterLogo",
          label: "Optional mobile footer logo — 800 × 300 px (2×: 1600 × 600; 3×: 2400 × 900)",
          type: "upload",
          relationTo: "media",
          admin: {
            description:
              "Optional phone-specific shared footer logo. Leave empty to use the desktop footer logo automatically. JPEG/PNG uploads become WebP automatically.",
          },
        },
      ],
    },
    {
      name: "enableArabic",
      label: "Enable Arabic website",
      type: "checkbox",
      defaultValue: false,
      admin: {
        description:
          "When disabled, Arabic pages and the AR language switch are hidden. Re-enable this to restore the switch and every Arabic page that is individually visible and published.",
      },
    },
  ],
};
