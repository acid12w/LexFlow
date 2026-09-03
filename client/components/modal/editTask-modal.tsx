"use client";

import { Dispatch, SetStateAction, useState } from "react";

import { TbSubtask } from "react-icons/tb";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { EditTaskForm } from "@/features/tasks/editTaskForm";
import { Separator } from "@/components/ui/separator";

function TaskModal({
  showTaskModal,
  setShowTaskModal,
}: {
  showTaskModal: boolean;
  setShowTaskModal: Dispatch<SetStateAction<boolean>>;
}) {
  return (
    <Dialog open={showTaskModal} onOpenChange={setShowTaskModal}>
      <DialogContent className="sm:max-w-[590px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="p-1 flex justify-center items-center bg-gray-200 outline-gray-800 outline-dashed rounded-full h-10 w-10">
              <TbSubtask className=" text-gray-600 " size={25} />
            </div>
            Create Task
          </DialogTitle>
          <DialogDescription>
            Add a new task to to your matter.
          </DialogDescription>
        </DialogHeader>
        <Separator className="" />
        <EditTaskForm isEditing={undefined} />
      </DialogContent>
    </Dialog>
  );
}

export const UseNewTaskModal = () => {
  const [ShowTaskModal, setShowTaskModal] = useState(false);

  const taskModalComponent = () => {
    return (
      <TaskModal
        showTaskModal={ShowTaskModal}
        setShowTaskModal={setShowTaskModal}
      />
    );
  };
  return { setShowTaskModal, TaskModal: taskModalComponent };
};
