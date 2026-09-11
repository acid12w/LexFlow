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
    <main className="flex h-screen">
      <ul className="flex justify-center flex-col gap-4 p-4">
        <h1 className="text-2xl">Setting</h1>
        <Separator />
        <li
          className={cn(
            pathname.startsWith("/setting/profile")
              ? "text-[#0088FF] underline"
              : "text-gray-800"
          )}
        >
          <Link href={"/setting/profile"}>profile</Link>
        </li>
        {(userData as { role?: string })?.role?.toLowerCase() === "admin" && (
          <li
            className={cn(
              pathname.startsWith("/setting/users")
                ? "text-[#0088FF] underline"
                : "text-gray-800"
            )}
          >
            <Link href={"/setting/users"}>users</Link>
          </li>
        )}
        <li
          className={cn(
            pathname.startsWith("/setting/prefrences")
              ? "text-[#0088FF] underline"
              : "text-gray-800"
          )}
        >
          <Link href={"/setting/prefrences"}>prefrences</Link>
        </li>
      </ul>
      {children}
    </main>
  );
}
