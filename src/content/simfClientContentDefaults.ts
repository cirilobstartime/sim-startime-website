import {
  partnerSection,
  simfHeaderSection,
  simfSponsorForm,
  speakerSection,
} from "./simfMicrositeDefaults";
import { simfClientArabicTranslations } from "./simfClientArabicTranslations.generated";
import type {
  Button,
  CallToActionSection,
  FormDefinition,
  HeroSection,
  Locale,
  MediaFeatureSection,
  PageSection,
  PartnerCategorySection,
  PublicPage,
  SimfFooterSection,
  SpeakerDirectorySection,
} from "./types";

export type ClientContentPageKey =
  | "contact"
  | "government-b2g"
  | "legacy"
  | "partners"
  | "programme"
  | "speakers"
  | "sponsors";

const assets = "/assets/simf-microsite";

function action(
  href: string,
  label: string,
  style: Button["style"] = "primary",
  trackingID?: string,
): Button {
  return { href, label, style, trackingID };
}

function clientFooter(): SimfFooterSection {
  return {
    anchorID: "footer",
    blockType: "simfFooter",
    displayOrder: 1000,
    internalLabel: "Footer",
    visible: true,
    logo: "/assets/simf-microsite/organizers/simf-mark.webp",
    logoAlt: "Saudi International Maritime Forum",
    bio: "Saudi International Maritime Forum 2026\nThe Future of Seabed Security and Maritime Supply Chains in a Critically Changing World\n23–25 November 2026\nSofitel Riyadh Hotel & Convention Center, Saudi Arabia\nSupervised by the Ministry of Defense\nOrganized by the Royal Saudi Naval Forces\nLicensed to Startime",
    address: "3507, Riyadh 12341\nSaudi Arabia",
    phone: "920010500",
    email: "sim@startime.sa",
    contactHeading: "Contact",
    socialLinks: [
      { platform: "x", href: "https://x.com/startimeevents" },
      {
        platform: "linkedin",
        href: "https://sa.linkedin.com/company/startimeevents",
      },
      { platform: "youtube", href: "https://www.youtube.com/@Startime_Events" },
    ],
    importantLinks: [
      { label: "Home", href: "/" },
      { label: "Programme", href: "/programme" },
      { label: "Speakers", href: "/speakers" },
      { label: "Sponsors & Partners", href: "/partners" },
      { label: "B2G Opportunities", href: "/b2g" },
      { label: "Become a Sponsor", href: "/sponsor" },
      { label: "Legacy", href: "/legacy" },
      { label: "News & Media Center", href: "/updates" },
    ],
    linksHeading: "Explore SIM",
    privacyLabel: "Privacy Policy",
    privacyHref: "https://startime.sa/privacy-policy",
    homeLabel: "Home",
    copyright: "© 2026 Startime. All rights reserved.",
  };
}

function clientHeader() {
  const header = simfHeaderSection("en", "content");
  return {
    ...header,
    logo: "/assets/simf-microsite/organizers/simf-mark.webp",
    links: [
      { href: "/", label: "Home" },
      { href: "/programme", label: "Programme" },
      { href: "/speakers", label: "Speakers" },
      { href: "/partners", label: "Sponsors & Partners" },
      { href: "/b2g", label: "B2G Opportunities" },
      { href: "/legacy", label: "Legacy" },
      { href: "/updates", label: "News & Media Center" },
      { href: "/contact", label: "Contact" },
    ],
  };
}

function hero(
  heading: string,
  body: string,
  media: string,
  buttons: Button[] = [],
  eyebrow?: string,
): HeroSection {
  return {
    anchorID: "page-hero",
    blockType: "hero",
    displayOrder: 10,
    internalLabel: "Page introduction",
    visible: true,
    eyebrow,
    heading,
    body,
    media: media.startsWith("/") ? media : `${assets}/photos/${media}`,
    buttons,
  };
}

function intro(
  heading: string,
  body: string,
  media: string,
  cta?: Button,
): MediaFeatureSection {
  return {
    anchorID: "page-introduction",
    blockType: "mediaFeature",
    displayOrder: 20,
    internalLabel: "Page introduction",
    visible: true,
    heading,
    body,
    media: media.startsWith("/") ? media : `${assets}/photos/${media}`,
    mediaPosition: "end",
    theme: "light",
    ctaHref: cta?.href,
    ctaLabel: cta?.label,
  };
}

function finalCTA(
  heading: string,
  body: string,
  buttons: Button[],
  media = "naval-formation-sunset.webp",
  eyebrow?: string,
): CallToActionSection {
  return {
    anchorID: "conversion",
    blockType: "callToAction",
    displayOrder: 900,
    internalLabel: "Final call to action",
    visible: true,
    eyebrow,
    heading,
    body,
    media: media.startsWith("/") ? media : `${assets}/photos/${media}`,
    buttons,
  };
}

