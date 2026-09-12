import { Button } from "@/components/ui/button";
import { AvatarGroup } from "./avatar";
import { RiUserAddLine } from "react-icons/ri";
import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

import { ComboboxDemo } from "../combo-box/comboBox";
import { useUpdateTask } from "@/hooks/task";
import { useUserCredentials } from "@/app/store/user-store";

type AssigneeRef = { _id?: string; id?: string; [key: string]: unknown };

function toAssigneeIds(assignees: AssigneeRef[]) {
  return assignees
    .map((user) => user._id ?? user.id)
    .filter((id): id is string => Boolean(id));
}

export function TaskUserGroup({
  className = "",
  displayValue = 2,
  row = null,
  isEditing = false,
  table = null,
}) {
  const firmMembers = useUserCredentials((state) => state.members);

  const [formData, setFormData] = useState<AssigneeRef[]>(
    row?.original.assignedTo || []
  );

  useEffect(() => {
    if (row?.original.assignedTo) {
      setFormData(row.original.assignedTo);
    }
  }, [row?.original.assignedTo]);

  const handleAssigneeChange = (assigneeIds: any) => {
    const updatedAssignedTo = firmMembers.filter((member) =>
      assigneeIds.includes(member._id)
    );

    setFormData(updatedAssignedTo);
    table.options.meta?.updateData(row.index, "assignedTo", assigneeIds);
  };

  return (
    <div className="flex gap-4 relative items-center">
      <AvatarGroup userData={formData} displaySize={displayValue} />

      {/* 🌟 FIXED: Render the combobox directly when editing and let it manage open states */}
      {isEditing && (
        <ComboboxDemo
          value={formData.map((m) => m._id)}
          onChange={handleAssigneeChange}
          placeholder="Add assignees..."
        />
      )}
    </div>
  );
}
