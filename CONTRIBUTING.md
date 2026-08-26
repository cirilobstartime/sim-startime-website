# Contributing

## Development workflow

1. Create a focused branch from the current `main` branch.
2. Keep CMS data, uploads, credentials and machine-specific configuration out
   of Git.
3. Test changes locally on both English and Arabic routes.
4. Run the required checks before requesting review:

```bash
npm ci
npm run verify:secrets
npm run typecheck
npm run lint
npm run build
```

5. Describe any database migration, environment change or deployment step in
   the pull request.
6. Merge only approved, production-ready work into `main`.

## Code expectations

- Preserve independent English and Arabic content and publication status.
- Keep public content, navigation, media, SEO and forms editable in Payload.
- Preserve `/var/www/simf/shared` during production deployments.
- Prefer small, reviewable changes with clear commit messages.
- Include accessible labels and responsive behavior for interface changes.
- Do not weaken security headers or access controls without a documented reason
  and review.

## Commit messages

Use concise, imperative summaries that describe the delivered outcome, for
example: `Fix CMS media editing on low-memory servers`.