function programmeSections(): PageSection[] {
  const days = [
    {
      title: "Day One: Maritime Energy Supply Chains",
      body: "The security and resilience of maritime energy flows, offshore and coastal infrastructure, subsea energy pipelines, strategic energy assets, and the continuity of global energy supplies.",
      media: `${assets}/programme/day-1-maritime-energy-supply-chains.webp`,
      icon: "anchor",
    },
    {
      title: "Day Two: Maritime Transport and Supply Chains",
      body: "The security of international trade routes, port operations, maritime logistics, cargo flows, transport connectivity, and global supply chains.",
      media: `${assets}/programme/day-2-maritime-transport-supply-chains.webp`,
      icon: "chart",
    },
    {
      title: "Day Three: Seabed Security and Digital Infrastructure",
      body: "The protection of subsea communications cables and underwater assets, maritime surveillance, cybersecurity, autonomous systems, advanced sensing, and critical digital infrastructure.",
      media: `${assets}/programme/day-3-seabed-security-digital-infrastructure.webp`,
      icon: "circuitry",
    },
  ];
  const highlights = [
    {
      title: "Keynote Sessions",
      body: "Strategic perspectives from senior naval, government, and industry leaders on the priorities shaping maritime security and global supply chains.",
      icon: "megaphone",
    },
    {
      title: "Expert Presentations",
      body: "Specialized insights into operational challenges, emerging technologies, and approaches to protecting critical maritime and subsea infrastructure.",
      icon: "lightbulb",
      media: `${assets}/programme/strategic-panel-discussions.webp`,
    },
    {
      title: "Strategic Panel Discussions",
      body: "High-level discussions bringing together decision-makers and experts to examine the Forum’s principal themes and their implications for international maritime security and cooperation.",
      icon: "users",
      media: `${assets}/programme/strategic-panel-discussions.webp`,
    },
    {
      title: "B2G Meetings",
      body: "Structured meetings connecting eligible sponsors with relevant Saudi government and military stakeholders to support institutional dialogue and potential cooperation.",
      icon: "handshake",
      media: `${assets}/programme/b2g-military-engagement.webp`,
    },
    {
      title: "Outcomes and Strategic Recommendations",
      body: "Key insights and recommendations developed through the Forum’s discussions to support cooperation and inform future maritime security priorities.",
      icon: "compass",
    },
  ];
  const topics = [
    {
      title: "Global Strategic Shifts and Maritime Supply Chain Security",
      body: "Examines the impact of geopolitical shifts, regional crises, and disruptions to strategic maritime corridors on the security and resilience of global maritime supply chains.",
    },
    {
      title: "Security of Maritime Energy Supply Chains",
      body: "Addresses the protection of strategic energy routes, offshore and coastal infrastructure, subsea energy pipelines, and the continuity of energy supplies amid evolving risks.",
    },
    {
      title: "Seabed and Subsea Communications Infrastructure Security",
      body: "Addresses the protection of subsea communications cables and critical seabed infrastructure, with emphasis on surveillance, resilience, and the continuity of global connectivity.",
    },
    {
      title: "Maritime Cybersecurity: Challenges and Solutions",
      body: "Examines cyber risks affecting ports, vessels, navigation systems, and maritime logistics networks, together with measures to strengthen resilience and incident response.",
    },
    {
      title: "Artificial Intelligence and Emerging Technologies in Seabed and Supply Chain Security",
      body: "Examines the role of artificial intelligence, autonomous systems, advanced sensing, and predictive technologies in enhancing maritime domain awareness and protecting critical assets.",
    },
  ];

  return [
    clientHeader(),
    hero(
      "Where Maritime Security Becomes Strategic Action",
      "Three days bring together naval leaders, government decision-makers, industry experts, and technology innovators to address the forces reshaping maritime security, global supply chains, and critical seabed infrastructure.",
      "forum-audience.webp",
      [
        action("/b2g", "Explore Sponsorship Opportunities"),
        action("/contact", "Contact Us", "outline"),
      ],
    ),
    intro(
      "Three Days of Strategic Dialogue. Partnerships Beyond the Forum.",
      "Across three strategically focused days, the Saudi International Maritime Forum 2026 moves the conversation from emerging challenges to forward-looking solutions.\n\nEach day addresses a critical dimension of maritime security, enabling the exchange of expertise, stronger coordination, and opportunities for cooperation beyond the Forum.",
      "forum-panel-wide.webp",
    ),
    {
      anchorID: "programme-days",
      blockType: "cardGrid",
      displayOrder: 30,
      internalLabel: "Three programme days",
      visible: true,
      heading: "Three Days. Three Critical Dimensions of Maritime Security.",
      layout: "editorial",
      cards: days,
    },
    {
      anchorID: "programme-highlights",
      blockType: "cardGrid",
      displayOrder: 40,
      internalLabel: "Programme highlights",
      visible: true,
      heading: "More Than a Programme. A Platform for Progress.",
      body: "The programme brings together strategic perspectives, specialized expertise, and structured opportunities for institutional dialogue and cooperation.",
      layout: "icons",
      cards: highlights,
    },
    {
      anchorID: "key-topics",
      blockType: "timeline",
      displayOrder: 50,
      internalLabel: "Five strategic priorities",
      visible: true,
      heading: "Five Strategic Priorities. One Shared Maritime Future.",
      body: "The Forum focuses on five interconnected priorities affecting global trade, energy security, digital connectivity, and critical maritime infrastructure.",
      steps: topics.map((topic, index) => ({
        label: String(index + 1).padStart(2, "0"),
        ...topic,
      })),
    },
    {
      anchorID: "agenda",
      blockType: "callToAction",
      displayOrder: 60,
      internalLabel: "Agenda announcement",
      visible: true,
      heading: "The Programme Is Taking Shape",
      body: "Discover how your organization can contribute to the conversations shaping the future of maritime security.\n\nThe detailed agenda will be announced soon.",
      media: `${assets}/photos/forum-policy-panel.webp`,
      buttons: [
        action("/b2g", "Explore Sponsorship Opportunities"),
        action("/contact", "Contact Us", "outline"),
      ],
    },
    clientFooter(),
  ];
}

function speakersSections(): PageSection[] {
  const categories = [
    {
      title: "Naval and Military Leadership",
      body: "Senior naval commanders and military leaders providing strategic and operational perspectives on evolving maritime security challenges.",
      icon: "anchor",
    },
    {
      title: "Government and Institutional Leadership",
      body: "Government officials and decision-makers addressing policy, infrastructure protection, national capabilities, and institutional cooperation.",
      icon: "buildings",
    },
    {
      title: "International Delegations and Experts",
      body: "Representatives and specialists from different countries, institutions, and maritime regions sharing experience and perspectives on common security challenges.",
      icon: "globe",
    },
    {
      title: "Maritime and Defense Industry Leaders",
      body: "Executives leading the systems, platforms, services, and capabilities supporting modern maritime security and defense.",
      icon: "shield",
    },
    {
      title: "Technology and Cybersecurity Experts",
      body: "Specialists in artificial intelligence, autonomous systems, communications, cybersecurity, advanced sensing, subsea systems, and digital infrastructure.",
      icon: "circuitry",
    },
    {
      title: "Energy, Logistics, and Infrastructure Leaders",
      body: "Experts addressing the protection and resilience of maritime energy corridors, ports, transport networks, and global supply chains.",
      icon: "chart",
    },
    {
      title: "Researchers and Strategic Experts",
      body: "Academics, researchers, analysts, and subject-matter experts contributing evidence-based research, foresight, and technical insight.",
      icon: "lightbulb",
    },
  ];
  const speakers = speakerSection("en");
  return [
    clientHeader(),
    hero(
      "Voices Shaping the Future of Maritime Security",
      "Meet the naval commanders, government decision-makers, international experts, and industry leaders contributing strategic insight and operational expertise to SIM 2026.",
      "speakers-hero-commanders.webp",
      [action("/programme", "Explore the Programme")],
    ),
    intro(
      "One Forum. The Full Spectrum of Maritime Expertise.",
      "SIM 2026 brings together leaders and specialists whose responsibilities span naval operations, public policy, maritime defense, energy security, critical infrastructure, emerging technologies, research, and international cooperation.\n\nTogether, they reflect the cross-sector expertise required to address today’s interconnected maritime challenges.",
      "forum-panel-close.webp",
    ),
    {
      anchorID: "speaker-categories",
      blockType: "cardGrid",
      displayOrder: 30,
      internalLabel: "Speaker expertise categories",
      visible: true,
      heading: "Perspectives from Command to Technology",
      body: "A distinguished community of speakers connecting operational leadership, public policy, international experience, industry capability, and technical expertise.",
      layout: "icons",
      cards: categories,
    },
    {
      anchorID: "all-speakers",
      blockType: "speakerDirectory",
      displayOrder: 40,
      internalLabel: "Speaker directory",
      visible: true,
      eyebrow: speakers.eyebrow,
      heading: "SIM 2026 Speakers",
      body: undefined,
      speakers: speakers.cards.map((speaker) => ({
        country: speaker.meta,
        eyebrow: speaker.eyebrow,
        name: speaker.title,
        portrait: speaker.media || null,
        role: speaker.body,
        workplace: speaker.workplace,
        visible: speaker.visible,
      })),
    } satisfies SpeakerDirectorySection,
    finalCTA(
      "Explore Conversations Shaping Maritime Security",
      "Discover how the Programme connects critical maritime priorities with the leaders and specialists equipped to address them.",
      [action("/programme", "Explore the Programme")],
      "forum-audience.webp",
      "SIM 2026",
    ),
    clientFooter(),
  ];
}

