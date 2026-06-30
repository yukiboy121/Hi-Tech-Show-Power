"use client";

import { business } from "@/lib/business";
import { IconPhone, IconMail } from "@/components/icons";

const features = [
  "Generator repair & maintenance — all brands",
  "Electrical wiring & control panels",
  "Air conditioner install & service",
  "24-hour emergency breakdown service",
  "Island-wide mobile service in Sri Lanka",
];

export default function AppAbout() {
  return (
    <div className="space-y-4 animate-[fadeInUp_0.35s_ease-out]">
      {/* Company Card */}
      <section className="rounded-[24px] bg-surface-elevated p-6 shadow-sm shadow-black/5">
        <div className="flex h-14 w-14 items-center justify-center rounded-[16px] bg-brand-500 text-xl font-bold text-white shadow-sm">
          {business.shortName.slice(0, 2).toUpperCase()}
        </div>
        <h1 className="mt-4 text-[22px] font-bold leading-tight tracking-tight text-label">
          {business.name}
        </h1>
        <p className="mt-3 text-[15px] leading-relaxed text-secondary-label">
          {business.description}
        </p>
        <p className="mt-3 text-[15px] font-semibold text-brand-500">
          {business.tagline}
        </p>
      </section>

      {/* Features Card */}
      <section className="rounded-[24px] bg-surface-elevated p-6 shadow-sm shadow-black/5">
        <h2 className="text-[17px] font-bold text-label">What We Do</h2>
        <div className="mt-4 space-y-3">
          {features.map((item) => (
            <div key={item} className="flex items-start gap-3">
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-system-green/10">
                <svg viewBox="0 0 24 24" fill="none" stroke="#34c759" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </span>
              <p className="text-[15px] leading-relaxed text-label">{item}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Card */}
      <section className="rounded-[24px] bg-gradient-to-br from-brand-900 to-brand-700 p-6 text-white shadow-lg shadow-brand-900/20">
        <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-brand-200">
          Contact Us
        </p>
        <div className="mt-5 space-y-3">
          <a
            href={`tel:${business.hotlineTel}`}
            className="flex items-center justify-between rounded-[16px] bg-white/10 px-4 py-3.5 active:bg-white/20 transition-colors"
          >
            <div className="flex items-center gap-3">
              <IconPhone className="h-5 w-5 text-brand-200" />
              <span className="text-[15px] font-medium">Hot Line</span>
            </div>
            <span className="text-[15px] font-bold">{business.hotline}</span>
          </a>
          <a
            href={`tel:${business.mobileTel}`}
            className="flex items-center justify-between rounded-[16px] bg-white/10 px-4 py-3.5 active:bg-white/20 transition-colors"
          >
            <div className="flex items-center gap-3">
              <IconPhone className="h-5 w-5 text-brand-200" />
              <span className="text-[15px] font-medium">Mobile</span>
            </div>
            <span className="text-[15px] font-bold">{business.mobile}</span>
          </a>
          <a
            href={`mailto:${business.email}`}
            className="flex items-center justify-between rounded-[16px] bg-white/10 px-4 py-3.5 active:bg-white/20 transition-colors"
          >
            <div className="flex items-center gap-3">
              <IconMail className="h-5 w-5 text-brand-200" />
              <span className="text-[15px] font-medium">Email</span>
            </div>
            <span className="text-[14px] font-medium text-brand-200">{business.email}</span>
          </a>
        </div>
      </section>
    </div>
  );
}
