import { notFound } from "next/navigation";
import { SiteDetail } from "@/components/site-detail";

export const dynamic = "force-dynamic";

export default async function AdminSiteDetailPage({ params }: { params: { id: string } }) {
  const { id: idParam } = params;
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