function partnersSections(): PageSection[] {
  const approved = partnerSection("en");
  const byTitle = (title: string) =>
    approved.cards.find((card) => card.title === title);
  const cards = {
    ministry: {
      title: "Ministry of Defense",
      meta: "Under the supervision of",
      media: `${assets}/organizers/ministry-of-defense.svg`,
    },
    navy: {
      title: "Royal Saudi Naval Forces",
      meta: "Organized by",
      media: `${assets}/official-framework/royal-saudi-naval-forces.webp`,
    },
    gami: byTitle("General Authority for Military Industries"),
    ust: byTitle("Unmanned Systems Technology"),
    defense: byTitle("Defense Advancement"),
    ocean: byTitle("Ocean Science & Technology"),
    fincantieri: byTitle("Fincantieri Arabia"),
    navantia: byTitle("Navantia"),
  };
  const logoSection = (
    anchorID: string,
    internalLabel: string,
    heading: string,
    items: Array<(typeof approved.cards)[number] | undefined>,
    order: number,
  ): PartnerCategorySection => ({
    anchorID,
    blockType: "partnerCategory",
    displayOrder: order,
    internalLabel,
    visible: true,
    heading,
    body: undefined,
    eyebrow: undefined,
    logos: (items.filter(Boolean) as (typeof approved.cards)).map((item) => ({
      href: item.button?.href,
      logo: item.media || null,
      name: item.title,
      openInNewTab: item.button?.openInNewTab,
      visible: item.visible,
    })),
  });

  return [
    clientHeader(),
    hero(
      "Together, Advancing the Future of Maritime Security",
      "The Saudi International Maritime Forum 2026 brings together official entities, strategic partners, sponsors, and supporting organisations committed to strengthening maritime security, protecting critical infrastructure, and building more resilient global supply chains.",
      "partners-hero-exhibition.webp",
      [
        action("/sponsor", "Explore Sponsorship Opportunities"),
        action("/sponsor", "Become a Sponsor", "outline"),
      ],
      "SPONSORS AND PARTNERS",
    ),
    intro(
      "Partnerships That Strengthen the Maritime Security Ecosystem",
      "Addressing today’s interconnected maritime challenges requires coordinated leadership, specialist expertise, advanced capabilities, and international cooperation.\n\nSIM 2026 recognises the organisations contributing to the Forum’s strategic objectives through institutional leadership, industry capability, sector expertise, media reach, and collaborative engagement.\n\nTheir participation strengthens the Forum as a platform for meaningful dialogue, knowledge exchange, capability development, and long-term cooperation across the global maritime security ecosystem.",
      "forum-policy-panel.webp",
    ),
    {
      anchorID: "partner-directory-intro",
      blockType: "mediaFeature",
      displayOrder: 30,
      internalLabel: "Partner directory introduction",
      visible: true,
      heading: "The Organisations Supporting SIM 2026",
      body: "Discover the official entities, strategic partners, sponsors, media partners, and supporting partners contributing to the success and strategic impact of the Forum.",
      media: `${assets}/photos/forum-panel-wide.webp`,
      mediaPosition: "start",
      theme: "light",
    },
    logoSection(
      "partner-category-supervision",
      "Supervision and organization",
      "Supervision and Organization",
      [cards.ministry, cards.navy],
      40,
    ),
    logoSection(
      "partner-category-strategic",
      "Strategic partners",
      "Strategic Partners",
      [cards.gami],
      50,
    ),
    logoSection(
      "partner-category-media",
      "Media partners",
      "Media Partners",
      [cards.ust, cards.defense, cards.ocean],
      60,
    ),
    logoSection(
      "partner-category-sponsors",
      "Sponsors",
      "Sponsors",
      [cards.fincantieri, cards.navantia],
      70,
    ),
    finalCTA(
      "Build a Strategic Presence at SIM 2026",
      "Explore the sponsorship opportunity that best aligns with your organization’s objectives.",
      [
        action("/sponsor", "Explore Sponsorship Opportunities"),
        action("/sponsor", "Become a Sponsor", "outline"),
      ],
      "naval-operations.webp",
    ),
    clientFooter(),
  ];
}

const b2gPriorityAreas = [
  {
    title: "Seabed and Subsea Infrastructure",
    body: "Subsea cable protection, underwater surveillance, pipeline security, seabed monitoring, sensing, and critical infrastructure resilience.",
    icon: "anchor",
    media: "/assets/simf-microsite/b2g/seabed-and-subsea-infrastructure.webp",
  },
  {
    title: "Maritime Cybersecurity and Communications",
    body: "Secure maritime communications, digital infrastructure protection, cyber defense, data security, and command-and-control systems.",
    icon: "circuitry",
    media: "/assets/simf-microsite/b2g/maritime-cybersecurity-and-communications.webp",
  },
  {
    title: "Unmanned and Autonomous Systems",
    body: "Unmanned surface, underwater, and aerial systems, autonomy, counter-unmanned technologies, artificial intelligence, and advanced surveillance.",
    icon: "gear",
    media: "/assets/simf-microsite/b2g/unmanned-and-autonomous-systems.webp",
  },
  {
    title: "Maritime Energy Security",
    body: "Protection of maritime energy routes, offshore infrastructure, energy supply chains, emergency readiness, and continuity of operations.",
    icon: "shield",
    media: "/assets/simf-microsite/b2g/maritime-energy-security.webp",
  },
  {
    title: "Maritime Transport and Logistics",
    body: "Ports, shipping, strategic corridors, vessel and port security, logistics resilience, and maritime supply-chain continuity.",
    icon: "chart",
    media: "/assets/simf-microsite/b2g/maritime-transport-and-logistics.webp",
  },
  {
    title: "Naval, Security, and Industrial Capabilities",
    body: "Naval technologies, maintenance and lifecycle support, industrial development, localization, advanced manufacturing, research, and defense innovation.",
    icon: "factory",
    media: "/assets/simf-microsite/b2g/naval-security-and-industrial-capabilities.webp",
  },
];

export const simfB2GForm: FormDefinition = {
  id: "simf-b2g-application",
  formKey: "simf-b2g-application",
  submitLabel: "Request B2G Consultation",
  conversionCurrency: "SAR",
  conversionValue: 0,
  fields: [
    { name: "organizationName", label: "Organization name", type: "text", required: true, width: "half", autocomplete: "organization" },
    { name: "contactPerson", label: "Contact person", type: "text", required: true, width: "half", autocomplete: "name" },
    { name: "jobTitle", label: "Job title", type: "text", required: true, width: "half", autocomplete: "organization-title" },
    { name: "workEmail", label: "Work email", type: "email", required: true, width: "half", autocomplete: "email" },
    { name: "mobileNumber", label: "Mobile number and country code", type: "tel", width: "half", autocomplete: "tel" },
    { name: "country", label: "Country", type: "text", required: true, width: "half", autocomplete: "country-name" },
    { name: "organizationSector", label: "Organization sector", type: "text", required: true, width: "half" },
    { name: "engagementObjectives", label: "Relevant capabilities and B2G objectives", type: "textarea", required: true, width: "full", maxLength: 1500 },
    {
      name: "consent",
      label: "I agree that the SIM 2026 team may contact me about relevant B2G opportunities and next steps.",
      type: "checkbox",
      required: true,
      width: "full",
    },
  ],
};

