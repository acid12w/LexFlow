"use client";

import { useState } from "react";

import FirmRegistration from "./firm/page";
import WorkspaceRegistration from "./workspace/page";
import { useCreateFirm } from "@/hooks/useAuthHook";

const RegisterPage = () => {
  const [taskSwitcher, setTaskSwitcher] = useState("Signin");
  const { mutateAsync } = useCreateFirm();

  // if (
  //   isTokenInvalid ||
  //   invitation.data.response?.status === "ACCEPTED" ||
  //   !invitation
  // ) {
  //   return (
  //     <main className="flex min-h-screen items-center justify-center p-4 text-center">
  //       <div className="max-w-md space-y-4">
  //         <h2 className="text-xl font-semibold text-destructive">
  //           Invalid or Expired Link
  //         </h2>
  //         <p className="text-sm text-muted-foreground">
  //           This activation link has already been used or has expired. Please
  //           contact your administrator to request a new invitation.
  //         </p>
  //       </div>
  //     </main>
  //   );
  // }

  return (
    <main className="flex flex-col items-center justify-center h-screen">
      <FirmRegistration createFirm={mutateAsync} />
      {/* <WorkspaceRegistration /> */}
      {/* {taskSwitcher === "Signin" ? (
        <Signin tasksData={tasksData?.data || []} isLoading={isLoading} />
      ) : taskSwitcher === "kanban" ? (
        <KanbanBoard tasksData={tasksData?.data || []} isLoading={isLoading} />
      ) : (
        <Calendar tasksData={tasksData?.data || []} isLoading={isLoading} />
      )} */}
    </main>
  );
};

export default RegisterPage;
