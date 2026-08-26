import {
  type MigrateDownArgs,
  type MigrateUpArgs,
  sql,
} from "@payloadcms/db-sqlite";

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.run(
    sql`ALTER TABLE \`updates_content\` ADD COLUMN \`rich_body\` text;`,
  );
  await db.run(
    sql`ALTER TABLE \`_updates_v_version_content\` ADD COLUMN \`rich_body\` text;`,
  );
  await db.run(
    sql`ALTER TABLE \`marketing_settings\` ADD COLUMN \`attribution_cookie_domain\` text DEFAULT '.startime.sa';`,
  );
  await db.run(
    sql`ALTER TABLE \`_marketing_settings_v\` ADD COLUMN \`version_attribution_cookie_domain\` text DEFAULT '.startime.sa';`,
  );
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.run(
    sql`ALTER TABLE \`_marketing_settings_v\` DROP COLUMN \`version_attribution_cookie_domain\`;`,
  );
  await db.run(
    sql`ALTER TABLE \`marketing_settings\` DROP COLUMN \`attribution_cookie_domain\`;`,
  );
  await db.run(
    sql`ALTER TABLE \`_updates_v_version_content\` DROP COLUMN \`rich_body\`;`,
  );
  await db.run(
    sql`ALTER TABLE \`updates_content\` DROP COLUMN \`rich_body\`;`,
  );
}
