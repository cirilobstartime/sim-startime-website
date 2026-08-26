import type {
  CardGridSection,
  CountdownSection,
  FormDefinition,
  LegacySection,
  Locale,
  MetricRailSection,
  PageSection,
  PublicPage,
  SimfFooterSection,
  SimfHeaderSection,
} from "./types";

const assetRoot = "/assets/simf-microsite";

export function simfHeaderSection(
  locale: Locale,
  context: "landing" | "sponsor" | "updates" | "content" = "landing",
): SimfHeaderSection {
  const ar = locale === "ar";
  const root = ar ? "/ar" : "";
  const landingLinks = [
    { href: root || "/", label: ar ? "الرئيسية" : "Home" },
    { href: `${root}/legacy`, label: ar ? "نسخ سابقة" : "Legacy" },
    { href: `${root}/programme`, label: ar ? "البرنامج" : "Programme" },
    { href: `${root}/speakers`, label: ar ? "المتحدثون" : "Speakers" },
    {
      href: `${root}/b2g`,
      label: "B2G",
    },
    { href: `${root}/sponsor`, label: ar ? "الرعاية" : "Sponsorship" },
    { href: `${root}/partners`, label: ar ? "الشركاء" : "Partners" },
  ];
  const internalLinks = [
    { href: root || "/", label: ar ? "الرئيسية" : "Home" },
    { href: `${root}/programme`, label: ar ? "البرنامج" : "Programme" },
    { href: `${root}/speakers`, label: ar ? "المتحدثون" : "Speakers" },
    { href: `${root}/partners`, label: ar ? "الرعاة والشركاء" : "Sponsors & Partners" },
    { href: `${root}/b2g`, label: ar ? "فرص B2G" : "B2G Opportunities" },
    { href: `${root}/legacy`, label: ar ? "نسخ سابقة" : "Legacy" },
    { href: `${root}/updates`, label: ar ? "الأخبار والمركز الإعلامي" : "News & Media Center" },
    { href: `${root}/contact`, label: ar ? "تواصل معنا" : "Contact" },
  ];
  return {
    anchorID: "header",
    blockType: "simfHeader",
    displayOrder: 0,
    internalLabel: "SIMF global header",
    visible: true,
    logo:
      context === "landing"
        ? "/assets/simf/simf-logo.webp"
        : `${assetRoot}/organizers/simf-mark.webp`,
    logoAlt: ar ? "الملتقى البحري السعودي الدولي" : "Saudi International Maritime Forum",
    navigationLabel: ar ? "التنقل الرئيسي" : "Main navigation",
    links: context === "landing" ? landingLinks : internalLinks,
    sponsorLabel: ar ? "كن راعيًا" : "Become a Sponsor",
    sponsorHref: `${root}/sponsor`,
    languageSwitchLabel: ar ? "التبديل إلى الإنجليزية" : "Switch to Arabic",
    menuOpenLabel: ar ? "فتح القائمة" : "Open menu",
    menuCloseLabel: ar ? "إغلاق القائمة" : "Close menu",
  };
}

type LocalizedSpeaker = {
  country: string;
  image: string;
  name: string;
  title: string;
  workplace?: string | null;
};

const englishSpeakers: LocalizedSpeaker[] = [
  {
    country: "Saudi Arabia",
    image:
      "01-his-excellency-general-fayyadh-bin-hamed-al-ruwaili.webp",
    name: "His Excellency General Fayyadh bin Hamed Al-Ruwaili",
    title: "Chief of the General Staff",
    workplace: "Saudi Armed Forces",
  },
  {
    country: "Saudi Arabia",
    image:
      "02-his-excellency-lieutenant-general-fahd-bin-abdullah-al-ghofaily.webp",
    name: "His Excellency Lieutenant General Fahd bin Abdullah Al-Ghofaily",
    title: "Vice Chief of the General Staff",
    workplace: "Saudi Armed Forces",
  },
  {
    country: "Saudi Arabia",
    image:
      "03-his-excellency-lieutenant-general-mohammed-bin-abdulrahman-al-gharibi.webp",
    name: "His Excellency Lieutenant General Mohammed bin Abdulrahman Al-Gharibi",
    title: "Chief of Staff",
    workplace: "Royal Saudi Naval Forces",
  },
  {
    country: "Poland",
    image: "04-rear-admiral-prof-tomasz-ryszard-szubrycht.webp",
    name: "Rear Admiral Prof. Tomasz Ryszard Szubrycht",
    title: "Commandant, Polish Naval Academy",
  },
  {
    country: "Switzerland",
    image: "05-dr-christina-schori-liang.webp",
    name: "Dr. Christina Schori Liang",
    title:
      "Expert in Terrorism, Extremism and Maritime Security, Geneva Centre for Security Policy",
  },
  {
    country: "Japan",
    image: "06-dr-sugio-takahashi.webp",
    name: "Dr. Sugio Takahashi",
    title:
      "Expert in Defense and Security Strategies, National Institute for Defense Studies",
  },
  {
    country: "Saudi Arabia",
    image: "07-major-general-fahad-hamad-al-otaibi.webp",
    name: "Major General Fahad Hamad Al-Otaibi",
    title:
      "Chief Executive Officer, Center for Defense Strategic Studies and Research",
  },
  {
    country: "India",
    image: "08-captain-ret-dr-gurpreet-s-khurana.webp",
    name: "Captain (Ret.) Dr. Gurpreet S. Khurana",
    title: "Expert in Maritime Security in the Indian Ocean and Indo-Pacific",
  },
  {
    country: "United Kingdom",
    image: "09-prof-zaili-yang.webp",
    name: "Prof. Zaili Yang",
    title:
      "Expert in Maritime Risk and Transport Systems, Liverpool John Moores University",
  },
  {
    country: "United Kingdom",
    image: "10-dr-alessio-patalano.webp",
    name: "Dr. Alessio Patalano",
    title: "Expert in Maritime Strategy, King's College London",
  },
  {
    country: "Saudi Arabia",
    image: "11-dr-ihsan-mohammed-bu-haliqa.webp",
    name: "Dr. Ihsan Mohammed Bu Haliqa",
    title: "President, Jawatha Consulting Center",
  },
  {
    country: "Saudi Arabia",
    image: "12-dr-faisal-al-saaq.webp",
    name: "Dr. Faisal Al-Saaq",
    title:
      "Dean of the Faculty of Maritime Studies, King Abdulaziz University",
  },
  {
    country: "India",
    image: "13-prof-sanjay-chaturvedi.webp",
    name: "Prof. Sanjay Chaturvedi",
    title:
      "Expert in International Relations in Maritime Security, South Asian University",
  },
  {
    country: "Bahrain",
    image: "14-mr-abdulrahman-ibrahim-al-fuzai.webp",
    name: "Mr. Abdulrahman Ibrahim Al-Fuzai",
    title:
      "Expert Researcher, Bahrain Center for Strategic, International and Energy Studies",
  },
  {
    country: "United Kingdom",
    image: "15-commodore-ret-john-aitken.webp",
    name: "Commodore (Ret.) John Aitken",
    title:
      "Expert in Seabed Security and Critical Subsea Infrastructure, RAND",
  },
  {
    country: "New Zealand",
    image: "16-mike-constable.webp",
    name: "Mike Constable",
    title: "President, Infra Analytics, Singapore",
  },
  {
    country: "Saudi Arabia",
    image: "17-prof-tareq-yousef-al-naffouri.webp",
    name: "Prof. Tareq Yousef Al-Naffouri",
    title:
      "Expert in Maritime Communications and Sensor Research, King Abdullah University of Science and Technology",
  },
  {
    country: "Türkiye",
    image: "18-dr-yasir-atalan.webp",
    name: "Dr. Yasir Atalan",
    title:
      "Researcher in Global Technology Security, Center for Strategic and International Studies",
  },
  {
    country: "Pakistan",
    image: "19-assoc-prof-kashif-naseer-qureshi.webp",
    name: "Assoc. Prof. Kashif Naseer Qureshi",
    title:
      "Researcher in Cybersecurity, Communications and Artificial Intelligence, University of Limerick",
  },
  {
    country: "Greece",
    image: "20-prof-dr-marios-panagiotis-efthymiopoulos.webp",
    name: "Prof. Dr. Marios Panagiotis Efthymiopoulos",
    title:
      "Expert in International Security and Geopolitical Studies, Vytautas Magnus University",
  },
  {
    country: "United States",
    image: "21-prof-gary-corn.webp",
    name: "Prof. Gary Corn",
    title:
      "Expert in Military Cyber Law and Cyber Strategy, Washington College of Law",
  },
  {
    country: "United Kingdom",
    image: "22-prof-sadie-creese.webp",
    name: "Prof. Sadie Creese",
    title:
      "Professor of Cybersecurity and Director, Global Cyber Security Capacity Centre, University of Oxford",
  },
  {
    country: "Saudi Arabia",
    image: "23-dr-omaimah-bint-omar-bamasq.webp",
    name: "Dr. Omaimah bint Omar Bamasq",
    title:
      "Cybersecurity Expert and Empowerment Leader, Transport General Authority",
  },
  {
    country: "Türkiye",
    image: "24-dr-mursel-dogrul.webp",
    name: "Dr. Mürsel Doğrul",
    title: "Associate Professor, Turkish National Defence University",
  },
  {
    country: "Canada",
    image: "25-dr-ibrahim-tariq-javed.webp",
    name: "Dr. Ibrahim Tariq Javed",
    title:
      "Researcher in Cybersecurity and Emerging Technologies, University of the Fraser Valley",
  },
  {
    country: "Saudi Arabia",
    image: "26-dr-basma-al-buhairan.webp",
    name: "Dr. Basma Al-Buhairan",
    title:
      "Innovation Leader and Research Advisor, King Abdulaziz City for Science and Technology",
  },
  {
    country: "Singapore",
    image: "27-prof-lam-kwok-yan.webp",
    name: "Prof. Lam Kwok Yan",
    title:
      "Expert in Artificial Intelligence and Emerging Maritime Technologies, Nanyang Technological University",
  },
  {
    country: "Canada",
    image: "28-prof-mohamed-slim-alouini.webp",
    name: "Prof. Mohamed-Slim Alouini",
    title:
      "Expert in Maritime and Space Wireless Communications, King Abdullah University of Science and Technology",
  },
];

