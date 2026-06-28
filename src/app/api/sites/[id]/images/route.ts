import { NextRequest } from "next/server";
import { put } from "@vercel/blob";
import { authErrorResponse, requireAdmin } from "@/lib/auth";
import { db } from "@/db";
import { sites, siteImages } from "@/db/schema";
import { eq } from "drizzle-orm";
import path from "node:path";
import fs from "node:fs/promises";

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

    const savedPaths: string[] = [];
    const useBlob = Boolean(process.env.BLOB_READ_WRITE_TOKEN);

    for (const f of files) {
      if (!(f instanceof File) || f.size === 0) continue;

      const ext = path.extname(f.name) || ".jpg";
      const filename = `sites/${siteId}-${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`;

      let publicPath: string;

      if (useBlob) {
        const blob = await put(filename, f, {
          access: "public",
          token: process.env.BLOB_READ_WRITE_TOKEN,
        });
        publicPath = blob.url;
      } else {
        const uploadDir = path.join(process.cwd(), "public", "uploads", "sites");
        await fs.mkdir(uploadDir, { recursive: true });
        const localName = path.basename(filename);
        const filePath = path.join(uploadDir, localName);
        const buf = Buffer.from(await f.arrayBuffer());
        await fs.writeFile(filePath, buf);
        publicPath = `/uploads/sites/${localName}`;
      }

      await db.insert(siteImages).values({ siteId, path: publicPath });
      savedPaths.push(publicPath);
    }

    if (!savedPaths.length) {
      return Response.json({ error: "No valid images uploaded" }, { status: 400 });
    }

    return Response.json({ ok: true, paths: savedPaths });
  } catch (error) {
    const authRes = authErrorResponse(error);
    if (authRes) return authRes;
    console.error(error);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
