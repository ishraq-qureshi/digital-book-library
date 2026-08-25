import { getTranslations } from "next-intl/server";

import { TaxonomyManager } from "@/components/admin/taxonomy-manager";
import { listSubjects } from "@/lib/services/subjects";

export default async function AdminSubjectsPage() {
  const [t, items] = await Promise.all([getTranslations("AdminSubjects"), listSubjects()]);

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-4 px-4 py-8">
      <h1 className="font-heading text-2xl font-semibold">{t("title")}</h1>
      <TaxonomyManager
        namespace="AdminSubjects"
        basePath="/api/admin/subjects"
        initialItems={items}
        copy={{
          addPlaceholder: t("addPlaceholder"),
          addButton: t("addButton"),
          empty: t("empty"),
          bookCountLabel: t("bookCountLabel"),
          rename: t("rename"),
          save: t("save"),
          cancel: t("cancel"),
          delete: t("delete"),
          deleteConfirmTitle: t("deleteConfirmTitle"),
          genericError: t("genericError"),
        }}
      />
    </main>
  );
}
