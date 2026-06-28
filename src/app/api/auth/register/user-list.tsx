"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type User = {
  id: number;
  name: string;
  email: string;
  role: "admin" | "user";
  createdAt: Date;
};

export default function UserList({ initialUsers }: { initialUsers: User[] }) {
  const router = useRouter();
  const [users, setUsers] = useState(initialUsers);
  const [loading, setLoading] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleRoleChange(userId: number, newRole: "admin" | "user") {
    setLoading(userId);
    setError(null);
    try {
      const res = await fetch(`/api/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Failed to update role");
      // Refresh data from server to ensure consistency
      router.refresh();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(null);
    }
  }

  return (
    <div>
      {error && <p className="mb-4 rounded-md bg-red-100 p-3 text-sm text-red-700">{error}</p>}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Name</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Email</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Role</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white">
            {users.map((user) => (
              <tr key={user.id}>
                <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-slate-900">{user.name}</td>
                <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-600">{user.email}</td>
                <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-600">
                  <span className={`rounded-full px-2 py-1 text-xs font-semibold ${user.role === "admin" ? "bg-sky-100 text-sky-800" : "bg-slate-100 text-slate-800"}`}>
                    {user.role}
                  </span>
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-sm">
                  <select
                    value={user.role}
                    onChange={(e) => handleRoleChange(user.id, e.target.value as "admin" | "user")}
                    disabled={loading === user.id}
                    className="rounded-md border-slate-300 text-sm focus:border-slate-500 focus:ring-slate-500 disabled:opacity-50"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}