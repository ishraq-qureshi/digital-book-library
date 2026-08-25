import { NextResponse } from "next/server";

import { requireAdmin } from "@/lib/api-auth";
import { logAdminAction } from "@/lib/audit-log";
import { DuplicateNameError } from "@/lib/errors";
import { deleteSubject, renameSubject } from "@/lib/services/subjects";
import { subjectSchema } from "@/lib/validation";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { adminId, unauthorized } = await requireAdmin();
  if (unauthorized) return unauthorized;
  const { id } = await params;

  const parsed = subjectSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message }, { status: 400 });
  }

  try {
    const subject = await renameSubject(id, parsed.data.name);
    await logAdminAction({
      adminId: adminId!,
      entityType: "subject",
      entityId: subject.id,
      action: "update",
      detail: { name: subject.name },
    });
    return NextResponse.json(subject);
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

  await deleteSubject(id);
  await logAdminAction({
    adminId: adminId!,
    entityType: "subject",
    entityId: id,
    action: "delete",
  });

  return NextResponse.json({ ok: true });
}