function governmentSections(): PageSection[] {
  const executiveTrack = [
    {
      title: "Pre-Arranged Engagement",
      body: "Meetings are coordinated in advance according to the organization’s capabilities, priorities, and areas of strategic relevance.",
      icon: "compass",
    },
    {
      title: "Relevant Decision-Makers",
      body: "Engagement is directed towards participating entities connected to the organization’s sector, solutions, and proposed areas of cooperation.",
      icon: "users",
    },
    {
      title: "Outcome-Oriented Dialogue",
      body: "Discussions can address contracting pathways, operational requirements, localization, applied solutions, partnerships, and joint projects.",
      icon: "handshake",
    },
    {
      title: "Professional Bilateral Setting",
      body: "Meetings take place within a structured environment supported by dedicated rooms, hospitality, interpretation, documentation, and logistical coordination.",
      icon: "buildings",
    },
  ];
  const strategicValue = [
    {
      title: "Procurement and Contracting Pathways",
      body: "Understand relevant requirements and explore potential pathways for future procurement and contracting opportunities.",
      icon: "buildings",
    },
    {
      title: "Strategic Partnerships and Joint Projects",
      body: "Discuss potential cooperation models, long-term partnerships, and projects aligned with maritime security and critical infrastructure priorities.",
      icon: "handshake",
    },
    {
      title: "Localization and Capability Development",
      body: "Explore opportunities for knowledge transfer, industrial cooperation, technology localization, and national capability development.",
      icon: "factory",
    },
    {
      title: "Applied and Operational Solutions",
      body: "Present technologies and solutions in the context of specific operational needs, implementation requirements, and future development priorities.",
      icon: "gear",
    },
    {
      title: "Sustainable Institutional Relationships",
      body: "Establish structured communication channels between solution providers, government stakeholders, decision-makers, and the wider national ecosystem.",
      icon: "users",
    },
  ];
  const journey = [
    ["Submit Your Application", "Provide information about your organization, relevant capabilities, priority sectors, proposed solutions, and engagement objectives."],
    ["Strategic Relevance Review", "The Organizing Committee reviews the organization’s profile, the relevance of its solutions, and its alignment with the Forum’s strategic themes."],
    ["Identify Engagement Priorities", "Approved applicants are contacted to clarify their objectives, preferred stakeholder groups, and the proposed subjects for discussion."],
    ["Meeting Matching and Coordination", "The Organizing Committee coordinates with relevant participating entities to identify suitable bilateral engagement opportunities."],
    ["Receive Your B2G Schedule", "Confirmed participants receive a dedicated meeting schedule and the necessary operational information before the Forum."],
    ["Meet at SIM 2026", "Participate in focused bilateral discussions supported by a professional organizing team and dedicated meeting infrastructure."],
  ];
  const included = [
    ["Priority B2G Participation", "Priority consideration for participation in the B2G Meetings Track."],
    ["Dedicated Meeting Schedule", "An individually coordinated schedule covering the organization’s confirmed bilateral meetings."],
    ["Bilateral Meeting Coordination", "Advance coordination between the participating organization and the relevant government or institutional stakeholders."],
    ["Fully Equipped Meeting Environment", "Access to a dedicated, fully equipped meeting room for the confirmed B2G Programme."],
    ["Interpretation and Translation", "Simultaneous interpretation and written translation support during meetings, upon request and subject to confirmation."],
    ["Hospitality and Business Support", "Dedicated hospitality, coffee-break service, meeting documentation, business-center support, and logistical assistance."],
    ["Dedicated Organizing Team", "A qualified team responsible for coordinating the meeting programme and supporting participating representatives."],
    ["Meeting Visibility and Coverage", "Official room identification and dedicated media coverage of approved meetings, subject to protocol and media approval."],
  ];
  const benefits = [
    {
      title: "Before the Forum",
      body: "Official participation announcement across the Forum’s LinkedIn and X accounts\nProduction and publication of a customized promotional welcome video\nInclusion of the organization’s logo and participation designation on the official Forum website\nA dedicated organization profile within the Sponsors and Partners section\nTwo editorial pages within the pre-event media report\nOne representative seat at the sponsorship contract signing ceremony\nLogo visibility across the signing ceremony’s main screen, venue screens, banners, and approved invitation materials",
    },
    {
      title: "During the Forum",
      body: "Logo inclusion within the B2G Meetings Programme\nLogo and participation designation across selected Forum screens and live session broadcasts\nVisibility within the registration area, selected venue banners, and session break periods\nOne advertising page in the Forum magazine, in printed and electronic formats\nOne VIP seat at the opening ceremony\nFive additional opening-ceremony seats for the organization’s guests\nTwo invitations to the external dinner for VIP guests\nDedicated airport meet-and-greet services for participating representatives\nFive-star accommodation for up to three representatives participating in the meetings programme\nFloor and table flags carrying the organization’s identity inside the meeting room\nOfficial recognition following the principal business meeting\nDedicated logistical, hospitality, interpretation, and business-support services",
    },
    {
      title: "After the Forum",
      body: "Two advertising pages within the final Forum report\nInclusion of the organization’s logo in the final Forum video\nA printed and electronic photo album documenting the organization’s participation\nTen premium printed copies of the final Forum report\nAn official certificate of appreciation\nA premium commemorative gift within the official participant kit",
    },
  ];
  const faq = [
    ["What are B2G Opportunities?", "B2G Opportunities provide approved organizations with access to a curated programme of pre-arranged bilateral meetings with relevant participating government, naval, security, procurement, and institutional stakeholders."],
    ["Can we request meetings with specific entities?", "Applicants may identify preferred entities or stakeholder groups. The Organizing Committee will assess each request and coordinate potential meetings according to relevance, official participation, availability, and approval."],
    ["Does submitting an application guarantee meetings?", "No. Applications are reviewed first, and specific meetings are confirmed only after the matching and coordination process has been completed."],
    ["Does B2G participation include an exhibition booth?", "No. B2G Opportunities focus on institutional engagement and do not include exhibition space. Organizations seeking a booth should explore the Forum’s other sponsorship opportunities."],
    ["Who should represent our organization?", "Senior executives, government-relations leaders, business-development directors, technical specialists, and decision-makers directly connected to the organization’s proposed solutions and meeting objectives are recommended."],
    ["Can a company purchase an attendance-only pass?", "No. The Forum is closed and invitation-based. Commercial organizations participate through approved sponsorship opportunities, while visitors consist of officially invited and pre-selected profiles."],
  ];

  return [
    clientHeader(),
    {
      ...hero(
        "Connect Advanced Maritime Solutions with Government Priorities",
        "The Business-to-Government Meetings Track at the Saudi International Maritime Forum 2026 creates a structured environment for approved organizations to engage in pre-arranged bilateral meetings with relevant government, naval, security, procurement, localization, energy, transport, communications, cybersecurity, and industrial stakeholders.\n\nPresent your capabilities, understand institutional priorities, and explore practical pathways for strategic cooperation, localization, contracting, and joint projects.",
        "b2g-hero-panel.webp",
        [
          action("/b2g#application", "Apply for B2G Opportunities"),
          action("/b2g#journey", "Explore the Meeting Experience", "outline"),
        ],
        "B2G OPPORTUNITIES | SIM 2026",
      ),
      eventDetails: [
        { label: "Date", value: "23–25 November 2026" },
        { label: "Venue", value: "Sofitel Riyadh Hotel & Convention Center" },
      ],
      note: "B2G participation is subject to organizational relevance, meeting availability, and approval by the relevant authorities and the Organizing Committee. This opportunity does not include an exhibition booth.",
    },
    {
      ...intro(
        "From General Networking to Focused Bilateral Engagement",
        "The B2G Meetings Track runs in parallel with the Saudi International Maritime Forum 2026. It connects government and military priorities with national and international companies offering advanced, applicable, and potentially localizable solutions.\n\nRather than relying on general introductions, the track is built around pre-scheduled bilateral sessions, clearly defined engagement objectives, and focused discussions with relevant stakeholders.",
        "b2g-executive-audience.webp",
      ),
      eyebrow: "A PURPOSE-BUILT EXECUTIVE TRACK",
    },
    {
      anchorID: "executive-track",
      blockType: "cardGrid",
      displayOrder: 30,
      internalLabel: "Executive track features",
      visible: true,
      heading: "A Structured Environment for Focused Engagement",
      layout: "icons",
      cards: executiveTrack,
    },
    {
      anchorID: "strategic-value",
      blockType: "cardGrid",
      displayOrder: 40,
      internalLabel: "Strategic value",
      visible: true,
      eyebrow: "BUILT FOR PRACTICAL OUTCOMES",
      heading: "Turn Technical Capabilities into Strategic Opportunities",
      body: "B2G Meetings provide approved organizations with the opportunity to move beyond general capability presentations and engage in specialized discussions based on real institutional and operational priorities.\n\nThe track is designed to support:",
      layout: "icons",
      cards: strategicValue,
    },
    {
      anchorID: "priority-areas",
      blockType: "cardGrid",
      displayOrder: 50,
      internalLabel: "Priority areas",
      visible: true,
      eyebrow: "SOLUTIONS ALIGNED WITH THE FORUM’S MISSION",
      heading: "Where Capabilities Meet Strategic Demand",
      body: "B2G engagement is designed for organizations providing relevant capabilities across the Forum’s principal themes and supporting sectors.",
      layout: "editorial",
      cards: b2gPriorityAreas,
    },
    {
      anchorID: "engagement-ecosystem",
      blockType: "mediaFeature",
      displayOrder: 60,
      internalLabel: "Engagement ecosystem",
      visible: true,
      eyebrow: "CONNECT WITH THE RELEVANT ECOSYSTEM",
      heading: "Engage Across Government, Security, and Industry",
      body: "The Forum brings together a broad institutional ecosystem involved in maritime security, energy, transport, communications, industrial development, procurement, localization, and critical infrastructure protection.\n\nB2G meeting requests may be submitted across the following stakeholder groups:\n\nRoyal Saudi Naval Forces and relevant military and security entities\nGovernment ministries responsible for energy, transport, communications, investment, and security\nProcurement, localization, and military-industry authorities\nPort, maritime-regulatory, logistics, and Border Guard entities\nCybersecurity, data, communications, and industrial-security authorities\nResearch, defense-development, and technology institutions\nRelevant national companies and strategic industry stakeholders\n\nApplicants may indicate their preferred stakeholder groups and meeting objectives. Specific meetings are matched and confirmed according to institutional relevance, official participation, availability, and approval.",
      media: `${assets}/photos/naval-exercise.webp`,
      mediaPosition: "end",
      theme: "light",
    },
    {
      anchorID: "journey",
      blockType: "timeline",
      displayOrder: 70,
      internalLabel: "B2G application journey",
      visible: true,
      eyebrow: "THE B2G JOURNEY",
      heading: "A Curated Process from Application to Engagement",
      steps: journey.map(([title, body], index) => ({
        label: String(index + 1).padStart(2, "0"),
        title,
        body,
      })),
    },
    {
      anchorID: "included",
      blockType: "cardGrid",
      displayOrder: 80,
      internalLabel: "Included in the B2G opportunity",
      visible: true,
      eyebrow: "WHAT THE OPPORTUNITY INCLUDES",
      heading: "A Professionally Coordinated Meetings Programme",
      layout: "checklist",
      cards: included.map(([title, body]) => ({ title, body, icon: "check" })),
    },
    {
      anchorID: "benefits",
      blockType: "cardGrid",
      displayOrder: 90,
      internalLabel: "Benefits before, during, and after",
      visible: true,
      eyebrow: "VALUE BEYOND THE MEETING ROOM",
      heading: "An Integrated Participation Experience",
      layout: "tabs",
      cards: benefits,
    },
    {
      anchorID: "participation-format",
      blockType: "mediaFeature",
      displayOrder: 100,
      internalLabel: "Participation format",
      visible: true,
      eyebrow: "FOCUSED ON INSTITUTIONAL ENGAGEMENT",
      heading: "Designed for Meetings, Not Exhibition",
      body: "B2G Opportunities are designed for organizations whose principal objective is direct institutional engagement through curated bilateral meetings and high-value networking.\n\nThis participation format does not include an exhibition booth.\n\nOrganizations seeking both B2G engagement and a physical exhibition presence should explore SIM 2026 sponsorship opportunities from Strategic to Silver.",
      media: `${assets}/photos/forum-policy-panel.webp`,
      mediaPosition: "start",
      theme: "light",
      ctaHref: "/sponsor",
      ctaLabel: "Explore Sponsorship Opportunities",
    },
    {
      anchorID: "eligibility",
      blockType: "cardGrid",
      displayOrder: 110,
      internalLabel: "Eligibility",
      visible: true,
      eyebrow: "ELIGIBILITY",
      heading: "Is This Opportunity Right for Your Organization?",
      body: "B2G Opportunities are particularly relevant to established national and international organizations that:",
      layout: "checklist",
      cards: [
        "Provide market-ready solutions aligned with maritime, naval, security, energy, logistics, communications, or critical-infrastructure priorities",
        "Have clearly defined government, procurement, partnership, or localization objectives",
        "Can demonstrate relevant technical, industrial, or operational capabilities",
        "Are seeking strategic partnerships, joint projects, contracting pathways, or market development in Saudi Arabia",
        "Are prepared to engage in focused discussions supported by an appropriate senior-level delegation",
        "Can provide a clear company profile and proposed meeting objectives for the matching process",
      ].map((title) => ({ title, icon: "check" })),
    },
    {
      anchorID: "application",
      blockType: "form",
      displayOrder: 120,
      internalLabel: "B2G application form",
      visible: true,
      heading: "Start the B2G Matching Process",
      body: "Share your essential organization details, relevant capabilities, and engagement objectives. The SIM 2026 team will review your enquiry and contact you regarding eligibility and next steps.",
      form: simfB2GForm,
      privacyNote: "Submitting an enquiry does not confirm participation or guarantee specific meetings. All requests remain subject to strategic relevance, availability, and the required approvals.",
      successHeading: "Enquiry Received",
      successMessage: "The SIM 2026 team will review your enquiry and contact you regarding eligibility and next steps.",
    },
    {
      anchorID: "faq",
      blockType: "cardGrid",
      displayOrder: 130,
      internalLabel: "Frequently asked questions",
      visible: true,
      heading: "B2G Opportunities: Frequently Asked Questions",
      layout: "tabs",
      cards: faq.map(([title, body]) => ({ title, body })),
    },
    finalCTA(
      "Bring Your Solutions into the Right Strategic Conversation",
      "Position your organization for focused engagement with the stakeholders shaping the future of maritime security, critical infrastructure, localization, and resilient global supply chains.",
      [
        action("/b2g#application", "Apply for B2G Opportunities"),
        action("/contact", "Contact the Organizing Committee", "outline"),
      ],
      "fleet-formation.webp",
      "B2G OPPORTUNITIES AT SIM 2026",
    ),
    clientFooter(),
  ];
}

