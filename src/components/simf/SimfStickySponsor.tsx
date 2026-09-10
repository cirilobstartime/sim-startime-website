"use client";

import { ArrowUpRight } from "@phosphor-icons/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { CmsText } from "./CmsText";

type Props = {
  href: string;
  label: string;
};

export function SimfStickySponsor({ href, label }: Props) {
  const [heroPassed, setHeroPassed] = useState(false);

  useEffect(() => {
    const hero = document.querySelector(
      ".simf-hero, .simf-inner-hero, .simf-option-hero",
    );
    if (!hero) return;

    const observer = new IntersectionObserver(
      ([entry]) => setHeroPassed(!entry.isIntersecting),
      { threshold: 0.08 },
    );
    observer.observe(hero);
    return () => observer.disconnect();
  }, []);

  const visible = heroPassed;

  return (
    <Link
      aria-hidden={!visible}
      className={`simf-sticky-sponsor${visible ? " is-visible" : ""}`}
      data-track="simf-sticky-sponsor"
      href={href}
      tabIndex={visible ? undefined : -1}
    >
      <span><CmsText value={label} /></span>
      <ArrowUpRight aria-hidden />
    </Link>
  );
}
