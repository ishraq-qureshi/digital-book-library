import { getTranslations } from "next-intl/server";

import { LanguageManager } from "@/components/admin/language-manager";
import { listLanguages } from "@/lib/services/languages";

export default async function AdminLanguagesPage() {
  const [t, items] = await Promise.all([getTranslations("AdminLanguages"), listLanguages()]);

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-4 px-4 py-8">
      <h1 className="font-heading text-2xl font-semibold">{t("title")}</h1>
      <LanguageManager
        initialItems={items}
        copy={{
          codeLabel: t("codeLabel"),
          codePlaceholder: t("codePlaceholder"),
          nameLabel: t("nameLabel"),
          namePlaceholder: t("namePlaceholder"),
          rtlLabel: t("rtlLabel"),
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
