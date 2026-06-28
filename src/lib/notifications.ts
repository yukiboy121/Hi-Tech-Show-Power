import webpush from "web-push";
import { db } from "@/db";
import { notifications, pushSubscriptions, users } from "@/db/schema";
import { eq } from "drizzle-orm";

type ServiceRequestPayload = {
  orderId: number;
  customerName: string;
  phone: string;
  service?: string;
  message?: string;
};

function getVapidKeys() {
  const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  const privateKey = process.env.VAPID_PRIVATE_KEY;
  if (!publicKey || !privateKey) return null;
  return { publicKey, privateKey };
}

function configureWebPush() {
  const keys = getVapidKeys();
  if (!keys) return false;
  webpush.setVapidDetails(
    process.env.VAPID_SUBJECT || "mailto:hitechshow.p@gmail.com",
    keys.publicKey,
    keys.privateKey,
  );
  return true;
}

export async function notifyAdminsServiceRequest(payload: ServiceRequestPayload) {
  const serviceLabel = payload.service || "General";
  const title = `New service request — ${payload.customerName}`;
  const body = `${serviceLabel} · ${payload.phone}${payload.message ? ` · ${payload.message.slice(0, 120)}` : ""}`;

  await db.insert(notifications).values({
    type: "service_request",
    title,
    body,
    link: "/admin/orders",
    orderId: payload.orderId,
  });

  await sendPushToAdmins({ title, body, url: "/admin/orders" });
}

async function sendPushToAdmins(payload: { title: string; body: string; url: string }) {
  if (!configureWebPush()) return;

  const adminUsers = await db.select({ id: users.id }).from(users).where(eq(users.role, "admin"));
  if (!adminUsers.length) return;

  const adminIds = adminUsers.map((u) => u.id);
  const subs = await db.select().from(pushSubscriptions);
  const adminSubs = subs.filter((s) => adminIds.includes(s.userId));
  if (!adminSubs.length) return;

  const pushPayload = JSON.stringify({
    title: payload.title,
    body: payload.body,
    url: payload.url,
  });

  await Promise.allSettled(
    adminSubs.map(async (sub) => {
      try {
        await webpush.sendNotification(
          {
            endpoint: sub.endpoint,
            keys: { p256dh: sub.p256dh, auth: sub.auth },
          },
          pushPayload,
        );
      } catch (err: unknown) {
        const status = (err as { statusCode?: number })?.statusCode;
        if (status === 404 || status === 410) {
          await db.delete(pushSubscriptions).where(eq(pushSubscriptions.id, sub.id));
        }
      }
    }),
  );
}
