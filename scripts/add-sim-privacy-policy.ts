import { createHash } from "node:crypto";
import configPromise from "@payload-config";
import { getPayload } from "payload";
import type { Page } from "../src/generated/payload-types";

type Locale = "en" | "ar";
type Section = Record<string, unknown>;
const apply = process.env.APPLY_SIM_PRIVACY_POLICY === "1";
const slug = "simf-microsite/privacy-policy";
const locales: Locale[] = ["en", "ar"];
const payload = await getPayload({ config: configPromise });

const copy = {
  en: {
    title: "Privacy Policy",
    summary:
      "STARTIME EVENTS COMPANY's privacy policy for the Saudi International Maritime Forum website.",
    introduction:
      "This policy is issued and maintained by STARTIME EVENTS COMPANY (STARTIME) for sim.startime.sa, the Saudi International Maritime Forum website. References to ‘we’, ‘us’ and ‘our’ in this policy mean STARTIME.",
    updated: "Last updated: 14 October 2026",
    sections: [
      [
        "Who this policy applies to",
        "This policy explains how STARTIME handles personal information provided by visitors and people submitting contact enquiries, sponsorship applications and B2G applications through this website. It applies to the English and Arabic versions of sim.startime.sa.",
      ],
      [
        "Information we receive",
        "When you submit a form, we receive the details you enter, such as your name, business email address, telephone number, organization, role and enquiry or application details. If a form permits attachments, we also receive the files you choose to upload.<br><br>Our website may record technical and visit information, including IP address, browser and device information, pages visited, referring website, campaign parameters and advertising identifiers. Please avoid including sensitive personal information that is unnecessary for your request.",
      ],
      [
        "How we use information",
        "We use submitted information to respond to enquiries, assess sponsorship and B2G applications, coordinate relevant follow-up and maintain records of these requests. We use technical and campaign information to operate and protect the website, measure traffic and campaign results, and improve the visitor experience.<br><br>Submitting a form does not confirm approval, attendance, sponsorship or a specific meeting.",
      ],
      [
        "Cookies, analytics and advertising tools",
        "The website uses cookies and similar technologies. Google Tag Manager manages measurement tools, including Google Analytics and advertising tags from Meta, LinkedIn and X. Depending on the tools enabled, these services may receive visit, interaction, campaign and conversion information.<br><br>You can manage cookies through your browser and use the privacy or advertising controls offered by those providers. Browser privacy settings or blockers may limit measurement. Embedded YouTube videos and other third-party content may also use their own cookies and process technical information when loaded.",
      ],
      [
        "Access to information and service providers",
        "Access to form details is limited to authorized personnel who manage enquiries and applications. Notifications containing submission details are sent to designated STARTIME business mailboxes.<br><br>We use hosting, email, analytics and advertising service providers to support the website and its campaigns. Their processing and storage locations may differ from yours. Any required disclosure to an authority is handled under applicable requirements. We do not sell form submission details.",
      ],
      [
        "Protection and retention",
        "We use technical and organizational measures to protect information, including HTTPS, restricted CMS access and protected access to form uploads. No website or transmission method can guarantee absolute security.<br><br>We retain information for the purposes described here and for applicable operational or legal requirements, then delete it or make it anonymous when it is no longer needed.",
      ],
      [
        "Your requests and rights",
        "You may contact STARTIME to ask about information relating to you, request access or correction, request deletion where applicable, or withdraw consent where processing relies on consent. We may need to verify your identity before fulfilling a request, and applicable requirements may affect how we respond.<br><br>For privacy enquiries concerning this website, email sim@startime.sa. You can also contact STARTIME at info@startime.sa or call 920010500. Our business address is 3507 Riyadh 12341, Saudi Arabia.",
      ],
      [
        "Other websites and policy updates",
        "Links to social networks, partner websites and other external services take you to websites governed by their own privacy policies. STARTIME may update this policy; the current version and its update date will be shown on this page.",
      ],
    ],
  },
  ar: {
    title: "سياسة الخصوصية",
    summary:
      "سياسة الخصوصية الصادرة عن شركة ستارتايم للفعاليات لموقع الملتقى البحري السعودي الدولي.",
    introduction:
      "هذه السياسة صادرة عن شركة ستارتايم للفعاليات (ستارتايم)، وتتولى الشركة إعدادها وتحديثها لموقع sim.startime.sa الخاص بالملتقى البحري السعودي الدولي. ويُقصد بعبارات «نحن» و«لنا» و«لدينا» في هذه السياسة شركة ستارتايم.",
    updated: "آخر تحديث: 14 أكتوبر 2026",
    sections: [
      [
        "نطاق هذه السياسة",
        "توضح هذه السياسة كيفية تعامل ستارتايم مع المعلومات الشخصية لزوار الموقع والأشخاص الذين يرسلون استفسارات التواصل أو طلبات الرعاية أو طلبات اجتماعات الأعمال الحكومية B2G عبر الموقع. وتسري على النسختين العربية والإنجليزية من sim.startime.sa.",
      ],
      [
        "المعلومات التي نتلقاها",
        "عند إرسال نموذج، نتلقى البيانات التي تدخلها، مثل الاسم والبريد الإلكتروني المهني ورقم الهاتف والجهة والمسمى الوظيفي وتفاصيل الاستفسار أو الطلب. وإذا كان النموذج يتيح إرفاق ملفات، فإننا نتلقى الملفات التي تختار رفعها أيضًا.<br><br>قد يسجل الموقع معلومات تقنية وبيانات عن الزيارة، مثل عنوان بروتوكول الإنترنت (IP) ومعلومات المتصفح والجهاز والصفحات التي تزورها والموقع الذي أحالك إلينا ومعلمات الحملات ومعرّفات الإعلانات. يرجى تجنب إرسال معلومات شخصية حساسة لا يحتاجها طلبك.",
      ],
      [
        "كيف نستخدم المعلومات",
        "نستخدم البيانات المرسلة للرد على الاستفسارات ودراسة طلبات الرعاية وطلبات اجتماعات الأعمال الحكومية B2G وتنسيق المتابعة ذات الصلة والاحتفاظ بسجلات لهذه الطلبات. ونستخدم المعلومات التقنية وبيانات الحملات لتشغيل الموقع وحمايته وقياس الزيارات ونتائج الحملات وتحسين تجربة الزوار.<br><br>إرسال النموذج لا يُعد تأكيدًا للموافقة أو الحضور أو الرعاية أو ترتيب اجتماع محدد.",
      ],
      [
        "ملفات تعريف الارتباط وأدوات التحليل والإعلان",
        "يستخدم الموقع ملفات تعريف الارتباط وتقنيات مشابهة. ويتولى Google Tag Manager إدارة أدوات القياس، بما فيها Google Analytics ووسوم الإعلانات التابعة لـ Meta وLinkedIn وX. وبحسب الأدوات المفعّلة، قد تتلقى هذه الخدمات معلومات عن الزيارات والتفاعل والحملات والتحويلات.<br><br>يمكنك إدارة ملفات تعريف الارتباط من خلال متصفحك واستخدام إعدادات الخصوصية والإعلانات التي توفرها تلك الجهات. وقد تحد إعدادات الخصوصية أو أدوات الحجب في المتصفح من القياس. وقد تستخدم فيديوهات YouTube المضمّنة والمحتويات الخارجية الأخرى ملفات تعريف ارتباط خاصة بها، وتعالج معلومات تقنية عند تحميلها.",
      ],
      [
        "الوصول إلى المعلومات ومزودو الخدمات",
        "يقتصر الوصول إلى تفاصيل النماذج على الأشخاص المخوّلين بإدارة الاستفسارات والطلبات. وتُرسل إشعارات تتضمن تفاصيل الطلب إلى عناوين البريد المهني المخصصة لدى ستارتايم.<br><br>نستعين بمزودي خدمات الاستضافة والبريد الإلكتروني والتحليل والإعلان لدعم الموقع وحملاته. وقد تختلف مواقع معالجة البيانات وتخزينها لدى هؤلاء المزودين عن موقعك. ويُتعامل مع أي إفصاح مطلوب لجهة مختصة وفق المتطلبات المعمول بها. ولا نبيع تفاصيل طلبات النماذج.",
      ],
      [
        "حماية المعلومات والاحتفاظ بها",
        "نستخدم تدابير تقنية وتنظيمية لحماية المعلومات، تشمل اتصال HTTPS وتقييد الوصول إلى نظام إدارة المحتوى وحماية الوصول إلى مرفقات النماذج. ولا يمكن لأي موقع أو وسيلة نقل أن تضمن أمنًا مطلقًا.<br><br>نحتفظ بالمعلومات للأغراض الموضحة هنا وللمتطلبات التشغيلية أو النظامية المعمول بها، ثم نحذفها أو نجعلها مجهولة الهوية عندما لا تعود هناك حاجة إليها.",
      ],
      [
        "طلباتك وحقوقك",
        "يمكنك التواصل مع ستارتايم للاستفسار عن المعلومات المتعلقة بك أو طلب الوصول إليها أو تصحيحها أو طلب حذفها حيثما ينطبق ذلك، أو سحب الموافقة عندما تعتمد المعالجة عليها. وقد نحتاج إلى التحقق من هويتك قبل تنفيذ الطلب، كما قد تؤثر المتطلبات المعمول بها في طريقة الاستجابة.<br><br>لاستفسارات الخصوصية المتعلقة بهذا الموقع، راسل sim@startime.sa. ويمكنك أيضًا التواصل مع ستارتايم عبر info@startime.sa أو الاتصال على 920010500. عنوان الشركة: 3507 الرياض 12341، المملكة العربية السعودية.",
      ],
      [
        "المواقع الأخرى وتحديث السياسة",
        "تنقلك روابط شبكات التواصل ومواقع الشركاء والخدمات الخارجية إلى مواقع تخضع لسياسات خصوصية خاصة بها. وقد تحدّث ستارتايم هذه السياسة؛ وتظهر النسخة الحالية وتاريخ تحديثها في هذه الصفحة.",
      ],
    ],
  },
};