const arabicSpeakers: LocalizedSpeaker[] = [
  ["السعودية", "معالي الفريق الأول الركن فياض بن حامد الرويلي", "رئيس هيئة الأركان العامة", "القوات المسلحة السعودية"],
  ["السعودية", "معالي الفريق الركن فهد بن عبدالله الغفيلي", "نائب رئيس هيئة الأركان العامة", "القوات المسلحة السعودية"],
  ["السعودية", "معالي الفريق الركن محمد بن عبدالرحمن الغريبي", "رئيس الأركان", "القوات البحرية الملكية السعودية"],
  ["بولندا", "اللواء البحري البروفيسور توماش ريزارد شوبريخت", "قائد الأكاديمية البحرية البولندية"],
  ["سويسرا", "د. كريستينا شوري ليانغ", "خبيرة في شؤون الإرهاب والتطرف والأمن البحري، مركز جنيف للسياسات الأمنية"],
  ["اليابان", "د. سوجيو تاكاهاشي", "خبير الاستراتيجيات الدفاعية والأمنية، المعهد الوطني للدراسات الدفاعية"],
  ["السعودية", "اللواء الركن فهد حمد العتيبي", "الرئيس التنفيذي لمركز الدراسات والبحوث الاستراتيجية الدفاعية"],
  ["الهند", "العقيد البحري المتقاعد د. جوربريت إس. كورانا", "خبير الأمن البحري في المحيط الهندي والهادئ"],
  ["المملكة المتحدة", "البروفيسور زايلي يانغ", "خبير المخاطر البحرية وأنظمة النقل، جامعة ليفربول جون موريس"],
  ["المملكة المتحدة", "د. أليسيو باتالانو", "خبير الاستراتيجيات البحرية، كينغز كوليدج لندن"],
  ["السعودية", "د. إحسان محمد بوحليقة", "رئيس مركز جواثا الاستشاري"],
  ["السعودية", "د. فيصل الصعاق", "عميد كلية الدراسات البحرية، جامعة الملك عبدالعزيز"],
  ["الهند", "البروفيسور سانجاي تشاتورفيدي", "خبير العلاقات الدولية في مجال الأمن البحري، جامعة جنوب آسيا"],
  ["البحرين", "الأستاذ عبدالرحمن إبراهيم الفزيع", "باحث خبير، مركز البحرين للدراسات الاستراتيجية والدولية والطاقة"],
  ["المملكة المتحدة", "العميد البحري جون أيتكن", "خبير في أمن قاع البحار والبنية الحساسة تحت البحر، مركز راند للأبحاث"],
  ["نيوزيلندا", "مايك كونستابل", "رئيس شركة إنفرا أناليتكس، سنغافورة"],
  ["السعودية", "البروفيسور طارق يوسف النافوري", "خبير أبحاث الاتصالات البحرية والمستشعرات، جامعة الملك عبدالله للعلوم والتقنية"],
  ["تركيا", "د. ياسر عطلان", "باحث في الأمن التقني العالمي، مركز الدراسات الاستراتيجية والدولية"],
  ["باكستان", "د. كاشف ناصر", "باحث في الأمن السيبراني والاتصالات والذكاء الاصطناعي، جامعة ليمريك"],
  ["اليونان", "د. ماريوس بانقيوتيس", "خبير في الأمن الدولي والدراسات الجيوسياسية، جامعة فيتاوتاس مانيوس"],
  ["الولايات المتحدة", "البروفيسور غاري كورن", "خبير قانون الحروب السيبرانية العسكرية والاستراتيجيات السيبرانية، كلية واشنطن للقانون"],
  ["المملكة المتحدة", "البروفيسورة سادي كريز", "أستاذة الأمن السيبراني ومديرة المركز العالمي لبناء القدرات في الأمن السيبراني، جامعة أكسفورد"],
  ["السعودية", "د. أميمة بنت عمر بامسق", "خبيرة الأمن السيبراني وقائدة التمكين، الهيئة العامة للنقل"],
  ["تركيا", "البروفيسور دوغرول مورسيل", "أستاذ مشارك، جامعة الدفاع الوطنية التركية"],
  ["كندا", "د. إبراهيم طارق جافد", "باحث في الأمن السيبراني والتقنيات الحديثة، جامعة فريزر فالي"],
  ["السعودية", "د. بسمة البحيران", "قائدة في الابتكار ومستشارة أبحاث، مدينة الملك عبدالعزيز للعلوم والتقنية"],
  ["سنغافورة", "البروفيسور لام كوك يان", "خبير الذكاء الاصطناعي والتقنيات الحديثة في المجال البحري، جامعة نانيانغ التكنولوجية"],
  ["كندا", "البروفيسور محمد سليم العويني", "خبير أبحاث الاتصالات اللاسلكية البحرية والفضائية، جامعة الملك عبدالله للعلوم والتقنية"],
].map(([country, name, title, workplace], index) => ({
  country,
  image: englishSpeakers[index].image,
  name,
  title,
  workplace: workplace || null,
}));

