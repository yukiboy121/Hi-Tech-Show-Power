import { db } from "@/db";
import { sites, siteImages } from "@/db/schema";
import { authErrorResponse, requireAdmin, requireUser } from "@/lib/auth";
import { NextRequest } from "next/server";
import { desc, eq, sql } from "drizzle-orm";

export async function GET() {
  try {
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
  } catch (error) {
    const authRes = authErrorResponse(error);
    if (authRes) return authRes;
    console.error(error);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await requireAdmin();
    const data = await req.json().catch(() => null);
    if (!data) return Response.json({ error: "Invalid JSON" }, { status: 400 });
    const { name, location, description } = data as {
      name?: string;
      location?: string;
      description?: string;
    };
    if (!name?.trim()) return Response.json({ error: "Name is required" }, { status: 400 });
    const rows = await db
      .insert(sites)
      .values({
        name: name.trim(),
        location: location?.trim() || null,
        description: description?.trim() || null,
        createdBy: user.id,
      })
      .returning({ id: sites.id });
    if (!rows[0]) throw new Error("Site creation failed, no ID returned.");
    return Response.json({ ok: true, id: rows[0].id });
  } catch (error) {
    const authRes = authErrorResponse(error);
    if (authRes) return authRes;
    console.error(error);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