function sponsorsSections(): PageSection[] {
  const approved = partnerSection("en");
  const sponsorCards = approved.cards
    .filter((card) => ["Fincantieri Arabia", "Navantia"].includes(card.title))
    // The sponsorship summary is intentionally informational, not linked.
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    .map(({ button: _button, ...card }) => card);
  const reasons = [
    {
      title: "Institutional Presence Before the Most Influential Entities in Global Maritime Security Ecosystems",
      body: "The Forum provides the Sponsor with a prominent position before decision-makers from government entities and global companies leading the dialogue on maritime security and supply-chain issues.\n\nIt also provides the Sponsor with a direct opportunity to engage with the most influential entities in the fields of maritime corridor protection, the sustainability of energy flows, and the development of advanced maritime technologies.",
      media: `${assets}/sponsor/sponsor-institutional-audience.webp`,
    },
    {
      title: "Strategic Access to the Business-to-Government Meetings Track as a Catalyst for Cooperation and Partnership Building",
      body: "Business-to-Government meetings, B2G, are among the Forum’s most important activities and are exclusively allocated to participating Sponsors.\n\nThese meetings provide a platform where opportunities are discussed, partnerships are built, and channels of cooperation are established with stakeholders.\n\nAccordingly, sponsoring the Forum provides Sponsors with priority access to this high-value and high-impact executive track and strengthens their opportunities to secure successful, high-value transactions.",
      media: `${assets}/programme/b2g-military-engagement.webp`,
    },
    {
      title: "Associating the Brand with a Strategic Sector Experiencing Accelerated Global Expansion",
      body: "The maritime security sector, including subsea cable protection, unmanned systems, maritime cybersecurity, and supply-chain sustainability, is experiencing global expansion driven by geopolitical and technological transformations.\n\nAccordingly, sponsoring the Forum will provide an opportunity to establish a position within a sector that is reshaping the balance of economic power.",
      media: `${assets}/sponsor/sponsor-sector-dialogue.webp`,
    },
    {
      title: "Strengthening Access to an Interconnected Ecosystem Concerned with One of the Most Important Contemporary Global Issues",
      body: "The Forum brings together a broad ecosystem of entities concerned with energy security, maritime corridor protection, unmanned technologies, and maritime cybersecurity.\n\nSponsoring the Forum will provide the Sponsor with access to this interconnected ecosystem, engagement with its experts, an understanding of its directions, and the opportunity to explore promising strategic cooperation and partnership opportunities.",
      media: `${assets}/sponsor/sponsor-global-ecosystem.webp`,
    },
  ];
  const packages = [
    ["Strategic Sponsorship", "The Forum’s highest sponsorship level, providing extensive institutional positioning, exceptional brand visibility, and a leading presence across the Forum."],
    ["Sector Sponsorship", "Designed for organizations seeking prominent positioning within one of the strategic sectors represented at the Forum."],
    ["Diamond Sponsorship", "A high-level package combining significant brand visibility, Forum participation, and a prominent exhibition presence."],
    ["Platinum Sponsorship", "A premium sponsorship level offering strong visibility, delegate participation, and an established presence within the exhibition."],
    ["Gold Sponsorship", "A comprehensive package combining sponsor recognition, delegate access, and exhibition participation."],
    ["Silver Sponsorship", "A focused sponsorship package including sponsor recognition, delegate participation, and a fully equipped 12 sqm exhibition booth."],
    ["Co-Sponsor", "A focused option for eligible organizations seeking access to the Business-to-Government Pre-arranged Meetings without an exhibition booth."],
  ];
  const lifecycle = [
    {
      title: "Before the Forum",
      body: "Build early visibility through agreed sponsor recognition across selected Forum communications, promotional materials, digital platforms, and preparatory activities, according to the selected package.",
      media: `${assets}/sponsor/sponsor-strategic-panel.webp`,
    },
    {
      title: "During the Forum",
      body: "Activate your organization’s presence through visibility, delegate access, exhibition participation, programme opportunities, and engagement benefits included within your sponsorship category.",
      media: `${assets}/photos/partners-hero-exhibition.webp`,
    },
    {
      title: "After the Forum",
      body: "Extend your association with SIM 2026 through applicable post-Forum communications, content, outcomes, and sponsor recognition.",
      media: `${assets}/sponsor/sponsor-forum-stage.webp`,
    },
  ];
  const process = [
    ["Select a Sponsorship Category", "Identify the package that best supports your organization’s strategic objectives and required level of presence."],
    ["Submit the Application Form", "Complete and return the official sponsorship application form to the Organizing Committee."],
    ["Application Review", "The Organizing Committee reviews package availability, organizational eligibility, requested benefits, and any required approvals."],
    ["Complete the Payment", "Full payment of the sponsorship value is required before the activation of the agreed benefits."],
    ["Confirmation and Activation", "Following confirmation, the Organizing Committee coordinates branding requirements, delegate access, exhibition arrangements, and the applicable sponsorship deliverables."],
  ];

  return [
    clientHeader(),
    hero(
      "Position Your Organization at the Center of Maritime Security",
      "Build a prominent institutional presence at the Saudi International Maritime Forum 2026, where naval leaders, government decision-makers, industry executives, buyers, and technical experts come together to address the future of maritime security, global supply chains, and critical seabed infrastructure.",
      `${assets}/sponsor/sponsor-hero-exhibition.webp`,
      [action("#sponsorship-opportunities", "Explore Sponsorship Packages")],
    ),
    {
      ...intro(
        "Supporting a More Secure Maritime Future",
        "SIM 2026 is supported by organizations committed to advancing maritime security, protecting critical infrastructure, strengthening supply-chain resilience, and contributing to international cooperation.",
        "partners-hero-exhibition.webp",
      ),
      anchorID: "sponsor-community",
    },
    {
      ...approved,
      anchorID: "sponsor-slider",
      displayOrder: 25,
      internalLabel: "Confirmed sponsor logos",
      heading: "SIM 2026 Sponsors and Partners",
      body: undefined,
      eyebrow: "SIM 2026 SPONSORS AND PARTNERS",
      layout: "swiper",
      cards: sponsorCards,
    },
    {
      anchorID: "sponsor-reasons",
      blockType: "cardGrid",
      displayOrder: 30,
      internalLabel: "Four reasons to sponsor",
      visible: true,
      eyebrow: "4 REASONS TO BECOME A SPONSOR",
      heading: "Strategic Presence. Direct Engagement. Lasting Value.",
      body: "Sponsorship provides organizations with a strategic platform to strengthen institutional positioning, engage influential stakeholders, build valuable relationships, and establish their presence within the evolving global maritime security ecosystem.",
      layout: "list",
      cards: reasons,
    },
    {
      anchorID: "sponsorship-opportunities",
      blockType: "cardGrid",
      displayOrder: 40,
      internalLabel: "Sponsorship opportunities",
      visible: true,
      eyebrow: "SPONSORSHIP OPPORTUNITIES",
      heading: "Choose the Level of Presence That Matches Your Ambition",
      body: "SIM 2026 offers a structured portfolio of sponsorship opportunities designed to support different institutional, visibility, engagement, and exhibition objectives.",
      layout: "editorial",
      cards: packages.map(([title, body], index) => ({
        eyebrow: String(index + 1),
        title,
        body,
      })),
      buttons: [action("#sponsor-form", "Apply for Sponsorship")],
    },
    {
      anchorID: "sponsorship-value",
      blockType: "cardGrid",
      displayOrder: 50,
      internalLabel: "Value before, during, and after",
      visible: true,
      eyebrow: "SPONSORSHIP VALUE : BEFORE, DURING AND AFTER THE FORUM",
      heading: "Value That Extends Beyond Three Days",
      body: "Sponsorship is designed to generate value throughout the Forum journey, from early brand positioning and stakeholder engagement to on-site participation and continued association after the event.",
      layout: "columns",
      cards: lifecycle,
    },
    {
      anchorID: "sponsorship-process",
      blockType: "timeline",
      displayOrder: 60,
      internalLabel: "Sponsorship process",
      visible: true,
      eyebrow: "BECOMING A SPONSOR : THE SPONSORSHIP PROCESS",
      heading: "From Interest to Confirmed Participation",
      steps: process.map(([title, body], index) => ({
        label: String(index + 1).padStart(2, "0"),
        title,
        body,
      })),
    },
    {
      anchorID: "sponsor-form",
      blockType: "form",
      displayOrder: 70,
      internalLabel: "Sponsorship application",
      visible: true,
      eyebrow: "SPONSORSHIP APPLICATION",
      heading: "Tell Us About Your Sponsorship Goals",
      body: "Share your essential contact details and objectives. The sponsorship team will follow up to discuss the most suitable route.",
      form: simfSponsorForm,
      privacyNote: "Submitting an enquiry does not guarantee approval, a specific sponsorship category, participation in Government Business Meetings, or a commercial outcome.",
      successHeading: "Thank You for Your Interest in SIM 2026",
      successMessage: "Your sponsorship enquiry has been received. The team will review it and contact you to discuss the most suitable route and next steps.",
    },
    finalCTA(
      "Secure Your Organization’s Place at SIM 2026",
      "Join the organizations contributing their expertise, capabilities, and leadership to the conversations shaping the future of maritime security.\n\nContact the Organizing Committee to identify the sponsorship opportunity best aligned with your organization’s objectives.",
      [
        action("#sponsor-form", "Request a Sponsorship Proposal"),
        action("/contact", "Contact Us", "outline"),
      ],
      `${assets}/sponsor/sponsor-global-ecosystem.webp`,
      "BECOME A SIM 2026 SPONSOR",
    ),
    clientFooter(),
  ];
}

