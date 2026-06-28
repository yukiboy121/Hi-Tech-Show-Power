import { requireAdmin } from "@/lib/auth";

export default async function AdminRepairsPage() {
  await requireAdmin();
  return (
    <div className="mx-auto max-w-5xl p-4">
      <div className="rounded-2xl bg-white p-6 shadow">
        <h1 className="mb-2 text-2xl font-semibold">Repairs</h1>
        <p className="text-slate-700">Repairs tracking will be implemented here.</p>
      </div>
    </div>
  );
}
