"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { IconCamera, IconTrash } from "@/components/icons";

type SiteImage = {
  id: number;
  path: string;
};

export default function SiteGallery({
  siteId,
  images,
  isAdmin,
  siteName,
}: {
  siteId: number;
  images: SiteImage[];
  isAdmin: boolean;
  siteName: string;
}) {
  const router = useRouter();
  const [deleting, setDeleting] = useState<number | null>(null);

  async function handleDelete(imageId: number) {
    if (!confirm("Remove this photo?")) return;
    setDeleting(imageId);
    try {
      const res = await fetch(`/api/sites/${siteId}/images`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ imageId }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        alert(data.error || "Failed to delete");
        return;
      }
      router.refresh();
    } catch {
      alert("Failed to delete");
    } finally {
      setDeleting(null);
    }
  }

  if (images.length === 0) {
    return (
      <div className="rounded-xl border-2 border-dashed border-slate-200 py-12 text-center">
        <IconCamera className="mx-auto h-10 w-10 text-slate-300" />
        <p className="mt-2 text-sm text-slate-500">No photos uploaded yet</p>
        {isAdmin && <p className="mt-1 text-xs text-slate-400">Use the form above to add images</p>}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {images.map((im) => (
        <div
          key={im.id}
          className="group relative aspect-square overflow-hidden rounded-xl border border-slate-200 bg-slate-50"
        >
          <img
            src={im.path}
            alt={`${siteName} photo`}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
          />
          {isAdmin && (
            <button
              type="button"
              onClick={() => handleDelete(im.id)}
              disabled={deleting === im.id}
              className="absolute right-1.5 top-1.5 flex h-8 w-8 items-center justify-center rounded-full bg-red-600 text-white opacity-0 shadow transition-opacity hover:bg-red-700 group-hover:opacity-100 disabled:opacity-50"
              aria-label="Delete photo"
            >
              <IconTrash className="h-4 w-4" />
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
