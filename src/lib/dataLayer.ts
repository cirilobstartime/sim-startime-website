"use client";

import { attributionDataLayerFields } from "./clientAttribution";
import { getOrCreateSessionID } from "./clientSession";

declare global {
  interface Window {
    dataLayer?: Array<unknown>;
    gtag?: (...args: unknown[]) => void;
  }
}

export function pushDataLayerEvent(event: Record<string, unknown>) {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    ...attributionDataLayerFields(),
    page_language: document.documentElement.lang || "en",
    session_id: getOrCreateSessionID(),
    ...event,
  });

  // Non-sensitive diagnostics make tracking verifiable without exposing
  // campaign values, form values, or other visitor data in the DOM.
  const eventName = typeof event.event === "string" ? event.event : "unknown";
  document.documentElement.dataset.lastDataLayerEvent = eventName;
  document.documentElement.dataset.dataLayerEventCount = String(
    window.dataLayer.length,
  );
}

export function updateGoogleConsent(granted: boolean) {
  const state = granted ? "granted" : "denied";
  window.gtag?.("consent", "update", {
    ad_personalization: state,
    ad_storage: state,
    ad_user_data: state,
    analytics_storage: state,
  });
  pushDataLayerEvent({
    event: "startime_consent_update",
    consent_state: state,
  });
}
