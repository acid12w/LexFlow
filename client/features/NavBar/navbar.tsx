"use client";

import { StopWatch } from "../stopWatch/stopWatch";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ModeToggle } from "@/features/setting/component/mode-toggle";
import { DropdownMenuShortcuts } from "@/features/drop-down/drop-down";

export function NavigationMenuBar() {
  return (
    <nav className="flex w-full items-center gap-2 border-b bg-background px-3 py-2 sm:px-6">
      <SidebarTrigger className="shrink-0" />
      <div className="min-w-0 flex-1 overflow-x-auto">
        <StopWatch />
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <ModeToggle />
        <DropdownMenuShortcuts />
      </div>
    </nav>
  );
}
