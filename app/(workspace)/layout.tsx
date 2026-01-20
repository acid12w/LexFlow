"use client";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/features/sidebar/sidebar";
import { NavigationMenuBar } from "@/features/NavBar/navbar";

export default function Workspace({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarTrigger />
      <main className="w-full">
        <NavigationMenuBar />
        {children}
      </main>
    </SidebarProvider>
  );
}
