import { getTranslations } from "next-intl/server";

export default async function AdminDashboardPage() {
  const t = await getTranslations("AdminNav");

  return (
    <main className="flex flex-1 items-center justify-center">
      <h1 className="font-heading text-2xl font-semibold">{t("dashboardTitle")}</h1>
    </main>
  );
}
