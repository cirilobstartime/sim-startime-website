import {
  partnerSection,
  simfHeaderSection,
  speakerSection,
} from "./simfMicrositeDefaults";
import {
  getEnglishClientPage,
  simfB2GForm,
  simfContactForm,
  type ClientContentPageKey,
} from "./simfClientContentDefaults";
import type {
  Button,
  FormDefinition,
  HeroSection,
  Locale,
  PageSection,
  PublicPage,
  SimfFooterSection,
} from "./types";

export type SimfContentPageKey =
  | "contact"
  | "government-b2g"
  | "legacy"
  | "partners"
  | "programme"
  | "speakers"
  | "sponsors";

const assets = "/assets/simf-microsite";
const photos = `${assets}/photos`;

const editorialMedia: Record<
  SimfContentPageKey,
  Record<string, string[]>
> = {
  contact: {},
  legacy: {
    "edition-timeline": [
      `${photos}/fleet-formation.webp`,
      `${photos}/naval-aerial.webp`,
      `${photos}/forum-policy-panel.webp`,
      `${photos}/simf-video-poster.webp`,
    ],
    "previous-editions": [
      `${assets}/legacy/first-edition-riyadh-2019.webp`,
      `${assets}/legacy/second-edition-jeddah-2022.webp`,
      `${photos}/forum-policy-panel.webp`,
      `${photos}/simf-video-poster.webp`,
    ],
    purpose: [
      `${photos}/naval-commanders.webp`,
      `${photos}/forum-audience.webp`,
      `${photos}/naval-vessel-operations.webp`,
      `${photos}/forum-panel-close.webp`,
    ],
  },
  programme: {
    "key-topics": [
      "/assets/simf/seabed-security.webp",
      "/assets/simf/energy-supply-chain.webp",
      "/assets/simf/maritime-supply-chain.webp",
      `${photos}/naval-aerial.webp`,
      `${photos}/naval-missile.webp`,
    ],
    "programme-components": [
      `${photos}/forum-policy-panel.webp`,
      `${photos}/naval-operations.webp`,
      `${photos}/naval-vessel-operations.webp`,
    ],
    "programme-days": [
      "/assets/simf-microsite/programme/day-1-maritime-energy-supply-chains.webp",
      "/assets/simf-microsite/programme/day-2-maritime-transport-supply-chains.webp",
      "/assets/simf-microsite/programme/day-3-seabed-security-digital-infrastructure.webp",
    ],
    "programme-highlights": [
      `${photos}/forum-audience.webp`,
      "/assets/simf-microsite/programme/strategic-panel-discussions.webp",
      "/assets/simf-microsite/programme/strategic-panel-discussions.webp",
      "/assets/simf-microsite/programme/b2g-military-engagement.webp",
      `${photos}/fleet-formation.webp`,
    ],
    "session-framework": [
      "/assets/simf/seabed-security.webp",
      "/assets/simf/energy-supply-chain.webp",
      "/assets/simf/maritime-supply-chain.webp",
      `${photos}/naval-aerial.webp`,
      `${photos}/naval-missile.webp`,
    ],
  },
  speakers: {
    "speaker-categories": [
      `${photos}/naval-commanders.webp`,
      `${photos}/forum-policy-panel.webp`,
      `${photos}/forum-audience.webp`,
      `${photos}/naval-vessel-operations.webp`,
      `${photos}/forum-panel-close.webp`,
      `${photos}/naval-aerial.webp`,
      `${photos}/fleet-formation.webp`,
    ],
  },
  partners: {
    "partner-categories": [
      `${photos}/naval-commanders.webp`,
      `${photos}/forum-policy-panel.webp`,
      `${photos}/naval-vessel-operations.webp`,
      `${photos}/forum-panel-close.webp`,
      `${photos}/forum-audience.webp`,
    ],
    "partnership-value": [
      `${photos}/forum-policy-panel.webp`,
      `${photos}/naval-commanders.webp`,
      `${photos}/forum-audience.webp`,
      `${photos}/forum-panel-close.webp`,
    ],
  },
  "government-b2g": {
    "b2g-process": [
      `${photos}/forum-policy-panel.webp`,
      `${photos}/naval-commanders.webp`,
      `${photos}/forum-audience.webp`,
      `${photos}/forum-panel-wide.webp`,
      `${photos}/forum-panel-close.webp`,
      `${photos}/fleet-formation.webp`,
    ],
    benefits: [
      `${photos}/naval-commanders.webp`,
      `${photos}/forum-policy-panel.webp`,
      `${photos}/forum-panel-close.webp`,
    ],
    "discussion-areas": [
      "/assets/simf/seabed-security.webp",
      "/assets/simf/energy-supply-chain.webp",
      "/assets/simf/maritime-supply-chain.webp",
      `${photos}/naval-aerial.webp`,
      `${photos}/naval-missile.webp`,
      `${photos}/naval-vessel-operations.webp`,
    ],
    "executive-track": [
      `${photos}/forum-policy-panel.webp`,
      `${photos}/naval-commanders.webp`,
      `${photos}/forum-audience.webp`,
      `${photos}/forum-panel-close.webp`,
    ],
    journey: [
      `${photos}/forum-policy-panel.webp`,
      `${photos}/naval-commanders.webp`,
      `${photos}/forum-audience.webp`,
      `${photos}/forum-panel-wide.webp`,
      `${photos}/forum-panel-close.webp`,
      `${photos}/fleet-formation.webp`,
    ],
    "priority-areas": [
      "/assets/simf-microsite/b2g/seabed-and-subsea-infrastructure.webp",
      "/assets/simf-microsite/b2g/maritime-cybersecurity-and-communications.webp",
      "/assets/simf-microsite/b2g/unmanned-and-autonomous-systems.webp",
      "/assets/simf-microsite/b2g/maritime-energy-security.webp",
      "/assets/simf-microsite/b2g/maritime-transport-and-logistics.webp",
      "/assets/simf-microsite/b2g/naval-security-and-industrial-capabilities.webp",
    ],
    "why-b2g": [
      `${photos}/forum-policy-panel.webp`,
      `${photos}/naval-commanders.webp`,
      `${photos}/forum-audience.webp`,
      `${photos}/forum-panel-close.webp`,
    ],
  },
  sponsors: {
    "forum-lifecycle": [
      `${photos}/naval-formation-sunset.webp`,
      `${photos}/forum-panel-wide.webp`,
      `${photos}/forum-panel-close.webp`,
    ],
    reasons: [
      `${photos}/forum-policy-panel.webp`,
      `${photos}/naval-commanders.webp`,
      `${photos}/warship-pair.webp`,
      `${photos}/forum-audience.webp`,
    ],
    "sponsor-reasons": [
      `${assets}/sponsor/sponsor-institutional-audience.webp`,
      `${assets}/programme/b2g-military-engagement.webp`,
      `${assets}/sponsor/sponsor-sector-dialogue.webp`,
      `${assets}/sponsor/sponsor-global-ecosystem.webp`,
    ],
    "sponsorship-process": [
      `${photos}/forum-policy-panel.webp`,
      `${photos}/naval-commanders.webp`,
      `${photos}/forum-audience.webp`,
      `${photos}/forum-panel-close.webp`,
      `${photos}/fleet-formation.webp`,
    ],
    "sponsorship-value": [
      `${assets}/sponsor/sponsor-strategic-panel.webp`,
      `${photos}/partners-hero-exhibition.webp`,
      `${assets}/sponsor/sponsor-forum-stage.webp`,
    ],
  },
};

export function applyEditorialMedia(
  page: PublicPage,
  key: SimfContentPageKey,
): PublicPage {
  const clone = structuredClone(page);
  const routeMedia = editorialMedia[key];
  clone.sections.forEach((section) => {
    const media = section.anchorID ? routeMedia[section.anchorID] : undefined;
    if (!media?.length) return;
    if (section.blockType === "cardGrid") {
      section.cards.forEach((card, index) => {
        card.media ||= media[index % media.length];
      });
    }
    if (section.blockType === "timeline") {
      section.steps.forEach((step, index) => {
        step.media ||= media[index % media.length];
      });
    }
  });
  return clone;
}

function href(locale: Locale, path: string) {
  return `${locale === "ar" ? "/ar" : ""}${path}` || "/";
}

function localizeForm(
  form: FormDefinition,
  labels: Record<string, string>,
  submitLabel: string,
): FormDefinition {
  return {
    ...structuredClone(form),
    submitLabel,
    fields: form.fields?.map((field) => ({
      ...field,
      label: labels[field.name] || field.label,
      helpText:
        field.name === "companyProfile"
          ? "ملف PDF فقط."
          : field.helpText,
      options: field.options?.map((option) => ({
        ...option,
        label: labels[`${field.name}.${option.value}`] || option.label,
      })),
    })),
  };
}

const arabicB2GForm = localizeForm(
  simfB2GForm,
  {
    organizationName: "اسم الجهة",
    organizationWebsite: "الموقع الإلكتروني للجهة",
    country: "الدولة",
    contactPerson: "اسم مسؤول التواصل",
    jobTitle: "المسمى الوظيفي",
    workEmail: "البريد الإلكتروني للعمل",
    mobileNumber: "رقم الجوال مع رمز الدولة",
    organizationSector: "قطاع الجهة",
    engagementObjectives: "القدرات ذات الصلة وأهداف التواصل عبر مسار الأعمال الحكومية",
    relevantCapabilities: "القدرات أو الحلول ذات الصلة",
    preferredStakeholders: "الجهات التي تفضّلون التواصل معها",
    meetingObjectives: "الأهداف الرئيسية للاجتماعات المطلوبة",
    discussionTopics: "موضوعات النقاش المقترحة",
    representatives: "عدد ممثلي الجهة ومستوياتهم الوظيفية",
    companyProfile: "ملف تعريفي بالجهة",
    consent: "أوافق على تواصل فريق ملتقى 2026 معي.",
  },
  "طلب التواصل بشأن فرص الأعمال الحكومية",
);

const arabicContactForm = localizeForm(
  simfContactForm,
  {
    name: "الاسم الكامل",
    organization: "الجهة",
    jobTitle: "المسمى الوظيفي",
    email: "البريد الإلكتروني للعمل",
    phone: "رقم الهاتف",
    enquiryType: "نوع الاستفسار",
    "enquiryType.programme": "البرنامج",
    "enquiryType.speakers": "المتحدثون",
    "enquiryType.partnership": "الشراكات",
    "enquiryType.sponsorship": "الرعاية",
    "enquiryType.b2g": "فرص الأعمال الحكومية",
    "enquiryType.media": "الإعلام",
    "enquiryType.other": "أخرى",
    message: "كيف يمكن لفريق ملتقى 2026 مساعدتك؟",
    consent: "أوافق على تواصل فريق ملتقى 2026 معي.",
  },
  "إرسال الاستفسار",
);

function button(
  locale: Locale,
  path: string,
  en: string,
  ar: string,
  style: Button["style"] = "primary",
): Button {
  return {
    href: href(locale, path),
    label: locale === "ar" ? ar : en,
    style,
  };
}

