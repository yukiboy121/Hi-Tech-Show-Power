import { db } from "@/db";
import { users } from "@/db/schema";
import { hashPassword, createSession } from "@/lib/auth";
import { NextRequest } from "next/server";
import { eq } from "drizzle-orm";

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
      return Response.json({ error: "Email already registered" }, { status: 400 });
    }

    const passwordHash = await hashPassword(password);

    // First user becomes admin
    const anyUser = await db.select({ id: users.id }).from(users).limit(1);
    const role = anyUser.length === 0 ? ("admin" as const) : ("user" as const);

    const insertedRows = await db
      .insert(users)
      .values({ name, email: email.toLowerCase(), passwordHash, role })
      .returning({ id: users.id });

    if (insertedRows.length === 0) {
      throw new Error("User registration failed, please try again.");
    }

    await createSession(insertedRows[0].id);
    return Response.json({ ok: true });
  } catch (e) {
    console.error(e);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
