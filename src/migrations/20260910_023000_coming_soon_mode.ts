import {
  type MigrateDownArgs,
  type MigrateUpArgs,
  sql,
} from "@payloadcms/db-sqlite";

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.run(sql`
    ALTER TABLE site_settings
    ADD COLUMN coming_soon_enabled integer DEFAULT false;
  `);
  await db.run(sql`
    ALTER TABLE site_settings
    ADD COLUMN coming_soon_contact_email text DEFAULT 'sim@startime.sa';
  `);
  await db.run(sql`ALTER TABLE site_settings ADD COLUMN coming_soon_label text;`);
  await db.run(sql`ALTER TABLE site_settings ADD COLUMN coming_soon_title text;`);
  await db.run(sql`ALTER TABLE site_settings ADD COLUMN coming_soon_message text;`);
  await db.run(sql`ALTER TABLE site_settings ADD COLUMN coming_soon_event_date text;`);
  await db.run(sql`ALTER TABLE site_settings ADD COLUMN coming_soon_venue text;`);
  await db.run(sql`ALTER TABLE site_settings ADD COLUMN coming_soon_contact_label text;`);
  await db.run(sql`
    ALTER TABLE site_settings
    ADD COLUMN coming_soon_background_image_id integer
    REFERENCES media(id) ON UPDATE no action ON DELETE set null;
  `);
  await db.run(sql`
    CREATE INDEX site_settings_coming_soon_background_image_idx
    ON site_settings (coming_soon_background_image_id);
  `);
  await db.run(sql`
    ALTER TABLE site_settings
    ADD COLUMN coming_soon_mobile_background_image_id integer
    REFERENCES media(id) ON UPDATE no action ON DELETE set null;
  `);
  await db.run(sql`
    CREATE INDEX site_settings_coming_soon_mobile_background_image_idx
    ON site_settings (coming_soon_mobile_background_image_id);
  `);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP INDEX site_settings_coming_soon_mobile_background_image_idx;`);
  await db.run(sql`ALTER TABLE site_settings DROP COLUMN coming_soon_mobile_background_image_id;`);
  await db.run(sql`DROP INDEX site_settings_coming_soon_background_image_idx;`);
  await db.run(sql`ALTER TABLE site_settings DROP COLUMN coming_soon_background_image_id;`);
  await db.run(sql`ALTER TABLE site_settings DROP COLUMN coming_soon_contact_label;`);
  await db.run(sql`ALTER TABLE site_settings DROP COLUMN coming_soon_venue;`);
  await db.run(sql`ALTER TABLE site_settings DROP COLUMN coming_soon_event_date;`);
  await db.run(sql`ALTER TABLE site_settings DROP COLUMN coming_soon_message;`);
  await db.run(sql`ALTER TABLE site_settings DROP COLUMN coming_soon_title;`);
  await db.run(sql`ALTER TABLE site_settings DROP COLUMN coming_soon_label;`);
  await db.run(sql`ALTER TABLE site_settings DROP COLUMN coming_soon_contact_email;`);
  await db.run(sql`ALTER TABLE site_settings DROP COLUMN coming_soon_enabled;`);
}
