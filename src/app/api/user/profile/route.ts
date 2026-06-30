import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const rows = await db
      .select({ id: users.id, name: users.name, email: users.email, phone: users.phone, avatarUrl: users.avatarUrl, role: users.role })
      .from(users)
      .where(eq(users.id, user.id))
      .limit(1);
    if (!rows.length) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    return NextResponse.json({ user: rows[0] });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const body = await request.json();
    const { name, phone } = body;
    const updateData: Record<string, string> = {};
    if (typeof name === "string" && name.trim().length > 0) {
      updateData.name = name.trim();
    }
    if (typeof phone === "string") {
      updateData.phone = phone.trim() || "";
    }
    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: "No valid fields to update" }, { status: 400 });
    }
    await db.update(users).set(updateData).where(eq(users.id, user.id));
    const rows = await db
      .select({ id: users.id, name: users.name, email: users.email, phone: users.phone, avatarUrl: users.avatarUrl, role: users.role })
      .from(users)
      .where(eq(users.id, user.id))
      .limit(1);
    return NextResponse.json({ user: rows[0] });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
