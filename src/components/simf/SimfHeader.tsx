"use client";

import { ArrowUpRight, List, X } from "@phosphor-icons/react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { Locale, MediaValue } from "@/content/types";
import { getMediaTitle, getMediaURL } from "../CmsImage";

type Props = {
  homeHref: string;
  locale: Locale;
  logo?: MediaValue;
  logoAlt?: string;
  menuCloseLabel?: string;
  menuOpenLabel?: string;
  nav: Array<{ href: string; label: string }>;
  navigationLabel?: string;
  sponsorHref: string;
  sponsorLabel?: string;
  showLanguageSwitcher?: boolean;
  switchHref: string;
  switchLabel?: string;
};

export function SimfHeader({
  homeHref,
  locale,
  logo,
  logoAlt = "Startime",
  menuCloseLabel,
  menuOpenLabel,
  nav,
  navigationLabel,
  sponsorHref,
  sponsorLabel,
  showLanguageSwitcher = true,
  switchHref,
  switchLabel,
}: Props) {
  const [open, setOpen] = useState(false);
  const ar = locale === "ar";
  const logoURL = getMediaURL(logo) || "/assets/brand/startime-white.svg";
  const iconOnly = logoURL.includes("simf-mark");
  const renderedLogoURL = iconOnly
    ? `${logoURL}${logoURL.includes("?") ? "&" : "?"}v=full-compass-20260731`
    : logoURL;
  const visibleNav = nav.filter(
    (item) =>
      !item.href.replace(/\/+$/, "").endsWith("/about") &&
      !item.href.includes("#about"),
  );

  return (
    <header className="simf-header">
      <div className="simf-shell simf-header__inner">
        <Link
          aria-label={logoAlt}
          className={`simf-header__brand${iconOnly ? " simf-header__brand--icon" : ""}`}
          href={homeHref}
        >
          <Image
            alt={logoAlt}
            height={iconOnly ? 66 : 48}
            priority
            src={renderedLogoURL}
            title={getMediaTitle(logo) || undefined}
            unoptimized={iconOnly}
            width={iconOnly ? 66 : 154}
          />
        </Link>
        <nav
          aria-label={navigationLabel || (ar ? "التنقل الرئيسي" : "Main navigation")}
          className={`simf-header__nav${open ? " is-open" : ""}`}
        >
          {visibleNav.map((item) => (
            <Link
              className={
                item.href.includes("/b2g")
                  ? "simf-header__nav-highlight"
                  : undefined
              }
              href={item.href}
              key={item.href}
              onClick={() => setOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <Link className="simf-header__mobile-cta" href={sponsorHref}>
            {sponsorLabel || (ar ? "كن راعيًا" : "Become a Sponsor")}
            <ArrowUpRight aria-hidden />
          </Link>
        </nav>
        <div className="simf-header__actions">
          {showLanguageSwitcher ? (
            <a
              aria-label={switchLabel || (ar ? "Switch to English" : "التبديل إلى العربية")}
              className="locale-switch"
              href={switchHref}
            >
              {ar ? "EN" : "AR"}
            </a>
          ) : null}
          <Link
            className="simf-button simf-button--small"
            data-track="simf-header-sponsor"
            href={sponsorHref}
          >
            {sponsorLabel || (ar ? "كن راعيًا" : "Become a Sponsor")}
            <ArrowUpRight aria-hidden />
          </Link>
          <button
            aria-expanded={open}
            aria-label={
              open
                ? menuCloseLabel || (ar ? "إغلاق القائمة" : "Close menu")
                : menuOpenLabel || (ar ? "فتح القائمة" : "Open menu")
            }
            className="simf-header__menu"
            onClick={() => setOpen((value) => !value)}
            type="button"
          >
            {open ? <X aria-hidden /> : <List aria-hidden />}
          </button>
        </div>
      </div>
    </header>
  );
}
