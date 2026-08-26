import type { CollectionConfig } from "payload";

const staffOnly = ({ req }: { req: { user?: unknown } }) => Boolean(req.user);
const formUploadDir = process.env.FORM_UPLOAD_DIR || "uploads/form-uploads";

export const FormUploads: CollectionConfig = {
  slug: "form-uploads",
  labels: { singular: "Private form upload", plural: "Private form uploads" },
  admin: {
    group: "Lead capture",
    useAsTitle: "originalName",
  },
  access: {
    create: staffOnly,
    delete: staffOnly,
    read: staffOnly,
    update: staffOnly,
  },
  upload: {
    staticDir: formUploadDir,
    filesRequiredOnCreate: true,
    mimeTypes: [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "image/jpeg",
      "image/png",
    ],
  },
  fields: [
    { name: "originalName", type: "text", required: true },
    { name: "formKey", type: "text", required: true },
    { name: "fieldName", type: "text", required: true },
  ],
};
