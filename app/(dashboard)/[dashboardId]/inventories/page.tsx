"use client"

import { columns } from './columns'

import { DataTable } from '@/components/data-table'
import { Skeleton } from '@/components/ui/skeleton'

import { useGetInventories } from '@/features/inventories/api/use-get-inventories'
import { useBulkDeleteInventories } from '@/features/inventories/api/use-bulkdelete-inventory'

import { useDashboardId } from '@/hooks/use-dashboard-id'

import { Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'


const InventoriesPage = () => {

    const dashboardId = useDashboardId()
    const inventoriesQuery = useGetInventories(dashboardId)
    
    const deleteInventories = useBulkDeleteInventories(dashboardId)
    
    const inventories = inventoriesQuery.data || []
    const isDisabled = inventoriesQuery.isLoading || deleteInventories.isPending;

    const typeOptions = [
        {
            label: "Income"
        },
        {
            label: "Outcome"
        }
    ]

    if (inventoriesQuery.isLoading) {
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

    return (
        <div className="mx-auto w-full px-4 md:px-6 py-4">
            <div className="flex items-center justify-between mb-8 flex-col md:flex-row">
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
                <div className='flex items-center gap-2 flex-wrap w-full md:w-fit'>
                    {/* <AddProductDialog
                        dashboardId={dashboardId}
                        autoUpdateStatus={autoUpdateStatus}
                    /> */}
                    add
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
                disabled={isDisabled}
                facetedFilters={[
                    {
                        options: typeOptions,
                        facetedFilterKey: 'type',
                        facetedFilterTitle: 'Type',
                    }
                ]}
            />
        </div>
    )
}

export default InventoriesPage