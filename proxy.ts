import createMiddleware from "next-intl/middleware";

import { routing } from "./i18n/routing";

// Next.js 16 renamed `middleware.ts` to `proxy.ts` (same behavior, new
// name/export) - see CLAUDE.md. Admin-route auth gating and maintenance-mode
// checks land here too once M2/M6 build them; this file must keep matching
// every non-asset path so those checks aren't accidentally skipped.
export default createMiddleware(routing);

export const config = {
  // Match all pathnames except for
  // - … if they start with `/api`, `/_next` or `/_vercel`
  // - … the ones containing a dot (e.g. `favicon.ico`)
  matcher: "/((?!api|_next|_vercel|.*\\..*).*)",
};
