import * as targetedSchemaUpdates from "./20260802_133500_targeted_schema_updates";

export const migrations = [
  {
    up: targetedSchemaUpdates.up,
    down: targetedSchemaUpdates.down,
    name: "20260802_133500_targeted_schema_updates",
  },
];
