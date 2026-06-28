import { db } from "@/db";
import { users } from "@/db/schema";
import { requireAdmin } from "@/lib/auth";
import { asc } from "drizzle-orm";
import UserList from "./ui/user-list";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  await requireAdmin();

  const userList = await db.select().from(users).orderBy(asc(users.createdAt));

  return (
    <div className="mx-auto max-w-6xl p-4">
      <h1 className="mb-4 text-2xl font-semibold">Manage Users</h1>
      <div className="rounded-2xl bg-white p-4 shadow">
        <UserList initialUsers={userList} />
      </div>
    </div>
  );
}