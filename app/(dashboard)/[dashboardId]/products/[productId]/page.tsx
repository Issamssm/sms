"use client"

import Link from "next/link"
import { z } from "zod"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"
import { $Enums } from "@prisma/client";

import { EditProductForm } from "@/features/products/components/edit-product-form"
import { Button, buttonVariants } from "@/components/ui/button"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger
} from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { ChevronLeft, Loader2, Trash } from "lucide-react"

import { useGetProduct } from "@/features/products/api/use-get-product"
import { useGetAutoUpdateStatus } from "@/features/dashboard/api/use-get-autoUpdateStatus"
import { useGetCategories } from "@/features/categories/api/use-get-categories"
import { useDeleteProduct } from "@/features/products/api/use-delete-product"
import { useEditProduct } from "@/features/products/api/use-edit-product"
import { useCreateCategorie } from "@/features/categories/api/use-create-category"

import { useConfirm } from "@/hooks/use-confirm"
import { useDashboardId } from "@/hooks/use-dashboard-id"
import { useProductId } from "@/hooks/use-product-id"

import { editProductFormSchema } from "@/schema/products"
import { ProductInventoryTable } from "./product-inventory-table"

const ProductPage = () => {
    const dashboardId = useDashboardId()
    const productId = useProductId()
    const router = useRouter()
    const [ConfirmDialog, confirm] = useConfirm(
        "Delete Product",
        "Are you sure you want to delete this product?"
    )

    const deleteMutation = useDeleteProduct(productId, dashboardId)
    const productQuery = useGetProduct(dashboardId, productId)
    const EditMutation = useEditProduct(dashboardId, productId)
    const autoUpdateQuery = useGetAutoUpdateStatus(dashboardId)
    const categoriesQuery = useGetCategories(dashboardId)
    const CategoryMutation = useCreateCategorie(dashboardId)


    const onCreateCategory = (name: string) => CategoryMutation.mutate({
        name
    });

    const isPending = CategoryMutation.isPending || EditMutation.isPending;
    const isLoading = categoriesQuery.isLoading;

    const CategoryOptions = (categoriesQuery.data ?? []).map((category) => ({
        label: category.name,
        value: category.id
    }))

    const autoUpdateStatus = autoUpdateQuery.data?.autoUpdateStatus


    const handleDelete = async () => {
        const ok = await confirm()
        if (ok) {
            deleteMutation.mutate(undefined, {
                onSuccess: () => {
                    router.replace(`/${dashboardId}/products`)
                },
            })
        }
    }

    const defaultValues = productQuery.data ? {
        name: productQuery.data.product.name ?? "",
        categoryId: productQuery.data.product.categoryId ?? null,
        description: productQuery.data.product.description ?? "",
        sellingPrice: productQuery.data.product.sellingPrice ?? 0,
        priceMethode: productQuery.data.product.priceMethode as $Enums.ProductPrice ?? "MANUAL",
        stockMethode: productQuery.data.product.stockMethode as $Enums.ProductStocks ?? "MANUAL",
        minInventory: productQuery.data.product.minInventory ?? 0,
        measureUnit: productQuery.data.product.measureUnit as $Enums.MeasurementUnit ?? "NONE",
        status: productQuery.data.product.status as $Enums.ProductStatus ?? "OUT_OF_STOCK",
        warehouseLocation: productQuery.data.product.warehouseLocation ?? "",
    } : {
        name: "",
        categoryId: "",
        description: "",
        sellingPrice: 0,
        priceMethode: "MANUAL" as $Enums.ProductPrice,
        stockMethode: "MANUAL" as $Enums.ProductStocks,
        minInventory: 0,
        measureUnit: "NONE" as $Enums.MeasurementUnit,
        status: "OUT_OF_STOCK" as $Enums.ProductStatus,
        warehouseLocation: "",
    };


    if (productQuery.isLoading || autoUpdateQuery.isLoading) {
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

    if (!productQuery.data) {
        return (
            <div className="flex flex-col items-center justify-center h-96 text-center">
                <h1 className="text-4xl font-bold text-red-500">404</h1>
                <p className="text-lg text-gray-600 mt-2">Product not found</p>
                <Link href={`/${dashboardId}/products`} className="mt-4 px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition">
                    Go Back to Products
                </Link>
            </div>
        )
    }

    type ProductFormValues = z.infer<typeof editProductFormSchema>


    const onSubmit = (values: ProductFormValues) => {
        EditMutation.mutate(values)
    }

    return (
        <>
            <ConfirmDialog />
            <div className="mx-auto w-full px-4 md:px-6 py-4">
                <div className="flex items-center justify-between mb-8 flex-col md:flex-row gap-2 md:gap-4">
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-4">
                            <Link href={`/${dashboardId}/products`} className={cn(buttonVariants({ variant: "outline" }), "px-5 size-8")}>
                                <ChevronLeft className="size-3" />
                            </Link>
                            <h1 className="text-xl line-clamp-1 font-semibold tracking-tight md:p-0">
                                Product Details
                            </h1>
                        </div>
                        <div className="text-sm text-gray-500 mb-4 md:max-w-xl">
                            On the Product Page, you can view and manage all details related to a specific product. This includes
                            essential information such as the product name, description, price, stock levels, and status.
                        </div>
                    </div>
                    <div className="flex gap-2 md:w-auto w-full">
                        <Button size={"sm"} className="text-sm md:w-auto w-full" variant={"destructive"} onClick={handleDelete}>
                            <Trash className="size-4 mr-2" />
                            Delete Product
                        </Button>
                    </div>
                </div>
                <Tabs defaultValue="info" className="w-full">
                    <TabsList className="grid w-full grid-cols-3 max-w-sm">
                        <TabsTrigger value="info">Info</TabsTrigger>
                        <TabsTrigger value="inventory">Inventory</TabsTrigger>
                        <TabsTrigger value="pricing">Pricing</TabsTrigger>
                    </TabsList>
                    <TabsContent value="info" className="space-y-4">
                        <EditProductForm
                            autoUpdate={autoUpdateStatus}
                            defaultValues={defaultValues}
                            onSubmit={onSubmit}
                            CategoryOptions={CategoryOptions}
                            onCreateCategory={onCreateCategory}
                            disabled={isPending}
                            isLoading={isLoading}
                            dashboardId={dashboardId}
                        />
                    </TabsContent>
                    <TabsContent value="inventory" className="space-y-4">
                        <ProductInventoryTable
                            currentQuantity={productQuery.data.product.currentStock ?? 0}
                            inventories={productQuery.data.inventories}
                            isLoading={productQuery.isLoading}
                        />
                    </TabsContent>
                    <TabsContent value="pricing" className="space-y-4">

                    </TabsContent>
                </Tabs>
            </div>
        </>
    )
}

export default ProductPage