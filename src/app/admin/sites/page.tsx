import { db } from "@/db";
import { sites, siteImages } from "@/db/schema";
import { desc, eq, sql } from "drizzle-orm";
import Link from "next/link";
import CreateSiteForm from "@/app/dashboard/ui/create-site-form";

export const dynamic = "force-dynamic";

export default async function AdminSitesPage() {
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
    <div className="p-4 sm:p-6">
      <h1 className="text-xl font-bold text-brand-900 sm:text-2xl">Sites</h1>
      <p className="mt-1 text-sm text-slate-600">Manage job sites and upload photos.</p>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm lg:col-span-1">
          <h2 className="mb-3 font-semibold text-brand-900">Create New Site</h2>
          <CreateSiteForm />
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm lg:col-span-2">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-semibold text-brand-900">All Sites</h2>
            <span className="text-xs text-slate-500">{siteRows.length} total</span>
          </div>
          <ul className="divide-y divide-slate-100">
            {siteRows.map((s) => (
              <li key={s.id} className="flex items-center justify-between gap-3 py-3">
                <div className="min-w-0">
                  <p className="truncate font-medium text-slate-900">{s.name}</p>
                  <p className="text-xs text-slate-500">
                    {s.location || "No location"} · {s.imagesCount} images
                  </p>
                </div>
                <Link
                  href={`/sites/${s.id}`}
                  className="shrink-0 rounded-lg border border-slate-300 px-3 py-1.5 text-xs hover:bg-slate-50"
                >
                  Open
                </Link>
              </li>
            ))}
            {siteRows.length === 0 && (
              <li className="py-6 text-center text-sm text-slate-500">No sites yet</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