function legacySections(): PageSection[] {
  const editions = [
    {
      label: "24–26 November 2019 · Riyadh, Saudi Arabia",
      title: "First Edition | Riyadh 2019 — Securing Strategic Maritime Corridors",
      body: "The first edition was held in Riyadh under the gracious patronage of His Royal Highness Prince Mohammed bin Salman bin Abdulaziz Al Saud.\n\nIt established an international platform dedicated to the security of strategic maritime corridors and their essential role in sustaining global trade and energy flows.\n\nDiscussions focused on safeguarding shipping lanes and protecting vital maritime routes in a region through which more than 20 percent of global oil trade passes.",
    },
    {
      label: "15–17 November 2022 · Jeddah, Saudi Arabia",
      title: "Second Edition | Jeddah 2022 — Protecting Naval Units and Coastal Sites from Threats Posed by Unmanned Systems",
      body: "The second edition was held in Jeddah under the patronage of His Royal Highness Prince Khalid bin Salman bin Abdulaziz Al Saud.\n\nIt brought together 37 senior leaders and heads of maritime and environmental authorities representing 15 countries, alongside international experts and researchers.\n\nThe edition provided a global platform for examining the emerging threats posed by unmanned systems to naval units, coastal sites, maritime corridors, and global trade. It also showcased advanced technologies and innovative solutions designed to protect critical maritime assets.",
    },
    {
      label: "19–21 November 2024 · Dhahran, Saudi Arabia",
      title: "Third Edition | Dhahran 2024 — Maritime Security in the Age of Artificial Intelligence",
      body: "The third edition was held in Dhahran and marked a significant development in the Forum’s strategic journey.\n\nIt examined the profound impact of artificial intelligence, intelligent systems, advanced analytics, and unmanned technologies on the maritime operational environment.\n\nDiscussions addressed their influence on deterrence, surveillance, decision-making, and the protection of maritime corridors. The edition also contributed to a shared international understanding of how artificial intelligence can be harnessed to strengthen maritime security.",
    },
  ];
  const evolution = [
    ["2019", "Strategic Maritime Corridors", "Protecting the maritime routes that sustain global trade and energy security."],
    ["2022", "Unmanned-System Threats", "Safeguarding naval units, coastal sites, and critical assets from emerging unmanned threats."],
    ["2024", "Artificial Intelligence", "Understanding how intelligent and autonomous technologies are transforming maritime security."],
    ["2026", "Seabed Security and Maritime Supply Chains", "Protecting critical seabed infrastructure and strengthening the resilience of maritime supply chains in a rapidly changing world."],
  ];

  return [
    clientHeader(),
    hero(
      "A Strategic Journey Shaping the Future of Maritime Security",
      "Since 2019, the Saudi International Maritime Forum has brought together naval leaders, government decision-makers, international experts, researchers, and technology providers to address the challenges transforming the maritime domain.\n\nEach edition has focused on a defining strategic priority, strengthening international cooperation, advancing operational understanding, and exploring innovative solutions for a more secure maritime future.",
      "legacy-hero-audience.webp",
      [],
      "OUR LEGACY",
    ),
    intro(
      "From Securing Maritime Corridors to Protecting the Seabed",
      "The Forum’s legacy reflects the continuous evolution of maritime security.\n\nIts first three editions progressed from protecting the strategic corridors that sustain global trade and energy flows, to confronting the emerging threats posed by unmanned systems, and then to examining the transformation of maritime operations through artificial intelligence.\n\nTogether, these editions established the strategic foundation for SIM 2026 and its focus on seabed security, critical subsea infrastructure, and resilient maritime supply chains.",
      "forum-audience.webp",
    ),
    {
      anchorID: "previous-editions",
      blockType: "timeline",
      displayOrder: 30,
      internalLabel: "Previous editions",
      visible: true,
      heading: "Previous Editions",
      steps: editions,
    },
    {
      anchorID: "strategic-evolution",
      blockType: "timeline",
      displayOrder: 40,
      internalLabel: "Strategic evolution",
      visible: true,
      eyebrow: "ONE CONTINUOUS STRATEGIC JOURNEY",
      heading: "Each Edition Builds on the Last",
      steps: evolution.map(([label, title, body]) => ({ label, title, body })),
    },
    {
      anchorID: "legacy-continues",
      blockType: "mediaFeature",
      displayOrder: 50,
      internalLabel: "Fourth edition",
      visible: true,
      eyebrow: "THE LEGACY CONTINUES",
      heading: "Fourth Edition | Riyadh 2026",
      body: "The Future of Seabed Security & Maritime Supply Chains in a Critically Changing World\n\nBuilding on the achievements and strategic outcomes of its three previous editions, SIM 2026 advances the international dialogue toward the security of the seabed, critical subsea infrastructure, and the maritime supply chains connecting global economies.\n\nThe fourth edition will convene naval leaders, government authorities, industry decision-makers, researchers, and technology specialists to address emerging risks, strengthen cooperation, and explore the capabilities required to protect the maritime systems on which the world depends.\n\n23–25 November 2026\nSofitel Riyadh Hotel & Convention Center",
      media: `${assets}/photos/simf-hero-approved-v2.webp`,
      mediaPosition: "start",
      theme: "light",
    },
    clientFooter(),
  ];
}

