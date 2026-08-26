import { readFile, writeFile } from "node:fs/promises";
import {
  getClientContentPage,
  type ClientContentPageKey,
} from "../src/content/simfClientContentDefaults";

const model = "malfa-allam-q5:latest";
const outputPath =
  "src/content/simfClientArabicTranslations.generated.ts";
const checkpointPath = "/tmp/simf-client-arabic-checkpoint.json";
const pageKeys: ClientContentPageKey[] = [
  "programme",
  "speakers",
  "partners",
  "government-b2g",
  "sponsors",
  "legacy",
  "contact",
];
const translatableFields = new Set([
  "address",
  "bio",
  "body",
  "contactHeading",
  "copyright",
  "eyebrow",
  "heading",
  "homeLabel",
  "label",
  "linksHeading",
  "logoAlt",
  "note",
  "privacyLabel",
  "privacyNote",
  "submitLabel",
  "successHeading",
  "successMessage",
  "summary",
  "title",
  "value",
]);

function collectStrings(
  value: unknown,
  values: Set<string>,
  field = "",
  parentAnchor = "",
): void {
  if (Array.isArray(value)) {
    value.forEach((entry) =>
      collectStrings(entry, values, field, parentAnchor),
    );
    return;
  }
  if (value && typeof value === "object") {
    const record = value as Record<string, unknown>;
    const anchor =
      typeof record.anchorID === "string" ? record.anchorID : parentAnchor;
    if (
      anchor === "all-speakers" ||
      anchor.startsWith("partner-category-") ||
      anchor === "sponsor-slider"
    ) {
      return;
    }
    Object.entries(record).forEach(([key, entry]) =>
      collectStrings(entry, values, key, anchor),
    );
    return;
  }
  if (
    typeof value === "string" &&
    translatableFields.has(field) &&
    !value.startsWith("/") &&
    !/^https?:/i.test(value)
  ) {
    values.add(value);
  }
}

const strings = new Set<string>();
pageKeys.forEach((key) => collectStrings(getClientContentPage(key), strings));
const entries = [...strings].map((en, id) => ({ id, en }));

const batches = entries.map((entry) => [entry]);

