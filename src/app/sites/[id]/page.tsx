import { notFound } from "next/navigation";
import { SiteDetail } from "@/components/site-detail";

export const dynamic = "force-dynamic";

export default function SitePage({ params }: { params: { id: string } }) {
  const { id: idParam } = params;
  const siteId = Number(idParam);
  if (!Number.isFinite(siteId)) notFound();

  return (
    <SiteDetail
      siteId={siteId}
      backHref="/dashboard"
      backLabel="Back to Dashboard"
    />
  );
}
