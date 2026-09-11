import { Skeleton } from "@/components/ui/skeleton";
import { DataCalendar } from "@/features/calendar/data-calendar";
import { Task } from "@/features/tasks/types";

const Calendar = ({
  tasksData,
  isLoading,
}: {
  tasksData: Task[];
  isLoading: boolean;
}) => {
  if (isLoading) {
    return (
      <div className="space-y-3 px-2">
        <Skeleton className="h-10 w-full" /> {/* Search bar skeleton */}
        <Skeleton className="h-[300px] w-full" /> {/* Table skeleton */}
      </div>
    );
  }

  return (
    <div className="px-2">
      <DataCalendar tasksData={tasksData || []} />
    </div>
  );
};

export default Calendar;
