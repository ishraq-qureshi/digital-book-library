import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";

// Called from inside each admin Route Handler, never relied on alone
// (proxy.ts also gates /api/admin/* - see CLAUDE.md's non-negotiables).
export async function requireAdmin() {
  const session = await auth();
  if (!session?.user?.id) {
    return {
      adminId: null as string | null,
      unauthorized: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }
  return { adminId: session.user.id, unauthorized: null };
}
