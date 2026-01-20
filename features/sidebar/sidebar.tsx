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
    url: "/user-dashboard",
    icon: MdOutlineSpaceDashboard,
  },
  {
    title: "Matter",
    url: "/matters",
    icon: BiBriefcaseAlt2,
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
    title: "Calendar",
    url: "/calendar",
    icon: MdOutlineCalendarMonth,
  },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar>
      <SidebarHeader className="mb-8">
        <Image
          src="/logo-main.svg"
          height={150}
          width={150}
          alt="Logo"
          className="object-contain mb-8"
          priority
        />
        <SidebarMenu>
          <p className="text-sm">Workspace</p>
          <SidebarMenuItem className="bg-[#AED6FF] px-1 py-2 rounded-sm">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                  <div className="p-2 bg-[#0088FF] rounded-sm">
                    <BiBriefcaseAlt2 className="fill-white" />
                  </div>
                  Sanderson legal
                  <IoChevronDownOutline className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[--radix-popper-anchor-width]">
                <DropdownMenuItem>
                  <span className="text-sm">Acme Inc</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <span className="text-sm">Acme Corp.</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
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
                    : pathname.startsWith(item.url);
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      tooltip={item.title}
                      className={cn(
                        "px-3 py-2 rounded-md text-sm font-medium transition-colors",
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
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

        <SidebarFooter>
          <Separator />
          <SidebarMenu>
            <SidebarMenuItem>
              <Link href="/setting">
                <SidebarMenuButton>
                  <IoSettingsOutline /> Settings
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
            <SidebarMenuButton>
              <PiSignOut /> Signin
            </SidebarMenuButton>
          </SidebarMenu>
        </SidebarFooter>
      </div>
    </Sidebar>
  );
}