function footer(locale: Locale): SimfFooterSection {
  const ar = locale === "ar";
  return {
    anchorID: "footer",
    blockType: "simfFooter",
    displayOrder: 1000,
    internalLabel: "Footer",
    visible: true,
    logo: "/assets/simf-microsite/organizers/simf-mark.webp",
    logoAlt: ar ? "الملتقى البحري السعودي الدولي" : "Saudi International Maritime Forum",
    bio: ar
      ? "الملتقى البحري السعودي الدولي 2026\nمستقبل أمن قاع البحار وسلاسل الإمداد في بيئة عالمية متغيرة\n23–25 نوفمبر 2026\nفندق ومركز مؤتمرات سوفيتل الرياض، المملكة العربية السعودية\nبإشراف وزارة الدفاع\nتنظيم القوات البحرية الملكية السعودية\nالترخيص لستارتايم"
      : "Saudi International Maritime Forum 2026\nThe Future of Seabed Security and Maritime Supply Chains in a Critically Changing World\n23–25 November 2026\nSofitel Riyadh Hotel and Convention Center, Riyadh, Saudi Arabia\nSupervised by the Ministry of Defense\nOrganized by the Royal Saudi Naval Forces\nLicensed to Startime",
    address: ar
      ? "3507، الرياض 12341\nالمملكة العربية السعودية"
      : "3507, Riyadh 12341\nSaudi Arabia",
    phone: "920010500",
    email: "sim@startime.sa",
    contactHeading: ar ? "تواصل معنا" : "Contact",
    socialLinks: [
      { platform: "x", href: "https://x.com/startimeevents" },
      {
        platform: "linkedin",
        href: "https://sa.linkedin.com/company/startimeevents",
      },
      { platform: "youtube", href: "https://www.youtube.com/@Startime_Events" },
    ],
    importantLinks: [
      {
        label: ar ? "الرئيسية" : "Home",
        href: href(locale, ""),
      },
      {
        label: ar ? "نسخ سابقة" : "Legacy",
        href: href(locale, "/legacy"),
      },
      {
        label: ar ? "البرنامج" : "Programme",
        href: href(locale, "/programme"),
      },
      {
        label: ar ? "المتحدثون" : "Speakers",
        href: href(locale, "/speakers"),
      },
      {
        label: ar ? "فرص B2G" : "B2G Opportunities",
        href: href(locale, "/b2g"),
      },
      {
        label: ar ? "الرعاة والشركاء" : "Sponsors & Partners",
        href: href(locale, "/partners"),
      },
      {
        label: ar ? "كن راعيًا" : "Become a Sponsor",
        href: href(locale, "/sponsor"),
      },
    ],
    linksHeading: ar ? "استكشف SIM" : "Explore SIM",
    privacyLabel: ar ? "سياسة الخصوصية" : "Privacy Policy",
    privacyHref: ar
      ? "https://startime.sa/ar/privacy-policy"
      : "https://startime.sa/privacy-policy",
    homeLabel: ar ? "الرئيسية" : "Home",
    copyright: ar
      ? "© 2026 ستارتايم. جميع الحقوق محفوظة."
      : "© 2026 Startime. All rights reserved.",
  };
}

function hero(
  locale: Locale,
  headingEn: string,
  headingAr: string,
  bodyEn: string,
  bodyAr: string,
  image: string,
  buttons?: Button[],
): HeroSection {
  return {
    anchorID: "page-hero",
    blockType: "hero",
    displayOrder: 10,
    internalLabel: "Page hero",
    visible: true,
    eyebrow: locale === "ar" ? "SIM 2026" : "SIM 2026",
    heading: locale === "ar" ? headingAr : headingEn,
    body: locale === "ar" ? bodyAr : bodyEn,
    media: `${assets}/photos/${image}`,
    buttons,
  };
}

function conversion(
  locale: Locale,
  headingEn: string,
  headingAr: string,
  bodyEn: string,
  bodyAr: string,
  buttons: Button[],
  image = "naval-formation-sunset.webp",
): PageSection {
  return {
    anchorID: "conversion",
    blockType: "callToAction",
    displayOrder: 900,
    internalLabel: "Final call to action",
    visible: true,
    eyebrow: locale === "ar" ? "الملتقى 2026" : "SIM 2026",
    heading: locale === "ar" ? headingAr : headingEn,
    body: locale === "ar" ? bodyAr : bodyEn,
    media: `${assets}/photos/${image}`,
    buttons,
  };
}

function legacySections(locale: Locale): PageSection[] {
  const ar = locale === "ar";
  return [
    simfHeaderSection(locale, "content"),
    hero(
      locale,
      "A Saudi Platform Advancing Global Maritime Security Dialogue",
      "منصة سعودية تعزز الحوار العالمي حول الأمن البحري",
      "From its first edition to SIM 2026, the Saudi International Maritime Forum has continued to bring together maritime leadership, government institutions, international delegations, experts, and industry organizations around the challenges shaping security at sea.",
      "منذ نسخته الأولى وحتى ملتقى 2026، يواصل الملتقى البحري السعودي الدولي جمع القيادات البحرية والجهات الحكومية والوفود الدولية والخبراء ومؤسسات القطاع حول التحديات التي ترسم مستقبل الأمن في البحار.",
      "naval-commanders.webp",
    ),
    {
      anchorID: "about-simf",
      blockType: "mediaFeature",
      displayOrder: 20,
      internalLabel: "About SIMF",
      visible: true,
      eyebrow: ar ? "عن الملتقى" : "ABOUT SIMF",
      heading: ar
        ? "حيث تلتقي القيادة البحرية بالحكومة والقطاع"
        : "Where Maritime Leadership, Government, and Industry Meet",
      body: ar
        ? "الملتقى البحري السعودي الدولي منصة وطنية رفيعة المستوى ذات امتداد دولي، تنظمه القوات البحرية الملكية السعودية. يجمع قادة القوات البحرية والعسكرية وصنّاع القرار الحكوميين والوفود الدولية والخبراء والجهات العاملة في الأمن البحري والدفاع والتقنية والطاقة والخدمات اللوجستية والبنية التحتية الحيوية. ومن خلال الحوار الاستراتيجي وتبادل المعرفة وعرض التقنيات والتواصل المؤسسي، يسهم الملتقى في تعميق فهم المخاطر التي تواجه المجال البحري، ويدعم تعاوناً أقوى لحماية البنية الحيوية وطرق التجارة وسلاسل الإمداد العالمية."
        : "The Saudi International Maritime Forum is a high-level national platform with international reach, organized by the Royal Saudi Naval Forces. It convenes naval and military leaders, government decision-makers, international delegations, experts, and organizations working across maritime security, defence, technology, energy, logistics, and critical infrastructure. Through strategic dialogue, knowledge exchange, technology presentation, and institutional engagement, the Forum contributes to a deeper understanding of the risks affecting the maritime domain and supports stronger cooperation in protecting vital infrastructure, trade routes, and global supply chains.",
      media: `${assets}/photos/forum-policy-panel.webp`,
      mediaPosition: "end",
      theme: "light",
    },
    {
      anchorID: "purpose",
      blockType: "cardGrid",
      displayOrder: 30,
      internalLabel: "Purpose",
      visible: true,
      eyebrow: ar ? "رسالتنا" : "OUR PURPOSE",
      heading: ar
        ? "تعزيز الأمن بالحوار والتعاون وبناء القدرات"
        : "Advancing Security Through Dialogue, Cooperation, and Capability",
      body: ar
        ? "يوفر الملتقى بيئة موثوقة يتبادل فيها القادة والمتخصصون الخبرات، ويناقشون التهديدات الناشئة، ويستكشفون التقنيات المتقدمة، ويعززون العلاقات بين الجهات الحكومية والعسكرية والقطاع ومؤسسات البحث."
        : "The Forum provides a trusted environment for leaders and specialists to exchange experience, examine emerging threats, explore advanced technologies, and strengthen relationships across government, military, industry, and research communities.",
      layout: "icons",
      cards: [
        {
          title: ar ? "فهم استراتيجي" : "Strategic Understanding",
          body: ar
            ? "بناء فهم مشترك للقوى التي تعيد تشكيل الأمن البحري."
            : "Advancing a shared understanding of the forces transforming maritime security.",
          icon: "compass",
        },
        {
          title: ar ? "تعاون دولي" : "International Cooperation",
          body: ar
            ? "تعزيز التواصل والتنسيق بين الدول والمؤسسات المشاركة."
            : "Strengthening communication and coordination among participating nations and institutions.",
          icon: "globe",
        },
        {
          title: ar ? "تطوير القدرات" : "Capability Development",
          body: ar
            ? "استكشاف الأنظمة والتقنيات والأساليب التشغيلية الداعمة للجاهزية والأمن البحري."
            : "Exploring the systems, technologies, and operational approaches supporting maritime security and readiness.",
          icon: "gear",
        },
        {
          title: ar ? "تكامل الحكومة والقطاع" : "Government and Industry Engagement",
          body: ar
            ? "إتاحة مساحة لحوار هادف بين المؤسسات العامة والجهات المطورة للقدرات ذات الصلة."
            : "Creating space for meaningful dialogue between public institutions and organizations developing relevant capabilities.",
          icon: "handshake",
        },
      ],
    },
    {
      anchorID: "legacy-scale",
      blockType: "metricRail",
      displayOrder: 40,
      internalLabel: "Legacy",
      visible: true,
      eyebrow: ar ? "إرث الملتقى" : "THE SIM LEGACY",
      heading: ar
        ? "منصة متنامية للتعاون الدولي في الأمن البحري"
        : "A Growing Platform for International Maritime Cooperation",
      body: ar
        ? "تطور الملتقى عبر نسخه السابقة إلى منصة راسخة لحوار الأمن البحري، تجمع القيادات العليا والمؤسسات الرسمية والخبرات الدولية وقدرات القطاع. ومع كل نسخة، اتسع النقاش حول التهديدات المتغيرة والجاهزية التشغيلية والتطور التقني والتعاون الدولي."
        : "Across its previous editions, the Saudi International Maritime Forum has developed into an established platform for maritime security dialogue, bringing together senior leadership, official institutions, international expertise, and industry capabilities. Each edition has expanded the conversation around changing threats, operational readiness, technological development, and international cooperation.",
      metrics: ar
        ? [
            { value: "+40", label: "دولة مشاركة عبر النسخ السابقة" },
            { value: "+100", label: "قائد وصانع قرار" },
            { value: "+220", label: "متحدث دولي" },
            { value: "+500", label: "راعٍ وشريك وجهة مشاركة" },
          ]
        : [
            { value: "40+", label: "Participating Countries Across Previous Editions" },
            { value: "100+", label: "Leaders and Decision-Makers" },
            { value: "220+", label: "International Speakers" },
            { value: "500+", label: "Sponsors, Partners, and Participating Organizations" },
          ],
    },
    {
      anchorID: "edition-timeline",
      blockType: "timeline",
      displayOrder: 45,
      internalLabel: "Forum editions timeline",
      visible: true,
      eyebrow: ar ? "محطات الملتقى" : "FORUM EDITIONS",
      heading: ar
        ? "محطات مفصلية في تطور أجندة الأمن البحري العالمي"
        : "Key Turning Points in the Global Maritime Security Agenda",
      body: ar
        ? "تتابع كل نسخة التحولات الأكثر إلحاحاً في المجال البحري، وتحوّلها إلى حوار يجمع القيادة والخبرة والقدرات العملية."
        : "Each edition has followed the most urgent shifts in the maritime domain, turning them into focused dialogue between leadership, expertise, and deployable capability.",
      steps: [
        {
          label: ar ? "24–26 نوفمبر 2019 · الرياض" : "24–26 November 2019 · Riyadh",
          title: ar
            ? "تأمين الممرات البحرية الاستراتيجية"
            : "Securing Strategic Maritime Corridors",
          body: ar
            ? "أسست النسخة الأولى منصة سعودية دولية لمناقشة حماية طرق الملاحة الحيوية، واستمرارية التجارة، والتعاون المطلوب لمواجهة المخاطر العابرة للحدود."
            : "The inaugural edition established a Saudi-led international platform for protecting vital sea lanes, sustaining trade, and strengthening cooperation against cross-border maritime risks.",
        },
        {
          label: ar ? "15–17 نوفمبر 2022 · جدة" : "15–17 November 2022 · Jeddah",
          title: ar
            ? "حماية الوحدات البحرية والمواقع الساحلية من تهديدات الأنظمة غير المأهولة"
            : "Protecting Naval Units and Coastal Sites from Unmanned-System Threats",
          body: ar
            ? "وسّعت النسخة الثانية الحوار نحو التهديدات غير المأهولة والجاهزية التشغيلية والتقنيات القادرة على حماية الأصول البحرية والساحلية."
            : "The second edition expanded the dialogue to unmanned threats, operational readiness, and technologies capable of protecting naval and coastal assets.",
        },
        {
          label: ar ? "19–21 نوفمبر 2024 · الظهران" : "19–21 November 2024 · Dhahran",
          title: ar
            ? "الأمن البحري في عصر الذكاء الاصطناعي"
            : "Maritime Security in the Age of Artificial Intelligence",
          body: ar
            ? "تناولت النسخة الثالثة أثر الذكاء الاصطناعي والأنظمة الذاتية وتحليل البيانات في الوعي بالمجال البحري وتسريع الاستجابة."
            : "The third edition examined how artificial intelligence, autonomous systems, and data analysis are reshaping maritime awareness and response.",
        },
        {
          label: ar ? "23–25 نوفمبر 2026 · الرياض" : "23–25 November 2026 · Riyadh",
          title: ar
            ? "مستقبل أمن قاع البحار وسلاسل الإمداد"
            : "The Future of Seabed Security and Maritime Supply Chains",
          body: ar
            ? "تنتقل النسخة الرابعة إلى حماية البنية التحتية تحت البحر ومرونة سلاسل الإمداد في بيئة عالمية سريعة التغيّر."
            : "The fourth edition turns to subsea infrastructure protection and supply-chain resilience in a critically changing global environment.",
        },
      ],
    },
    {
      anchorID: "strategic-evolution",
      blockType: "timeline",
      displayOrder: 47,
      internalLabel: "Strategic evolution",
      visible: true,
      eyebrow: ar
        ? "رحلة استراتيجية واحدة متصلة"
        : "ONE CONTINUOUS STRATEGIC JOURNEY",
      heading: ar
        ? "كل نسخة تبني على ما قبلها"
        : "Each Edition Builds on the Last",
      steps: [
        {
          label: "2019",
          title: ar ? "الممرات البحرية الاستراتيجية" : "Strategic Maritime Corridors",
          body: ar
            ? "حماية الطرق البحرية التي تدعم التجارة العالمية وأمن الطاقة."
            : "Protecting the maritime routes that sustain global trade and energy security.",
        },
        {
          label: "2022",
          title: ar ? "تهديدات الأنظمة غير المأهولة" : "Unmanned-System Threats",
          body: ar
            ? "حماية الوحدات البحرية والمواقع الساحلية والأصول الحيوية من التهديدات غير المأهولة الناشئة."
            : "Safeguarding naval units, coastal sites, and critical assets from emerging unmanned threats.",
        },
        {
          label: "2024",
          title: ar ? "الذكاء الاصطناعي" : "Artificial Intelligence",
          body: ar
            ? "فهم أثر التقنيات الذكية والذاتية في إعادة تشكيل الأمن البحري."
            : "Understanding how intelligent and autonomous technologies are transforming maritime security.",
        },
        {
          label: "2026",
          title: ar
            ? "أمن قاع البحار وسلاسل الإمداد البحرية"
            : "Seabed Security and Maritime Supply Chains",
          body: ar
            ? "حماية البنية التحتية الحيوية في قاع البحار وتعزيز مرونة سلاسل الإمداد البحرية في عالم سريع التغيّر."
            : "Protecting critical seabed infrastructure and strengthening the resilience of maritime supply chains in a rapidly changing world.",
        },
      ],
    },
    {
      anchorID: "fourth-edition",
      blockType: "mediaFeature",
      displayOrder: 50,
      internalLabel: "The fourth edition",
      visible: true,
      eyebrow: ar ? "النسخة الرابعة" : "THE FOURTH EDITION",
      heading: ar
        ? "تركيز استراتيجي جديد لعالم سريع التغير"
        : "A New Strategic Focus for a Critically Changing World",
      body: ar
        ? "تتجه نسخة 2026 إلى الأنظمة العاملة تحت سطح البحر وعبره. فقد أصبحت الاتصالات البحرية والبنية التحتية للطاقة وشبكات النقل البحري والتقنيات الذاتية والأنظمة السيبرانية وسلاسل الإمداد العالمية أكثر ارتباطاً بالأمن الوطني والمرونة الاقتصادية. وتبحث النسخة الرابعة كيف يمكن للحكومات والقيادات البحرية والمتخصصين والقطاع تعزيز حماية هذه البيئة البحرية المترابطة."
        : "SIM 2026 turns attention toward the systems operating beneath and across the sea. Subsea communications, energy infrastructure, maritime transport networks, autonomous technologies, cyber systems, and global supply chains have become increasingly connected to national security and economic resilience. The fourth edition will examine how governments, naval leadership, specialists, and industry can strengthen the protection of this interconnected maritime environment.",
      media: `${assets}/photos/naval-vessel-operations.webp`,
      mediaPosition: "start",
      theme: "dark",
    },
    {
      anchorID: "official-framework",
      blockType: "cardGrid",
      displayOrder: 60,
      internalLabel: "Official framework",
      visible: true,
      eyebrow: ar ? "الإطار الرسمي" : "OFFICIAL FRAMEWORK",
      heading: ar
        ? "مستقبل أمن قاع البحار وسلاسل الإمداد في بيئة عالمية متغيرة"
        : "The Future of Seabed Security and Maritime Supply Chains in a Critically Changing World",
      layout: "proof",
      cards: [
        {
          eyebrow: ar ? "برعاية" : "UNDER THE PATRONAGE OF",
          title: ar
            ? "صاحب السمو الملكي الأمير خالد بن سلمان بن عبدالعزيز آل سعود، وزير الدفاع"
            : "His Royal Highness Prince Khalid bin Salman bin Abdulaziz Al Saud, Minister of Defense",
          media: `${assets}/official-framework/official-patronage-prince-khalid.webp`,
        },
        {
          eyebrow: ar ? "بإشراف" : "SUPERVISED BY",
          title: ar ? "وزارة الدفاع" : "Ministry of Defense",
          media: `${assets}/organizers/ministry-of-defense.webp`,
        },
        {
          eyebrow: ar ? "تنظيم" : "ORGANIZED BY",
          title: ar
            ? "القوات البحرية الملكية السعودية"
            : "Royal Saudi Naval Forces",
          media: `${assets}/official-framework/royal-saudi-naval-forces.webp`,
        },
        {
          eyebrow: ar ? "الترخيص لـ" : "LICENSED TO",
          title: ar ? "ستارتايم" : "Startime",
          media: `${assets}/partners/startime-licensed.webp`,
        },
      ],
      buttons: [
        button(locale, "/programme", "Explore the Programme", "استكشف البرنامج"),
      ],
    },
    footer(locale),
  ];
}

