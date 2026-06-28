import Link from "next/link";
import { business, mainServices } from "@/lib/business";

const extraServices = [
  {
    title: "Generator Repair",
    desc: "Diagnosis and repair for starting problems, low voltage, overheating, fuel system faults, and electrical failures on all generator types.",
    features: ["Diesel & petrol units", "Industrial generators", "Control panel repair", "Spare parts supply"],
  },
  {
    title: "Preventive Maintenance",
    desc: "Scheduled servicing including oil changes, filter replacements, coolant checks, battery testing, and full system inspection.",
    features: ["Service packages", "Maintenance reports", "Parts replacement", "Performance tuning"],
  },
  {
    title: "Load Testing",
    desc: "After installation or major repair, we verify your generator can handle required capacity under real operating conditions.",
    features: ["Capacity testing", "Performance reports", "Safety checks", "Client handover"],
  },
];

export default function ServicesPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:py-14">
      <div className="mb-10">
        <p className="text-sm font-medium uppercase tracking-widest text-brand-600">Services</p>
        <h1 className="mt-2 text-[clamp(1.75rem,5vw,2.5rem)] font-bold uppercase text-brand-900">
          Generator Maintenance
        </h1>
        <p className="mt-2 text-base font-semibold uppercase tracking-wide text-slate-700">
          Electrical Installations &amp; Air Conditioners
        </p>
        <p className="mt-4 max-w-2xl text-base text-slate-600">
          Complete power, electrical, and cooling solutions — available 24 hours a day across Sri Lanka.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        {mainServices.map((s) => (
          <div key={s.title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{s.icon}</span>
              <h2 className="text-lg font-semibold text-brand-900">{s.title}</h2>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">{s.desc}</p>
            <ul className="mt-4 grid grid-cols-2 gap-2">
              {s.features.map((f) => (
                <li key={f} className="flex items-center gap-2 text-xs text-slate-700">
                  <span className="text-brand-600">✓</span> {f}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <h2 className="mb-6 mt-12 text-xl font-bold text-brand-900">Additional Services</h2>
      <div className="grid gap-6 sm:grid-cols-3">
        {extraServices.map((s) => (
          <div key={s.title} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="font-semibold text-brand-900">{s.title}</h3>
            <p className="mt-2 text-sm text-slate-600">{s.desc}</p>
            <ul className="mt-3 space-y-1">
              {s.features.map((f) => (
                <li key={f} className="text-xs text-slate-700">
                  <span className="text-brand-600">✓</span> {f}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mt-10 rounded-2xl bg-brand-900 p-6 text-center text-white sm:p-10">
        <p className="text-sm font-bold uppercase tracking-wider text-accent-400">{business.serviceHours}</p>
        <h2 className="mt-2 text-xl font-bold">Call us now for a free quote</h2>
        <div className="mt-5 flex flex-wrap justify-center gap-3">
          <a
            href={`tel:${business.hotlineTel}`}
            className="rounded-xl bg-accent-500 px-8 py-3 text-sm font-bold text-brand-900 hover:bg-accent-400"
          >
            Hot Line: {business.hotline}
          </a>
          <Link
            href="/contact"
            className="rounded-xl border border-white/30 px-8 py-3 text-sm font-medium text-white hover:bg-white/10"
          >
            Contact Form
          </Link>
        </div>
      </div>
    </div>
  );
}
