# Saudi International Maritime Forum website

This repository contains the SIMF public website and Payload CMS as one Next.js
application. English and Arabic content are managed independently in Payload,
while media, navigation, SEO, forms and marketing settings remain editable by
authorized CMS users.

## Local development

```bash
cp .env.example .env
npm ci
npm run dev -- --port 3004
```

Use development-only secret values in `.env`; never commit credentials.

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
