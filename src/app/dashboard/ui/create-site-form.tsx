"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateSiteForm({
  redirectTo,
  onSuccess,
  onCancel,
}: {
  redirectTo?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/sites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name, location, description }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Failed to create site");
      setName("");
      setLocation("");
      setDescription("");
      if (data.id) {
        onSuccess?.();
        router.push(`${redirectTo ?? "/admin/sites"}/${data.id}`);
      } else if (redirectTo) {
        onSuccess?.();
        router.push(redirectTo);
        router.refresh();
      } else {
        onSuccess?.();
        router.refresh();
      }
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
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full rounded-lg border border-slate-300 px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-brand-500"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">Location</label>
        <input
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="City / Address"
          className="w-full rounded-lg border border-slate-300 px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-brand-500"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="w-full rounded-lg border border-slate-300 px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-brand-500"
        />
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <div className="flex gap-2">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 active:bg-slate-50 disabled:opacity-60"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={loading}
          className={`rounded-xl bg-brand-600 px-4 py-3 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-60 ${onCancel ? "flex-1" : "w-full"}`}
        >
          {loading ? "Creating..." : "Create Site"}
        </button>
      </div>
    </form>
  );
}
