import { NextRequest } from "next/server";
import { put, del } from "@vercel/blob";
import { authErrorResponse, requireAdmin } from "@/lib/auth";
import { db } from "@/db";
import { sites, siteImages } from "@/db/schema";
import { eq } from "drizzle-orm";
import path from "node:path";
import fs from "node:fs/promises";
import { randomUUID } from "node:crypto";

const BLOB_TOKEN = process.env.BLOB_READ_WRITE_TOKEN;

export async function POST(req: NextRequest, context: { params: { id: string } }) {
  try {
    await requireAdmin();
    const { id: idParam } = context.params;
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

    for (const f of files) {
      if (!(f instanceof File) || f.size === 0) continue;

      const ext = path.extname(f.name) || ".jpg";
      const filename = `sites/${siteId}-${randomUUID()}${ext}`;

      let publicPath: string;

      if (BLOB_TOKEN) {
        const blob = await put(filename, f, {
          access: "public",
          token: BLOB_TOKEN,
        });
        publicPath = blob.url;
      } else if (process.env.VERCEL) {
        return Response.json({
          error:
            "Vercel Blob is required for image uploads. Add BLOB_READ_WRITE_TOKEN in Vercel Environment Variables, or run: npx vercel env add BLOB_READ_WRITE_TOKEN",
        }, { status: 400 });
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
    const message = error instanceof Error ? `${error.name}: ${error.message}` : "Server error";
    return Response.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, context: { params: { id: string } }) {
  try {
    await requireAdmin();
    const { id: idParam } = context.params;
    const siteId = Number(idParam);
    if (!Number.isFinite(siteId)) {
      return Response.json({ error: "Invalid site id" }, { status: 400 });
    }

    const { imageId } = await req.json().catch(() => ({}));
    if (!imageId) {
      return Response.json({ error: "imageId is required" }, { status: 400 });
    }

    const rows = await db
      .select()
      .from(siteImages)
      .where(eq(siteImages.id, imageId))
      .limit(1);
    if (!rows.length) {
      return Response.json({ error: "Image not found" }, { status: 404 });
    }

    const image = rows[0];

    if (BLOB_TOKEN && image.path.startsWith("https://")) {
      await del(image.path, { token: BLOB_TOKEN }).catch(() => {});
    }

    await db.delete(siteImages).where(eq(siteImages.id, imageId));

    return Response.json({ ok: true });
  } catch (error) {
    const authRes = authErrorResponse(error);
    if (authRes) return authRes;
    console.error(error);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
