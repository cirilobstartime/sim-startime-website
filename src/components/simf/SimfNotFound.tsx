import { ArrowLeft, House } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import type {
  Locale,
  PublicPage,
  SimfFooterSection,
  SimfHeaderSection,
} from "@/content/types";
import { SimfFooter } from "./SimfFooter";
import { SimfHeader } from "./SimfHeader";

function findSection<T extends PublicPage["sections"][number]>(
  page: PublicPage | null,
  anchorID: string,
) {
  return page?.sections.find((section) => section.anchorID === anchorID) as
    | T
    | undefined;
}

export function SimfNotFound({
  locale,
  page,
}: {
  locale: Locale;
  page: PublicPage | null;
}) {
  const ar = locale === "ar";
  const header = findSection<SimfHeaderSection>(page, "header");
  const footer = findSection<SimfFooterSection>(page, "footer");
  const homeHref = ar ? "/ar" : "/";
  const sponsorHref = header?.sponsorHref || (ar ? "/ar/sponsor" : "/sponsor");
  const navigation = (header?.links || []).filter(
    (item) => !item.href.endsWith("/about") && item.href !== "/about",
  );

  return (
    <div className="simf-site simf-not-found" dir={ar ? "rtl" : "ltr"} lang={locale}>
      <SimfHeader
        homeHref={homeHref}
        locale={locale}
        logo={header?.logo}
        logoAlt={header?.logoAlt}
        mobileLogo={header?.mobileLogo}
        menuCloseLabel={header?.menuCloseLabel}
        menuOpenLabel={header?.menuOpenLabel}
        nav={navigation}
        navigationLabel={header?.navigationLabel}
        sponsorHref={sponsorHref}
        sponsorLabel={header?.sponsorLabel}
        showLanguageSwitcher={false}
        switchHref="/"
        switchLabel={header?.languageSwitchLabel}
      />
      <main className="simf-not-found__main" id="main-content">
        <div className="simf-not-found__glow" aria-hidden />
        <div className="simf-shell simf-not-found__content">
          <p className="simf-not-found__code">404</p>
          <p className="simf-eyebrow">
            {ar ? "الصفحة غير موجودة" : "Page not found"}
          </p>
          <h1>
            {ar
              ? "الصفحة التي تبحث عنها غير متاحة."
              : "The page you’re looking for isn’t available."}
          </h1>
          <p className="simf-not-found__body">
            {ar
              ? "يمكنك مواصلة استكشاف موقع المنتدى البحري الدولي السعودي 2026 من الصفحة الرئيسية، أو التواصل مع فريقنا للحصول على المساعدة."
              : "Continue exploring the Saudi International Maritime Forum 2026 from our homepage, or contact our team for assistance."}
          </p>
          <div className="simf-not-found__actions">
            <Link className="simf-button" href={homeHref}>
              <House aria-hidden />
              {ar ? "العودة إلى الرئيسية" : "Back to homepage"}
            </Link>
            <Link className="simf-button simf-button--outline" href={ar ? "/ar/contact" : "/contact"}>
              {ar ? "تواصل معنا" : "Contact the team"}
              <ArrowLeft aria-hidden className="simf-not-found__contact-arrow" />
            </Link>
          </div>
        </div>
      </main>
      <SimfFooter footer={footer} homeHref={homeHref} locale={locale} />
    </div>
  );
}
