import { getTranslations } from "next-intl/server";

import { ThemeToggle } from "@/components/theme-toggle";

export default async function HomePage() {
  const t = await getTranslations("HomePage");
  const themeLabel = (await getTranslations("ThemeToggle"))("label");

  return (
    <div className="flex flex-1 flex-col">
      <header className="flex items-center justify-end p-4">
        <ThemeToggle label={themeLabel} />
      </header>
      <main className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
        <h1 className="font-heading text-4xl font-semibold">{t("greeting")}</h1>
        <p className="max-w-md text-muted-foreground">{t("tagline")}</p>
      </main>
    </div>
  );
}
