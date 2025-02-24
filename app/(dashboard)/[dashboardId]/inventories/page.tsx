"use client"

import toast from 'react-hot-toast'
import { columns } from './columns'

import { DataTable } from '@/components/data-table'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'

import { useGetInventories } from '@/features/inventories/api/use-get-inventories'
import { useBulkDeleteInventories } from '@/features/inventories/api/use-bulkdelete-inventory'

import { useDashboardId } from '@/hooks/use-dashboard-id'
import { useNewInventory } from '@/features/inventories/hook/use-new-inventory-dialog'

import { Loader2, MinusCircle, PlusCircle } from 'lucide-react'


const InventoriesPage = () => {

    const dashboardId = useDashboardId()
    const { onOpen } = useNewInventory()

    const { data: inventories = [], isLoading: inventoriesLoading, isError } = useGetInventories(dashboardId)

    const deleteInventories = useBulkDeleteInventories(dashboardId)

    const isDisabled = inventoriesLoading || deleteInventories.isPending;

    if (inventoriesLoading) {
        return (
            <div className="mx-auto w-full px-4 md:px-6 py-4">
                <div className="flex items-center justify-between mb-12 gap-3">
                    <Skeleton className="h-8 w-48" />
                    <Skeleton className="h-8 w-48" />
                </div>
                <div className="h-[400px] w-full flex items-center justify-center py-4">
                    <Loader2 className="size-6 text-slate-300 animate-spin" />
                </div>
            </div>
        )
    }

    if (isError) {
        return (
            <div className="mx-auto w-full px-4 md:px-6 py-4 text-center text-red-500">
                Failed to load inventories. Please try again.
            </div>
        )
    }

    return (
        <div className="mx-auto w-full px-4 md:px-6 py-4">
            <div className="flex items-center justify-between mb-8 flex-col md:flex-row gap-4">
                <div className='flex flex-col gap-2'>
                    <h1 className="text-xl line-clamp-1 font-semibold tracking-tight md:p-0">
                        Inventories Page
                    </h1>
                    <div className="text-sm text-gray-500 mb-4 md:max-w-xl">
                        You can manage and view all inventory records associated with your dashboard.
                        This includes adding new inventory entries, deleting existing ones, and navigating
                        to the detailed view of each inventory item for further editing.
                    </div>
                </div>
                <div className='flex items-center gap-2 w-full md:w-fit'>
                    <Button
                        className={"w-full md:w-fit income" && "bg-green-600 hover:bg-green-700 text-white"}
                        onClick={() => onOpen("income")}
                    >
                        <PlusCircle />
                        Stock Income
                    </Button>
                    <Button
                        className={"w-full md:w-fit outcome" && "bg-red-600 hover:bg-red-700 text-white"}
                        onClick={() => onOpen("outcome")}

                    >
                        <MinusCircle />
                        Stock Outcome
                    </Button>
                </div>
            </div>
            <DataTable
                columns={columns}
                data={inventories}
                filterKey="product"
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
                        options: [{ label: "income" }, { label: "outcome" }],
                        facetedFilterKey: 'type',
                        facetedFilterTitle: 'Type',
                    }
                ]}
                disabled={isDisabled}
            />
        </div>
    )
}

export default InventoriesPage