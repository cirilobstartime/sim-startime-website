import {
  getSimfMicrositePage,
  simfHeaderSection,
} from "./simfMicrositeDefaults";
import type {
  CallToActionSection,
  HeroSection,
  Locale,
  PublicPage,
  PublicUpdate,
  SimfFooterSection,
  UpdateIndexSection,
} from "./types";

const assetRoot = "/assets/simf-microsite";

type UpdateSeed = PublicUpdate & {
  internalTitle: string;
};

const updateMedia = {
  preparations: `${assetRoot}/photos/forum-audience.webp`,
  partnership: `${assetRoot}/photos/legacy-hero-audience.webp`,
  seabed: `${assetRoot}/programme/day-3-seabed-security-digital-infrastructure.webp`,
};

const englishUpdates: UpdateSeed[] = [
  {
    internalTitle: "Preparatory activities for the Fourth SIMF",
    slug: "preparatory-activities-fourth-simf-november-2026",
    category: "Forum News",
    title:
      "Launch of Preparatory Activities for the Fourth Saudi International Maritime Forum – November 2026",
    summary:
      "The Supreme Organizing Committee has commenced preparations for the fourth edition of the Forum, taking place from 23 to 25 November 2026 in Riyadh.",
    intro:
      "The Supreme Organizing Committee of the Saudi International Maritime Forum announced the commencement of preparatory activities for the fourth edition of the Forum, scheduled to be held under the patronage of His Royal Highness Prince Khalid bin Salman bin Abdulaziz Al Saud, Minister of Defense, and under the supervision of the Ministry of Defense and organized by the Royal Saudi Naval Forces, in cooperation with Startime Events. The Forum will take place from 23 to 25 November 2026 at the Sofitel Riyadh Hotel & Convention Center.",
    publicationLabel: "SIM 2026 | July 2026",
    publishedAt: "2026-07-30T00:00:00.000Z",
    featured: true,
    featuredImage: updateMedia.preparations,
    featuredImageCaption:
      "The Saudi International Maritime Forum brings together naval leaders, decision-makers and specialists from around the world.",
    content: [
      {
        body:
          "The launch of preparations comes at a time when the global maritime environment is undergoing rapid transformations and facing growing threats targeting critical infrastructure extending across the seabed, including subsea cables and energy pipelines that underpin the global digital economy and international trade flows. In response to these developments, the fourth edition will be held under the theme: “The Future of Seabed Security & Maritime Supply Chains in a Critically Changing World,” reflecting Saudi Arabia’s strategic direction toward strengthening seabed security and supporting international efforts to safeguard vital maritime corridors.",
        visible: true,
      },
      {
        body:
          "The Supreme Organizing Committee, operating under the direct supervision of the Oversight Committee of the Royal Saudi Naval Forces, is implementing a comprehensive preparatory plan that includes developing the Forum’s scientific program, coordinating participation with governmental, military, and international entities, and receiving participation requests from global institutions specializing in maritime security and supply-chains. Preparations also include establishing the logistical and technical infrastructure required to ensure a highly professional experience for all participants. Several international entities from more than 40 countries have begun confirming their participation, reinforcing the Forum’s position as a leading global platform for dialogue and cooperation on maritime security.",
        visible: true,
      },
      {
        body:
          "The Saudi International Maritime Forum stands as one of the leading high-level international business and strategic events dedicated to maritime security. It brings together senior naval leaders, decision-makers, experts, and industrial and technological entities to discuss the future of maritime security amid accelerating geopolitical and technological shifts. The Forum is expected to feature specialized discussions on protecting seabed digital infrastructure, securing maritime energy systems, enhancing the resilience of global supply chains, advancing maritime cybersecurity, and exploring the role of unmanned systems and artificial intelligence in strengthening maritime security.",
        visible: true,
      },
      {
        body:
          "This event builds upon the success of previous editions, which have firmly established the Kingdom of Saudi Arabia as a principal supporter of maritime security issues and priorities and a strategic contributor to safeguarding vital maritime corridors and ensuring the stability of global trade and energy flows. The Forum’s objectives align with Saudi Vision 2030 objectives, particularly in enhancing maritime security and developing advanced national capabilities in this critical domain.",
        highlight: true,
        visible: true,
      },
    ],
    seo: {
      title: "Preparatory Activities Begin for Fourth SIMF | SIM 2026",
      description:
        "Preparations have begun for the Fourth Saudi International Maritime Forum, taking place from 23 to 25 November 2026 at Sofitel Riyadh.",
      indexable: true,
      followLinks: true,
      includeInSitemap: true,
    },
  },
  {
    internalTitle: "Startime signs contract to organize Fourth SIMF",
    slug: "startime-signs-contract-organize-fourth-simf",
    category: "Strategic Partnership",
    title:
      "Startime Events Signs the Contract to Organize the Fourth Saudi International Maritime Forum – November 2026",
    summary:
      "The agreement extends Startime’s strategic partnership with the Royal Saudi Naval Forces and its role in delivering high-level sovereign events.",
    intro:
      "Building on Its Strategic Partnership with the Royal Saudi Naval Forces",
    publicationLabel: "SIM 2026 | July 2026",
    publishedAt: "2026-07-29T00:00:00.000Z",
    featured: false,
    featuredImage: updateMedia.partnership,
    featuredImageCaption:
      "The Forum’s successive editions have strengthened strategic maritime dialogue under Saudi leadership.",
    content: [
      {
        body:
          "Startime Events announced the signing of the contract to organize the fourth edition of the Saudi International Maritime Forum (SIM 2026) with the Supreme Supervisory Committee of the Royal Saudi Naval Forces, under the supervision and direct oversight of the Royal Saudi Naval Forces General Staff. This step reflects the growing institutional confidence in the capabilities of national companies to manage high-level sovereign events and reinforces the long-standing partnership between both parties since the Forum’s inaugural edition in 2019.",
        visible: true,
      },
      {
        body:
          "This agreement marks a continuation of a strategic collaboration through which Startime has consistently demonstrated its ability to advance the Forum’s organizational model, elevate its international presence, and expand participation from governmental, military, and technological entities worldwide. Through successive editions, the company has played a pivotal role in establishing the Forum as a leading global platform for maritime security and supply-chains, strengthening Saudi Arabia’s position within the international maritime security landscape.",
        visible: true,
      },
      {
        body:
          "The signing also aligns with Startime’s broader direction toward building a portfolio of sovereign projects across several principal domains, including defense and security, energy, infrastructure, digital transformation, and high-level government events. This strategic orientation reflects the company’s vision to deepen its presence within sovereign sectors and develop advanced operational models that meet the precision and professionalism required for sensitive national events.",
        visible: true,
      },
      {
        body:
          "Startime’s role is further reinforced by its standing as a member of the Global Association of the Exhibition Industry (UFI), a distinction that grants the company international accreditation in the management of major business and governmental events. This membership strengthens Startime’s ability to apply global standards in event organization, operations, and participant experience, and serves as a foundational pillar in shaping an organizational model that reflects the Forum’s international stature and sovereign nature.",
        visible: true,
      },
      {
        body:
          "The Forum will be held under the gracious patronage of His Royal Highness Prince Khalid bin Salman bin Abdulaziz Al Saud, Minister of Defense, from 23 to 25 November 2026 at the Sofitel Riyadh Hotel & Convention Center. The event continues its trajectory as one of the leading international events dedicated to maritime security, the protection of seabed infrastructure, and the future of supply chains in a critically changing world.",
        visible: true,
      },
      {
        body:
          "As the licensed organizer and holder of the organizational mandate, Startime is implementing an integrated operational plan that includes managing logistical operations, coordinating participation with governmental, military, and international entities, overseeing the scientific program, and managing protocol arrangements for official delegations. The company is also developing a comprehensive international media framework that reflects the Forum’s global significance, while working to attract leading international firms specializing in maritime security and seabed technologies, ensuring that SIM 2026 serves as a platform for strategic dialogue and high-value partnerships.",
        visible: true,
      },
      {
        body:
          "International entities from more than 40 countries have begun confirming their participation in the fourth edition, underscoring the Forum’s position as a global event that brings together naval leaders, decision-makers, experts, and industrial and technological institutions to discuss the future of maritime security amid evolving global challenges affecting maritime infrastructure and global supply chains.",
        visible: true,
      },
      {
        body:
          "This signing underscores Startime Events’ ability to manage major sovereign events and contributes to consolidating the Kingdom of Saudi Arabia’s position as a pivotal force in safeguarding vital maritime corridors and supporting the stability of global trade and energy, in line with the objectives of Saudi Vision 2030 to enhance maritime security and develop national capabilities in this vital sector.",
        highlight: true,
        visible: true,
      },
    ],
    seo: {
      title: "Startime Signs Contract to Organize Fourth SIMF | SIM 2026",
      description:
        "Startime Events signs the contract to organize the Fourth Saudi International Maritime Forum with the Royal Saudi Naval Forces.",
      indexable: true,
      followLinks: true,
      includeInSitemap: true,
    },
  },
  {
    internalTitle: "Future of seabed security and maritime supply chains",
    slug: "future-seabed-security-maritime-supply-chains",
    category: "Strategic Agenda",
    title:
      "The Future of Seabed Security and Maritime Supply Chains in a Critically Changing World",
    summary:
      "The fourth edition will examine the strategic, technological and operational challenges affecting seabed infrastructure and global supply chains.",
    intro:
      "Key Strategic Themes Addressed by the Fourth Saudi International Maritime Forum",
    publicationLabel: "SIM 2026 | July 2026",
    publishedAt: "2026-07-28T00:00:00.000Z",
    featured: false,
    featuredImage: updateMedia.seabed,
    featuredImageCaption:
      "Seabed infrastructure and the systems protecting it are central to the Fourth Forum’s strategic agenda.",
    content: [
      {
        body:
          "Riyadh is preparing to host the fourth edition of the Saudi International Maritime Forum from 23 to 25 November 2026, under the patronage of His Royal Highness Prince Khalid bin Salman bin Abdulaziz Al Saud, Minister of Defense, and organized by the Royal Saudi Naval Forces. The Forum comes at a time when the global maritime environment is undergoing unprecedented shifts, with rising threats targeting seabed infrastructure and global supply chains. The fourth edition introduces a comprehensive program and agenda that reflect the scale of challenges facing the world’s seas amid rapidly evolving geopolitical and technological dynamics.",
        visible: true,
      },
      {
        body:
          "The theme of the fourth edition, “The Future of Seabed Security & Maritime Supply Chains in a Critically Changing World,” underscores the growing international recognition of the importance of seabed infrastructure, from undersea communication cables carrying more than 95% of the world’s data to energy pipelines that form the backbone of global trade. As risks targeting these critical systems continue to escalate, the Forum serves as an international platform bringing together experts and decision-makers from dozens of countries to explore the future of maritime security through an integrated perspective that connects the surface to the depths, and energy to data and trade.",
        visible: true,
      },
      {
        body:
          "The Forum’s agenda features advanced discussions on the shifting global strategic environment and its impact on the security of maritime supply chains, particularly as international crises place mounting pressure on trade routes that transport nearly 80% of the world’s goods. It also examines the vulnerabilities facing subsea energy pipelines and their implications for global economic stability, at a time when recent disruptions have exposed the fragility of supply systems and driven shipping costs up by more than 350% when a single corridor is disrupted.",
        visible: true,
      },
      {
        body:
          "Further discussions will address the protection of the seabed and subsea digital infrastructure, both of which have become essential components of national security. The Forum highlights the challenges facing undersea cables stretching more than 1.4 million kilometers, and the cyber risks that threaten global communications and financial markets. It also explores the role of artificial intelligence and unmanned systems in strengthening deterrence, surveillance, and the protection of seabed infrastructure, amid growing global reliance on smart technologies in maritime operations.",
        visible: true,
      },
      {
        body:
          "The fourth edition represents a unique opportunity for government entities, military organizations, private-sector entities, and international technology institutions to contribute to a shared vision for the future of maritime security. It provides a platform for building new partnerships that enhance the resilience of supply chains and support the stable flow of energy, data, and trade in a rapidly changing world. The Forum also serves as an ideal venue for showcasing advanced maritime technologies, exchanging expertise, and engaging in a global dialogue that redefines maritime security in alignment with the objectives of Saudi Vision 2030.",
        visible: true,
      },
      {
        body:
          "Participation in this event offers an exceptional opportunity for stakeholders in maritime security, energy, communications, and logistics to engage in strategic discussions and develop practical solutions to the growing challenges facing maritime infrastructure and global supply chains. With delegations from more than forty countries expected to attend, the Forum opens the door to broad international cooperation that strengthens maritime stability and supports the future of the global economy.",
        highlight: true,
        visible: true,
      },
    ],
    seo: {
      title: "Future of Seabed Security and Maritime Supply Chains | SIM 2026",
      description:
        "Explore the strategic themes on seabed infrastructure, maritime security and resilient supply chains shaping the Fourth SIMF agenda.",
      indexable: true,
      followLinks: true,
      includeInSitemap: true,
    },
  },
];

