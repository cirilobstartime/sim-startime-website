import configPromise from "@payload-config";
import { getPayload } from "payload";

type Locale = "ar" | "en";
type JsonObject = Record<string, unknown>;

const locales: Locale[] = ["en", "ar"];

function objects(value: unknown): JsonObject[] {
  return Array.isArray(value)
    ? value.filter(
        (entry): entry is JsonObject =>
          Boolean(entry) && typeof entry === "object" && !Array.isArray(entry),
      )
    : [];
}

function section(sections: JsonObject[], anchorID: string) {
  const found = sections.find((entry) => entry.anchorID === anchorID);
  if (!found) throw new Error(`Missing B2G section: ${anchorID}`);
  return structuredClone(found);
}

function card(
  source: JsonObject | undefined,
  title: string,
  body: string,
  icon: string,
) {
  return {
    ...(source || {}),
    title,
    body,
    icon,
    visible: true,
  };
}

function updateB2GSections(current: JsonObject[], locale: Locale) {
  const ar = locale === "ar";
  const header = structuredClone(
    current.find((entry) => entry.blockType === "simfHeader") || {},
  );
  const footer = structuredClone(
    current.find((entry) => entry.blockType === "simfFooter") || {},
  );
  const hero = section(current, "page-hero");
  const intro = section(current, "page-introduction");
  const executive = section(current, "executive-track");
  const practical = section(current, "strategic-value");
  const benefits = section(current, "benefits");
  const application = section(current, "application");
  const executiveCards = objects(executive.cards);
  const practicalCards = objects(practical.cards);
  const benefitCards = objects(benefits.cards);

  hero.eyebrow = ar
    ? "فرص اجتماعات الأعمال الحكومية"
    : "B2G Opportunities | SIM 2026";
  hero.heading = ar
    ? "ربط الحلول البحرية المتقدمة بأولويات المستقبل"
    : "Connecting Advanced Maritime Solutions with Future Priorities";
  hero.body = ar
    ? "يوفر مسار اجتماعات الأعمال الحكومية في الملتقى البحري السعودي الدولي 2026 بيئة منظمة تُمكّن الرعاة المشاركين من عقد اجتماعات أعمال مغلقة يتم تنسيقها مسبقًا بين الرعاة أصحاب المصلحة والجهات الحكومية والعسكرية والأمنية ذات العلاقة.\n\nاستعرض قدراتك وحلولك، وتعرف على الأولويات المؤسسية، واستكشف فرصًا عملية للتعاون الاستراتيجي، ومستهدفات التوطين، والتعاقدات، والمشروعات المشتركة."
    : "The B2G Meetings Track at the Saudi International Maritime Forum 2026 provides a structured platform that enables participating Sponsors to engage in pre-arranged private business meetings with relevant government, military, and security entities.\n\nPresent your capabilities and solutions, gain insight into institutional priorities, and explore practical opportunities for strategic cooperation, localization objectives, contracting opportunities, and joint projects.";
  hero.note = null;
  hero.eventDetails = ar
    ? [
        { label: "الزمان", value: "23 - 25 نوفمبر 2026" },
        { label: "المكان", value: "فندق ومركز مؤتمرات سوفيتيل الرياض" },
      ]
    : [
        { label: "Date", value: "23–25 November 2026" },
        { label: "Venue", value: "Sofitel Riyadh Hotel & Convention Center" },
      ];
  hero.buttons = ar
    ? [
        {
          href: "#application",
          label: "أحجز اجتماعاتك",
          style: "primary",
          icon: "arrow-up-right",
          openInNewTab: false,
        },
        {
          href: "#executive-track",
          label: "اكتشف المزيد",
          style: "outline",
          icon: "arrow-up-right",
          openInNewTab: false,
        },
      ]
    : [
        {
          href: "#application",
          label: "Schedule Your Meetings",
          style: "primary",
          icon: "arrow-up-right",
          openInNewTab: false,
        },
        {
          href: "#executive-track",
          label: "Explore the B2G Experience",
          style: "outline",
          icon: "arrow-up-right",
          openInNewTab: false,
        },
      ];
  hero.displayOrder = 10;

  intro.eyebrow = null;
  intro.heading = ar
    ? "مسار تنفيذي مصمم لمشاركة صناع القرار"
    : "A Decision-Maker-Focused Executive Track";
  intro.body = ar
    ? "دفع فرص التعاون وبناء الفرص والشراكات\n\nتم تصميم مسار اجتماعات الأعمال الحكومية لتجمع الرعاة المؤهلين بالجهات الحكومية المعنية ضمن اجتماعات أعمال مغلقة يتم تنسيقها مسبقًا وفق أولويات محددة واهتمامات مشتركة؛ ويوفر للمشاركين فرصة مباشرة لاستعراض الحلول والقدرات، وبناء قنوات تواصل مؤسسية رفيعة المستوى، واستكشاف فرص التعاون والتعاقد، وعقد صفقات ناجحة بما يسهم في تطوير شراكات استراتيجية ومشاريع ذات أثر طويل المدى."
    : "Driving Cooperation and Building Partnerships and Opportunities\n\nThe Business-to-Government Meetings Track has been specifically designed to connect qualified Sponsors with relevant government entities through private, pre-arranged business meetings structured around shared priorities and mutual interests.\n\nThe track provides participants with a direct platform to showcase their capabilities and solutions, establish high-level institutional relationships, and explore opportunities for cooperation, contracting, and strategic partnerships. By facilitating meaningful engagement between stakeholders, it creates an environment where promising opportunities can evolve into successful business agreements, long-term partnerships, and high-impact projects.";
  intro.displayOrder = 20;

  executive.eyebrow = null;
  executive.heading = ar
    ? "مستوى رعاية يركز على الوصول الكامل لصُنّاع القرار"
    : "A Decision-Maker-Focused Executive Track";
  executive.body = null;
  executive.layout = "icons";
  executive.cards = ar
    ? [
        card(
          executiveCards[0],
          "تنسيق احترافي",
          "ننسق الاجتماعات مسبقًا وبعناية وفقًا لرغبات وأهداف الراعي المشارك وأولوياته ومجالات اهتمامه الاستراتيجية",
          "compass",
        ),
        card(
          executiveCards[1],
          "وصول مباشر",
          "نحرص على تمثيل أصحاب المصلحة في تنسيق اجتماعاتهم مع صُنّاع القرار مباشرة",
          "users",
        ),
        card(
          executiveCards[2],
          "تعظيم المنفعة",
          "نساهم في اعداد التقارير والعروض التقديمية بأسلوب استشاري يزيد من فرص التعاقد",
          "handshake",
        ),
        card(
          executiveCards[3],
          "بيئة مهيأة",
          "ننسق لإقامة الاجتماعات في بيئة احترافية منظمة ومهيأة بكامل التجهيزات والخدمات",
          "buildings",
        ),
      ]
    : [
        card(
          executiveCards[0],
          "Professional Coordination",
          "Meetings are carefully pre-arranged in accordance with the participating Sponsor’s objectives, priorities, capabilities, and strategic areas of interest.",
          "compass",
        ),
        card(
          executiveCards[1],
          "Direct Access",
          "We ensure the participation of relevant stakeholders and facilitate direct engagement with decision-makers through targeted and purposeful meetings.",
          "users",
        ),
        card(
          executiveCards[2],
          "Maximizing Value",
          "We support participants in developing presentation materials and engagement approaches through a consultative framework designed to enhance cooperation and contracting opportunities.",
          "handshake",
        ),
        card(
          executiveCards[3],
          "Dedicated Executive Environment",
          "Meetings are hosted within a professional and fully equipped setting, supported by dedicated facilities, hospitality services, and comprehensive logistical arrangements.",
          "buildings",
        ),
      ];
  executive.displayOrder = 30;

  practical.eyebrow = ar
    ? "مسار مصمم لتحقيق نتائج عملية"
    : "BUILT FOR PRACTICAL OUTCOMES";
  practical.heading = ar
    ? "تحويل الحلول المتقدمة إلى فرص استراتيجية"
    : "Turn Technical Capabilities into Strategic Opportunities";
  practical.body = ar
    ? "تتيح اجتماعات الأعمال الحكومية للجهات المشاركة الانتقال من عرض القدرات والإمكانات إلى مناقشة الفرص الفعلية المبنية على الاحتياجات والأولويات، من خلال تهيئة البيئة لعقد اجتماعات خاصة مع الجهات المعنية، واستكشاف فرص التعاون والتوطين والتعاقد والشراكات الاستراتيجية."
    : "B2G Meetings enables participating organizations to move beyond presenting capabilities and solutions to engaging in meaningful discussions focused on real opportunities driven by institutional needs and strategic priorities. Through a structured environment for private meetings with relevant entities, participants can explore opportunities for cooperation, localization, contracting, and strategic partnerships.";
  practical.layout = "icons";
  practical.cards = ar
    ? [
        card(
          practicalCards[0],
          "التعاقد وبناء الصفقات",
          "التعرف على الاحتياجات والأولويات واستكشاف الفرص المحتملة للتعاقد وإغلاق الصفقات",
          "buildings",
        ),
        card(
          practicalCards[1],
          "بناء الشراكات",
          "مناقشة نماذج التعاون المحتملة والشراكات طويلة المدى والمشروعات المتوافقة مع الأولويات",
          "handshake",
        ),
        card(
          practicalCards[2],
          "التوطين وتنمية القدرات",
          "استكشاف فرص نقل المعرفة وتوطين التقنيات وتطوير القدرات الوطنية.",
          "factory",
        ),
        card(
          practicalCards[3],
          "الحلول التطبيقية والتشغيلية",
          "استعراض التقنيات والحلول في سياق الاحتياجات التشغيلية الفعلية ومتطلبات التنفيذ وأولويات التطوير المستقبلية",
          "gear",
        ),
        card(
          practicalCards[4],
          "بناء وتطوير العلاقات الاستراتيجية",
          "بناء وتطوير قنوات تواصل مؤسسية منظمة مع صُنّاع القرار وأصحاب المصلحة من الجهات الحكومية ذات العلاقة",
          "users",
        ),
      ]
    : [
        card(
          practicalCards[0],
          "Contracting and Deal Closing",
          "Identify institutional needs and strategic priorities while exploring potential opportunities for contracting, business development, and successful deal execution.",
          "buildings",
        ),
        card(
          practicalCards[1],
          "Partnership Development",
          "Discuss potential cooperation models, long-term partnerships, and projects aligned with shared priorities and strategic objectives.",
          "handshake",
        ),
        card(
          practicalCards[2],
          "Localization and Capability Development",
          "Explore opportunities for knowledge transfer, technology localization, and the development of national capabilities.",
          "factory",
        ),
        card(
          practicalCards[3],
          "Applied and Operational Solutions",
          "Present technologies and solutions within the context of real operational requirements, implementation needs, and future development priorities.",
          "gear",
        ),
        card(
          practicalCards[4],
          "Building Strategic Relationships",
          "Establish and develop structured institutional engagement channels with decision-makers and key stakeholders from relevant government entities.",
          "users",
        ),
      ];
  practical.displayOrder = 40;

  benefits.eyebrow = ar ? "فرضية القيمة المضافة" : "Added Value Proposition";
  benefits.heading = ar
    ? "مزايا توازن بين الظهور المؤسسي وتحقيق أهداف المشاركة"
    : "Benefits That Balance Institutional Visibility with Participation Objectives";
  benefits.body = null;
  benefits.layout = "tabs";
  benefits.cards = ar
    ? [
        card(
          benefitCards[0],
          "قبل الملتقى",
          "الإعلان الرسمي عن الرعاية عبر حسابات الملتقى على منصتي LinkedIn و X\nإنتاج ونشر فيديو ترحيبي ترويجي مخصص للراعي المشارك.\nإدراج شعار الراعي وتصنيف مشاركته على الموقع الإلكتروني الرسمي للملتقى.\nتخصيص صفحة تعريفية للراعي ضمن قسم الشركاء والرعاة.\nتخصيص صفحتين تحريريتين ضمن التقرير الإعلامي الصادر قبل الملتقى.\nتخصيص مقعد تمثيلي للمشاركة في حفل توقيع عقود الرعاية.\nإبراز شعار الراعي على الشاشة الرئيسية لحفل توقيع عقود الرعاية واللوحات التعريفية والمواد الدعائية المعتمدة الخاصة بالحفل.",
          "none",
        ),
        card(
          benefitCards[1],
          "أثناء الملتقى",
          "إدراج شعار الراعي ضمن برنامج اجتماعات الأعمال الحكومية\nإبراز شعار الراعي وصفة الرعاية على شاشات الملتقى وعبر البث المباشر للجلسات\nإبراز الشعار في منطقة التسجيل وعلى لوحات مختارة داخل موقع الحدث وخلال فترات الاستراحة\nتخصيص صفحة إعلانية واحدة في مجلة الملتقى بنسختيها المطبوعة والإلكترونية\nتخصيص مقعد واحد في الصفوف الأمامية بحفل الافتتاح\nتخصيص خمسة مقاعد إضافية لضيوف الراعي لحضور حفل الافتتاح\nتخصيص دعوتين لحضور حفل العشاء الخارجي لكبار الشخصيات\nتوفير خدمات الاستقبال والمرافقة من وإلى المطار لممثلي الراعي\nتوفير إقامة فندقية خمس نجوم لما يصل إلى ثلاثة ممثلين مشاركين في برنامج الاجتماعات\nوضع أعلام أرضية وأعلام الطاولة التي تحمل هوية الجهة داخل قاعة الاجتماعات\nتكريم الراعي المشارك عقب الاجتماع الرئيس للأعمال\nتوفير خدمات متكاملة للدعم اللوجستي والضيافة والترجمة ودعم الأعمال",
          "none",
        ),
        card(
          benefitCards[2],
          "بعد الملتقى",
          "تخصيص صفحتين إعلانيتين ضمن التقرير الختامي للملتقى\nإدراج شعار الراعي ضمن الفيديو الختامي الرسمي للملتقى\nتزويد الراعي بألبوم صور مطبوع وإلكتروني يوثق مشاركته في الملتقى\nمنح الراعي عشر نسخ مطبوعة فاخرة من التقرير الختامي للملتقى\nتقديم شهادة شكر وتقدير رسمية\nتقديم هدية تذكارية فاخرة ضمن الحقيبة الرسمية للراعي المشارك",
          "none",
        ),
      ]
    : [
        card(
          benefitCards[0],
          "Before the Forum",
          "Official participation announcement across the Forum’s LinkedIn and X accounts\nProduction and publication of a customized promotional welcome video\nInclusion of the organization’s logo and participation designation on the official Forum website\nA dedicated organization profile within the Sponsors and Partners section\nTwo editorial pages within the pre-event media report\nOne representative seat at the sponsorship contract signing ceremony\nLogo visibility across the signing ceremony’s main screen, venue screens, banners, and approved invitation materials",
          "none",
        ),
        card(
          benefitCards[1],
          "During the Forum",
          "Logo inclusion within the B2G Meetings Programme\nLogo and participation designation across selected Forum screens and live session broadcasts\nVisibility within the registration area, selected venue banners, and session break periods\nOne advertising page in the Forum magazine, in printed and electronic formats\nOne VIP seat at the opening ceremony\nFive additional opening-ceremony seats for the organization’s guests\nTwo invitations to the external dinner for VIP guests\nDedicated airport meet-and-greet services for participating representatives\nFive-star accommodation for up to three representatives participating in the meetings programme\nFloor and table flags carrying the organization’s identity inside the meeting room\nOfficial recognition following the principal business meeting\nDedicated logistical, hospitality, interpretation, and business-support services",
          "none",
        ),
        card(
          benefitCards[2],
          "After the Forum",
          "Two advertising pages within the final Forum report\nInclusion of the organization’s logo in the final Forum video\nA printed and electronic photo album documenting the organization’s participation\nTen premium printed copies of the final Forum report\nAn official certificate of appreciation\nA premium commemorative gift within the official participant kit",
          "none",
        ),
      ];
  benefits.displayOrder = 50;

  application.eyebrow = null;
  application.heading = ar
    ? "تواصل مع الفريق الاستشاري"
    : "Contact the Advisory Team";
  application.body = ar
    ? "شاركنا بياناتك الأساسية وأهدافك الأولية من المشاركة، وسيقوم فريقنا الاستشاري بالتواصل معك فورًا"
    : "Share your key details and initial participation objectives, and a member of our advisory team will contact you shortly.";
  application.privacyNote = null;
  application.displayOrder = 60;

  return [
    header,
    hero,
    intro,
    executive,
    practical,
    benefits,
    application,
    footer,
  ];
}

