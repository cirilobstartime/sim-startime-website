import path from "node:path";
import configPromise from "@payload-config";
import { getPayload } from "payload";

type Locale = "ar" | "en";
type JsonObject = Record<string, unknown>;
type Profile = {
  filename: string | Record<Locale, string>;
  name: Record<Locale, string>;
  body: Record<Locale, string>;
  href: Record<Locale, string> | string;
};
type Category = {
  key: string;
  heading: Record<Locale, string>;
  tier: string;
  showLabels?: boolean;
  profiles: Profile[];
};

const locales: Locale[] = ["en", "ar"];
const projectRoot = process.cwd();

const profiles: Record<string, Profile> = {
  gami: {
    filename: "gami-1.webp",
    name: {
      en: "General Authority for Military Industries (GAMI)",
      ar: "الهيئة العامة للصناعات العسكرية",
    },
    body: {
      en: "A Saudi government authority responsible for regulating, enabling, and developing the military industries sector in the Kingdom of Saudi Arabia. It works in close collaboration with public and private sector partners to support the localization and advancement of military industries, strengthen national defense manufacturing capabilities, and contribute to achieving localization objectives, positioning the sector as a key contributor to the national economy and a direct driver of GDP growth by 2030.",
      ar: "هيئة حكومية سعودية مختصة بتنظيم وتمكين وتطوير قطاع الصناعات العسكرية والمشرع للقطاع في المملكة العربية السعودية؛ وتعمل بشكل تكاملي مع كافة شركائها من القطاعين العام والخاص لدعم مسيرة توطين وتطوير قطاع الصناعات العسكرية، ولتعزيز قدرات التصنيع العسكرية الوطنية، والتي من شأنها أن تساهم في تحقيق مستهدفات التوطين، ليصبح أحد روافد الاقتصاد الوطني، ويساهم بشكل مباشر في الناتج المحلي الإجمالي بحلول العام 2030م",
    },
    href: {
      en: "https://www.gami.gov.sa/en",
      ar: "https://www.gami.gov.sa/ar",
    },
  },
  gadd: {
    filename: { en: "GADD Logo SECONDARY Right 1.webp", ar: "GADD.webp" },
    name: {
      en: "General Authority for Defense Development (GADD)",
      ar: "الهيئة العامة للتطوير الدفاعي",
    },
    body: {
      en: "A Saudi government authority responsible for defining the objectives and priorities of research, development, and innovation activities across defense technologies and systems, as well as establishing their policies, strategies, and implementation programs. The Authority also works to develop national capabilities, support technology and knowledge transfer, and advance the defense research, development, and innovation ecosystem.",
      ar: "هيئة حكومية سعودية تُعنى بتحديد أهداف وأولويات أنشطة البحث والتطوير والابتكار في مجالات التقنيات والأنظمة الدفاعية، ووضع سياساتها واستراتيجياتها وبرامجها التنفيذية، وإدارة وتوجيه منظومة التطوير الدفاعي؛ كما تعمل على بناء القدرات الوطنية، ودعم نقل التقنية والمعرفة، وتحفيز منظومة البحث والتطوير والابتكار في القطاع الدفاعي.",
    },
    href: "https://www.gadd.gov.sa/",
  },
  ust: {
    filename: "unmanned-systems-technology.webp",
    name: { en: "Unmanned Systems Technology (UST)", ar: "يو إس تي" },
    body: {
      en: "A specialist online media platform focused on unmanned and autonomous technologies across the air, land, maritime, and defense sectors. The platform provides industry-focused content, product knowledge resources, company information, market intelligence, and technology updates, connecting technology providers, end users, and decision-makers within the rapidly expanding global unmanned systems ecosystem.",
      ar: "منصة إعلامية رقمية متخصصة في تقنيات الأنظمة غير المأهولة والذاتية عبر القطاعات الجوية والبرية والبحرية والدفاعية؛ تنشر محتوى متخصصًا ودليلا معرفيا للمنتجات ومعلومات عن الشركات المتخصصة، بالاضافة إلى أخبار السوق والتطورات التقنية، بما يربط مزودي التقنيات والمستخدمين وصناع القرار ضمن منظومة عالمية متنامية للأنظمة غير المأهولة.",
    },
    href: "https://www.unmannedsystemstechnology.com/partner/?utm_campaign=MEDIA%20PARTNERSHIPS&utm_source=SIM2026&utm_medium=Logo&utm_content=UST",
  },
  defenseAdvancement: {
    filename: "defense-advancement.webp",
    name: { en: "Defense Advancement", ar: "ديفينس أدفانسمنت" },
    body: {
      en: "A specialist digital media platform focused on defense, security, and advanced technologies. The platform covers the latest innovations, solutions, and defense systems across land, air, maritime, and space domains. It also provides industry-focused content, product and company directories, and market intelligence, connecting technology developers, decision-makers, and stakeholders across the global defense ecosystem.",
      ar: "منصة إعلامية رقمية متخصصة في قطاعات الدفاع والأمن والتقنيات المتقدمة، تُعنى بتغطية أحدث الابتكارات والحلول والأنظمة الدفاعية عبر المجالات البرية والجوية والبحرية والفضائية؛ كما توفر محتوى متخصصًا وأدلة للمنتجات والشركات وأخبار الصناعة، بما يدعم التواصل بين مطوري التقنيات وصُنّاع القرار والجهات العاملة في المنظومة الدفاعية العالمية.",
    },
    href: "https://www.defenseadvancement.com/partner/?utm_campaign=MEDIA%20PARTNERSHIPS&utm_source=SIM2026&utm_medium=Logo&utm_content=DA",
  },
  ocean: {
    filename: "sponsors-partners-icon-10.webp",
    name: {
      en: "Ocean Science & Technology (OST)",
      ar: "أوشن ساينس آند تكنولوجي",
    },
    body: {
      en: "A specialist online media platform focused on ocean science and maritime technologies. The platform covers the latest innovations, solutions, and technologies used in marine and subsea environments, while providing industry knowledge resources, product and company directories, market intelligence, and technology updates that connect technology providers, researchers, operators, and decision-makers across the global ocean technology ecosystem.",
      ar: "منصة إلكترونية إعلامية متخصصة في علوم وتكنولوجيا المحيطات، تُعنى بتغطية أحدث الابتكارات والحلول والتقنيات المستخدمة في البيئات البحرية وتحت سطح البحر. وتوفر المنصة محتوى معرفيًا متخصصًا، وأدلة للمنتجات والشركات، وأخبار السوق والتطورات التقنية، بما يربط مزودي التقنيات والباحثين والمشغلين وصُنّاع القرار ضمن منظومة عالمية معنية بالعلوم والتقنيات البحرية.",
    },
    href: "https://www.oceansciencetechnology.com/partner/?utm_campaign=MEDIA%20PARTNERSHIPS&utm_source=SIM2026&utm_medium=Logo&utm_content=OST",
  },
  zamil: {
    filename: "zamil-diamond-sponsor.webp",
    name: { en: "ZM Naval", ar: "زد إم نافال" },
    body: {
      en: "ZM Naval was established through the merger of Zamil Marine Shipbuilding & Repair and Middle East Marine Maintenance (MEMR), forming a unified national maritime company that delivers integrated solutions across the entire vessel lifecycle. The company combines advanced capabilities in ship design, construction, repair, maintenance, logistics support, and technical training, serving both military and commercial fleets. Operating across Saudi Arabia’s coastlines, ZM Naval contributes to strengthening national maritime capabilities and supporting the objectives of Saudi Vision 2030.",
      ar: "شركة بحرية سعودية تأسست نتيجة اندماج شركتي الزامل لبناء وإصلاح السفن وشركة الشرق الأوسط البحرية للصيانة MEMR، لتشكل كيانًا موحدًا يقدم حلولًا متكاملة تغطي كامل دورة حياة السفن؛ وتجمع الشركة بين قدرات متقدمة في تصميم السفن وبنائها وإصلاحها وصيانتها، إلى جانب الدعم اللوجستي والتدريب الفني، لخدمة الأساطيل العسكرية والتجارية؛ ومن خلال عملياتها الممتدة على سواحل المملكة، تسهم الشركة في تعزيز القدرات البحرية الوطنية ودعم مستهدفات رؤية السعودية 2030.",
    },
    href: "https://www.linkedin.com/company/zm-naval/about/",
  },
  bae: {
    filename: "BAES logo.webp",
    name: { en: "BAE Systems Saudi Arabia", ar: "بي إيه إي سيستمز السعودية" },
    body: {
      en: "A leading defense and technology company and part of the global BAE Systems group. Operating in Saudi Arabia for more than five decades, the company supports national defense and security capabilities through advanced air, maritime, and land systems, as well as training, engineering, and technical support services. It is also committed to developing national talent and advancing technology and knowledge transfer in line with the objectives of Saudi Vision 2030.",
      ar: "شركة دفاعية وتقنية رائدة، تُعد جزءًا من BAE Systems العالمية، وتعمل في المملكة العربية السعودية منذ أكثر من خمسة عقود لدعم القدرات الدفاعية والأمنية الوطنية؛ وتقدم الشركة حلولًا متقدمة في مجالات الأنظمة الجوية والبحرية والبرية، إلى جانب التدريب والدعم الهندسي والتقني، مع التركيز على تطوير الكفاءات الوطنية ونقل المعرفة والتقنية بما يتماشى مع مستهدفات رؤية السعودية 2030.",
    },
    href: {
      en: "https://www.baesystems.com/en-sa/",
      ar: "https://www.baesystems.com/ar-sa/",
    },
  },
  fincantieri: {
    filename: "fincactieri-1.png",
    name: {
      en: "Fincantieri Arabia for Naval Services",
      ar: "فينكانتيري العربية للخدمات البحرية",
    },
    body: {
      en: "A specialized maritime and defense services company established as a subsidiary of the global Fincantieri Group in Saudi Arabia; the company provides advanced naval support and service solutions, delivering engineering, technical, and lifecycle support services for maritime platforms and systems. Leveraging the Group’s global expertise in shipbuilding and advanced maritime technologies, it contributes to the development of national maritime capabilities.",
      ar: "شركة متخصصة في الخدمات البحرية والدفاعية، تأسست كشركة تابعة لمجموعة Fincantieri العالمية في المملكة العربية السعودية لتقديم الدعم والخدمات البحرية المتقدمة؛ وتعمل الشركة على توفير الحلول الهندسية والفنية وخدمات الإسناد والدعم للأساطيل والأنظمة البحرية، مستفيدةً من الخبرات العالمية للمجموعة في بناء السفن والتقنيات البحرية المتقدمة، بما يسهم في دعم تنمية القدرات البحرية الوطنية.",
    },
    href: "https://www.fincantieri.com/en/group/company/subsidiaries-and-associates/Fincantieri-Arabia-for-Naval-Services",
  },
  navantia: {
    filename: "navantia.webp",
    name: { en: "Navantia", ar: "نافانتيا" },
    body: {
      en: "A leading Spanish shipbuilding and naval defense company specializing in the design, construction, and support of advanced naval platforms, including frigates, submarines, support vessels, and naval combat systems. The company delivers integrated solutions covering design, engineering, manufacturing, maintenance, and lifecycle logistics support, drawing on decades of experience serving naval forces around the world.",
      ar: "شركة إسبانية رائدة في بناء السفن والأنظمة البحرية الدفاعية، متخصصة في تصميم وتشييد ودعم السفن العسكرية المتقدمة، بما في ذلك الفرقاطات والغواصات وسفن الدعم البحري وأنظمة القتال البحرية. وتقدم الشركة حلولًا متكاملة تشمل التصميم والهندسة والتصنيع والصيانة والدعم اللوجستي طوال دورة حياة المنصات البحرية، مستندةً إلى خبرة تمتد لعقود في خدمة القوات البحرية حول العالم.",
    },
    href: "https://www.navantia.es/en/",
  },
  leonardo: {
    filename: "Leonardo.webp",
    name: { en: "Leonardo", ar: "ليوناردو" },
    body: {
      en: "A global leader in the aerospace, defense, and security sectors, providing advanced technologies and solutions across helicopters, defense electronics, naval systems, cybersecurity, and unmanned systems. Operating in the Kingdom of Saudi Arabia through long-standing partnerships, the company contributes to strengthening national capabilities, advancing technology and knowledge transfer, and developing local talent to support a sustainable and advanced defense and security ecosystem.",
      ar: "شركة عالمية رائدة في قطاعات الطيران والدفاع والأمن، تقدم حلولًا وتقنيات متقدمة في مجالات الطيران العمودي، والإلكترونيات الدفاعية، والأنظمة البحرية، والأمن السيبراني، والأنظمة غير المأهولة. وتعمل الشركة في المملكة العربية السعودية من خلال شراكات طويلة الأمد تسهم في دعم القدرات الوطنية، ونقل المعرفة والتقنية، وتطوير الكفاءات البشرية، بما يعزز بناء منظومة دفاعية وأمنية متقدمة ومستدامة.",
    },
    href: {
      en: "https://www.leonardo.com/en/global/saudi-arabia",
      ar: "https://www.leonardo.com/ar/global/saudi-arabia",
    },
  },
  sami: {
    filename: "SAMI Navantia.webp",
    name: {
      en: "SAMI Navantia Naval Industries",
      ar: "سامي نافانتيا للصناعات البحرية",
    },
    body: {
      en: "A Saudi company specialized in naval defense systems and industries, established in 2019 as a strategic joint venture between Saudi Arabian Military Industries (SAMI) and Spain’s Navantia. The company aims to become the regional reference for naval mission systems by supporting the Kingdom’s objective of localizing 50% of defense spending under Saudi Vision 2030, while strengthening national capabilities through innovation, collaboration, and the development of advanced naval defense industries.",
      ar: "شركة سعودية متخصصة في الصناعات والأنظمة البحرية الدفاعية، تأسست كشراكة بين الشركة السعودية للصناعات العسكرية (SAMI) ونافانتيا الإسبانية في عام 2019؛ وتهدف الشركة إلى أن تكون المرجع الإقليمي للأنظمة والمهام البحرية، من خلال دعم توطين 50% من الإنفاق الدفاعي للمملكة وفق مستهدفات رؤية السعودية 2030، وتعزيز القدرات الوطنية عبر الابتكار ونقل المعرفة وتطوير الصناعات البحرية الدفاعية.",
    },
    href: { en: "https://www.sami.com.sa/", ar: "https://www.sami.com.sa/ar/" },
  },
  aljawda: {
    filename: "Aljawdaw.webp",
    name: { en: "AlJawda Manufacturing Company", ar: "شركة الجودة للتصنيع" },
    body: {
      en: "A Saudi company specializing in spare parts manufacturing, metal fabrication, and equipment maintenance and repair. With experience dating back to 2006, the company provides precision machining, custom metal manufacturing, and industrial maintenance solutions. Its services include custom component production, heavy and industrial equipment maintenance, and overhaul and repair services, helping improve operational efficiency, reduce downtime, and enhance business continuity.",
      ar: "شركة سعودية متخصصة في تصنيع قطع الغيار وتشكيل المعادن وصيانة وإصلاح المعدات، تمتلك خبرة ممتدة منذ عام 2006 في الخراطة الدقيقة والتصنيع المعدني والصيانة الصناعية؛ وتقدم الشركة حلولًا متكاملة تشمل تصنيع القطع حسب الطلب، وصيانة المعدات الثقيلة والصناعية، وأعمال التوضيب والإصلاح، بما يسهم في رفع كفاءة الأصول التشغيلية وتقليل فترات التوقف وتعزيز استمرارية الأعمال.",
    },
    href: "http://aljawda.sa/",
  },
  couach: {
    filename: "Chantier-Naval-Couach.webp",
    name: { en: "Couach", ar: "كواش" },
    body: {
      en: "A French shipbuilding company specialized in the design and construction of high-performance fast vessels for defense, security, and specialized maritime applications. With decades of experience, the company develops advanced naval platforms, including interceptor boats, patrol vessels, and tactical craft, with a strong focus on innovation, quality, and operational reliability to meet the requirements of naval forces, coast guards, and security organizations worldwide.",
      ar: "شركة فرنسية متخصصة في تصميم وبناء القوارب والسفن السريعة عالية الأداء للاستخدامات الدفاعية والأمنية والبحرية المتخصصة؛ وتتمتع بخبرة تمتد لعقود في تطوير المنصات البحرية المتقدمة، بما في ذلك زوارق الاعتراض والدوريات والسفن التكتيكية، مع التركيز على الابتكار والجودة والاعتمادية التشغيلية لتلبية متطلبات القوات البحرية وخفر السواحل والجهات الأمنية حول العالم.",
    },
    href: "https://couach.com/en/",
  },
  bridge: {
    filename: "Bridge Exhibitions.webp",
    name: { en: "Bridge Exhibitions", ar: "بريدج للمعارض" },
    body: {
      en: "A specialized exhibitions, conferences, and events management company dedicated to creating professional platforms that bring together government entities, industry leaders, decision-makers, and subject-matter experts across diverse sectors. The company delivers high-impact events that foster professional engagement, support knowledge exchange, and provide an environment for building partnerships and exploring business and investment opportunities.",
      ar: "شركة متخصصة في تنظيم وإدارة المعارض والمؤتمرات والفعاليات المهنية، تعمل على تطوير منصات تجمع الجهات الحكومية وقادة الصناعة وصُنّاع القرار والمتخصصين من مختلف القطاعات؛ وتسهم الشركة في تصميم وتنفيذ فعاليات نوعية تعزز التواصل المهني، وتدعم تبادل المعرفة، وتوفر بيئة تُمكّن من بناء الشراكات واستكشاف الفرص التجارية والاستثمارية.",
    },
    href: "https://www.bridgeexhibitions.com/",
  },
  eye: {
    filename: "eye-of-riyadh.webp",
    name: { en: "Eye of Riyadh", ar: "عين الرياض" },
    body: {
      en: "A leading digital media platform specializing in business, economic, investment, and events coverage across Saudi Arabia and the region. The platform provides up-to-date news, corporate directories, and event coverage, connecting business communities, decision-makers, and stakeholders across a wide range of economic and development sectors.",
      ar: "منصة إعلامية ورقمية متخصصة في تغطية أخبار الأعمال والاقتصاد والاستثمار والفعاليات في المملكة العربية السعودية والمنطقة؛ وتوفر المنصة محتوى إخباريًا متجددًا، وأدلة للجهات والشركات، وتغطية للفعاليات والمؤتمرات، بما يربط مجتمع الأعمال وصُنّاع القرار والمهتمين بمختلف القطاعات الاقتصادية والتنموية.",
    },
    href: "https://www.eyeofriyadh.com/",
  },
  impact: {
    filename: "impact-event-production.webp",
    name: { en: "Impact Events", ar: "إمباكت إيفينتس" },
    body: {
      en: "A Saudi company specializing in the management and execution of exhibitions and conferences, operating within the Startime Alliance. The company specializes in planning business events in accordance with international best practices, as well as venue management, contractor management, procurement, and operational services. It also utilizes advanced production technologies that support environmentally sustainable events and leverages a broad network of local and international partners to deliver events in line with the highest international standards and specifications.",
      ar: "شركة سعودية متخصصة في إدارة وتنفيذ المعارض والمؤتمرات، تعمل ضمن تحالف ستارتايم؛ وتتخصص في تخطيط فعاليات الأعمال وفق أفضل الممارسات العالمية، وإدارة الموقع، وإدارة المقاولين، والتوريدات؛ وتمتلك أحدث التقنيات الإنتاجية للأحداث الصديقة للبيئة، مع شبكة شركاء محليون ودوليون واسعة، مطبقةً في تنفيذ الأحداث أعلى المعايير والمواصفات العالمية.",
    },
    href: "http://impactevents.sa/",
  },
  advisory: {
    filename: "united-advisory-chamber.webp",
    name: { en: "United Advisory Chamber", ar: "يونايتد أدفايسوري شامبر" },
    body: {
      en: "A specialized advisory firm focused on market research, marketing intelligence, and strategic consulting, operating within the Startime Alliance. The firm provides knowledge and creative content development for business events, as well as specialized studies, analytical research, and the design of high-value programs for international forums, conferences, and exhibitions. Its services also include the coordination of business meetings, Business-to-Government (B2G) engagements, and commercial deal facilitation. Through the development of globally competitive Saudi content, the firm contributes to advancing the business events industry while enhancing the institutional impact and competitiveness of major events.",
      ar: "بيت خبرة استشاري متخصص في دراسات السوق والأبحاث التسويقية والاستشارات الاستراتيجية، يعمل ضمن تحالف ستارتايم؛ وتتضمن خدماته تطوير المحتوى المعرفي والإبداعي لفعاليات الأعمال، وإعداد الدراسات والتحليلات المتخصصة، وبناء البرامج النوعية للمنتديات والمؤتمرات والمعارض الدولية، وكذلك تنسيق اجتماعات الأعمال واجتماعات الأعمال الحكومية وإدارة الصفقات التجارية؛ ويسهم في تطوير صناعة اجتماعات الأعمال من خلال تقديم محتوى سعودي ذي معايير عالمية يدعم التنافسية ويعزز الأثر المؤسسي للأحداث.",
    },
    href: "https://un-chamber.com/",
  },
  startime: {
    filename: "startime-licensed.webp",
    name: { en: "Startime Events", ar: "ستارتايم إيفينتس" },
    body: {
      en: "A Saudi company established in 2009 and a member of both the UFI – The Global Association of the Exhibition Industry and the International Association of Exhibitions and Events (IAEE). The company is recognized as one of Saudi Arabia leading business event’s organizers and managers, with an extensive track record in delivering high-profile government events. Its advanced operational methodology combines strategic planning, professional project management, governance, and innovative experience design, enabling the successful delivery of national projects in accordance with world-class standards.",
      ar: "شركة سعودية تأسست عام 2009، عضو الاتحاد الدولي للمعارض UFI والرابطة الدولية للمعارض والفعاليات IAEE؛ وتُعد من الشركات الوطنية الرائدة في صناعة وتنظيم وإدارة فعاليات الأعمال؛ وتمتلك سجلًا حافلًا في تنظيم الفعاليات الحكومية رفيعة المستوى، وتستند إلى منهجية تشغيلية متقدمة تجمع بين التخطيط الاستراتيجي وإدارة المشاريع الاحترافية والحوكمة والابتكار في تصميم التجارب؛ بما يعزز قدرتها على تنفيذ مشاريع وطنية بمعايير عالمية.",
    },
    href: { en: "https://startime.sa/", ar: "https://startime.sa/ar/" },
  },
};

