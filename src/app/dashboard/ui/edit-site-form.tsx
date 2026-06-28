"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type SiteValues = {
  name: string;
  location: string;
  description: string;
};

export default function EditSiteForm({
  siteId,
  initial,
}: {
  siteId: number;
  initial: SiteValues;
}) {
  const router = useRouter();
  const [name, setName] = useState(initial.name);
  const [location, setLocation] = useState(initial.location);
  const [description, setDescription] = useState(initial.description);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const isDirty =
    name !== initial.name ||
    location !== initial.location ||
    description !== initial.description;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaved(false);
    setLoading(true);
    try {
      const res = await fetch(`/api/sites/${siteId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, location, description }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Failed to save");
      setSaved(true);
      router.refresh();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <div>
        <label className="mb-1 block text-sm font-medium">Name</label>
        <input
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setSaved(false);
          }}
          required
          className="w-full rounded-lg border border-slate-300 px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-brand-500"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">Location</label>
        <input
          value={location}
          onChange={(e) => {
            setLocation(e.target.value);
            setSaved(false);
          }}
          placeholder="City / Address"
          className="w-full rounded-lg border border-slate-300 px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-brand-500"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">Description</label>
        <textarea
          value={description}
          onChange={(e) => {
            setDescription(e.target.value);
            setSaved(false);
          }}
          rows={3}
          className="w-full rounded-lg border border-slate-300 px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-brand-500"
        />
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      {saved && <p className="text-sm text-green-600">Site details saved.</p>}
      <button
        type="submit"
        disabled={loading || !isDirty}
        className="w-full rounded-xl bg-brand-600 px-4 py-3 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-60"
      >
        {loading ? "Saving..." : "Save Changes"}
      </button>
    </form>
  );
}