const arabicUpdates: UpdateSeed[] = [
  {
    ...englishUpdates[0],
    internalTitle: "الأعمال التحضيرية للملتقى البحري السعودي الدولي الرابع",
    category: "أخبار الملتقى",
    title:
      "انطلاق الأعمال التحضيرية لإقامة الملتقى البحري السعودي الدولي الرابع – نوفمبر 2026",
    summary:
      "أعلنت اللجنة العليا المنظمة بدء الأعمال التحضيرية للنسخة الرابعة من الملتقى، التي تُقام في الرياض خلال الفترة من 23 إلى 25 نوفمبر 2026.",
    intro:
      "أعلنت اللجنة العليا المنظمة للملتقى البحري السعودي الدولي عن بدء الأعمال التحضيرية لانعقاد النسخة الرابعة من الملتقى البحري السعودي الدولي، والمقرر انعقاده تحت رعاية كريمة من لدن صاحب السمو الملكي الأمير خالد بن سلمان بن عبدالعزيز آل سعود، وزير الدفاع، وبإشراف وزارة الدفاع وتنظيم القوات البحرية الملكية السعودية؛ بالتعاون التنظيمي مع شركة ستارتايم إيفينتس؛ وذلك خلال الفترة من 23 إلى 25 نوفمبر 2026 في فندق ومركز المؤتمرات سوفيتيل الرياض.",
    publicationLabel: "الملتقى 2026 | يوليو 2026",
    featuredImageCaption:
      "يجمع الملتقى البحري السعودي الدولي القيادات البحرية وصنّاع القرار والمتخصصين من مختلف دول العالم.",
    content: [
      {
        body:
          "ويأتي إطلاق التحضيرات في وقت يشهد فيه العالم تحولات متسارعة في البيئة البحرية، وتناميًا في التهديدات التي تستهدف البنية التحتية الحيوية الممتدة في أعماق البحار، بما في ذلك الكابلات البحرية وأنابيب الطاقة التي يعتمد عليها الاقتصاد الرقمي العالمي وحركة التجارة الدولية؛ ومن هذا المنطلق، تم تحديد عنوان النسخة الرابعة: مستقبل أمن قاع البحار وسلاسل الإمداد في بيئة عالمية متغيرة، ليعكس التوجه الاستراتيجي للمملكة العربية السعودية نحو تعزيز الأمن البحري العميق ودعم الجهود الدولية لحماية الممرات البحرية الحيوية.",
        visible: true,
      },
      {
        body:
          "وتعمل اللجنة العليا المنظمة تحت اشراف مباشر من اللجنة الإشرافية بالقوات البحرية الملكية السعودية على تنفيذ خطة تحضيرية شاملة تشمل إعداد البرنامج العلمي للملتقى، وتنسيق مشاركة الجهات الحكومية والعسكرية والدولية، واستقبال طلبات المشاركة من المؤسسات العالمية المتخصصة في الأمن البحري وسلاسل الإمداد، إلى جانب تجهيز البنية اللوجستية والفنية لضمان تجربة احترافية للمشاركين؛ كما بدأت جهات دولية من أكثر من أربعين دولة في تأكيد مشاركتها، بما يعزز مكانة الملتقى كمنصة عالمية للحوار والتعاون في قضايا الأمن البحري.",
        visible: true,
      },
      {
        body:
          "ويُعد الملتقى البحري السعودي الدولي أحد أبرز فعاليات الأعمال الدولية رفيعة المستوى المتخصصة في قضايا الأمن البحري، إذ يجمع نخبة من قادة القوات البحرية وصناع القرار والخبراء والجهات الصناعية والتقنية لمناقشة مستقبل أمن البحار في ظل التحولات الجيوسياسية والتقنية المتسارعة؛ ومن المتوقع أن يشهد الملتقى نقاشات متخصصة حول حماية البنية التحتية الرقمية في الأعماق، وأمن الطاقة البحرية، ومرونة سلاسل الإمداد العالمية، والأمن السيبراني البحري، ودور الأنظمة غير المأهولة والذكاء الاصطناعي في تعزيز الأمن البحري.",
        visible: true,
      },
      {
        body:
          "ويمثل هذا الحدث امتدادًا لنجاح النسخ السابقة التي رسخت مكانة المملكة العربية السعودية كداعم رئيسي لقضايا وموضوعات الأمن البحري، وداعم استراتيجي في حماية الممرات البحرية الحيوية ودعم استقرار التجارة والطاقة العالمية، بما ينسجم مع مستهدفات رؤية السعودية 2030 في تعزيز الأمن البحري وتطوير القدرات الوطنية في هذا المجال الحيوي.",
        highlight: true,
        visible: true,
      },
    ],
    seo: {
      ...englishUpdates[0].seo,
      title: "انطلاق الأعمال التحضيرية للملتقى البحري السعودي الدولي الرابع",
      description:
        "بدء التحضيرات للملتقى البحري السعودي الدولي الرابع، الذي يُقام من 23 إلى 25 نوفمبر 2026 في فندق ومركز المؤتمرات سوفيتيل الرياض.",
    },
  },
  {
    ...englishUpdates[1],
    internalTitle: "ستارتايم توقع عقد تنظيم الملتقى الرابع",
    category: "شراكة استراتيجية",
    title:
      "ستارتايم توقع عقد تنظيم الملتقى البحري السعودي الدولي الرابع – نوفمبر 2026",
    summary:
      "يمتد الاتفاق بالشراكة الاستراتيجية بين ستارتايم والقوات البحرية الملكية السعودية ودورها في إدارة الفعاليات السيادية الكبرى.",
    intro:
      "إمتدادًا لشراكتها الاستراتيجية مع القوات البحرية الملكية السعودية",
    publicationLabel: "الملتقى 2026 | يوليو 2026",
    featuredImageCaption:
      "عززت نسخ الملتقى المتعاقبة الحوار الاستراتيجي في الأمن البحري بقيادة سعودية.",
    content: [
      {
        body:
          "أعلنت شركة ستارتايم إيفينتس عن توقيعها عقد تنظيم النسخة الرابعة من الملتقى البحري السعودي الدولي SIM 2026 مع اللجنة الإشرافية العليا بالقوات البحرية الملكية السعودية، وذلك تحت إشراف ومتابعة رئاسة أركان القوات البحرية الملكية السعودية، في خطوة تعكس الثقة المؤسسية المتنامية في قدرات الشركات الوطنية على إدارة الفعاليات السيادية الكبرى، وترسخ الشراكة الممتدة بين الطرفين منذ انطلاق النسخة الأولى للملتقى في عام 2019.",
        visible: true,
      },
      {
        body:
          "ويمثل هذا التوقيع امتدادًا لمسار تعاون استراتيجي أثبتت خلاله ستارتايم قدرتها على تطوير النموذج التنظيمي للملتقى، ورفع مستوى حضوره الدولي، وتوسيع نطاق المشاركة من جهات حكومية وعسكرية وتقنية من مختلف دول العالم؛ وقد أسهمت الشركة عبر نسخ الملتقى المتعاقبة في ترسيخ مكانة الملتقى كمنصة عالمية رفيعة المستوى في قضايا الأمن البحري وسلاسل الإمداد، وهو ما عزّز حضور المملكة العربية السعودية في المشهد الدولي للأمن البحري.",
        visible: true,
      },
      {
        body:
          "وتأتي هذه الخطوة في سياق توجه ستارتايم نحو بناء محفظة مشاريع سيادية تضم عدة مسارات رئيسية تشمل الأمن والدفاع، والطاقة، والبنية التحتية، والتحول الرقمي، والفعاليات الحكومية رفيعة المستوى. ويعكس هذا التوجه رؤية الشركة في تعزيز حضورها داخل القطاعات السيادية، وتطوير نماذج تشغيلية متقدمة تتوافق مع طبيعة الفعاليات الحساسة التي تتطلب أعلى درجات الاحترافية والدقة التشغيلية.",
        visible: true,
      },
      {
        body:
          "وتستند ستارتايم في هذا الدور إلى خبرة تراكمية واسعة، وإلى مكانتها كـعضو في الاتحاد الدولي للمعارض UFI، وهو ما يمنحها اعتمادًا دوليًا في إدارة فعاليات الأعمال الكبرى، ويعزز قدرتها على تطبيق معايير عالمية في التنظيم، والتشغيل، وإدارة تجربة المشاركين؛ وتُعد هذه العضوية عنصرًا محوريًا في بناء نموذج تنظيمي يواكب مكانة الملتقى وطبيعته الدولية، ويعكس مستوى الاحترافية المطلوب في الفعاليات السيادية.",
        visible: true,
      },
      {
        body:
          "سيُعقد الملتقى بمشيئة الله تحت رعاية كريمة من لدن صاحب السمو الملكي الأمير خالد بن سلمان بن عبدالعزيز آل سعود، وزير الدفاع، وذلك خلال الفترة من 23 إلى 25 نوفمبر 2026 في فندق ومركز المؤتمرات سوفيتيل الرياض، ليواصل مساره كأحد أهم الفعاليات الدولية المتخصصة في الأمن البحري، وحماية البنية التحتية العميقة، واستشراف مستقبل سلاسل الإمداد في بيئة عالمية متغيرة.",
        visible: true,
      },
      {
        body:
          "وتعمل ستارتايم، بصفتها الجهة المرخصة وصاحبة الامتياز التنظيمي، على تنفيذ خطة تشغيلية متكاملة تشمل إدارة العمليات اللوجستية، وتنسيق مشاركة الجهات الحكومية والعسكرية والدولية، والإشراف على البرنامج العلمي، وإدارة التجارب البروتوكولية للوفود الرسمية، إلى جانب تطوير منظومة إعلامية دولية تعكس مكانة الملتقى ودوره العالمي؛ كما تعمل الشركة على تعزيز حضور الشركات العالمية المتخصصة في الأمن البحري والتقنيات العميقة، وتوفير بيئة أعمال احترافية تتيح بناء شراكات استراتيجية عالية القيمة.",
        visible: true,
      },
      {
        body:
          "وقد بدأت جهات دولية من أكثر من 40 دولة في تأكيد مشاركتها في النسخة الرابعة، مما يعزز مكانة الملتقى كحدث عالمي يجمع قادة القوات البحرية وصناع القرار والخبراء والمؤسسات الصناعية والتقنية، لمناقشة مستقبل الأمن البحري في ظل التحديات المتنامية التي تواجه البنية التحتية البحرية وسلاسل الإمداد العالمية.",
        visible: true,
      },
      {
        body:
          "ويمثل هذا التوقيع تأكيدًا على قدرة ستارتايم على إدارة الفعاليات السيادية الكبرى، وترسيخ مكانة المملكة العربية السعودية كقوة محورية في حماية الممرات البحرية الحيوية ودعم استقرار التجارة والطاقة العالمية، بما يتسق مع مستهدفات رؤية السعودية 2030 في تعزيز الأمن البحري وتطوير القدرات الوطنية في هذا القطاع الحيوي.",
        highlight: true,
        visible: true,
      },
    ],
    seo: {
      ...englishUpdates[1].seo,
      title: "ستارتايم توقع عقد تنظيم الملتقى البحري السعودي الدولي الرابع",
      description:
        "ستارتايم إيفينتس توقع عقد تنظيم النسخة الرابعة من الملتقى البحري السعودي الدولي مع القوات البحرية الملكية السعودية.",
    },
  },
  {
    ...englishUpdates[2],
    internalTitle: "مستقبل أمن قاع البحار وسلاسل الإمداد",
    category: "الأجندة الاستراتيجية",
    title: "مستقبل أمن قاع البحار وسلاسل الإمداد في بيئة عالمية متغيرة",
    summary:
      "تناقش النسخة الرابعة التحديات الاستراتيجية والتقنية والتشغيلية التي تواجه البنية التحتية في قاع البحار وسلاسل الإمداد العالمية.",
    intro:
      "موضوعات حيوية يناقشها الملتقى البحري السعودي الدولي الرابع ضمن أجندة أعماله",
    publicationLabel: "الملتقى 2026 | يوليو 2026",
    featuredImageCaption:
      "تقع البنية التحتية في قاع البحار ومنظومات حمايتها في صميم الأجندة الاستراتيجية للنسخة الرابعة.",
    content: [
      {
        body:
          "تستعد العاصمة الرياض لاستضافة النسخة الرابعة من الملتقى البحري السعودي الدولي تحت رعاية صاحب السمو الملكي الأمير خالد بن سلمان بن عبدالعزيز آل سعود، وزير الدفاع، وتنظيم القوات البحرية الملكية السعودية، خلال الفترة من الثالث والعشرين إلى الخامس والعشرين من نوفمبر 2026، في وقت يشهد فيه العالم تحولات غير مسبوقة في البيئة البحرية، وتناميًا في التهديدات التي تطال البنية التحتية العميقة وسلاسل الإمداد العالمية؛ ويضم الملتقى في نسحته الرابعة برنامج وأجندة أعمال تعكس حجم التحديات التي تواجه البحار في عصر تتسارع فيه المتغيرات الجيوسياسية والتقنية.",
        visible: true,
      },
      {
        body:
          "وتحمل النسخة الرابعة عنوان “مستقبل أمن قاع البحار وسلاسل الإمداد في بيئة عالمية متغيرة”، وهو عنوان يعكس إدراكًا دوليًا متزايدًا لأهمية البنية التحتية الممتدة في الأعماق، من كابلات الاتصالات البحرية التي تحمل أكثر من 95% من بيانات العالم، إلى خطوط الطاقة التي تشكّل شريانًا رئيسيًا لحركة التجارة العالمية؛ وفي ظل ارتفاع مستوى المخاطر التي تستهدف هذه المنظومات، يبرز الملتقى كمنصة دولية تجمع الخبراء وصناع القرار من عشرات الدول لمناقشة مستقبل الأمن البحري بمنظور شامل يربط بين السطح والأعماق، وبين الطاقة والبيانات والتجارة.",
        visible: true,
      },
      {
        body:
          "وتتضمن أجندة أعمال الملتقى هذا العام نقاشات متقدمة حول التحولات في البيئة الاستراتيجية العالمية وتأثيرها على أمن سلاسل الإمداد البحرية، وما تفرضه الأزمات الدولية من ضغوط على حركة التجارة التي يعتمد عليها العالم في نقل 80% من السلع؛ كما يستعرض الملتقى المخاطر التي تطال خطوط الطاقة الممتدة تحت سطح البحر، وتأثيرها على استقرار الاقتصاد العالمي، في وقت كشفت فيه الأزمات الأخيرة هشاشة منظومات الإمداد وارتفاع تكاليف الشحن بأكثر من 350% عند تعطل ممر واحد فقط.",
        visible: true,
      },
      {
        body:
          "ويمتد النقاش ليشمل حماية قاع البحار والبنية الرقمية العميقة التي أصبحت جزءًا من الأمن الوطني للدول، مع التركيز على التحديات التي تواجه الكابلات البحرية التي تمتد لأكثر من 1.4 مليون كيلومتر، وما يرتبط بها من مخاطر سيبرانية تستهدف تعطيل الاتصالات العالمية وحركة الأسواق المالية؛ كما يتناول الملتقى دور الذكاء الاصطناعي والأنظمة غير المأهولة في تعزيز قدرات الردع والمراقبة وحماية البنية التحتية الممتدة في الأعماق، في ظل توسع الاعتماد العالمي على التقنيات الذكية في بيئة العمليات البحرية.",
        visible: true,
      },
      {
        body:
          "ويمثل انعقاد النسخة الرابعة فرصة فريدة للجهات الحكومية والعسكرية والقطاع الخاص والمؤسسات التقنية الدولية للمشاركة في صياغة رؤية مشتركة لمستقبل الأمن البحري، وبناء شراكات جديدة تعزز مرونة سلاسل الإمداد، وتدعم استقرار تدفق الطاقة والبيانات والتجارة في عالم سريع التغيرات؛ كما يشكل الملتقى منصة مثالية لاستعراض أحدث التقنيات البحرية، وتبادل الخبرات، والانخراط في حوار دولي يعيد تعريف أمن البحار بمنظور شامل يتسق مع طموحات رؤية السعودية 2030.",
        visible: true,
      },
      {
        body:
          "ويُعد حضور هذا الحدث فرصة استثنائية للجهات المعنية بالأمن البحري، والطاقة، والاتصالات، واللوجستيات، للمشاركة في نقاشات استراتيجية وصياغة حلول عملية تعالج التحديات المتنامية التي تواجه البنية التحتية البحرية وسلاسل الإمداد العالمية؛ ومع مشاركة وفود من أكثر من أربعين دولة، يفتح الملتقى الباب أمام تعاون دولي واسع يعزز استقرار البحار ويدعم مستقبل الاقتصاد العالمي.",
        highlight: true,
        visible: true,
      },
    ],
    seo: {
      ...englishUpdates[2].seo,
      title: "مستقبل أمن قاع البحار وسلاسل الإمداد | الملتقى 2026",
      description:
        "تعرّف على الموضوعات الاستراتيجية المتعلقة بالبنية التحتية في قاع البحار والأمن البحري وسلاسل الإمداد ضمن أجندة الملتقى الرابع.",
    },
  },
];

