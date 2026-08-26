const scriptSources = [
  "https://www.googletagmanager.com",
  "https://www.google-analytics.com",
  "https://connect.facebook.net",
  "https://snap.licdn.com",
  "https://static.ads-twitter.com",
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
    "connect-src 'self' https://*.google-analytics.com https://www.googletagmanager.com https://*.facebook.com https://*.facebook.net https://*.linkedin.com https://*.licdn.com https://*.adsymptotic.com https://*.ads-twitter.com https://*.twitter.com https://t.co",
    "font-src 'self' data:",
    "form-action 'self'",
    "frame-ancestors 'self'",
    "frame-src 'self' https://www.googletagmanager.com https://www.youtube.com https://www.youtube-nocookie.com",
    "img-src 'self' data: blob: https://*.google-analytics.com https://www.googletagmanager.com https://*.facebook.com https://*.facebook.net https://*.linkedin.com https://*.licdn.com https://*.adsymptotic.com https://*.ads-twitter.com https://*.twitter.com https://t.co",
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