function splitSpeakerCredentials(value: string) {
  const separator = Math.max(value.lastIndexOf(","), value.lastIndexOf("،"));
  if (separator < 0) {
    return { role: value.trim(), workplace: null };
  }
  return {
    role: value.slice(0, separator).trim(),
    workplace: value.slice(separator + 1).trim(),
  };
}

export function speakerSection(locale: Locale): CardGridSection {
  const ar = locale === "ar";
  const speakers = ar ? arabicSpeakers : englishSpeakers;
  return {
    anchorID: "speakers",
    blockType: "cardGrid",
    displayOrder: 50,
    internalLabel: "SIMF confirmed speakers and VIP participants",
    visible: true,
    eyebrow: ar ? "المشاركون والمتحدثون" : "SPEAKERS & PARTICIPANTS",
    heading: ar
      ? "قادة وصنّاع قرار وخبراء دوليون"
      : "Commanders, Decision-Makers and Global Experts",
    body: null,
    layout: "swiper",
    cards: speakers.map((speaker, index) => {
      const credentials = splitSpeakerCredentials(speaker.title);
      return {
        internalLabel: `Speaker ${String(index + 1).padStart(2, "0")}`,
        visible: true,
        eyebrow: index < 3 ? (ar ? "قيادة عليا" : "SENIOR LEADERSHIP") : null,
        title: speaker.name,
        body: credentials.role,
        workplace: speaker.workplace || credentials.workplace,
        country: speaker.country,
        meta: speaker.country,
        media: `${assetRoot}/speakers/${speaker.image}`,
      };
    }),
  };
}

const partnerAssets = [
  {
    href: "https://startime.sa/",
    image: "startime-licensed.webp",
    name: "Startime Ultimate Impact",
    roleAr: "الجهة المرخّص لها",
    roleEn: "Licensed to",
  },
  {
    href: "https://www.gami.gov.sa/en",
    image: "gami.webp",
    name: "General Authority for Military Industries",
    roleAr: "الشريك الاستراتيجي",
    roleEn: "Strategic Partner",
  },
  {
    href: "https://www.navantia.es/en/",
    image: "navantia.webp",
    name: "Navantia",
    roleAr: "راعٍ ذهبي",
    roleEn: "Gold Sponsor",
  },
  {
    href:
      "https://www.fincantieri.com/en/group/company/subsidiaries-and-associates/Fincantieri-Arabia-for-Naval-Services",
    image: "fincantieri-arabia.webp",
    name: "Fincantieri Arabia",
    roleAr: "راعٍ ذهبي",
    roleEn: "Gold Sponsor",
  },
  {
    href: "https://www.unmannedsystemstechnology.com/",
    image: "unmanned-systems-technology.webp",
    name: "Unmanned Systems Technology",
    roleAr: "شريك إعلامي",
    roleEn: "Media Partner",
  },
  {
    href: "https://www.defenseadvancement.com/",
    image: "defense-advancement.webp",
    name: "Defense Advancement",
    roleAr: "شريك إعلامي",
    roleEn: "Media Partner",
  },
  {
    href: "https://www.oceansciencetechnology.com/",
    image: "ocean-science-technology.webp",
    name: "Ocean Science and Technology",
    roleAr: "شريك إعلامي",
    roleEn: "Media Partner",
  },
  {
    href: "",
    image: "impact-event-production.webp",
    name: "Impact Event Production",
    roleAr: "المقاول الرسمي",
    roleEn: "Official Contractor",
  },
  {
    href: "",
    image: "united-advisory-chamber.svg",
    name: "United Advisory Chamber",
    roleAr: "مستشار إدارة الحدث",
    roleEn: "Event Management Consultant",
  },
];

export function partnerSection(locale: Locale): CardGridSection {
  const ar = locale === "ar";
  return {
    anchorID: "partners",
    blockType: "cardGrid",
    displayOrder: 60,
    internalLabel: "SIMF partners, sponsors and delivery partners",
    visible: true,
    eyebrow: ar ? "الشركاء والرعاة" : "PARTNERS & SPONSORS",
    heading: ar
      ? "شركاء يدفعون مستقبل الأمن البحري"
      : "Partners Advancing Maritime Security",
    body: ar
      ? "يحظى الملتقى بدعم ومشاركة جهات حكومية ومؤسسات وطنية ودولية تسهم بخبراتها في تعزيز حضور المملكة ضمن منظومة الأمن البحري العالمي، وتؤكد أهمية العمل المشترك لمواكبة التحولات المتسارعة في هذا القطاع الحيوي."
      : "The forum is supported by leading government, national and international organizations whose expertise reinforces Saudi Arabia’s role in global maritime security and highlights the importance of joint action in a rapidly evolving sector.",
    layout: "columns",
    cards: partnerAssets.map((partner) => ({
      internalLabel: partner.name,
      visible: true,
      title: partner.name,
      meta: ar ? partner.roleAr : partner.roleEn,
      media: `${assetRoot}/partners/${partner.image}`,
      button: partner.href
        ? {
            href: partner.href,
            label: ar ? "زيارة الموقع" : "Visit website",
            openInNewTab: true,
            style: "text",
          }
        : undefined,
    })),
  };
}

export const simfSponsorForm: FormDefinition = {
  active: true,
  conversionCurrency: "SAR",
  conversionValue: 0,
  formKey: "simf-microsite-sponsorship",
  id: "simf-microsite-sponsorship",
  submitLabel: "Request Sponsorship Consultation",
  fields: [
    { label: "Organization name", name: "organization", required: true, type: "text", width: "half", autocomplete: "organization", maxLength: 200 },
    { label: "Full name", name: "fullName", required: true, type: "text", width: "half", autocomplete: "name", maxLength: 150 },
    { label: "Job title", name: "jobTitle", required: true, type: "text", width: "half", autocomplete: "organization-title", maxLength: 150 },
    { label: "Work email", name: "workEmail", required: true, type: "email", width: "half", autocomplete: "email", maxLength: 200 },
    { label: "Phone number", name: "phone", type: "tel", width: "half", autocomplete: "tel", maxLength: 50 },
    { label: "Country", name: "country", required: true, type: "text", width: "half", autocomplete: "country-name", maxLength: 100 },
    {
      label: "Sponsorship interest",
      name: "preferredCategory",
      required: true,
      type: "select",
      width: "full",
      options: [
        { label: "Not sure — recommend the right route", value: "not-sure" },
        ..."Strategic,Sector,Diamond,Platinum,Gold,Silver,Co Sponsor,Official Carrier,Hospitality"
          .split(",")
          .map((label) => ({
            label,
            value: label.toLowerCase().replaceAll(" ", "-"),
          })),
      ],
    },
    { label: "What would you like to achieve through SIM 2026?", name: "primaryObjective", required: true, type: "textarea", width: "full", maxLength: 1000 },
    {
      label:
        "I agree that the SIM 2026 sponsorship team may contact me about relevant opportunities and next steps.",
      name: "consent",
      required: true,
      type: "checkbox",
      width: "full",
    },
  ],
};

