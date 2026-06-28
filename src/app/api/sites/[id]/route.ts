import { NextRequest } from "next/server";
import { authErrorResponse, requireAdmin } from "@/lib/auth";
import { db } from "@/db";
import { sites } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function PATCH(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
    const { id: idParam } = await context.params;
    const siteId = Number(idParam);
    if (!Number.isFinite(siteId)) {
      return Response.json({ error: "Invalid site id" }, { status: 400 });
    }

    const exists = await db.select().from(sites).where(eq(sites.id, siteId)).limit(1);
    if (!exists.length) return Response.json({ error: "Site not found" }, { status: 404 });

    const data = await req.json().catch(() => null);
    if (!data) return Response.json({ error: "Invalid JSON" }, { status: 400 });

    const { name, location, description, latitude, longitude } = data as {
      name?: string;
      location?: string;
      description?: string;
      latitude?: string;
      longitude?: string;
    };

    if (name !== undefined && !name.trim()) {
      return Response.json({ error: "Name is required" }, { status: 400 });
    }

    const [row] = await db
      .update(sites)
      .set({
        ...(name !== undefined ? { name: name.trim() } : {}),
        ...(location !== undefined ? { location: location.trim() || null } : {}),
        ...(latitude !== undefined ? { latitude: latitude.trim() || null } : {}),
        ...(longitude !== undefined ? { longitude: longitude.trim() || null } : {}),
        ...(description !== undefined ? { description: description.trim() || null } : {}),
      })
      .where(eq(sites.id, siteId))
      .returning({
        id: sites.id,
        name: sites.name,
        location: sites.location,
        latitude: sites.latitude,
        longitude: sites.longitude,
        description: sites.description,
      });

    return Response.json({ ok: true, site: row });
  } catch (error) {
    const authRes = authErrorResponse(error);
    if (authRes) return authRes;
    console.error(error);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
