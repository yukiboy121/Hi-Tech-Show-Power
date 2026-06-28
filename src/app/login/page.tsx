"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Login failed");
      router.replace(data.role === "admin" ? "/admin" : "/dashboard");
      router.refresh();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 py-10 sm:py-14">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <h1 className="text-xl font-bold text-brand-900 sm:text-2xl">Login</h1>
        <p className="mt-1 text-sm text-slate-600">Access your dashboard</p>
        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-lg border border-slate-300 px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-lg border border-slate-300 px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            disabled={loading}
            className="w-full rounded-xl bg-brand-700 px-4 py-3.5 text-sm font-semibold text-white hover:bg-brand-600 disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-slate-600">
          No account?{" "}
          <Link href="/register" className="font-medium text-brand-600 hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
