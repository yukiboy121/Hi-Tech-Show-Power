import { db } from "@/db";
import { orders } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth";
import { notifyAdminsServiceRequest } from "@/lib/notifications";
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

  if (!name?.trim() || !phone?.trim() || !message?.trim()) {
    return Response.json({ error: "Name, phone, and message are required" }, { status: 400 });
  }

  const user = await getCurrentUser();
  const title = `Contact: ${service || "General"} — ${name.trim()}`;
  const details = `Name: ${name.trim()}\nEmail: ${email?.trim() || "N/A"}\nPhone: ${phone.trim()}\nService: ${service || "General"}\n\n${message.trim()}`;

  const [row] = await db
    .insert(orders)
    .values({
      title,
      details,
      status: "pending",
      createdBy: user?.id ?? null,
    })
    .returning({ id: orders.id });

  try {
    await notifyAdminsServiceRequest({
      orderId: row.id,
      customerName: name.trim(),
      phone: phone.trim(),
      service: service || "General",
      message: message.trim(),
    });
  } catch (err) {
    console.error("Notification failed for contact request:", err);
  }

  return Response.json({ ok: true, id: row.id });
}