function localizedSponsorForm(locale: Locale): FormDefinition {
  if (locale === "en") return simfSponsorForm;
  return {
    ...simfSponsorForm,
    submitLabel: "طلب التواصل بشأن الرعاية",
    fields: simfSponsorForm.fields?.map((field) => {
      const labels: Record<string, string> = {
        organization: "اسم الجهة",
        website: "الموقع الإلكتروني للجهة",
        headquartersCountry: "دولة المقر الرئيسي",
        operatingCountries: "الدول الرئيسية التي تعمل فيها الجهة",
        industry: "القطاع والمجال",
        organizationOverview: "نبذة عن الجهة",
        capabilities: "المنتجات أو الخدمات أو القدرات ذات الصلة",
        fullName: "الاسم الكامل",
        jobTitle: "المسمى الوظيفي",
        department: "الإدارة",
        workEmail: "البريد الإلكتروني للعمل",
        phone: "رقم الهاتف",
        country: "الدولة",
        preferredCategory: "فئة الرعاية المفضلة",
        alternativeCategory: "الفئة البديلة",
        primaryObjective: "ما الذي ترغب في تحقيقه من خلال ملتقى 2026؟",
        secondaryObjective: "هدف الرعاية الثانوي",
        interestB2G: "الاهتمام باجتماعات الأعمال الحكومية",
        governmentInterests: "القطاعات أو الجهات الحكومية ذات الصلة",
        exhibitionRequirements: "متطلبات مساحة المعرض",
        programmeMediaInterest: "الاهتمام بالمشاركة في البرنامج أو الإعلام",
        regionalPresence: "الحضور الحالي في السعودية أو دول مجلس التعاون",
        saudiPartnerships: "الشراكات أو المشاريع الحالية في السعودية",
        localizationObjectives: "أهداف التوطين أو تطوير السوق",
        previousParticipation: "مشاركات سابقة في رعاية أو معارض",
        additionalInformation: "معلومات أو متطلبات إضافية",
        consent:
          "أوافق على تواصل فريق رعاية ملتقى 2026 معي بشأن الفرص المناسبة والخطوات التالية.",
      };
      return {
        ...field,
        groupHeading:
          field.groupHeading === "Organization Information"
            ? "بيانات الجهة"
            : field.groupHeading === "Primary Contact"
              ? "بيانات مسؤول التواصل"
              : field.groupHeading === "Sponsorship Interest"
                ? "اهتمامات الرعاية"
                : field.groupHeading === "Strategic Context"
                  ? "السياق الاستراتيجي"
                  : field.groupHeading === "Consent and Submission"
                    ? "الموافقة والإرسال"
                    : field.groupHeading,
        label: labels[field.name] || field.label,
        options:
          field.name === "preferredCategory"
            ? [
                ["لست متأكداً — اقترحوا المسار الأنسب", "not-sure"],
                ["الراعي الاستراتيجي", "strategic"],
                ["راعي القطاع", "sector"],
                ["الراعي الماسي", "diamond"],
                ["الراعي البلاتيني", "platinum"],
                ["الراعي الذهبي", "gold"],
                ["الراعي الفضي", "silver"],
                ["الراعي المشارك", "co-sponsor"],
                ["الناقل الرسمي", "official-carrier"],
                ["راعي الضيافة", "hospitality"],
              ].map(([label, value]) => ({ label, value }))
            : field.options,
        placeholder: undefined,
      };
    }),
  };
}

