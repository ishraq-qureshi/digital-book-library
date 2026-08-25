# Architecture

## Stack

- **Framework:** Next.js 16 (App Router, TypeScript). Note: `middleware.ts`
  is deprecated in Next 16 → use `proxy.ts` (see `CLAUDE.md`).
- **Database:** Postgres. Local dev: Docker Compose container. Staging/
  production: Neon (branch per environment).
- **ORM:** Prisma 7 (stable; do not upgrade to the 8.x pre-release track
  without deliberately re-testing — `npx prisma migrate dev` will offer it).
  Prisma 7 generates its client to `app/generated/prisma` (via the
  `prisma-client` generator) rather than into `node_modules`, and connection
  URLs live in `prisma.config.ts` (loaded from `.env` via `dotenv/config`),
  not in `schema.prisma`.
- **DB adapter:** `lib/db.ts` picks the driver adapter by inspecting
  `DATABASE_URL`: a `neon.tech` host uses `@prisma/adapter-neon` (WebSocket,
  via the `ws` package); anything else (the local Docker container) uses
  `@prisma/adapter-pg`. Neon's serverless driver speaks Neon's own wire
  protocol and cannot talk to a plain Postgres container, which is why local
  dev needs the second adapter.
- **Auth:** Auth.js (`next-auth@5`), credentials provider, single admin
  account.
- **i18n:** `next-intl`, locale-prefixed routing (`/en`, `/ur`, `/sd`, `/fa`,
  `/ar`), RTL resolved per locale.
- **UI:** Tailwind CSS + shadcn/ui (Base UI primitives, not Radix — this
  install resolved to the newer Base UI-backed shadcn components; `Dialog`'s
  close/trigger use the `render={<Element />}` prop, not `asChild`) — see
  `docs/DESIGN_SYSTEM.md`.
- **Validation:** Zod, shared between forms and API/Server Action handlers.

## Data model

Defined in `prisma/schema.prisma`:

- `Book` — `slug` (unique, SEO URL), `isbn` (unique, optional), `title`,
  `author`, `description`, `coverUrl`, `shelfNumber`, `available`, one
  `Language` (required, single), many `Category`/`Subject` via join tables.
- `Category`, `Subject` — admin-managed, many-to-many with `Book` via
  `BookCategory`/`BookSubject`.
- `Language` — admin-managed (`code`, `name`, `rtl` flag). Adding a 6th
  language is a data change, not a schema/code change.
- `Admin` — single/few admin accounts, bcrypt password hash.
- `AdminAuditLog` — every admin mutation (books, taxonomy, site settings)
  writes one row: `entityType`, `entityId`, `action`, `detail` (JSON).
- `SiteSetting` — singleton row (`id = "singleton"`): `siteName`, `logoUrl`,
  `maintenanceMode`, `maintenanceMessage` (per-locale JSON).

Search uses Postgres trigram indexes (`pg_trgm`, migration
`20260825124544_add_trigram_search`) on `Book.title`/`Book.author` for fast
partial/fuzzy matching — script-agnostic, so it works the same for Latin and
Arabic-script titles.

## Why not a separate backend service

At this scale (thousands of books, 1-2 admins) a split frontend/backend adds
a second deploy target and network latency with no offsetting benefit —
Next.js Route Handlers/Server Actions are the API. Revisit only if a mobile
app or heavy background processing gets added later; nothing in the data
model blocks that split.

## Environments

| Stage | Where | Database |
|---|---|---|
| Dev | Docker Compose, local | Postgres container |
| Staging | Vercel preview deployments (per-branch) | Neon staging branch |
| Production | Vercel production (main branch) | Neon main branch |
