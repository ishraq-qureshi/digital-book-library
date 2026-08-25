import { NextResponse } from "next/server";
import createIntlMiddleware from "next-intl/middleware";

import { auth } from "./lib/auth";
import { routing } from "./i18n/routing";

const intlMiddleware = createIntlMiddleware(routing);

const ADMIN_PAGE_PATTERN = /^\/([a-z]{2})\/admin(\/.*)?$/;

// Next.js 16 renamed `middleware.ts` to `proxy.ts` (same behavior, new
// name/export) - see CLAUDE.md. This gates /[locale]/admin/* and
// /api/admin/* on an authenticated session; every admin Route Handler still
// re-checks the session itself (see CLAUDE.md's non-negotiables) since a
// matcher change here must never be the only thing standing between a
// request and the database.
export default auth((req) => {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/api")) {
    if (pathname.startsWith("/api/admin") && !req.auth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.next();
  }

  const intlResponse = intlMiddleware(req);

  // next-intl issuing a redirect (e.g. adding a missing locale prefix) means
  // the real pathname hasn't been resolved yet - let that happen first and
  // gate on the next request instead of guessing here.
  if (intlResponse.headers.get("location")) return intlResponse;

  const adminMatch = pathname.match(ADMIN_PAGE_PATTERN);
  if (adminMatch) {
    const [, locale, rest = ""] = adminMatch;
    const isLoginPage = rest === "/login";
    if (!isLoginPage && !req.auth) {
      return NextResponse.redirect(new URL(`/${locale}/admin/login`, req.url));
    }
  }

  return intlResponse;
});

export const config = {
  // Match all pathnames except for
  // - … Next internals (_next, _vercel)
  // - … the ones containing a dot (e.g. favicon.ico) - API routes are
  //   included so /api/admin/* gets the check above; other /api paths are
  //   passed straight through untouched.
  matcher: "/((?!_next|_vercel|.*\\..*).*)",
};
