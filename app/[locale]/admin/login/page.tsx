import { getTranslations } from "next-intl/server";

import { LoginForm } from "@/components/admin/login-form";

export default async function AdminLoginPage() {
  const t = await getTranslations("AdminLogin");

  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-6 px-6">
      <h1 className="font-heading text-2xl font-semibold">{t("title")}</h1>
      <LoginForm
        copy={{
          usernameLabel: t("usernameLabel"),
          passwordLabel: t("passwordLabel"),
          submit: t("submit"),
          error: t("error"),
          rateLimited: t("rateLimited"),
        }}
      />
    </main>
  );
}
