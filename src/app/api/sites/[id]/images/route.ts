import { NextRequest } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/db";
import { sites, siteImages } from "@/db/schema";
import { eq } from "drizzle-orm";
import path from "node:path";
import fs from "node:fs/promises";

export async function POST(req: NextRequest, context: { params: Promise<{ id: string }> }) {
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
    const buf = Buffer.from(await f.arrayBuffer());
    const ext = path.extname(f.name) || ".jpg";
    const filename = `${siteId}-${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`;
    const filePath = path.join(uploadDir, filename);
    await fs.writeFile(filePath, buf);
    const publicPath = `/uploads/sites/${filename}`;
    await db.insert(siteImages).values({ siteId, path: publicPath });
    savedPaths.push(publicPath);
  }

  return Response.json({ ok: true, paths: savedPaths });
}
