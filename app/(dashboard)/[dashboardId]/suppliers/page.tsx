"use client"
import toast from "react-hot-toast"
import { Loader2, PlusCircle } from "lucide-react"

import { DataTable } from "@/components/data-table"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

import { useGetSuppliers } from "@/features/suppliers/api/use-get-suppliers"

import { columns } from "./columns"

import { useNewSuppier } from "@/features/suppliers/hook/use-new-supplier-dialog"
import { useDashboardId } from "@/hooks/use-dashboard-id"
import { useBulkDeleteSuppliers } from "@/features/suppliers/api/use-bulkdelete-suppliers"

const SuppliersPage = () => {
    const dashboardId = useDashboardId()
    const { onOpen } = useNewSuppier()
    const { data: suppliers = [], isLoading: suppliersLoading } = useGetSuppliers(dashboardId)
    const deleteSuppliers = useBulkDeleteSuppliers(dashboardId)

    const isDisabled = suppliersLoading || deleteSuppliers.isPending;


    if (suppliersLoading) {
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
                        Suppliers Page
                    </h1>
                    <div className="text-sm text-gray-500 mb-4 md:max-w-xl">
                        Here you can manage and view all the suppliers associated with your dashboard.
                        You can create, edit and delete suppliers.
                    </div>
                </div>
                <div className='flex items-center gap-2 flex-wrap w-full md:w-fit'>
                    <Button
                        size={"sm"}
                        className="text-sm md:w-auto w-full"
                        onClick={() => onOpen()}
                    >
                        <PlusCircle className="size-4 mr-2" />
                        Add Supplier
                    </Button>
                </div>
            </div>
            <DataTable
                columns={columns}
                data={suppliers}
                filterKey="name"
                onDelete={(row) => {
                    const ids = row.map((r) => r.original.id);
                    toast.promise(
                        deleteSuppliers.mutateAsync({ ids }),
                        {
                            loading: "Deleting suppliers...",
                            success: "Suppliers deleted successfully",
                            error: "Failed to delete suppliers",
                        }
                    );
                }}
                disabled={isDisabled}
            />
        </div>
    )
}

export default SuppliersPage