const categories: Category[] = [
  {
    key: "strategic",
    heading: { en: "Strategic Partners", ar: "الشركاء الاستراتيجيون" },
    tier: "strategic",
    showLabels: false,
    profiles: [profiles.gami, profiles.gadd],
  },
  {
    key: "strategic-media",
    heading: {
      en: "Strategic Media Partners",
      ar: "الشركاء الإعلاميون الإستراتيجيون",
    },
    tier: "media-partner",
    profiles: [profiles.ust, profiles.defenseAdvancement, profiles.ocean],
  },
  {
    key: "diamond",
    heading: { en: "Diamond Sponsors", ar: "الرعاة الماسيون" },
    tier: "diamond",
    profiles: [profiles.zamil],
  },
  {
    key: "platinum",
    heading: { en: "Platinum Sponsors", ar: "الرعاة البلاتينيون" },
    tier: "platinum",
    profiles: [profiles.bae],
  },
  {
    key: "gold",
    heading: { en: "Gold Sponsors", ar: "الرعاة الذهبيون" },
    tier: "gold",
    profiles: [
      profiles.fincantieri,
      profiles.navantia,
      profiles.leonardo,
      profiles.sami,
    ],
  },
  {
    key: "silver",
    heading: { en: "Silver Sponsors", ar: "الرعاة الفضيون" },
    tier: "silver",
    profiles: [profiles.aljawda],
  },
  {
    key: "co-sponsor",
    heading: { en: "Co-Sponsors", ar: "الرعاة المشاركون" },
    tier: "co-sponsor",
    profiles: [profiles.couach],
  },
  {
    key: "marketing",
    heading: { en: "Marketing Partners", ar: "شركاء التسويق" },
    tier: "marketing-partner",
    profiles: [profiles.bridge, profiles.eye],
  },
  {
    key: "official-contractor",
    heading: { en: "Official Contractor", ar: "المقاول الرسمي" },
    tier: "official-contractor",
    profiles: [profiles.impact],
  },
  {
    key: "advisory-arm",
    heading: { en: "Advisory Arm", ar: "الذراع الاستشاري" },
    tier: "advisory-arm",
    profiles: [profiles.advisory],
  },
  {
    key: "licensed-to",
    heading: { en: "Licensed To", ar: "مرخص لـ" },
    tier: "licensed-to",
    profiles: [profiles.startime],
  },
];

