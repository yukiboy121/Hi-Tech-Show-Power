"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

type NotificationRow = {
  id: number;
  type: string;
  title: string;
  body: string | null;
  link: string | null;
  read: boolean;
  createdAt: string;
};

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(base64);
  return Uint8Array.from([...raw].map((c) => c.charCodeAt(0)));
}

export default function AdminNotifications() {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<NotificationRow[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [vapidPublicKey, setVapidPublicKey] = useState<string | null>(null);
  const [pushSupported, setPushSupported] = useState(false);
  const [pushEnabled, setPushEnabled] = useState(false);
  const prevUnread = useRef(0);
  const panelRef = useRef<HTMLDivElement>(null);

  const fetchNotifications = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/notifications");
      if (!res.ok) return;
      const data = await res.json();
      const count = data.unreadCount ?? 0;

      if (count > prevUnread.current && prevUnread.current > 0 && "Notification" in window) {
        if (Notification.permission === "granted") {
          const latest = (data.notifications as NotificationRow[]).find((n) => !n.read);
          if (latest) {
            new Notification(latest.title, {
              body: latest.body || undefined,
              icon: "/icons/icon-192.png",
            });
          }
        }
      }

      prevUnread.current = count;
      setItems(data.notifications ?? []);
      setUnreadCount(count);
      if (data.vapidPublicKey) setVapidPublicKey(data.vapidPublicKey);
    } catch {
      /* ignore polling errors */
    }
  }, []);

  useEffect(() => {
    setPushSupported("serviceWorker" in navigator && "PushManager" in window);
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 15000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  useEffect(() => {
    if (!open) return;
    function onClickOutside(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [open]);

  async function enablePush() {
    if (!vapidPublicKey || !pushSupported) return;
    try {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") return;

      const reg = await navigator.serviceWorker.ready;
      let sub = await reg.pushManager.getSubscription();
      if (!sub) {
        sub = await reg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
        });
      }

      const json = sub.toJSON();
      await fetch("/api/admin/notifications/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          endpoint: json.endpoint,
          keys: json.keys,
        }),
      });
      setPushEnabled(true);
    } catch {
      /* user denied or browser blocked */
    }
  }

  async function markRead(id: number) {
    await fetch("/api/admin/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    fetchNotifications();
  }

  async function markAllRead() {
    await fetch("/api/admin/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ all: true }),
    });
    fetchNotifications();
  }

  async function handleClickNotification(n: NotificationRow) {
    if (!n.read) await markRead(n.id);
    setOpen(false);
  }

  return (
    <div className="relative" ref={panelRef}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-lg hover:bg-slate-50 active:bg-slate-100"
        aria-label="Notifications"
      >
        🔔
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-bold text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 z-[80] mt-2 w-[min(90vw,22rem)] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
          <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
            <p className="text-sm font-semibold text-brand-900">Notifications</p>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAllRead}
                className="text-xs font-medium text-brand-600 hover:underline"
              >
                Mark all read
              </button>
            )}
          </div>

          {pushSupported && vapidPublicKey && !pushEnabled && (
            <div className="border-b border-slate-100 bg-amber-50 px-4 py-3">
              <p className="text-xs text-amber-900">Get alerts on your phone even when the app is closed.</p>
              <button
                type="button"
                onClick={enablePush}
                className="mt-2 w-full rounded-lg bg-brand-600 py-2 text-xs font-semibold text-white hover:bg-brand-700"
              >
                Enable Push Alerts
              </button>
            </div>
          )}

          <div className="max-h-72 overflow-y-auto">
            {items.length === 0 ? (
              <p className="px-4 py-8 text-center text-sm text-slate-500">No notifications yet</p>
            ) : (
              <ul className="divide-y divide-slate-100">
                {items.map((n) => (
                  <li key={n.id}>
                    <Link
                      href={n.link || "/admin/orders"}
                      onClick={() => handleClickNotification(n)}
                      className={`block px-4 py-3 hover:bg-slate-50 ${!n.read ? "bg-brand-50/50" : ""}`}
                    >
                      <p className="text-sm font-medium text-slate-900">{n.title}</p>
                      {n.body && <p className="mt-0.5 line-clamp-2 text-xs text-slate-600">{n.body}</p>}
                      <p className="mt-1 text-[10px] text-slate-400">
                        {n.createdAt ? new Date(n.createdAt).toLocaleString() : ""}
                      </p>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="border-t border-slate-100 px-4 py-2">
            <Link
              href="/admin/orders"
              onClick={() => setOpen(false)}
              className="block text-center text-xs font-medium text-brand-600 hover:underline"
            >
              View all orders →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
