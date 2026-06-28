import { db } from "@/db";
import { users } from "@/db/schema";
import { createSession, verifyPassword } from "@/lib/auth";
import { NextRequest } from "next/server";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json().catch(() => null);
    if (!data) return Response.json({ error: "Invalid JSON" }, { status: 400 });
    const { email, password } = data as { email?: string; password?: string };
    if (!email || !password) {
      return Response.json({ error: "Missing fields" }, { status: 400 });
    }

    // Basic email format validation to avoid unnecessary DB queries and prevent email enumeration
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return Response.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const rows = await db.select().from(users).where(eq(users.email, email.toLowerCase())).limit(1);
    if (!rows.length) {
      return Response.json({ error: "Invalid credentials" }, { status: 401 });
    }
    const user = rows[0];
    const ok = await verifyPassword(password, user.passwordHash);
    if (!ok) {
      return Response.json({ error: "Invalid credentials" }, { status: 401 });
    }
    await createSession(user.id);
    return Response.json({ ok: true });
  } catch (e) {
    console.error(e);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
