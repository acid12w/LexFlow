"use client";
import {
  CircleCheckIcon,
  CircleDashedIcon,
  CircleDotDashedIcon,
  CircleIcon,
  Ghost,
  PlusIcon,
} from "lucide-react";

import { TaskStatus } from "./types";
import { Button } from "@/components/ui/button";
import { useContext } from "react";
import { ModalContext } from "@/components/modal/providers";

interface KanbanColumnHeaderProps {
  board: TaskStatus;
  taskCount: number;
}

const statusIconMap: Record<TaskStatus, React.ReactNode> = {
  // [TaskStatus.BACKLOG]: <CircleDashedIcon className="size-[18px]" />,
  [TaskStatus.TODO]: <CircleIcon className="size-[18px]" />,
  [TaskStatus.IN_PROGRESS]: <CircleDotDashedIcon className="size-[18px]" />,
  [TaskStatus.IN_REVIEW]: <CircleIcon className="size-[18px]" />,
  [TaskStatus.DONE]: <CircleCheckIcon className="size-[18px]" />,
};

// eslint-disable-next-line react-hooks/rules-of-hooks

export const KanbanColumnHeader = ({
  board,
  taskCount,
}: KanbanColumnHeaderProps) => {
  const { setShowTaskModal } = useContext(ModalContext);
  const icon = statusIconMap[board];
  return (
    <div className="px-2 py-1.5 rounded-sm bg-[#DAE1E7]">
      <div className="flex justify-between items-center ">
        <div className="flex items-center gap-x-2">
          {icon}
          <h2 className="text-sm">{board}</h2>
          <div>{taskCount}</div>
        </div>
        <Button
          onClick={() => {
            setShowTaskModal(true);
          }}
          className="size-5"
          variant="ghost"
          size="icon"
        >
          <PlusIcon className="size-4 text-neutral-100 bg-[#5C5C5C] rounded-full" />
        </Button>
      </div>
    </div>
  );
};
