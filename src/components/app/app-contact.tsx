"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { business } from "@/lib/business";
import { IconPhone, IconCheck, IconRefresh } from "@/components/icons";

const serviceLabels: Record<string, string> = {
  maintenance: "Generator Maintenance",
  electrical: "Electrical Installation",
  ac: "Air Conditioner",
  repair: "Generator Repair",
  emergency: "Emergency Breakdown",
  other: "Other",
};

type ContactUser = { name: string; email: string } | null;

export default function AppContact({ user }: { user?: ContactUser }) {
  const searchParams = useSearchParams();
  const [name, setName] = useState(user?.name ?? "");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState(user?.email ?? "");
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
        credentials: "include",
        body: JSON.stringify({ name, email, phone, service, message }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Failed to send request");
      setSuccess(true);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to send request");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="animate-[fadeInScale_0.35s_ease-out]">
        <div className="rounded-[24px] bg-surface-elevated p-8 text-center shadow-sm shadow-black/5">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-system-green/10">
            <IconCheck className="h-8 w-8 text-system-green" />
          </div>
          <h2 className="mt-4 text-[22px] font-bold text-label">Request Sent!</h2>
          <p className="mt-2 text-[15px] leading-relaxed text-secondary-label">
            We received your request and will contact you soon.
          </p>
          <a
            href={`tel:${business.hotlineTel}`}
            className="mt-6 flex items-center justify-center gap-2 rounded-full bg-brand-500 py-3.5 text-[15px] font-semibold text-white shadow-sm active:scale-[0.97] transition-all"
          >
            <IconPhone className="h-5 w-5" />
            Urgent? Call {business.hotline}
          </a>
          <button
            type="button"
            onClick={() => {
              setSuccess(false);
              if (!user) {
                setName("");
                setPhone("");
                setEmail("");
              }
              setMessage("");
            }}
            className="mt-4 flex items-center justify-center gap-1.5 rounded-full border border-separator px-6 py-3 text-[14px] font-semibold text-brand-500 active:bg-surface transition-colors mx-auto"
          >
            <IconRefresh className="h-4 w-4" />
            Send another request
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-[fadeInUp_0.35s_ease-out]">
      {/* Tip box */}
      <div className="rounded-[16px] bg-system-orange/10 px-5 py-4">
        <p className="text-[14px] leading-relaxed text-system-orange">
          <strong>Tip:</strong> Fill this form and we will call you back. For urgent breakdowns, use the emergency hotline.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={onSubmit} className="space-y-4 rounded-[24px] bg-surface-elevated p-5 shadow-sm shadow-black/5">
        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-[13px] font-semibold text-label">Your Name *</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="e.g. Kamal Perera"
              className="w-full rounded-[14px] border border-separator bg-surface px-4 py-3.5 text-[15px] outline-none ring-brand-500/30 transition-all placeholder:text-tertiary-label focus:border-brand-500 focus:ring-2"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-[13px] font-semibold text-label">Phone Number *</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              placeholder="07X XXX XXXX"
              className="w-full rounded-[14px] border border-separator bg-surface px-4 py-3.5 text-[15px] outline-none ring-brand-500/30 transition-all placeholder:text-tertiary-label focus:border-brand-500 focus:ring-2"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-[13px] font-semibold text-label">Email (optional)</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full rounded-[14px] border border-separator bg-surface px-4 py-3.5 text-[15px] outline-none ring-brand-500/30 transition-all placeholder:text-tertiary-label focus:border-brand-500 focus:ring-2"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-[13px] font-semibold text-label">Service Type</label>
            <select
              value={service}
              onChange={(e) => setService(e.target.value)}
              className="w-full appearance-none rounded-[14px] border border-separator bg-surface px-4 py-3.5 text-[15px] outline-none ring-brand-500/30 transition-all focus:border-brand-500 focus:ring-2"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M6 9L12 15L18 9' stroke='%23aeaeb2' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "right 16px center",
                backgroundSize: "16px",
              }}
            >
              {Object.entries(serviceLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-[13px] font-semibold text-label">Describe the Problem *</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              required
              placeholder="Tell us what happened or what you need..."
              className="w-full resize-none rounded-[14px] border border-separator bg-surface px-4 py-3.5 text-[15px] outline-none ring-brand-500/30 transition-all placeholder:text-tertiary-label focus:border-brand-500 focus:ring-2"
            />
          </div>
        </div>

        {error && (
          <div className="rounded-[14px] bg-system-red/10 px-4 py-3">
            <p className="text-[13px] text-system-red">{error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-brand-500 py-3.5 text-[15px] font-semibold text-white shadow-sm active:scale-[0.97] disabled:opacity-50 transition-all"
        >
          {loading ? "Sending..." : "Send Request"}
        </button>
      </form>
    </div>
  );
}
