import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
  ColumnDef,
} from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { SaleFeatures } from "../../utils/utils";
import "./DataTable.css";

interface DataTableProps {
  data: SaleFeatures[];
}

export default function DataTable({ data }: DataTableProps) {
  const [globalFilter, setGlobalFilter] = useState("");

  // Define columns
  const columns: ColumnDef<SaleFeatures>[] = [
    {
      accessorKey: "order_id",
      header: "Order ID",
      cell: ({ row }) => <div>{row.getValue("order_id")}</div>,
    },
    {
      accessorKey: "customer_name",
      header: "Customer",
      cell: ({ row }) => <div>{row.getValue("customer_name")}</div>,
    },
    {
      accessorKey: "product_name",
      header: "Product",
      cell: ({ row }) => <div>{row.getValue("product_name")}</div>,
    },
    {
      accessorKey: "category",
      header: "Category",
      cell: ({ row }) => <div>{row.getValue("category")}</div>,
    },
    {
      accessorKey: "region",
      header: "Region",
      cell: ({ row }) => <div>{row.getValue("region")}</div>,
    },
    {
      accessorKey: "sales",
      header: "Sales",
      cell: ({ row }) => (
        <div>${(row.getValue("sales") as number).toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
      ),
    },
    {
      accessorKey: "profit",
      header: "Profit",
      cell: ({ row }) => {
        const profit = row.getValue("profit") as number;
        return (
            <div className={profit >= 0 ? "text-green-600 dark:text-green-500" : "text-red-600 dark:text-red-500"}>
            ${profit.toLocaleString(undefined, { maximumFractionDigits: 2 })}
            </div>
        );
    },
    },
    {
      accessorKey: "order_date",
      header: "Order Date",
      cell: ({ row }) => (
        <div>{new Date(row.getValue("order_date")).toLocaleDateString()}</div>
      ),
    },
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: { pageSize: 10 },
    },
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
  });

  return (
    <Card className="data-table-card max-w-7xl mx-auto">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-slate-900 dark:text-slate-100">
          Transaction History
        </CardTitle>
        <div className="flex items-center space-x-2">
          <Input
            placeholder="Search orders..."
            value={globalFilter ?? ""}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="max-w-sm border-slate-200 dark:border-slate-700"
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="border-slate-200 dark:border-slate-700">
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      className="text-slate-600 dark:text-slate-400"
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      {header.isPlaceholder ? null : (
                        <div className="flex items-center space-x-1">
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          {{
                            asc: "↑",
                            desc: "↓",
                          }[header.column.getIsSorted() as string] ?? null}
                        </div>
                      )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className="border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="text-slate-900 dark:text-slate-100">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-slate-600 dark:text-slate-400">
            Showing {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} to{" "}
            {Math.min(
              (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
              table.getRowCount()
            )}{" "}
            of {table.getRowCount()} entries
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400"
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400"
            >
              Next
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}