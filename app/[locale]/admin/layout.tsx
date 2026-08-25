import { getTranslations } from "next-intl/server";

import { AdminNav } from "@/components/admin/admin-nav";
import { auth } from "@/lib/auth";

export default async function AdminLayout({ children }: LayoutProps<"/[locale]/admin">) {
  const session = await auth();
  const t = await getTranslations("AdminNav");

  return (
    <div className="flex flex-1 flex-col">
      {session ? (
        <AdminNav
          copy={{
            dashboardTitle: t("dashboardTitle"),
            categories: t("categories"),
            subjects: t("subjects"),
            languages: t("languages"),
            signOut: t("signOut"),
          }}
        />
      ) : null}
      {children}
    </div>
  );
}
