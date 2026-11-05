import React, { useState } from "react";

import { CalendarDays, Ellipsis, Flag, MessageCircleMore } from "lucide-react";

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
  tasks: any;
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

  const limitParagraph = (text: string) => {
    if (!text) return "";
    const words = text.split(/\s+/); // Splits by spaces or linebreaks

    if (words.length <= 10) return text;

    return words.slice(0, 10).join(" ") + "...";
  };

  return (
    <div className="bg-card p-2.5 rounded shadow-md space-x-3 mb-3 flex flex-col gap-2">
      <div className="flex justify-between mr-0">
        <p
          className={cn(
            "font-medium px-2 py-1 rounded-sm flex items-center gap-x-2 text-sm",
            {
              "bg-[#ffbfbf] dark:bg-[#ff3838]/15 text-[#ff3838]": tasks.priority === "high",
              "bg-[#E4C2FF] dark:bg-[#860ee8]/20 text-[#860ee8] dark:text-[#c084fc]": tasks.priority === "medium",
              "bg-[#e3e5e4] dark:bg-muted text-muted-foreground": tasks.priority === "low",
            }
          )}
        >
          <Flag className="size-5" /> {tasks.priority}
        </p>

        <TaskActionBtn />
      </div>
      <div className="border-b-2 ">
        <p className="font-bold">{tasks.title}</p>
        <p className="text-sm text-muted-foreground mb-2">
          {limitParagraph(tasks.description)}
        </p>
      </div>
      {/* {tasks?.subTasks.length > 1 && (
        <ProgressBar
          subTasksCompleted={tasks.SubTasksCompleted}
          subTasksLength={tasks?.subTasks.length}
        />
      )} */}
      <div className="flex justify-between items-center mr-0">
        <div className="flex gap-x-2">
          <CalendarDays className="text-muted-foreground" />
          <p className="text-muted-foreground">{tasks.dueDate}</p>
        </div>
        <DateAlert date={tasks.endDate} />
      </div>
      {/* <div className="flex justify-between items-center">
        <div className="flex gap-x-2">
          <MessageCircleMore className="text-muted-foreground" /> <p>16</p>
        </div>
        <UserGroup className={"bg-blue-100 dark:bg-blue-500/15 outline-blue-800"} />
      </div> */}
    </div>
  );
};
