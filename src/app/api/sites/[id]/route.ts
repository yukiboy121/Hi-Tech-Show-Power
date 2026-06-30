import { db } from "@/db";
import { sites, siteImages } from "@/db/schema";
import { authErrorResponse, requireAdmin } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest, context: { params: { id: string } }) {
  try {
    await requireAdmin();
    const siteId = Number(context.params.id);
    if (!Number.isFinite(siteId)) {
      return Response.json({ error: "Invalid site ID" }, { status: 400 });
    }

    const siteRows = await db.select().from(sites).where(eq(sites.id, siteId)).limit(1);
    if (siteRows.length === 0) {
      return Response.json({ error: "Site not found" }, { status: 404 });
    }
    const site = siteRows[0];

    const images = await db.select().from(siteImages).where(eq(siteImages.siteId, siteId));

    return Response.json({ site: { ...site, images } });
  } catch (error) {
    const authRes = authErrorResponse(error);
    if (authRes) return authRes;
    console.error(error);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, context: { params: { id: string } }) {
  try {
    await requireAdmin();
    const siteId = Number(context.params.id);
    if (!Number.isFinite(siteId)) {
      return Response.json({ error: "Invalid site ID" }, { status: 400 });
    }

    const data = await req.json().catch(() => null);
    if (!data) return Response.json({ error: "Invalid JSON" }, { status: 400 });

    const { name, location, latitude, longitude, description } = data as {
      name?: string;
      location?: string;
      latitude?: string;
      longitude?: string;
      description?: string;
    };

    const updates: Partial<{
      name: string;
      location: string | null;
      latitude: string | null;
      longitude: string | null;
      description: string | null;
    }> = {};

    if (name !== undefined) updates.name = name;
    if (location !== undefined) updates.location = location || null;
    if (latitude !== undefined) updates.latitude = latitude || null;
    if (longitude !== undefined) updates.longitude = longitude || null;
    if (description !== undefined) updates.description = description || null;

    if (Object.keys(updates).length === 0) {
      return Response.json({ error: "No fields to update" }, { status: 400 });
    }

    await db.update(sites).set(updates).where(eq(sites.id, siteId));
    return Response.json({ ok: true });
  } catch (error) {
    const authRes = authErrorResponse(error);
    if (authRes) return authRes;
    console.error(error);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}