function programmeSections(locale: Locale): PageSection[] {
  const ar = locale === "ar";
  const topics = [
    [
      "Changes in the Global Strategic Environment and Their Impact on Maritime Supply Chains",
      "المتغيرات في البيئة الاستراتيجية العالمية وتأثيرها على سلاسل الإمداد البحرية",
      "An examination of how geopolitical change, security pressures, and shifting international relationships are affecting the continuity and resilience of maritime supply networks.",
      "دراسة أثر التحولات الجيوسياسية والضغوط الأمنية وتغير العلاقات الدولية في استمرارية شبكات الإمداد البحرية وقدرتها على الصمود.",
    ],
    [
      "Threats to Energy Supply Chains and Their Impact on the Global Economy",
      "التهديدات التي تواجه سلاسل إمداد الطاقة وأثرها في الاقتصاد العالمي",
      "A discussion of the risks affecting maritime energy routes, infrastructure, and transportation, and the wider implications for economic stability and global markets.",
      "نقاش حول المخاطر التي تواجه طرق الطاقة البحرية وبنيتها التحتية ونقلها، وانعكاساتها الأوسع على الاستقرار الاقتصادي والأسواق العالمية.",
    ],
    [
      "Protection of the Seabed and Subsea Communications Infrastructure",
      "حماية قاع البحار وبنية الاتصالات تحت البحر",
      "A strategic examination of the technologies, responsibilities, and international cooperation required to protect subsea cables, pipelines, sensors, and critical underwater systems.",
      "دراسة استراتيجية للتقنيات والمسؤوليات والتعاون الدولي المطلوب لحماية الكابلات والأنابيب والمستشعرات والأنظمة الحيوية تحت الماء.",
    ],
    [
      "Maritime Transport Cybersecurity: Challenges and Solutions",
      "الأمن السيبراني للنقل البحري: التحديات والحلول",
      "An exploration of the cyber risks affecting vessels, ports, logistics networks, communication systems, and the digital infrastructure supporting maritime operations.",
      "استكشاف للمخاطر السيبرانية التي تواجه السفن والموانئ والشبكات اللوجستية وأنظمة الاتصال والبنية الرقمية الداعمة للعمليات البحرية.",
    ],
    [
      "The Role of Artificial Intelligence and Modern Technologies in Seabed Security and Supply Chains",
      "دور الذكاء الاصطناعي والتقنيات الحديثة في أمن قاع البحار وسلاسل الإمداد",
      "A discussion of artificial intelligence, autonomous systems, advanced sensing, data analysis, and emerging technologies supporting maritime awareness, protection, and operational resilience.",
      "نقاش حول الذكاء الاصطناعي والأنظمة الذاتية والاستشعار المتقدم وتحليل البيانات والتقنيات الناشئة الداعمة للوعي البحري والحماية والمرونة التشغيلية.",
    ],
  ];
  return [
    simfHeaderSection(locale, "content"),
    hero(
      locale,
      "Three Days of Strategic Dialogue, Institutional Engagement, and Maritime Innovation",
      "ثلاثة أيام من الحوار الاستراتيجي والتواصل المؤسسي والابتكار البحري",
      "The SIM 2026 programme brings together strategic sessions, official participation, technology presentation, and government business engagement around the future of seabed security and maritime supply chains.",
      "يجمع برنامج ملتقى 2026 الجلسات الاستراتيجية والمشاركة الرسمية وعرض التقنيات والتواصل الحكومي حول مستقبل أمن قاع البحار وسلاسل الإمداد البحرية.",
      "forum-audience.webp",
      [
        button(locale, "/programme#programme-components", "Explore the Programme", "استكشف البرنامج"),
        button(locale, "/speakers", "View Speakers", "استعرض المتحدثين", "outline"),
      ],
    ),
    {
      anchorID: "programme-introduction",
      blockType: "mediaFeature",
      displayOrder: 20,
      internalLabel: "Programme introduction",
      visible: true,
      eyebrow: ar ? "برنامج الملتقى" : "PROGRAMME INTRODUCTION",
      heading: ar
        ? "ربط الحوار الاستراتيجي بالواقع التشغيلي"
        : "Connecting Strategic Dialogue With Operational Reality",
      body: ar
        ? "صُمم الملتقى البحري السعودي الدولي الرابع ليتجاوز حدود النقاش. يربط برنامجه السياسات والخبرة التشغيلية والتهديدات الناشئة والتقنيات المتقدمة والأولويات المؤسسية في منظومة الأمن البحري. ومن خلال الجلسات الرسمية وحوار الخبراء والمشاركة الدولية وأنشطة المعرض والاجتماعات المنظمة، يقدم ملتقى 2026 رؤية شاملة للتحديات والقدرات التي تشكل المجال البحري."
        : "The fourth Saudi International Maritime Forum is designed to move beyond discussion alone. Its programme connects policy, operational experience, emerging threats, advanced technologies, and institutional priorities across the maritime security ecosystem. Through official sessions, expert dialogue, international participation, exhibition activities, and structured meetings, SIM 2026 will provide a comprehensive view of the challenges and capabilities shaping the maritime domain.",
      media: `${assets}/photos/forum-panel-close.webp`,
      mediaPosition: "end",
      theme: "light",
    },
    {
      anchorID: "programme-components",
      blockType: "cardGrid",
      displayOrder: 30,
      internalLabel: "Programme components",
      visible: true,
      eyebrow: ar ? "تجربة متكاملة" : "PROGRAMME COMPONENTS",
      heading: ar
        ? "من الافتتاح الرسمي إلى التعاون المؤسسي"
        : "From Official Opening to Institutional Collaboration",
      layout: "editorial",
      cards: [
        {
          title: ar ? "حفل الافتتاح" : "Opening Ceremony",
          body: ar
            ? "يرسم الافتتاح الرسمي التوجه الاستراتيجي للنسخة الرابعة ويقدم موضوعها المحوري أمام القيادات العليا وممثلي الحكومة والوفود الدولية والجهات المشاركة."
            : "The official opening will establish the strategic direction of the fourth edition and introduce its central theme before senior leaders, government representatives, international delegations, and participating organizations.",
          media: `${assets}/photos/vip-audience.webp`,
          icon: "sparkle",
        },
        {
          title: ar ? "جلسات الملتقى الرئيسية" : "Main Forum Sessions",
          body: ar
            ? "تبحث القيادات العسكرية والبحرية وصنّاع القرار والخبراء وقادة القطاع التطورات الجيوسياسية والتشغيلية والتقنية والاقتصادية المؤثرة في الأمن البحري."
            : "Senior commanders, government decision-makers, experts, and industry leaders will examine the geopolitical, operational, technological, and economic developments affecting maritime security.",
          media: `${assets}/photos/forum-policy-panel.webp`,
          icon: "users",
        },
        {
          title: ar ? "المعرض الدولي" : "International Exhibition",
          body: ar
            ? "تعرض الجهات المشاركة قدراتها في المجالات البحرية والدفاعية وتحت سطح البحر والأمن السيبراني والاتصالات والطاقة والخدمات اللوجستية والأنظمة الذاتية."
            : "Participating organizations will present maritime, defence, subsea, cybersecurity, communications, energy, logistics, and autonomous-system capabilities.",
          media: `${assets}/photos/forum-audience.webp`,
          icon: "buildings",
        },
        {
          title: ar ? "اجتماعات الأعمال الحكومية" : "Government Business Meetings",
          body: ar
            ? "يحصل الرعاة المؤهلون على مسار منسق باحتراف لدعم التواصل المنظم مع الجهات الحكومية ذات الصلة، وفق مزايا الباقة والملاءمة والتوفر والموافقة."
            : "Eligible sponsors will have access to a professionally coordinated track designed to support structured engagement with relevant government entities, subject to package benefits, relevance, availability, and approval.",
          media: `${assets}/photos/naval-commanders.webp`,
          icon: "handshake",
        },
        {
          title: ar ? "التواصل الدولي والمؤسسي" : "International and Institutional Engagement",
          body: ar
            ? "يسهّل ملتقى 2026 التفاعل بين القيادات البحرية والوفود الرسمية والمؤسسات الحكومية والخبراء والجهات الصناعية من المملكة والعالم."
            : "SIM 2026 will facilitate interaction among naval leadership, official delegations, government institutions, experts, and industry organizations from Saudi Arabia and around the world.",
          media: `${assets}/photos/forum-panel-wide.webp`,
          icon: "globe",
        },
        {
          title: ar ? "التغطية الإعلامية والمعرفية" : "Media and Knowledge Coverage",
          body: ar
            ? "توثق الأنشطة الإعلامية المتكاملة الحوار الاستراتيجي والمشاركة المؤسسية وإسهامات الرعاة وأبرز تطورات الملتقى عبر القنوات الرسمية والشريكة."
            : "Integrated media activities will document strategic dialogue, institutional participation, sponsor contributions, and key developments across official and partner channels.",
          media: `${assets}/photos/simf-video-poster.webp`,
          icon: "megaphone",
        },
      ],
    },
    {
      anchorID: "session-framework",
      blockType: "timeline",
      displayOrder: 40,
      internalLabel: "Current session framework",
      visible: true,
      eyebrow: ar ? "إطار الجلسات الحالي" : "CURRENT SESSION FRAMEWORK",
      heading: ar
        ? "الأسئلة الاستراتيجية التي تشكل ملتقى 2026"
        : "The Strategic Questions Shaping SIM 2026",
      body: ar
        ? "تعكس هذه الموضوعات التوجه الحالي للبرنامج، وسيتم تحديث التفاصيل النهائية بعد اعتمادها رسمياً."
        : "These subjects reflect the current thematic direction. Final titles, moderators, speakers, dates, and times will be updated following formal programme approval.",
      steps: topics.map((topic, index) => ({
        label: String(index + 1).padStart(2, "0"),
        title: ar ? topic[1] : topic[0],
        body: ar ? topic[3] : topic[2],
      })),
    },
    conversion(
      locale,
      "The Full SIM 2026 Agenda Will Be Announced Soon",
      "سيُعلن البرنامج الكامل لملتقى 2026 قريباً",
      "The official programme will include session timings, locations, moderators, speakers, and supporting activities following confirmation by the organizing committee.",
      "سيتضمن البرنامج الرسمي مواعيد الجلسات ومواقعها ومديريها والمتحدثين والأنشطة المصاحبة بعد اعتمادها من اللجنة المنظمة.",
      [
        {
          href: "mailto:sim@startime.sa?subject=SIM%202026%20Programme%20Updates",
          label: ar ? "استقبل تحديثات البرنامج" : "Receive Programme Updates",
          style: "primary",
        },
      ],
      "forum-hero-live.png",
    ),
    footer(locale),
  ];
}

