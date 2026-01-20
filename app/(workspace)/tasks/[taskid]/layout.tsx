"use client";

import React, { useContext, useState } from "react";

import { usePathname, useRouter } from "next/navigation";

import { RiUserAddLine } from "react-icons/ri";
import { StarIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";

import { AvatarGroup } from "@/features/avatar/avatar";
import { BreadcrumbWithCustomSeparator } from "@/features/breadecrumbs/breadcrumbs";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

import { ModalContext } from "@/components/modal/providers";
import { cn } from "@/lib/utils";
import { is } from "zod/v4/locales";
import { UserGroup } from "@/features/avatar/userGroup";

export default function TashWorkspace({
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const pathname = usePathname();

  const [formData, setFormData] = useState<User[]>([]);
  type User = { id: string; [key: string]: any };

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
  const { setShowTaskModal } = useContext(ModalContext);

  return (
    <>
      <div className="w-full flex flex-row justify-between border-b px-2 py-4">
        <div className="flex flex-col gap-3">
          <BreadcrumbWithCustomSeparator pathnameProps={pathname} />
          <div className="flex flex-row items-center gap-4">
            <p>Johnson v. Smith – Initial Filing</p>
            <ToggleGroup
              type="multiple"
              variant="outline"
              spacing={2}
              size="sm"
            >
              <ToggleGroupItem
                value="star"
                aria-label="Toggle star"
                className="data-[state=on]:bg-transparent data-[state=on]:*:[svg]:fill-yellow-500 data-[state=on]:*:[svg]:stroke-yellow-500"
              >
                <StarIcon />
                Star
              </ToggleGroupItem>
            </ToggleGroup>
            <div className="flex gap-x-2 items-center bg-[#d9fcf4] px-2 py-1 rounded-full">
              <span className="h-3 w-3 bg-green-600 rounded-lg "></span>
              <p className="text-green-600">On track</p>
            </div>
          </div>
          <ButtonGroup>
            <Button
              onClick={() => router.push("/tasks/0/spreadsheet")}
              type="button"
              variant="outline"
              className={cn(
                pathname === "/tasks/0/spreadsheet"
                  ? "bg-[#E2F1FF] text-[#0088FF] border-[#0088FF]"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              Spreadsheet
            </Button>
            <Button
              onClick={() => router.push("/tasks/0/kanban")}
              variant="outline"
              className={cn(
                pathname === "/tasks/0/kanban"
                  ? "bg-[#E2F1FF] text-[#0088FF] border-[#0088FF]"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              Kanban board
            </Button>
            <Button
              onClick={() => router.push("/tasks/0/calendar")}
              variant="outline"
              className={cn(
                pathname === "/tasks/0/calendar"
                  ? "bg-[#E2F1FF] text-[#0088FF] border-[#0088FF]"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              Calendar
            </Button>
          </ButtonGroup>
        </div>
        <div className="flex flex-col gap-8 justify-end">
          <UserGroup className={"bg-blue-500 outline-blue-800" } displayValue={5}/>
          <Button onClick={() => setShowTaskModal(true)}>New Task</Button>
        </div>
      </div>
      {children}
    </>
  );
}
