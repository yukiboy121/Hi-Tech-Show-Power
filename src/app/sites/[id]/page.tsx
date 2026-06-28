import { db } from "@/db";
import { sites, siteImages } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound, redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import Image from "next/image";
import UploadImages from "./ui/upload-images";

export default async function SitePage({ params }: { params: { id: string } }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const id = Number(params.id);
  if (!Number.isFinite(id)) notFound();

  const row = await db.select().from(sites).where(eq(sites.id, id)).limit(1);
  if (!row.length) notFound();

  const imgs = await db.select().from(siteImages).where(eq(siteImages.siteId, id));

  return (
    <div className="mx-auto max-w-5xl p-4">
      <div className="mb-4">
        <h1 className="text-2xl font-semibold">{row[0].name}</h1>
        <p className="text-slate-700">{row[0].location || "No location"}</p>
      </div>

      {user.role === "admin" && (
        <div className="mb-6 rounded-2xl bg-white p-4 shadow">
          <h2 className="mb-2 font-medium">Upload images</h2>
          <UploadImages siteId={id} />
        </div>
      )}

      <div className="rounded-2xl bg-white p-4 shadow">
        <h2 className="mb-3 font-medium">Images</h2>
        {imgs.length === 0 ? (
          <p className="text-sm text-slate-600">No images yet.</p>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {imgs.map((im) => (
              <div key={im.id} className="relative aspect-video overflow-hidden rounded-md border">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={im.path} alt="site" className="h-full w-full object-cover" />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
