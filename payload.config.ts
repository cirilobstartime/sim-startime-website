import { sqliteAdapter } from "@payloadcms/db-sqlite";
import { nodemailerAdapter } from "@payloadcms/email-nodemailer";
import {
  FixedToolbarFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from "@payloadcms/richtext-lexical";
import { buildConfig } from "payload";
import sharp from "sharp";
import { Media } from "./src/payload/collections/Media";
import { Forms } from "./src/payload/collections/Forms";
import { FormSubmissions } from "./src/payload/collections/FormSubmissions";
import { FormUploads } from "./src/payload/collections/FormUploads";
import { Pages } from "./src/payload/collections/Pages";
import { Redirects } from "./src/payload/collections/Redirects";
import { Updates } from "./src/payload/collections/Updates";
import { Users } from "./src/payload/collections/Users";
import { MarketingSettings } from "./src/payload/globals/MarketingSettings";
import { SiteSettings } from "./src/payload/globals/SiteSettings";

// Keep libvips predictable on the 1 GB production instance. Upload conversion
// and Next image optimization share this process, so unrestricted parallel
// work can otherwise stall CMS autosaves and public requests.
sharp.cache({ files: 20, items: 50, memory: 20 });
sharp.concurrency(1);

const serverURL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
const configuredPayloadSecret = process.env.PAYLOAD_SECRET;
const payloadSecret =
  configuredPayloadSecret ||
  "simf-local-development-secret-change-before-production";
const smtpHost = process.env.SMTP_HOST?.trim();
const smtpUser = process.env.SMTP_USER?.trim();
const smtpPassword = process.env.SMTP_PASSWORD?.replaceAll(" ", "");
const smtpPort = Number(process.env.SMTP_PORT || 587);
const smtpConfigured = Boolean(smtpHost && smtpUser && smtpPassword);

if (
  process.env.NODE_ENV === "production" &&
  (!configuredPayloadSecret || configuredPayloadSecret.length < 32)
) {
  throw new Error(
    "PAYLOAD_SECRET must be configured with at least 32 characters in production.",
  );
}

export default buildConfig({
  email: nodemailerAdapter({
    defaultFromAddress:
      process.env.EMAIL_FROM_ADDRESS?.trim() ||
      smtpUser ||
      "notifications@localhost",
    defaultFromName:
      process.env.EMAIL_FROM_NAME?.trim() || "SIM 2026 Website",
    skipVerify: !smtpConfigured,
    transportOptions: {
      auth: {
        pass: smtpPassword || "",
        user: smtpUser || "",
      },
      connectionTimeout: 10_000,
      greetingTimeout: 10_000,
      host: smtpHost || "localhost",
      port: Number.isFinite(smtpPort) ? smtpPort : 587,
      requireTLS: process.env.SMTP_SECURE !== "true",
      secure: process.env.SMTP_SECURE === "true",
      socketTimeout: 20_000,
    },
  }),
  editor: lexicalEditor({
    features: ({ defaultFeatures }) => [
      ...defaultFeatures,
      FixedToolbarFeature(),
      InlineToolbarFeature(),
    ],
  }),
  admin: {
    user: Users.slug,
    components: {
      providers: [
        {
          path: "./src/payload/admin/CmsSessionGuard",
          exportName: "CmsSessionGuard",
        },
      ],
      beforeDashboard: [
        {
          path: "./src/payload/admin/CmsDashboardIntro",
          exportName: "CmsDashboardIntro",
        },
      ],
      graphics: {
        Icon: {
          path: "./src/payload/admin/StartimeBrand",
          exportName: "StartimeIcon",
        },
        Logo: {
          path: "./src/payload/admin/StartimeBrand",
          exportName: "StartimeLogo",
        },
      },
    },
    meta: {
      icons: {
        icon: [
          {
            type: "image/png",
            url: "/assets/simf-microsite/organizers/simf-mark-blue.png",
          },
        ],
        shortcut: "/favicon.ico",
      },
      titleSuffix: "— SIM 2026 Content Studio",
    },
  },
  collections: [
    Users,
    Pages,
    Media,
    Forms,
    FormSubmissions,
    FormUploads,
    Redirects,
    Updates,
  ],
  globals: [SiteSettings, MarketingSettings],
  db: sqliteAdapter({
    client: {
      url: process.env.DATABASE_URL || "file:./simf.db",
    },
    blocksAsJSON: true,
    wal: true,
  }),
  experimental: {
    localizeStatus: true,
  },
  localization: {
    defaultLocale: "en",
    defaultLocalePublishOption: "active",
    fallback: false,
    locales: [
      {
        code: "en",
        label: "English",
      },
      {
        code: "ar",
        label: "Arabic",
        rtl: true,
      },
    ],
  },
  routes: {
    admin: "/content-admin",
    api: "/api",
  },
  cors: [serverURL],
  csrf: [serverURL],
  secret: payloadSecret,
  serverURL,
  sharp,
  typescript: {
    outputFile: "src/generated/payload-types.ts",
  },
});
