"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import type { FormEvent } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export type LanguageItem = {
  id: string;
  code: string;
  name: string;
  rtl: boolean;
  bookCount: number;
};

type Copy = {
  codeLabel: string;
  codePlaceholder: string;
  nameLabel: string;
  namePlaceholder: string;
  rtlLabel: string;
  addButton: string;
  empty: string;
  bookCountLabel: string;
  rename: string;
  save: string;
  cancel: string;
  delete: string;
  deleteConfirmTitle: string;
  genericError: string;
};

export function LanguageManager({
  initialItems,
  copy,
}: {
  initialItems: LanguageItem[];
  copy: Copy;
}) {
  // deleteConfirmBody/inUseError are interpolated per-item, so they're read
  // here (client side) rather than passed as function props - Server
  // Components can't pass closures across the RSC boundary.
  const t = useTranslations("AdminLanguages");
  const [items, setItems] = useState(initialItems);
  const [newCode, setNewCode] = useState("");
  const [newName, setNewName] = useState("");
  const [newRtl, setNewRtl] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const [editingRtl, setEditingRtl] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<LanguageItem | null>(null);

  async function handleAdd(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const code = newCode.trim();
    const name = newName.trim();
    if (!code || !name) return;

    const response = await fetch("/api/admin/languages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code, name, rtl: newRtl }),
    });

    if (!response.ok) {
      toast.error(copy.genericError);
      return;
    }

    const created = (await response.json()) as { id: string; code: string; name: string; rtl: boolean };
    setItems((prev) => [...prev, { ...created, bookCount: 0 }].sort((a, b) => a.name.localeCompare(b.name)));
    setNewCode("");
    setNewName("");
    setNewRtl(false);
  }

  async function handleRename(id: string) {
    const name = editingName.trim();
    if (!name) return;

    const response = await fetch(`/api/admin/languages/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, rtl: editingRtl }),
    });

    if (!response.ok) {
      toast.error(copy.genericError);
      return;
    }

    setItems((prev) =>
      prev
        .map((item) => (item.id === id ? { ...item, name, rtl: editingRtl } : item))
        .sort((a, b) => a.name.localeCompare(b.name)),
    );
    setEditingId(null);
  }

  async function handleDelete(item: LanguageItem) {
    const response = await fetch(`/api/admin/languages/${item.id}`, { method: "DELETE" });

    if (!response.ok) {
      if (response.status === 409) {
        const body = (await response.json()) as { bookCount: number };
        toast.error(t("inUseError", { count: body.bookCount }));
      } else {
        toast.error(copy.genericError);
      }
      setPendingDelete(null);
      return;
    }

    setItems((prev) => prev.filter((i) => i.id !== item.id));
    setPendingDelete(null);
  }

  return (
    <div className="flex flex-col gap-4">
      <form onSubmit={handleAdd} className="flex flex-wrap items-end gap-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="new-lang-code">{copy.codeLabel}</Label>
          <Input
            id="new-lang-code"
            value={newCode}
            onChange={(e) => setNewCode(e.target.value)}
            placeholder={copy.codePlaceholder}
            className="w-24"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="new-lang-name">{copy.nameLabel}</Label>
          <Input
            id="new-lang-name"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder={copy.namePlaceholder}
          />
        </div>
        <label className="flex items-center gap-2 pb-2 text-sm">
          <input type="checkbox" checked={newRtl} onChange={(e) => setNewRtl(e.target.checked)} />
          {copy.rtlLabel}
        </label>
        <Button type="submit">{copy.addButton}</Button>
      </form>

      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground">{copy.empty}</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {items.map((item) => (
            <li
              key={item.id}
              className="flex items-center justify-between gap-3 rounded-md border border-border px-3 py-2"
            >
              {editingId === item.id ? (
                <div className="flex flex-1 flex-wrap items-center gap-2">
                  <Input value={editingName} onChange={(e) => setEditingName(e.target.value)} autoFocus />
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={editingRtl}
                      onChange={(e) => setEditingRtl(e.target.checked)}
                    />
                    {copy.rtlLabel}
                  </label>
                  <Button size="sm" onClick={() => handleRename(item.id)}>
                    {copy.save}
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => setEditingId(null)}>
                    {copy.cancel}
                  </Button>
                </div>
              ) : (
                <>
                  <span>
                    <span className="font-mono text-sm text-muted-foreground">{item.code}</span>{" "}
                    {item.name}{" "}
                    <span className="text-sm text-muted-foreground">
                      · {copy.bookCountLabel}: {item.bookCount}
                    </span>
                  </span>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setEditingId(item.id);
                        setEditingName(item.name);
                        setEditingRtl(item.rtl);
                      }}
                    >
                      {copy.rename}
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => setPendingDelete(item)}>
                      {copy.delete}
                    </Button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      )}

      <Dialog open={pendingDelete !== null} onOpenChange={(open) => !open && setPendingDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{copy.deleteConfirmTitle}</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            {pendingDelete ? t("deleteConfirmBody", { name: pendingDelete.name }) : null}
          </p>
          <DialogFooter>
            <DialogClose render={<Button variant="ghost">{copy.cancel}</Button>} />
            <Button variant="destructive" onClick={() => pendingDelete && handleDelete(pendingDelete)}>
              {copy.delete}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
