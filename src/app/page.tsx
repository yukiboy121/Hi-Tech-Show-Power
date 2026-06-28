import { db } from "@/db";
import { sql } from "drizzle-orm";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  await db.execute(sql`select 1`);

  return (
    <div className="px-4 py-10">
      <section className="mx-auto flex max-w-6xl flex-col items-start gap-6 rounded-3xl bg-white p-8 shadow-[0_24px_60px_rgba(16,24,40,0.12)] md:flex-row md:items-center md:justify-between">
        <div className="max-w-2xl">
          <p className="m-0 text-sm uppercase tracking-[0.08em] text-slate-600">Sri Lanka</p>
          <h1 className="mt-2 text-[clamp(2rem,6vw,3rem)] font-semibold leading-tight text-slate-950">
            Hi Tech Show Power Engineering
          </h1>
          <p className="mt-4 text-base text-slate-700">
            Manage new sites, orders, and repairs in one place. Mobile-ready dashboards for field teams and admin control for management.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href="/register" className="rounded-lg bg-slate-900 px-4 py-2.5 text-white">Create account</a>
            <a href="/login" className="rounded-lg border border-slate-300 px-4 py-2.5 text-slate-900">Login</a>
          </div>
        </div>
        <div className="grid w-full max-w-md grid-cols-3 gap-2 self-stretch md:max-w-sm">
          <div className="h-28 rounded-xl bg-gradient-to-br from-sky-400 to-blue-600" />
          <div className="h-28 rounded-xl bg-gradient-to-br from-emerald-400 to-green-600" />
          <div className="h-28 rounded-xl bg-gradient-to-br from-amber-400 to-orange-600" />
          <div className="h-28 rounded-xl bg-gradient-to-br from-fuchsia-400 to-pink-600 col-span-2" />
          <div className="h-28 rounded-xl bg-gradient-to-br from-cyan-400 to-teal-600" />
        </div>
      </section>
    </div>
  );
}
