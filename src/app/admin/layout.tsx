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
    <div className="flex min-h-[calc(100vh-57px)]">
      <AdminNav />
      <div className="flex-1 overflow-auto pb-20 md:pb-6">{children}</div>
    </div>
  );
}
