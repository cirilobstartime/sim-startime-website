import {
  type MigrateDownArgs,
  type MigrateUpArgs,
  sql,
} from "@payloadcms/db-sqlite";

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`media_locales\` ADD COLUMN \`title\` text;`);
  await db.run(
    sql`UPDATE \`media_locales\` SET \`title\` = \`alt\` WHERE \`title\` IS NULL OR trim(\`title\`) = '';`,
  );
  await db.run(sql`
    UPDATE \`pages_locales\`
    SET \`sections\` = (
      SELECT json_group_array(
        json(
          json_set(
            \`value\`,
            '$.blockName',
            CASE
              WHEN json_extract(\`value\`, '$.anchorID') = 'sponsorship'
                THEN CASE WHEN \`pages_locales\`.\`_locale\` = 'ar'
                  THEN 'دعوة الرعاية الختامية'
                  ELSE 'Final Sponsorship CTA'
                END
              ELSE coalesce(
                nullif(json_extract(\`value\`, '$.blockName'), ''),
                nullif(json_extract(\`value\`, '$.internalLabel'), ''),
                nullif(json_extract(\`value\`, '$.heading'), ''),
                json_extract(\`value\`, '$.blockType'),
                'Section'
              )
            END
          )
        )
      )
      FROM json_each(\`pages_locales\`.\`sections\`)
    )
    WHERE \`sections\` IS NOT NULL;
  `);
  await db.run(sql`
    UPDATE \`_pages_v_locales\`
    SET \`version_sections\` = (
      SELECT json_group_array(
        json(
          json_set(
            \`value\`,
            '$.blockName',
            CASE
              WHEN json_extract(\`value\`, '$.anchorID') = 'sponsorship'
                THEN CASE WHEN \`_pages_v_locales\`.\`_locale\` = 'ar'
                  THEN 'دعوة الرعاية الختامية'
                  ELSE 'Final Sponsorship CTA'
                END
              ELSE coalesce(
                nullif(json_extract(\`value\`, '$.blockName'), ''),
                nullif(json_extract(\`value\`, '$.internalLabel'), ''),
                nullif(json_extract(\`value\`, '$.heading'), ''),
                json_extract(\`value\`, '$.blockType'),
                'Section'
              )
            END
          )
        )
      )
      FROM json_each(\`_pages_v_locales\`.\`version_sections\`)
    )
    WHERE \`version_sections\` IS NOT NULL;
  `);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`media_locales\` DROP COLUMN \`title\`;`);
}
