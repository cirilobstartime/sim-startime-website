import {
  type MigrateDownArgs,
  type MigrateUpArgs,
  sql,
} from "@payloadcms/db-sqlite";

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.run(
    sql`ALTER TABLE updates ADD COLUMN destination_type text DEFAULT 'internal';`,
  );
  await db.run(sql`ALTER TABLE updates ADD COLUMN external_u_r_l text;`);
  await db.run(
    sql`ALTER TABLE _updates_v ADD COLUMN version_destination_type text DEFAULT 'internal';`,
  );
  await db.run(
    sql`ALTER TABLE _updates_v ADD COLUMN version_external_u_r_l text;`,
  );
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.run(
    sql`ALTER TABLE _updates_v DROP COLUMN version_external_u_r_l;`,
  );
  await db.run(
    sql`ALTER TABLE _updates_v DROP COLUMN version_destination_type;`,
  );
  await db.run(sql`ALTER TABLE updates DROP COLUMN external_u_r_l;`);
  await db.run(sql`ALTER TABLE updates DROP COLUMN destination_type;`);
}