function fields(locale: Locale) {
  const ar = locale === "ar";
  return [
    {
      name: "organizationName",
      label: ar ? "اسم الجهة" : "Organization Name",
      type: "text",
      required: true,
      width: "half",
      autocomplete: "organization",
    },
    {
      name: "fullName",
      label: ar ? "الاسم الكامل" : "Full Name",
      type: "text",
      required: true,
      width: "half",
      autocomplete: "name",
    },
    {
      name: "jobTitle",
      label: ar ? "المسمى الوظيفي" : "Job Title",
      type: "text",
      required: true,
      width: "half",
      autocomplete: "organization-title",
    },
    {
      name: "emailAddress",
      label: ar ? "البريد الإلكتروني" : "Email Address",
      type: "email",
      required: true,
      width: "half",
      autocomplete: "email",
    },
    {
      name: "phoneNumber",
      label: ar ? "رقم الهاتف" : "Phone Number",
      type: "tel",
      required: false,
      width: "half",
      autocomplete: "tel",
    },
    {
      name: "country",
      label: ar ? "الدولة" : "Country",
      type: "text",
      required: true,
      width: "half",
      autocomplete: "country-name",
    },
    {
      name: "participationObjectives",
      label: ar ? "الهدف من المشاركة" : "Participation Objectives",
      type: "textarea",
      required: true,
      width: "full",
      maxLength: 1500,
    },
    {
      name: "consent",
      label: ar
        ? "أوافق على أن يقوم فريق الملتقى SIM 2026 بالتواصل معي بشأن مناقشة فرص المشاركة"
        : "I agree to be contacted by the SIM 2026 Forum team regarding participation opportunities.",
      type: "checkbox",
      required: true,
      width: "full",
    },
    {
      name: "acknowledgement",
      label: ar
        ? "أقر بأنني على علم بأن إرسال هذا النموذج لا يعني تأكيد قبول المشاركة ولا ينشئ أي إلتزام على المنظم أو الفريق الاستشاري"
        : "I acknowledge that submitting this form does not constitute confirmation of participation and does not create any obligation on the Organizer or the Advisory Team.",
      type: "checkbox",
      required: true,
      width: "full",
    },
  ];
}

