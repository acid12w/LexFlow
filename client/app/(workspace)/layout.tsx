"use client";

import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/features/sidebar/sidebar";
import { NavigationMenuBar } from "@/features/NavBar/navbar";

export default function Workspace({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full min-w-0">
        <NavigationMenuBar />
        {children}
      </main>
    </SidebarProvider>
  );
}