function speakersSections(locale: Locale): PageSection[] {
  const ar = locale === "ar";
  const directory = speakerSection(locale);
  const categories = [
    ["Naval and Military Leadership", "القيادات البحرية والعسكرية", "Senior commanders and defence leaders sharing strategic and operational perspectives on the changing maritime environment.", "قادة عسكريون وبحريون يقدمون رؤى استراتيجية وتشغيلية حول البيئة البحرية المتغيرة.", "anchor"],
    ["Government and Institutional Leadership", "القيادات الحكومية والمؤسسية", "Officials and decision-makers examining policy, infrastructure protection, national capabilities, and international cooperation.", "مسؤولون وصنّاع قرار يناقشون السياسات وحماية البنية التحتية والقدرات الوطنية والتعاون الدولي.", "buildings"],
    ["International Delegations and Experts", "الوفود الدولية والخبراء", "Representatives and specialists contributing experience from different maritime regions, institutions, and operational environments.", "ممثلون ومتخصصون يقدمون خبرات من مناطق ومؤسسات وبيئات تشغيلية بحرية مختلفة.", "globe"],
    ["Maritime and Defence Industry Leaders", "قادة الصناعات البحرية والدفاعية", "Executives developing the systems, services, and capabilities supporting modern maritime security.", "قيادات تطور الأنظمة والخدمات والقدرات الداعمة للأمن البحري الحديث.", "shield"],
    ["Technology and Cybersecurity Experts", "خبراء التقنية والأمن السيبراني", "Specialists in artificial intelligence, autonomous systems, communications, cybersecurity, sensors, underwater systems, and data infrastructure.", "متخصصون في الذكاء الاصطناعي والأنظمة الذاتية والاتصالات والأمن السيبراني والمستشعرات والأنظمة تحت الماء وبنية البيانات.", "circuitry"],
    ["Energy, Logistics, and Infrastructure Leaders", "قادة الطاقة والخدمات اللوجستية والبنية التحتية", "Experts addressing the protection and resilience of maritime energy corridors, ports, transport networks, and global supply chains.", "خبراء في حماية ومرونة ممرات الطاقة البحرية والموانئ وشبكات النقل وسلاسل الإمداد العالمية.", "chart"],
    ["Researchers and Strategic Specialists", "الباحثون والمتخصصون الاستراتيجيون", "Academics, analysts, and subject-matter experts contributing research, foresight, and technical insight to the Forum dialogue.", "أكاديميون ومحللون وخبراء يقدمون البحث والاستشراف والرؤية التقنية لحوار الملتقى.", "lightbulb"],
  ];
  return [
    simfHeaderSection(locale, "content"),
    hero(
      locale,
      "Voices Shaping the Future of Maritime Security",
      "أصوات ترسم مستقبل الأمن البحري",
      "Meet the naval leaders, government decision-makers, international experts, and industry executives contributing to the strategic dialogue at SIM 2026.",
      "تعرّف على القيادات البحرية وصنّاع القرار الحكوميين والخبراء الدوليين وقادة القطاع المشاركين في الحوار الاستراتيجي لملتقى 2026.",
      "naval-commanders.webp",
      [button(locale, "/programme", "View Programme", "استعرض البرنامج", "outline")],
    ),
    {
      anchorID: "speaker-introduction",
      blockType: "mediaFeature",
      displayOrder: 20,
      internalLabel: "Speaker introduction",
      visible: true,
      eyebrow: ar ? "خبرات رفيعة المستوى" : "EXPERTISE",
      heading: ar
        ? "خبرات تغطي منظومة الأمن البحري"
        : "Expertise Across the Maritime Security Ecosystem",
      body: ar
        ? "يجمع الملتقى البحري السعودي الدولي متحدثين تؤثر مسؤولياتهم وخبراتهم ومعارفهم مباشرة في الاستراتيجية والسياسات والأمن والتقنية والتعاون الدولي في المجال البحري. ويعكس برنامج متحدثي 2026 رؤى من القطاعات العسكرية والحكومية والصناعية والتقنية والطاقة والخدمات اللوجستية والبحث والمؤسسات الاستراتيجية."
        : "The Saudi International Maritime Forum brings together speakers whose responsibilities, experience, and knowledge directly influence maritime strategy, policy, security, technology, and international cooperation. The 2026 speaker programme will reflect perspectives from military, government, industry, technology, energy, logistics, research, and strategic institutions.",
      media: `${assets}/photos/forum-panel-close.webp`,
      mediaPosition: "end",
      theme: "light",
    },
    {
      anchorID: "speaker-categories",
      blockType: "cardGrid",
      displayOrder: 30,
      internalLabel: "Speaker categories",
      visible: true,
      eyebrow: ar ? "مجالات الخبرة" : "SPEAKER CATEGORIES",
      heading: ar
        ? "رؤى تمتد من القيادة إلى التقنية"
        : "Perspectives From Command to Technology",
      layout: "icons",
      cards: categories.map((item) => ({
        title: ar ? item[1] : item[0],
        body: ar ? item[3] : item[2],
        icon: item[4],
      })),
    },
    {
      ...directory,
      anchorID: "all-speakers",
      displayOrder: 40,
      internalLabel: "SIM 2026 speakers",
      eyebrow: ar ? "المتحدثون" : "SIM 2026 SPEAKERS",
      heading: ar ? "المتحدثون في ملتقى 2026" : "SIM 2026 Speakers",
      body: ar
        ? "تُعرض هنا الأسماء والمعلومات المعتمدة رسمياً فقط، ويُحدّث البرنامج تباعاً مع اكتمال الاعتمادات."
        : "Only officially approved names and information are shown here. The lineup will continue to be updated as confirmations are completed.",
    },
    conversion(
      locale,
      "Explore the Dialogue Behind SIM 2026",
      "استكشف الحوار الذي يصنع ملتقى 2026",
      "See how the programme connects strategic questions with the leaders and specialists equipped to address them.",
      "تعرّف على كيفية ربط البرنامج بين الأسئلة الاستراتيجية والقيادات والمتخصصين القادرين على معالجتها.",
      [button(locale, "/programme", "View Programme and Sessions", "استعرض البرنامج والجلسات")],
      "forum-panel-wide.webp",
    ),
    footer(locale),
  ];
}

