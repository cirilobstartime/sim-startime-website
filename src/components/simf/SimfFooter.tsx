import {
  ArrowUpRight,
  EnvelopeSimple,
  LinkedinLogo,
  MapPin,
  Phone,
  XLogo,
  YoutubeLogo,
} from "@phosphor-icons/react/dist/ssr";
import Image from "next/image";
import Link from "next/link";
import type { Locale, SimfFooterSection } from "@/content/types";
import { getMediaTitle, getMediaURL } from "../CmsImage";

type Props = {
  footer?: SimfFooterSection;
  homeHref: string;
  locale: Locale;
};

function isExternal(href: string) {
  return /^https?:\/\//i.test(href);
}

export function SimfFooter({ footer, homeHref, locale }: Props) {
  const ar = locale === "ar";
  const footerEmail = footer?.email || "sim@startime.sa";
  const logoURL = getMediaURL(footer?.logo) || "/assets/simf/simf-logo.webp";
  const iconOnly = logoURL.includes("simf-mark");
  const renderedLogoURL = iconOnly
    ? `${logoURL}${logoURL.includes("?") ? "&" : "?"}v=full-compass-20260731`
    : logoURL;
  const importantLinks = footer?.importantLinks?.filter(
    (link) =>
      !link.href.replace(/\/+$/, "").endsWith("/about") &&
      !link.href.includes("#about"),
  );
  const copyrightParts = (footer?.copyright || "").split(/(Startime|ستارتايم)/gi);
  return (
    <footer className="simf-footer">
      <div className="simf-shell simf-footer__grid">
        <div className="simf-footer__about">
          <Image
            alt={
              footer?.logoAlt ||
              (ar ? "الملتقى البحري السعودي الدولي" : "Saudi International Maritime Forum")
            }
            className={iconOnly ? "simf-footer__logo--icon" : undefined}
            height={iconOnly ? 78 : 48}
            src={renderedLogoURL}
            title={getMediaTitle(footer?.logo) || undefined}
            unoptimized={iconOnly}
            width={iconOnly ? 78 : 210}
          />
          <p>
            {footer?.bio ||
              (ar
                ? "الملتقى البحري السعودي الدولي الرابع"
                : "Fourth Saudi International Maritime Forum")}
          </p>
          <div className="simf-footer__social">
            {footer?.socialLinks?.map((link) => (
              <Link
                aria-label={link.platform}
                href={link.href}
                key={link.platform}
                rel="noopener noreferrer"
                target="_blank"
              >
                {link.platform === "x" ? (
                  <XLogo aria-hidden />
                ) : link.platform === "linkedin" ? (
                  <LinkedinLogo aria-hidden />
                ) : (
                  <YoutubeLogo aria-hidden />
                )}
              </Link>
            ))}
          </div>
        </div>
        <div className="simf-footer__contact">
          <h2>{footer?.contactHeading || (ar ? "تواصل معنا" : "Contact")}</h2>
          <p>
            <MapPin aria-hidden />
            <span>{footer?.address}</span>
          </p>
          <Link href={`tel:${footer?.phone || "920010500"}`}>
            <Phone aria-hidden />
            {footer?.phone || "920010500"}
          </Link>
          <Link href={`mailto:${footerEmail}`}>
            <EnvelopeSimple aria-hidden />
            {footerEmail}
          </Link>
        </div>
        <div className="simf-footer__links">
          <h2>{footer?.linksHeading || (ar ? "استكشف SIM" : "Explore SIM")}</h2>
          <div className="simf-footer__links-grid">
            {importantLinks?.map((link) => (
              <Link
                href={link.href}
                key={link.label}
                rel={isExternal(link.href) ? "noopener noreferrer" : undefined}
                target={isExternal(link.href) ? "_blank" : undefined}
              >
                {link.label}
                <ArrowUpRight aria-hidden />
              </Link>
            ))}
          </div>
        </div>
      </div>
      <div className="simf-shell simf-footer__bottom">
        <p>
          {copyrightParts.map((part, index) =>
            /^(Startime|ستارتايم)$/i.test(part) ? (
              <Link
                href="https://startime.sa"
                key={`${part}-${index}`}
                rel="noopener noreferrer"
                target="_blank"
              >
                {part}
              </Link>
            ) : (
              part
            ),
          )}
        </p>
        <div>
          <Link href={footer?.privacyHref || "https://startime.sa/privacy-policy"}>
            {footer?.privacyLabel || (ar ? "سياسة الخصوصية" : "Privacy Policy")}
          </Link>
          <Link href={homeHref}>{footer?.homeLabel || (ar ? "الرئيسية" : "Home")}</Link>
        </div>
      </div>
    </footer>
  );
}
