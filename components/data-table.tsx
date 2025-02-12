"use client"

import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
    getPaginationRowModel,
    SortingState,
    getSortedRowModel,
    getFilteredRowModel,
    ColumnFiltersState,
    Row
} from "@tanstack/react-table"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Trash } from "lucide-react"
import { useConfirm } from "@/hooks/use-confirm"
import { DataTableFilter } from "./data-table-filter"

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
    filterKey: string
    onDelete: (rows: Row<TData>[]) => void
    disabled?: boolean
    facetedFilter?: {
        facetedFilterKey: string
        options: { label: string }[]
        facetedFilterTitle: string
    }
}

export function DataTable<TData, TValue>({
    columns,
    data,
    filterKey,
    onDelete,
    disabled,
    facetedFilter
}: DataTableProps<TData, TValue>) {
    const [ConfirmDialog, confirm] = useConfirm(
        "Are you sure?",
        "You are about to perform a bulk delete."
    )

    const [sorting, setSorting] = useState<SortingState>([])
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(
        []
    )
    const [rowSelection, setRowSelection] = useState({})


    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            rowSelection,
        },
    })

    return (
        <div>
            <ConfirmDialog />
            <div className="flex flex-wrap py-3 gap-3">
                {facetedFilter && (
                    <DataTableFilter
                        column={table.getColumn(`${facetedFilter?.facetedFilterKey}`)}
                        title={`${facetedFilter?.facetedFilterTitle}`}
                        options={facetedFilter?.options}
                    />
                )}
                <div className="flex items-center justify-between gap-2 w-full">
                    <Input
                        placeholder={`Filter ${filterKey}...`}
                        value={(table.getColumn(`${filterKey}`)?.getFilterValue() as string) ?? ""}
                        onChange={(event) =>
                            table.getColumn(`${filterKey}`)?.setFilterValue(event.target.value)
                        }
                        className="max-w-sm"
                    />
                    {table.getFilteredSelectedRowModel().rows.length > 0 && (
                        <Button
                            size={"sm"}
                            disabled={disabled}
                            variant={"outline"}
                            className="ml-auto font-normal text-xs h-10"
                            onClick={async () => {
                                const ok = await confirm()

                                if (ok) {
                                    onDelete(table.getFilteredSelectedRowModel().rows)
                                    table.resetRowSelection();
                                }
                            }}
                        >
                            <Trash className="size-4" />
                            Delete ({table.getFilteredSelectedRowModel().rows.length})
                        </Button>
                    )}
                </div>
            </div>
            <div className="rounded-md border bg-white">
                <Table>
                    <TableHeader className="bg-gray-100/70">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-end space-x-2 py-4">
                <div className="flex-1 text-sm text-muted-foreground">
                    {table.getFilteredSelectedRowModel().rows.length} of{" "}
                    {table.getFilteredRowModel().rows.length} row(s) selected.
                </div>

                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                >
                    Previous
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                >
                    Next
                </Button>
            </div>
        </div>
    )
}