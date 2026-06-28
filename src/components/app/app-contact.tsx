"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { business } from "@/lib/business";

const serviceLabels: Record<string, string> = {
  maintenance: "Generator Maintenance",
  electrical: "Electrical Installation",
  ac: "Air Conditioner",
  repair: "Generator Repair",
  emergency: "Emergency Breakdown",
  other: "Other",
};

export default function AppContact() {
  const searchParams = useSearchParams();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [service, setService] = useState("maintenance");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const s = searchParams.get("service");
    if (s && serviceLabels[s]) setService(s);
  }, [searchParams]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, service, message }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Failed to send");
      setSuccess(true);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
        <p className="text-5xl">✅</p>
        <h2 className="mt-4 text-xl font-bold text-brand-900">Request Sent!</h2>
        <p className="mt-2 text-sm text-slate-600">
          We received your request and will contact you soon.
        </p>
        <a
          href={`tel:${business.hotlineTel}`}
          className="mt-6 block rounded-2xl bg-brand-600 py-4 text-sm font-bold text-white active:bg-brand-700"
        >
          📞 Urgent? Call {business.hotline}
        </a>
        <button
          type="button"
          onClick={() => {
            setSuccess(false);
            setName("");
            setPhone("");
            setEmail("");
            setMessage("");
          }}
          className="mt-3 text-sm font-medium text-brand-600"
        >
          Send another request
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-2xl bg-accent-500/20 px-4 py-3 text-sm text-brand-900">
        <strong>Tip:</strong> Fill this form and we will call you back. For urgent breakdowns, tap Call above.
      </div>

      <form onSubmit={onSubmit} className="space-y-4 rounded-2xl bg-white p-4 shadow-sm">
        <div>
          <label className="mb-1.5 block text-sm font-bold text-slate-800">Your Name *</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="e.g. Kamal Perera"
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-bold text-slate-800">Phone Number *</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            placeholder="07X XXX XXXX"
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-bold text-slate-800">Email (optional)</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-bold text-slate-800">Service Type</label>
          <select
            value={service}
            onChange={(e) => setService(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
          >
            {Object.entries(serviceLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-bold text-slate-800">Describe the Problem *</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
            required
            placeholder="Tell us what happened or what you need..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
          />
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-2xl bg-brand-600 py-4 text-base font-bold text-white active:bg-brand-700 disabled:opacity-60"
        >
          {loading ? "Sending..." : "Send Request"}
        </button>
      </form>
    </div>
  );
}