function governmentSections(locale: Locale): PageSection[] {
  const ar = locale === "ar";
  const discussionAreas = [
    ["Maritime and Naval Systems", "الأنظمة البحرية والبحرية العسكرية", "Platforms, systems, services, and operational capabilities.", "المنصات والأنظمة والخدمات والقدرات التشغيلية.", "anchor"],
    ["Defence and Security", "الدفاع والأمن", "Security technologies, readiness, protection, and related capabilities.", "تقنيات الأمن والجاهزية والحماية والقدرات ذات الصلة.", "shield"],
    ["Seabed and Subsea Infrastructure", "قاع البحار والبنية التحتية تحت الماء", "Cables, pipelines, sensors, underwater systems, and protection solutions.", "الكابلات والأنابيب والمستشعرات والأنظمة تحت الماء وحلول الحماية.", "circuitry"],
    ["Cybersecurity and Communications", "الأمن السيبراني والاتصالات", "Secure maritime communications, digital resilience, and cyber protection.", "اتصالات بحرية آمنة ومرونة رقمية وحماية سيبرانية.", "globe"],
    ["Artificial Intelligence and Autonomous Systems", "الذكاء الاصطناعي والأنظمة الذاتية", "Advanced sensing, data analysis, unmanned platforms, and intelligent systems.", "الاستشعار المتقدم وتحليل البيانات والمنصات غير المأهولة والأنظمة الذكية.", "lightbulb"],
    ["Energy and Offshore Infrastructure", "الطاقة والبنية التحتية البحرية", "Energy corridors, offshore assets, and continuity of operations.", "ممرات الطاقة والأصول البحرية واستمرارية العمليات.", "factory"],
    ["Ports, Transport, and Logistics", "الموانئ والنقل والخدمات اللوجستية", "Port operations, transport systems, logistics, and supply-chain resilience.", "عمليات الموانئ وأنظمة النقل والخدمات اللوجستية ومرونة سلاسل الإمداد.", "chart"],
    ["Advanced Manufacturing and Localization", "التصنيع المتقدم والتوطين", "Local content, technology transfer, manufacturing, and capability development.", "المحتوى المحلي ونقل التقنية والتصنيع وتطوير القدرات.", "gear"],
    ["Investment and Strategic Partnerships", "الاستثمار والشراكات الاستراتيجية", "Long-term cooperation, market development, and institutional relationships.", "التعاون طويل المدى وتطوير السوق والعلاقات المؤسسية.", "handshake"],
  ];
  return [
    simfHeaderSection(locale, "content"),
    {
      ...hero(
        locale,
        "Structured Engagement for Cooperation, Capability, and Strategic Partnership",
        "تواصل منظم يدعم التعاون والقدرات والشراكات الاستراتيجية",
        "The SIM 2026 Government Business Meetings track provides eligible sponsors with an opportunity to engage with relevant government entities through professionally coordinated bilateral meetings.",
        "يتيح مسار اجتماعات الأعمال الحكومية في ملتقى 2026 للرعاة المؤهلين فرصة التواصل مع الجهات الحكومية ذات الصلة من خلال اجتماعات ثنائية منسقة باحتراف.",
        "vip-audience.webp",
        [button(locale, "/sponsor", "Explore Sponsorship Opportunities", "استكشف فرص الرعاية")],
      ),
      note: ar
        ? "تخضع المشاركة في مسار الأعمال الحكومية لمدى صلة الجهة، وتوفر الاجتماعات، وموافقة الجهات المعنية واللجنة المنظمة. ولا تشمل هذه الفرصة جناحاً في المعرض."
        : "B2G participation is subject to organizational relevance, meeting availability, and approval by the relevant authorities and the Organizing Committee. This opportunity does not include an exhibition booth.",
      eventDetails: [
        {
          label: ar ? "التاريخ" : "Date",
          value: ar ? "23–25 نوفمبر 2026" : "23–25 November 2026",
        },
        {
          label: ar ? "الموقع" : "Venue",
          value: ar
            ? "فندق ومركز مؤتمرات سوفيتيل الرياض"
            : "Sofitel Riyadh Hotel & Convention Center",
        },
      ],
    },
    {
      anchorID: "what-is-b2g",
      blockType: "mediaFeature",
      displayOrder: 20,
      internalLabel: "Government Business Meetings",
      visible: true,
      eyebrow: ar ? "اجتماعات الأعمال الحكومية" : "GOVERNMENT BUSINESS MEETINGS",
      heading: ar
        ? "حوار ثنائي هادف حول الأولويات والقدرات"
        : "Purposeful Bilateral Dialogue Around Priorities and Capability",
      body: ar
        ? "تمثل اجتماعات الأعمال الحكومية مكوناً مخصصاً ضمن برنامج الرعاية. فهي توفر بيئة منظمة تستطيع فيها الجهات الراعية المؤهلة عرض قدراتها وفهم الأولويات المؤسسية واستكشاف مجالات التعاون المحتملة مع الجهات الحكومية المشاركة. ويدعم المسار نقاشاً هادفاً حول التقنية والخدمات وتطوير القدرات والتوطين والاستثمار والبنية التحتية وفرص الشراكة الاستراتيجية."
        : "Government Business Meetings are a dedicated component of the Forum’s sponsorship programme. They create a structured environment in which eligible sponsoring organizations can present relevant capabilities, understand institutional priorities, and explore potential areas of cooperation with participating government entities. The track supports meaningful discussion around technology, services, capability development, localization, investment, infrastructure, and strategic partnership opportunities.",
      media: `${assets}/photos/forum-policy-panel.webp`,
      mediaPosition: "end",
      theme: "light",
    },
    {
      anchorID: "why-b2g",
      blockType: "cardGrid",
      displayOrder: 30,
      internalLabel: "B2G value",
      visible: true,
      eyebrow: ar ? "قيمة المسار" : "WHY B2G MATTERS",
      heading: ar
        ? "مسار مصمم لعلاقات مؤسسية ذات صلة"
        : "A Track Designed for Relevant Institutional Relationships",
      layout: "proof",
      cards: [
        {
          title: ar ? "تواصل مؤسسي ذو صلة" : "Relevant Institutional Engagement",
          body: ar
            ? "تواصل مع الجهات الحكومية التي قد تتقاطع مسؤولياتها وأولوياتها مع قدرات جهتك."
            : "Connect with government entities whose responsibilities and priorities may align with your organization’s capabilities.",
          icon: "buildings",
        },
        {
          title: ar ? "حوار ثنائي هادف" : "Purposeful Bilateral Dialogue",
          body: ar
            ? "شارك في اجتماعات تُعد حول أهداف وقطاعات ومجالات تعاون محددة."
            : "Participate in meetings prepared around defined objectives, sectors, and potential areas of cooperation.",
          icon: "users",
        },
        {
          title: ar ? "استكشاف الشراكات" : "Partnership Discovery",
          body: ar
            ? "استكشف فرص التعاون والتوطين وتطوير القدرات والعلاقات المؤسسية طويلة المدى."
            : "Explore opportunities for collaboration, localization, capability development, and long-term institutional relationships.",
          icon: "handshake",
        },
        {
          title: ar ? "تنسيق احترافي" : "Professional Coordination",
          body: ar
            ? "احصل على دعم تنظيمي ولوجستي للاجتماعات بحسب مزايا فئة الرعاية المختارة."
            : "Receive organizational, logistical, and meeting support according to the benefits included in the selected sponsorship category.",
          icon: "check",
        },
      ],
    },
    {
      anchorID: "discussion-areas",
      blockType: "cardGrid",
      displayOrder: 40,
      internalLabel: "Potential areas of discussion",
      visible: true,
      eyebrow: ar ? "مجالات النقاش" : "POTENTIAL AREAS OF DISCUSSION",
      heading: ar
        ? "من القدرات البحرية إلى الشراكات الاستراتيجية"
        : "From Maritime Capability to Strategic Partnership",
      layout: "list",
      cards: discussionAreas.map((item) => ({
        title: ar ? item[1] : item[0],
        body: ar ? item[3] : item[2],
        icon: item[4],
      })),
    },
    {
      anchorID: "b2g-process",
      blockType: "timeline",
      displayOrder: 50,
      internalLabel: "B2G process",
      visible: true,
      eyebrow: ar ? "آلية العمل" : "HOW THE B2G TRACK WORKS",
      heading: ar
        ? "مسار واضح من الطلب إلى المشاركة"
        : "A Clear Route From Application to Participation",
      steps: [
        {
          label: "01",
          title: ar ? "طلب الرعاية" : "Sponsorship Application",
          body: ar
            ? "تقدم الجهة ملفها وقدراتها وفئة الرعاية المفضلة وأهدافها من اجتماعات الأعمال الحكومية عبر صفحة الطلب المستقلة."
            : "The organization submits its profile, capabilities, preferred sponsorship category, and B2G objectives through the separate Sponsorship Application page.",
        },
        {
          label: "02",
          title: ar ? "مراجعة الملاءمة" : "Relevance Review",
          body: ar
            ? "يراجع الفريق قطاع الجهة وحلولها ومدى مواءمتها مع الجهات المشاركة المحتملة."
            : "The organizing team reviews the organization’s sector, solutions, and alignment with potential participating entities.",
        },
        {
          label: "03",
          title: ar ? "مواءمة الاجتماعات" : "Meeting Mapping",
          body: ar
            ? "تحدد فرص الاجتماعات المناسبة وفق الأولويات المؤسسية وأهداف الراعي ومزايا الباقة والتوفر."
            : "Relevant meeting opportunities are identified according to institutional priorities, sponsor objectives, package benefits, and availability.",
        },
        {
          label: "04",
          title: ar ? "التنسيق والتأكيد" : "Coordination and Confirmation",
          body: ar
            ? "تُجدول الاجتماعات المعتمدة وتُدعم من خلال فريق اجتماعات الأعمال الحكومية."
            : "Approved meetings are scheduled and supported through the Government Business Meetings team.",
        },
        {
          label: "05",
          title: ar ? "المشاركة في الملتقى" : "Forum Participation",
          body: ar
            ? "يحضر الراعي الاجتماعات المؤكدة ويحصل على الدعم المشمول في باقة الرعاية."
            : "The sponsor attends confirmed meetings and receives the support included within its sponsorship package.",
        },
      ],
    },
    {
      anchorID: "selected-package-support",
      blockType: "mediaFeature",
      displayOrder: 60,
      internalLabel: "Selected package support",
      visible: true,
      eyebrow: ar ? "دعم بحسب الباقة" : "SELECTED PACKAGE SUPPORT",
      heading: ar
        ? "تنسيق عملي يدعم اجتماعاً أكثر فاعلية"
        : "Practical Coordination for More Effective Engagement",
      body: ar
        ? "وفق فئة الرعاية المعتمدة، قد تشمل مزايا المسار أولوية المشاركة وجدول اجتماعات مخصصاً وتنسيق الاجتماعات الثنائية ومساحات للاجتماعات ودعماً للأعمال والخدمات اللوجستية والضيافة والترجمة عند الطلب وهوية الراعي في مناطق الاجتماعات والتوثيق والتغطية الإعلامية المختارة."
        : "Depending on the confirmed sponsorship category, B2G benefits may include priority participation, a dedicated meeting schedule, bilateral meeting coordination, meeting space, business support, logistical support, hospitality, translation upon request, sponsor identity within meeting areas, documentation, and selected media coverage.",
      media: `${assets}/photos/naval-commanders.webp`,
      mediaPosition: "start",
      theme: "dark",
    },
    {
      anchorID: "application",
      blockType: "form",
      displayOrder: 70,
      internalLabel: "B2G application form",
      visible: true,
      eyebrow: ar ? "طلب المشاركة" : "APPLICATION",
      heading: ar
        ? "ابدأ مسار مواءمة اجتماعات الأعمال الحكومية"
        : "Start the B2G Matching Process",
      body: ar
        ? "شاركنا البيانات الأساسية لجهتك وقدراتها ذات الصلة وأهدافها من التواصل. يراجع فريق ملتقى 2026 الطلب ويتواصل معكم بشأن الملاءمة والخطوات التالية."
        : "Share your essential organization details, relevant capabilities, and engagement objectives.",
      form: ar ? arabicB2GForm : simfB2GForm,
      privacyNote: ar
        ? "لا يعني إرسال الطلب تأكيد المشاركة أو ضمان اجتماعات محددة. تخضع جميع الطلبات للملاءمة الاستراتيجية والتوفر والموافقات المطلوبة."
        : "Submitting an application does not confirm participation or guarantee specific meetings.",
      successHeading: ar ? "تم استلام الطلب" : "Application Received",
      successMessage: ar
        ? "سيراجع فريق ملتقى 2026 طلبكم ويتواصل معكم بشأن الملاءمة والتوفر والخطوات التالية."
        : "The SIM 2026 team will review your application and contact you regarding next steps.",
    },
    conversion(
      locale,
      "Participation Is Based on Relevance, Availability, and Approval",
      "المشاركة تعتمد على الملاءمة والتوفر والموافقة",
      "Government Business Meetings are subject to package benefits, organizational relevance, participating-entity availability, and final approval. An application does not guarantee a meeting with a specific entity or a commercial outcome.",
      "تخضع اجتماعات الأعمال الحكومية لمزايا الباقة وملاءمة الجهة وتوفر الجهات المشاركة والموافقة النهائية. ولا يضمن تقديم الطلب اجتماعاً مع جهة محددة أو نتيجة تجارية.",
      [
        button(locale, "/sponsor", "Apply for Sponsorship", "قدّم طلب الرعاية"),
        button(locale, "/sponsor", "View Sponsorship Options", "استعرض خيارات الرعاية", "outline"),
      ],
      "naval-aerial.webp",
    ),
    footer(locale),
  ];
}

