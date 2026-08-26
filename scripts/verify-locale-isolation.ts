import configPromise from "@payload-config";
import { getPayload } from "payload";

const payload = await getPayload({ config: configPromise });
let pageID: number | string | undefined;

const englishSections = [
  {
    blockType: "callToAction" as const,
    internalLabel: "English QA section",
    visible: true,
    anchorID: "qa-en",
    displayOrder: 1,
    heading: "English section content",
    buttons: [{ label: "English CTA", href: "/sponsor" }],
  },
];

const arabicSections = [
  {
    blockType: "callToAction" as const,
    internalLabel: "Arabic QA section",
    visible: true,
    anchorID: "qa-ar",
    displayOrder: 1,
    heading: "محتوى القسم العربي",
    buttons: [{ label: "دعوة عربية", href: "/ar/sponsor" }],
  },
];

try {
  const created = await payload.create({
    collection: "pages",
    locale: "en",
    overrideAccess: true,
    data: {
      _status: "published",
      internalTitle: "Temporary locale isolation QA",
      pageType: "simf-microsite-home",
      slug: "qa-locale-isolation-en",
      title: "English original",
      visible: false,
      sections: englishSections,
    },
  });
  pageID = created.id;

  await payload.update({
    collection: "pages",
    id: pageID,
    locale: "ar",
    overrideAccess: true,
    data: {
      _status: "draft",
      slug: "qa-locale-isolation-ar",
      title: "العربية الأصلية",
      visible: false,
      sections: arabicSections,
    },
  });

  await payload.update({
    collection: "pages",
    id: pageID,
    locale: "en",
    overrideAccess: true,
    data: {
      _status: "published",
      title: "English edited",
      sections: [
        {
          ...englishSections[0],
          heading: "English section edited",
        },
      ],
    },
  });

  const afterEnglishEdit = await Promise.all([
    payload.findByID({
      collection: "pages",
      id: pageID,
      locale: "en",
      fallbackLocale: false,
      draft: true,
      overrideAccess: true,
    }),
    payload.findByID({
      collection: "pages",
      id: pageID,
      locale: "ar",
      fallbackLocale: false,
      draft: true,
      overrideAccess: true,
    }),
  ]);

  await payload.update({
    collection: "pages",
    id: pageID,
    locale: "ar",
    overrideAccess: true,
    data: {
      _status: "draft",
      title: "العربية بعد التعديل",
      sections: [
        {
          ...arabicSections[0],
          heading: "محتوى القسم العربي بعد التعديل",
        },
      ],
    },
  });

  const afterArabicEdit = await Promise.all([
    payload.findByID({
      collection: "pages",
      id: pageID,
      locale: "en",
      fallbackLocale: false,
      draft: true,
      overrideAccess: true,
    }),
    payload.findByID({
      collection: "pages",
      id: pageID,
      locale: "ar",
      fallbackLocale: false,
      draft: true,
      overrideAccess: true,
    }),
  ]);

  const heading = (page: (typeof afterEnglishEdit)[number]) =>
    page.sections?.[0] && "heading" in page.sections[0]
      ? page.sections[0].heading
      : null;

  const result = {
    afterArabicEdit: {
      arabic: {
        status: afterArabicEdit[1]._status,
        title: afterArabicEdit[1].title,
        heading: heading(afterArabicEdit[1]),
      },
      english: {
        status: afterArabicEdit[0]._status,
        title: afterArabicEdit[0].title,
        heading: heading(afterArabicEdit[0]),
      },
    },
    afterEnglishEdit: {
      arabic: {
        status: afterEnglishEdit[1]._status,
        title: afterEnglishEdit[1].title,
        heading: heading(afterEnglishEdit[1]),
      },
      english: {
        status: afterEnglishEdit[0]._status,
        title: afterEnglishEdit[0].title,
        heading: heading(afterEnglishEdit[0]),
      },
    },
  };

  const passed =
    result.afterEnglishEdit.english.title === "English edited" &&
    result.afterEnglishEdit.english.heading === "English section edited" &&
    result.afterEnglishEdit.english.status === "published" &&
    result.afterEnglishEdit.arabic.title === "العربية الأصلية" &&
    result.afterEnglishEdit.arabic.heading === "محتوى القسم العربي" &&
    result.afterEnglishEdit.arabic.status === "draft" &&
    result.afterArabicEdit.english.title === "English edited" &&
    result.afterArabicEdit.english.heading === "English section edited" &&
    result.afterArabicEdit.english.status === "published" &&
    result.afterArabicEdit.arabic.title === "العربية بعد التعديل" &&
    result.afterArabicEdit.arabic.heading ===
      "محتوى القسم العربي بعد التعديل" &&
    result.afterArabicEdit.arabic.status === "draft";

  console.log(JSON.stringify({ passed, ...result }, null, 2));
  if (!passed) process.exitCode = 1;
} finally {
  if (pageID !== undefined) {
    await payload.delete({
      collection: "pages",
      id: pageID,
      overrideAccess: true,
    });
  }
}
