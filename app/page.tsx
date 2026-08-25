import { redirect } from "next/navigation";

import { routing } from "@/i18n/routing";

// Normal requests to `/` never reach this: `proxy.ts` redirects to the
// matched locale first. This only renders for a statically exported build.
export default function RootPage() {
  redirect(`/${routing.defaultLocale}`);
}
