"use client";

import * as React from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
} from "@tanstack/react-table";
import {
  ArrowUpDown,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  MoreHorizontal,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { FiEdit3 } from "react-icons/fi";
import { MdOutlineCloudUpload } from "react-icons/md";
import { cn } from "@/lib/utils";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TableFilter } from "./TableFilter";
import { priorities } from "@/app/(workspace)/tasks/[taskid]/spreadsheet/data";
import {
  MATTER_STATUS,
  MATTER_STATUS_LABELS,
  formatTaskProgress,
  getTaskProgressPercent,
  matterStatusClassName,
} from "@/lib/matter-health";
import { UserGroup } from "../avatar/userGroup";
import { DateAlert } from "../date/dateAlert";

const matterStatusFilterOptions = Object.values(MATTER_STATUS).map((value) => ({
  label: MATTER_STATUS_LABELS[value],
  value,
}));

// export default function DynamicEditableTable() {
//   const [data, setData] = useState([
//     { id: "1", name: "Project Alpha", status: "In Progress" },
//     { id: "2", name: "Project Beta", status: "Complete" },
//   ]);
// }

export type Matter = {
  _id?: string;
  id?: number;
  title: string;
  practiceArea: string;
  status: string;
  taskCount?: number;
  completedTaskCount?: number;
  endDate?: string;
  assignedTo: string;
  assignedBy: string;
  priority: "low" | "medium" | "high";
};

// --- Editable Cell Component ---
const EditableCell = ({ getValue, row, column, table }: any) => {
  const initialValue = getValue?.() ?? "";

  const [value, setValue] = React.useState(initialValue);

  const onBlur = () => {
    table.options.meta?.updateData(row.index, column.id, value);
  };

  // Check if this specific cell should be in edit mode
  const isEditing =
    table.options.meta?.isBulkEditing ||
    table.options.meta?.editingRows[row.id];

  if (isEditing) {
    return (
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={onBlur}
        className="h-8 w-full"
      />
    );
  }

  return <span>{value}</span>;
};

// --- Column Definitions ---
export const getColumns = (
  ActionComponent: React.ComponentType<any>
): ColumnDef<Matter>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
      />
    ),
  },
  {
    accessorKey: "title",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Project Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: EditableCell,
  },
  {
    accessorKey: "practiceArea",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Practice area
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: EditableCell,
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Case health
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const status = (row.getValue("status") as string) ?? "NOT_STARTED";
      const label =
        MATTER_STATUS_LABELS[status as keyof typeof MATTER_STATUS_LABELS] ??
        status;

      return (
        <div
          className={cn(
            "px-3 py-1 rounded-sm font-medium w-fit",
            matterStatusClassName(status)
          )}
        >
          {label}
        </div>
      );
    },
  },
  {
    id: "progress",
    accessorFn: (row) =>
      getTaskProgressPercent(row.completedTaskCount, row.taskCount),
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Progress
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const completed = row.original.completedTaskCount ?? 0;
      const total = row.original.taskCount ?? 0;
      const percent = getTaskProgressPercent(completed, total);

      return (
        <div className="flex min-w-[160px] flex-col gap-2">
          {percent <= 0 ? "" : <Progress value={percent} className="h-2" />}
          <span className="text-xs text-muted-foreground">
            {formatTaskProgress(completed, total)}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "endDate",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Due Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const date = row.getValue("endDate") as string;
      const endDate = new Date(date);

      return <DateAlert date={endDate} />;
    },
  },
  {
    accessorKey: "priority",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Priority
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    filterFn: "arrIncludesSome",
    cell: ({ row, table }) => {
      const priority = row.getValue("priority") as string;

      const isEditing =
        !!table.options.meta?.isBulkEditing ||
        !!table.options.meta?.editingRows?.[row.id];

      return (
        <div
          className={cn("px-3 py-1 rounded-sm font-medium w-fit capitalize", {
            "bg-[#ffbfbf] text-[#ff3838] dark:bg-[#ff3838] dark:text-[#ffe0e0]":
              priority === "high",
            "bg-[#E4C2FF] text-[#860ee8]": priority === "medium",
            "bg-[#e3e5e4] text-[#5d5d5d]": priority === "low",
          })}
        >
          {priority}
        </div>
      );
    },
  },
  {
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Assignee
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    id: "Asignee",
    cell: ({ row, table }) => {
      return (
        <UserGroup
          isEditing={
            !!table.options.meta?.isBulkEditing ||
            !!table.options.meta?.editingRows?.[row.id]
          }
          table={table}
          className={"bg-blue-100 outline-blue-500"}
          row={row}
        />
      );
    },
  },
  {
    id: "actions",
    cell: ({ row, table }) => {
      const isEditing =
        !!table.options.meta?.isBulkEditing ||
        !!table.options.meta?.editingRows?.[row.id];

      return (
        <ActionComponent
          rowData={row.original}
          edit={() => table.options.meta?.toggleRowEditing(row.id)}
          isEditing={isEditing}
          taskId={row.original._id}
        />
      );
    },
  },
];

