"use client";

import { Skeleton } from "@/components/ui/skeleton"; // Shadcn component
import { useBulkUpdateTasks } from "@/hooks/task";
import { UserManagmentActionBtn } from "@/features/actionBtn/userManagmentActionBtn";
import { UserDataTable } from "@/features/table/userDataTable";
import { useGetTeamMember } from "@/hooks/useAuthHook";

const Spreadsheet = () => {
  //Get Firm users
  const { data: initalData, isLoading } = useGetTeamMember();

  const { mutate: BulkUpdateTasks } = useBulkUpdateTasks();

  // 1. Destructure useful states
  // const { data, isLoading, isError, error } = useGetAllTasksByCaseId(caseId);

  // 2. Professional Loading State
  if (isLoading) {
    return (
      <div className="space-y-3 px-2">
        <Skeleton className="h-10 w-full" /> {/* Search bar skeleton */}
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
    <div className="px-2 w-[90%]">
      {/* 4. Ensure your table reacts to live data, not just 'initial' data */}
      <UserDataTable
        ActionDropdown={UserManagmentActionBtn}
        initialData={initalData?.data || []}
        updateTasks={BulkUpdateTasks}
      />
    </div>
  );
};

export default Spreadsheet;
