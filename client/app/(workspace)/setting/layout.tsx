"use client";

import { Separator } from "@/components/ui/separator";

import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useUserCredentials } from "@/app/store/user-store";

// Menu items.
const navData = [
  {
    title: "Dashboard",
    url: "/user-dashboard",
  },
  {
    title: "Matter",
    url: "/matters",
  },
  {
    title: "Task",
    url: "/tasks",
  },
  {
    title: "Time Tracker",
    url: "/time-tracker",
  },
  {
    title: "Calendar",
    url: "/calendar",
  },
];

export default function SettingNavigation({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const userData = useUserCredentials((state) => state?.user);

  return (
    <main className="flex min-h-dvh flex-col md:flex-row">
      <ul className="flex flex-wrap items-center gap-x-4 gap-y-2 p-4 md:flex-col md:items-start md:justify-center md:gap-4">
        <h1 className="w-full text-2xl md:w-auto">Setting</h1>
        <Separator className="hidden md:block" />
        <li
          className={cn(
            pathname.startsWith("/setting/profile")
              ? "text-[#0088FF] underline"
              : "text-foreground"
          )}
        >
          <Link href={"/setting/profile"}>profile</Link>
        </li>
        {(userData as { role?: string })?.role?.toLowerCase() === "admin" && (
          <li
            className={cn(
              pathname.startsWith("/setting/users")
                ? "text-[#0088FF] underline"
                : "text-foreground"
            )}
          >
            <Link href={"/setting/users"}>users</Link>
          </li>
        )}
        <li
          className={cn(
            pathname.startsWith("/setting/prefrences")
              ? "text-[#0088FF] underline"
              : "text-foreground"
          )}
        >
          <Link href={"/setting/prefrences"}>prefrences</Link>
        </li>
      </ul>
      {children}
    </main>
  );
}
