"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"

import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"
import { $Enums } from "@prisma/client"

import { ProductStatusesWithLabel } from "@/constants"

import { Actions } from "./actions"
import { CategoryColumn } from "./category-column"

type ResponseType = {
    id: string;
    dashboardId: string;
    name: string;
    status: $Enums.ProductStatus;
    sellingPrice: number | null;
    category: string | null;
    currentStock: number | null;
};

export const columns: ColumnDef<ResponseType>[] = [
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
        accessorKey: "name",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Name
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            return (
                <Link
                    href={`/${row.original.dashboardId}/products/${row.original.id}`}
                    className="text-blue-600 hover:text-blue-800 hover:underline transition-colors duration-200"
                >
                    {row.original.name}
                </Link>
            )
        }
    },
    {
        accessorKey: "category",
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id))
        },
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Category
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {

            return (
                <CategoryColumn
                    category={row.original.category}
                />
            )
        }
    },
    {
        accessorKey: "sellingPrice",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Selling Price
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
    },
    {
        accessorKey: "currentStock",
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
            )
        },
        cell: ({ row }) => {
            const status = ProductStatusesWithLabel.find(s => s.value === row.original.status);

            return (
                <div className="flex gap-2 items-center">
                    <div className={`size-3 rounded-full ${status?.color || "bg-gray-500"}`} />
                    {status?.label || "Unknown"}
                </div>
            );
        }
    },
    {
        id: "actions",
        cell: ({ row }) => <Actions id={row.original.id} dashboardId={row.original.dashboardId} />
    }
]