"use client";

import { TaskDataTable } from "@/features/table/TasksDataTable";
import { useGetAllTasks } from "@/hooks/task";
import { Skeleton } from "@/components/ui/skeleton"; // Shadcn component
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useBulkUpdateTasks } from "@/hooks/task";
import { TaskActionBtn } from "@/features/actionBtn/taskActionBtn";
import { BreadcrumbWithCustomSeparator } from "@/features/breadecrumbs/breadcrumbs";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { StarIcon } from "lucide-react";
import { usePathname } from "next/navigation";

const Spreadsheet = () => {
  const { data: tasksData, isLoading, isError, error } = useGetAllTasks();

  const { mutate: BulkUpdateTasks } = useBulkUpdateTasks();

  const pathname = usePathname();

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
    <div className="w-full p-2">
      <div className="flex flex-col gap-3">
        <BreadcrumbWithCustomSeparator pathnameProps={pathname} />

        <div className="flex flex-row items-center gap-4">
          <ToggleGroup type="multiple" variant="outline" size="sm">
            <ToggleGroupItem
              value="star"
              aria-label="Toggle star"
              className="data-[state=on]:bg-transparent data-[state=on]:*:[svg]:fill-yellow-500 data-[state=on]:*:[svg]:stroke-yellow-500"
            >
              <StarIcon />
              Star
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
      </div>

      <TaskDataTable
        ActionDropdown={TaskActionBtn}
        initialData={tasksData.data || []}
        updateTasks={BulkUpdateTasks}
      />
    </div>
  );
};

export default Spreadsheet;
