import { cn } from "@/lib/utils";
import { TaskStatus } from "../tasks/types";

interface EventCardProps {
  title: string;
  status: TaskStatus;
  id: string;
}

const statusColorMap: Record<TaskStatus, string> = {
  [TaskStatus.DONE]: "border-pink-500 bg-pink-50 text-pink-700  ",
  [TaskStatus.IN_PROGRESS]: "border-blue-500 bg-blue-50 text-blue-700",
  [TaskStatus.IN_REVIEW]: "border-yellow-500 bg-yellow-50 text-yellow-700",
  [TaskStatus.TODO]: "border-green-500 bg-green-50 text-green-700",
};

export const EventCard = ({ title, status, id }: EventCardProps) => {
  return (
    <div className="px-2 ">
      <div
        className={cn(
          "p-1.5 text-xs rounded-md border border-l-4 flex flex-col gap-y-1.5 cursor-pointer hover:opacity-75 transition",
          statusColorMap[status]
        )}
      >
        <p className="font-medium">{title}</p>
      </div>
    </div>
  );
};