function sponsorsSections(locale: Locale): PageSection[] {
  const ar = locale === "ar";
  const categories = [
    ["Strategic Sponsor", "الراعي الاستراتيجي", "The highest level of participation, created for organizations seeking exceptional institutional association, prominent visibility, and advanced engagement across the Forum.", "أعلى مستوى من المشاركة للجهات التي تسعى إلى ارتباط مؤسسي استثنائي وظهور بارز وتفاعل متقدم عبر الملتقى.", "shield"],
    ["Sector Sponsor", "راعي القطاع", "Exclusive sector positioning in Energy, Logistics, or Technology for organizations seeking leadership and institutional presence within a field directly connected to the Forum’s themes.", "حضور حصري في قطاعات الطاقة أو الخدمات اللوجستية أو التقنية للجهات التي تسعى إلى قيادة قطاعية ووجود مؤسسي مرتبط مباشرة بمحاور الملتقى.", "factory"],
    ["Diamond Sponsor", "الراعي الماسي", "An advanced category for organizations seeking strong institutional visibility and deeper engagement with naval leadership, government entities, and international delegations.", "فئة متقدمة للجهات الراغبة في حضور مؤسسي قوي وتواصل أعمق مع القيادات البحرية والجهات الحكومية والوفود الدولية.", "sparkle"],
    ["Platinum Sponsor", "الراعي البلاتيني", "A prominent category providing balanced visibility, participation, and association across selected Forum activities.", "فئة بارزة توفر توازناً بين الظهور والمشاركة والارتباط بمجموعة مختارة من أنشطة الملتقى.", "compass"],
    ["Gold Sponsor", "الراعي الذهبي", "A professional route for organizations seeking official association, institutional presence, and visibility before participating entities.", "مسار احترافي للجهات التي تسعى إلى ارتباط رسمي وحضور مؤسسي وظهور أمام الجهات المشاركة.", "globe"],
    ["Silver Sponsor", "الراعي الفضي", "Designed for organizations seeking professional visibility and participation within the maritime security ecosystem.", "مصمم للجهات التي تبحث عن ظهور احترافي ومشاركة ضمن منظومة الأمن البحري.", "chart"],
    ["Co Sponsor", "الراعي المشارك", "A focused participation route offering official sponsor association and selected visibility, engagement, and Government Business Meeting benefits.", "مسار مشاركة مركز يمنح ارتباطاً رسمياً بالرعاية ومزايا مختارة للظهور والتواصل واجتماعات الأعمال الحكومية.", "handshake"],
    ["Official Carrier", "الناقل الرسمي", "An exclusive opportunity for a transportation organization to become the official carrier supporting the Forum experience.", "فرصة حصرية لجهة نقل لتكون الناقل الرسمي الداعم لتجربة الملتقى.", "anchor"],
    ["Hospitality Sponsor", "راعي الضيافة", "An exclusive opportunity for a hospitality organization to contribute to the guest, delegation, and protocol experience of SIM 2026.", "فرصة حصرية لجهة ضيافة للإسهام في تجربة الضيوف والوفود والبروتوكول في ملتقى 2026.", "users"],
  ];
  const objectives = [
    ["Government and Institutional Engagement", "التواصل الحكومي والمؤسسي", "Build relevant relationships and explore areas of cooperation.", "بناء علاقات ذات صلة واستكشاف مجالات التعاون.", "buildings"],
    ["Saudi Market Positioning", "تعزيز الحضور في السوق السعودي", "Strengthen presence and relevance within the Saudi maritime security ecosystem.", "تعزيز الحضور والملاءمة داخل منظومة الأمن البحري السعودية.", "compass"],
    ["International Visibility", "الظهور الدولي", "Reach naval leadership, delegations, specialists, and industry audiences.", "الوصول إلى القيادات البحرية والوفود والمتخصصين وجمهور القطاع.", "globe"],
    ["Sector Leadership", "القيادة القطاعية", "Establish an advanced position in Energy, Logistics, Technology, or related fields.", "بناء موقع متقدم في الطاقة أو الخدمات اللوجستية أو التقنية أو المجالات ذات الصلة.", "factory"],
    ["Technology and Capability Presentation", "عرض التقنية والقدرات", "Showcase systems, services, platforms, and solutions.", "عرض الأنظمة والخدمات والمنصات والحلول.", "circuitry"],
    ["Strategic Partnerships", "الشراكات الاستراتيجية", "Explore cooperation, localization, market development, and long-term relationships.", "استكشاف التعاون والتوطين وتطوير السوق والعلاقات طويلة المدى.", "handshake"],
    ["Exhibition Participation", "المشاركة في المعرض", "Create a visible environment for demonstrations, meetings, and engagement.", "صناعة بيئة بارزة للعروض والاجتماعات والتواصل.", "users"],
    ["Media and Thought Leadership", "الإعلام والقيادة الفكرية", "Contribute expertise and secure selected media, editorial, and programme opportunities.", "المساهمة بالخبرة والاستفادة من فرص إعلامية وتحريرية وبرامجية مختارة.", "megaphone"],
  ];
  return [
    simfHeaderSection(locale, "content"),
    hero(
      locale,
      "Position Your Organization Within the Future of Maritime Security",
      "ضع جهتك في قلب مستقبل الأمن البحري",
      "Build institutional presence, engage with influential entities, showcase your capabilities, and strengthen your connection to an international ecosystem focused on seabed security and maritime supply chains.",
      "ابنِ حضوراً مؤسسياً، وتواصل مع الجهات المؤثرة، واعرض قدراتك، وعزز ارتباطك بمنظومة دولية تركز على أمن قاع البحار وسلاسل الإمداد البحرية.",
      "forum-hero-live.png",
      [
        button(locale, "/sponsor", "Apply for Sponsorship", "قدّم طلب الرعاية"),
        {
          href: "mailto:sim@startime.sa?subject=SIM%202026%20Sponsorship%20Guide",
          label: ar ? "اطلب دليل الرعاية" : "Request the Sponsorship Guide",
          style: "outline",
        },
      ],
    ),
    {
      anchorID: "sponsorship-introduction",
      blockType: "mediaFeature",
      displayOrder: 20,
      internalLabel: "Sponsorship introduction",
      visible: true,
      eyebrow: ar ? "ما بعد الظهور" : "MORE THAN VISIBILITY",
      heading: ar
        ? "موقع استراتيجي داخل الملتقى"
        : "A Strategic Position Within the Forum",
      body: ar
        ? "تمثل رعاية الملتقى البحري السعودي الدولي الرابع فرصة لوضع جهتك ضمن منصة وطنية رفيعة المستوى ذات امتداد دولي. وتوفر مساراً منظماً للظهور المؤسسي والتواصل مع الحكومة والقطاع والوصول الدولي وعرض التقنيات وبناء العلاقات قبل الملتقى وأثناءه وبعده. وصُمم إطار الرعاية حول أهداف استراتيجية ومستويات مشاركة ونتائج مختلفة، لا كحضور موحد لجميع الجهات."
        : "Sponsoring the fourth Saudi International Maritime Forum is an opportunity to establish your organization within a high-level national platform with international reach. It provides a structured route to institutional visibility, government and industry engagement, international exposure, technology presentation, and relationship building before, during, and after the Forum. The sponsorship framework is designed around different strategic objectives, levels of participation, and desired outcomes, rather than offering one generic form of event presence.",
      media: `${assets}/photos/vip-audience.webp`,
      mediaPosition: "end",
      theme: "light",
    },
    {
      anchorID: "reasons",
      blockType: "timeline",
      displayOrder: 30,
      internalLabel: "Reasons to sponsor",
      visible: true,
      eyebrow: ar ? "لماذا تصبح راعياً؟" : "FOUR REASONS TO BECOME A SPONSOR",
      heading: ar
        ? "فرصة في توقيت مهم لبناء الشراكات وتعزيز الوصول إلى منظومة الأمن البحري"
        : "A Timely Opportunity to Enable Partnerships and Strengthen Access to Maritime Security Ecosystems",
      steps: [
        {
          label: "01",
          title: ar
            ? "رسّخ حضوراً مؤسسياً بين الجهات المؤثرة في الأمن البحري"
            : "Establish Institutional Presence Among Influential Maritime Security Entities",
          body: ar
            ? "يمنح ملتقى 2026 الرعاة موقعاً بارزاً بين القيادات البحرية والعسكرية والجهات الحكومية والوفود الدولية والجهات المساهمة في الأمن البحري ومرونة سلاسل الإمداد، مع فرص للتواصل حول حماية الممرات وأمن الطاقة والبنية الحيوية والتقنيات البحرية المتقدمة."
            : "SIM 2026 provides sponsors with a visible position among naval and military leadership, government entities, international delegations, and organizations contributing to maritime security and supply-chain resilience, with opportunities to engage across corridor protection, energy security, critical infrastructure, and advanced maritime technologies.",
        },
        {
          label: "02",
          title: ar
            ? "استفد من مسار اجتماعات الأعمال الحكومية"
            : "Gain Strategic Access to the Government Business Meetings Track",
          body: ar
            ? "يوفر المسار للرعاة المؤهلين تواصلاً منظماً مع الجهات الحكومية ذات الصلة لعرض القدرات وفهم الأولويات واستكشاف مجالات التعاون. ويعتمد الوصول على الفئة والملاءمة والتوفر وموافقة المنظم."
            : "The track provides eligible sponsors with structured access to relevant government entities, creating an environment in which capabilities can be presented, priorities understood, and potential areas of cooperation explored. Access depends on category, relevance, availability, and organizer approval.",
        },
        {
          label: "03",
          title: ar
            ? "اربط علامتك بقطاع استراتيجي متنامٍ"
            : "Associate Your Brand With a Strategically Expanding Sector",
          body: ar
            ? "تتزايد أهمية البنية التحتية لقاع البحار والاتصالات تحت الماء والأنظمة البحرية الذاتية والأمن السيبراني وأمن الطاقة وسلاسل الإمداد المرنة. وتضع الرعاية جهتك داخل الحوار الاستراتيجي حول هذه المجالات سريعة التطور."
            : "Seabed infrastructure, subsea communications, autonomous maritime systems, cybersecurity, energy security, and resilient supply chains are becoming increasingly important worldwide. Sponsorship positions your organization within the strategic conversation surrounding these rapidly developing fields.",
        },
        {
          label: "04",
          title: ar
            ? "تواصل مع منظومة مترابطة للأمن البحري"
            : "Access an Interconnected Maritime Security Ecosystem",
          body: ar
            ? "يجمع الملتقى مؤسسات وجهات تعمل في الدفاع والحكومة والطاقة والنقل والخدمات اللوجستية والأمن السيبراني والتقنية والبنية الحيوية، بما يتيح فهم توجهاتها واستكشاف فرص التعاون والشراكات والعلاقات المؤسسية طويلة المدى."
            : "The Forum brings together institutions and organizations across defence, government, energy, transport, logistics, cybersecurity, technology, and critical infrastructure, enabling sponsors to understand its direction and explore cooperation, partnerships, and long-term institutional relationships.",
        },
      ],
    },
    {
      anchorID: "sponsorship-deliverables",
      blockType: "cardGrid",
      displayOrder: 40,
      internalLabel: "Sponsorship value",
      visible: true,
      eyebrow: ar ? "قيمة الرعاية" : "WHAT SPONSORSHIP CAN DELIVER",
      heading: ar
        ? "قيمة مؤسسية عبر رحلة الملتقى"
        : "Institutional Value Across the Forum Journey",
      layout: "icons",
      cards: [
        ["Institutional Association", "ارتباط مؤسسي", "Position your organization within the official identity and strategic environment of SIM 2026.", "ضع جهتك ضمن الهوية الرسمية والبيئة الاستراتيجية لملتقى 2026.", "shield"],
        ["Government Engagement", "تواصل حكومي", "Participate in selected Government Business Meeting opportunities according to package and eligibility.", "المشاركة في فرص مختارة لاجتماعات الأعمال الحكومية بحسب الباقة والأهلية.", "buildings"],
        ["Sector Leadership", "قيادة قطاعية", "Strengthen your organization’s position within maritime security, energy, logistics, or technology.", "عزز موقع جهتك في الأمن البحري أو الطاقة أو الخدمات اللوجستية أو التقنية.", "chart"],
        ["Exhibition Presence", "حضور في المعرض", "Showcase systems, services, technologies, and capabilities before professional and institutional audiences.", "اعرض الأنظمة والخدمات والتقنيات والقدرات أمام جمهور مهني ومؤسسي.", "sparkle"],
        ["Media and Digital Impact", "أثر إعلامي ورقمي", "Benefit from selected editorial, digital, media, and promotional opportunities across the Forum journey.", "استفد من فرص تحريرية ورقمية وإعلامية وترويجية مختارة عبر رحلة الملتقى.", "megaphone"],
        ["International Engagement", "تواصل دولي", "Connect with official delegations, specialists, and organizations participating from more than 40 countries.", "تواصل مع الوفود الرسمية والمتخصصين والجهات المشاركة من أكثر من 40 دولة.", "globe"],
      ].map((item) => ({
        title: ar ? item[1] : item[0],
        body: ar ? item[3] : item[2],
        icon: item[4],
      })),
    },
    {
      anchorID: "forum-lifecycle",
      blockType: "cardGrid",
      displayOrder: 50,
      internalLabel: "Value across the lifecycle",
      visible: true,
      eyebrow: ar ? "قبل وأثناء وبعد الملتقى" : "BEFORE, DURING, AND AFTER",
      heading: ar
        ? "حضور يمتد إلى ما بعد أيام الملتقى"
        : "A Presence That Extends Beyond the Forum Floor",
      layout: "columns",
      cards: [
        {
          eyebrow: ar ? "قبل الملتقى" : "BEFORE",
          title: ar ? "بناء الزخم" : "Build Momentum",
          body: ar
            ? "إعلانات الرعاة الرسمية والظهور الصحفي والإعلامي والحضور الرقمي وحملات التسويق وحفل توقيع الرعاية والظهور في الدعوات أو التسجيل وفق الباقة."
            : "Official sponsor announcements, press and media visibility, website and digital presence, marketing-campaign inclusion, sponsor signing ceremony participation, and invitation or registration visibility according to package.",
          media: `${assets}/photos/forum-panel-close.webp`,
        },
        {
          eyebrow: ar ? "أثناء الملتقى" : "DURING",
          title: ar ? "صناعة الحضور" : "Create Presence",
          body: ar
            ? "حضور الافتتاح والظهور في الموقع والبرنامج والمشاركة في المعرض واجتماعات الأعمال الحكومية والتغطية الإعلامية ومزايا البروتوكول والضيافة والمشاركة في جلسات مختارة بحسب الباقة."
            : "Opening ceremony presence, venue and programme visibility, exhibition participation, Government Business Meetings, media coverage, protocol and hospitality benefits, and selected session participation according to package.",
          media: `${assets}/photos/vip-audience.webp`,
        },
        {
          eyebrow: ar ? "بعد الملتقى" : "AFTER",
          title: ar ? "استدامة الأثر" : "Extend the Impact",
          body: ar
            ? "الظهور في التقرير الختامي وفيلم الملتقى ومواد تقدير الرعاة والتوثيق الفوتوغرافي والإعلامي واستمرار الارتباط ضمن المحتوى الرسمي وفق الباقة."
            : "Final-report visibility, Forum documentary presence, sponsor-recognition materials, photo and media documentation, and continued association within official Forum content according to package.",
          media: `${assets}/photos/naval-formation-sunset.webp`,
        },
      ],
    },
    {
      anchorID: "sponsorship-categories",
      blockType: "cardGrid",
      displayOrder: 60,
      internalLabel: "Sponsorship categories",
      visible: true,
      eyebrow: ar ? "فئات الرعاية" : "SPONSORSHIP CATEGORIES",
      heading: ar
        ? "مسارات مشاركة تناسب أهدافاً مختلفة"
        : "Participation Routes for Different Strategic Objectives",
      layout: "list",
      cards: categories.map((item) => ({
        title: ar ? item[1] : item[0],
        body: ar ? item[3] : item[2],
        icon: item[4],
      })),
    },
    {
      anchorID: "objectives",
      blockType: "cardGrid",
      displayOrder: 70,
      internalLabel: "Sponsorship objectives",
      visible: true,
      eyebrow: ar ? "اختر الموقع المناسب" : "FIND THE RIGHT POSITION",
      heading: ar
        ? "رعاية مبنية حول أهدافك"
        : "Sponsorship Built Around Your Objectives",
      body: ar
        ? "تعتمد الباقة الأنسب على ما تريد جهتك تحقيقه."
        : "The most suitable package depends on what your organization wants to achieve.",
      layout: "proof",
      cards: objectives.map((item) => ({
        title: ar ? item[1] : item[0],
        body: ar ? item[3] : item[2],
        icon: item[4],
      })),
      buttons: [
        {
          href: "mailto:sim@startime.sa?subject=SIM%202026%20Package%20Recommendation",
          label: ar ? "اطلب توصية بالباقة المناسبة" : "Request a Package Recommendation",
          style: "outline",
        },
      ],
    },
    {
      anchorID: "sponsorship-process",
      blockType: "timeline",
      displayOrder: 80,
      internalLabel: "Sponsorship process",
      visible: true,
      eyebrow: ar ? "رحلة الرعاية" : "SPONSORSHIP PROCESS",
      heading: ar
        ? "من تحديد الأهداف إلى تفعيل الشراكة"
        : "From Defined Objectives to Sponsor Activation",
      steps: [
        ["Define Your Objectives", "حدد أهدافك", "Identify the institutional, commercial, market, visibility, exhibition, or partnership outcomes most important to your organization.", "حدد النتائج المؤسسية أو التجارية أو السوقية أو الإعلامية أو المتعلقة بالمعرض أو الشراكات الأكثر أهمية لجهتك."],
        ["Submit Your Application", "قدّم طلبك", "Complete the separate Sponsorship Application page with your organization, sector, representatives, preferred category, and objectives.", "أكمل طلب الرعاية المستقل ببيانات جهتك وقطاعها وممثليها والفئة المفضلة والأهداف."],
        ["Sponsorship Review", "مراجعة الرعاية", "The sponsorship team reviews relevance, package availability, objectives, and potential alignment.", "يراجع فريق الرعاية الملاءمة وتوفر الباقة والأهداف وفرص المواءمة."],
        ["Consultation", "الاستشارة", "A sponsorship representative discusses the most suitable package and participation structure with your organization.", "يناقش ممثل الرعاية مع جهتك الباقة وهيكل المشاركة الأنسب."],
        ["Confirmation and Onboarding", "التأكيد والانضمام", "Following approval and contract completion, the organization enters the official sponsor onboarding and activation process.", "بعد الموافقة واستكمال العقد، تبدأ الجهة عملية الانضمام والتفعيل الرسمية للرعاة."],
      ].map((item, index) => ({
        label: String(index + 1).padStart(2, "0"),
        title: ar ? item[1] : item[0],
        body: ar ? item[3] : item[2],
      })),
    },
    conversion(
      locale,
      "Start Your SIM 2026 Sponsorship Application",
      "ابدأ طلب رعاية ملتقى 2026",
      "Tell us about your organization, strategic priorities, and the outcomes you want to achieve.",
      "عرّفنا بجهتك وأولوياتها الاستراتيجية والنتائج التي تريد تحقيقها.",
      [
        button(locale, "/sponsor", "Start Sponsorship Application", "ابدأ طلب الرعاية"),
        button(locale, "/b2g", "Explore Government B2G", "استكشف الأعمال الحكومية", "outline"),
      ],
      "fleet-formation.webp",
    ),
    footer(locale),
  ];
}