function landingSections(locale: Locale): PageSection[] {
  const ar = locale === "ar";
  const countdown: CountdownSection = {
    anchorID: "countdown",
    blockType: "countdown",
    displayOrder: 12,
    internalLabel: "Forum countdown",
    visible: true,
    heading: ar ? "الوقت المتبقي لانعقاد الملتقى" : "Countdown to SIMF 2026",
    targetDate: "2026-11-23T09:00:00+03:00",
    labels: ar
      ? { months: "شهر", days: "يوم", hours: "ساعة", minutes: "دقيقة", seconds: "ثانية" }
      : { months: "Months", days: "Days", hours: "Hours", minutes: "Minutes", seconds: "Seconds" },
  };
  const indicators: MetricRailSection = {
    anchorID: "indicators",
    blockType: "metricRail",
    displayOrder: 28,
    internalLabel: "Global maritime security indicators",
    visible: true,
    eyebrow: ar
      ? "لماذا يُعد الملتقى البحري السعودي الدولي مهماً"
      : "WHY THE SAUDI INTERNATIONAL MARITIME FORUM MATTERS",
    heading: ar
      ? "حماية ما يتحرك تحت سطح البحر وعبره"
      : "Protecting What Moves Beneath and Across the Sea",
    metrics: ar
      ? [
          { value: "1.4M km", label: "من الكابلات البحرية" },
          { value: "$19T/سنة", label: "بيانات مالية تعبر البحار سنوياً" },
          { value: "80%", label: "من السلع العالمية تُنقل بحراً" },
          { value: "100M", label: "حاوية تتحرك عبر الموانئ سنوياً" },
          { value: "+350%", label: "ارتفاع تكاليف الشحن في السنوات الأخيرة" },
          { value: "30%–50%", label: "تأخر زمن الرحلات بسبب الظروف البحرية" },
          { value: "+50%", label: "من تجارة النفط العالمية عبر الممرات البحرية" },
          { value: "+30%", label: "من الغاز الطبيعي المسال يُنقل بحراً" },
          { value: "900K+ km", label: "من خطوط الأنابيب البحرية حول العالم" },
          { value: "400+", label: "كابل بحري نشط يربط القارات" },
          { value: "200%", label: "ارتفاع التهديدات السيبرانية البحرية خلال خمس سنوات" },
          { value: "300%", label: "ارتفاع الهجمات على البنية التحتية البحرية" },
        ]
      : [
          { value: "1.4M km", label: "Subsea cables" },
          { value: "$19T / year", label: "Financial data flowing across the seas" },
          { value: "80%", label: "Global goods transported by sea" },
          { value: "100M", label: "Containers moving through ports annually" },
          { value: "+350%", label: "Rise in shipping costs in recent years" },
          { value: "30%–50%", label: "Voyage delays due to shifting maritime conditions" },
          { value: "+50%", label: "Global oil trade moves through maritime corridors" },
          { value: "+30%", label: "LNG transported by sea" },
          { value: "900K+ km", label: "Subsea pipelines worldwide" },
          { value: "400+", label: "Active cables connecting continents" },
          { value: "200%", label: "Increase in maritime cyber threats in five years" },
          { value: "300%", label: "Surge in attacks on maritime infrastructure" },
        ],
  };
  const legacy: LegacySection = {
    anchorID: "legacy",
    blockType: "legacy",
    displayOrder: 26,
    internalLabel: "SIMF legacy reach summary",
    visible: true,
    eyebrow: ar ? "إرث الملتقى" : "THE SIMF LEGACY",
    heading: ar
      ? "إرث متنامٍ من الحوار والتعاون البحري"
      : "A Growing Legacy of Maritime Dialogue and Cooperation",
    metrics: ar
      ? [
          { value: "40+", label: "دولة مشاركة" },
          { value: "100+", label: "قائد وصانع قرار" },
          { value: "220+", label: "متحدث دولي" },
          { value: "500+", label: "راعٍ وشريك" },
        ]
      : [
          { value: "40+", label: "Participating Countries" },
          { value: "100+", label: "Leaders & Decision-Makers" },
          { value: "220+", label: "International Speakers" },
          { value: "500+", label: "Sponsors & Partners" },
        ],
    editions: [],
  };
  const footer: SimfFooterSection = {
    anchorID: "footer",
    blockType: "simfFooter",
    displayOrder: 100,
    internalLabel: "SIMF contact and footer",
    visible: true,
    logo: "/assets/simf/simf-logo.webp",
    logoAlt: ar ? "الملتقى البحري السعودي الدولي" : "Saudi International Maritime Forum",
    bio: ar
      ? "الملتقى البحري السعودي الدولي 2026\nمستقبل أمن قاع البحار وسلاسل الإمداد في بيئة عالمية متغيرة\n23–25 نوفمبر 2026\nفندق ومركز مؤتمرات سوفيتل الرياض، المملكة العربية السعودية\nبإشراف وزارة الدفاع\nتنظيم القوات البحرية الملكية السعودية\nالترخيص لستارتايم"
      : "Saudi International Maritime Forum 2026\nThe Future of Seabed Security and Maritime Supply Chains in a Critically Changing World\n23–25 November 2026\nSofitel Riyadh Hotel and Convention Center, Riyadh, Saudi Arabia\nSupervised by the Ministry of Defense\nOrganized by the Royal Saudi Naval Forces\nLicensed to Startime",
    address: ar ? "3507 الرياض 12341\nالمملكة العربية السعودية" : "3507, Riyadh 12341\nSaudi Arabia",
    phone: "920010500",
    email: "sim@startime.sa",
    contactHeading: ar ? "تواصل معنا" : "Contact",
    socialLinks: [
      { platform: "x", href: "https://x.com/startimeevents" },
      { platform: "linkedin", href: "https://sa.linkedin.com/company/startimeevents" },
      { platform: "youtube", href: "https://www.youtube.com/@Startime_Events" },
    ],
    importantLinks: [
      { label: ar ? "الرئيسية" : "Home", href: ar ? "/ar" : "/" },
      { label: ar ? "البرنامج" : "Programme", href: ar ? "/ar/programme" : "/programme" },
      { label: ar ? "المتحدثون" : "Speakers", href: ar ? "/ar/speakers" : "/speakers" },
      { label: ar ? "الرعاة والشركاء" : "Sponsors & Partners", href: ar ? "/ar/partners" : "/partners" },
      { label: ar ? "فرص B2G" : "B2G Opportunities", href: ar ? "/ar/b2g" : "/b2g" },
      { label: ar ? "كن راعيًا" : "Become a Sponsor", href: ar ? "/ar/sponsor" : "/sponsor" },
      { label: ar ? "نسخ سابقة" : "Legacy", href: ar ? "/ar/legacy" : "/legacy" },
      { label: ar ? "الأخبار والمركز الإعلامي" : "News & Media Center", href: ar ? "/ar/updates" : "/updates" },
      { label: ar ? "تواصل معنا" : "Contact", href: ar ? "/ar/contact" : "/contact" },
    ],
    linksHeading: ar ? "استكشف SIM" : "Explore SIM",
    privacyLabel: ar ? "سياسة الخصوصية" : "Privacy Policy",
    privacyHref: ar ? "https://startime.sa/ar/privacy-policy" : "https://startime.sa/privacy-policy",
    homeLabel: ar ? "الرئيسية" : "Home",
    copyright: ar ? "© 2026 جميع الحقوق محفوظة لستارتايم" : "© 2026 Startime. All rights reserved.",
  };
  return [
    simfHeaderSection(locale, "landing"),
    {
      anchorID: "top",
      blockType: "hero",
      displayOrder: 10,
      internalLabel: "SIMF microsite hero",
      visible: true,
      eyebrow: ar
        ? "الملتقى البحري السعودي الدولي الرابع"
        : "The 4th Saudi International Maritime Forum",
      heading: ar
        ? "مستقبل أمن قاع البحار وسلاسل الإمداد البحرية في عالم يشهد تحولات حاسمة"
        : "The Future of Seabed Security and Maritime Supply Chains in a Critically Changing World",
      body: ar
        ? "يُقام برعاية صاحب السمو الملكي الأمير خالد بن سلمان بن عبدالعزيز آل سعود، وزير الدفاع."
        : "Held under the patronage of His Royal Highness Prince Khalid bin Salman bin Abdulaziz Al Saud, Minister of Defense.",
      media: ar
        ? `${assetRoot}/photos/simf-hero-approved-v2-ar.webp`
        : `${assetRoot}/photos/simf-hero-approved-v2.webp`,
      buttons: [
        {
          href: ar ? "/ar/sponsor" : "/sponsor",
          label: ar ? "كن راعياً" : "Become a Sponsor",
          style: "primary",
          trackingID: "simf-hero-sponsor",
        },
        {
          href: ar ? "/ar/legacy" : "/legacy",
          label: ar ? "اكتشف SIMF 2026" : "Discover SIM 2026",
          style: "outline",
          trackingID: "simf-hero-explore",
        },
      ],
      eventDetails: [
        { label: ar ? "التاريخ" : "Date", value: ar ? "23–25 نوفمبر 2026" : "23–25 November 2026" },
        {
          label: ar ? "الموقع" : "Venue",
          value: ar
            ? "فندق ومركز مؤتمرات سوفيتل الرياض، المملكة العربية السعودية"
            : "Sofitel Riyadh Hotel & Convention Center, Saudi Arabia",
        },
      ],
    },
    countdown,
    {
      anchorID: "authority",
      blockType: "cardGrid",
      displayOrder: 15,
      internalLabel: "Authority and organizing entities",
      visible: true,
      heading: ar ? "الإشراف والتنظيم" : "Supervision and Organization",
      layout: "proof",
      cards: [
        {
          visible: true,
          title: ar ? "وزارة الدفاع" : "Ministry of Defense",
          meta: ar ? "تحت الإشراف" : "Under the supervision of",
          media: `${assetRoot}/organizers/ministry-of-defense.svg`,
          body: ar
            ? "ملتقى سيادي رفيع المستوى يعكس دور المملكة في تعزيز أمن البحار."
            : "A sovereign platform reflecting Saudi Arabia’s leadership in maritime security.",
        },
        {
          visible: true,
          title: ar ? "القوات البحرية الملكية السعودية" : "Royal Saudi Naval Forces",
          meta: ar ? "تنظيم" : "Organized by",
          media: `${assetRoot}/official-framework/royal-saudi-naval-forces.webp`,
        },
        {
          visible: true,
          title: ar
            ? "الهيئة العامة للصناعات العسكرية"
            : "General Authority for Military Industries",
          meta: ar ? "الشريك الاستراتيجي" : "Strategic Partner",
          media: `${assetRoot}/organizers/gami.webp`,
        },
      ],
    },
    {
      anchorID: "about",
      blockType: "mediaFeature",
      displayOrder: 20,
      internalLabel: "About and strategic value",
      visible: true,
      eyebrow: ar ? "عن الملتقى" : "ABOUT SIMF 2026",
      heading: ar
        ? "منصة سعودية للحوار والتعاون البحري العالمي"
        : "A Saudi Platform for Global Maritime Dialogue and Cooperation",
      body: ar
        ? "يجمع الملتقى البحري السعودي الدولي القيادات البحرية والعسكرية وصنّاع القرار الحكوميين والوفود الدولية والخبراء والجهات الصناعية لمناقشة التحديات التي تشكّل مستقبل الأمن البحري.\n\nوتركّز نسخته الرابعة على حماية البنية التحتية الحيوية في قاع البحار وتعزيز مرونة سلاسل الإمداد البحرية في عالم سريع التغيّر."
        : "The Saudi International Maritime Forum brings together naval and military leaders, government decision makers, international delegations, experts and industry organizations to address the challenges shaping maritime security.\n\nIts fourth edition focuses on protecting critical seabed infrastructure and strengthening the resilience of maritime supply chains in a rapidly changing world.",
      media: `${assetRoot}/photos/forum-audience.webp`,
      mediaPosition: "end",
      theme: "light",
      ctaHref: ar ? "/ar/legacy" : "/legacy",
      ctaLabel: ar ? "اكتشف الملتقى وإرثه" : "Discover SIMF and Its Legacy",
    },
    legacy,
    indicators,
    {
      anchorID: "experience",
      blockType: "videoFeature",
      displayOrder: 35,
      internalLabel: "Approved SIMF naval film",
      visible: true,
      eyebrow: ar ? "تجربة الملتقى" : "INSIDE THE FORUM",
      heading: ar
        ? "مشهد بحري يليق بمستوى الحوار"
        : "A Maritime Setting Built for Strategic Dialogue",
      body: ar
        ? "تجربة تجمع الحضور السيادي والخبرة البحرية والتقنية في منصة واحدة صُممت لصناعة شراكات مؤثرة."
        : "A sovereign event experience bringing naval leadership, specialist expertise and industry capability into one environment designed for consequential partnerships.",
      video: `${assetRoot}/simf-about.mp4`,
      poster: `${assetRoot}/photos/simf-video-poster.webp`,
      autoplay: false,
    },
    {
      anchorID: "audience",
      blockType: "cardGrid",
      displayOrder: 37,
      internalLabel: "Homepage audience groups",
      visible: true,
      eyebrow: ar ? "من يجمعهم الملتقى" : "WHO SIMF BRINGS TOGETHER",
      heading: ar
        ? "حيث تلتقي القيادات البحرية والحكومة والقطاع"
        : "Where Maritime Leadership, Government and Industry Meet",
      layout: "list",
      cards: ar
        ? [
            {
              visible: true,
              title: "القيادات البحرية والعسكرية",
              body: "كبار القادة والمسؤولين الدفاعيين الذين يصوغون الاستراتيجية البحرية والجاهزية والتعاون الدولي.",
              media: `${assetRoot}/photos/naval-commanders.webp`,
            },
            {
              visible: true,
              title: "الجهات الحكومية والتنظيمية",
              body: "الجهات المسؤولة عن الأمن والبنية التحتية والسياسات والاستثمار وتطوير القدرات الوطنية.",
              media: `${assetRoot}/photos/forum-policy-panel.webp`,
            },
            {
              visible: true,
              title: "الوفود الدولية",
              body: "ممثلون رسميون يقدّمون رؤى وخبرات عالمية وفرصاً للتعاون.",
              media: `${assetRoot}/photos/forum-audience.webp`,
            },
            {
              visible: true,
              title: "جهات القطاع البحري والدفاعي والتقني",
              body: "شركات تطوّر الأنظمة والتقنيات والخدمات التي تشكّل مستقبل المجال البحري.",
              media: `${assetRoot}/photos/naval-vessel-operations.webp`,
            },
            {
              visible: true,
              title: "الخبراء والمؤسسات الاستراتيجية",
              body: "باحثون ومتخصصون وجهات معرفية يقدّمون الرؤى والأدلة والاستشراف.",
              media: `${assetRoot}/photos/forum-panel-close.webp`,
            },
          ]
        : [
            {
              visible: true,
              title: "Naval and Military Leadership",
              body: "Senior commanders and defence leaders shaping maritime strategy, readiness and international cooperation.",
              media: `${assetRoot}/photos/naval-commanders.webp`,
            },
            {
              visible: true,
              title: "Government and Regulatory Entities",
              body: "Institutions responsible for security, infrastructure, policy, investment and national capabilities.",
              media: `${assetRoot}/photos/forum-policy-panel.webp`,
            },
            {
              visible: true,
              title: "International Delegations",
              body: "Official representatives contributing global perspectives, expertise and opportunities for cooperation.",
              media: `${assetRoot}/photos/forum-audience.webp`,
            },
            {
              visible: true,
              title: "Maritime, Defence and Technology Organizations",
              body: "Companies developing the systems, technologies and services shaping the maritime domain.",
              media: `${assetRoot}/photos/naval-vessel-operations.webp`,
            },
            {
              visible: true,
              title: "Experts and Strategic Institutions",
              body: "Researchers, specialists and knowledge organizations contributing insight, evidence and foresight.",
              media: `${assetRoot}/photos/forum-panel-close.webp`,
            },
          ],
      buttons: [],
    },
    {
      anchorID: "sponsorship",
      blockType: "callToAction",
      displayOrder: 40,
      internalLabel: "SIMF 2026 sponsorship conversion",
      visible: true,
      eyebrow: ar ? "رعاية SIM 2026" : "SIM 2026 SPONSORSHIP",
      heading: ar
        ? "رعاية مصممة حول الأهداف الاستراتيجية"
        : "Sponsorship Built Around Strategic Objectives",
      body: ar
        ? "ضع جهتك ضمن منصة رفيعة المستوى للأمن البحري من خلال الحضور المؤسسي، والتواصل مع الجهات الحكومية والقطاع، والوصول الدولي، والمشاركة في المعرض، وفرص الشراكة المصممة وفق أهدافكم."
        : "Position your organization within a high level maritime security platform through institutional visibility, government and industry engagement, international exposure, exhibition presence and tailored partnership opportunities.",
      media: `${assetRoot}/photos/fleet-formation.webp`,
      appearance: { theme: "dark", spacing: "large" },
      buttons: [
        {
          href: ar ? "/ar/sponsor" : "/sponsor",
          label: ar ? "قدّم طلب الرعاية" : "Apply for Sponsorship",
          style: "primary",
          trackingID: "simf-option-final-sponsor",
        },
        {
          href: ar ? "/ar/sponsor" : "/sponsor",
          label: ar ? "استكشف فرص الرعاية" : "Explore Sponsorship Opportunities",
          style: "outline",
          trackingID: "simf-option-b2g",
        },
      ],
    },
    {
      ...speakerSection(locale),
      cards: speakerSection(locale).cards.slice(0, 3),
      buttons: [
        {
          href: ar ? "/ar/speakers" : "/speakers",
          label: ar ? "استعرض جميع المشاركين" : "Explore All Participants",
          style: "primary",
          trackingID: "simf-home-speakers",
        },
      ],
    },
    {
      ...partnerSection(locale),
      cards: partnerSection(locale).cards.filter((card) =>
        [
          "Startime Ultimate Impact",
          "General Authority for Military Industries",
          "Impact Event Production",
          "United Advisory Chamber",
        ].includes(card.title),
      ),
    },
    {
      anchorID: "gallery",
      blockType: "imageStory",
      displayOrder: 70,
      internalLabel: "Approved SIMF and naval image gallery",
      visible: true,
      eyebrow: ar ? "من قلب الحدث" : "FROM THE FORUM",
      heading: ar ? "منصة تجمع القيادة والخبرة والتقنية" : "A Platform Where Leadership, Expertise and Technology Converge",
      body: ar
        ? "مشاهد معتمدة من العمليات البحرية والنسخ السابقة للملتقى."
        : "Approved imagery from naval operations and previous editions of the forum.",
      images: [
        { caption: ar ? "جلسات الملتقى" : "Forum dialogue", media: `${assetRoot}/photos/forum-panel-wide.webp` },
        { caption: ar ? "القيادات البحرية" : "Naval leadership", media: `${assetRoot}/photos/naval-commanders.webp` },
        { caption: ar ? "عمليات بحرية" : "Naval operations", media: `${assetRoot}/photos/naval-operations.webp` },
      ],
    },
    {
      anchorID: "contact",
      blockType: "callToAction",
      displayOrder: 90,
      internalLabel: "Final co-sponsorship conversion call",
      visible: true,
      eyebrow: ar ? "كن جزءاً من الحوار" : "JOIN THE CONVERSATION",
      heading: ar
        ? "ضع جهتك في قلب حوار الأمن البحري"
        : "Position Your Organization at the Center of Maritime Security Dialogue",
      body: ar
        ? "تواصل مع فريق الشراكات لتصميم مسار رعاية مشتركة يناسب أهدافكم."
        : "Speak with the partnership team to shape a co-sponsorship route around your strategic priorities.",
      media: `${assetRoot}/photos/forum-panel-wide.webp`,
      buttons: [
        {
          href: ar ? "/ar/sponsor" : "/sponsor",
          label: ar ? "كن راعياً" : "Become a Sponsor",
          style: "primary",
          trackingID: "simf-footer-sponsor",
        },
      ],
    },
    footer,
  ];
}

