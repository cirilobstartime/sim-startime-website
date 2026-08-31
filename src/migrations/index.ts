import * as targetedSchemaUpdates from "./20260802_133500_targeted_schema_updates";
import * as mediaTitles from "./20260831_120000_media_titles";

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
];
