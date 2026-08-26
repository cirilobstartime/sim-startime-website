# Security policy

## Reporting a security issue

Report suspected vulnerabilities privately to the project owner or authorized
Startime technical contact. Do not open a public issue containing credentials,
personal information, production URLs intended to remain private, or detailed
exploitation instructions.

Include the affected route or component, reproduction conditions, observed
impact and any relevant logs with secrets removed.

## Credential handling

- Keep production secrets in `/etc/simf/simf.env` with mode `0600`.
- Never commit `.env` files, SSH keys, SMTP passwords, AWS credentials,
  databases, uploads or backups.
- Store only placeholders in `.env.example`.
- Run `npm run verify:secrets` before every approved push.
- Rotate a credential immediately if it may have been exposed.

## Production changes

Back up the shared database and uploads before deployment. Apply changes one at
a time, verify the public site and CMS, and retain a tested rollback path. The
full procedure is documented in `deploy/README.md`.
