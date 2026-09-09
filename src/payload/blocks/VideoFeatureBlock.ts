import type { Block } from "payload";
import { buttonFields, sectionControls } from "./shared";

export const VideoFeatureBlock: Block = {
  slug: "videoFeature",
  labels: {
    singular: "Editorial video feature",
    plural: "Editorial video features",
  },
  fields: [
    ...sectionControls,
    { name: "eyebrow", type: "text" },
    { name: "heading", type: "textarea", required: true },
    { name: "body", type: "textarea" },
    {
      name: "videoSource",
      label: "Video source",
      type: "select",
      defaultValue: "upload",
      options: [
        { label: "Upload video", value: "upload" },
        { label: "YouTube link", value: "youtube" },
      ],
    },
    {
      name: "video",
      label: "Uploaded homepage video — 1920 × 1080 px (2×: 3840 × 2160)",
      type: "upload",
      relationTo: "media",
      filterOptions: { mimeType: { contains: "video" } },
      admin: {
        condition: (_, siblingData) => siblingData?.videoSource !== "youtube",
        description:
          "Homepage background/feature video (16:9 MP4 or WebM). 1920 × 1080 is recommended; 4K/2× is allowed. Videos keep their original format.",
      },
      validate: (
        value: unknown,
        { siblingData }: { siblingData?: { videoSource?: string } },
      ) =>
        siblingData?.videoSource === "youtube" || value
          ? true
          : "Upload a video or select YouTube link as the video source.",
    },
    {
      name: "youtubeURL",
      label: "YouTube video link",
      type: "text",
      admin: {
        condition: (_, siblingData) => siblingData?.videoSource === "youtube",
        description:
          "Paste a youtube.com/watch, youtu.be, youtube.com/shorts, or YouTube embed URL.",
      },
      validate: (
        value: unknown,
        { siblingData }: { siblingData?: { videoSource?: string } },
      ) =>
        siblingData?.videoSource !== "youtube" ||
        (typeof value === "string" &&
          /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)[\w-]{6,}/i.test(value))
          ? true
          : "Enter a valid YouTube video URL.",
    },
    {
      name: "poster",
      label: "Video poster image — 1920 × 1080 px (2×: 3840 × 2160; 3×: 5760 × 3240)",
      type: "upload",
      relationTo: "media",
      filterOptions: { mimeType: { contains: "image" } },
      admin: {
        description:
          "16:9 preview image shown before playback or while the video loads. 2×/3× files are allowed; JPEG/PNG uploads become WebP automatically.",
      },
    },
    {
      name: "mobilePoster",
      label: "Optional mobile video poster — 1080 × 1350 px (2×: 2160 × 2700; 3×: 3240 × 4050)",
      type: "upload",
      relationTo: "media",
      filterOptions: { mimeType: { contains: "image" } },
      admin: {
        description:
          "Optional portrait poster for phones (4:5). Leave empty to use the desktop poster automatically. JPEG/PNG uploads become WebP automatically.",
      },
    },
    {
      name: "caption",
      type: "text",
    },
    {
      name: "autoplay",
      type: "checkbox",
      defaultValue: true,
      admin: {
        description:
          "Autoplay is always muted and disabled when the visitor prefers reduced motion.",
      },
    },
    {
      name: "buttons",
      type: "array",
      maxRows: 2,
      fields: buttonFields,
    },
  ],
};