const approvedTerms: Record<string, string> = {
  "Saudi International Maritime Forum": "الملتقى البحري السعودي الدولي",
  Home: "الرئيسية",
  Programme: "البرنامج",
  Speakers: "المتحدثون",
  "Sponsors & Partners": "الرعاة والشركاء",
  "B2G Opportunities": "فرص B2G",
  Legacy: "نسخ سابقة",
  "News & Media Center": "الأخبار والمركز الإعلامي",
  Contact: "تواصل معنا",
  "Become a Sponsor": "كن راعيًا",
  "Explore SIM": "استكشف الملتقى",
  "Privacy Policy": "سياسة الخصوصية",
  "SIM 2026": "ملتقى 2026",
  "Where Maritime Security Becomes Strategic Action":
    "حيث يتحول الأمن البحري إلى عمل استراتيجي",
  "Explore Sponsorship Opportunities": "استكشف فرص الرعاية",
  "Contact Us": "تواصل معنا",
  "Three Days of Strategic Dialogue. Partnerships Beyond the Forum.":
    "ثلاثة أيام من الحوار الاستراتيجي وشراكات تتجاوز الملتقى",
  "Three Days. Three Critical Dimensions of Maritime Security.":
    "ثلاثة أيام وثلاثة أبعاد حاسمة للأمن البحري",
  "More Than a Programme. A Platform for Progress.":
    "أكثر من برنامج.. منصة تدفع التقدم",
  "Five Strategic Priorities. One Shared Maritime Future.":
    "خمس أولويات استراتيجية لمستقبل بحري مشترك",
  "The Forum focuses on five interconnected priorities affecting global trade, energy security, digital connectivity, and critical maritime infrastructure.":
    "يركز الملتقى على خمس أولويات مترابطة تؤثر في التجارة العالمية وأمن الطاقة والاتصال الرقمي والبنية التحتية البحرية الحيوية.",
  "Keynote Sessions": "الجلسات الرئيسية",
  "Maritime Cybersecurity: Challenges and Solutions":
    "الأمن السيبراني البحري: التحديات والحلول",
  "The Programme Is Taking Shape": "ملامح البرنامج تتكامل",
  "Explore three days of strategic dialogue, programme formats, and five priorities shaping SIM 2026.":
    "استكشف ثلاثة أيام من الحوار الاستراتيجي، وصيغ البرنامج، وخمس أولويات ترسم ملامح ملتقى 2026.",
  "Voices Shaping the Future of Maritime Security":
    "أصوات ترسم مستقبل الأمن البحري",
  "One Forum. The Full Spectrum of Maritime Expertise.":
    "ملتقى واحد يجمع مختلف الخبرات البحرية",
  "Explore Conversations Shaping Maritime Security":
    "استكشف الحوارات التي ترسم مستقبل الأمن البحري",
  "A distinguished community of speakers connecting operational leadership, public policy, international experience, industry capability, and technical expertise.":
    "نخبة من المتحدثين تجمع بين القيادة التشغيلية والسياسات العامة والخبرة الدولية والقدرات الصناعية والخبرة التقنية.",
  "Partnerships That Strengthen the Maritime Security Ecosystem":
    "شراكات تعزّز منظومة الأمن البحري",
  "Addressing today’s interconnected maritime challenges requires coordinated leadership, specialist expertise, advanced capabilities, and international cooperation.\n\nSIM 2026 recognises the organisations contributing to the Forum’s strategic objectives through institutional leadership, industry capability, sector expertise, media reach, and collaborative engagement.\n\nTheir participation strengthens the Forum as a platform for meaningful dialogue, knowledge exchange, capability development, and long-term cooperation across the global maritime security ecosystem.":
    "تتطلب مواجهة التحديات البحرية المترابطة اليوم قيادة منسقة، وخبرات متخصصة، وقدرات متقدمة، وتعاوناً دولياً فاعلاً.\n\nويقدّر ملتقى 2026 دور الجهات التي تسهم في تحقيق أهدافه الاستراتيجية من خلال القيادة المؤسسية، والقدرات الصناعية، والخبرة القطاعية، والحضور الإعلامي، والعمل التعاوني.\n\nوتعزّز مشاركتهم مكانة الملتقى بوصفه منصة للحوار الهادف، وتبادل المعرفة، وتطوير القدرات، وبناء تعاون طويل الأمد ضمن منظومة الأمن البحري العالمية.",
  "Meet the naval commanders, government decision-makers, international experts, and industry leaders contributing strategic insight and operational expertise to SIM 2026.":
    "تعرّف على القيادات البحرية وصنّاع القرار الحكوميين والخبراء الدوليين وقادة القطاع الذين يثرون ملتقى 2026 بالرؤية الاستراتيجية والخبرة التشغيلية.",
  "Meet the naval commanders, decision-makers, experts, and industry leaders contributing to SIM 2026.":
    "تعرّف على القيادات البحرية وصنّاع القرار والخبراء وقادة القطاع المشاركين في ملتقى 2026.",
  "Connect Advanced Maritime Solutions with Government Priorities":
    "اربط حلولك البحرية المتقدمة بأولويات الجهات الحكومية",
  "Where Capabilities Meet Strategic Demand":
    "حيث تلتقي القدرات بالاحتياجات الاستراتيجية",
  "Meet at SIM 2026": "التقِ بالجهات المعنية في ملتقى 2026",
  "Position Your Organization at the Center of Maritime Security":
    "ضع جهتك في قلب منظومة الأمن البحري",
  "Organization": "الجهة",
  "Organization name": "اسم الجهة",
  "Complete the Payment": "استكمال السداد",
  "Confirmation and Activation": "التأكيد وبدء التفعيل",
  "Co-Sponsor": "الراعي المشارك",
  "Compare Sponsorship Packages": "قارن باقات الرعاية",
  "Request the Application Form": "اطلب نموذج التقديم",
  "Request a Sponsorship Proposal": "اطلب عرض رعاية",
  "Contact the Organizing Committee": "تواصل مع اللجنة المنظمة",
  "Diamond Sponsorship": "الرعاية الماسية",
  "Platinum Sponsorship": "الرعاية البلاتينية",
  "Gold Sponsorship": "الرعاية الذهبية",
  "Silver Sponsorship": "الرعاية الفضية",
  "Previous Editions": "النسخ السابقة",
  "Each Edition Builds on the Last": "كل نسخة تمهّد لما بعدها",
  "THE LEGACY CONTINUES": "الإرث مستمر",
  "Legacy | SIM 2026": "الإرث | ملتقى 2026",
  "Follow the Saudi International Maritime Forum’s strategic journey from 2019 to SIM 2026.":
    "تعرّف على المسيرة الاستراتيجية للملتقى البحري السعودي الدولي منذ عام 2019 وحتى ملتقى 2026.",
  "Start the Right Conversation": "ابدأ الحوار المناسب",
  "Contact | SIM 2026": "تواصل معنا | ملتقى 2026",
  "3507, Riyadh 12341\nSaudi Arabia":
    "3507، الرياض 12341\nالمملكة العربية السعودية",
  "Saudi International Maritime Forum 2026\nThe Future of Seabed Security and Maritime Supply Chains in a Critically Changing World\n23–25 November 2026\nSofitel Riyadh Hotel & Convention Center, Saudi Arabia\nSupervised by the Ministry of Defense\nOrganized by the Royal Saudi Naval Forces\nLicensed to Startime":
    "الملتقى البحري السعودي الدولي 2026\nمستقبل أمن قاع البحار وسلاسل الإمداد البحرية في عالم يشهد تحولات حاسمة\n23–25 نوفمبر 2026\nفندق ومركز مؤتمرات سوفيتل الرياض، المملكة العربية السعودية\nتحت إشراف وزارة الدفاع\nتنظيم القوات البحرية الملكية السعودية\nمرخّص لشركة ستارتايم",
  "The Future of Seabed Security & Maritime Supply Chains in a Critically Changing World\n\nBuilding on the achievements and strategic outcomes of its three previous editions, SIM 2026 advances the international dialogue toward the security of the seabed, critical subsea infrastructure, and the maritime supply chains connecting global economies.\n\nThe fourth edition will convene naval leaders, government authorities, industry decision-makers, researchers, and technology specialists to address emerging risks, strengthen cooperation, and explore the capabilities required to protect the maritime systems on which the world depends.\n\n23–25 November 2026\nSofitel Riyadh Hotel & Convention Center":
    "مستقبل أمن قاع البحار وسلاسل الإمداد البحرية في عالم يشهد تحولات حاسمة\n\nاستناداً إلى إنجازات النسخ الثلاث السابقة ومخرجاتها الاستراتيجية، يمضي ملتقى 2026 بالحوار الدولي نحو تعزيز أمن قاع البحار، وحماية البنية التحتية الحيوية تحت سطح البحر، ورفع مرونة سلاسل الإمداد البحرية التي تربط اقتصادات العالم.\n\nوتجمع النسخة الرابعة القيادات البحرية والجهات الحكومية وصنّاع القرار في القطاع والباحثين والمتخصصين في التقنية لمناقشة المخاطر الناشئة، وتعزيز التعاون، واستكشاف القدرات اللازمة لحماية المنظومات البحرية التي يعتمد عليها العالم.\n\n23–25 نوفمبر 2026\nفندق ومركز مؤتمرات سوفيتل الرياض",
  "920010500": "920010500",
  "sim@startime.sa": "sim@startime.sa",
  "2019": "2019",
  "2022": "2022",
  "2024": "2024",
  "2026": "2026",
  "01": "01",
  "02": "02",
  "03": "03",
  "04": "04",
  "05": "05",
};

