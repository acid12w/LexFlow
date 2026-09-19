import { cn } from "@/lib/utils";
import { MatterStatus, TaskStatus } from "../tasks/types";

export type CardStatus = MatterStatus | TaskStatus;

interface EventCardProps {
  title: string;
  status: CardStatus; // 👈 Allow both Task and Matter statuses
  id: string | null | undefined;
  description: string;
}

const statusColorMap: Record<CardStatus, string> = {
  // Matter Statuses
  [MatterStatus.DONE]: "border-green-500 bg-green-50 text-green-700",
  [MatterStatus.IN_PROGRESS]: "border-blue-500 bg-blue-50 text-blue-700",
  [MatterStatus.AT_RISK]: "border-yellow-500 bg-yellow-50 text-yellow-700",
  [MatterStatus.NOT_STARTED]: "border-yellow-500 bg-yellow-50 text-yellow-700",

  // Task Statuses
  [TaskStatus.TODO]: "border-slate-500 bg-slate-50 text-slate-700",
  [TaskStatus.IN_REVIEW]: "border-purple-500 bg-purple-50 text-purple-700",
  // Map any remaining TaskStatus enums here...
};

export const EventCard = ({
  title,
  status,
  id,
  description,
}: EventCardProps) => {
  console.log(title);
  return (
    <div className="px-2 ">
      <div
        className={cn(
          "p-1.5 text-xs rounded-md border border-l-4 flex flex-col gap-y-1.5 cursor-pointer hover:opacity-75 transition ",
          statusColorMap[status]
        )}
      >
        <h3 className="font-bold">{title}</h3>
        {/* <p>{description}</p> */}
      </div>
    </div>
  );
};
