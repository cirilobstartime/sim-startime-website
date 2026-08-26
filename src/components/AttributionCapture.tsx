"use client";

import { useEffect } from "react";
import type { MarketingSettings } from "@/content/types";
import { recordClientAttribution } from "@/lib/clientAttribution";
import { getOrCreateSessionID } from "@/lib/clientSession";
import { pushDataLayerEvent } from "@/lib/dataLayer";

export function AttributionCapture({
  settings,
}: {
  settings: MarketingSettings;
}) {
  useEffect(() => {
    const campaignParameters = [
      "li_fat_id",
      "twclid",
      ...settings.acceptedCampaignParameters
        .split(",")
        .map((key) => key.trim())
        .filter(Boolean),
    ].filter((key, index, keys) => keys.indexOf(key) === index);
    const params = new URLSearchParams(window.location.search);
    const campaign = Object.fromEntries(
      campaignParameters
        .map((key) => [key, params.get(key)] as const)
        .filter((entry): entry is readonly [string, string] =>
          Boolean(entry[1]),
        ),
    );
    let externalReferrer = "";
    try {
      if (
        document.referrer &&
        new URL(document.referrer).origin !== window.location.origin
      ) {
        externalReferrer = document.referrer;
      }
    } catch {
      externalReferrer = "";
    }
    const sessionID = getOrCreateSessionID();
    const hasTouch = Boolean(
      Object.keys(campaign).length || externalReferrer,
    );
    if (hasTouch) {
      recordClientAttribution({
        campaign,
        landingPage: `${window.location.pathname}${window.location.search}`,
        referrer: externalReferrer,
        retentionDays: settings.attributionCookieDays,
        sessionID,
      });
      pushDataLayerEvent({
        event: "startime_campaign_touch",
        campaign,
        landing_page: `${window.location.pathname}${window.location.search}`,
        session_id: sessionID,
      });
    }
    document.documentElement.dataset.attributionCaptured = "true";

    void fetch("/api/attribution", {
      body: JSON.stringify({
        campaign,
        landingPage: `${window.location.pathname}${window.location.search}`,
        referrer: externalReferrer,
        sessionID,
        touch: hasTouch,
      }),
      credentials: "same-origin",
      headers: { "content-type": "application/json" },
      method: "POST",
    });
  }, [
    settings.acceptedCampaignParameters,
    settings.attributionCookieDays,
  ]);

  return null;
}
