import { db } from "@/db";
import { pushSubscriptions } from "@/db/schema";
import { requireAdmin } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const admin = await requireAdmin();
  const data = await req.json().catch(() => null);
  if (!data) return Response.json({ error: "Invalid JSON" }, { status: 400 });

  const { endpoint, keys } = data as {
    endpoint?: string;
    keys?: { p256dh?: string; auth?: string };
  };

  if (!endpoint || !keys?.p256dh || !keys?.auth) {
    return Response.json({ error: "Invalid subscription" }, { status: 400 });
  }

  const existing = await db
    .select()
    .from(pushSubscriptions)
    .where(eq(pushSubscriptions.endpoint, endpoint))
    .limit(1);

  if (existing.length) {
    await db
      .update(pushSubscriptions)
      .set({ userId: admin.id, p256dh: keys.p256dh, auth: keys.auth })
      .where(eq(pushSubscriptions.endpoint, endpoint));
  } else {
    await db.insert(pushSubscriptions).values({
      userId: admin.id,
      endpoint,
      p256dh: keys.p256dh,
      auth: keys.auth,
    });
  }

  return Response.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  await requireAdmin();
  const data = await req.json().catch(() => null);
  const endpoint = (data as { endpoint?: string } | null)?.endpoint;
  if (!endpoint) return Response.json({ error: "Endpoint required" }, { status: 400 });

  await db.delete(pushSubscriptions).where(eq(pushSubscriptions.endpoint, endpoint));
  return Response.json({ ok: true });
}
