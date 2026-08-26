import Script from "next/script";
import type { MarketingSettings } from "@/content/types";

export function MarketingTags({
  nonce,
  settings,
}: {
  nonce?: string;
  settings: MarketingSettings;
}) {
  const gtmID = /^GTM-[A-Z0-9]+$/i.test(settings.googleTagManagerID)
    ? settings.googleTagManagerID
    : "";
  const ga4ID = /^G-[A-Z0-9]+$/i.test(settings.ga4MeasurementID)
    ? settings.ga4MeasurementID
    : "";
  if (!settings.enableAnalytics || (!gtmID && !ga4ID)) return null;
  const initialConsent = settings.defaultConsentDenied ? "denied" : "granted";

  return (
    <>
      <Script id="startime-consent-default" nonce={nonce} strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];window.gtag=window.gtag||function(){dataLayer.push(arguments)};var stConsent=document.cookie.match(/(?:^|;\\s*)st_cookie_consent=(accepted|rejected)(?:;|$)/);var stState=stConsent?(stConsent[1]==='accepted'?'granted':'denied'):'${initialConsent}';gtag('consent','default',{ad_storage:stState,analytics_storage:stState,ad_user_data:stState,ad_personalization:stState,wait_for_update:500});`}
      </Script>
      {gtmID ? (
        <>
          <Script id="startime-gtm" nonce={nonce} strategy="afterInteractive">
            {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${gtmID}');`}
          </Script>
          <noscript>
            <iframe
              height="0"
              src={`https://www.googletagmanager.com/ns.html?id=${gtmID}`}
              className="marketing-tags__fallback"
              title="Google Tag Manager"
              width="0"
            />
          </noscript>
        </>
      ) : (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${ga4ID}`}
            nonce={nonce}
            strategy="afterInteractive"
          />
          <Script id="startime-ga4" nonce={nonce} strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];window.gtag=window.gtag||function(){dataLayer.push(arguments)};gtag('js',new Date());gtag('config','${ga4ID}');`}
          </Script>
        </>
      )}
    </>
  );
}