function partnersSections(locale: Locale): PageSection[] {
  const ar = locale === "ar";
  const approved = partnerSection(locale);
  const approvedCards = approved.cards;
  const cardsForRoles = (...roles: string[]) =>
    approvedCards.filter((card) => card.meta && roles.includes(card.meta));
  return [
    simfHeaderSection(locale, "content"),
    hero(
      locale,
      "Partnership for Maritime Security, Knowledge, and International Cooperation",
      "شراكة من أجل الأمن البحري والمعرفة والتعاون الدولي",
      "SIM 2026 is supported by institutions and organizations contributing expertise, capabilities, networks, services, and strategic support to the Forum.",
      "يحظى ملتقى 2026 بدعم مؤسسات وجهات تسهم بخبراتها وقدراتها وشبكاتها وخدماتها ودعمها الاستراتيجي للملتقى.",
      "warship-pair.webp",
    ),
    {
      anchorID: "partner-introduction",
      blockType: "mediaFeature",
      displayOrder: 20,
      internalLabel: "Partner introduction",
      visible: true,
      eyebrow: ar ? "منظومة مترابطة" : "A CONNECTED ECOSYSTEM",
      heading: ar
        ? "الأمن البحري يحتاج مؤسسات مترابطة"
        : "Maritime Security Requires Connected Institutions",
      body: ar
        ? "تمتد تحديات المجال البحري عبر الحكومة والعسكر والقطاع والتقنية والبحث والطاقة والخدمات اللوجستية والبنية التحتية. ويوفر ملتقى 2026 منصة تسهم من خلالها الجهات ذات الصلة في الحوار الاستراتيجي والمشاركة الدولية وتبادل المعرفة والوصول الإعلامي والنجاح التشغيلي للملتقى."
        : "The challenges facing the maritime domain extend across government, military, industry, technology, research, energy, logistics, and infrastructure. SIM 2026 provides a platform through which relevant partners can contribute to strategic dialogue, international participation, knowledge exchange, media reach, and the successful delivery of the Forum.",
      media: `${assets}/photos/forum-panel-wide.webp`,
      mediaPosition: "end",
      theme: "light",
    },
    {
      anchorID: "partner-categories",
      blockType: "cardGrid",
      displayOrder: 30,
      internalLabel: "Partner categories",
      visible: true,
      eyebrow: ar ? "فئات الشراكة" : "PARTNER CATEGORIES",
      heading: ar
        ? "مساهمات تُعرّف بدورها لا بحجمها"
        : "Contributions Defined by Their Institutional Role",
      layout: "icons",
      cards: [
        ["Institutional and Strategic Partners", "الشركاء المؤسسيون والاستراتيجيون", "Government entities, national institutions, international organizations, and strategic stakeholders supporting the Forum’s mission and institutional reach.", "جهات حكومية ومؤسسات وطنية ومنظمات دولية وأطراف استراتيجية تدعم رسالة الملتقى وامتداده المؤسسي.", "buildings"],
        ["Knowledge and Research Partners", "شركاء المعرفة والبحث", "Universities, research centres, specialist institutions, and policy organizations contributing expertise, evidence, and strategic insight.", "جامعات ومراكز بحث ومؤسسات متخصصة وجهات سياسات تقدم الخبرة والأدلة والرؤية الاستراتيجية.", "lightbulb"],
        ["Industry and Technology Partners", "شركاء القطاع والتقنية", "Organizations contributing maritime, defence, energy, logistics, infrastructure, cybersecurity, and technology capabilities.", "جهات تسهم بقدرات بحرية ودفاعية وطاقية ولوجستية وتقنية وفي البنية التحتية والأمن السيبراني.", "gear"],
        ["Media Partners", "الشركاء الإعلاميون", "National, regional, and international media organizations supporting professional coverage and wider awareness of the Forum.", "جهات إعلامية وطنية وإقليمية ودولية تدعم التغطية المهنية وتوسيع الوعي بأنشطة الملتقى ونتائجه.", "megaphone"],
        ["Service and Experience Partners", "شركاء الخدمات والتجربة", "Organizations contributing to transportation, hospitality, production, technology, protocol, guest management, and operational delivery.", "جهات تسهم في النقل والضيافة والإنتاج والتقنية والبروتوكول وإدارة الضيوف والتنفيذ التشغيلي.", "sparkle"],
      ].map((item) => ({
        title: ar ? item[1] : item[0],
        body: ar ? item[3] : item[2],
        icon: item[4],
      })),
    },
    {
      anchorID: "partnership-value",
      blockType: "timeline",
      displayOrder: 40,
      internalLabel: "Partnership value",
      visible: true,
      eyebrow: ar ? "قيمة الشراكة" : "THE VALUE OF PARTNERSHIP",
      heading: ar
        ? "خبرة واتصال وحوار واعتراف مستحق"
        : "Expertise, Connection, Dialogue, and Appropriate Recognition",
      steps: [
        ["Contribute Expertise", "أسهم بخبرتك", "Bring relevant knowledge, capabilities, or institutional experience to the Forum.", "قدّم المعرفة أو القدرات أو الخبرة المؤسسية ذات الصلة للملتقى."],
        ["Strengthen International Connection", "عزز الاتصال الدولي", "Support engagement across government entities, naval leadership, official delegations, and participating organizations.", "ادعم التواصل بين الجهات الحكومية والقيادات البحرية والوفود الرسمية والجهات المشاركة."],
        ["Advance Strategic Dialogue", "طور الحوار الاستراتيجي", "Contribute to subjects related to seabed security, infrastructure protection, technology, and supply-chain resilience.", "أسهم في موضوعات أمن قاع البحار وحماية البنية التحتية والتقنية ومرونة سلاسل الإمداد."],
        ["Receive Appropriate Recognition", "احصل على التقدير المناسب", "Receive visibility and recognition according to the confirmed partnership category and approved contribution.", "احصل على الظهور والتقدير بحسب فئة الشراكة المؤكدة والمساهمة المعتمدة."],
      ].map((item, index) => ({
        label: String(index + 1).padStart(2, "0"),
        title: ar ? item[1] : item[0],
        body: ar ? item[3] : item[2],
      })),
    },
    {
      ...approved,
      anchorID: "partner-category-institutional",
      displayOrder: 50,
      internalLabel: "Institutional and strategic partners",
      eyebrow: ar ? "الإطار المؤسسي" : "INSTITUTIONAL FRAMEWORK",
      heading: ar ? "جهات التمكين والشراكة الاستراتيجية" : "Enabling and Strategic Organizations",
      body: ar
        ? "الجهات التي تدعم الإطار المؤسسي والاستراتيجي للملتقى."
        : "Organizations supporting the Forum’s institutional and strategic framework.",
      layout: "columns",
      cards: cardsForRoles(
        ar ? "الجهة المرخّص لها" : "Licensed to",
        ar ? "الشريك الاستراتيجي" : "Strategic Partner",
      ),
    },
    {
      ...approved,
      anchorID: "partner-category-sponsors",
      displayOrder: 51,
      internalLabel: "Confirmed sponsors",
      eyebrow: ar ? "الرعاة" : "CONFIRMED SPONSORS",
      heading: ar ? "جهات تستثمر في مستقبل الأمن البحري" : "Organizations Investing in Maritime Security",
      body: ar
        ? "الرعاة المعتمدون الذين يدعمون حضور الملتقى وتأثيره."
        : "Confirmed sponsors supporting the Forum’s reach and impact.",
      layout: "columns",
      cards: cardsForRoles(ar ? "راعٍ ذهبي" : "Gold Sponsor"),
    },
    {
      ...approved,
      anchorID: "partner-category-media",
      displayOrder: 52,
      internalLabel: "Media partners",
      eyebrow: ar ? "الشركاء الإعلاميون" : "MEDIA PARTNERS",
      heading: ar ? "تغطية متخصصة تصل بالحوار إلى جمهور أوسع" : "Specialist Coverage Extending the Dialogue",
      body: ar
        ? "منصات متخصصة تدعم التغطية المهنية وانتشار معرفة الملتقى."
        : "Specialist platforms supporting professional coverage and wider awareness.",
      layout: "columns",
      cards: cardsForRoles(ar ? "شريك إعلامي" : "Media Partner"),
    },
    {
      ...approved,
      anchorID: "partner-category-delivery",
      displayOrder: 53,
      internalLabel: "Delivery and advisory partners",
      eyebrow: ar ? "شركاء التنفيذ" : "DELIVERY PARTNERS",
      heading: ar ? "خبرات تقود تجربة الملتقى وتنفيذه" : "Expertise Behind the Forum Experience",
      body: ar
        ? "شركاء الإنتاج والاستشارات المسؤولون عن دعم تجربة ملتقى متكاملة."
        : "Production and advisory partners supporting an integrated Forum experience.",
      layout: "columns",
      cards: cardsForRoles(
        ar ? "المقاول الرسمي" : "Official Contractor",
        ar ? "مستشار إدارة الحدث" : "Event Management Consultant",
      ),
    },
    conversion(
      locale,
      "Explore a Partnership With SIM 2026",
      "استكشف شراكة مع ملتقى 2026",
      "Partnership opportunities are evaluated according to relevance, proposed contribution, institutional alignment, availability, and organizing committee approval.",
      "تُقيّم فرص الشراكة وفق الملاءمة والمساهمة المقترحة والمواءمة المؤسسية والتوفر وموافقة اللجنة المنظمة.",
      [
        {
          href: "mailto:sim@startime.sa?subject=SIM%202026%20Partnership",
          label: ar ? "ناقش فرصة شراكة" : "Discuss a Partnership",
          style: "primary",
        },
      ],
      "naval-operations.webp",
    ),
    footer(locale),
  ];
}

