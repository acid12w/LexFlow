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
import Link from "next/link";

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
  dueDate?: string;
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
    accessorKey: "firstName",
    header: "First Name",
    cell: EditableCell,
  },
  {
    accessorKey: "lastName",
    header: "Last Name",
    cell: EditableCell,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: EditableCell,
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: EditableCell,
  },
  {
    id: "Client Portal",
    header: "Client Portal",
    cell: ({ row, table }) => {
      return <Link href={`client-portal/${row.original._id}`}>Link</Link>;
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

export function ClientDataTable({
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
      updateData: (rowIndex: number, columnId: string, value: any) => {
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
            value={
              (table.getColumn("firstName")?.getFilterValue() as string) ?? ""
            }
            onChange={(firstName) =>
              table
                .getColumn("firstName")
                ?.setFilterValue(firstName.target.value)
            }
            className="max-w-sm"
          />
        </div>
        <div className="flex gap-4">
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
