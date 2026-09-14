import {
  type MigrateDownArgs,
  type MigrateUpArgs,
  sql,
} from "@payloadcms/db-sqlite";

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.run(sql`
    ALTER TABLE site_settings
    ADD COLUMN default_open_graph_image_id integer
    REFERENCES media(id) ON UPDATE no action ON DELETE set null;
  `);
  await db.run(sql`
    CREATE INDEX site_settings_default_open_graph_image_idx
    ON site_settings (default_open_graph_image_id);
  `);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP INDEX site_settings_default_open_graph_image_idx;`);
  await db.run(
    sql`ALTER TABLE site_settings DROP COLUMN default_open_graph_image_id;`,
  );
}
