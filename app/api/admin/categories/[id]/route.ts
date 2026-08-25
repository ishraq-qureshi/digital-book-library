import { NextResponse } from "next/server";

import { requireAdmin } from "@/lib/api-auth";
import { logAdminAction } from "@/lib/audit-log";
import { DuplicateNameError } from "@/lib/errors";
import { deleteCategory, renameCategory } from "@/lib/services/categories";
import { categorySchema } from "@/lib/validation";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { adminId, unauthorized } = await requireAdmin();
  if (unauthorized) return unauthorized;
  const { id } = await params;

  const parsed = categorySchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message }, { status: 400 });
  }

  try {
    const category = await renameCategory(id, parsed.data.name);
    await logAdminAction({
      adminId: adminId!,
      entityType: "category",
      entityId: category.id,
      action: "update",
      detail: { name: category.name },
    });
    return NextResponse.json(category);
  } catch (error) {
    if (error instanceof DuplicateNameError) {
      return NextResponse.json({ error: error.message }, { status: 409 });
    }
    throw error;
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { adminId, unauthorized } = await requireAdmin();
  if (unauthorized) return unauthorized;
  const { id } = await params;

  await deleteCategory(id);
  await logAdminAction({
    adminId: adminId!,
    entityType: "category",
    entityId: id,
    action: "delete",
  });

  return NextResponse.json({ ok: true });
}
