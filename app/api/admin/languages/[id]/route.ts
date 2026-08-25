import { NextResponse } from "next/server";

import { requireAdmin } from "@/lib/api-auth";
import { logAdminAction } from "@/lib/audit-log";
import { InUseError } from "@/lib/errors";
import { deleteLanguage, renameLanguage } from "@/lib/services/languages";
import { renameLanguageSchema } from "@/lib/validation";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { adminId, unauthorized } = await requireAdmin();
  if (unauthorized) return unauthorized;
  const { id } = await params;

  const parsed = renameLanguageSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message }, { status: 400 });
  }

  const language = await renameLanguage(id, parsed.data);
  await logAdminAction({
    adminId: adminId!,
    entityType: "language",
    entityId: language.id,
    action: "update",
    detail: { name: language.name, rtl: language.rtl },
  });
  return NextResponse.json(language);
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { adminId, unauthorized } = await requireAdmin();
  if (unauthorized) return unauthorized;
  const { id } = await params;

  try {
    await deleteLanguage(id);
  } catch (error) {
    if (error instanceof InUseError) {
      return NextResponse.json({ error: error.message, bookCount: error.bookCount }, { status: 409 });
    }
    throw error;
  }

  await logAdminAction({
    adminId: adminId!,
    entityType: "language",
    entityId: id,
    action: "delete",
  });

  return NextResponse.json({ ok: true });
}
