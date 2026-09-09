import {
  type MigrateDownArgs,
  type MigrateUpArgs,
  sql,
} from "@payloadcms/db-sqlite";

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.run(sql`
    ALTER TABLE updates
    ADD COLUMN mobile_featured_image_id integer
    REFERENCES media(id) ON UPDATE no action ON DELETE set null;
  `);
  await db.run(sql`
    CREATE INDEX updates_mobile_featured_image_idx
    ON updates (mobile_featured_image_id);
  `);

  await db.run(sql`
    ALTER TABLE _updates_v
    ADD COLUMN version_mobile_featured_image_id integer
    REFERENCES media(id) ON UPDATE no action ON DELETE set null;
  `);
  await db.run(sql`
    CREATE INDEX _updates_v_version_version_mobile_featured_image_idx
    ON _updates_v (version_mobile_featured_image_id);
  `);

  await db.run(sql`
    ALTER TABLE updates_content
    ADD COLUMN mobile_media_id integer
    REFERENCES media(id) ON UPDATE no action ON DELETE set null;
  `);
  await db.run(sql`
    CREATE INDEX updates_content_mobile_media_idx
    ON updates_content (mobile_media_id);
  `);

  await db.run(sql`
    ALTER TABLE _updates_v_version_content
    ADD COLUMN mobile_media_id integer
    REFERENCES media(id) ON UPDATE no action ON DELETE set null;
  `);
  await db.run(sql`
    CREATE INDEX _updates_v_version_content_mobile_media_idx
    ON _updates_v_version_content (mobile_media_id);
  `);

  await db.run(sql`
    ALTER TABLE site_settings
    ADD COLUMN mobile_header_logo_id integer
    REFERENCES media(id) ON UPDATE no action ON DELETE set null;
  `);
  await db.run(sql`
    CREATE INDEX site_settings_mobile_header_logo_idx
    ON site_settings (mobile_header_logo_id);
  `);
  await db.run(sql`
    ALTER TABLE site_settings
    ADD COLUMN mobile_footer_logo_id integer
    REFERENCES media(id) ON UPDATE no action ON DELETE set null;
  `);
  await db.run(sql`
    CREATE INDEX site_settings_mobile_footer_logo_idx
    ON site_settings (mobile_footer_logo_id);
  `);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP INDEX site_settings_mobile_footer_logo_idx;`);
  await db.run(sql`ALTER TABLE site_settings DROP COLUMN mobile_footer_logo_id;`);
  await db.run(sql`DROP INDEX site_settings_mobile_header_logo_idx;`);
  await db.run(sql`ALTER TABLE site_settings DROP COLUMN mobile_header_logo_id;`);

  await db.run(sql`DROP INDEX _updates_v_version_content_mobile_media_idx;`);
  await db.run(sql`ALTER TABLE _updates_v_version_content DROP COLUMN mobile_media_id;`);
  await db.run(sql`DROP INDEX updates_content_mobile_media_idx;`);
  await db.run(sql`ALTER TABLE updates_content DROP COLUMN mobile_media_id;`);

  await db.run(sql`DROP INDEX _updates_v_version_version_mobile_featured_image_idx;`);
  await db.run(sql`ALTER TABLE _updates_v DROP COLUMN version_mobile_featured_image_id;`);
  await db.run(sql`DROP INDEX updates_mobile_featured_image_idx;`);
  await db.run(sql`ALTER TABLE updates DROP COLUMN mobile_featured_image_id;`);
}
