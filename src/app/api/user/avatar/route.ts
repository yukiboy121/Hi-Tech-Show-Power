import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("avatar") as File | null;
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    let avatarUrl: string;

    if (process.env.BLOB_READ_WRITE_TOKEN) {
      const { put } = await import("@vercel/blob");
      const blob = await put(`avatars/${user.id}-${Date.now()}.${file.name.split(".").pop()}`, buffer, {
        access: "public",
        contentType: file.type,
      });
      avatarUrl = blob.url;
    } else {
      const fs = await import("node:fs");
      const path = await import("node:path");
      const uploadDir = path.join(process.cwd(), "public", "uploads", "avatars");
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      const filename = `${user.id}-${Date.now()}.${file.name.split(".").pop()}`;
      const filepath = path.join(uploadDir, filename);
      fs.writeFileSync(filepath, buffer);
      avatarUrl = `/uploads/avatars/${filename}`;
    }

    await db.update(users).set({ avatarUrl }).where(eq(users.id, user.id));

    return NextResponse.json({ avatarUrl });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
