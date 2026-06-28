import { db } from "@/db";
import { orders } from "@/db/schema";
import { authErrorResponse, requireAdmin, requireUser } from "@/lib/auth";
import { notifyAdminsServiceRequest } from "@/lib/notifications";
import { desc, eq } from "drizzle-orm";
import { NextRequest } from "next/server";

export async function GET() {
  try {
    await requireAdmin();
    const rows = await db.select().from(orders).orderBy(desc(orders.createdAt));
    return Response.json({ orders: rows });
  } catch (error) {
    const authRes = authErrorResponse(error);
    if (authRes) return authRes;
    console.error(error);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await requireUser();
    const data = await req.json().catch(() => null);
    if (!data) return Response.json({ error: "Invalid JSON" }, { status: 400 });

    const { title, details } = data as { title?: string; details?: string };
    if (!title?.trim()) return Response.json({ error: "Title is required" }, { status: 400 });

    const [row] = await db
      .insert(orders)
      .values({ title: title.trim(), details: details?.trim() || null, createdBy: user.id })
      .returning({ id: orders.id });

    try {
      await notifyAdminsServiceRequest({
        orderId: row.id,
        customerName: user.name,
        phone: "App user",
        service: title.trim(),
        message: details?.trim() || undefined,
      });
    } catch (err) {
      console.error("Notification failed for order:", err);
    }

    return Response.json({ ok: true, id: row.id });
  } catch (error) {
    const authRes = authErrorResponse(error);
    if (authRes) return authRes;
    console.error(error);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    await requireAdmin();
    const data = await req.json().catch(() => null);
    if (!data) return Response.json({ error: "Invalid JSON" }, { status: 400 });

    const { id, title, details, status } = data as {
      id?: number;
      title?: string;
      details?: string;
      status?: string;
    };
    if (!id) return Response.json({ error: "ID is required" }, { status: 400 });

    const updates: Partial<{ title: string; details: string | null; status: string }> = {};
    if (title) updates.title = title;
    if (details !== undefined) updates.details = details || null;
    if (status) updates.status = status;

    await db.update(orders).set(updates).where(eq(orders.id, id));
    return Response.json({ ok: true });
  } catch (error) {
    const authRes = authErrorResponse(error);
    if (authRes) return authRes;
    console.error(error);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
