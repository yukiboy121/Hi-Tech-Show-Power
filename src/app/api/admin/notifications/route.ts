import { db } from "@/db";
import { notifications } from "@/db/schema";
import { requireAdmin } from "@/lib/auth";
import { desc, eq, sql } from "drizzle-orm";
import { NextRequest } from "next/server";

export async function GET() {
  await requireAdmin();

  const rows = await db
    .select()
    .from(notifications)
    .orderBy(desc(notifications.createdAt))
    .limit(30);

  const unread = await db
    .select({ count: sql<number>`count(*)`.mapWith(Number) })
    .from(notifications)
    .where(eq(notifications.read, false));

  return Response.json({
    notifications: rows,
    unreadCount: unread[0]?.count ?? 0,
    pushEnabled: Boolean(process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY),
    vapidPublicKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ?? null,
  });
}

export async function PATCH(req: NextRequest) {
  await requireAdmin();
  const data = await req.json().catch(() => null);
  if (!data) return Response.json({ error: "Invalid JSON" }, { status: 400 });

  const { id, all } = data as { id?: number; all?: boolean };

  if (all) {
    await db.update(notifications).set({ read: true }).where(eq(notifications.read, false));
    return Response.json({ ok: true });
  }

  if (!id) return Response.json({ error: "ID is required" }, { status: 400 });

  await db.update(notifications).set({ read: true }).where(eq(notifications.id, id));
  return Response.json({ ok: true });
}
