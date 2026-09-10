import type { Block } from "payload";
import { buttonFields, sectionControls } from "./shared";

const youtubePattern =
  /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)[\w-]{6,}/i;

export const HeroBlock: Block = {
  slug: "hero",
  labels: {
    singular: "Cinematic hero",
    plural: "Cinematic heroes",
  },
  fields: [
    ...sectionControls,
    {
      type: "tabs",
      tabs: [
        {
          label: "Content",
          fields: [
            { name: "eyebrow", type: "text" },
            { name: "heading", type: "textarea", required: true },
            { name: "body", type: "textarea" },
            {
              name: "note",
              type: "textarea",
              admin: {
                description:
                  "Optional short qualification or protocol note shown below the primary content.",
              },
            },
            {
              name: "eventDetails",
              type: "array",
              maxRows: 4,
              fields: [
                { name: "label", type: "text", required: true },
                { name: "value", type: "text", required: true },
              ],
            },
          ],
        },
        {
          label: "Media",
          fields: [
            {
              name: "desktopBackgroundType",
              label: "Desktop hero background",
              type: "select",
              defaultValue: "image",
              options: [
                { label: "Image", value: "image" },
                { label: "Uploaded video", value: "upload" },
                { label: "YouTube video", value: "youtube" },
              ],
              admin: {
                description:
                  "Choose the desktop hero background. Existing heroes remain image-based unless you change this setting.",
              },
            },
            {
              name: "media",
              label: "Desktop hero image / video fallback — 1920 × 1080 px (2×: 3840 × 2160; 3×: 5760 × 3240)",
              type: "upload",
              relationTo: "media",
              filterOptions: { mimeType: { contains: "image" } },
              admin: {
                description:
                  "Full-width 16:9 hero image. It also remains behind a video as its loading/fallback poster. Keep the focal subject clear of text; JPEG/PNG uploads become WebP automatically.",
              },
            },
            {
              name: "desktopBackgroundVideo",
              label: "Desktop hero video upload — 1920 × 1080 px (16:9)",
              type: "upload",
              relationTo: "media",
              filterOptions: { mimeType: { contains: "video" } },
              admin: {
                condition: (_, siblingData) =>
                  siblingData?.desktopBackgroundType === "upload",
                description:
                  "Upload an optimized MP4 or WebM. The background autoplays muted, loops, and has no controls.",
              },
              validate: (
                value: unknown,
                { siblingData }: { siblingData?: { desktopBackgroundType?: string } },
              ) =>
                siblingData?.desktopBackgroundType !== "upload" || value
                  ? true
                  : "Upload the desktop hero video.",
            },
            {
              name: "desktopBackgroundYouTubeURL",
              label: "Desktop YouTube video link",
              type: "text",
              admin: {
                condition: (_, siblingData) =>
                  siblingData?.desktopBackgroundType === "youtube",
                description:
                  "Paste a YouTube watch, share, Shorts, or embed URL. It plays muted, loops, and shows no controls.",
              },
              validate: (
                value: unknown,
                { siblingData }: { siblingData?: { desktopBackgroundType?: string } },
              ) =>
                siblingData?.desktopBackgroundType !== "youtube" ||
                (typeof value === "string" && youtubePattern.test(value))
                  ? true
                  : "Enter a valid desktop YouTube video URL.",
            },
            {
              name: "mobileBackgroundType",
              label: "Mobile hero background",
              type: "select",
              defaultValue: "inherit",
              options: [
                { label: "Use desktop background", value: "inherit" },
                { label: "Mobile image", value: "image" },
                { label: "Mobile uploaded video", value: "upload" },
                { label: "Mobile YouTube video", value: "youtube" },
              ],
              admin: {
                description:
                  "Keep desktop inheritance, or select a separate background specifically for screens up to 767 px wide.",
              },
            },
            {
              name: "mobileMedia",
              label: "Mobile hero image / video fallback — 1080 × 1350 px (2×: 2160 × 2700; 3×: 3240 × 4050)",
              type: "upload",
              relationTo: "media",
              filterOptions: { mimeType: { contains: "image" } },
              admin: {
                description:
                  "Optional 4:5 mobile image and loading/fallback poster. Leave empty to use the desktop image. JPEG/PNG uploads become WebP automatically.",
              },
            },
            {
              name: "mobileBackgroundVideo",
              label: "Mobile hero video upload — 1080 × 1350 px (4:5)",
              type: "upload",
              relationTo: "media",
              filterOptions: { mimeType: { contains: "video" } },
              admin: {
                condition: (_, siblingData) =>
                  siblingData?.mobileBackgroundType === "upload",
                description:
                  "Upload an optimized portrait MP4 or WebM. It autoplays muted, loops, and has no controls.",
              },
              validate: (
                value: unknown,
                { siblingData }: { siblingData?: { mobileBackgroundType?: string } },
              ) =>
                siblingData?.mobileBackgroundType !== "upload" || value
                  ? true
                  : "Upload the mobile hero video.",
            },
            {
              name: "mobileBackgroundYouTubeURL",
              label: "Mobile YouTube video link",
              type: "text",
              admin: {
                condition: (_, siblingData) =>
                  siblingData?.mobileBackgroundType === "youtube",
                description:
                  "Paste the mobile-specific YouTube watch, share, Shorts, or embed URL.",
              },
              validate: (
                value: unknown,
                { siblingData }: { siblingData?: { mobileBackgroundType?: string } },
              ) =>
                siblingData?.mobileBackgroundType !== "youtube" ||
                (typeof value === "string" && youtubePattern.test(value))
                  ? true
                  : "Enter a valid mobile YouTube video URL.",
            },
          ],
        },
        {
          label: "Buttons",
          fields: [
            {
              name: "buttons",
              type: "array",
              maxRows: 3,
              fields: buttonFields,
            },
          ],
        },
      ],
    },
  ],
};
