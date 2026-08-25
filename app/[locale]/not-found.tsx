import { getTranslations } from "next-intl/server";

import { Link } from "@/i18n/navigation";

// Minimal version for now - the on-brand 404 (Kitaabi mark, full styling)
// is built out in Milestone 6 alongside maintenance mode.
export default async function LocaleNotFound() {
  const t = await getTranslations("NotFound");

  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
      <h1 className="font-heading text-3xl font-semibold">{t("title")}</h1>
      <p className="max-w-md text-muted-foreground">{t("body")}</p>
      <Link href="/" className="text-primary underline">
        {t("backLink")}
      </Link>
    </main>
  );
}
