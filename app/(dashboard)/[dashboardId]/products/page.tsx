"use client"

import { DataTable } from '@/components/data-table'
import { columns } from './columns'
import { AddProductDialog } from '@/features/products/components/add-product-dialog'


const productsPage = () => {

  return (
    <div className="mx-auto w-full px-4 md:px-6 py-4">
      <div className="flex items-center justify-between mb-12">
        <h1 className="text-xl line-clamp-1 font-semibold tracking-tight md:p-0">
          Products Page
        </h1>
        <AddProductDialog />
      </div>
      <DataTable
        columns={columns}
        data={[]}
        filterKey="email"
        onDelete={() => {
          // const ids = row.map((r) => r.original.id);
          // deleteAccounts.mutate({ ids });
        }}
        disabled={false}
      />
    </div>
  )
}

export default productsPage