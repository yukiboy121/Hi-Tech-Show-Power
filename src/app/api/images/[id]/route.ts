import { NextRequest } from "next/server";
import { db } from "@/db";
import { siteImages } from "@/db/schema";
import { eq } from "drizzle-orm";
import fs from "node:fs/promises";
import path from "node:path";

export async function GET(req: NextRequest, context: { params: { id: string } }) {
  const imageId = Number(context.params.id);
  if (!Number.isFinite(imageId)) {
    return new Response("Invalid image ID", { status: 400 });
  }

  const rows = await db
    .select({ path: siteImages.path })
    .from(siteImages)
    .where(eq(siteImages.id, imageId))
    .limit(1);

  if (!rows.length) {
    return new Response("Image not found", { status: 404 });
  }

  const { path: imagePath } = rows[0];

  if (imagePath.startsWith("http")) {
    const token = process.env.BLOB_READ_WRITE_TOKEN;
    if (!token) {
      return new Response("Blob not configured", { status: 500 });
    }
    const resp = await fetch(imagePath, {
      headers: { authorization: `Bearer ${token}` },
    });
    if (!resp.ok) {
      return new Response("Failed to fetch image", { status: 502 });
    }
    const headers = new Headers();
    const contentType = resp.headers.get("content-type");
    if (contentType) headers.set("content-type", contentType);
    const cacheControl = resp.headers.get("cache-control");
    headers.set("cache-control", cacheControl || "public, max-age=31536000, immutable");
    return new Response(resp.body, { headers });
  }

  if (imagePath.startsWith("/")) {
    const filePath = path.join(process.cwd(), "public", imagePath);
    const buf = await fs.readFile(filePath).catch(() => null);
    if (!buf) return new Response("Image not found", { status: 404 });
    const ext = path.extname(imagePath).toLowerCase();
    const mime =
      ext === ".png" ? "image/png" :
      ext === ".webp" ? "image/webp" :
      ext === ".gif" ? "image/gif" :
      ext === ".jpg" || ext === ".jpeg" ? "image/jpeg" :
      "application/octet-stream";
    return new Response(buf, {
      headers: {
        "content-type": mime,
        "cache-control": "public, max-age=31536000, immutable",
      },
    });
  }

  return new Response("Image not available", { status: 404 });
}