const payload = await getPayload({ config: configPromise });
const page = await payload.find({
  collection: "pages",
  depth: 0,
  fallbackLocale: false,
  limit: 1,
  locale: "en",
  overrideAccess: true,
  where: { slug: { equals: "simf-microsite/government-b2g" } },
});
if (!page.docs[0]) throw new Error("Local B2G page was not found.");
const form = await payload.find({
  collection: "forms",
  depth: 0,
  fallbackLocale: false,
  limit: 1,
  locale: "en",
  overrideAccess: true,
  where: { formKey: { equals: "simf-b2g-application" } },
});
if (!form.docs[0]) throw new Error("Local B2G form was not found.");

for (const locale of locales) {
  const localized = await payload.find({
    collection: "pages",
    depth: 0,
    fallbackLocale: false,
    limit: 1,
    locale,
    overrideAccess: true,
    where: { id: { equals: page.docs[0].id } },
  });
  const current = localized.docs[0] as unknown as JsonObject;
  await payload.update({
    collection: "pages",
    id: page.docs[0].id,
    locale,
    draft: false,
    overrideAccess: true,
    data: {
      sections: updateB2GSections(objects(current.sections), locale),
    } as never,
  });
  await payload.update({
    collection: "forms",
    id: form.docs[0].id,
    locale,
    draft: false,
    overrideAccess: true,
    data: {
      submitLabel:
        locale === "ar"
          ? "ارسل للفريق الاستشاري"
          : "Submit to the Advisory Team",
      consentLabel: null,
      fields: fields(locale),
    } as never,
  });
}

console.log(
  "B2G English and Arabic content now matches the supplied client document.",
);