function clone<T>(value: T): T {
  return structuredClone(value);
}
function objects(value: unknown): JsonObject[] {
  return Array.isArray(value)
    ? value.filter(
        (entry): entry is JsonObject =>
          Boolean(entry) && typeof entry === "object" && !Array.isArray(entry),
      )
    : [];
}
function object(value: unknown): JsonObject {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as JsonObject)
    : {};
}
function addBetaNavigation(sections: JsonObject[], locale: Locale) {
  const header = sections.find((section) => section.blockType === "simfHeader");
  if (!header) return sections;
  const href = locale === "ar" ? "/ar/partners-beta" : "/partners-beta";
  header.links = [
    ...objects(header.links).filter(
      (link) => !String(link.href || "").endsWith("/partners-beta"),
    ),
    { href, label: locale === "ar" ? "الشركاء Beta" : "Partners Beta" },
  ];
  return sections;
}

const payload = await getPayload({ config: configPromise });

async function mediaID(filename: string) {
  const result = await payload.find({
    collection: "media",
    depth: 0,
    limit: 1,
    overrideAccess: true,
    where: { filename: { equals: filename } },
  });
  if (!result.docs[0]) throw new Error(`Missing media file: ${filename}`);
  return result.docs[0].id;
}

async function ensureIntroMedia() {
  const usageNotes =
    "Partners Beta introduction supplied by client on 2026-09-13";
  const existing = await payload.find({
    collection: "media",
    depth: 0,
    limit: 1,
    locale: "en",
    overrideAccess: true,
    where: { usageNotes: { equals: usageNotes } },
  });
  const media =
    existing.docs[0] ||
    (await payload.create({
      collection: "media",
      data: {
        alt: "Saudi government and military leaders at a maritime defense exhibition",
        title: "Partners shaping the future of maritime security",
        usageNotes,
      },
      filePath: path.join(
        projectRoot,
        "public/assets/simf-microsite/partners/partners-maritime-security-exhibition.jpg",
      ),
      locale: "en",
      overrideAccess: true,
    }));
  await payload.update({
    collection: "media",
    id: media.id,
    locale: "ar",
    overrideAccess: true,
    data: {
      alt: "قيادات حكومية وعسكرية سعودية في معرض للدفاع والأمن البحري",
      title: "شركاء في صناعة مستقبل الأمن البحري",
    },
  });
  return media.id;
}