function aboutSections(locale: Locale): PageSection[] {
  const ar = locale === "ar";
  const homeRoot = ar ? "/ar" : "/";
  const sections = structuredClone(landingSections(locale));
  const header = sections.find(
    (section): section is SimfHeaderSection => section.blockType === "simfHeader",
  );
  if (header) {
    header.logo = `${assetRoot}/organizers/simf-mark.webp`;
    header.logoAlt = ar
      ? "الملتقى البحري السعودي الدولي"
      : "Saudi International Maritime Forum";
    header.links = [
      { href: homeRoot, label: ar ? "الرئيسية" : "Home" },
      {
        href: ar ? "/ar/new-homepage" : "/new-homepage",
        label: ar ? "الرئيسية الجديدة" : "New Homepage",
      },
      { href: ar ? "/ar/programme" : "/programme", label: ar ? "البرنامج" : "Programme" },
      { href: ar ? "/ar/speakers" : "/speakers", label: ar ? "المتحدثون" : "Speakers" },
      { href: ar ? "/ar/partners" : "/partners", label: ar ? "الرعاة والشركاء" : "Sponsors & Partners" },
      { href: ar ? "/ar/b2g" : "/b2g", label: ar ? "فرص الأعمال الحكومية" : "B2G Opportunities" },
      { href: ar ? "/ar/legacy" : "/legacy", label: ar ? "الإرث" : "Legacy" },
      { href: ar ? "/ar/updates" : "/updates", label: ar ? "الأخبار والمركز الإعلامي" : "News & Media Center" },
      { href: ar ? "/ar/contact" : "/contact", label: ar ? "تواصل معنا" : "Contact" },
    ];
  }

  const hero = sections.find(
    (section) => section.anchorID === "top" && section.blockType === "hero",
  );
  if (hero?.blockType === "hero") {
    hero.eyebrow = ar
      ? "برعاية صاحب السمو الملكي\nالأمير خالد بن سلمان بن عبدالعزيز آل سعود | وزير الدفاع"
      : "Held under the patronage of\nHis Royal Highness Prince Khalid bin Salman Bin Abdulaziz Al Saud | Minister of Defence";
    hero.heading = ar
      ? "الملتقى البحري السعودي الدولي الرابع"
      : "4th Saudi International Maritime Forum";
    hero.body = null;
  }

  const legacy = sections.find(
    (section) => section.anchorID === "legacy" && section.blockType === "legacy",
  );
  if (legacy?.blockType === "legacy") {
    legacy.eyebrow = undefined;
  }

  const experience = sections.find(
    (section) =>
      section.anchorID === "experience" && section.blockType === "videoFeature",
  );
  if (experience?.blockType === "videoFeature") {
    experience.autoplay = true;
  }

  const partners = sections.find(
    (section) =>
      section.anchorID === "partners" && section.blockType === "cardGrid",
  );
  if (partners?.blockType === "cardGrid") {
    const allPartners = partnerSection(locale).cards;
    partners.layout = "swiper";
    partners.cards = [
      {
        title: ar ? "وزارة الدفاع" : "Ministry of Defense",
        meta: ar ? "تحت الإشراف" : "Under the supervision of",
        media: `${assetRoot}/organizers/ministry-of-defense.svg`,
      },
      {
        title: ar ? "القوات البحرية الملكية السعودية" : "Royal Saudi Naval Forces",
        meta: ar ? "تنظيم" : "Organized by",
        media: `${assetRoot}/official-framework/royal-saudi-naval-forces.webp`,
      },
      ...allPartners,
    ];
  }

  const footer = sections.find(
    (section): section is SimfFooterSection => section.blockType === "simfFooter",
  );
  if (footer) {
    footer.logo = `${assetRoot}/organizers/simf-mark.webp`;
    footer.importantLinks = [
      { label: ar ? "الرئيسية" : "Home", href: homeRoot },
      { label: ar ? "البرنامج" : "Programme", href: ar ? "/ar/programme" : "/programme" },
      { label: ar ? "المتحدثون" : "Speakers", href: ar ? "/ar/speakers" : "/speakers" },
      { label: ar ? "الرعاة والشركاء" : "Sponsors & Partners", href: ar ? "/ar/partners" : "/partners" },
      { label: ar ? "فرص B2G" : "B2G Opportunities", href: ar ? "/ar/b2g" : "/b2g" },
      { label: ar ? "كن راعيًا" : "Become a Sponsor", href: ar ? "/ar/sponsor" : "/sponsor" },
      { label: ar ? "نسخ سابقة" : "Legacy", href: ar ? "/ar/legacy" : "/legacy" },
      { label: ar ? "الأخبار والمركز الإعلامي" : "News & Media Center", href: ar ? "/ar/updates" : "/updates" },
      { label: ar ? "تواصل معنا" : "Contact", href: ar ? "/ar/contact" : "/contact" },
    ];
  }

  return sections;
}

