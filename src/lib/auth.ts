import { cookies } from "next/headers";
import { db } from "@/db";
import { sessions, users } from "@/db/schema";
import { and, eq, gt } from "drizzle-orm";
import bcrypt from "bcryptjs";
import crypto from "node:crypto";

const SESSION_COOKIE = "hi_tech_power_session";
const SESSION_TTL_DAYS = 30;

export type SessionUser = {
  id: number;
  name: string;
  email: string;
  role: "admin" | "user";
};

export async function hashPassword(password: string) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

function getExpiryDate(days: number) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d;
}

export async function createSession(userId: number) {
  const token = crypto.randomBytes(24).toString("hex");
  const expiresAt = getExpiryDate(SESSION_TTL_DAYS);
  await db.insert(sessions).values({ userId, token, expiresAt });
  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
  });
}

export async function destroySession() {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (token) {
    await db.delete(sessions).where(eq(sessions.token, token));
    store.set(SESSION_COOKIE, "", { path: "/", expires: new Date(0) });
  }
}

export async function getCurrentUser(): Promise<SessionUser | null> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const now = new Date();
  const rows = await db
    .select({ id: users.id, name: users.name, email: users.email, role: users.role })
    .from(sessions)
    .innerJoin(users, eq(users.id, sessions.userId))
    .where(and(eq(sessions.token, token), gt(sessions.expiresAt, now)))
    .limit(1);
  if (!rows.length) return null;
  return rows[0];
}

export async function requireUser() {
  const u = await getCurrentUser();
  if (!u) {
    throw new Error("UNAUTHORIZED");
  }
  return u;
}

export async function requireAdmin() {
  const u = await requireUser();
  if (u.role !== "admin") {
    throw new Error("FORBIDDEN");
  }
  return u;
}

export function authErrorResponse(error: unknown) {
  if (error instanceof Error) {
    if (error.message === "UNAUTHORIZED") {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (error.message === "FORBIDDEN") {
      return Response.json({ error: "Forbidden" }, { status: 403 });
    }
  }
  return null;
}
