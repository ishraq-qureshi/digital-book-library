# Kitaabi

Digital catalog for a physical library: public search/filter by title,
author, ISBN, category, subject, and language (English, Urdu, Sindhi, Farsi,
Arabic — extensible); admin manages entries, shelf location, and
availability.

See `CLAUDE.md` for project rules and `docs/ARCHITECTURE.md` for the full
stack/data model. Milestones are tracked as GitHub Issues on the project
board.

## Local development

```bash
docker compose up -d postgres   # or `docker compose up` to run the app in a container too
cp .env.example .env            # already present with local defaults; edit if needed
npm install
npx prisma migrate deploy
npx prisma db seed              # 5 base languages + a dev admin account
npm run dev
```

App runs at http://localhost:3000, redirecting to `/en` (also available:
`/ur`, `/sd`, `/fa`, `/ar`). Admin is at `/en/admin` (redirects to
`/en/admin/login` if signed out).

Seeded admin credentials default to `admin` / `kitaabi-dev-only` - override
with `ADMIN_USERNAME` / `ADMIN_PASSWORD` env vars before seeding if you want
something else locally.

## Testing

```bash
npm run test        # Vitest (unit/integration)
npm run test:watch  # Vitest, watch mode
npm run test:e2e    # Playwright (starts a production build automatically)
```

TDD is required for all work — see `CLAUDE.md`.

## Environments

| Stage | Where | Database |
|---|---|---|
| Dev | Docker Compose, local | Postgres container |
| Staging | Vercel preview deployments (per-branch) | Neon staging branch |
| Production | Vercel production (main branch) | Neon main branch |