const pageMeta: Record<
  SimfContentPageKey,
  {
    ar: string;
    en: string;
    summaryAr: string;
    summaryEn: string;
    sections: (locale: Locale) => PageSection[];
  }
> = {
  contact: {
    en: "Contact",
    ar: "تواصل معنا",
    summaryEn:
      "Contact the SIM 2026 team about the programme, speakers, partnerships, sponsorship, B2G opportunities, or media enquiries.",
    summaryAr:
      "تواصل مع فريق ملتقى 2026 بشأن البرنامج أو المتحدثين أو الشراكات أو الرعاية أو فرص الأعمال الحكومية أو الإعلام.",
    sections: (locale) => {
      const ar = locale === "ar";
      return [
        simfHeaderSection(locale, "content"),
        hero(
          locale,
          "Connect with the SIM 2026 Team",
          "تواصل مع فريق ملتقى 2026",
          "Contact the organizing team regarding the programme, speakers, partnerships, sponsorship, B2G opportunities, or media enquiries.",
          "تواصل مع فريق التنظيم بشأن البرنامج أو المتحدثين أو الشراكات أو الرعاية أو فرص الأعمال الحكومية أو الاستفسارات الإعلامية.",
          "forum-panel-wide.webp",
          [
            {
              href: "mailto:sim@startime.sa",
              label: ar ? "راسل فريق الملتقى" : "Email the Forum",
              style: "primary",
            },
          ],
        ),
        {
          anchorID: "contact-details",
          blockType: "cardGrid",
          displayOrder: 20,
          internalLabel: "Contact details",
          visible: true,
          heading: ar ? "ابدأ الحوار الصحيح" : "Start the Right Conversation",
          body: ar
            ? "شارك استفسارك مع فريق ملتقى 2026، وسيُحال إلى الفريق المختص للمراجعة والمتابعة."
            : "Share your enquiry with the SIM 2026 team. Your message will be directed to the relevant team for review and follow-up.",
          layout: "icons",
          cards: [
            {
              title: ar ? "البريد الإلكتروني" : "Email",
              body: "sim@startime.sa",
              icon: "envelope",
            },
            {
              title: ar ? "الهاتف" : "Phone",
              body: "920010500",
              icon: "phone",
            },
            {
              title: ar ? "العنوان" : "Address",
              body: ar
                ? "3507، الرياض 12341، المملكة العربية السعودية"
                : "3507, Riyadh 12341, Saudi Arabia",
              icon: "map-pin",
            },
          ],
        },
        {
          anchorID: "contact-form",
          blockType: "form",
          displayOrder: 30,
          internalLabel: "Contact form",
          visible: true,
          eyebrow: ar ? "أرسل استفسارك" : "SEND AN ENQUIRY",
          heading: ar ? "كيف يمكننا مساعدتك؟" : "How Can We Help?",
          body: ar
            ? "شارك تفاصيل استفسارك، وسيوجهه فريق ملتقى 2026 إلى الجهة المختصة للمتابعة."
            : "Share the details of your enquiry and the SIM 2026 team will direct it to the relevant team.",
          form: ar ? arabicContactForm : simfContactForm,
          privacyNote: ar
            ? "تُستخدم بياناتك للرد على هذا الاستفسار ومتابعته فقط."
            : "Your information will only be used to respond to and follow up on this enquiry.",
          successHeading: ar ? "تم استلام استفسارك" : "Enquiry Received",
          successMessage: ar
            ? "شكراً لتواصلك. سيراجع فريق ملتقى 2026 رسالتك ويتواصل معك قريباً."
            : "Thank you. The SIM 2026 team will review your message and contact you shortly.",
        },
        footer(locale),
      ];
    },
  },
  legacy: {
    en: "Legacy",
    ar: "إرث الملتقى",
    summaryEn:
      "Discover the purpose, history, and official framework of the Saudi International Maritime Forum.",
    summaryAr:
      "تعرّف على رسالة الملتقى البحري السعودي الدولي وإرثه وإطاره الرسمي.",
    sections: legacySections,
  },
  programme: {
    en: "Programme",
    ar: "البرنامج",
    summaryEn:
      "Explore the SIM 2026 programme components and current strategic session framework.",
    summaryAr:
      "استكشف مكونات برنامج ملتقى 2026 والإطار الاستراتيجي الحالي للجلسات.",
    sections: programmeSections,
  },
  speakers: {
    en: "Speakers",
    ar: "المتحدثون",
    summaryEn:
      "Meet the approved leaders and specialists contributing to the SIM 2026 dialogue.",
    summaryAr:
      "تعرّف على القيادات والمتخصصين المعتمدين المشاركين في حوار ملتقى 2026.",
    sections: speakersSections,
  },
  "government-b2g": {
    en: "Government B2G",
    ar: "اجتماعات الأعمال الحكومية",
    summaryEn:
      "Learn how eligible SIM 2026 sponsors can access professionally coordinated Government Business Meetings.",
    summaryAr:
      "تعرّف على مسار اجتماعات الأعمال الحكومية المنظم باحتراف للرعاة المؤهلين في ملتقى 2026.",
    sections: governmentSections,
  },
  sponsors: {
    en: "Sponsors",
    ar: "الرعاية",
    summaryEn:
      "Explore SIM 2026 sponsorship value, categories, objectives, and application process.",
    summaryAr:
      "استكشف قيمة رعاية ملتقى 2026 وفئاتها وأهدافها ومسار التقديم.",
    sections: sponsorsSections,
  },
  partners: {
    en: "Partners",
    ar: "الشركاء",
    summaryEn:
      "Discover the institutional, knowledge, industry, media, and service partners supporting SIM 2026.",
    summaryAr:
      "تعرّف على الشركاء المؤسسيين والمعرفيين والصناعيين والإعلاميين والخدميين الداعمين لملتقى 2026.",
    sections: partnersSections,
  },
};

export function getSimfContentPage(
  locale: Locale,
  key: SimfContentPageKey,
): PublicPage {
  const clientPage = getEnglishClientPage(
    locale,
    key as ClientContentPageKey,
  );
  if (clientPage) return applyEditorialMedia(clientPage, key);
  const meta = pageMeta[key];
  const ar = locale === "ar";
  const title = ar ? meta.ar : meta.en;
  const summary = ar ? meta.summaryAr : meta.summaryEn;
  return applyEditorialMedia({
    pageType: `simf-microsite-${key}`,
    sections: meta.sections(locale),
    seo: {
      title: `${title} | SIM 2026`,
      description: summary,
      followLinks: true,
      indexable: true,
      openGraphImage: `${assets}/photos/forum-hero-live.png`,
    },
    slug: `simf-microsite/${key}`,
    summary,
    title,
  }, key);
}
