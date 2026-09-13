const scriptSources = [
  "https://www.googletagmanager.com",
  "https://www.google-analytics.com",
  "https://connect.facebook.net",
  "https://snap.licdn.com",
  "https://static.ads-twitter.com",
];

const analyticsConnectSources = [
  "https://*.google-analytics.com",
  "https://analytics.google.com",
  "https://stats.g.doubleclick.net",
  "https://www.google.com",
  "https://*.clarity.ms",
];

const analyticsImageSources = [
  "https://*.google-analytics.com",
  "https://stats.g.doubleclick.net",
  "https://www.google.com",
  "https://www.google.com.pk",
  "https://www.google.com.sa",
  "https://www.google.ae",
  "https://c.bing.com",
  "https://*.clarity.ms",
];

type ContentSecurityPolicyOptions = {
  allowInlineStyles?: boolean;
};

export function buildContentSecurityPolicy(
  nonce: string,
  development: boolean,
  { allowInlineStyles = false }: ContentSecurityPolicyOptions = {},
) {
  return [
    "default-src 'self'",
    "base-uri 'self'",
    `connect-src 'self' ${analyticsConnectSources.join(" ")} https://www.googletagmanager.com https://*.facebook.com https://*.facebook.net https://*.linkedin.com https://*.licdn.com https://*.adsymptotic.com https://*.ads-twitter.com https://*.twitter.com https://t.co`,
    "font-src 'self' data:",
    "form-action 'self'",
    "frame-ancestors 'self'",
    "frame-src 'self' https://www.googletagmanager.com https://www.youtube.com https://www.youtube-nocookie.com",
    `img-src 'self' data: blob: ${analyticsImageSources.join(" ")} https://www.googletagmanager.com https://*.facebook.com https://*.facebook.net https://*.linkedin.com https://*.licdn.com https://*.adsymptotic.com https://*.ads-twitter.com https://*.twitter.com https://t.co`,
    "media-src 'self' blob:",
    "object-src 'none'",
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${development ? " 'unsafe-eval'" : ""} ${scriptSources.join(" ")}`,
    "script-src-attr 'none'",
    allowInlineStyles
      ? "style-src 'self' 'unsafe-inline'"
      : `style-src 'self' 'nonce-${nonce}'`,
    "style-src-attr 'unsafe-inline'",
    "worker-src 'self' blob:",
  ].join("; ");
}
