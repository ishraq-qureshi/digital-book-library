import { NextResponse } from "next/server";

import { requireAdmin } from "@/lib/api-auth";
import { logAdminAction } from "@/lib/audit-log";
import { DuplicateNameError } from "@/lib/errors";
import { createSubject, listSubjects } from "@/lib/services/subjects";
import { subjectSchema } from "@/lib/validation";

export async function GET() {
  const { unauthorized } = await requireAdmin();
  if (unauthorized) return unauthorized;

  return NextResponse.json(await listSubjects());
}

export async function POST(request: Request) {
  const { adminId, unauthorized } = await requireAdmin();
  if (unauthorized) return unauthorized;

  const parsed = subjectSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message }, { status: 400 });
  }

  try {
    const subject = await createSubject(parsed.data.name);
    await logAdminAction({
      adminId: adminId!,
      entityType: "subject",
      entityId: subject.id,
      action: "create",
      detail: { name: subject.name },
    });
    return NextResponse.json(subject, { status: 201 });
  } catch (error) {
    if (error instanceof DuplicateNameError) {
      return NextResponse.json({ error: error.message }, { status: 409 });
    }
    throw error;
  }
}
