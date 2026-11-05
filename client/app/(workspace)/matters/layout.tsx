"use client";

import React, { useState } from "react";

import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";

import { BreadcrumbWithCustomSeparator } from "@/features/breadecrumbs/breadcrumbs";

import Link from "next/link";

import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export default function MatterWorkspace({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = React.useState(false);
  const [formData, setFormData] = useState<User[]>([]);
  type User = { id: string; [key: string]: unknown };

  const handleAddUser = (value: User, id: string) => {
    setFormData((prevItems: User[]) => {
      const isDuplicate = formData.some((item) => item.id === value.id);

      if (isDuplicate) {
        return prevItems;
      }

      setOpen(false);
      return [...prevItems, value];
    });
  };

  const pathname = usePathname();
  const router = useRouter();

  return (
    <>
      <div className="flex w-full flex-col gap-4 border-b px-3 py-4 sm:flex-row sm:justify-between sm:px-4">
        <div className="flex flex-col gap-3">
          <BreadcrumbWithCustomSeparator pathnameProps={pathname} />

          <p>Matters</p>

          <ButtonGroup>
            <Button
              onClick={() => router.push("/matters")}
              className={cn(
                pathname === "/matters"
                  ? "bg-[#E2F1FF] dark:bg-[#0088FF]/15 text-[#0088FF] border-[#0088FF]"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
              variant="outline"
            >
              Spreadsheet
            </Button>
            <Button
              onClick={() => router.push("/matters/calendar")}
              className={cn(
                pathname === "/matters/calendar"
                  ? "bg-[#E2F1FF] dark:bg-[#0088FF]/15 text-[#0088FF] border-[#0088FF]"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
              variant="outline"
            >
              Calendar
            </Button>
          </ButtonGroup>
        </div>

        <div className="flex flex-col gap-4 justify-end sm:gap-8">
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

          <Button>
            <Link href="matters/new-matter">Create new matter</Link>
          </Button>
        </div>
      </div>
      {children}
    </>
  );
}
