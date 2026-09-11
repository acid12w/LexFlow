"use client";

import { TaskDataTable } from "@/features/table/TasksDataTable";
import { useGetAllTasksByCaseId, useUpdateTask } from "@/hooks/task";
import { Skeleton } from "@/components/ui/skeleton"; // Shadcn component
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useParams } from "next/navigation";
import { useBulkUpdateTasks } from "@/hooks/task";
import { TaskActionBtn } from "@/features/actionBtn/taskActionBtn";
import { useEffect } from "react";
import { Task } from "@/features/tasks/types";

const Spreadsheet = ({
  tasksData,
  isLoading,
}: {
  tasksData: Task[];
  isLoading: boolean;
}) => {
  const params = useParams();
  const caseId = params?.taskid;

  const { mutate: BulkUpdateTasks } = useBulkUpdateTasks();

  // 1. Destructure useful states
  // const { data, isLoading, isError, error } = useGetAllTasksByCaseId(caseId);

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
  // if (isError) {
  //   return (
  //     <Alert variant="destructive">
  //       <AlertTitle>Error fetching tasks</AlertTitle>
  //       <AlertDescription>{error.message}</AlertDescription>
  //     </Alert>
  //   );
  // }

  return (
    <div className="px-2">
      {/* 4. Ensure your table reacts to live data, not just 'initial' data */}
      <TaskDataTable
        ActionDropdown={TaskActionBtn}
        initialData={tasksData || []}
        updateTasks={BulkUpdateTasks}
      />
    </div>
  );
};

export default Spreadsheet;
