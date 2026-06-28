import { db } from "@/db";
import { users } from "@/db/schema";
import { requireAdmin } from "@/lib/auth";
import { asc, eq } from "drizzle-orm";
import { NextRequest } from "next/server";

export async function GET() {
  const admin = await requireAdmin();
  const rows = await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      role: users.role,
      createdAt: users.createdAt,
    })
    .from(users)
    .orderBy(asc(users.name));

  return Response.json({ users: rows, currentUserId: admin.id });
}

export async function PATCH(req: NextRequest) {
  const admin = await requireAdmin();
  const data = await req.json().catch(() => null);
  if (!data) return Response.json({ error: "Invalid JSON" }, { status: 400 });

  const { userId, role } = data as { userId?: number; role?: "admin" | "user" };
  if (!userId || !role || !["admin", "user"].includes(role)) {
    return Response.json({ error: "Invalid fields" }, { status: 400 });
  }

  if (userId === admin.id && role === "user") {
    const allUsers = await db.select({ id: users.id, role: users.role }).from(users);
    const adminCount = allUsers.filter((u) => u.role === "admin").length;
    if (adminCount <= 1) {
      return Response.json({ error: "Cannot remove the last admin" }, { status: 400 });
    }
  }

  await db.update(users).set({ role }).where(eq(users.id, userId));
  return Response.json({ ok: true });
}
