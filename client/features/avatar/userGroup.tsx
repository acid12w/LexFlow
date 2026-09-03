import { Button } from "@/components/ui/button";
import { AvatarGroup } from "./avatar";
import { RiUserAddLine } from "react-icons/ri";
import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

import { useUpdateCase } from "@/hooks/useMatterHook";
import { ComboboxDemo } from "../combo-box/comboBox";
import { useUserCredentials } from "@/app/store/user-store";

type AssigneeRef = { _id?: string; id?: string; [key: string]: unknown };

function toAssigneeIds(assignees: AssigneeRef[]) {
  return assignees
    .map((user) => user._id ?? user.id)
    .filter((id): id is string => Boolean(id));
}

export function UserGroup({
  className,
  displayValue = 2,
  row,
  isEditing,
  table,
}) {
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

  const handleAssigneeChange = (assigneeIds: string[]) => {
    const updatedAssignedTo = firmMembers.filter((member) =>
      assigneeIds.includes(member._id)
    );

    setFormData(updatedAssignedTo);
    table.options.meta?.updateData(row.index, "assignedTo", assigneeIds);
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