export function getSimfUpdates(locale: Locale): UpdateSeed[] {
  return locale === "ar" ? arabicUpdates : englishUpdates;
}

export function getSimfUpdatesPage(locale: Locale): PublicPage {
  const ar = locale === "ar";
  const landing = getSimfMicrositePage(locale, "simf-microsite-home");
  const header = landing.sections.find(
    (item) => item.blockType === "simfHeader",
  );
  const footer = landing.sections.find(
    (item) => item.blockType === "simfFooter",
  ) as SimfFooterSection;
  const hero: HeroSection = {
    anchorID: "updates-top",
    blockType: "hero",
    displayOrder: 10,
    internalLabel: "Updates archive introduction",
    visible: true,
    eyebrow: ar ? "أخبار الملتقى" : "SIMF NEWS",
    heading: ar ? "أخبار ورؤى الملتقى" : "News & Insights",
    body: ar
      ? "تابع آخر أخبار الملتقى والرؤى التي ترسم مستقبل الأمن البحري وحماية البنية التحتية في قاع البحار وسلاسل الإمداد."
      : "Follow the latest Forum news and perspectives shaping maritime security, seabed infrastructure and resilient supply chains.",
    media: `${assetRoot}/photos/forum-audience.webp`,
  };
  const cta: CallToActionSection = {
    anchorID: "updates-cta",
    blockType: "callToAction",
    displayOrder: 90,
    internalLabel: "Updates sponsorship call to action",
    visible: true,
    eyebrow: ar ? "حوّل الاهتمام إلى حضور مؤثر" : "FROM INSIGHT TO IMPACT",
    heading: ar
      ? "ضع جهتك في قلب حوار الأمن البحري"
      : "Position Your Organization at the Center of Maritime Security Dialogue",
    body: ar
      ? "تواصل مع فريق الشراكات لبناء مسار رعاية يناسب أولويات جهتك والجمهور الذي ترغب في الوصول إليه."
      : "Work with the partnership team to shape a sponsorship route around your objectives and the audience you need to reach.",
    media: `${assetRoot}/photos/forum-panel-wide.webp`,
    buttons: [
      {
        href: ar ? "/ar/sponsor" : "/sponsor",
        label: ar ? "كن راعياً" : "Become a Sponsor",
        style: "primary",
        trackingID: "simf-updates-sponsor",
      },
    ],
  };
  const indexLabels: UpdateIndexSection = {
    anchorID: "updates-index",
    blockType: "updateIndex",
    displayOrder: 20,
    internalLabel: "Updates archive and article interface labels",
    visible: true,
    readLabel: ar ? "اقرأ الخبر" : "Read article",
    backLabel: ar ? "العودة إلى الأخبار" : "Back to News & Insights",
    relatedHeading: ar ? "أخبار ذات صلة" : "Related News",
    viewAllLabel: ar ? "عرض جميع الأخبار" : "View all news",
  };

  return {
    pageType: "simf-microsite-updates",
    slug: "simf-microsite/updates",
    title: ar ? "أخبار ورؤى الملتقى" : "SIMF News & Insights",
    summary: hero.body,
    sections: [
      header || simfHeaderSection(locale, "updates"),
      hero,
      indexLabels,
      cta,
      footer,
    ],
    seo: {
      title: ar
        ? "أخبار ورؤى الملتقى البحري السعودي الدولي"
        : "News & Insights | SIMF 2026",
      description: hero.body,
      indexable: true,
      followLinks: true,
      openGraphImage: hero.media,
    },
  };
}
