import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import AdminNav from "./ui/admin-nav";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  try {
    await requireAdmin();
  } catch {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <AdminNav />
      <div className="flex-1 overflow-auto pt-14 pb-24 lg:pt-0 lg:pb-6">{children}</div>
    </div>
  );
}