function reviewHomepageSections(locale: Locale): PageSection[] {
  const ar = locale === "ar";
  const sections = structuredClone(aboutSections(locale));
  const header = sections.find(
    (section): section is SimfHeaderSection => section.blockType === "simfHeader",
  );
  if (header) {
    header.links = header.links
      .filter((link) => !link.href.endsWith("/new-homepage"))
      .map((link) =>
        link.href === "/" || link.href === "/ar"
          ? { ...link, label: ar ? "الرئيسية" : "Home" }
          : link,
      );
  }
  const hero = sections.find(
    (section) => section.anchorID === "top" && section.blockType === "hero",
  );
  if (hero?.blockType === "hero") {
    hero.eyebrow = ar
      ? "برعاية صاحب السمو الملكي\nالأمير خالد بن سلمان بن عبدالعزيز آل سعود | وزير الدفاع"
      : "Held under the patronage of\nHis Royal Highness Prince Khalid bin Salman Bin Abdulaziz Al Saud | Minister of Defence";
    hero.heading = ar
      ? "النسخة الرابعة\nمن الملتقى البحري السعودي الدولي"
      : "The Fourth\nSaudi International Maritime Forum";
    hero.body = ar
      ? "مستقبل أمن قاع البحار وسلاسل الإمداد في بيئة عالمية متغيرة"
      : "The Future of Seabed Security and Maritime Supply Chains\nin a Critically Changing World";
  }

  const about = sections.find(
    (section) => section.anchorID === "about" && section.blockType === "mediaFeature",
  );
  if (about?.blockType === "mediaFeature") {
    about.heading = ar
      ? "منصة سعودية تجمع القيادات البحرية والخبرات العالمية"
      : "A Saudi Platform Connecting Maritime Leadership and Global Expertise";
  }

  const legacy = sections.find(
    (section) => section.anchorID === "legacy" && section.blockType === "legacy",
  );
  if (legacy?.blockType === "legacy") {
    legacy.heading = ar
      ? "مسيرة متنامية لصياغة مستقبل الأمن البحري"
      : "A Growing Legacy Shaping the Future of Maritime Security";
  }

  return sections;
}

