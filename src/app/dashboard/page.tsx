import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/db";
import { orders } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import Link from "next/link";
import { business } from "@/lib/business";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  if (user.role === "admin") redirect("/admin");

  const myOrders = await db
    .select()
    .from(orders)
    .where(eq(orders.createdBy, user.id))
    .orderBy(desc(orders.createdAt))
    .limit(10);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:py-10">
      <h1 className="text-xl font-bold text-brand-900 sm:text-2xl">My Dashboard</h1>
      <p className="mt-1 text-sm text-slate-600">Welcome back, {user.name}</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <Link
          href="/contact"
          className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
        >
          <span className="text-2xl">📋</span>
          <h2 className="mt-2 font-semibold text-brand-900">Request Service</h2>
          <p className="mt-1 text-sm text-slate-600">Submit a repair or installation request</p>
        </Link>
        <a
          href={`tel:${business.hotlineTel}`}
          className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
        >
          <span className="text-2xl">📞</span>
          <h2 className="mt-2 font-semibold text-brand-900">Emergency Call</h2>
          <p className="mt-1 text-sm text-slate-600">
            {business.hotline} — {business.serviceHours}
          </p>
        </a>
      </div>

      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <h2 className="font-semibold text-brand-900">My Service Requests</h2>
        {myOrders.length === 0 ? (
          <p className="mt-4 text-center text-sm text-slate-500">
            No requests yet.{" "}
            <Link href="/contact" className="text-brand-600 hover:underline">
              Submit one now
            </Link>
          </p>
        ) : (
          <ul className="mt-3 divide-y divide-slate-100">
            {myOrders.map((o) => (
              <li key={o.id} className="flex items-center justify-between gap-3 py-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{o.title}</p>
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
