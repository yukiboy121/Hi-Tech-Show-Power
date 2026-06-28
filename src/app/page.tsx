import Link from "next/link";
import Image from "next/image";
import { business, mainServices } from "@/lib/business";

export default function HomePage() {
  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-900 via-brand-700 to-brand-600 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(250,204,21,0.12),transparent_50%)]" />
        <div className="relative mx-auto max-w-6xl px-4 py-10 sm:py-16">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-brand-600 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-white ring-2 ring-accent-500">
            🕐 {business.serviceHours}
          </div>
          <div className="grid items-center gap-8 lg:grid-cols-2">
            <div>
              <p className="mb-2 text-sm font-medium uppercase tracking-widest text-accent-400">
                Sri Lanka · Power Engineering
              </p>
              <h1 className="text-[clamp(1.75rem,6vw,3rem)] font-bold uppercase leading-tight text-red-100">
                Generator Maintenance
              </h1>
              <p className="mt-3 text-base font-semibold uppercase tracking-wide text-white sm:text-lg">
                Electrical Installations &amp; Air Conditioners
              </p>
              <p className="mt-4 max-w-lg text-sm leading-relaxed text-red-100 sm:text-base">
                {business.description}
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <a
                  href={`tel:${business.hotlineTel}`}
                  className="rounded-xl bg-accent-500 px-6 py-3.5 text-center text-sm font-bold text-brand-900 hover:bg-accent-400"
                >
                  📞 Hot Line: {business.hotline}
                </a>
                <a
                  href={`tel:${business.mobileTel}`}
                  className="rounded-xl border border-white/40 px-6 py-3.5 text-center text-sm font-semibold text-white hover:bg-white/10"
                >
                  Mobile: {business.mobile}
                </a>
                <Link
                  href="/contact"
                  className="rounded-xl border border-white/30 px-6 py-3.5 text-center text-sm font-medium text-white hover:bg-white/10"
                >
                  Request Service
                </Link>
              </div>
            </div>
            <div className="overflow-hidden rounded-2xl border-2 border-white/20 shadow-2xl">
              <Image
                src="/banner.png"
                alt={`${business.name} - Generator Maintenance, Electrical Installations & Air Conditioners`}
                width={800}
                height={450}
                className="h-auto w-full object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-4 px-4 py-8 sm:grid-cols-4">
          {[
            { value: "24/7", label: "Hour Service" },
            { value: "3+", label: "Core Services" },
            { value: "100%", label: "Sri Lanka" },
            { value: "Fast", label: "Response Time" },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-2xl font-bold text-brand-600 sm:text-3xl">{s.value}</p>
              <p className="mt-1 text-xs text-slate-500 sm:text-sm">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold text-brand-900 sm:text-3xl">Our Services</h2>
          <p className="mt-2 text-slate-600">{business.tagline}</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {mainServices.map((s) => (
            <div
              key={s.title}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
            >
              <span className="text-3xl">{s.icon}</span>
              <h3 className="mt-3 font-semibold text-brand-900">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{s.desc}</p>
            </div>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link href="/services" className="text-sm font-medium text-brand-600 hover:underline">
            View all services →
          </Link>
        </div>
      </section>

      <section className="bg-brand-900 px-4 py-14 text-white">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 text-center sm:flex-row sm:text-left">
          <div className="flex-1">
            <h2 className="text-2xl font-bold sm:text-3xl">Need urgent help?</h2>
            <p className="mt-3 text-red-200">
              Call our 24-hour hotline. Our engineers are ready to restore your power, electrical systems, or AC units.
            </p>
          </div>
          <div className="flex shrink-0 flex-col gap-3">
            <a
              href={`tel:${business.hotlineTel}`}
              className="rounded-xl bg-accent-500 px-8 py-4 text-center text-lg font-bold text-brand-900 hover:bg-accent-400"
            >
              📞 {business.hotline}
            </a>
            <a
              href={`tel:${business.mobileTel}`}
              className="rounded-xl border border-white/30 px-8 py-3 text-center text-sm text-white hover:bg-white/10"
            >
              Mobile: {business.mobile}
            </a>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-10">
          <h2 className="text-xl font-bold text-brand-900 sm:text-2xl">Why Choose Us?</h2>
          <ul className="mt-6 grid gap-4 sm:grid-cols-2">
            {[
              "24-hour emergency service available",
              "Generator maintenance for all major brands",
              "Professional electrical installations",
              "Air conditioner repair and installation",
              "On-site service anywhere in Sri Lanka",
              "Experienced and certified engineers",
            ].map((item) => (
              <li key={item} className="flex items-start gap-3 text-sm text-slate-700">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-100 text-xs text-brand-600">
                  ✓
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