function stable(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(stable);
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([key, item]) => [key, stable(item)]),
    );
  }
  return value;
}

function digest(value: unknown) {
  return createHash("sha256")
    .update(JSON.stringify(stable(value)))
    .digest("hex");
}

function content(page: Page) {
  const { updatedAt: _updatedAt, ...rest } = page;
  void _updatedAt;
  return rest;
}

function withoutIDs(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(withoutIDs);
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value)
        .filter(([key]) => key !== "id")
        .map(([key, item]) => [key, withoutIDs(item)]),
    );
  }
  return value;
}

function sectionsWithPrivacyLink(page: Page, locale: Locale): Page["sections"] {
  return structuredClone(page.sections || []).map((section) => {
    if (section.blockType !== "simfFooter") return section;
    return {
      ...section,
      privacyHref: locale === "ar" ? "/ar/privacy-policy" : "/privacy-policy",
    };
  });
}

try {
  const preservedGlobals = await Promise.all(
    ["site-settings", "marketing-settings"].map(async (name) => {
      const value = await payload.findGlobal({
        slug: name as "site-settings" | "marketing-settings",
        locale: "all",
        depth: 0,
        overrideAccess: true,
      });
      return { name, hash: digest(value) };
    }),
  );
  const mediaBefore = await payload.find({
    collection: "media",
    limit: 10000,
    pagination: false,
    depth: 0,
    locale: "all",
    overrideAccess: true,
  });
  const snapshots: { locale: Locale; published: Page; latest: Page }[] = [];
  for (const locale of locales) {
    const pages = await payload.find({
      collection: "pages",
      depth: 0,
      limit: 1000,
      pagination: false,
      locale,
      fallbackLocale: false,
      draft: false,
      overrideAccess: true,
    });
    for (const published of pages.docs) {
      if (published.slug === slug) continue;
      const latest = await payload.findByID({
        collection: "pages",
        id: published.id,
        locale,
        fallbackLocale: false,
        depth: 0,
        draft: true,
        overrideAccess: true,
      });
      snapshots.push({ locale, published, latest });
    }
  }
  const existing = await payload.find({
    collection: "pages",
    depth: 0,
    locale: "en",
    fallbackLocale: false,
    limit: 1,
    overrideAccess: true,
    where: { slug: { equals: slug } },
  });
  const plannedLinks = snapshots.filter(
    ({ locale, published, latest }) =>
      digest(published.sections) !==
        digest(sectionsWithPrivacyLink(published, locale)) ||
      digest(latest.sections) !==
        digest(sectionsWithPrivacyLink(latest, locale)),
  ).length;
  console.log(
    JSON.stringify({
      apply,
      newPolicyPage: !existing.docs.length,
      localizedFooterRecords: plannedLinks,
    }),
  );
  if (!apply) process.exit(0);

  if (!existing.docs.length) {
    let policyID: number | undefined;
    for (const locale of locales) {
      const home = snapshots.find(
        (item) =>
          item.locale === locale &&
          item.published.pageType === "simf-microsite-home",
      )?.published;
      if (!home)
        throw new Error(
          `Missing ${locale} homepage for current header/footer.`,
        );
      const shell = (withoutIDs(home.sections || []) as Section[]).filter(
        (section) =>
          ["simfHeader", "simfFooter"].includes(String(section.blockType)),
      );
      const footer = shell.find(
        (section) => section.blockType === "simfFooter",
      );
      if (footer)
        footer.privacyHref =
          locale === "ar" ? "/ar/privacy-policy" : "/privacy-policy";
      const text = copy[locale];
      const sections = [
        shell.find((section) => section.blockType === "simfHeader"),
        {
          blockType: "hero",
          anchorID: "page-hero",
          blockName: text.title,
          internalLabel: "Privacy policy introduction",
          visible: true,
          heading: text.title,
          eyebrow:
            locale === "ar"
              ? "شركة ستارتايم للفعاليات"
              : "STARTIME EVENTS COMPANY",
          body: text.introduction,
          note: text.updated,
        },
        ...text.sections.map(([heading, body], index) => ({
          blockType: "mediaFeature",
          anchorID: `privacy-${index + 1}`,
          blockName: heading,
          internalLabel: heading,
          displayOrder: index + 1,
          visible: true,
          heading,
          body,
          theme: "light",
          appearance: { theme: "light", spacing: "compact" },
        })),
        footer,
      ].filter(Boolean) as unknown as Page["sections"];
      const data = {
        internalTitle: "SIM Privacy Policy — STARTIME",
        title: text.title,
        summary: text.summary,
        pageType: "simf-microsite-generic" as const,
        slug,
        visible: true,
        showInNavigation: false,
        _status: "published" as const,
        seo: {
          title:
            locale === "ar"
              ? "سياسة الخصوصية | ستارتايم — الملتقى البحري السعودي الدولي"
              : "Privacy Policy | STARTIME — Saudi International Maritime Forum",
          description: text.summary,
          indexable: true,
          followLinks: true,
          includeInSitemap: true,
          sitemapPriority: 0.3,
        },
        sections,
      };
      if (policyID === undefined) {
        const page = await payload.create({
          collection: "pages",
          locale,
          draft: false,
          overrideAccess: true,
          data,
        });
        policyID = page.id;
      } else {
        await payload.update({
          collection: "pages",
          id: policyID,
          locale,
          draft: false,
          overrideAccess: true,
          data,
        });
      }
    }
    console.log(
      "Created English and Arabic CMS-editable privacy policy. Existing policy pages are never overwritten.",
    );
  }

  for (const { locale, published, latest } of snapshots) {
    const publishedSections = sectionsWithPrivacyLink(published, locale);
    const latestSections = sectionsWithPrivacyLink(latest, locale);
    if (digest(published.sections) !== digest(publishedSections)) {
      await payload.update({
        collection: "pages",
        id: published.id,
        locale,
        draft: false,
        overrideAccess: true,
        data: { sections: publishedSections, _status: published._status },
      });
    }
    if (
      latest._status === "draft" &&
      (digest(latest.sections) !== digest(latestSections) ||
        digest(published.sections) !== digest(publishedSections))
    ) {
      await payload.update({
        collection: "pages",
        id: latest.id,
        locale,
        draft: true,
        overrideAccess: true,
        data: { sections: latestSections, _status: "draft" },
      });
    }
    const afterPublished = await payload.findByID({
      collection: "pages",
      id: published.id,
      locale,
      fallbackLocale: false,
      depth: 0,
      draft: false,
      overrideAccess: true,
    });
    const afterLatest = await payload.findByID({
      collection: "pages",
      id: latest.id,
      locale,
      fallbackLocale: false,
      depth: 0,
      draft: true,
      overrideAccess: true,
    });
    if (
      digest(content(afterPublished)) !==
        digest(content({ ...published, sections: publishedSections })) ||
      digest(content(afterLatest)) !==
        digest(content({ ...latest, sections: latestSections }))
    ) {
      throw new Error(
        `Unexpected content difference for page ${published.id}, locale ${locale}; review before release.`,
      );
    }
  }
  const mediaAfter = await payload.find({
    collection: "media",
    limit: 10000,
    pagination: false,
    depth: 0,
    locale: "all",
    overrideAccess: true,
  });
  if (digest(mediaBefore.docs) !== digest(mediaAfter.docs))
    throw new Error(
      "Media records changed during this operation; review concurrent edits.",
    );
  for (const { name, hash } of preservedGlobals) {
    const value = await payload.findGlobal({
      slug: name as "site-settings" | "marketing-settings",
      locale: "all",
      depth: 0,
      overrideAccess: true,
    });
    if (digest(value) !== hash)
      throw new Error(
        `${name} changed during this operation; review concurrent edits.`,
      );
  }
  console.log(
    `Verified ${snapshots.length} localized existing pages: only footer privacy URLs changed. Media, site settings and marketing settings match their before-operation hashes.`,
  );
} finally {
  await payload.destroy();
}
