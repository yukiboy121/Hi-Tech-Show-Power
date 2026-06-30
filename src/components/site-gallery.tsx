"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import {
  IconCamera,
  IconTrash,
  IconDots,
  IconInfoCircle,
  IconClose,
  IconChevronLeft,
  IconChevronRight,
  IconDownload,
} from "@/components/icons";

type SiteImage = {
  id: number;
  path: string;
  createdAt?: string | Date | null;
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
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  const [menuOpen, setMenuOpen] = useState<number | null>(null);
  const [showDetails, setShowDetails] = useState(false);

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
      if (lightboxIdx !== null) {
        const idx = images.findIndex((im) => im.id === imageId);
        if (idx >= 0) {
          if (images.length === 1) {
            setLightboxIdx(null);
          } else if (idx <= lightboxIdx) {
            setLightboxIdx(Math.max(0, lightboxIdx - 1));
          }
        }
      }
      router.refresh();
    } catch {
      alert("Failed to delete");
    } finally {
      setDeleting(null);
      setMenuOpen(null);
    }
  }

  function goNext() {
    if (lightboxIdx === null) return;
    setLightboxIdx((lightboxIdx + 1) % images.length);
    setShowDetails(false);
  }

  function goPrev() {
    if (lightboxIdx === null) return;
    setLightboxIdx((lightboxIdx - 1 + images.length) % images.length);
    setShowDetails(false);
  }

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (lightboxIdx === null) return;
      if (e.key === "Escape") {
        setLightboxIdx(null);
        setShowDetails(false);
        setMenuOpen(null);
      }
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    },
    [lightboxIdx, images.length],
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    if (lightboxIdx !== null) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [lightboxIdx]);

  useEffect(() => {
    setMenuOpen(null);
    setShowDetails(false);
  }, [lightboxIdx]);

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
    <>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {images.map((im, idx) => (
          <button
            key={im.id}
            type="button"
            onClick={() => setLightboxIdx(idx)}
            className="group relative aspect-square overflow-hidden rounded-xl border border-slate-200 bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
          >
            <img
              src={`/api/images/${im.id}`}
              alt={`${siteName} photo`}
              className="h-full w-full object-cover transition-transform group-hover:scale-105"
            />
          </button>
        ))}
      </div>

      {lightboxIdx !== null && (() => {
        const im = images[lightboxIdx];
        return (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-2 sm:p-6"
            onClick={() => { setLightboxIdx(null); setShowDetails(false); setMenuOpen(null); }}
          >
            <div
              className="relative flex max-h-full max-w-full flex-col items-center"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative flex items-center justify-center">
                <img
                  src={`/api/images/${im.id}`}
                  alt={`${siteName} photo`}
                  className="max-h-[80vh] max-w-full rounded-lg object-contain"
                />
              </div>

              <div className="absolute left-2 right-2 top-2 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => { setLightboxIdx(null); setShowDetails(false); setMenuOpen(null); }}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70"
                  aria-label="Close"
                >
                  <IconClose className="h-5 w-5" />
                </button>

                {isAdmin && (
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setMenuOpen(menuOpen === im.id ? null : im.id)}
                      className="flex h-9 w-9 items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70"
                      aria-label="More options"
                    >
                      <IconDots className="h-5 w-5" />
                    </button>

                    {menuOpen === im.id && (
                      <div className="absolute right-0 top-full mt-1 w-44 overflow-hidden rounded-xl bg-white shadow-lg ring-1 ring-black/5">
                        <button
                          type="button"
                          onClick={() => { setShowDetails(!showDetails); setMenuOpen(null); }}
                          className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-slate-700 hover:bg-slate-50"
                        >
                          <IconInfoCircle className="h-4 w-4 text-slate-500" />
                          Details
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(im.id)}
                          disabled={deleting === im.id}
                          className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50 disabled:opacity-50"
                        >
                          <IconTrash className="h-4 w-4" />
                          {deleting === im.id ? "Deleting..." : "Delete"}
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {images.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={goPrev}
                    className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white hover:bg-black/70 sm:left-[-3rem]"
                    aria-label="Previous"
                  >
                    <IconChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    onClick={goNext}
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white hover:bg-black/70 sm:right-[-3rem]"
                    aria-label="Next"
                  >
                    <IconChevronRight className="h-5 w-5" />
                  </button>
                </>
              )}

              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-black/50 px-3 py-1 text-xs text-white">
                {lightboxIdx + 1} / {images.length}
              </div>

              {showDetails && im.createdAt && (
                <div className="absolute bottom-12 left-1/2 -translate-x-1/2 rounded-lg bg-black/70 px-4 py-2 text-xs text-white whitespace-nowrap">
                  Uploaded: {new Date(im.createdAt).toLocaleDateString("en-US", {
                    year: "numeric", month: "short", day: "numeric",
                  })}
                </div>
              )}
            </div>
          </div>
        );
      })()}
    </>
  );
}
