import { db } from "@/db";
import { orders, repairs, sites, users } from "@/db/schema";
import { desc, sql } from "drizzle-orm";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminOverviewPage() {
  const [orderStats, repairStats, siteCount, userCount] = await Promise.all([
    db
      .select({
        total: sql<number>`count(*)`.mapWith(Number),
        pending: sql<number>`count(*) filter (where ${orders.status} = 'pending')`.mapWith(Number),
      })
      .from(orders),
    db
      .select({
        total: sql<number>`count(*)`.mapWith(Number),
        open: sql<number>`count(*) filter (where ${repairs.status} = 'open')`.mapWith(Number),
      })
      .from(repairs),
    db.select({ count: sql<number>`count(*)`.mapWith(Number) }).from(sites),
    db.select({ count: sql<number>`count(*)`.mapWith(Number) }).from(users),
  ]);

  const recentOrders = await db.select().from(orders).orderBy(desc(orders.createdAt)).limit(5);

  const cards = [
    { label: "Pending Orders", value: orderStats[0]?.pending ?? 0, href: "/admin/orders", color: "text-amber-600" },
    { label: "Open Repairs", value: repairStats[0]?.open ?? 0, href: "/admin/repairs", color: "text-red-600" },
    { label: "Total Sites", value: siteCount[0]?.count ?? 0, href: "/admin/sites", color: "text-brand-600" },
    { label: "Registered Users", value: userCount[0]?.count ?? 0, href: "/admin/settings", color: "text-green-600" },
  ];

  return (
    <div className="p-4 sm:p-6">
      <h1 className="text-xl font-bold text-brand-900 sm:text-2xl">Admin Overview</h1>
      <p className="mt-1 text-sm text-slate-600">Manage orders, repairs, sites, and users.</p>

      <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {cards.map((c) => (
          <Link
            key={c.label}
            href={c.href}
            className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
          >
            <p className="text-xs text-slate-500">{c.label}</p>
            <p className={`mt-1 text-2xl font-bold sm:text-3xl ${c.color}`}>{c.value}</p>
          </Link>
        ))}
      </div>

      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-semibold text-brand-900">Recent Orders</h2>
          <Link href="/admin/orders" className="text-xs text-brand-600 hover:underline">
            View all
          </Link>
        </div>
        {recentOrders.length === 0 ? (
          <p className="py-4 text-center text-sm text-slate-500">No orders yet</p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {recentOrders.map((o) => (
              <li key={o.id} className="flex items-center justify-between gap-3 py-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-slate-900">{o.title}</p>
                  <p className="text-xs text-slate-500">
                    {o.createdAt ? new Date(o.createdAt).toLocaleDateString() : ""}
                  </p>
                </div>
                <span
                  className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    o.status === "pending"
                      ? "bg-amber-100 text-amber-700"
                      : o.status === "completed"
                        ? "bg-green-100 text-green-700"
                        : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {o.status}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
