"use client";

import { useContext, useState } from "react";

import {
  DropdownMenuGroup,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

import { ModalContext } from "@/components/modal/providers";

import { useUpdateTask } from "@/hooks/task";

import { ActionDropdown } from "./actionBtnDropdown";
import { useRemoveClient } from "@/hooks/useClientHook";
import { useRouter } from "next/navigation";

export interface ActionComponentProps {
  rowData?: any;
  edit?: (() => void) | undefined;
  isEditing?: boolean;
  clientId?: string | number | undefined;
  showEdit?: boolean;
}

export function ClientActionBtn({
  rowData,
  edit = () => {}, // 👈 Default empty function
  isEditing = false,
  clientId,
  showEdit = false,
}: ActionComponentProps) {
  const [showNewDialog, setShowNewDialog] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);

  const [idEditing, SetIsEditing] = useState(false);

  const { setShowTaskModal } = useContext(ModalContext);

  const [isExpanded, setIsExpanded] = useState(false);

  const { mutate: removeClient, isPending, isError } = useRemoveClient();
  const { mutate: updateTask } = useUpdateTask();

  const handleDelete = () => {
    if (!clientId) return;
    removeClient(clientId);
  };

  const router = useRouter();
  console.log(rowData);

  const handleEditToggle = () => {
    if (isEditing) {
      updateTask(rowData);
      edit();
    } else {
      edit();
    }
  };

  return (
    <ActionDropdown>
      <DropdownMenuGroup>
        {showEdit === true ? (
          <DropdownMenuItem onSelect={handleEditToggle}>
            {isEditing ? "Save Row" : "Edit Row"}
          </DropdownMenuItem>
        ) : (
          ""
        )}
        <DropdownMenuItem
          onSelect={() => router.replace(`/clients/${rowData._id}`)}
        >
          View details
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => handleDelete()}>
          Delete
        </DropdownMenuItem>
        {/* <DropdownMenuItem disabled>Download</DropdownMenuItem> */}
      </DropdownMenuGroup>
    </ActionDropdown>
  );
}
