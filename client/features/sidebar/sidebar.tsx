"use client";

import {
  MdOutlineCalendarMonth,
  MdOutlineSpaceDashboard,
} from "react-icons/md";
import { GoTasklist } from "react-icons/go";
import { BiBriefcaseAlt2 } from "react-icons/bi";
import { IoChevronDownOutline } from "react-icons/io5";
import { IoSettingsOutline } from "react-icons/io5";
import { PiSignOut } from "react-icons/pi";
import {
  TimerIcon,
  LayoutDashboard,
  BriefcaseBusiness,
  Settings,
  Users,
  Calendar,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroupLabel,
  SidebarGroupContent,
} from "@/components/ui/sidebar";

import { Separator } from "@/components/ui/separator";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

// Menu items.
const navData = [
  {
    title: "Dashboard",
    url: "/dashboard/user",
    icon: LayoutDashboard,
  },
  {
    title: "Matter",
    url: "/matters",
    icon: BriefcaseBusiness,
    // subItems: [
    //   // Presence of subItems triggers collapsible rendering
    //   { title: "Case Preparation", url: "/projects/web" },
    //   { title: "Property Conveyance", url: "/projects/mobile" },
    // ],
  },
  {
    title: "Task",
    url: "/tasks",
    icon: GoTasklist,
  },
  {
    title: "Time Tracker",
    url: "/time-tracker",
    icon: TimerIcon,
  },
  {
    title: "Calendar",
    url: "/calendar",
    icon: Calendar,
  },
  {
    title: "Client",
    url: "/clients",
    icon: Users,
  },
  {
    title: "Setting",
    url: "/setting/profile",
    icon: Settings,
  },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar>
      <SidebarHeader className="mb-8">
        <Image
          src="/logo-main.png"
          height={150}
          width={150}
          alt="Logo"
          className="object-contain mb-8"
          priority
        />
      </SidebarHeader>
      <div className="flex flex-col justify-between h-full">
        <SidebarGroupContent className="px-4">
          <Separator />
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarContent>
            <SidebarMenu>
              {navData.map((item) => {
                const isActive =
                  item.url === "/"
                    ? pathname === "/"
                    : pathname === item.url ||
                      (() => {
                        // Get the root segment (e.g., "/setting" from "/setting/profile")
                        const itemRoot =
                          "/" + item.url.split("/").filter(Boolean)[0];
                        return pathname.startsWith(`${itemRoot}/`);
                      })();

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      tooltip={item.title}
                      className={cn(
                        "px-3 py-5 rounded-md text-sm font-medium transition-colors",
                        isActive
                          ? "bg-[#E2F1FF] text-[#0088FF] border-[#0088FF] border"
                          : "text-muted-foreground hover:bg-[#E2F1FF] hover:text-[#0088FF]"
                      )}
                    >
                      <a href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarContent>
        </SidebarGroupContent>
      </div>
    </Sidebar>
  );
}