async function profileSection(
  category: Category,
  locale: Locale,
  index: number,
): Promise<JsonObject> {
  return {
    blockType: "partnerCategory",
    blockName: category.heading[locale],
    internalLabel: category.heading.en,
    anchorID: `partner-category-${category.key}`,
    displayOrder: 50 + index * 10,
    visible: true,
    heading: category.heading[locale],
    presentationStyle: "partner-profiles",
    showSectionHeading: true,
    showProfileCategoryLabels: category.showLabels !== false,
    logoLayout: "grid",
    appearance: { theme: "light", spacing: "large", overlayOpacity: 45 },
    logos: await Promise.all(
      category.profiles.map(async (profile) => ({
        visible: true,
        name: profile.name[locale],
        description: profile.body[locale],
        logo: await mediaID(
          typeof profile.filename === "string"
            ? profile.filename
            : profile.filename[locale],
        ),
        tier: category.tier,
        href:
          typeof profile.href === "string"
            ? profile.href
            : profile.href[locale],
        openInNewTab: true,
        showCategoryLabel: true,
      })),
    ),
  };
}

function sponsorFormSection(source: JsonObject, locale: Locale): JsonObject {
  const section = clone(source);
  section.anchorID = "sponsorship-application";
  section.displayOrder = 190;
  section.eyebrow = locale === "ar" ? "طلب الرعاية" : "SPONSORSHIP APPLICATION";
  section.heading =
    locale === "ar"
      ? "أخبرنا عن أهدافك من الرعاية"
      : "Tell Us About Your Sponsorship Goals";
  section.body =
    locale === "ar"
      ? "شاركنا بياناتك الأساسية وأهدافك الأولية من المشاركة، وسيقوم فريق الرعايات بالتواصل معك لمناقشة المسار الأنسب لأهدافك."
      : "Share your essential details and initial goals for participation.";
  return section;
}

