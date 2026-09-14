"use client";

import * as React from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type CellContext,
  type ColumnDef,
  type ColumnFiltersState,
  type RowSelectionState,
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { FiEdit3 } from "react-icons/fi";
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
import {
  priorities,
  statuses,
} from "@/app/(workspace)/tasks/[taskid]/spreadsheet/data";
import { TaskActionBtn } from "../actionBtn/taskActionBtn";
import { TaskUserGroup } from "../avatar/taskUserGroup";
import { DateAlert } from "../date/dateAlert";
import { Task } from "../tasks/types";

// --- Module Augmentation for TanStack Table Meta ---
declare module "@tanstack/react-table" {
  interface TableMeta<TData extends Record<string, any>> {
    isBulkEditing?: boolean;
    editingRows?: Record<string, boolean>;
    updateData?: (
      rowIndex: number,
      columnId: keyof TData,
      value: unknown
    ) => void;
    toggleRowEditing?: (rowId: string) => void;
  }
}

export type ActionComponentProps = {
  rowData: Task;
  edit: () => void;
  isEditing: boolean;
  taskId: string | number;
};

function formatStatus(status: string): string {
  if (!status) return "";
  if (status === status.toLowerCase()) {
    return status;
  }
  const lowerWithSpaces = status.replace(/_/g, " ").toLowerCase();
  return lowerWithSpaces.charAt(0).toUpperCase() + lowerWithSpaces.slice(1);
}

// --- Editable Cell Component ---
const EditableCell = ({
  getValue,
  row,
  column,
  table,
}: CellContext<Task, unknown>) => {
  const initialValue = (getValue() as string) ?? "";
  const [value, setValue] = React.useState<string>(initialValue);

  React.useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const onBlur = () => {
    table.options.meta?.updateData?.(row.index, column.id as keyof Task, value);
  };

  const isEditing =
    table.options.meta?.isBulkEditing ||
    table.options.meta?.editingRows?.[row.id];

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

// --- Column Definitions Generator ---
export const getColumns = (
  ActionComponent: React.ComponentType<ActionComponentProps>
): ColumnDef<Task>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        className="ml-2"
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
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Project Name
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: EditableCell,
  },
  {
    accessorKey: "eventType",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Event Type
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: EditableCell,
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Status
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row, table }) => {
      const status = (row.getValue("status") as string) ?? "";
      const isEditing =
        table.options.meta?.isBulkEditing ||
        table.options.meta?.editingRows?.[row.id];

      if (isEditing) {
        return (
          <Select
            value={status}
            onValueChange={(value: string) =>
              table.options.meta?.updateData?.(row.index, "status", value)
            }
          >
            <SelectTrigger id="checkout-exp-month-ts6" className="h-8">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="DONE">Done</SelectItem>
              <SelectItem value="IN_PROGRESS">inprogress</SelectItem>
              <SelectItem value="IN_REVIEW">In review</SelectItem>
              <SelectItem value="TODO">Todo</SelectItem>
            </SelectContent>
          </Select>
        );
      }

      return (
        <div
          className={cn("px-3 py-1 rounded-sm font-medium w-fit capitalize", {
            "bg-[#d9fcf4] text-[#03a24e]": status === "DONE",
            "bg-[#E2F1FF] text-[#006bc9] dark:bg-[#006bc9] dark:text-[#E2F1FF]":
              status === "IN_PROGRESS",
            "bg-[#E4C2FF] text-[#860ee8]": status === "IN_REVIEW",
            "bg-[#fff4d3] text-[#e49101]": status === "TODO",
          })}
        >
          {formatStatus(status)}
        </div>
      );
    },
  },
  {
    accessorKey: "endDate",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Due Date
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const date = row.getValue("endDate") as string;
      const dueDate = new Date(date);
      return <DateAlert date={dueDate} />;
    },
  },
  {
    accessorKey: "priority",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Priority
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    filterFn: "arrIncludesSome",
    cell: ({ row, table }) => {
      const priority = (row.getValue("priority") as string) ?? "";
      const isEditing =
        table.options.meta?.isBulkEditing ||
        table.options.meta?.editingRows?.[row.id];

      if (isEditing) {
        return (
          <Select
            value={priority}
            onValueChange={(val: string) =>
              table.options.meta?.updateData?.(row.index, "priority", val)
            }
          >
            <SelectTrigger className="h-8">
              <SelectValue placeholder="Select priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>
        );
      }

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
    header: "Assignee",
    id: "Assignee",
    cell: ({ row, table }) => {
      const isEditing =
        !!table.options.meta?.isBulkEditing ||
        !!table.options.meta?.editingRows?.[row.id];

      return (
        <TaskUserGroup
          isEditing={isEditing}
          className={"bg-blue-100 outline-blue-500"}
          row={row}
          table={table}
        />
      );
    },
  },
  {
    id: "actions",
    cell: ({ row, table }) => {
      const isEditing = !!table.options.meta?.editingRows?.[row.id];

      return (
        <ActionComponent
          rowData={row.original}
          edit={() => table.options.meta?.toggleRowEditing?.(row.id)}
          isEditing={isEditing}
          taskId={(row.original as any)._id ?? row.original._id}
        />
      );
    },
  },
];

interface InitialDataProps {
  ActionDropdown: any;
  initialData: Task[];
  updateTasks: (data: Task[]) => void;
}

export function TaskDataTable({
  initialData,
  updateTasks,
  ActionDropdown,
}: InitialDataProps) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({});
  const [tableData, setTableData] = useState<Task[]>(initialData ?? []);

  React.useEffect(() => {
    setTableData(initialData ?? []);
  }, [initialData]);

  const [isBulkEditing, setIsBulkEditing] = useState(false);
  const [editingRows, setEditingRows] = useState<Record<string, boolean>>({});

  const columns = React.useMemo(
    () => getColumns(ActionDropdown),
    [ActionDropdown]
  );

  const table = useReactTable({
    data: tableData,
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
    meta: {
      isBulkEditing,
      editingRows,
      updateData: (rowIndex: number, columnId: keyof Task, value: unknown) => {
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
            placeholder="Search task name..."
            value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
            onChange={(e) =>
              table.getColumn("title")?.setFilterValue(e.target.value)
            }
            className="max-w-sm"
          />
          {table.getColumn("status") && (
            <TableFilter
              column={table.getColumn("status")}
              title="Status"
              options={statuses}
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
                  placeholder={`${table.getState().pagination.pageSize}`}
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
