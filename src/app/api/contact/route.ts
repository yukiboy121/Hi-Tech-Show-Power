import { db } from "@/db";
import { orders } from "@/db/schema";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const data = await req.json().catch(() => null);
  if (!data) return Response.json({ error: "Invalid JSON" }, { status: 400 });

  const { name, email, phone, service, message } = data as {
    name?: string;
    email?: string;
    phone?: string;
    service?: string;
    message?: string;
  };

  if (!name || !phone || !message) {
    return Response.json({ error: "Name, phone, and message are required" }, { status: 400 });
  }

  const title = `Contact: ${service || "General"} — ${name}`;
  const details = `Name: ${name}\nEmail: ${email || "N/A"}\nPhone: ${phone}\nService: ${service || "General"}\n\n${message}`;

  await db.insert(orders).values({ title, details, status: "pending" });
  return Response.json({ ok: true });
}
