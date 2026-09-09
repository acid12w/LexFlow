"use client";

import { useGetAllMatters } from "@/hooks/useMatterHook";
import { Skeleton } from "@/components/ui/skeleton"; // Shadcn component
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import { CaseDataTable } from "@/features/table/CaseDataTable";
import { useBulkUpdateCases } from "@/hooks/useMatterHook";
import { CaseActionBtn } from "@/features/actionBtn/caseActionBtn";

const Userdashboard = () => {
  const { data: caseData, isLoading, isError, error } = useGetAllMatters();
  const { mutate: bulkUpdateCase } = useBulkUpdateCases();

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
    <>
      <CaseDataTable
        ActionDropdown={CaseActionBtn}
        initialData={caseData?.data || []}
        updateTasks={bulkUpdateCase}
      />
    </>
  );
};

export default Userdashboard;
