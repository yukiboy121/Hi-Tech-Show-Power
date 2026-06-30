"use client";

import Link from "next/link";
import { business, mainServices } from "@/lib/business";
import { IconArrowRight, IconPhone } from "@/components/icons";

const quickActions = [
  {
    href: "/contact?service=emergency",
    icon: "🚨",
    title: "Emergency",
    desc: "Power failure now",
    gradient: "from-system-red to-red-600",
  },
  {
    href: "/contact?service=maintenance",
    icon: "🔧",
    title: "Generator Service",
    desc: "Repair & maintenance",
    gradient: "from-brand-500 to-brand-600",
  },
  {
    href: "/contact?service=electrical",
    icon: "⚡",
    title: "Electrical Work",
    desc: "Wiring & panels",
    gradient: "from-system-orange to-orange-600",
  },
  {
    href: "/contact?service=ac",
    icon: "❄️",
    title: "Air Conditioner",
    desc: "Install & repair",
    gradient: "from-system-teal to-teal-600",
  },
];

export default function AppHome() {
  return (
    <div className="space-y-4 animate-[fadeInUp_0.4s_ease-out]">
      {/* Hero Card */}
      <section className="overflow-hidden rounded-[28px] bg-gradient-to-br from-brand-900 to-brand-700 p-6 text-white shadow-lg shadow-brand-900/20">
        <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-brand-200">
          {business.serviceHours}
        </p>
        <h1 className="mt-3 text-[28px] font-bold leading-tight tracking-tight">
          {business.shortName}
        </h1>
        <p className="mt-1.5 text-sm leading-relaxed text-brand-200">
          {business.tagline}
        </p>
        <a
          href={`tel:${business.hotlineTel}`}
          className="mt-6 flex items-center justify-center gap-2.5 rounded-full bg-white py-3.5 text-[15px] font-semibold text-brand-700 shadow-lg shadow-black/10 active:scale-[0.97] transition-all"
        >
          <IconPhone className="h-5 w-5" />
          Call Hotline — {business.hotline}
        </a>
      </section>

      {/* Quick Actions */}
      <div>
        <h2 className="mb-3 px-1 text-[13px] font-semibold uppercase tracking-[0.08em] text-secondary-label">
          What do you need?
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {quickActions.map((a, i) => (
            <Link
              key={a.title}
              href={a.href}
              className="group relative overflow-hidden rounded-[20px] bg-surface-elevated p-4 shadow-sm shadow-black/5 active:scale-[0.97] transition-all duration-200"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${a.gradient} opacity-[0.04]`} />
              <span className="relative text-3xl">{a.icon}</span>
              <p className="relative mt-3 text-[15px] font-bold leading-tight text-label">{a.title}</p>
              <p className="relative mt-0.5 text-[12px] text-secondary-label">{a.desc}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Request Card */}
      <Link
        href="/contact"
        className="group flex items-center gap-4 rounded-[20px] bg-surface-elevated p-5 shadow-sm shadow-black/5 active:scale-[0.98] transition-all"
      >
        <span className="flex h-[52px] w-[52px] items-center justify-center rounded-[16px] bg-brand-500/10 text-2xl">
          📋
        </span>
        <div className="flex-1">
          <p className="text-[17px] font-bold text-label">Request a Service</p>
          <p className="mt-0.5 text-[13px] text-secondary-label">
            Send us your details — we will call you back
          </p>
        </div>
        <IconArrowRight className="h-5 w-5 text-tertiary-label group-hover:text-brand-500 transition-colors" />
      </Link>

      {/* Services Preview */}
      <section className="rounded-[20px] bg-surface-elevated p-5 shadow-sm shadow-black/5">
        <h2 className="text-[17px] font-bold text-label">Our Services</h2>
        <div className="mt-4 space-y-1">
          {mainServices.slice(0, 3).map((s) => (
            <div
              key={s.title}
              className="flex items-center gap-3 rounded-[14px] px-3 py-3 active:bg-surface transition-colors"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-[12px] bg-brand-500/10 text-lg">
                {s.icon}
              </span>
              <p className="text-[15px] font-medium text-label">{s.title}</p>
            </div>
          ))}
        </div>
        <Link
          href="/services"
          className="mt-4 flex items-center justify-center gap-1.5 rounded-[14px] bg-surface py-3 text-[14px] font-semibold text-brand-500 active:bg-brand-500/10 transition-colors"
        >
          See all services
          <IconArrowRight className="h-4 w-4" />
        </Link>
      </section>

      {/* Mobile Contact */}
      <a
        href={`tel:${business.mobileTel}`}
        className="flex items-center justify-between rounded-[20px] bg-surface-elevated px-5 py-4 shadow-sm shadow-black/5 active:scale-[0.98] transition-all"
      >
        <span className="text-[15px] text-secondary-label">Mobile</span>
        <span className="text-[15px] font-bold text-brand-500">{business.mobile}</span>
      </a>
    </div>
  );
}
