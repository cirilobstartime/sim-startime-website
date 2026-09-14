import type { GlobalConfig } from "payload";
import { authenticatedStaff } from "../access";
import {
  PUBLIC_CACHE_TAGS,
  revalidateGlobalAfterChange,
} from "../hooks/revalidatePublicContent";

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
  hooks: {
    afterChange: [
      revalidateGlobalAfterChange([
        PUBLIC_CACHE_TAGS.siteSettings,
        PUBLIC_CACHE_TAGS.pages,
      ]),
    ],
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
          label:
            "Optional mobile header logo — 800 × 300 px (2×: 1600 × 600; 3×: 2400 × 900)",
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
          label:
            "Optional mobile footer logo — 800 × 300 px (2×: 1600 × 600; 3×: 2400 × 900)",
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
      type: "collapsible",
      label: "Default social sharing image",
      admin: {
        initCollapsed: false,
      },
      fields: [
        {
          name: "defaultOpenGraphImage",
          label:
            "Website Open Graph image — 1200 × 630 px (2×: 2400 × 1260; 3×: 3600 × 1890)",
          type: "upload",
          relationTo: "media",
          admin: {
            description:
              "Used for social previews across the English and Arabic website whenever a page or news article does not have its own social sharing image. Keep the 1.91:1 ratio and important content away from the edges. JPEG/PNG uploads become WebP automatically.",
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
    {
      type: "collapsible",
      label: "Coming soon mode",
      admin: {
        initCollapsed: false,
      },
      fields: [
        {
          name: "comingSoonEnabled",
          label: "Enable coming soon mode",
          type: "checkbox",
          defaultValue: false,
          admin: {
            description:
              "When enabled, every public website URL temporarily redirects to the coming soon page. The Content Studio, APIs, media, form submissions, and code deployments remain available. Turn this off to restore the full website immediately.",
          },
        },
        {
          name: "comingSoon",
          label: "Coming soon page content",
          type: "group",
          fields: [
            {
              name: "label",
              label: "Small heading",
              type: "text",
              admin: {
                description:
                  "Optional. Example: Saudi International Maritime Forum 2026.",
              },
            },
            {
              name: "title",
              label: "Main heading",
              type: "text",
              admin: {
                description:
                  "Leave empty to use the built-in English or Arabic coming soon heading.",
              },
            },
            {
              name: "message",
              label: "Supporting message",
              type: "textarea",
            },
            {
              name: "eventDate",
              label: "Event date",
              type: "text",
            },
            {
              name: "venue",
              label: "Venue",
              type: "text",
            },
            {
              name: "contactLabel",
              label: "Contact link text",
              type: "text",
            },
            {
              name: "contactEmail",
              label: "Contact email address",
              type: "email",
              defaultValue: "sim@startime.sa",
            },
            {
              name: "backgroundImage",
              label:
                "Desktop background image — 1920 × 1080 px (2×: 3840 × 2160; 3×: 5760 × 3240)",
              type: "upload",
              relationTo: "media",
              admin: {
                description:
                  "Optional full-screen background (16:9). Leave empty to use the built-in SIM maritime image. JPEG/PNG uploads become WebP automatically.",
              },
            },
            {
              name: "mobileBackgroundImage",
              label:
                "Optional mobile background — 1080 × 1920 px (2×: 2160 × 3840; 3×: 3240 × 5760)",
              type: "upload",
              relationTo: "media",
              admin: {
                description:
                  "Optional phone-specific portrait image (9:16). Leave empty to use the desktop background. JPEG/PNG uploads become WebP automatically.",
              },
            },
          ],
        },
      ],
    },
  ],
};
