import configPromise from "@payload-config";
import { copyFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { getPayload } from "payload";

// The script preserves heterogeneous Payload block data while replacing only
// the explicitly mapped editorial fields below.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type RecordValue = Record<string, any>;

const root = process.cwd();

async function backupDatabase() {
  const backupRoot = path.join(root, ".runtime");
  await mkdir(backupRoot, { recursive: true });
  const stamp = new Date().toISOString().replaceAll(":", "-").replaceAll(".", "-");
  for (const filename of ["simf.db", "simf.db-wal", "simf.db-shm"]) {
    try {
      await copyFile(
        path.join(root, filename),
        path.join(backupRoot, `${filename}.before-programme-docx-${stamp}`),
      );
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
    }
  }
}

function renameProgrammeNavigation(section: RecordValue) {
  const updateLinks = (links: unknown) =>
    Array.isArray(links)
      ? links.map((link) =>
          link?.href === "/programme" ? { ...link, label: "Agenda" } : link,
        )
      : links;

  if (section.blockType === "simfHeader") {
    return { ...section, links: updateLinks(section.links) };
  }
  if (section.blockType === "simfFooter") {
    return { ...section, importantLinks: updateLinks(section.importantLinks) };
  }
  return section;
}

function applyProgrammeCopy(sections: RecordValue[]) {
  return sections.map((original) => {
    const section = renameProgrammeNavigation(original);

    if (section.blockType === "hero") {
      return {
        ...section,
        heading:
          "A Strategic Dialogue to Place Maritime Security at the Forefront of International Discourse",
        body:
          "Over three days, Riyadh will host naval leaders, government decision-makers, industry experts, and key stakeholders to discuss global maritime supply chains, maritime infrastructure, and seabed data security.",
      };
    }

    if (section.blockType === "mediaFeature") {
      return {
        ...section,
        heading: "From Strategic Dialogue to Building Partnerships Beyond the Forum",
        body:
          "Over three days of focused strategic engagement, the Saudi International Maritime Forum moves the conversation from merely discussing emerging challenges to anticipating future solutions. Each day addresses a pivotal dimension of maritime security, enabling the exchange of expertise, strengthening strategic coordination, and opening avenues for cooperation that extend beyond the Forum itself.",
      };
    }

    if (section.blockType === "cardGrid" && section.internalLabel === "Three programme days") {
      const copy = [
        {
          title: "Day One: Energy Supply Chain Security",
          body: "Highlighting the security of maritime energy supply chains and their role in stabilizing global trade.",
        },
        {
          title: "Day Two: Seabed Infrastructure Security and Its Global Impact",
          body: "Discussing seabed security, subsea communications infrastructure, and maritime cybersecurity.",
        },
        {
          title: "Day Three: The Role of Artificial Intelligence in Maritime Supply Chain Security",
          body: "Focusing on the use of artificial intelligence and emerging technologies to address future threats targeting maritime infrastructure and supply chains.",
        },
      ];
      return {
        ...section,
        heading:
          "An Integrated Framework Combining Strategic Vision with Scientific and Technological Depth",
        cards: section.cards.map((card: RecordValue, index: number) => ({
          ...card,
          ...copy[index],
        })),
      };
    }

    if (section.blockType === "cardGrid" && section.internalLabel === "Programme highlights") {
      const copy = [
        {
          title: "Keynote Sessions",
          body: "Strategic perspectives delivered by senior naval leaders, specialized experts, and industry executives on the priorities that ensure the security of energy supply chains, subsea communications infrastructure, and global supply chains.",
        },
        {
          title: "Scientific Sessions",
          body: "Comprehensive analyses of operational challenges, emerging technologies, and advanced approaches to protecting maritime and subsea infrastructure, presented by leading experts, scientists, and researchers in maritime security.",
        },
        {
          title: "Discussions Panel",
          body: "High-level dialogues bringing together decision-makers and experts to examine the current global landscape, geopolitical shifts, and their implications for the future of maritime security—while proposing realistic, actionable solutions.",
        },
        {
          title: "Government-to-Business Meetings (B2G)",
          body: "Pre-arranged meetings connecting sponsoring companies with government decision-makers and senior military leaders to propose innovative solutions, support institutional dialogue, and explore potential cooperation opportunities.",
        },
        {
          title: "Strategic Outcomes and Recommendations",
          body: "The final insights and recommendations developed throughout the Forum’s activities to support collaboration and define future maritime security priorities.",
        },
      ];
      return {
        ...section,
        eyebrow: "Forum Agenda",
        heading:
          "An Integrated Framework Combining Strategic, Scientific, and Technological Dimensions",
        body:
          "This integrated approach aims to create a comprehensive experience that brings together strategic dialogue, advanced technology showcases, and successful international partnership-building enhancing cooperation across the key domains of global maritime security.",
        cards: section.cards.map((card: RecordValue, index: number) => ({
          ...card,
          ...copy[index],
        })),
      };
    }

    if (section.blockType === "timeline") {
      const copy = [
        {
          title: "Global Strategic Shifts and Their Impact on Maritime Supply Chain Security",
          body: "Examining the effects of geopolitical transformations, regional crises, and disruptions affecting strategic maritime corridors on the security and resilience of global maritime supply chains.",
        },
        {
          title: "Security of Maritime Energy Supply Chains",
          body: "Addressing threats targeting energy supply chains and their impact on the global economy; alongside emerging approaches to protecting strategic energy routes, offshore and coastal infrastructure, subsea energy pipelines, and ensuring the continuity of energy supplies amid evolving risks.",
        },
        {
          title: "Seabed Security and Subsea Communications Infrastructure",
          body: "Discussing seabed infrastructure and subsea communications systems, focusing on the protection of undersea communication cables and critical seabed assets, with emphasis on surveillance, resilience, and the continuity of global connectivity.",
        },
        {
          title: "Maritime Cybersecurity: Challenges and Solutions",
          body: "Reviewing cyber risks targeting ports, vessels, navigation systems, and maritime logistics networks, together with measures aimed at strengthening resilience and enhancing incident-response readiness.",
        },
        {
          title: "The Role of Artificial Intelligence and Advanced Technologies in Seabed and Supply Chain Security",
          body: "Exploring the role of artificial intelligence, unmanned autonomous systems, advanced sensing technologies, and predictive capabilities in enhancing maritime domain awareness and protecting critical assets.",
        },
      ];
      return {
        ...section,
        eyebrow: "Key Topics",
        heading: "Five Strategic Priorities… One Shared Global Maritime Future",
        body:
          "The Forum focuses on five interconnected priorities that shape global trade, energy security, digital connectivity, and critical maritime infrastructure.",
        steps: section.steps.map((step: RecordValue, index: number) => ({
          ...step,
          ...copy[index],
        })),
      };
    }

    return section;
  });
}

await backupDatabase();
const payload = await getPayload({ config: configPromise });

try {
  const result = await payload.find({
    collection: "pages",
    depth: 0,
    fallbackLocale: false,
    limit: 100,
    locale: "en",
    overrideAccess: true,
  });

  for (const page of result.docs as RecordValue[]) {
    const isProgramme = page.pageType === "simf-microsite-programme";
    const sections = isProgramme
      ? applyProgrammeCopy(page.sections)
      : page.sections.map(renameProgrammeNavigation);

    await payload.update({
      collection: "pages",
      id: page.id,
      data: {
        sections,
        ...(isProgramme
          ? {
              title: "Agenda",
              seo: {
                ...page.seo,
                title: "Agenda | SIM 2026",
              },
            }
          : {}),
      } as never,
      draft: false,
      locale: "en",
      overrideAccess: true,
    });
  }

  console.log(`Updated ${result.docs.length} English page records; Arabic was not written.`);
} finally {
  await payload.destroy();
}
