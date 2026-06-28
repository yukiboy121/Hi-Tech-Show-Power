import { db } from "@/db";
import { users } from "@/db/schema";
import { createSession, hashPassword } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json().catch(() => null);
    if (!data) return Response.json({ error: "Invalid JSON" }, { status: 400 });
    const { name, email, password } = data as { name?: string; email?: string; password?: string };
    if (!name || !email || !password) {
      return Response.json({ error: "Missing fields" }, { status: 400 });
    }

    if (password.length < 8) {
      return Response.json({ error: "Password must be at least 8 characters long" }, { status: 400 });
    }

    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return Response.json({ error: "Invalid email format" }, { status: 400 });
    }

    const existing = await db.select().from(users).where(eq(users.email, email.toLowerCase())).limit(1);
    if (existing.length) {
      return Response.json({ error: "Email already in use" }, { status: 409 });
    }

    const passwordHash = await hashPassword(password);

    // All new users are registered as 'user' by default.
    // Admins must be promoted manually via the database or by another admin.
    const insertedRows = await db
      .insert(users)
      .values({ name, email: email.toLowerCase(), passwordHash, role: "user" })
      .returning({ id: users.id });

    if (insertedRows.length === 0) {
      throw new Error("User registration failed, please try again.");
    }

    await createSession(insertedRows[0].id);
    return Response.json({ ok: true });
  } catch (e: any) {
    console.error(e);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}