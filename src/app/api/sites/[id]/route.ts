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