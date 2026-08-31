import type { CollectionConfig } from "payload";
import { authenticatedStaff } from "../access";

const mediaUploadDir = process.env.MEDIA_UPLOAD_DIR || "uploads/media";

export const Media: CollectionConfig = {
  slug: "media",
  admin: {
    description:
      "Upload images and videos used across SIMF. JPEG and PNG images are automatically stored as optimized WebP; videos keep their original format. Exact role and recommended dimensions are shown beside every image field where this media is selected.",
    group: "Content",
    useAsTitle: "title",
  },
  access: {
    create: authenticatedStaff,
    delete: authenticatedStaff,
    read: () => true,
    update: authenticatedStaff,
  },
  upload: {
    adminThumbnail: "thumbnail",
    filesRequiredOnCreate: true,
    focalPoint: true,
    formatOptions: {
      format: "webp",
      options: { quality: 86 },
    },
    imageSizes: [
      {
        name: "thumbnail",
        width: 480,
        height: 320,
        position: "centre",
        formatOptions: { format: "webp", options: { quality: 82 } },
      },
      {
        name: "card",
        width: 960,
        height: 640,
        position: "centre",
        formatOptions: { format: "webp", options: { quality: 84 } },
      },
      {
        name: "hero",
        width: 1920,
        height: 1080,
        position: "centre",
        formatOptions: { format: "webp", options: { quality: 86 } },
      },
    ],
    mimeTypes: [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/gif",
      "video/mp4",
      "video/webm",
    ],
    staticDir: mediaUploadDir,
  },
  fields: [
    {
      name: "title",
      type: "text",
      localized: true,
      required: true,
      admin: {
        description:
          "Editable image title used for the media-library label and the image title attribute on the website.",
      },
    },
    {
      name: "alt",
      type: "text",
      localized: true,
      required: true,
      admin: {
        description:
          "Describe the image for accessibility and search engines. Do not repeat nearby text unless needed for context.",
      },
    },
    {
      name: "caption",
      type: "textarea",
      localized: true,
    },
    {
      name: "usageNotes",
      type: "textarea",
      admin: {
        description: "Internal guidance for editors.",
      },
    },
  ],
};
