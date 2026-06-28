import { destroySession } from "@/lib/auth";

export async function POST() {
  try {
    await destroySession();
    return Response.redirect("/", 302);
  } catch (e) {
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
