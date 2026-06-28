"use client";

import { useEffect, useState } from "react";

type User = {
  id: number;
  name: string;
  email: string;
  role: "admin" | "user";
  createdAt: string;
};

export default function AdminSettingsPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function load() {
    const res = await fetch("/api/admin/users");
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Failed to load users");
      setLoading(false);
      return;
    }
    setUsers(data.users || []);
    setCurrentUserId(data.currentUserId);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function toggleRole(userId: number, currentRole: "admin" | "user") {
    setError(null);
    setSuccess(null);
    const newRole = currentRole === "admin" ? "user" : "admin";
    const res = await fetch("/api/admin/users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, role: newRole }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(data.error || "Failed to update role");
      return;
    }
    setSuccess(`Role updated successfully`);
    load();
  }

  return (
    <div className="p-4 sm:p-6">
      <h1 className="text-xl font-bold text-brand-900 sm:text-2xl">Settings</h1>
      <p className="mt-1 text-sm text-slate-600">
        Manage user roles. Only existing admins can promote users to admin.
      </p>

      <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
        <strong>Note:</strong> New registrations are always created as regular users. To make someone
        an admin, use the toggle below. Admins must be set manually — registration does not grant admin access.
      </div>

      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
      {success && <p className="mt-4 text-sm text-green-600">{success}</p>}

      {loading ? (
        <p className="mt-8 text-center text-sm text-slate-500">Loading users...</p>
      ) : (
        <div className="mt-6 space-y-3">
          {users.map((u) => (
            <div
              key={u.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
            >
              <div className="min-w-0">
                <p className="font-medium text-slate-900">
                  {u.name}
                  {u.id === currentUserId && (
                    <span className="ml-2 text-xs text-slate-400">(you)</span>
                  )}
                </p>
                <p className="text-xs text-slate-500">{u.email}</p>
                <p className="mt-1 text-xs text-slate-400">
                  Joined {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : ""}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${
                    u.role === "admin"
                      ? "bg-brand-100 text-brand-700"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {u.role}
                </span>
                <button
                  onClick={() => toggleRole(u.id, u.role)}
                  className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-medium hover:bg-slate-50"
                >
                  {u.role === "admin" ? "Remove Admin" : "Make Admin"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
