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
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
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
import {
  priorities,
  statuses,
} from "@/app/(workspace)/tasks/[taskid]/spreadsheet/data";
import { UserGroup } from "../avatar/userGroup";
import { TaskActionBtn } from "../actionBtn/taskActionBtn";

// export default function DynamicEditableTable() {
//   const [data, setData] = useState([
//     { id: "1", name: "Project Alpha", status: "In Progress" },
//     { id: "2", name: "Project Beta", status: "Complete" },
//   ]);
// }

const initialData: Matter[] = [
  {
    id: 1,
    name: "Johnson v. Smith – Initial Filing",
    eventType: "Court Filing",
    status: "complete",
    priority: "high",
    dueDate: "2025-01-15",
    assignedTo: "Maria Lewis",
    assignedBy: "Diane Leveridge",
  },
  {
    id: 2,
    name: "Johnson v. Smith – Initial Filing",
    eventType: "Research",
    status: "inprogress",
    priority: "medium",
    dueDate: "2025-01-22",
    assignedTo: "Kevin Brown",
    assignedBy: "Diane Leveridge",
  },
  {
    id: 3,
    name: "Johnson v. Smith – Initial Filing",
    eventType: "Client Intake",
    status: "not started",
    priority: "medium",
    dueDate: "2025-01-20",
    assignedTo: "Sarah Grant",
    assignedBy: "Diane Leveridge",
  },
  {
    id: 4,
    name: "Contract Review – ABC Holdings",
    eventType: "Document Review",
    status: "inprogress",
    priority: "low",
    dueDate: "2025-01-25",
    assignedTo: "Andre Thompson",
    assignedBy: "Michael Harris",
  },
  {
    id: 5,
    name: "Contract Review – ABC Holdings",
    eventType: "Hearing",
    status: "complete",
    priority: "high",
    dueDate: "2025-01-10",
    assignedTo: "Michael Harris",
    assignedBy: "Diane Leveridge",
  },
  {
    id: 6,
    name: "Contract Review – ABC Holdings",
    eventType: "Drafting",
    status: "not started",
    priority: "low",
    dueDate: "2025-01-28",
    assignedTo: "Rachel Moore",
    assignedBy: "Michael Harris",
  },
  {
    id: 7,
    name: "Case Preparation – Brown v. Brown",
    eventType: "Preparation",
    status: "inprogress",
    priority: "high",
    dueDate: "2025-02-02",
    assignedTo: "Kevin Brown",
    assignedBy: "Diane Leveridge",
  },
  {
    id: 8,
    name: "Case Preparation – Brown v. Brown",
    eventType: "Evidence Review",
    status: "not started",
    priority: "medium",
    dueDate: "2025-01-30",
    assignedTo: "Sarah Grant",
    assignedBy: "Diane Leveridge",
  },
];

export type Matter = {
  id: number;
  name: string;
  eventType: string;
  status: "inprogress" | "not started" | "complete";
  dueDate: string;
  assignedTo: string;
  assignedBy: string;
  priority: "low" | "medium" | "high";
};

// --- Editable Cell Component ---
const EditableCell = ({ getValue, row, column, table }: any) => {
  const initialValue = getValue();
  const [value, setValue] = React.useState(initialValue);

  // Sync local state with data
  React.useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

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
export const columns: ColumnDef<Matter>[] = [
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
    accessorKey: "name",
    header: "Project Name",
    cell: EditableCell,
  },
  {
    accessorKey: "eventType",
    header: "Event Type",
    cell: EditableCell,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row, table }) => {
      const status = row.getValue("status") as string;
      const isEditing =
        table.options.meta?.isBulkEditing ||
        table.options.meta?.editingRows[row.id];

      if (isEditing) {
        return (
          <Select
            value={status}
            // 1. Use onValueChange instead of onChange
            // 2. The argument is the string value, not an event object
            onValueChange={(value) =>
              table.options.meta?.updateData(row.index, "status", value)
            }
          >
            <SelectTrigger id="checkout-exp-month-ts6" className="h-8">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="complete">complete</SelectItem>
              <SelectItem value="inprogress">inprogress</SelectItem>
              <SelectItem value="not started">not started</SelectItem>
            </SelectContent>
          </Select>
        );
      }

      return (
        <div
          className={cn("px-3 py-1 rounded-sm font-medium w-fit capitalize", {
            "bg-[#d9fcf4] text-[#03a24e]": status === "complete",
            "bg-[#E2F1FF] text-[#006bc9]": status === "inprogress",
            "bg-[#fff4d3] text-[#e49101]": status === "not started",
          })}
        >
          {status}
        </div>
      );
    },
  },
  {
    accessorKey: "dueDate",
    header: "Due Date",
    cell: EditableCell,
  },
  {
    accessorKey: "priority",
    header: "Priority",
    filterFn: "arrIncludesSome",
    cell: ({ row, table }) => {
      const priority = row.getValue("priority") as string;
      const isEditing =
        table.options.meta?.isBulkEditing ||
        table.options.meta?.editingRows[row.id];

      if (isEditing) {
        return (
          <Select
            value={priority}
            onValueChange={(value) =>
              table.options.meta?.updateData(row.index, "priority", value)
            }
          >
            <SelectTrigger id="checkout-exp-month-ts6" className="h-8">
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
            "bg-[#ffbfbf] text-[#ff3838]": priority === "high",
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
    id: "Asignee",
    cell: ({ row, table }) => {
      const $id = row.id;
      const isEditing = table.options.meta?.editingRows[row.id];
      return <UserGroup className={"bg-blue-100 outline-blue-500"} />;
    },
  },
  {
    id: "actions",
    cell: ({ row, table }) => {
      const isEditing = table.options.meta?.editingRows[row.id];
      return (
        <TaskActionBtn
          edit={() => table.options.meta?.toggleRowEditing(row.id)}
          isEditing={isEditing}
        />
      );
    },
  },
];

export function ListTable() {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const [tableData, setTableData] = useState<Matter[]>(initialData);
  const [isBulkEditing, setIsBulkEditing] = useState(false);
  const [editingRows, setEditingRows] = useState<Record<string, boolean>>({});

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
    // Custom Meta for editing logic
    meta: {
      isBulkEditing,
      editingRows,
      updateData: (rowIndex: number, columnId: string, value: any) => {
        console.log(value);
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

  const boards = [
    // TaskStatus.BACKLOG,
    "Contract Review – ABC Holdings",
    "Johnson v. Smith – Initial Filing",
  ];

  return (
    <div className="w-full">
      <div className="flex justify-between items-center py-4">
        <div className="flex gap-4">
          <Input
            placeholder="Search matter name..."
            value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
            onChange={(name) =>
              table.getColumn("name")?.setFilterValue(name.target.value)
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
              onClick={() => setIsBulkEditing(!isBulkEditing)}
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

          {boards.map((matterGroup) => (
            <TableBody key={matterGroup} className="border-t-2">
              {/* Header Row for the Group */}
              <TableRow className="bg-muted/50 font-bold">
                <TableCell colSpan={columns.length}>{matterGroup}</TableCell>
              </TableRow>

              {/* Actual Data Rows */}
              {table
                .getRowModel()
                .rows.filter((row) => row.original.name === matterGroup)
                .map((row) => (
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
          ))}
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
