"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import AppHeader from "@/components/app/app-header";
import AppTabBar from "@/components/app/app-tab-bar";
import AppMoreMenu from "@/components/app/app-more-menu";

type NavUser = { name: string; email?: string; role: "admin" | "user" } | null;

export default function AppShell({ user, children }: { user: NavUser; children: ReactNode }) {
  const [moreOpen, setMoreOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <AppHeader user={user} />
      <main className="app-main flex-1 overflow-y-auto px-4 pb-32 pt-3 animate-[fadeIn_0.3s_ease-out]">
        {children}
      </main>
      <AppTabBar onOpenMore={() => setMoreOpen(true)} />
      {moreOpen && <AppMoreMenu user={user} onClose={() => setMoreOpen(false)} />}
    </div>
  );
}
