"use client";

import { signOut } from "next-auth/react";

import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";

type Copy = {
  dashboardTitle: string;
  categories: string;
  subjects: string;
  languages: string;
  signOut: string;
};

export function AdminNav({ copy }: { copy: Copy }) {
  return (
    <header className="flex items-center justify-between border-b border-border px-4 py-3">
      <span className="font-heading font-semibold">{copy.dashboardTitle}</span>
      <nav className="flex items-center gap-4 text-sm">
        <Link href="/admin/categories">{copy.categories}</Link>
        <Link href="/admin/subjects">{copy.subjects}</Link>
        <Link href="/admin/languages">{copy.languages}</Link>
        <Button variant="ghost" size="sm" onClick={() => signOut({ redirectTo: "/" })}>
          {copy.signOut}
        </Button>
      </nav>
    </header>
  );
}
