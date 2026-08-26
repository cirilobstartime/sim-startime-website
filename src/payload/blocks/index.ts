import type { Block } from "payload";
import { CardGridBlock } from "./CardGridBlock";
import { CallToActionBlock } from "./CallToActionBlock";
import { FormBlock } from "./FormBlock";
import { HeroBlock } from "./HeroBlock";
import { ImageStoryBlock } from "./ImageStoryBlock";
import { MediaFeatureBlock } from "./MediaFeatureBlock";
import { NewsMosaicBlock } from "./NewsMosaicBlock";
import { TimelineBlock } from "./TimelineBlock";
import { VideoFeatureBlock } from "./VideoFeatureBlock";
import { CountdownBlock } from "./CountdownBlock";
import { LegacyBlock } from "./LegacyBlock";
import { MetricRailBlock } from "./MetricRailBlock";
import { SimfFooterBlock } from "./SimfFooterBlock";
import { SimfHeaderBlock } from "./SimfHeaderBlock";
import { UpdateIndexBlock } from "./UpdateIndexBlock";
import { PartnerCategoryBlock } from "./PartnerCategoryBlock";
import { SpeakerDirectoryBlock } from "./SpeakerDirectoryBlock";

const contentBlocks: Block[] = [
  HeroBlock,
  SimfHeaderBlock,
  SpeakerDirectoryBlock,
  PartnerCategoryBlock,
  CardGridBlock,
  MediaFeatureBlock,
  ImageStoryBlock,
  NewsMosaicBlock,
  TimelineBlock,
  VideoFeatureBlock,
  CountdownBlock,
  LegacyBlock,
  MetricRailBlock,
  SimfFooterBlock,
  UpdateIndexBlock,
  FormBlock,
  CallToActionBlock,
];

// Editors identify sections by their clear block type and visible content.
// Payload's optional free-form block-name input otherwise appears as an
// unexplained “Untitled” field on every section.
export const pageBlocks: Block[] = contentBlocks.map((block) => ({
  ...block,
  admin: {
    ...block.admin,
    disableBlockName: true,
  },
}));
