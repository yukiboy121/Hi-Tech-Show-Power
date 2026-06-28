import { business } from "@/lib/business";
import GeneratorGallery from "@/components/generator-gallery";

export default function WebAbout() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:py-14">
      <div className="mb-10">
        <p className="text-sm font-medium uppercase tracking-widest text-brand-600">About Us</p>
        <h1 className="mt-2 text-[clamp(1.75rem,5vw,2.5rem)] font-bold text-brand-900">
          {business.name}
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-600">
          We are a dedicated power engineering company based in Sri Lanka, specializing in{" "}
          <strong>generator maintenance</strong>, <strong>electrical installations</strong>, and{" "}
          <strong>air conditioner services</strong>. With hands-on field experience, our team
          delivers reliable solutions that keep your power and cooling systems running when you
          need them most.
        </p>
        <p className="mt-3 text-sm font-semibold uppercase tracking-wide text-brand-700">
          {business.tagline}
        </p>
      </div>

      <div className="mb-10">
        <h2 className="mb-4 text-lg font-semibold text-brand-900">Equipment We Work With</h2>
        <GeneratorGallery />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-brand-900">Our Mission</h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-600">
            To provide fast, affordable, and professional generator, electrical, and AC services to
            every customer — from small home units to large industrial systems. We believe
            uninterrupted power and comfort should be accessible to everyone.
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-brand-900">Our Expertise</h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-600">
            Our engineers are trained on all major generator brands including Perkins, Cummins,
            Kipor, Honda, and more. We also handle industrial electrical control panels, ATS
            systems, and all types of air conditioning units.
          </p>
        </div>
      </div>

      <div className="mt-10 rounded-2xl bg-brand-50 p-6 sm:p-8">
        <h2 className="text-lg font-semibold text-brand-900">24 Hour Service</h2>
        <p className="mt-3 text-sm text-slate-600">
          Emergencies don&apos;t wait — and neither do we. Call our hotline anytime for generator
          breakdowns, electrical faults, or AC failures. We operate across all provinces in Sri Lanka.
        </p>
        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <a
            href={`tel:${business.hotlineTel}`}
            className="rounded-xl bg-brand-600 px-5 py-3.5 text-center text-sm font-bold text-white active:bg-brand-700"
          >
            Hot Line: {business.hotline}
          </a>
          <a
            href={`tel:${business.mobileTel}`}
            className="rounded-xl border border-brand-300 px-5 py-3.5 text-center text-sm font-semibold text-brand-700 active:bg-white"
          >
            Mobile: {business.mobile}
          </a>
          <a
            href={`mailto:${business.email}`}
            className="rounded-xl border border-brand-300 px-5 py-3.5 text-center text-sm font-semibold text-brand-700 active:bg-white"
          >
            {business.email}
          </a>
        </div>
      </div>
    </div>
  );
}
