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
  Link2,
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
import { TaskUserGroup } from "../avatar/taskUserGroup";
import { DateAlert } from "../date/dateAlert";
import { NewUserDialog } from "../modal/new-user";
import Link from "next/link";

// export default function DynamicEditrableTable() {
//   const [data, setData] = useState([
//     { id: "1", name: "Project Alpha", status: "In Progress" },
//     { id: "2", name: "Project Beta", status: "Complete" },
//   ]);
// }

export type Matter = {
  id: number;
  title: string;
  eventType: string;
  status: "inprogress" | "not started" | "complete";
  dueDate: string;
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
    accessorKey: "userName",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          User name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: EditableCell,
  },
  {
    accessorKey: "profile.email",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Email
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: EditableCell,
  },

  {
    accessorKey: "role",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Role
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row, table }) => {
      const role = row.getValue("role") as string;
      const isEditing =
        table.options.meta?.isBulkEditing ||
        table.options.meta?.editingRows[row.id];

      if (isEditing) {
        return (
          <Select
            value={role}
            onValueChange={(value) =>
              table.options.meta?.updateData(row.index, "role", value)
            }
          >
            <SelectTrigger id="checkout-exp-month-ts6" className="h-8">
              <SelectValue placeholder="Select role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Admin">Admin</SelectItem>
              <SelectItem value="Attorney">Attorney</SelectItem>
              <SelectItem value="Paralegal">Paralegal</SelectItem>
              <SelectItem value="Secretary">Secretary</SelectItem>
            </SelectContent>
          </Select>
        );
      }

      return <div>{role}</div>;
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          status
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    filterFn: "arrIncludesSome",
    cell: ({ row, table }) => {
      const status = row.getValue("status") as string;

      const isEditing =
        table.options.meta?.isBulkEditing ||
        table.options.meta?.editingRows[row.id];

      return (
        <div
          className={cn("px-3 py-1 rounded-sm font-medium w-fit capitalize", {
            "bg-[#ffbfbf] text-[#ff3838] dark:bg-[#ff3838] dark:text-[#ffe0e0]":
              status === "expired",
            "bg-[#c2e7ff] text-[#0e82e8]": status.toLowerCase() === "pending",
            "bg-[#dbffed] text-[#027945]": status.toLowerCase() === "active",
          })}
        >
          {status.toLowerCase()}
        </div>
      );
    },
  },
  {
    accessorKey: "Link",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Invitation link
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row, table }) => {
      // const verificationToken = row.getValue("verificationToken");

      return (
        <div>
          {/* <Link href={`/join-firm/${verificationToken}`}>
            <Link2 />
          </Link> */}
        </div>
      );
    },
  },

  {
    id: "actions",
    cell: ({ row, table }) => {
      const isEditing = table.options.meta?.editingRows[row.id];

      return (
        <ActionComponent
          rowData={row.original}
          edit={() => table.options.meta?.toggleRowEditing(row.id)}
          isEditing={isEditing}
          userId={row.original._id}
        />
      );
    },
  },
];

interface initialDataProps {
  ActionDropdown: React.ComponentType<any>;
  initialData: Matter[];
  // updateTasks: (data) => void;
}

export function UserDataTable({
  initialData,
  // updateTasks,
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
      updateData: (rowIndex: number, columnId: string, value: any) => {
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
            placeholder="Search name..."
            value={
              (table.getColumn("userName")?.getFilterValue() as string) ?? ""
            }
            onChange={(userName) =>
              table.getColumn("userName")?.setFilterValue(userName.target.value)
            }
            className="max-w-sm"
          />
        </div>
        <div className="flex gap-4">
          <NewUserDialog />
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
          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
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