async function betaSections(
  source: JsonObject[],
  sponsorForm: JsonObject,
  locale: Locale,
  introMedia: number | string,
) {
  const ar = locale === "ar";
  const sections = addBetaNavigation(clone(source), locale);
  const header = object(
    sections.find((section) => section.blockType === "simfHeader"),
  );
  const hero = object(sections.find((section) => section.blockType === "hero"));
  const intro = object(
    sections.find((section) => section.anchorID === "page-introduction"),
  );
  const directoryIntro = object(
    sections.find((section) => section.anchorID === "partner-directory-intro"),
  );
  const supervision = object(
    sections.find(
      (section) => section.anchorID === "partner-category-supervision",
    ),
  );
  const footer = object(
    sections.find((section) => section.blockType === "simfFooter"),
  );

  hero.heading = ar
    ? "كن جزءًا من الحدث الاستثنائي...\nوشارك في صناعة مستقبل الأمن البحري"
    : "Be part of this exceptional event…\n& help shape the future of maritime security";
  hero.body = ar
    ? "إن رعاية منشآتك لفعاليات الملتقى البحري السعودي الدولي تفسر ارتباطها الوثيق بأحد أسرع القطاعات توسعًا ونموًا، وبواحدة من أهم فعاليات الأعمال وأكثرها تأثيرًا في الوقت الراهن؛ وتأكيد لحضورها المؤسسي مع أبرز متخذي القرار الحكوميين وكبرى المنشآت والمؤسسات الوطنية والإقليمية والدولية؛ مما ينعكس إيجابًا على تمكينها من بناء شراكات واعدة ممتدة الأثر."
    : "Sponsoring your company participation in the SIM Forum underscores its connection to one of the fastest-growing sectors, and to one of today’s most influential and trend-setting government-focused business events.\n\nIt affirms your institutional presence among key government decision-makers and leading national, regional, and international entities, enabling the creation of high-value, long-term partnerships with meaningful impact.";

  intro.media = introMedia;
  intro.eyebrow = null;
  intro.heading = ar
    ? "صُناع مستقبل الأمن البحري"
    : "Partners in Shaping the Future of Maritime Security";
  intro.body = ar
    ? "يؤكد شركاء ورعاة الملتقى البحري السعودي الدولي الرابع اهتمامهم الكبير بقضايا الأمن البحري، وما يؤكد ذلك مشاركتهم في دعم الملتقى لاستعراض التقنيات المتقدمة والحلول المتكاملة في تطوير منظومات الأمن البحري وحماية البنية التحتية الحيوية فوق سطح البحر وفي أعماقه وتعزيز التعاون الدولي لضمان استدامة تدفق الطاقة والتجارة والبيانات عبر الممرات البحرية الحيوية."
    : "The partners and sponsors of the 4th Saudi International Maritime Forum play a strategic role in advancing maritime security by supporting a global platform dedicated to showcasing advanced technologies and integrated solutions; their contribution strengthens the protection of critical maritime and subsea infrastructure and promotes international cooperation to safeguard the continuous flow of energy, trade, and data across strategic maritime corridors.";

  supervision.heading = ar
    ? "الإشراف والتنظيم"
    : "Supervision and Organization";
  supervision.showSectionHeading = false;
  supervision.presentationStyle = "logo-cards";
  supervision.logoLayout = "grid";
  supervision.logos = objects(supervision.logos)
    .slice(0, 2)
    .map((logo) => ({ ...logo, tier: "none", showCategoryLabel: false }));

  directoryIntro.eyebrow = null;
  directoryIntro.heading = ar ? "الشركاء والرعاة" : "Sponsors & Partners";
  directoryIntro.body = ar
    ? "نفخر بشركاء ورعاة الملتقى الذين يساهمون بخبراتهم وحلولهم وقدراتهم في دعم الحوار الدولي حول الأمن البحري وتعزيز التعاون وتطوير الحلول التي تسهم في حماية المصالح البحرية العالمية."
    : "We take pride in the Forum’s partners and sponsors, whose expertise, capabilities, and innovative solutions contribute to advancing international dialogue on maritime security, strengthening cooperation, and developing solutions that support the protection of global maritime interests.";

  const categorySections = await Promise.all(
    categories.map((category, index) =>
      profileSection(category, locale, index),
    ),
  );
  return [
    header,
    hero,
    intro,
    supervision,
    directoryIntro,
    ...categorySections,
    sponsorFormSection(sponsorForm, locale),
    footer,
  ];
}

