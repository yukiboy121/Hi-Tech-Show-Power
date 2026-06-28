import { db } from "@/db";
import { sites, siteImages } from "@/db/schema";
import { desc, eq, sql } from "drizzle-orm";
import AdminSitesClient from "./ui/admin-sites-client";

export const dynamic = "force-dynamic";

export default async function AdminSitesPage() {
  const siteRows = await db
    .select({
      id: sites.id,
      name: sites.name,
      location: sites.location,
      description: sites.description,
      createdAt: sites.createdAt,
      imagesCount: sql<number>`count(${siteImages.id})`.mapWith(Number),
    })
    .from(sites)
    .leftJoin(siteImages, eq(siteImages.siteId, sites.id))
    .groupBy(sites.id)
    .orderBy(desc(sites.createdAt));

  return <AdminSitesClient sites={siteRows} />;
}
