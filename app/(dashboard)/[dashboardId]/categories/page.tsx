"use client"

import { columns } from './columns'

import { DataTable } from '@/components/data-table'
import { Skeleton } from '@/components/ui/skeleton'

import { AddCategoryDialog } from '@/features/categories/components/add-category-dialog'

import { useBulkDeleteCategories } from '@/features/categories/api/use-bulkdelete-categories'
import { useGetCategories } from '@/features/categories/api/use-get-categories'

import { useDashboardId } from '@/hooks/use-dashboard-id'

import { Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'


const ProductsPage = () => {

    const dashboardId = useDashboardId()
    const categoriesQuery = useGetCategories(dashboardId)
    const deleteCategories = useBulkDeleteCategories(dashboardId)

    const categories = categoriesQuery.data || []
    const isDisabled = categoriesQuery.isLoading || deleteCategories.isPending;


    if (categoriesQuery.isLoading) {
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
                        Categories Page
                    </h1>
                    <div className="text-sm text-gray-500 mb-4 md:max-w-xl">
                        Manage all categories and their associated products with ease.
                    </div>
                </div>
                <AddCategoryDialog
                    dashboardId={dashboardId}
                />
            </div>
            <DataTable
                columns={columns}
                data={categories}
                filterKey="name"
                onDelete={(row) => {
                    const ids = row.map((r) => r.original.id);
                    toast.promise(
                        deleteCategories.mutateAsync({ ids }),
                        {
                            loading: "Deleting categories...",
                            success: "Categories deleted successfully",
                            error: "Failed to delete categories",
                        }
                    );
                }}
                disabled={isDisabled}
            />
        </div>
    )
}

export default ProductsPage