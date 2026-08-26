import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const allowIndexing = process.env.NEXT_PUBLIC_ALLOW_INDEXING === "true";
  const origin = (
    process.env.NEXT_PUBLIC_APP_URL || "https://sim.startime.sa"
  ).replace(/\/$/, "");
  return {
    rules: allowIndexing
      ? {
          allow: "/",
          disallow: [
            "/content-admin",
            "/content-admin/",
            "/api/",
            "/uploads/form-submissions/",
          ],
          userAgent: "*",
        }
      : {
          disallow: "/",
          userAgent: "*",
        },
    sitemap: allowIndexing ? `${origin}/sitemap.xml` : undefined,
  };
}
