import configPromise from "@payload-config";
import { getPayload } from "payload";

type JsonRecord = Record<string, unknown>;

const apply = process.env.APPLY_APPROVED_COPY_FIXES === "1";
const changes: string[] = [];
const payload = await getPayload({ config: configPromise });

function records(value: unknown): JsonRecord[] {
  return Array.isArray(value) ? (value as JsonRecord[]) : [];
}

function setValue(record: JsonRecord, key: string, value: unknown, label: string) {
  if (record[key] === value) return;
  record[key] = value;
  changes.push(label);
}

async function localizedPage(pageType: string) {
  const result = await payload.find({
    collection: "pages",
    depth: 0,
    limit: 1,
    locale: "ar",
    overrideAccess: true,
    where: { pageType: { equals: pageType } },
  });
  const page = result.docs[0] as unknown as JsonRecord | undefined;
  if (!page) throw new Error(`Missing Arabic page: ${pageType}`);
  return page;
}

try {
  const forms = await payload.find({
    collection: "forms",
    depth: 0,
    limit: 1,
    locale: "ar",
    overrideAccess: true,
    where: { formKey: { equals: "simf-contact" } },
  });
  const contactForm = forms.docs[0] as unknown as JsonRecord | undefined;
  if (!contactForm) throw new Error("Missing Arabic contact form");
  const contactFields = structuredClone(records(contactForm.fields));
  for (const field of contactFields) {
    if (field.name === "message") {
      setValue(
        field,
        "label",
        "كيف يمكن لفريق الملتقى البحري السعودي الدولي الرابع مساعدتك؟",
        "Arabic contact message label",
      );
    }
    if (field.name === "consent") {
      setValue(
        field,
        "label",
        "أوافق على أن يقوم فريق تنظيم الملتقى بالتواصل معي.",
        "Arabic contact consent label",
      );
    }
  }
  if (apply && changes.length) {
    await payload.update({
      collection: "forms",
      data: { fields: contactFields } as never,
      id: contactForm.id as number | string,
      locale: "ar",
      overrideAccess: true,
    });
  }

  const contactPage = await localizedPage("simf-microsite-contact");
  const contactSections = structuredClone(records(contactPage.sections));
  const contactChangeStart = changes.length;
  for (const section of contactSections) {
    if (section.blockType === "formSection") {
      setValue(section, "privacyNote", null, "Arabic contact duplicate privacy note");
    }
  }
  if (apply && changes.length > contactChangeStart) {
    await payload.update({
      collection: "pages",
      data: { sections: contactSections } as never,
      draft: false,
      id: contactPage.id as number | string,
      locale: "ar",
      overrideAccess: true,
    });
  }

  const homePage = await localizedPage("simf-microsite-home");
  const homeSections = structuredClone(records(homePage.sections));
  const homeChangeStart = changes.length;
  const homeSpeakers: Record<string, { body: string; eyebrow: string; title: string }> = {
    "Speaker 01": {
      body: "رئيس هيئة الأركان العامة",
      eyebrow: "معالي الفريق أول الركن",
      title: "فياض بن حامد الرويلي",
    },
    "Speaker 02": {
      body: "نائب رئيس هيئة الأركان العامة",
      eyebrow: "معالي الفريق الركن",
      title: "فهد بن عبدالله الغفيلي",
    },
    "Speaker 03": {
      body: "رئيس أركان القوات البحرية الملكية السعودية",
      eyebrow: "معالي الفريق الركن",
      title: "محمد بن عبدالرحمن الغريبي",
    },
  };
  for (const section of homeSections) {
    if (section.anchorID !== "speakers") continue;
    for (const card of records(section.cards)) {
      const approved = homeSpeakers[String(card.internalLabel || "")];
      if (!approved) continue;
      setValue(card, "eyebrow", approved.eyebrow, `${card.internalLabel} rank`);
      setValue(card, "title", approved.title, `${card.internalLabel} name`);
      setValue(card, "body", approved.body, `${card.internalLabel} role`);
      setValue(card, "workplace", null, `${card.internalLabel} organization line`);
    }
  }
  if (apply && changes.length > homeChangeStart) {
    await payload.update({
      collection: "pages",
      data: { sections: homeSections } as never,
      draft: false,
      id: homePage.id as number | string,
      locale: "ar",
      overrideAccess: true,
    });
  }

  const speakersPage = await localizedPage("simf-microsite-speakers");
  const speakerSections = structuredClone(records(speakersPage.sections));
  const speakerChangeStart = changes.length;
  const directorySpeakers = [
    {
      name: "معالي الفريق أول الركن فياض بن حامد الرويلي",
      role: "رئيس هيئة الأركان العامة",
    },
    {
      name: "معالي الفريق الركن فهد بن عبدالله الغفيلي",
      role: "نائب رئيس هيئة الأركان العامة",
    },
    {
      name: "معالي الفريق الركن محمد بن عبدالرحمن الغريبي",
      role: "رئيس أركان القوات البحرية الملكية السعودية",
    },
  ];
  for (const section of speakerSections) {
    if (section.blockType !== "speakerDirectory") continue;
    const speakers = records(section.speakers);
    for (const [index, speaker] of speakers.entries()) {
      const approved = directorySpeakers[index];
      if (!approved) continue;
      setValue(speaker, "name", approved.name, `Speaker directory ${index + 1} name`);
      setValue(speaker, "role", approved.role, `Speaker directory ${index + 1} role`);
      setValue(speaker, "workplace", null, `Speaker directory ${index + 1} organization`);
    }
  }
  if (apply && changes.length > speakerChangeStart) {
    await payload.update({
      collection: "pages",
      data: { sections: speakerSections } as never,
      draft: false,
      id: speakersPage.id as number | string,
      locale: "ar",
      overrideAccess: true,
    });
  }

  console.log(
    JSON.stringify(
      {
        applied: apply,
        changeCount: changes.length,
        changes,
      },
      null,
      2,
    ),
  );
} finally {
  await payload.destroy();
}
