"use client";

import { useEffect, useState } from "react";
import type { MarketingSettings } from "@/content/types";
import { updateGoogleConsent } from "@/lib/dataLayer";

const CONSENT_KEY = "startime_cookie_consent_v1";

export function CookieConsent({ settings }: { settings: MarketingSettings }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem(CONSENT_KEY);
    if (saved === "accepted" || saved === "rejected") {
      updateGoogleConsent(saved === "accepted");
      return;
    }
    const frame = window.requestAnimationFrame(() => setVisible(true));
    return () => window.cancelAnimationFrame(frame);
  }, []);

  function choose(accepted: boolean) {
    window.localStorage.setItem(
      CONSENT_KEY,
      accepted ? "accepted" : "rejected",
    );
    document.cookie = `st_cookie_consent=${
      accepted ? "accepted" : "rejected"
    }; Max-Age=31536000; Path=/; SameSite=Lax${
      window.location.protocol === "https:" ? "; Secure" : ""
    }`;
    updateGoogleConsent(accepted);
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <aside
      aria-label={settings.settingsLabel}
      className="cookie-consent"
      role="dialog"
    >
      <div>
        <p>{settings.cookieNotice}</p>
        <a href={settings.privacyHref}>{settings.settingsLabel}</a>
      </div>
      <div className="cookie-consent__actions">
        <button
          className="button button--ghost"
          onClick={() => choose(false)}
          type="button"
        >
          {settings.rejectLabel}
        </button>
        <button
          className="button button--primary"
          onClick={() => choose(true)}
          type="button"
        >
          {settings.acceptLabel}
        </button>
      </div>
    </aside>
  );
}
