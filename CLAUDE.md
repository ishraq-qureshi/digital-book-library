@AGENTS.md

# Kitaabi — Project Rules

Digital catalog for a physical library (thousands of books). Public search/
filter by title/author/ISBN/category/subject/language; admin manages
entries, shelf location, availability. Full plan: see the milestone issues
on the GitHub Project board. Architecture/data model: `docs/ARCHITECTURE.md`.

## Non-negotiables

- **TDD.** Write the failing test before the implementation, for every
  feature — Vitest for schemas/lib/API routes, React Testing Library for
  components, Playwright for end-to-end flows. CI blocks merge on red.
- **Next.js 16, not 15.** `middleware.ts` is deprecated — use `proxy.ts`
  exporting a `proxy` function. Proxy is a routing/redirect boundary, not a
  substitute for real authorization: every admin Server Action and Route
  Handler must independently check the session, not rely on `proxy.ts`
  alone having gated the route (see Next's own Data Security guidance).
- **i18n.** Every new UI string is added to all 5 locale message files
  (`messages/en.json`, `ur.json`, `sd.json`, `fa.json`, `ar.json`) in the
  same PR — no hardcoded chrome text. Every page sets `lang`/`dir` correctly
  for its locale.
- **Admin mutations.** Every admin-mutating API route/Server Action:
  validates input with a Zod schema before touching the database, and
  writes an `AdminAuditLog` row (entityType/entityId/action/detail).
- **Accessibility.** See `docs/ACCESSIBILITY.md`. Non-optional, not a
  follow-up pass.
- **SEO.** See `docs/SEO.md`. Public pages are server-rendered; no
  client-only-rendered content that a crawler would see as empty.
- **Design system.** See `docs/DESIGN_SYSTEM.md`. Use the existing
  shadcn/ui primitive + design token for a pattern (modal, popover, toast,
  skeleton) rather than building a new one-off component.

## Naming & structure

- Files/routes: kebab-case (`book-list.tsx`, `app/[locale]/admin/books/`).
- Components: PascalCase (`BookCard`, `AvailabilityBadge`).
- Functions/variables: camelCase.
- Prisma models: PascalCase singular (`Book`, `AdminAuditLog`); fields
  camelCase.
- Folders: `app/[locale]/...` (routes), `lib/` (server helpers, db, auth,
  validation), `prisma/` (schema + migrations), `tests/` (Vitest),
  `e2e/` (Playwright), `messages/` (i18n).

## Commits & PRs

- Commit messages: imperative mood, present tense (`Add book search API`,
  not `Added` / `Adds`).
- One GitHub Issue per PR where practical; PR description states which
  locales were touched and what tests were added.
- Merge requires CI green (lint + Vitest + Playwright).
