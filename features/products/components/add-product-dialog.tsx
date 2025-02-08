"use client"

import { useEffect, useState } from "react"
import { z } from "zod"
import { Loader, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { DialogFormProduct } from "./dialog-form-product"

import { useGetCategories } from "@/features/categories/api/use-get-categories"
import { useCreateCategorie } from "@/features/categories/api/use-create-category"
import { useGetAutoUpdateStatus } from "@/features/dashboard/api/use-get-autoUpdateStatus"
import { useCreateProduct } from "@/features/products/api/use-create-product"

import { createProductFormSchema } from "@/schema/products"
import { usePathname } from "next/navigation"

type Props = {
    dashboardId: string
}

export function AddProductDialog({
    dashboardId
}: Props) {
    const [open, setOpen] = useState(false)
    const pathname = usePathname();

    useEffect(() => {
        setOpen(false);
    }, [pathname]);

    const CreateMutation = useCreateProduct(dashboardId)
    const autoUpdateQuery = useGetAutoUpdateStatus(dashboardId)
    const categoriesQuery = useGetCategories(dashboardId)
    const CategoryMutation = useCreateCategorie(dashboardId)

    const autoUpdateStatus = autoUpdateQuery.data?.autoUpdateStatus
    
    const CategoryOptions = (categoriesQuery.data ?? []).map((category) => ({
        label: category.name,
        value: category.id
    }))
    const onCreateCategory = (name: string) => CategoryMutation.mutate({
        name
    });

    const isPending = CategoryMutation.isPending || CreateMutation.isPending;
    const isLoading = categoriesQuery.isLoading || autoUpdateQuery.isLoading;

    type ProductFormValues = z.infer<typeof createProductFormSchema>

    const onSubmit = (values: ProductFormValues) => {
        CreateMutation.mutate(values, {
            onSuccess: () => {
                setOpen(false);
            }
        })
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size={"sm"} className="text-sm md:w-auto w-full">
                    <Plus className="size-4 mr-2" />
                    Add Product
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[625px]">
                <DialogHeader>
                    <DialogTitle>Add New Product</DialogTitle>
                    <DialogDescription>
                        Fill in the details for the new product. Use the tabs to navigate between sections.
                    </DialogDescription>
                </DialogHeader>
                {isLoading ? (
                    <div className="h-[400px] w-full inset-0 flex items-center justify-center">
                        <Loader className="size-4 text-muted-foreground animate-spin" />
                    </div>
                ) : (
                    <DialogFormProduct
                        autoUpdate={autoUpdateStatus}
                        dashboardId={dashboardId}
                        onSubmit={onSubmit}
                        disabled={isPending}
                        categoryOptions={CategoryOptions}
                        onCreateCategory={onCreateCategory}
                        onClose={() => setOpen(false)}
                    />
                )}
            </DialogContent>
        </Dialog>
    )
}