const translations = new Map<number, string>();
try {
  const checkpoint = JSON.parse(
    await readFile(checkpointPath, "utf8"),
  ) as Record<string, string>;
  Object.entries(checkpoint).forEach(([id, ar]) => {
    if (ar?.trim()) translations.set(Number(id), ar);
  });
  console.log(`Resuming with ${translations.size} checkpointed translations.`);
} catch {
  // A first run intentionally begins without a checkpoint.
}

async function saveCheckpoint(): Promise<void> {
  await writeFile(
    checkpointPath,
    JSON.stringify(Object.fromEntries(translations), null, 2),
    "utf8",
  );
}

for (const [index, currentBatch] of batches.entries()) {
  if (translations.has(currentBatch[0]!.id)) continue;
  const approved = approvedTerms[currentBatch[0]!.en];
  if (approved) {
    translations.set(currentBatch[0]!.id, approved);
    await saveCheckpoint();
    continue;
  }
  let pending = currentBatch;
  for (let attempt = 1; pending.length > 0 && attempt <= 3; attempt += 1) {
    console.log(
      `Translating batch ${index + 1}/${batches.length}, attempt ${attempt} (${pending.length} strings)...`,
    );
    const response = await fetch("http://127.0.0.1:11434/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model,
        stream: false,
        keep_alive: "30m",
        options: {
          temperature: 0.05,
          top_p: 0.85,
        },
        format: {
          type: "object",
          properties: {
            translations: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  id: { type: "integer" },
                  ar: { type: "string" },
                },
                required: ["id", "ar"],
              },
            },
          },
          required: ["translations"],
        },
        messages: [
          {
            role: "system",
            content:
              "أنت محرر محتوى سعودي محترف لموقع رسمي رفيع المستوى عن ملتقى بحري ودفاعي. ترجم كل نص بالكامل إلى عربية سعودية طبيعية وسلسة ومستخدمة في المملكة، بنبرة مؤسسية واضحة وقريبة من أسلوب أهل الحجاز، من دون عامية مبتذلة أو ترجمة حرفية. ممنوع الاختصار أو التلخيص أو حذف أي جملة. حافظ على فواصل الفقرات، والمعنى الكامل، والأسماء الرسمية، والأرقام، والتواريخ. الاسم الرسمي Saudi International Maritime Forum هو الملتقى البحري السعودي الدولي، واستخدم كلمة الملتقى دائماً لا كلمة المنتدى. ترجم SIM 2026 إلى ملتقى 2026 حيثما وردت في النص المرئي. استخدم المصطلحات: Business-to-Government Meetings = اجتماعات الأعمال بين القطاعين الخاص والحكومي، Seabed Security = أمن قاع البحار، Maritime Supply Chains = سلاسل الإمداد البحرية، Organizing Committee = اللجنة المنظمة، Royal Saudi Naval Forces = القوات البحرية الملكية السعودية. أعد العنصر نفسه وبنفس id ولا تضف شرحاً.",
          },
          {
            role: "user",
            content: JSON.stringify({ strings: pending }),
          },
        ],
      }),
    });
    if (!response.ok) {
      throw new Error(
        `Ollama returned ${response.status}: ${await response.text()}`,
      );
    }
    const result = (await response.json()) as {
      message?: { content?: string };
    };
    const parsed = JSON.parse(result.message?.content || "{}") as {
      translations?: { id: number; ar: string }[];
    };
    for (const item of parsed.translations || []) {
      const source = pending.find((entry) => entry.id === item.id);
      const sourceParagraphs = source?.en.split("\n\n").length || 1;
      const candidateParagraphs = item.ar?.trim().split("\n\n").length || 0;
      if (
        pending.some((entry) => entry.id === item.id) &&
        typeof item.id === "number" &&
        item.ar?.trim() &&
        item.ar.trim().length >=
          Math.max(
            2,
            (source?.en.length || 0) *
              ((source?.en.length || 0) < 80 ? 0.2 : 0.38),
          ) &&
        candidateParagraphs >= sourceParagraphs
      ) {
        translations.set(item.id, item.ar.trim());
      }
    }
    pending = pending.filter((entry) => !translations.has(entry.id));
    await saveCheckpoint();
  }
  if (pending.length > 0) {
    throw new Error(
      `Batch ${index + 1} incomplete after retries. Missing: ${pending
        .map((entry) => entry.id)
        .join(", ")}`,
    );
  }
}

