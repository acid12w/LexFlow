"use client";

import { ListTable } from "@/client/features/table/ListTable";
import { TaskDataTable } from "@/client/features/table/TasksDataTable";

const Userdashboard = () => {
  return (
    <>
      <div className="px-2">
        <ListTable />
      </div>
    </>
  );
};

export default Userdashboard;
