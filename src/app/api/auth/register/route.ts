import { db } from "@/db";
import { users, userRole } from "@/db/schema";
import { requireAdmin } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { NextRequest } from "next/server";

export async function PATCH(req: NextRequest, context: { params: { id: string } }) {
  try {
    const admin = await requireAdmin();
    const userId = Number(context.params.id);
    if (!Number.isFinite(userId)) return Response.json({ error: "Invalid user ID" }, { status: 400 });

    // Admins cannot change their own role
    if (admin.id === userId) return Response.json({ error: "Cannot change your own role" }, { status: 403 });

    const { role } = await req.json();
    if (!role || !userRole.enumValues.includes(role)) {
      return Response.json({ error: "Invalid role specified" }, { status: 400 });
    }

    await db.update(users).set({ role }).where(eq(users.id, userId));

    return Response.json({ ok: true });
  } catch (e: any) {
    console.error("Failed to update user role:", e);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}