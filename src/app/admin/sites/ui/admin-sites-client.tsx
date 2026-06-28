"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import CreateSiteForm from "@/app/dashboard/ui/create-site-form";
import { IconCamera, IconClose, IconMapPin, IconPlus, IconSearch } from "@/components/icons";

export type SiteRow = {
  id: number;
  name: string;
  location: string | null;
  description: string | null;
  createdAt: Date | string;
  imagesCount: number;
};

export default function AdminSitesClient({ sites }: { sites: SiteRow[] }) {
  const [query, setQuery] = useState("");
  const [createOpen, setCreateOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = createOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [createOpen]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return sites;
    return sites.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        (s.location?.toLowerCase().includes(q) ?? false) ||
        (s.description?.toLowerCase().includes(q) ?? false)
    );
  }, [sites, query]);

  return (
    <div className="p-4 sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-xl font-bold text-brand-900 sm:text-2xl">Sites</h1>
          <p className="mt-1 text-sm text-slate-600">
            {sites.length} site{sites.length === 1 ? "" : "s"} total
          </p>
        </div>
        <button
          type="button"
          onClick={() => setCreateOpen(true)}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-600 text-white shadow-md shadow-brand-600/25 active:scale-95 active:bg-brand-700 lg:hidden"
          aria-label="Create new site"
        >
          <IconPlus className="h-5 w-5" />
        </button>
      </div>

      <div className="relative mt-4">
        <IconSearch className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search sites by name, location..."
          className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery("")}
            className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 active:bg-slate-100"
            aria-label="Clear search"
          >
            <IconClose className="h-4 w-4" />
          </button>
        )}
      </div>

      {query && (
        <p className="mt-2 text-xs text-slate-500">
          {filtered.length} result{filtered.length === 1 ? "" : "s"} for &ldquo;{query}&rdquo;
        </p>
      )}

      <div className="mt-4 lg:mt-6 lg:grid lg:grid-cols-3 lg:gap-6">
        <div className="hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm lg:col-span-1 lg:block">
          <h2 className="mb-3 font-semibold text-brand-900">Create New Site</h2>
          <CreateSiteForm redirectTo="/admin/sites" />
        </div>

        <div className="lg:col-span-2">
          {filtered.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white py-12 text-center shadow-sm">
              <IconMapPin className="mx-auto h-10 w-10 text-slate-300" />
              <p className="mt-2 text-sm text-slate-500">
                {query ? "No sites match your search." : "No sites yet."}
              </p>
              {!query && (
                <button
                  type="button"
                  onClick={() => setCreateOpen(true)}
                  className="mt-4 inline-flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white active:bg-brand-700 lg:hidden"
                >
                  <IconPlus className="h-4 w-4" />
                  Create first site
                </button>
              )}
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              {filtered.map((s) => (
                <Link
                  key={s.id}
                  href={`/admin/sites/${s.id}`}
                  className="group flex flex-col rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-all active:scale-[0.99] hover:border-brand-300 hover:shadow-md"
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

      {createOpen && (
        <div className="fixed inset-0 z-[80] lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setCreateOpen(false)}
            aria-label="Close"
          />
          <div className="absolute bottom-0 left-0 right-0 max-h-[90vh] overflow-hidden rounded-t-3xl bg-white shadow-2xl animate-[slideUp_0.25s_ease-out]">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-brand-600">New Site</p>
                <p className="text-sm font-semibold text-slate-900">Create a job site</p>
              </div>
              <button
                type="button"
                onClick={() => setCreateOpen(false)}
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 active:bg-slate-200"
                aria-label="Close"
              >
                <IconClose className="h-4 w-4" />
              </button>
            </div>
            <div className="overflow-y-auto p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
              <CreateSiteForm
                redirectTo="/admin/sites"
                onSuccess={() => setCreateOpen(false)}
                onCancel={() => setCreateOpen(false)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
