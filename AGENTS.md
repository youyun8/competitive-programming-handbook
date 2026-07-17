# Repository Guide

## Architecture

- Astro static site with strict TypeScript and content collections.
- Markdown/MDX owns lessons, exercises, glossary entries, patterns, and learning paths.
- React islands are reserved for stateful UI: auth, sync, practice status, exercise notes, and visualizers.
- Supabase owns authentication, user data, RLS, and authenticated Edge Functions.
- Exercises use self-recorded learning status and private notes; the site does not compile or judge user code.
- `data/` contains publishable normalized metadata. Raw PDFs, rendered pages, and OCR output stay outside Git.

## Content Rules

- Write Traditional Chinese teaching notes; never reproduce scans and QR images.
- OCR is evidence, not truth. You have to confirm its contents yourself.
- Use the problem statements and independently written C++17 solutions. Variables, parameters, functions, methods, and lambda variables use `snake_case`; classes and structs use `PascalCase`.
- External OJ links may be published only after confirming the URL and attribution.

## Commands

- `pnpm dev` — local Astro development server.
- `pnpm format:check` — formatting validation.
- `pnpm lint` — ESLint and repository policy checks.
- `pnpm typecheck` — Astro/TypeScript checks.
- `pnpm test` — unit, content, sync, notes, and security tests.
- `pnpm test:e2e` — Playwright browser flows.
- `pnpm validate:content` — schemas, links, anchors, provenance, and C++ examples.
- `pnpm build` — production GitHub Pages build.
- `supabase db reset` — apply migrations and seed a local Supabase stack.

## Acceptance

- Every requested chapter, section, and Appendix A node has a non-empty public route or an explicit reviewed roadmap entry.
- Published content has traceable page metadata and no unverified OCR.
- Every public exercise card links to a verified external problem and supports status plus solution/thought notes.
- Auth, local-first progress, private notes, cloud sync, static search, and GitHub Pages subpath behavior have automated coverage.
- Public database tables use RLS; users cannot read or mutate another user's progress or notes.
- Format, lint, typecheck, tests, production build, content validation, C++ compilation, and secret scans pass.

## Never Do

- Do not commit `source/`, PDFs, OCR/render caches, scans, credentials, production data, or generated artifacts.
- Do not expose service-role keys, OAuth secrets, private notes, or solution code in logs/analytics.
- Do not guess OCR text or silently overwrite newer cloud progress.
- Do not use destructive Git commands or overwrite unrelated user changes.
