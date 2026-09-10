"use client";

import React, { useContext, useState } from "react";

import { useParams, usePathname } from "next/navigation";

import { StarIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";

import { BreadcrumbWithCustomSeparator } from "@/features/breadecrumbs/breadcrumbs";

import Spreadsheet from "./spreadsheet/page";
import KanbanBoard from "./kanban/page";
import Calendar from "./calendar/page";

// import {
//   ToggleGroup,
//   ToggleGroupItem,
// } from "@/lib/utilstoggle-group";

// import { ModalContext } from "@/features/avatar/userGroup/providers";
import { cn } from "@/lib/utils";
import { is } from "zod/v4/locales";
import { UserGroup } from "@/features/avatar/userGroup";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { ModalContext } from "@/components/modal/providers";
import { useTaskStore } from "@/app/store/use-task";
import { useGetAllTasksByCaseId } from "@/hooks/task";
import { useGetMatterById } from "@/hooks/useMatterHook";
import { MATTER_STATUS, MATTER_STATUS_LABELS } from "@/lib/matter-health";

// 1. Declare your layout design maps OUTSIDE the component rendering loops
const STATUS_STYLES = {
  IN_PROGRESS: { badge: "bg-[#E2F1FF] text-[#006bc9]", dot: "bg-[#006bc9]" },
  NOT_STARTED: { badge: "bg-[#fff4d3] text-[#e49101]", dot: "bg-[#e49101]" },
  DONE: { badge: "bg-[#d9fcf4] text-[#00c496]", dot: "bg-[#00c496]" },
  AT_RISK: { badge: "bg-[#ffd2c2] text-[#e80e0e]", dot: "bg-[#e80e0e]" },
} as const;

type User = { id: string; [key: string]: unknown };

export default function TaskWorkspace() {
  const pathname = usePathname();
  const params = useParams();
  const caseId = params?.taskid;

  const { data: tasksData, isLoading } = useGetAllTasksByCaseId(caseId ?? "");
  const { data: matterData } = useGetMatterById(caseId);

  // Control visibility state flags securely
  const [open, setOpen] = useState(false); // ✅ FIXED: Added missing open state handler
  const [formData, setFormData] = useState<User[]>([]);
  const [taskSwitcher, setTaskSwitcher] = useState("spreadsheet");
  const { setShowTaskModal } = useContext(ModalContext);

  const label =
    MATTER_STATUS_LABELS[
      matterData?.data.status as keyof typeof MATTER_STATUS_LABELS
    ] ?? matterData?.data.status;

  const handleAddUser = (value: User, id: string) => {
    // ✅ FIXED: Evaluated 'prevItems' directly instead of stale global state array records
    setFormData((prevItems: User[]) => {
      const isDuplicate = prevItems.some((item) => item.id === value.id);

      if (isDuplicate) {
        return prevItems;
      }

      setOpen(false);
      return [...prevItems, value];
    });
  };

  // ✅ FIXED: Safely look up styles from the extracted status styling matrix block
  const statusKey = matterData?.data.status as keyof typeof STATUS_STYLES;
  const currentStyle = STATUS_STYLES[statusKey] || {
    badge: "bg-gray-100 text-gray-700",
    dot: "bg-gray-400",
  };

  return (
    // ✅ FIXED: Wrapped total component siblings using a structural React Fragment tag template
    <>
      <div className="w-full flex flex-row justify-between border-b px-2 py-4">
        <div className="flex flex-col gap-3">
          <BreadcrumbWithCustomSeparator pathnameProps={pathname} />

          <div className="flex flex-row items-center gap-4">
            <p className="font-semibold text-lg">{matterData?.data.title}</p>

            <ToggleGroup type="multiple" variant="outline" size="sm">
              <ToggleGroupItem
                value="star"
                aria-label="Toggle star"
                className="data-[state=on]:bg-transparent data-[state=on]:*:[svg]:fill-yellow-500 data-[state=on]:*:[svg]:stroke-yellow-500"
              >
                <StarIcon />
                Star
              </ToggleGroupItem>
            </ToggleGroup>

            {/* ✅ FIXED: Render the badge inline safely inside the correct lexical scope */}
            <div
              className={cn(
                "h-max w-max flex gap-x-2 items-center px-2 py-1 rounded-full",
                currentStyle.badge
              )}
            >
              <span className={cn("w-3 h-3 rounded-full", currentStyle.dot)} />
              <p className="text-sm font-bold">{label}</p>
            </div>
          </div>

          <ButtonGroup>
            <Button
              onClick={() => setTaskSwitcher("spreadsheet")}
              type="button"
              variant="outline"
              className={cn(
                taskSwitcher === "spreadsheet"
                  ? "bg-[#E2F1FF] text-[#0088FF] border-[#0088FF]"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              Spreadsheet
            </Button>
            <Button
              onClick={() => setTaskSwitcher("kanban")}
              variant="outline"
              className={cn(
                taskSwitcher === "kanban"
                  ? "bg-[#E2F1FF] text-[#0088FF] border-[#0088FF]"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              Kanban board
            </Button>
            <Button
              onClick={() => setTaskSwitcher("calendar")}
              variant="outline"
              className={cn(
                taskSwitcher === "calendar"
                  ? "bg-[#E2F1FF] text-[#0088FF] border-[#0088FF]"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              Calendar
            </Button>
          </ButtonGroup>
        </div>

        <div className="flex flex-col gap-8 justify-end">
          <UserGroup
            className="bg-blue-500 outline-blue-800"
            displayValue={5}
          />
          <Button onClick={() => setShowTaskModal(true)}>New Task</Button>
        </div>
      </div>

      {/* View Matrix Panels Routing Layout Grid wrapper viewports */}
      <div className="p-4">
        {taskSwitcher === "spreadsheet" ? (
          <Spreadsheet
            tasksData={tasksData?.data || []}
            isLoading={isLoading}
          />
        ) : taskSwitcher === "kanban" ? (
          <KanbanBoard
            tasksData={tasksData?.data || []}
            isLoading={isLoading}
          />
        ) : (
          <Calendar tasksData={tasksData?.data || []} isLoading={isLoading} />
        )}
      </div>
    </>
  );
}
