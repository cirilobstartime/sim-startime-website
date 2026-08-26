import { withPayload } from "@payloadcms/next/withPayload";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output:
    process.env.NEXT_OUTPUT_STANDALONE === "true" ? "standalone" : undefined,
  experimental: {
    cpus: 1,
  },
  async headers() {
    const publicAssetHeaders = [
      {
        key: "Cache-Control",
        value: "public, max-age=604800, stale-while-revalidate=86400",
      },
    ];
    const securityHeaders = [
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "X-Frame-Options", value: "SAMEORIGIN" },
      { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
      { key: "X-Permitted-Cross-Domain-Policies", value: "none" },
      {
        key: "Referrer-Policy",
        value: "strict-origin-when-cross-origin",
      },
      {
        key: "Permissions-Policy",
        value: "camera=(), microphone=(), geolocation=(), payment=()",
      },
    ];
    const privateSurfaceHeaders = [
      {
        key: "X-Robots-Tag",
        value: "noindex, nofollow, noarchive, nosnippet",
      },
      {
        key: "Cache-Control",
        value: "private, no-store, max-age=0",
      },
    ];
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
      {
        source: "/assets/:path*",
        headers: publicAssetHeaders,
      },
      {
        source: "/fonts/:path*",
        headers: publicAssetHeaders,
      },
      {
        source: "/content-admin/:path*",
        headers: privateSurfaceHeaders,
      },
      {
        source: "/api/:path((?!media/file(?:/|$)).*)",
        headers: privateSurfaceHeaders,
      },
      {
        source: "/api/media/file/:path*",
        headers: [
          {
            key: "Cache-Control",
            value:
              "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800",
          },
        ],
      },
    ];
  },
  images: {
    deviceSizes: [640, 750, 828, 1080, 1200, 1600, 1920, 2048],
    minimumCacheTTL: 604800,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cms.startime.sa",
      },
      {
        protocol: "https",
        hostname: "sim.startime.sa",
      },
      ...(process.env.NODE_ENV === "development"
        ? [
            { protocol: "http" as const, hostname: "localhost" },
            { protocol: "http" as const, hostname: "127.0.0.1" },
          ]
        : []),
    ],
  },
  turbopack: {
    root: process.cwd(),
  },
};

export default withPayload(nextConfig);
