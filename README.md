# Saudi International Maritime Forum website

This repository contains the SIMF public website and Payload CMS as one Next.js
application. English and Arabic content are managed independently in Payload,
while media, navigation, SEO, forms and marketing settings remain editable by
authorized CMS users.

## Local development

For a clean, reproducible development database that contains the approved
public English and Arabic content but no production users or form submissions:

```bash
cp .env.example .env
npm ci
npm run seed
npm run dev -- --port 3004
```

Use development-only secret values in `.env`; never commit credentials.
Create a local administrator separately with `npm run create-admin`; the
required `ADMIN_EMAIL` and `ADMIN_PASSWORD` values must be supplied only in the
local shell environment.

The live SQLite database and CMS/form uploads are not stored in Git. They can
contain personal data, password hashes and private submissions. Authorized
operators who need an exact environment must obtain a verified encrypted
recovery archive through the process documented in
[the deployment and recovery manual](deploy/README.md#database-and-dataset-availability).

## Verification

```bash
npm run typecheck
npm run lint
npm run build
npm run verify:tracking
npm run verify:media
```

## Production

The maintained systemd, Nginx, backup and hardening files are in `deploy/`.
Follow [the deployment and recovery manual](deploy/README.md) for first-time
installation, routine releases, rollback, CMS recovery and troubleshooting on
an AWS `t3.small`.

The `main` branch contains approved production releases. Local experiments and
client-review changes are tested separately and are merged only after approval.
