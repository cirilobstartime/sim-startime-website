import nextEnv from "@next/env";

nextEnv.loadEnvConfig(process.cwd());
const { verifyAttributionTouch } = await import(
  "../src/lib/attributionSecurity"
);
const appURL = process.env.QA_APP_URL || "http://localhost:3004";
const publicURL = process.env.QA_PUBLIC_URL || process.env.NEXT_PUBLIC_APP_URL || appURL;

const response = await fetch(`${appURL}/api/attribution`, {
  method: "POST",
  headers: {
    "content-type": "application/json",
    origin: appURL,
    referer: `${publicURL}/?utm_source=verified-url&utm_campaign=qa-audit`,
  },
  body: JSON.stringify({
    campaign: { utm_source: "forged-body", unexpected: "blocked" },
    landingPage: "/forged",
    referrer: "https://www.linkedin.com/",
    sessionID: "qa-attribution-session",
    touch: true,
  }),
});

const cookies = response.headers.getSetCookie();
const latest = cookies
  .find((value) => value.startsWith("st_latest_touch="))
  ?.match(/^st_latest_touch=([^;]+)/)?.[1];
const verified = verifyAttributionTouch(latest);
const campaign =
  verified?.campaign && typeof verified.campaign === "object"
    ? (verified.campaign as Record<string, unknown>)
    : {};
const result = {
  campaign,
  landingPage: verified?.landingPage,
  passed:
    response.status === 200 &&
    campaign.utm_source === "verified-url" &&
    campaign.utm_campaign === "qa-audit" &&
    !("unexpected" in campaign) &&
    verified?.landingPage === "/?utm_source=verified-url&utm_campaign=qa-audit",
  signedCookieVerified: Boolean(verified),
  status: response.status,
};

console.log(JSON.stringify(result, null, 2));
if (!result.passed) process.exitCode = 1;
