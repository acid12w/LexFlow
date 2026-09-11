// components/tasks/task-action-btn.tsx
"use client";

import { useState } from "react";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { ActionDropdown } from "./actionBtnDropdown";

import { useRemoveCases, useUpdateCase } from "@/hooks/useMatterHook";
import Link from "next/link";

interface newCaseDataPayload {
  title: string;
  _id: string;
}

interface TaskActionBtnProps {
  rowData: newCaseDataPayload;
  edit: () => void;
  isEditing: boolean;
  caseId: string;
}

export function CaseActionBtn({
  edit,
  isEditing,

  rowData,
}: TaskActionBtnProps) {
  const caseId = rowData._id;

  const [showDetails, setShowDetails] = useState(false);
  const { mutate: removeCase } = useRemoveCases(caseId);
  const { mutate: updateCase } = useUpdateCase();

  const handleEditToggle = () => {
    if (isEditing) {
      updateCase(rowData);
      edit();
    } else {
      edit();
    }
  };

  return (
    <ActionDropdown>
      <DropdownMenuItem onSelect={handleEditToggle}>
        {isEditing ? "Save Row" : "Edit Row"}
      </DropdownMenuItem>
      {/* <DropdownMenuItem onSelect={() => setShowDetails(true)}>
        View details
      </DropdownMenuItem> */}
      <DropdownMenuItem>
        <Link href={`tasks/${caseId}`}>Open matter</Link>
      </DropdownMenuItem>
      <DropdownMenuItem
        className="text-red-600"
        onSelect={() => removeCase(caseId)}
      >
        Delete
      </DropdownMenuItem>
    </ActionDropdown>
  );
}