function sponsorSections(locale: Locale): PageSection[] {
  const ar = locale === "ar";
  const footer = landingSections(locale).find(
    (item) => item.blockType === "simfFooter",
  ) as SimfFooterSection;
  footer.logo = `${assetRoot}/organizers/simf-mark.webp`;
  return [
    simfHeaderSection(locale, "sponsor"),
    {
      anchorID: "sponsor-intro",
      blockType: "hero",
      displayOrder: 10,
      internalLabel: "SIMF sponsorship enquiry introduction",
      visible: true,
      eyebrow: ar
        ? "طلب الرعاية"
        : "SPONSORSHIP APPLICATION",
      heading: ar ? "قدّم طلب رعاية ملتقى 2026" : "Apply to Sponsor SIM 2026",
      body: ar
        ? "عرّفنا بجهتك وأولوياتها الاستراتيجية والنتائج التي تريد تحقيقها من خلال الملتقى البحري السعودي الدولي الرابع. سيراجع فريق الرعاية طلبك ويتواصل معك لمناقشة الملاءمة وتوفر الباقات ومسار المشاركة الأنسب."
        : "Tell us about your organization, your strategic priorities, and the outcomes you want to achieve through the fourth Saudi International Maritime Forum. The sponsorship team will review your submission and contact you to discuss relevance, package availability, and the most suitable participation route.",
      media: `${assetRoot}/photos/vip-audience.webp`,
      eventDetails: [
        { label: ar ? "التاريخ" : "Date", value: ar ? "23–25 نوفمبر 2026" : "23–25 November 2026" },
        {
          label: ar ? "الموقع" : "Venue",
          value: ar
            ? "فندق ومركز مؤتمرات سوفيتل الرياض"
            : "Sofitel Riyadh Hotel & Convention Center",
        },
      ],
    },
    {
      anchorID: "sponsor-form",
      blockType: "form",
      displayOrder: 20,
      internalLabel: "SIMF microsite sponsorship lead form",
      visible: true,
      eyebrow: ar ? "طلب الرعاية" : "SPONSORSHIP APPLICATION",
      heading: ar ? "عرّفنا بأهدافك من الرعاية" : "Tell Us About Your Sponsorship Goals",
      body: ar
        ? "شارك بيانات التواصل الأساسية وأهدافك، وسيتواصل معك فريق الرعاية لمناقشة المسار الأنسب."
        : "Share your essential contact details and objectives. The sponsorship team will follow up to discuss the most suitable route.",
      form: localizedSponsorForm(locale),
      privacyNote: ar
        ? "لا يضمن إرسال الاستفسار الموافقة أو فئة رعاية محددة أو المشاركة في اجتماعات الأعمال الحكومية أو نتيجة تجارية."
        : "Submitting an enquiry does not guarantee approval, a specific sponsorship category, participation in Government Business Meetings, or a commercial outcome.",
      successHeading: ar ? "شكراً لاهتمامك بملتقى 2026" : "Thank You for Your Interest in SIM 2026",
      successMessage: ar
        ? "تم استلام استفسارك. سيراجع الفريق المعلومات ويتواصل معك لمناقشة المسار الأنسب والخطوات التالية."
        : "Your sponsorship enquiry has been received. The team will review it and contact you to discuss the most suitable route and next steps.",
    },
    footer,
  ];
}

export function getSimfMicrositePage(
  locale: Locale,
  pageType:
    | "simf-microsite-home"
    | "simf-microsite-home-review"
    | "simf-microsite-about"
    | "simf-microsite-sponsor",
): PublicPage {
  const ar = locale === "ar";
  const sponsor = pageType === "simf-microsite-sponsor";
  const about = pageType === "simf-microsite-about";
  const review = pageType === "simf-microsite-home-review";
  const title = sponsor
    ? ar
      ? "طلب رعاية ملتقى 2026"
      : "Become a Sponsor"
    : review
      ? ar
        ? "الرئيسية الجديدة"
        : "New Homepage"
    : about
      ? ar
        ? "الصفحة الرئيسية السابقة — مخفية"
        : "Previous Home — Hidden"
      : ar
        ? "الرئيسية"
        : "Home";
  const description = sponsor
    ? ar
      ? "قدّم طلب رعاية الملتقى البحري السعودي الدولي 2026 في الرياض."
      : "Submit a sponsorship inquiry for the Fourth Saudi International Maritime Forum in Riyadh."
    : ar
      ? "الملتقى البحري السعودي الدولي 2026 في الرياض، منصة رفيعة المستوى للأمن البحري وأمن قاع البحار وسلاسل الإمداد."
      : "SIMF 2026 in Riyadh brings together naval commanders, government leaders and industry to advance seabed security and resilient maritime supply chains.";

  return {
    pageType,
    sections: sponsor
      ? sponsorSections(locale)
      : review
        ? reviewHomepageSections(locale)
      : about
        ? landingSections(locale)
        : reviewHomepageSections(locale),
    seo: {
      title: sponsor
        ? ar
          ? "كن راعياً في ملتقى 2026"
          : "Become a Sponsor | SIMF 2026"
        : review
          ? ar
            ? "الرئيسية الجديدة | ملتقى 2026"
            : "New Homepage | SIMF 2026"
        : about
          ? ar
            ? "الصفحة الرئيسية السابقة — مخفية"
            : "Previous Home — Hidden"
          : ar
            ? "الملتقى البحري السعودي الدولي 2026"
            : "Saudi International Maritime Forum 2026 | Riyadh",
      description,
      followLinks: true,
      indexable: true,
      openGraphImage: sponsor
        ? `${assetRoot}/photos/vip-audience.webp`
        : `${assetRoot}/photos/forum-hero-live.png`,
    },
    slug: sponsor
      ? "simf-microsite/sponsor"
      : review
        ? "simf-microsite/new-homepage"
      : about
        ? "simf-microsite/about"
        : "simf-microsite",
    summary: description,
    title,
  };
}
