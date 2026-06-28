"use client";

import Link from "next/link";
import { business, mainServices } from "@/lib/business";

const quickActions = [
  {
    href: "/contact?service=emergency",
    icon: "🚨",
    title: "Emergency",
    desc: "Power failure now",
    color: "bg-red-600 text-white",
  },
  {
    href: "/contact?service=maintenance",
    icon: "🔧",
    title: "Generator Service",
    desc: "Repair & maintenance",
    color: "bg-white text-slate-900",
  },
  {
    href: "/contact?service=electrical",
    icon: "⚡",
    title: "Electrical Work",
    desc: "Wiring & panels",
    color: "bg-white text-slate-900",
  },
  {
    href: "/contact?service=ac",
    icon: "❄️",
    title: "Air Conditioner",
    desc: "Install & repair",
    color: "bg-white text-slate-900",
  },
];

export default function AppHome() {
  return (
    <div className="space-y-4">
      <section className="overflow-hidden rounded-3xl bg-gradient-to-br from-brand-900 to-brand-600 p-5 text-white shadow-lg">
        <p className="text-xs font-bold uppercase tracking-widest text-accent-400">
          {business.serviceHours}
        </p>
        <h1 className="mt-2 text-2xl font-bold leading-tight">{business.shortName}</h1>
        <p className="mt-2 text-sm text-red-100">{business.tagline}</p>
        <a
          href={`tel:${business.hotlineTel}`}
          className="mt-5 flex items-center justify-center gap-2 rounded-2xl bg-accent-500 py-4 text-base font-bold text-brand-900 active:bg-accent-400"
        >
          📞 Call Hotline — {business.hotline}
        </a>
      </section>

      <Link
        href="/contact"
        className="flex items-center gap-4 rounded-2xl bg-brand-600 p-4 text-white shadow-md active:bg-brand-700"
      >
        <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 text-3xl">
          📋
        </span>
        <div className="flex-1">
          <p className="text-lg font-bold">Request a Service</p>
          <p className="text-sm text-red-100">Send us your details — we will call you back</p>
        </div>
        <span className="text-xl">→</span>
      </Link>

      <div>
        <p className="mb-3 text-sm font-bold text-slate-700">What do you need?</p>
        <div className="grid grid-cols-2 gap-3">
          {quickActions.map((a) => (
            <Link
              key={a.title}
              href={a.href}
              className={`flex flex-col rounded-2xl p-4 shadow-sm active:scale-[0.98] ${a.color}`}
            >
              <span className="text-3xl">{a.icon}</span>
              <p className="mt-2 font-bold leading-tight">{a.title}</p>
              <p className={`mt-0.5 text-xs ${a.color.includes("text-white") ? "text-red-100" : "text-slate-500"}`}>
                {a.desc}
              </p>
            </Link>
          ))}
        </div>
      </div>

      <section className="rounded-2xl bg-white p-4 shadow-sm">
        <p className="text-sm font-bold text-brand-900">Our Services</p>
        <div className="mt-3 space-y-2">
          {mainServices.slice(0, 3).map((s) => (
            <div key={s.title} className="flex items-center gap-3 rounded-xl bg-slate-50 px-3 py-2.5">
              <span className="text-xl">{s.icon}</span>
              <p className="text-sm font-medium text-slate-800">{s.title}</p>
            </div>
          ))}
        </div>
        <Link href="/services" className="mt-3 block text-center text-sm font-semibold text-brand-600">
          See all services →
        </Link>
      </section>

      <a
        href={`tel:${business.mobileTel}`}
        className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-sm shadow-sm active:bg-slate-50"
      >
        <span className="text-slate-600">Mobile</span>
        <span className="font-bold text-brand-700">{business.mobile}</span>
      </a>
    </div>
  );
}