export const simfContactForm: FormDefinition = {
  id: "simf-contact",
  formKey: "simf-contact",
  submitLabel: "Send Enquiry",
  conversionCurrency: "SAR",
  conversionValue: 0,
  fields: [
    { name: "name", label: "Full name", type: "text", required: true, width: "half", autocomplete: "name" },
    { name: "organization", label: "Organization", type: "text", required: true, width: "half", autocomplete: "organization" },
    { name: "jobTitle", label: "Job title", type: "text", required: true, width: "half", autocomplete: "organization-title" },
    { name: "email", label: "Work email", type: "email", required: true, width: "half", autocomplete: "email" },
    { name: "phone", label: "Phone number", type: "tel", required: true, width: "half", autocomplete: "tel" },
    {
      name: "enquiryType",
      label: "Enquiry type",
      type: "select",
      required: true,
      width: "half",
      options: [
        { label: "Programme", value: "programme" },
        { label: "Speakers", value: "speakers" },
        { label: "Partnership", value: "partnership" },
        { label: "Sponsorship", value: "sponsorship" },
        { label: "B2G Opportunities", value: "b2g" },
        { label: "Media", value: "media" },
        { label: "Other", value: "other" },
      ],
    },
    { name: "message", label: "How can the SIM 2026 team help?", type: "textarea", required: true, width: "full", maxLength: 2500 },
    { name: "consent", label: "I consent to be contacted by the SIM 2026 team.", type: "checkbox", required: true, width: "full" },
  ],
};

