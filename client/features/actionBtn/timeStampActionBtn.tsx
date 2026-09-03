"use client";

import { useState } from "react";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { ActionDropdown } from "./actionBtnDropdown";

import { useRemovetimeTracker } from "@/hooks/useTimeTrackerHook";
import Link from "next/link";

interface TaskActionBtnProps {
  rowData: any;
  // edit: () => void;
  isEditing: boolean;
  caseId: string;
}

export function TimeStampActionBtn({ rowData }: TaskActionBtnProps) {
  const caseId = rowData._id;

  const { mutate: removeItem } = useRemovetimeTracker(caseId);
  // const { mutate: updateCase } = useUpdateCase();

  // const handleEditToggle = () => {
  //   if (isEditing) {
  //     updateCase(rowData);
  //     edit();
  //   } else {
  //     edit();
  //   }
  // };

  return (
    <ActionDropdown>
      {/* <DropdownMenuItem onSelect={handleEditToggle}>
        {isEditing ? "Save Row" : "Edit Row"}
      </DropdownMenuItem> */}

      <DropdownMenuItem
        className="text-red-600"
        onSelect={() => removeItem(caseId)}
      >
        Delete
      </DropdownMenuItem>
    </ActionDropdown>
  );
}
