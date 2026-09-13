import { Button } from "@/components/ui/button";
import { AvatarGroup } from "./avatar";
import { RiUserAddLine } from "react-icons/ri";
import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import type { Row, Table } from "@tanstack/react-table";
import { useUpdateCase } from "@/hooks/useMatterHook";
import { ComboboxDemo } from "../combo-box/comboBox";
import { useUserCredentials } from "@/app/store/user-store";

type AssigneeRef = { _id?: string; id?: string; [key: string]: unknown };

function toAssigneeIds(assignees: AssigneeRef[]) {
  return assignees
    .map((user) => user._id ?? user.id)
    .filter((id): id is string => Boolean(id));
}

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
  const [open, setOpen] = React.useState(false);
  const firmMembers = useUserCredentials((state) => state.members);

  const [formData, setFormData] = useState<AssigneeRef[]>(
    row?.original.assignedTo || []
  );

  useEffect(() => {
    if (row?.original.assignedTo) {
      setFormData(row.original.assignedTo);
    }
  }, [row?.original.assignedTo]);

  const handleAssigneeChange = (assigneeIds: any[]) => {
    const updatedAssignedTo = firmMembers.filter((member) =>
      assigneeIds.includes(member._id)
    );
    // Safely verify row and table exist before calling meta updateData
    if (row && table?.options?.meta?.updateData) {
      const rowIndex = "index" in row ? row.index : 0;
      table.options.meta.updateData(rowIndex, "assignedTo", assigneeIds);
    }

    setFormData(updatedAssignedTo);
  };

  return (
    <div className="flex gap-4 relative">
      <AvatarGroup userData={formData} displaySize={displayValue} />
      {open && (
        <ComboboxDemo
          value={toAssigneeIds(formData)}
          onChange={handleAssigneeChange}
          placeholder="Add assignees..."
        />
      )}
      {isEditing && (
        <Button
          type="button"
          onClick={() => setOpen(!open)}
          size="icon"
          className={cn("rounded-full outline-dashed", className)}
        >
          <RiUserAddLine className="fill-blue-800" />
        </Button>
      )}
    </div>
  );
}
