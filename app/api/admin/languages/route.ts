import { NextResponse } from "next/server";

import { requireAdmin } from "@/lib/api-auth";
import { logAdminAction } from "@/lib/audit-log";
import { DuplicateNameError } from "@/lib/errors";
import { createLanguage, listLanguages } from "@/lib/services/languages";
import { languageSchema } from "@/lib/validation";

export async function GET() {
  const { unauthorized } = await requireAdmin();
  if (unauthorized) return unauthorized;

  return NextResponse.json(await listLanguages());
}

export async function POST(request: Request) {
  const { adminId, unauthorized } = await requireAdmin();
  if (unauthorized) return unauthorized;

  const parsed = languageSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message }, { status: 400 });
  }

  try {
    const language = await createLanguage(parsed.data);
    await logAdminAction({
      adminId: adminId!,
      entityType: "language",
      entityId: language.id,
      action: "create",
      detail: { code: language.code, name: language.name },
    });
    return NextResponse.json(language, { status: 201 });
  } catch (error) {
    if (error instanceof DuplicateNameError) {
      return NextResponse.json({ error: error.message }, { status: 409 });
    }
    throw error;
  }
}
