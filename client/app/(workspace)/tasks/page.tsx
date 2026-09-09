"use client";

import { TaskDataTable } from "@/features/table/TasksDataTable";
import { useGetAllTasks } from "@/hooks/task";
import { Skeleton } from "@/components/ui/skeleton"; // Shadcn component
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useBulkUpdateTasks } from "@/hooks/task";
import { TaskActionBtn } from "@/features/actionBtn/taskActionBtn";

const Spreadsheet = () => {
  const { data: tasksData, isLoading, isError, error } = useGetAllTasks();

  const { mutate: BulkUpdateTasks } = useBulkUpdateTasks();

  // 2. Professional Loading State
  if (isLoading) {
    return (
      <div className="space-y-3 px-2">
        <Skeleton className="h-[40px] w-full" /> {/* Search bar skeleton */}
        <Skeleton className="h-[300px] w-full" /> {/* Table skeleton */}
      </div>
    );
  }

  // 3. Error Handling
  if (isError) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Error fetching tasks</AlertTitle>
        <AlertDescription>{error.message}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="px-2">
      {/* 4. Ensure your table reacts to live data, not just 'initial' data */}
      <TaskDataTable
        ActionDropdown={TaskActionBtn}
        initialData={tasksData?.data || []}
        updateTasks={BulkUpdateTasks}
      />
    </div>
  );
};

export default Spreadsheet;
