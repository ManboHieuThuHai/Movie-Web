# i18n and CI/CD plan

## i18n rollout

1. Extract navigation, buttons, loading and error states, headings,
   accessibility labels, and footer links into typed translation keys.
2. Keep English as the source locale and add Vietnamese as `vi`, with messages
   stored in `src/locales/en.json` and `src/locales/vi.json`.
3. Add locale routing with `/en` and `/vi`, redirect from `/`, and persist the
   selected locale in a cookie.
4. Pass the active locale to TMDB requests, using `en-US` or `vi-VN`, and make
   query cache keys locale-aware.
5. Use `Intl.NumberFormat` and `Intl.DateTimeFormat` for ratings and dates.
6. Add parity checks so every locale contains the same keys as English, then
   test long Vietnamese labels, metadata, and the document language attribute.

Recommended order: translation helpers and types, shared layout and
navigation, catalog and details pages, TMDB language propagation, then tests.

## CI/CD rollout

The repository includes `.github/workflows/ci.yml`, which runs on `develop`,
`main`, `master`, and pull requests. It performs `npm ci`, linting, and a
production build. Configure `TMDB_API_READ_TOKEN` as a GitHub Actions secret.

For production:

1. Protect `develop` and `main` with required CI checks and pull-request review.
2. Use preview deployments for pull requests and production deployment only
   from `main`.
3. Add Dependabot, secret scanning, and smoke tests for the main catalog routes.
4. Keep deployment in Vercel unless the project moves away from Vercel; avoid
   competing deployment paths.
5. Promote changes through `feature -> develop -> main` and document rollback
   and TMDB outage behavior.