function contactSections(): PageSection[] {
  return [
    clientHeader(),
    hero(
      "Connect with the SIM 2026 Team",
      "Contact the organizing team regarding the programme, speakers, partnerships, sponsorship, B2G opportunities, or media enquiries.",
      "forum-panel-wide.webp",
    ),
    {
      anchorID: "contact-details",
      blockType: "cardGrid",
      displayOrder: 20,
      internalLabel: "Contact details",
      visible: true,
      heading: "Start the Right Conversation",
      body: "Share your enquiry with the SIM 2026 team. Your message will be directed to the relevant team for review and follow-up.",
      layout: "icons",
      cards: [
        {
          title: "Email",
          body: "sim@startime.sa",
          icon: "envelope",
        },
        {
          title: "Phone",
          body: "920010500",
          icon: "phone",
        },
        {
          title: "Address",
          body: "3507, Riyadh 12341, Saudi Arabia",
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
      heading: "How Can We Help?",
      body: "Provide the details below and the relevant SIM 2026 team will contact you.",
      form: simfContactForm,
      privacyNote: "Your information will be used only to respond to this enquiry and manage relevant follow-up.",
      successHeading: "Thank You",
      successMessage: "Your enquiry has been received. The relevant SIM 2026 team will contact you.",
    },
    clientFooter(),
  ];
}

const pageContent: Record<
  ClientContentPageKey,
  { title: string; summary: string; sections: () => PageSection[] }
> = {
  programme: {
    title: "Programme",
    summary: "Explore three days of strategic dialogue, programme formats, and five priorities shaping SIM 2026.",
    sections: programmeSections,
  },
  speakers: {
    title: "Speakers",
    summary: "Meet the naval commanders, decision-makers, experts, and industry leaders contributing to SIM 2026.",
    sections: speakersSections,
  },
  partners: {
    title: "Sponsors and Partners",
    summary: "Discover the official entities, strategic partners, media partners, and sponsors supporting SIM 2026.",
    sections: partnersSections,
  },
  "government-b2g": {
    title: "B2G Opportunities",
    summary: "Apply for structured bilateral engagement with relevant government, naval, security, procurement, and institutional stakeholders.",
    sections: governmentSections,
  },
  sponsors: {
    title: "Sponsorship Opportunities",
    summary: "Explore SIM 2026 sponsorship value, categories, benefits, and the route to confirmed participation.",
    sections: sponsorsSections,
  },
  legacy: {
    title: "Legacy",
    summary: "Follow the Saudi International Maritime Forum’s strategic journey from 2019 to SIM 2026.",
    sections: legacySections,
  },
  contact: {
    title: "Contact",
    summary: "Contact the SIM 2026 team about the programme, speakers, partnerships, sponsorship, B2G, or media.",
    sections: contactSections,
  },
};

export function getClientContentPage(
  key: ClientContentPageKey,
): PublicPage {
  const content = pageContent[key];
  return {
    pageType: `simf-microsite-${key}`,
    sections: content.sections(),
    seo: {
      title: `${content.title} | SIM 2026`,
      description: content.summary,
      followLinks: true,
      indexable: true,
      openGraphImage: `${assets}/photos/forum-hero-live.png`,
    },
    slug: `simf-microsite/${key}`,
    summary: content.summary,
    title: content.title,
  };
}

export function getEnglishClientPage(
  locale: Locale,
  key: ClientContentPageKey,
): PublicPage | null {
  const page = getClientContentPage(key);
  if (locale === "en") return page;

  const localizeHref = (href: string): string => {
    if (!href.startsWith("/") || href.startsWith("/ar")) return href;
    const [pathname, hash = ""] = href.split("#", 2);
    const localizedPath = pathname === "/" ? "/ar" : `/ar${pathname}`;
    return hash ? `${localizedPath}#${hash}` : localizedPath;
  };

  const localize = (
    value: unknown,
    field = "",
  ): unknown => {
    if (Array.isArray(value)) {
      return value.map((entry) => localize(entry, field));
    }
    if (value && typeof value === "object") {
      return Object.fromEntries(
        Object.entries(value).map(([keyName, entry]) => [
          keyName,
          localize(entry, keyName),
        ]),
      );
    }
    if (typeof value !== "string") return value;
    if (
      field === "href" ||
      field === "ctaHref" ||
      field === "privacyHref" ||
      field === "sponsorHref"
    ) {
      return localizeHref(value);
    }
    if (
      field === "value" &&
      [
        "b2g",
        "media",
        "other",
        "partnership",
        "programme",
        "speakers",
        "sponsorship",
      ].includes(value)
    ) {
      return value;
    }
    return simfClientArabicTranslations[value] || value;
  };

  const localized = localize(page) as PublicPage;
  localized.sections = localized.sections.map((section) => {
    if (section.anchorID === "header" && section.blockType === "simfHeader") {
      const approvedNavigation: Record<string, string> = {
        "/": "الرئيسية",
        "/programme": "البرنامج",
        "/speakers": "المتحدثون",
        "/partners": "الرعاة والشركاء",
        "/b2g": "فرص B2G",
        "/legacy": "نسخ سابقة",
        "/updates": "الأخبار والمركز الإعلامي",
        "/contact": "تواصل معنا",
      };
      return {
        ...section,
        languageSwitchLabel: "التبديل إلى الإنجليزية",
        logoAlt: "الملتقى البحري السعودي الدولي",
        menuCloseLabel: "إغلاق القائمة",
        menuOpenLabel: "فتح القائمة",
        navigationLabel: "التنقل الرئيسي",
        links: section.links.map((link) => ({
          ...link,
          label: approvedNavigation[link.href] || link.label,
        })),
        sponsorLabel: "كن راعيًا",
      };
    }
    if (section.anchorID === "footer" && section.blockType === "simfFooter") {
      const approvedFooterNavigation: Record<string, string> = {
        "/ar": "الرئيسية",
        "/ar/programme": "البرنامج",
        "/ar/speakers": "المتحدثون",
        "/ar/partners": "الرعاة والشركاء",
        "/ar/b2g": "فرص B2G",
        "/ar/sponsor": "كن راعيًا",
        "/ar/legacy": "نسخ سابقة",
        "/ar/updates": "الأخبار والمركز الإعلامي",
        "/ar/contact": "تواصل معنا",
      };
      return {
        ...section,
        importantLinks: (section.importantLinks || []).map((link) => ({
          ...link,
          label: approvedFooterNavigation[link.href] || link.label,
        })),
      };
    }
    if (section.anchorID === "indicators" && section.blockType === "metricRail") {
      return {
        ...section,
        metrics: section.metrics.map((metric) => ({
          ...metric,
          value: metric.value === "$19T / year" ? "$19T/سنة" : metric.value,
        })),
      };
    }
    if (section.anchorID === "all-speakers") {
      const speakers = speakerSection("ar");
      return {
        ...section,
        blockType: "speakerDirectory",
        eyebrow: speakers.eyebrow,
        heading: "متحدثو ملتقى 2026",
        body: null,
        speakers: speakers.cards.map((speaker) => ({
          country: speaker.meta,
          eyebrow: speaker.eyebrow,
          name: speaker.title,
          portrait: speaker.media || null,
          role: speaker.body,
          workplace: speaker.workplace,
          visible: speaker.visible,
        })),
      };
    }
    if (section.anchorID === "sponsor-slider") {
      return {
        ...section,
        heading: "رعاة وشركاء ملتقى 2026",
      };
    }
    const partnerHeading: Record<string, string> = {
      "partner-category-supervision": "الإشراف والتنظيم",
      "partner-category-strategic": "الشركاء الاستراتيجيون",
      "partner-category-media": "الشركاء الإعلاميون",
      "partner-category-sponsors": "الرعاة",
    };
    if (section.anchorID && partnerHeading[section.anchorID]) {
      return {
        ...section,
        heading: partnerHeading[section.anchorID],
      };
    }
    return section;
  });
  return localized;
}
