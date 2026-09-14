import * as targetedSchemaUpdates from "./20260802_133500_targeted_schema_updates";
import * as mediaTitles from "./20260831_120000_media_titles";
import * as responsiveMedia from "./20260910_012000_responsive_media";
import * as comingSoonMode from "./20260910_023000_coming_soon_mode";
import * as defaultOpenGraphImage from "./20260914_141500_default_open_graph_image";
import * as externalUpdates from "./20260914_184000_external_updates";

export const migrations = [
  {
    up: targetedSchemaUpdates.up,
    down: targetedSchemaUpdates.down,
    name: "20260802_133500_targeted_schema_updates",
  },
  {
    up: mediaTitles.up,
    down: mediaTitles.down,
    name: "20260831_120000_media_titles",
  },
  {
    up: responsiveMedia.up,
    down: responsiveMedia.down,
    name: "20260910_012000_responsive_media",
  },
  {
    up: comingSoonMode.up,
    down: comingSoonMode.down,
    name: "20260910_023000_coming_soon_mode",
  },
  {
    up: defaultOpenGraphImage.up,
    down: defaultOpenGraphImage.down,
    name: "20260914_141500_default_open_graph_image",
  },
  {
    up: externalUpdates.up,
    down: externalUpdates.down,
    name: "20260914_184000_external_updates",
  },
];
