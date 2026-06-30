"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { IconCamera, IconEdit, IconMapPin, IconTrash, IconNavigation, IconMap } from "@/components/icons";

const EditSiteForm = dynamic(() => import("@/app/dashboard/ui/edit-site-form"), { ssr: false });
const UploadImages = dynamic(() => import("@/app/sites/[id]/ui/upload-images"), { ssr: false });

type SiteData = {
  id: number;
  name: string;
  location: string | null;
  latitude: string | null;
  longitude: string | null;
  description: string | null;
};

export default function SiteDetailAdmin({
  site,
  photoCount,
}: {
  site: SiteData;
  photoCount: number;
}) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const hasCoords = !!site.latitude && !!site.longitude;

  const mapUrl =
    hasCoords
      ? `https://www.openstreetmap.org/export/embed.html?bbox=${Number(site.longitude) - 0.02}%2C${Number(site.latitude) - 0.02}%2C${Number(site.longitude) + 0.02}%2C${Number(site.latitude) + 0.02}&layer=mapnik&marker=${site.latitude}%2C${site.longitude}`
      : null;

  const googleMapsUrl = hasCoords
    ? `https://www.google.com/maps?q=${site.latitude},${site.longitude}`
    : null;

  const googleDirectionsUrl = hasCoords
    ? `https://www.google.com/maps/dir/?api=1&destination=${site.latitude},${site.longitude}`
    : null;

  async function handleDelete() {
    if (!confirm(`Delete site "${site.name}" and all its photos? This cannot be undone.`)) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/sites/${site.id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        alert(data.error || "Failed to delete");
        return;
      }
      router.push("/admin/sites");
    } catch {
      alert("Failed to delete");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <>
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h1 className="text-xl font-bold text-brand-900 sm:text-2xl">{site.name}</h1>
            {site.location && (
              <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-600">
                <IconMapPin className="h-4 w-4 shrink-0 text-brand-600" />
                {site.location}
              </p>
            )}
            {site.description && (
              <p className="mt-3 text-sm leading-relaxed text-slate-700">{site.description}</p>
            )}
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <span className="flex items-center gap-1 rounded-full bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700">
              <IconCamera className="h-3.5 w-3.5" />
              {photoCount}
            </span>
            <button
              type="button"
              onClick={() => setEditing((v) => !v)}
              className={`flex h-10 w-10 items-center justify-center rounded-xl border transition-colors ${
                editing
                  ? "border-brand-600 bg-brand-600 text-white"
                  : "border-slate-200 bg-white text-slate-600 hover:border-brand-300 hover:text-brand-600"
              }`}
              aria-label={editing ? "Close edit" : "Edit site details"}
            >
              <IconEdit className="h-4 w-4" />
            </button>
          </div>
        </div>

        {hasCoords && !editing && (
          <div className="mt-3 flex flex-wrap gap-2">
            <a
              href={googleMapsUrl!}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 hover:border-brand-300 hover:text-brand-600"
            >
              <IconMap className="h-4 w-4" />
              Open in Google Maps
            </a>
            <a
              href={googleDirectionsUrl!}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 hover:border-brand-300 hover:text-brand-600"
            >
              <IconNavigation className="h-4 w-4" />
              Get Directions
            </a>
          </div>
        )}

        {mapUrl && !editing && (
          <div className="mt-3 overflow-hidden rounded-xl border border-slate-200">
            <iframe
              title="Site location map"
              src={mapUrl}
              className="h-48 w-full border-0"
              loading="lazy"
            />
          </div>
        )}

        {editing && (
          <EditSiteForm
            siteId={site.id}
            initial={{
              name: site.name,
              location: site.location ?? "",
              latitude: site.latitude ?? "",
              longitude: site.longitude ?? "",
              description: site.description ?? "",
            }}
            onClose={() => setEditing(false)}
          />
        )}

        {!editing && (
          <div className="mt-4 border-t border-slate-100 pt-4">
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting}
              className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-white px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
            >
              <IconTrash className="h-4 w-4" />
              {deleting ? "Deleting..." : "Delete Site"}
            </button>
          </div>
        )}
      </div>

      <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <h2 className="mb-3 flex items-center gap-2 font-semibold text-brand-900">
          <IconCamera className="h-5 w-5 text-brand-600" />
          Upload Photos
        </h2>
        <UploadImages siteId={site.id} />
      </div>
    </>
  );
}
