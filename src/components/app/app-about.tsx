"use client";

import { business } from "@/lib/business";

export default function AppAbout() {
  return (
    <div className="space-y-4">
      <section className="rounded-2xl bg-white p-5 shadow-sm">
        <h1 className="text-xl font-bold text-brand-900">{business.name}</h1>
        <p className="mt-3 text-sm leading-relaxed text-slate-600">{business.description}</p>
        <p className="mt-3 text-sm font-semibold text-brand-700">{business.tagline}</p>
      </section>

      <section className="rounded-2xl bg-white p-5 shadow-sm">
        <h2 className="font-bold text-brand-900">What We Do</h2>
        <ul className="mt-3 space-y-2.5">
          {[
            "Generator repair & maintenance — all brands",
            "Electrical wiring & control panels",
            "Air conditioner install & service",
            "24-hour emergency breakdown service",
            "Island-wide mobile service in Sri Lanka",
          ].map((item) => (
            <li key={item} className="flex items-start gap-2.5 text-sm text-slate-700">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-100 text-xs text-brand-600">
                ✓
              </span>
              {item}
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-2xl bg-brand-900 p-5 text-white">
        <p className="text-xs font-bold uppercase text-accent-400">Contact Us</p>
        <div className="mt-4 space-y-3">
          <a
            href={`tel:${business.hotlineTel}`}
            className="flex items-center justify-between rounded-xl bg-white/10 px-4 py-3.5 active:bg-white/20"
          >
            <span className="text-sm">Hot Line</span>
            <span className="font-bold text-accent-400">{business.hotline}</span>
          </a>
          <a
            href={`tel:${business.mobileTel}`}
            className="flex items-center justify-between rounded-xl bg-white/10 px-4 py-3.5 active:bg-white/20"
          >
            <span className="text-sm">Mobile</span>
            <span className="font-bold">{business.mobile}</span>
          </a>
          <a
            href={`mailto:${business.email}`}
            className="flex items-center justify-between rounded-xl bg-white/10 px-4 py-3.5 active:bg-white/20"
          >
            <span className="text-sm">Email</span>
            <span className="text-sm font-medium text-accent-400">{business.email}</span>
          </a>
        </div>
      </section>
    </div>
  );
}
