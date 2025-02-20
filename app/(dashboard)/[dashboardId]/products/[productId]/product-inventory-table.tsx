"use client"
import toast from "react-hot-toast"

import { DataTable } from "@/components/data-table"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"

import { columns } from "./columns"

import { InventoryProductItem } from "@/features/products/api/use-get-product"
import { useBulkDeleteInventories } from "@/features/inventories/api/use-bulkdelete-inventory"

import { useDashboardId } from "@/hooks/use-dashboard-id"
import { BarChart3, DollarSign, Loader2, Package } from "lucide-react"

type Props = {
    currentQuantity: number;
    inventories: InventoryProductItem[];
    isLoading: boolean;
}

export const ProductInventoryTable = ({
    currentQuantity,
    inventories,
    isLoading
}: Props) => {
    const dashboardId = useDashboardId()

    const deleteInventories = useBulkDeleteInventories(dashboardId)


    const isDisabled = isLoading || deleteInventories.isPending;

    const totalCostsPrice = inventories
        .filter(item => item.type === "income")
        .reduce((acc, item) => acc + item.price * item.quantity, 0);
    const totalSellingsPrice = inventories
        .filter(item => item.type === "outcome")
        .reduce((acc, item) => acc + item.price * item.quantity, 0);

    if (isLoading) {
        return (
            <div className="mx-auto w-full px-4 md:px-6 py-4">
                <div className="flex items-center justify-between mb-12 gap-3">
                    <Skeleton className="h-8 w-48" />
                </div>
                <div className="w-full flex items-center justify-center py-4">
                    <Loader2 className="size-6 text-slate-300 animate-spin" />
                </div>
            </div>
        )
    }

    return (
        <>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                <Card className="bg-blue-100/50 col-span-2 sm:col-auto rounded-lg">
                    <CardContent className="p-4 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Available Quantity</p>
                            <p className="text-lg font-bold text-blue-800">{currentQuantity}</p>
                        </div>
                        <Package className="h-6 w-6 text-blue-600" />
                    </CardContent>
                </Card>
                <Card className="bg-green-100/50 rounded-lg">
                    <CardContent className="p-4 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Total Costs Price</p>
                            <p className="text-lg font-bold text-green-800">${totalCostsPrice}</p>
                        </div>
                        <DollarSign className="h-6 w-6 text-green-600" />
                    </CardContent>
                </Card>
                <Card className="bg-yellow-100/50 rounded-lg">
                    <CardContent className="p-4 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Total Sellings Price</p>
                            <p className="text-lg font-bold text-yellow-800">${totalSellingsPrice}</p>
                        </div>
                        <BarChart3 className="h-6 w-6 text-yellow-600" />
                    </CardContent>
                </Card>
            </div>
            <DataTable
                columns={columns}
                data={inventories}
                onDelete={(row) => {
                    const ids = row.map((r) => r.original.id);
                    toast.promise(
                        deleteInventories.mutateAsync({ ids }),
                        {
                            loading: "Deleting inventories...",
                            success: "Inventories deleted successfully",
                            error: "Failed to delete inventories",
                        }
                    );
                }}
                facetedFilters={[
                    {
                        options: [{label: "income"}, {label: "outcome"}],
                        facetedFilterKey: 'type',
                        facetedFilterTitle: 'Type',
                    }
                ]}
                disabled={isDisabled}
            />
        </>
    )
}
