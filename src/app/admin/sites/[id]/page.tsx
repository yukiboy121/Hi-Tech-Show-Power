import { notFound } from "next/navigation";
import { SiteDetail } from "@/components/site-detail";

export const dynamic = "force-dynamic";

export default async function AdminSiteDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: idParam } = await params;
  const siteId = Number(idParam);
  if (!Number.isFinite(siteId)) notFound();

  return (
    <SiteDetail
      siteId={siteId}
      backHref="/admin/sites"
      backLabel="Back to Sites"
    />
  );
}
