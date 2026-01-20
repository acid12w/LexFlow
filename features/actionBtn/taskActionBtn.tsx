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

import { PiMicrosoftExcelLogoFill } from "react-icons/pi";
import { BsFileEarmarkWordFill } from "react-icons/bs";
import { BsFillFileEarmarkPdfFill } from "react-icons/bs";
import { ActionTab } from "./tab";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface taskActionBtnProps {
  edit: () => void,
  isEditing: boolean
}

export function TaskActionBtn({edit, isEditing}: taskActionBtnProps) {
  const [showNewDialog, setShowNewDialog] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);

  const [idEditing, SetIsEditing] = useState(false);

  const { setShowTaskModal } = useContext(ModalContext);

  const [isExpanded, setIsExpanded] = useState(false);
  console.log(isExpanded)

  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" aria-label="Open menu" size="icon-sm">
            <MoreHorizontalIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-40" align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <Separator className="my-1" />
          <DropdownMenuGroup>
            <DropdownMenuItem onSelect={edit}>{isEditing ? "Finish Editing" : "Edit Row"}</DropdownMenuItem>
            <DropdownMenuItem onSelect={() => setShowShareDialog(true)}>
              View details
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => setShowNewDialog(true)}>
              Delete
            </DropdownMenuItem>
            {/* <DropdownMenuItem disabled>Download</DropdownMenuItem> */}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      <Dialog open={showNewDialog} onOpenChange={setShowNewDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create New File</DialogTitle>
            <DialogDescription>
              Provide a name for your new file. Click create when you&apos;re
              done.
            </DialogDescription>
          </DialogHeader>
          <FieldGroup className="pb-3">
            <Field>
              <FieldLabel htmlFor="filename">File Name</FieldLabel>
              <Input id="filename" name="filename" placeholder="document.txt" />
            </Field>
          </FieldGroup>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
        <DialogContent className={cn("overflow-x-scroll h-[98%]", isExpanded === true ? "sm:max-w-[725px]": "sm:max-w-[525px] " )} >
          <DialogHeader>
            <DialogTitle>Patrick Bob divorce</DialogTitle>
            <DialogDescription>
              Anyone with the link will be able to view this file.
            </DialogDescription>
            <div className="flex gap-x-4">
              <Button onClick={() => setIsExpanded(!isExpanded)} variant="outline" size="icon" aria-label="Submit">
                <Expand />
              </Button>
              <Button
                variant="outline"
                size="icon"
                aria-label="Submit"
                onClick={() => {
                  SetIsEditing(!idEditing);
                }}
              >
                <Pencil />
              </Button>
            </div>

            <Separator className="my-1" />
          </DialogHeader>
          <EditTaskForm isEditing={idEditing} />
          <div className="flex justify-between">
            <p className="text-gray-500">Attachments</p>
            <p className="text-blue-500">Download all</p>
          </div>
          <div className="flex gap-4 h-max ">
            <div className="flex items-center border-2 border-gray-200 p-2 w-max rounded-lg ">
              <PiMicrosoftExcelLogoFill className="size-12 text-green-600" />
              <p className="w-max">work sheet</p>
            </div>
            <div className="flex items-center border-2 border-gray-200 p-2 w-max rounded-lg">
              <BsFileEarmarkWordFill className="size-10 text-blue-600" />
              <p className="w-max">work sheet</p>
            </div>
            <div className="flex items-center border-2 border-gray-200 p-2 w-max rounded-lg">
              <BsFillFileEarmarkPdfFill className="size-10 text-red-600" />
              <p className="w-max">work sheet</p>
            </div>
          </div>

          <Button variant="outline" size="sm">
            Upload Files
          </Button>
          <ActionTab />
        </DialogContent>
      </Dialog>
    </>
  );
}
