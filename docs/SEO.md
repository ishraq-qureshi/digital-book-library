# SEO Rules

- **Book detail pages are real pages.** Every book gets
  `/[locale]/books/[slug]` — server-rendered, indexable, linkable. The
  public search/browse page is not a substitute for this; search results
  link out to it.
- **Metadata per page, per locale.** Use Next's Metadata API for a
  translated `<title>`/description on every public page; set a canonical
  URL for that locale/page.
- **hreflang alternates.** Every public page links `hreflang` alternates to
  the equivalent page in the other 4 locales.
- **Structured data.** Book detail pages include JSON-LD (`schema.org/Book`)
  and Open Graph/Twitter card tags.
- **Sitemap & robots stay in sync with the database.** `app/sitemap.ts`
  generates entries for every book × every locale dynamically (not a static
  file); `app/robots.ts` allows public routes, disallows `/admin` and
  `/api`.
- **Real 404s.** The custom `not-found.tsx` per locale must return an actual
  404 status, not a 200 with a "not found" message (a soft 404).
- **Maintenance mode still needs a real status.** When `SiteSetting.
  maintenanceMode` is on, the public maintenance page responds 503, not 200.
- **Performance feeds ranking.** Server-render primary content (no
  blank-then-hydrate), `next/image` for covers, `next/font` for the 5 script
  fonts — already required for other reasons, but they matter here too.
- **Clean URLs.** Human-readable slugs, consistent shape across locales
  (`/en/books/...`, `/ur/books/...`).
