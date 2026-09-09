"use client";

import { DataCalendar } from "@/features/calendar/data-calendar";
import { useGetAllMatters } from "@/hooks/useMatterHook";

import { Skeleton } from "@/components/ui/skeleton"; // Shadcn component
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const CaseCalendar = () => {
  const { data: caseData, isLoading, isError, error } = useGetAllMatters();

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
    <div>
      <DataCalendar tasksData={caseData?.data || []} />
    </div>
  );
};

export default CaseCalendar;
