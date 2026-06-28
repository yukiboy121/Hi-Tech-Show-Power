"use client";

import { useState } from "react";
import { business } from "@/lib/business";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [service, setService] = useState("maintenance");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      setName("");
      setEmail("");
      setPhone("");
      setMessage("");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to send");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:py-14">
      <div className="mb-8">
        <p className="text-sm font-medium uppercase tracking-widest text-brand-600">Contact</p>
        <h1 className="mt-2 text-[clamp(1.75rem,5vw,2.5rem)] font-bold text-brand-900">Get In Touch</h1>
        <p className="mt-3 text-slate-600">
          Request a quote, report a breakdown, or ask us anything. {business.serviceHours} available.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-5">
        <div className="space-y-4 lg:col-span-2">
          <div className="rounded-2xl border-2 border-brand-600 bg-brand-50 p-5 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-wider text-brand-600">Hot Line</p>
            <a
              href={`tel:${business.hotlineTel}`}
              className="mt-1 block text-2xl font-bold text-brand-700 hover:underline"
            >
              {business.hotline}
            </a>
            <p className="mt-1 text-xs text-slate-500">{business.serviceHours}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="font-semibold text-brand-900">📱 Mobile</h2>
            <a
              href={`tel:${business.mobileTel}`}
              className="mt-2 block text-lg font-semibold text-brand-600 hover:underline"
            >
              {business.mobile}
            </a>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="font-semibold text-brand-900">✉️ Email</h2>
            <a
              href={`mailto:${business.email}`}
              className="mt-2 block text-brand-600 hover:underline"
            >
              {business.email}
            </a>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="font-semibold text-brand-900">📍 Location</h2>
            <p className="mt-2 text-sm text-slate-600">{business.location}</p>
          </div>
        </div>

        <div className="lg:col-span-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            {success ? (
              <div className="py-8 text-center">
                <p className="text-4xl">✅</p>
                <h2 className="mt-4 text-lg font-semibold text-brand-900">Request Sent!</h2>
                <p className="mt-2 text-sm text-slate-600">
                  We received your message and will contact you shortly. For urgent matters, call{" "}
                  <a href={`tel:${business.hotlineTel}`} className="font-semibold text-brand-600">
                    {business.hotline}
                  </a>
                </p>
                <button
                  onClick={() => setSuccess(false)}
                  className="mt-4 text-sm text-brand-600 hover:underline"
                >
                  Send another request
                </button>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
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
                    <label className="mb-1 block text-sm font-medium">Phone</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                      className="w-full rounded-lg border border-slate-300 px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-brand-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">Service Type</label>
                  <select
                    value={service}
                    onChange={(e) => setService(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-brand-500"
                  >
                    <option value="maintenance">Generator Maintenance</option>
                    <option value="electrical">Electrical Installation</option>
                    <option value="ac">Air Conditioner</option>
                    <option value="repair">Generator Repair</option>
                    <option value="emergency">Emergency Breakdown</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">Message</label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={4}
                    required
                    placeholder="Describe your issue or requirement..."
                    className="w-full rounded-lg border border-slate-300 px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
                {error && <p className="text-sm text-red-600">{error}</p>}
                <button
                  disabled={loading}
                  className="w-full rounded-xl bg-brand-600 px-4 py-3.5 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-60 sm:w-auto sm:px-8"
                >
                  {loading ? "Sending..." : "Send Request"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
