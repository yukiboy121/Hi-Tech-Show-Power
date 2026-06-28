import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/db";
import { sites, siteImages } from "@/db/schema";
import { desc, eq, sql } from "drizzle-orm";
import Link from "next/link";
import CreateSiteForm from "./ui/create-site-form";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const siteRows = await db
    .select({
      id: sites.id,
      name: sites.name,
      location: sites.location,
      description: sites.description,
      createdAt: sites.createdAt,
      imagesCount: sql<number>`count(${siteImages.id})`.mapWith(Number),
    })
    .from(sites)
    .leftJoin(siteImages, eq(siteImages.siteId, sites.id))
    .groupBy(sites.id)
    .orderBy(desc(sites.createdAt));

  return (
    <div className="mx-auto max-w-6xl p-4">
      <h1 className="mb-4 text-2xl font-semibold">Dashboard</h1>
      <p className="mb-6 text-slate-700">Welcome, {user.name} ({user.role})</p>

      {user.role === "admin" ? (
        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-1 space-y-6">
            <div className="rounded-2xl bg-white p-4 shadow">
              <h2 className="mb-3 font-semibold">Create new site</h2>
              <CreateSiteForm />
            </div>
            <div className="rounded-2xl bg-white p-4 shadow">
              <h2 className="mb-3 font-semibold">Admin quick links</h2>
              <div className="flex flex-col gap-2 text-sm">
                <Link href="/admin/orders" className="rounded-md border border-slate-300 px-3 py-2">Manage Orders</Link>
                <Link href="/admin/repairs" className="rounded-md border border-slate-300 px-3 py-2">Manage Repairs</Link>
                <Link href="/admin/users" className="rounded-md border border-slate-300 px-3 py-2">Manage Users</Link>
              </div>
            </div>
          </div>
          <div className="md:col-span-2">
            <div className="rounded-2xl bg-white p-4 shadow">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="font-semibold">Sites</h2>
                <span className="text-sm text-slate-600">{siteRows.length} total</span>
              </div>
              <ul className="divide-y divide-slate-200">
                {siteRows.map((s) => (
                  <li key={s.id} className="flex items-center justify-between py-3">
                    <div>
                      <p className="font-medium text-slate-900">{s.name}</p>
                      <p className="text-sm text-slate-600">{s.location || "No location"} • {s.imagesCount} images</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Link href={`/sites/${s.id}`} className="rounded-md border border-slate-300 px-3 py-1.5 text-sm">Open</Link>
                    </div>
                  </li>
                ))}
                {siteRows.length === 0 && (
                  <li className="py-6 text-center text-sm text-slate-600">No sites yet</li>
                )}
              </ul>
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl bg-white p-6 shadow">
          <p className="text-slate-700">You are logged in as a normal user. Your dashboard features and order/repair history will appear here.</p>
        </div>
      )}
    </div>
  );
}
