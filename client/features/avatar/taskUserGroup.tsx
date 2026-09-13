import { Button } from "@/components/ui/button";
import { AvatarGroup } from "./avatar";
import { RiUserAddLine } from "react-icons/ri";
import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import type { Row, Table } from "@tanstack/react-table";

import { ComboboxDemo } from "../combo-box/comboBox";
import { useUpdateTask } from "@/hooks/task";
import { useUserCredentials } from "@/app/store/user-store";

type AssigneeRef = { _id?: string; id?: string; [key: string]: unknown };

interface TaskData {
  assignedTo?: AssigneeRef[];
  [key: string]: unknown;
}

interface ComponentProps {
  // Option A: Pass TanStack Table Row directly
  row?: Row<TaskData> | undefined;
  // Option B: If passing flat TaskData directly, set: row?: TaskData & { index: number };
  className?: string;
  displayValue?: number;
  isEditing?: boolean;
  table?: Table<TaskData> | null | any;
}

export function TaskUserGroup({
  className = "",
  displayValue = 2,
  row,
  isEditing = false,
  table = null,
}: ComponentProps) {
  const firmMembers = useUserCredentials((state) => state.members);

  // Safely extract assignedTo handling both TanStack Row object and direct data
  const initialAssignedTo = row
    ? "original" in row
      ? row.original.assignedTo
      : (row as unknown as TaskData).assignedTo
    : [];

  const [formData, setFormData] = useState<AssigneeRef[]>(
    initialAssignedTo || []
  );

  useEffect(() => {
    const currentAssignedTo = row
      ? "original" in row
        ? row.original.assignedTo
        : (row as unknown as TaskData).assignedTo
      : undefined;

    if (currentAssignedTo) {
      setFormData(currentAssignedTo);
    }
  }, [row]);

  const handleAssigneeChange = (assigneeIds: any) => {
    const updatedAssignedTo = firmMembers.filter((member) =>
      assigneeIds.includes(member._id)
    );

    setFormData(updatedAssignedTo);

    // Safely verify row and table exist before calling meta updateData
    if (row && table?.options?.meta?.updateData) {
      const rowIndex = "index" in row ? row.index : 0;
      table.options.meta.updateData(rowIndex, "assignedTo", assigneeIds);
    }
  };

  return (
    <div className={cn("flex gap-4 relative items-center", className)}>
      <AvatarGroup userData={formData} displaySize={displayValue} />

      {isEditing && (
        <ComboboxDemo
          value={formData.map((m) => m._id ?? m.id ?? "").filter(Boolean)}
          onChange={handleAssigneeChange}
          placeholder="Add assignees..."
        />
      )}
    </div>
  );
}
