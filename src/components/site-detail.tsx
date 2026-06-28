import { db } from "@/db";
import { sites, siteImages } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound, redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import Link from "next/link";
import SiteDetailAdmin from "@/components/site-detail-admin";
import { IconCamera, IconChevronLeft, IconMapPin } from "@/components/icons";

export const dynamic = "force-dynamic";

type Props = {
  siteId: number;
  backHref: string;
  backLabel: string;
};

export async function SiteDetail({ siteId, backHref, backLabel }: Props) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const row = await db.select().from(sites).where(eq(sites.id, siteId)).limit(1);
  if (!row.length) notFound();

  const site = row[0];
  const imgs = await db.select().from(siteImages).where(eq(siteImages.siteId, siteId));
  const isAdmin = user.role === "admin";

  return (
    <div className="mx-auto max-w-5xl px-4 py-5 sm:py-8">
      <Link
        href={backHref}
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-brand-600 hover:underline"
      >
        <IconChevronLeft className="h-4 w-4" />
        {backLabel}
      </Link>

      {isAdmin ? (
        <SiteDetailAdmin
          site={{
            id: site.id,
            name: site.name,
            location: site.location,
            latitude: site.latitude,
            longitude: site.longitude,
            description: site.description,
          }}
          photoCount={imgs.length}
        />
      ) : (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h1 className="text-xl font-bold text-brand-900 sm:text-2xl">{site.name}</h1>
              {site.location && (
                <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-600">
                  <IconMapPin className="h-4 w-4 text-brand-600" />
                  {site.location}
                </p>
              )}
              {site.description && (
                <p className="mt-3 text-sm leading-relaxed text-slate-700">{site.description}</p>
              )}
            </div>
            <span className="flex items-center gap-1 rounded-full bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700">
              <IconCamera className="h-3.5 w-3.5" />
              {imgs.length}
            </span>
          </div>
        </div>
      )}

      <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <h2 className="mb-4 flex items-center gap-2 font-semibold text-brand-900">
          <IconCamera className="h-5 w-5 text-brand-600" />
          Site Gallery
        </h2>
        {imgs.length === 0 ? (
          <div className="rounded-xl border-2 border-dashed border-slate-200 py-12 text-center">
            <IconCamera className="mx-auto h-10 w-10 text-slate-300" />
            <p className="mt-2 text-sm text-slate-500">No photos uploaded yet</p>
            {isAdmin && <p className="mt-1 text-xs text-slate-400">Use the form above to add images</p>}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {imgs.map((im) => (
              <div
                key={im.id}
                className="group relative aspect-square overflow-hidden rounded-xl border border-slate-200 bg-slate-50"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={im.path}
                  alt={`${site.name} photo`}
                  className="h-full w-full object-cover transition-transform group-hover:scale-105"
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
