import React, { useState } from "react";

import { CalendarDays, Ellipsis, Flag } from "lucide-react";

import { Task } from "./types";
import { AvatarGroup } from "../avatar/avatar";

import { AssignUser } from "../add-user/assign-user";
import { Button } from "@/components/ui/button";
import { RiUserAddLine } from "react-icons/ri";
import { DateAlert } from "../date/dateAlert";
import { cn } from "@/lib/utils";
import { ProgressBar } from "../progress/progress";
import { TaskActionBtn } from "../actionBtn/taskActionBtn";
import { UserGroup } from "../avatar/userGroup";

interface KanbanCardProps {
  tasks: Task;
}

export const KanbanCard = ({ tasks }: KanbanCardProps) => {
  const [open, setOpen] = React.useState(false);
  const [formData, setFormData] = useState<User[]>([]);
  type User = { id: string; [key: string]: any };

  const handleAddUser = (value: User, id: string) => {
    setFormData((prevItems: User[]) => {
      const isDuplicate = formData.some((item) => item.id === value.id);

      if (isDuplicate) {
        return prevItems;
      }

      setOpen(false);
      return [...prevItems, value];
    });
  };

  return (
    <div className="bg-white p-2.5 rounded shadow-md space-x-3 mb-3 flex flex-col gap-4">
      <div className="flex justify-between ">
        <p>{tasks.name}</p>
        <TaskActionBtn />
      </div>

      {tasks.subTasks.length > 1 && (
        <ProgressBar
          subTasksCompleted={tasks.SubTasksCompleted}
          subTasksLength={tasks?.subTasks.length}
        />
      )}
      <div className="flex justify-between">
        <p
          className={cn(
            "font-medium px-2 py-1 rounded-sm flex items-center gap-x-2",
            {
              "bg-[#ffbfbf] text-[#ff3838]": tasks.priority === "high",
              "bg-[#E4C2FF] text-[#860ee8]": tasks.priority === "medium",
              "bg-[#e3e5e4] text-[#5d5d5d]": tasks.priority === "low",
            }
          )}
        >
          <Flag className="size-5" /> {tasks.priority}
        </p>
        <DateAlert date={tasks.dueDate} />
      </div>
      <div className="flex justify-between items-center">
        <div className="flex gap-x-4">
          <CalendarDays className="text-gray-700" />
          <p className="text-gray-700">{tasks.dueDate}</p>
        </div>
        <UserGroup className={"bg-blue-100 outline-blue-800" }/>

      </div>
    </div>
  );
};
