"use client";

import { useContext, useState } from "react";
import { ArrowUpIcon, Expand, MoreHorizontalIcon, Pencil } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import { ModalContext } from "@/components/modal/providers";
import { EditTaskForm } from "../tasks/editTaskForm";
import { useRemoveTasks, useUpdateTask } from "@/hooks/task";

import { PiMicrosoftExcelLogoFill } from "react-icons/pi";
import { BsFileEarmarkWordFill } from "react-icons/bs";
import { BsFillFileEarmarkPdfFill } from "react-icons/bs";
import { ActionTab } from "./tab";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { ActionDropdown } from "./actionBtnDropdown";

interface taskActionBtnProps {
  rowData: [];
  edit: () => void;
  isEditing: boolean;
  taskId: string;
  showEdit: boolean;
}

export function TaskActionBtn({
  edit,
  isEditing,
  taskId,
  rowData,
  showEdit,
}: taskActionBtnProps) {
  const [showNewDialog, setShowNewDialog] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);

  const [idEditing, SetIsEditing] = useState(false);

  const { setShowTaskModal } = useContext(ModalContext);

  const [isExpanded, setIsExpanded] = useState(false);

  const { mutate: removeTask, isPending, isError } = useRemoveTasks(taskId);
  const { mutate: updateTask } = useUpdateTask();

  const handleDelete = () => {
    removeTask(taskId);
  };

  const handleEditToggle = () => {
    if (isEditing) {
      updateTask(rowData, taskId);
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
        <DropdownMenuItem onSelect={() => setShowShareDialog(true)}>
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
