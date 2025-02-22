"use client"
import toast from "react-hot-toast"
import { Loader2, PlusCircle } from "lucide-react"

import { DataTable } from "@/components/data-table"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

import { columns } from "./columns"

import { useDashboardId } from "@/hooks/use-dashboard-id"
import { useNewCustomer } from "@/features/customers/hook/use-new-customer-dialog"

import { useBulkDeleteCustomers } from "@/features/customers/api/use-bulkdelete-customers"
import { useGetCustomers } from "@/features/customers/api/use-get-customers"

const CustomersPage = () => {
    const dashboardId = useDashboardId()
    const { onOpen } = useNewCustomer()
    const { data: customers = [], isLoading: customersLoading } = useGetCustomers(dashboardId)
    const deleteCustomers = useBulkDeleteCustomers(dashboardId)

    const isDisabled = customersLoading || deleteCustomers.isPending;


    if (customersLoading) {
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
                        Customers Page
                    </h1>
                    <div className="text-sm text-gray-500 mb-4 md:max-w-xl">
                        Here you can manage and view all the customers associated with your dashboard.
                        You can create, edit and delete customers.
                    </div>
                </div>
                <div className='flex items-center gap-2 flex-wrap w-full md:w-fit'>
                    <Button
                        size={"sm"}
                        className="text-sm md:w-auto w-full"
                        onClick={() => onOpen()}
                    >
                        <PlusCircle className="size-4 mr-2" />
                        Add Customer
                    </Button>
                </div>
            </div>
            <DataTable
                columns={columns}
                data={customers}
                filterKey="name"
                onDelete={(row) => {
                    const ids = row.map((r) => r.original.id);
                    toast.promise(
                        deleteCustomers.mutateAsync({ ids }),
                        {
                            loading: "Deleting customers...",
                            success: "Customers deleted successfully",
                            error: "Failed to delete customers",
                        }
                    );
                }}
                disabled={isDisabled}
            />
        </div>
    )
}

export default CustomersPage