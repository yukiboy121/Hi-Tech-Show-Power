"use client";

import { useEffect, useState } from "react";

type Order = {
  id: number;
  title: string;
  details: string | null;
  status: string;
  createdAt: string;
};

const statuses = ["pending", "in_progress", "completed", "cancelled"];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  async function load() {
    const res = await fetch("/api/orders");
    const data = await res.json();
    setOrders(data.orders || []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function updateStatus(id: number, status: string) {
    await fetch("/api/orders", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    load();
  }

  const filtered = filter === "all" ? orders : orders.filter((o) => o.status === filter);

  return (
    <div className="p-4 sm:p-6">
      <h1 className="text-xl font-bold text-brand-900 sm:text-2xl">Orders</h1>
      <p className="mt-1 text-sm text-slate-600">Service requests and contact form submissions.</p>

      <div className="mt-4 flex flex-wrap gap-2">
        {["all", ...statuses].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`rounded-full px-3 py-1.5 text-xs font-medium capitalize ${
              filter === s ? "bg-brand-700 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {s.replace("_", " ")}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="mt-8 text-center text-sm text-slate-500">Loading...</p>
      ) : filtered.length === 0 ? (
        <p className="mt-8 text-center text-sm text-slate-500">No orders found</p>
      ) : (
        <div className="mt-4 space-y-3">
          {filtered.map((o) => (
            <div key={o.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-slate-900">{o.title}</p>
                  <p className="mt-1 text-xs text-slate-500">
                    #{o.id} · {o.createdAt ? new Date(o.createdAt).toLocaleString() : ""}
                  </p>
                </div>
                <select
                  value={o.status}
                  onChange={(e) => updateStatus(o.id, e.target.value)}
                  className="rounded-lg border border-slate-300 px-2 py-1.5 text-xs outline-none focus:ring-2 focus:ring-brand-500"
                >
                  {statuses.map((s) => (
                    <option key={s} value={s}>
                      {s.replace("_", " ")}
                    </option>
                  ))}
                </select>
              </div>
              {o.details && (
                <pre className="mt-3 whitespace-pre-wrap rounded-lg bg-slate-50 p-3 text-xs text-slate-700">
                  {o.details}
                </pre>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
