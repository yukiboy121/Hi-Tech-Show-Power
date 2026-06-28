"use client";

import { useEffect, useState } from "react";

type Repair = {
  id: number;
  title: string;
  details: string | null;
  status: string;
  siteId: number | null;
  createdAt: string;
};

const statuses = ["open", "in_progress", "completed", "cancelled"];

export default function AdminRepairsPage() {
  const [repairs, setRepairs] = useState<Repair[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function load() {
    const res = await fetch("/api/repairs");
    const data = await res.json();
    setRepairs(data.repairs || []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function createRepair(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const res = await fetch("/api/repairs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, details }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(data.error || "Failed");
      return;
    }
    setTitle("");
    setDetails("");
    setShowForm(false);
    load();
  }

  async function updateStatus(id: number, status: string) {
    await fetch("/api/repairs", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    load();
  }

  return (
    <div className="p-4 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-brand-900 sm:text-2xl">Repairs</h1>
          <p className="mt-1 text-sm text-slate-600">Track and manage repair jobs.</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="rounded-xl bg-brand-700 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-600"
        >
          {showForm ? "Cancel" : "+ New Repair"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={createRepair} className="mt-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="space-y-3">
            <div>
              <label className="mb-1 block text-sm font-medium">Title</label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Details</label>
              <textarea
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                rows={3}
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <button className="rounded-lg bg-brand-700 px-4 py-2.5 text-sm text-white hover:bg-brand-600">
              Create Repair
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <p className="mt-8 text-center text-sm text-slate-500">Loading...</p>
      ) : repairs.length === 0 ? (
        <p className="mt-8 text-center text-sm text-slate-500">No repairs yet</p>
      ) : (
        <div className="mt-4 space-y-3">
          {repairs.map((r) => (
            <div key={r.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-slate-900">{r.title}</p>
                  <p className="mt-1 text-xs text-slate-500">
                    #{r.id} · {r.createdAt ? new Date(r.createdAt).toLocaleString() : ""}
                  </p>
                </div>
                <select
                  value={r.status}
                  onChange={(e) => updateStatus(r.id, e.target.value)}
                  className="rounded-lg border border-slate-300 px-2 py-1.5 text-xs outline-none focus:ring-2 focus:ring-brand-500"
                >
                  {statuses.map((s) => (
                    <option key={s} value={s}>
                      {s.replace("_", " ")}
                    </option>
                  ))}
                </select>
              </div>
              {r.details && (
                <p className="mt-2 text-sm text-slate-600">{r.details}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
