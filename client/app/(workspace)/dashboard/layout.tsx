"use client";

import React, { useState } from "react";

import { RiUserAddLine } from "react-icons/ri";

import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";

import { AvatarGroup } from "@/features/avatar/avatar";
import { BreadcrumbWithCustomSeparator } from "@/features/breadecrumbs/breadcrumbs";

import Link from "next/link";

import { AssignUser } from "@/features/add-user/assign-user";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useUserCredentials } from "@/app/store/user-store";

export default function MatterWorkspace({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = React.useState(false);
  const [formData, setFormData] = useState<User[]>([]);
  type User = { id: string; [key: string]: any };

  const pathname = usePathname();
  const router = useRouter();

  const userData = useUserCredentials((state) => state?.user);

  console.log(userData);

  return (
    <>
      <div className="w-full flex flex-row justify-between border-b px-2 py-4">
        <div className="flex flex-col gap-3">
          <BreadcrumbWithCustomSeparator pathnameProps={pathname} />

          <p>Dashboard</p>

          {(userData?.role as string)?.toLowerCase() === "admin" && (
            <ButtonGroup>
              <Button
                onClick={() => router.push("/dashboard/user")}
                className={cn(
                  pathname === "/dashboard/user"
                    ? "bg-[#E2F1FF] text-[#0088FF] border-[#0088FF]"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )}
                variant="outline"
              >
                User
              </Button>
              <Button
                onClick={() => router.push("/dashboard/firm")}
                className={cn(
                  pathname === "/dashboard/firm"
                    ? "bg-[#E2F1FF] text-[#0088FF] border-[#0088FF]"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )}
                variant="outline"
              >
                Firm
              </Button>
            </ButtonGroup>
          )}
        </div>

        <div className="flex flex-col gap-8 justify-end">
          <div className="flex gap-4 relative">
            {/* <AvatarGroup userData={formData} />
            {open && (
              <AssignUser
                openState={open}
                onChange={(val: {}, id: string) => handleAddUser(val, id)}
              />
            )} */}
            {/* <Button
              type="button"
              onClick={() => setOpen(!open)}
              size="icon"
              className="rounded-full bg-blue-400 outline-blue-800 outline-dashed"
            >
              <RiUserAddLine className="fill-blue-800" />
            </Button> */}
          </div>
        </div>
      </div>
      {children}
    </>
  );
}