const source = await payload.find({
  collection: "pages",
  depth: 0,
  fallbackLocale: false,
  limit: 1,
  locale: "en",
  overrideAccess: true,
  where: { slug: { equals: "simf-microsite/partners" } },
});
if (!source.docs[0]) throw new Error("Local Partners page was not found.");
const existing = await payload.find({
  collection: "pages",
  depth: 0,
  fallbackLocale: false,
  limit: 1,
  locale: "en",
  overrideAccess: true,
  where: { slug: { equals: "simf-microsite/partners-beta" } },
});
let betaID = existing.docs[0]?.id;
const introMedia = await ensureIntroMedia();

for (const locale of locales) {
  const [localizedSource, sponsorPage] = await Promise.all([
    payload.find({
      collection: "pages",
      depth: 0,
      fallbackLocale: false,
      limit: 1,
      locale,
      overrideAccess: true,
      where: { id: { equals: source.docs[0].id } },
    }),
    payload.find({
      collection: "pages",
      depth: 0,
      fallbackLocale: false,
      limit: 1,
      locale,
      overrideAccess: true,
      where: { slug: { equals: "simf-microsite/sponsor" } },
    }),
  ]);
  const sourcePage = localizedSource.docs[0] as unknown as JsonObject;
  const sponsor = sponsorPage.docs[0] as unknown as JsonObject;
  const formSection = objects(sponsor.sections).find(
    (section) => section.blockType === "form",
  );
  if (!formSection)
    throw new Error(`Missing ${locale} sponsorship form section.`);
  const data = {
    _status: "published",
    internalTitle: "SIMF Microsite — Partners Beta",
    pageType: "simf-microsite-partners",
    sections: await betaSections(
      objects(sourcePage.sections),
      formSection,
      locale,
      introMedia,
    ),
    seo: {
      ...object(sourcePage.seo),
      canonicalURL: null,
      includeInSitemap: false,
      indexable: false,
    },
    showInNavigation: true,
    navigationLabel: locale === "ar" ? "الشركاء Beta" : "Partners Beta",
    slug: "simf-microsite/partners-beta",
    summary: sourcePage.summary,
    title:
      locale === "ar"
        ? "الشركاء والرعاة — Beta"
        : "Sponsors and Partners — Beta",
    visible: true,
  };
  if (!betaID) {
    const created = await payload.create({
      collection: "pages",
      data: data as never,
      draft: false,
      locale,
      overrideAccess: true,
    });
    betaID = created.id;
  } else {
    await payload.update({
      collection: "pages",
      id: betaID,
      data: data as never,
      draft: false,
      locale,
      overrideAccess: true,
    });
  }
}

console.log(
  `Partners Beta is ready in both locales (page id ${betaID}, introduction media ${introMedia}).`,
);
