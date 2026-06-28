import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-white">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-4 py-16 md:grid-cols-2 md:py-24">
          <div className="flex flex-col justify-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-sky-600">RELIABLE POWER SOLUTIONS</p>
            <h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
              Hi Tech Show Power Engineering
            </h1>
            <p className="mt-4 text-lg text-slate-600">
              Your trusted partner for generator installations, repairs, and maintenance across Sri Lanka. We keep your power on.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/register" className="rounded-lg bg-slate-900 px-5 py-3 text-base font-medium text-white shadow hover:bg-slate-800">
                Get Started
              </Link>
              <Link href="/login" className="rounded-lg border border-slate-300 px-5 py-3 text-base font-medium text-slate-800 hover:bg-slate-50">
                Client Login
              </Link>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <img src="/generator-hero.png" alt="Industrial Generator" className="max-h-96 w-auto rounded-lg" />
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="bg-slate-50 py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">Our Services</h2>
            <p className="mt-3 max-w-2xl mx-auto text-lg text-slate-600">
              Comprehensive solutions for all your power generation needs.
            </p>
          </div>
          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="rounded-2xl bg-white p-8 shadow-sm">
              <h3 className="text-xl font-semibold text-slate-900">Generator Installations</h3>
              <p className="mt-2 text-slate-600">
                Professional installation of all types of generators, ensuring optimal performance and safety compliance.
              </p>
            </div>
            <div className="rounded-2xl bg-white p-8 shadow-sm">
              <h3 className="text-xl font-semibold text-slate-900">Repairs & Maintenance</h3>
              <p className="mt-2 text-slate-600">
                Fast and reliable repair services to minimize downtime. We also offer scheduled maintenance plans.
              </p>
            </div>
            <div className="rounded-2xl bg-white p-8 shadow-sm">
              <h3 className="text-xl font-semibold text-slate-900">Site Management</h3>
              <p className="mt-2 text-slate-600">
                Use our client portal to track your sites, manage repair requests, and view service history online.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
