"use client"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"

import { ColumnDef, FilterFn } from "@tanstack/react-table"
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react"

import { format } from "date-fns"

import { Actions } from "./actions"

type InventoryItem = {
    id: string;
    quantity: number;
    price: number;
    date: Date;
    product: string;
    type: "income" | "outcome";
    dashboardId: string
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const multiSelectFilter: FilterFn<any> = (row, columnId, filterValue) => {
    const filterArray = Array.isArray(filterValue)
        ? filterValue
        : filterValue
            ? [filterValue]
            : [];

    if (filterArray.length === 0) return true;

    const cellValue = row.getValue(columnId);
    return filterArray.includes(cellValue);
};

export const columns: ColumnDef<InventoryItem>[] = [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                }
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "product",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Product
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        }
    },
    {
        accessorKey: "quantity",
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id))
        },
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Quantity
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        }
    },
    {
        accessorKey: "price",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Price
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            const data = row.original;
            return data.type === "income" ? (
                <span className="text-blue-600 flex items-center gap-1">
                    <ArrowDown className="size-4 text-green-500" />
                    {data.price} DH <span className="text-xs text-gray-500">(Cost)</span>
                </span>
            ) : (
                <span className="text-orange-600 flex items-center flex-wrap gap-1">
                    <ArrowUp className="size-4 text-red-500" />
                    {data.price} DH <span className="text-xs text-gray-500">(Selling)</span>
                </span>
            );
        }
    },
    {
        accessorKey: "date",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Date
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {

            const date = row.getValue("date") as Date;

            return (
                <span>
                    {format(date, "dd MMM, yyyy")}
                </span>
            )
        }
    },
    {
        accessorKey: "type",
        filterFn: multiSelectFilter,
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Type
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        }, cell: ({ getValue }) => {
            return getValue() === "income"
                ? <span className="text-green-600">Income</span>
                : <span className="text-red-600">Outcome</span>;
        }
    },
    {
        id: "actions",
        cell: ({ row }) => <Actions id={row.original.id} dashboardId={row.original.dashboardId} type={row.original.type} />
    }
]