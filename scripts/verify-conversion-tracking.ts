import {
  attributionDataLayerFields,
  recordClientAttribution,
} from "../src/lib/clientAttribution";
import { pushDataLayerEvent } from "../src/lib/dataLayer";

function storage() {
  const values = new Map<string, string>();
  return {
    getItem: (key: string) => values.get(key) || null,
    removeItem: (key: string) => values.delete(key),
    setItem: (key: string, value: string) => values.set(key, value),
  };
}

const localStorage = storage();
const sessionStorage = storage();
const dataLayer: Array<Record<string, unknown>> = [];

Object.assign(globalThis, {
  document: {
    documentElement: {
      dataset: {} as Record<string, string>,
      lang: "en",
    },
  },
  window: {
    crypto: globalThis.crypto,
    dataLayer,
    localStorage,
    sessionStorage,
  },
});

recordClientAttribution({
  campaign: {
    gclid: "qa-click-id",
    li_fat_id: "qa-linkedin-click-id",
    twclid: "qa-x-click-id",
    utm_campaign: "conversion-audit",
    utm_content: "sponsor-ad",
    utm_medium: "cpc",
    utm_source: "qa-google",
  },
  landingPage:
    "/contact?utm_source=qa-google&utm_medium=cpc&utm_campaign=conversion-audit",
  referrer: "",
  retentionDays: 90,
  sessionID: "qa-session",
});

pushDataLayerEvent({
  event: "generate_lead",
  form_key: "simf-contact",
  submission_reference: "QA-REFERENCE",
});

const event = dataLayer.at(-1) || {};
const fields = attributionDataLayerFields();
const passed =
  event.event === "generate_lead" &&
  event.utm_source === "qa-google" &&
  event.utm_medium === "cpc" &&
  event.utm_campaign === "conversion-audit" &&
  event.utm_content === "sponsor-ad" &&
  event.gclid === "qa-click-id" &&
  event.li_fat_id === "qa-linkedin-click-id" &&
  event.twclid === "qa-x-click-id" &&
  event.first_touch_utm_source === "qa-google" &&
  event.latest_touch_utm_source === "qa-google" &&
  fields.latest_touch_utm_campaign === "conversion-audit";

console.log(
  JSON.stringify(
    {
      event: event.event,
      firstTouchSource: event.first_touch_utm_source,
      latestTouchSource: event.latest_touch_utm_source,
      passed,
      preservedCampaignKeys: Object.keys(event)
        .filter(
          (key) =>
            key.startsWith("utm_") ||
            key.startsWith("first_touch_utm_") ||
            key.startsWith("latest_touch_utm_") ||
            ["gclid", "gbraid", "wbraid", "fbclid", "msclkid", "ttclid", "li_fat_id", "twclid"].includes(
              key,
            ),
        )
        .sort(),
    },
    null,
    2,
  ),
);

if (!passed) process.exitCode = 1;