const missing = entries.filter((entry) => !translations.has(entry.id));
if (missing.length > 0) {
  throw new Error(
    `Translation incomplete. Missing ${missing.length} strings: ${missing
      .slice(0, 5)
      .map((entry) => entry.id)
      .join(", ")}`,
  );
}

const dictionary = Object.fromEntries(
  entries.map((entry) => [
    entry.en,
    approvedTerms[entry.en] ||
      translations
        .get(entry.id)!
        .replaceAll("ملتقى 2026 البحري الدولي السعودي", "الملتقى البحري السعودي الدولي 2026")
        .replaceAll("الملتقى 2026 البحري الدولي السعودي", "الملتقى البحري السعودي الدولي 2026")
        .replaceAll("ملتقى 2026 البحري السعودي الدولي", "الملتقى البحري السعودي الدولي 2026")
        .replaceAll("ملتقى 2026 البحري الدولي", "الملتقى البحري السعودي الدولي 2026")
        .replaceAll("الملتقى البحري الدولي السعودي", "الملتقى البحري السعودي الدولي")
        .replaceAll("ملتقى البحري السعودي الدولي", "الملتقى البحري السعودي الدولي")
        .replaceAll("منتدى", "ملتقى")
        .replaceAll("النظام البيئي", "المنظومة")
        .replaceAll("نظام بيئي", "منظومة")
        .replaceAll("نظام الأمن البحري", "منظومة الأمن البحري")
        .replaceAll("قاع البحر", "قاع البحار")
        .replaceAll("الطبعة", "النسخة")
        .replaceAll("منظمتكم", "جهتكم")
        .replaceAll("منظمتك", "جهتك")
        .replaceAll("المنظمات", "الجهات")
        .replaceAll("رؤية العلامة التجارية", "ظهور العلامة التجارية")
        .replaceAll("رؤية قوية", "ظهور قوي")
        .replaceAll("رؤية مبكرة", "ظهور مبكر")
        .replaceAll("مقصورة معرض", "جناح معرض")
        .replaceAll("كشك عرض", "جناح عرض")
        .replaceAll("الحزمة", "الباقة")
        .replaceAll("حزمة", "باقة")
        .replaceAll("أصحاب المصلحة", "الجهات المعنية")
        .replaceAll("الكيانات", "الجهات")
        .replaceAll("النظام المتكامل", "المنظومة المتكاملة")
        .replaceAll("هذا المنظومة", "هذه المنظومة")
        .replaceAll("الجهات المعنية الحكوميين", "الجهات الحكومية المعنية")
        .replaceAll("أمن المعلومات البحرية", "الأمن السيبراني البحري")
        .replaceAll("المنظمات المعتمدة", "الجهات المعتمدة")
        .replaceAll("صلاحيات الوصول للوفود", "وصول الوفود")
        .replaceAll("منح وصول الوفود", "وصول الوفود")
        .replaceAll("التعرف على الراعي", "إبراز هوية الراعي")
        .replaceAll("التعرف على الرعاة", "تقدير الرعاة")
        .replaceAll("التعرف على الجهات الراعية", "إبراز هوية الجهات الراعية")
        .replaceAll("المخرجات التطبيقية للرعاية", "مزايا الرعاية المعتمدة")
        .replaceAll("وضع العلامة التجارية المبكرة", "تعزيز مكانة العلامة التجارية مبكراً")
        .replaceAll("زيادة الرؤية", "تعزيز الظهور")
        .replaceAll("من خلال الرؤية", "من خلال الظهور")
        .replaceAll("ورؤية استثنائية", "وظهور استثنائي")
        .replaceAll("اكمل وارجع", "أكمل وأرسل")
        .replaceAll("اتصل باللجنة المنظمة", "تواصل مع اللجنة المنظمة")
        .replaceAll("اتصل بفريق", "تواصل مع فريق")
        .replaceAll("الأجندة المفصلة", "جدول الأعمال التفصيلي")
        .replaceAll("المحادثات", "الحوارات")
        .replaceAll("اجتماعات B2G", "اجتماعات الأعمال بين القطاعين الخاص والحكومي")
        .replaceAll("SIM 2026", "ملتقى 2026"),
  ]),
);
const file = `/* Generated by scripts/generate-simf-client-arabic.ts.
 * Reviewed source structure remains in simfClientContentDefaults.ts.
 */
export const simfClientArabicTranslations: Record<string, string> = ${JSON.stringify(
  dictionary,
  null,
  2,
)};
`;
await writeFile(outputPath, file, "utf8");
console.log(`Wrote ${entries.length} translations to ${outputPath}.`);