interface initialDataProps {
  ActionDropdown: React.ComponentType<any>;
  initialData: Matter[];
  updateTasks: (data) => void;
}

export function CaseDataTable({
  initialData,
  updateTasks,
  ActionDropdown,
}: initialDataProps) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );

  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [tableData, setTableData] = useState(initialData);

  React.useEffect(() => {
    setTableData(initialData);
  }, [initialData]);

  const [isBulkEditing, setIsBulkEditing] = useState(false);
  const [editingRows, setEditingRows] = useState<Record<string, boolean>>({});

  const columns = React.useMemo(
    () => getColumns(ActionDropdown),
    [ActionDropdown]
  );

  const table = useReactTable({
    data: tableData ?? [],
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    // Custom Meta for editing logic
    meta: {
      isBulkEditing,
      editingRows,
      updateData: (rowIndex: number, columnId: string, value: []) => {
        if (columnId === "status") return;
        setTableData((prev) =>
          prev.map((row, index) =>
            index === rowIndex ? { ...row, [columnId]: value } : row
          )
        );
      },

      toggleRowEditing: (rowId: string) => {
        setEditingRows((prev) => ({ ...prev, [rowId]: !prev[rowId] }));
      },
    },
  });

  return (
    <div className="w-full">
      <div className="flex justify-between items-center py-4">
        <div className="flex gap-4">
          <Input
            placeholder="Search matter name..."
            value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
            onChange={(title) =>
              table.getColumn("title")?.setFilterValue(title.target.value)
            }
            className="max-w-sm"
          />
          {table.getColumn("status") && (
            <TableFilter
              column={table.getColumn("status")}
              title="Status"
              options={matterStatusFilterOptions}
            />
          )}
          {table.getColumn("priority") && (
            <TableFilter
              column={table.getColumn("priority")}
              title="Priority"
              options={priorities}
            />
          )}
        </div>
        <div className="flex gap-4">
          <div className="flex gap-2 items-center hover:text-blue-500">
            <Button
              variant="outline"
              className="flex gap-2"
              onClick={() => {
                if (isBulkEditing) {
                  updateTasks(tableData);
                }

                setIsBulkEditing(!isBulkEditing);
              }}
            >
              {isBulkEditing ? (
                <Check className="w-4 h-4 text-green-500" />
              ) : (
                <FiEdit3 />
              )}
              {isBulkEditing ? "Save All" : "Edit All Cells"}
            </Button>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                View <ChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          {initialData.length > 0 ? (
            <TableBody>
              {table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          ) : (
            <TableBody>
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            </TableBody>
          )}
        </Table>
      </div>
      <div className="flex items-center justify-between px-2 mt-4">
        <div className="text-muted-foreground flex-1 text-sm">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="flex items-center space-x-6 lg:space-x-8">
          <div className="flex items-center space-x-2">
            <p className="text-sm font-medium">Rows per page</p>
            <Select
              value={`${table.getState().pagination.pageSize}`}
              onValueChange={(value) => {
                table.setPageSize(Number(value));
              }}
            >
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue
                  placeholder={table.getState().pagination.pageSize}
                />
              </SelectTrigger>
              <SelectContent side="top">
                {[2, 10, 20, 25, 30, 40, 50].map((pageSize) => (
                  <SelectItem key={pageSize} value={`${pageSize}`}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex w-[100px] items-center justify-center text-sm font-medium">
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="icon"
              className="hidden size-8 lg:flex"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Go to first page</span>
              <ChevronsLeft />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="size-8"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Go to previous page</span>
              <ChevronLeft />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="size-8"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Go to next page</span>
              <ChevronRight />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="hidden size-8 lg:flex"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Go to last page</span>
              <ChevronsRight />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
