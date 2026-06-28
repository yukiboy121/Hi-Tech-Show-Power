import { db } from "@/db";
import { sites, siteImages } from "@/db/schema";
import { desc, eq, sql } from "drizzle-orm";
import Link from "next/link";
import CreateSiteForm from "@/app/dashboard/ui/create-site-form";
import { IconCamera, IconMapPin } from "@/components/icons";

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
          <CreateSiteForm redirectTo="/admin/sites" />
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm lg:col-span-2">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-semibold text-brand-900">All Sites</h2>
            <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs text-slate-600">
              {siteRows.length} total
            </span>
          </div>

          {siteRows.length === 0 ? (
            <div className="py-10 text-center">
              <IconMapPin className="mx-auto h-10 w-10 text-slate-300" />
              <p className="mt-2 text-sm text-slate-500">No sites yet. Create one above.</p>
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              {siteRows.map((s) => (
                <Link
                  key={s.id}
                  href={`/admin/sites/${s.id}`}
                  className="group flex flex-col rounded-xl border border-slate-200 p-4 transition-all hover:border-brand-300 hover:shadow-md active:scale-[0.99]"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-slate-900 group-hover:text-brand-700">
                        {s.name}
                      </p>
                      <p className="mt-0.5 text-xs text-slate-500">
                        {s.location || "No location"}
                      </p>
                    </div>
                    <span className="flex shrink-0 items-center gap-1 rounded-full bg-brand-50 px-2 py-0.5 text-[10px] font-medium text-brand-700">
                      <IconCamera className="h-3 w-3" />
                      {s.imagesCount}
                    </span>
                  </div>
                  {s.description && (
                    <p className="mt-2 line-clamp-2 text-xs text-slate-600">{s.description}</p>
                  )}
                  <p className="mt-3 text-xs font-medium text-brand-600">Open site →</p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
