"use client"

import { useEffect } from "react"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { DialogFormProduct } from "./dialog-form-product"

import { useGetCategories } from "@/features/categories/api/use-get-categories"
import { useCreateCategorie } from "@/features/categories/api/use-create-category"
import { useCreateProduct } from "@/features/products/api/use-create-product"

import { createProductFormSchema } from "@/schema/products"
import { usePathname } from "next/navigation"
import { useForm } from "react-hook-form"
import { useNewProduct } from "../hook/use-new-product-dialog"
import { useGetAutoUpdateStatus } from "@/features/dashboard/api/use-get-autoUpdateStatus"
import { useDashboardId } from "@/hooks/use-dashboard-id"


export function AddProductDialog() {
    const {isOpen, onClose} = useNewProduct()
    const dashboardId = useDashboardId();
    const pathname = usePathname();

    useEffect(() => {
        onClose();
    }, [pathname, onClose]);

    const CreateMutation = useCreateProduct(dashboardId)
    const categoriesQuery = useGetCategories(dashboardId)
    const CategoryMutation = useCreateCategorie(dashboardId)
    const autoUpdateQuery = useGetAutoUpdateStatus(dashboardId)

    const autoUpdateStatus = autoUpdateQuery.data?.autoUpdateStatus
    const CategoryOptions = (categoriesQuery.data ?? []).map((category) => ({
        label: category.name,
        value: category.id
    }))
    const onCreateCategory = (name: string) => CategoryMutation.mutate({
        name
    });

    const isPending = CategoryMutation.isPending || CreateMutation.isPending;
    const isLoading = categoriesQuery.isLoading;

    type ProductFormValues = z.infer<typeof createProductFormSchema>

    const form = useForm<ProductFormValues>({
        resolver: zodResolver(createProductFormSchema),
        defaultValues: {
            name: "",
            status: "OUT_OF_STOCK",
            categoryId: null,
            sellingPrice: 0,
            priceMethode: "MANUAL",
            stockMethode: "MANUAL",
            minInventory: 0,
            measureUnit: "NONE",
        },
    })

    const onSubmit = (values: ProductFormValues) => {
        CreateMutation.mutate(values, {
            onSuccess: () => {
                onClose();
                form.reset()
            }
        })
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px] md:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Add New Product</DialogTitle>
                    <DialogDescription>
                        Fill in the details for the new product. Use the tabs to navigate between sections.
                    </DialogDescription>
                </DialogHeader>
                <DialogFormProduct
                    autoUpdate={autoUpdateStatus}
                    dashboardId={dashboardId}
                    onSubmit={onSubmit}
                    disabled={isPending}
                    categoryOptions={CategoryOptions}
                    onCreateCategory={onCreateCategory}
                    onClose={() => onClose()}
                    isLoading={isLoading}
                />
            </DialogContent>
        </Dialog>
    )
}
