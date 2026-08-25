import { NextResponse } from "next/server";

import { requireAdmin } from "@/lib/api-auth";
import { logAdminAction } from "@/lib/audit-log";
import { DuplicateNameError } from "@/lib/errors";
import { createCategory, listCategories } from "@/lib/services/categories";
import { categorySchema } from "@/lib/validation";

export async function GET() {
  const { unauthorized } = await requireAdmin();
  if (unauthorized) return unauthorized;

  return NextResponse.json(await listCategories());
}

export async function POST(request: Request) {
  const { adminId, unauthorized } = await requireAdmin();
  if (unauthorized) return unauthorized;

  const parsed = categorySchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message }, { status: 400 });
  }

  try {
    const category = await createCategory(parsed.data.name);
    await logAdminAction({
      adminId: adminId!,
      entityType: "category",
      entityId: category.id,
      action: "create",
      detail: { name: category.name },
    });
    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    if (error instanceof DuplicateNameError) {
      return NextResponse.json({ error: error.message }, { status: 409 });
    }
    throw error;
  }
}
