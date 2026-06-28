import { db } from "@/db";
import { repairs } from "@/db/schema";
import { requireAdmin } from "@/lib/auth";
import { desc, eq } from "drizzle-orm";
import { NextRequest } from "next/server";

export async function GET() {
  await requireAdmin();
  const rows = await db.select().from(repairs).orderBy(desc(repairs.createdAt));
  return Response.json({ repairs: rows });
}

export async function POST(req: NextRequest) {
  const admin = await requireAdmin();
  const data = await req.json().catch(() => null);
  if (!data) return Response.json({ error: "Invalid JSON" }, { status: 400 });

  const { title, details, siteId, status } = data as {
    title?: string;
    details?: string;
    siteId?: number;
    status?: string;
  };
  if (!title) return Response.json({ error: "Title is required" }, { status: 400 });

  const [row] = await db
    .insert(repairs)
    .values({
      title,
      details: details || null,
      siteId: siteId || null,
      status: status || "open",
      createdBy: admin.id,
    })
    .returning({ id: repairs.id });

  return Response.json({ ok: true, id: row.id });
}

export async function PATCH(req: NextRequest) {
  await requireAdmin();
  const data = await req.json().catch(() => null);
  if (!data) return Response.json({ error: "Invalid JSON" }, { status: 400 });

  const { id, title, details, status, siteId } = data as {
    id?: number;
    title?: string;
    details?: string;
    status?: string;
    siteId?: number | null;
  };
  if (!id) return Response.json({ error: "ID is required" }, { status: 400 });

  const updates: Partial<{
    title: string;
    details: string | null;
    status: string;
    siteId: number | null;
  }> = {};
  if (title) updates.title = title;
  if (details !== undefined) updates.details = details || null;
  if (status) updates.status = status;
  if (siteId !== undefined) updates.siteId = siteId;

  await db.update(repairs).set(updates).where(eq(repairs.id, id));
  return Response.json({ ok: true });
}
