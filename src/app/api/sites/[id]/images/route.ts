import { NextRequest } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/db";
import { sites, siteImages } from "@/db/schema";
import { eq } from "drizzle-orm";
import path from "node:path";
import fs from "node:fs/promises";
import { randomUUID } from "node:crypto";

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"];

export async function POST(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
    const { id: idParam } = await context.params;
    const siteId = Number(idParam);
    if (!Number.isFinite(siteId)) {
      return Response.json({ error: "Invalid site id" }, { status: 400 });
    }
    const exists = await db.select().from(sites).where(eq(sites.id, siteId)).limit(1);
    if (!exists.length) return Response.json({ error: "Site not found" }, { status: 404 });

    const form = await req.formData();
    const files = form.getAll("files");
    if (!files.length) return Response.json({ error: "No files" }, { status: 400 });

    const uploadDir = path.join(process.cwd(), "public", "uploads", "sites");
    await fs.mkdir(uploadDir, { recursive: true });

    const savedPaths: string[] = [];

    for (const f of files) {
      if (!(f instanceof File)) continue;
      if (!ALLOWED_IMAGE_TYPES.includes(f.type)) continue;

      const buf = Buffer.from(await f.arrayBuffer());
      const ext = path.extname(f.name) || ".jpg";
      const filename = `${randomUUID()}${ext}`;
      const filePath = path.join(uploadDir, filename);
      await fs.writeFile(filePath, buf);
      const publicPath = `/uploads/sites/${filename}`;
      await db.insert(siteImages).values({ siteId, path: publicPath });
      savedPaths.push(publicPath);
    }

    return Response.json({ ok: true, paths: savedPaths });
  } catch (e) {
    console.error("Image upload failed:", e);
    return Response.json({ error: "Server error during image upload" }, { status: 500 });
  }
}
