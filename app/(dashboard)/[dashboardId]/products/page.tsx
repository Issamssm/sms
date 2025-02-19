"use client"

import { columns } from './columns'

import { DataTable } from '@/components/data-table'
import { Skeleton } from '@/components/ui/skeleton'

import { useGetProducts } from '@/features/products/api/use-get-products'
import { useBulkDeleteProducts } from '@/features/products/api/use-bulkdelete-product'
import { useGetCategories } from '@/features/categories/api/use-get-categories'

import { useDashboardId } from '@/hooks/use-dashboard-id'

import { Loader2, PlusCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import { Button } from '@/components/ui/button'
import { useNewProduct } from '@/features/products/hook/use-new-product-dialog'


const ProductsPage = () => {

  const dashboardId = useDashboardId()
  const { onOpen } = useNewProduct()

  const productsQuery = useGetProducts(dashboardId)
  const deleteProducts = useBulkDeleteProducts(dashboardId)
  const categoriesQuery = useGetCategories(dashboardId);

  const products = productsQuery.data || []
  const isDisabled = productsQuery.isLoading || deleteProducts.isPending;

  const options = (categoriesQuery.data ?? []).map((category) => ({
    label: category.name
  }))

  if (productsQuery.isLoading) {
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
            Products Page
          </h1>
          <div className="text-sm text-gray-500 mb-4 md:max-w-xl">
            Here you can manage and view all the products associated with your dashboard.
            You can create and delete products, and navigate to the product page to edit it.
          </div>
        </div>
        <div className='flex items-center gap-2 flex-wrap w-full md:w-fit'>
          <Button
            size={"sm"}
            className="text-sm md:w-auto w-full"
            onClick={() => onOpen()}
          >
            <PlusCircle className="size-4 mr-2" />
            Add Product
          </Button>
        </div>
      </div>
      <DataTable
        columns={columns}
        data={products}
        filterKey="name"
        onDelete={(row) => {
          const ids = row.map((r) => r.original.id);
          toast.promise(
            deleteProducts.mutateAsync({ ids }),
            {
              loading: "Deleting products...",
              success: "Products deleted successfully",
              error: "Failed to delete products",
            }
          );
        }}
        disabled={isDisabled}
        facetedFilters={[
          {
            options: options,
            facetedFilterKey: 'category',
            facetedFilterTitle: 'Category',
          }
        ]}
      />
    </div>
  )
}

export default ProductsPage