import { db } from "@/db";
import { sites, siteImages } from "@/db/schema";
import { requireAdmin, requireUser } from "@/lib/auth";
import { NextRequest } from "next/server";
import { desc, eq, sql } from "drizzle-orm";

export async function GET() {
  await requireUser();
  const rows = await db
    .select({
      id: sites.id,
      name: sites.name,
      location: sites.location,
      description: sites.description,
      createdAt: sites.createdAt,
      imagesCount: sql<number>`count(${siteImages.id})`.mapWith(Number),
    })
    .from(sites)
    .leftJoin(siteImages, eq(siteImages.siteId, sites.id))
    .groupBy(sites.id)
    .orderBy(desc(sites.createdAt));
  return Response.json({ sites: rows });
}

export async function POST(req: NextRequest) {
  await requireAdmin();
  const data = await req.json().catch(() => null);
  if (!data) return Response.json({ error: "Invalid JSON" }, { status: 400 });
  const { name, location, description } = data as {
    name?: string;
    location?: string;
    description?: string;
  };
  if (!name) return Response.json({ error: "Name is required" }, { status: 400 });
  const [row] = await db
    .insert(sites)
    .values({ name, location: location || null as any, description: description || null as any })
    .returning({ id: sites.id });
  return Response.json({ ok: true, id: row.id });
}
