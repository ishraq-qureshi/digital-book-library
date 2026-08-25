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

export type TaxonomyItem = { id: string; name: string; bookCount: number };

type Copy = {
  addPlaceholder: string;
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

export function TaxonomyManager({
  namespace,
  basePath,
  initialItems,
  copy,
}: {
  namespace: string;
  basePath: string;
  initialItems: TaxonomyItem[];
  copy: Copy;
}) {
  // deleteConfirmBody is interpolated per-item, so it's read here (client
  // side) rather than passed as a function prop - Server Components can't
  // pass closures across the RSC boundary to a Client Component.
  const t = useTranslations(namespace);
  const [items, setItems] = useState(initialItems);
  const [newName, setNewName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const [pendingDelete, setPendingDelete] = useState<TaxonomyItem | null>(null);

  async function handleAdd(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const name = newName.trim();
    if (!name) return;

    const response = await fetch(basePath, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });

    if (!response.ok) {
      toast.error(copy.genericError);
      return;
    }

    const created = (await response.json()) as { id: string; name: string };
    setItems((prev) => [...prev, { ...created, bookCount: 0 }].sort((a, b) => a.name.localeCompare(b.name)));
    setNewName("");
  }

  async function handleRename(id: string) {
    const name = editingName.trim();
    if (!name) return;

    const response = await fetch(`${basePath}/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });

    if (!response.ok) {
      toast.error(copy.genericError);
      return;
    }

    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, name } : item)).sort((a, b) => a.name.localeCompare(b.name)),
    );
    setEditingId(null);
  }

  async function handleDelete(item: TaxonomyItem) {
    const response = await fetch(`${basePath}/${item.id}`, { method: "DELETE" });

    if (!response.ok) {
      toast.error(copy.genericError);
      setPendingDelete(null);
      return;
    }

    setItems((prev) => prev.filter((i) => i.id !== item.id));
    setPendingDelete(null);
  }

  return (
    <div className="flex flex-col gap-4">
      <form onSubmit={handleAdd} className="flex gap-2">
        <Input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder={copy.addPlaceholder}
        />
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
                <div className="flex flex-1 gap-2">
                  <Input value={editingName} onChange={(e) => setEditingName(e.target.value)} autoFocus />
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
