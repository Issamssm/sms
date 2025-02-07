"use client"

import { useState } from "react"
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
import { createProductFormSchema } from "@/schema/products"
import { z } from "zod"
import { useGetCategories } from "@/features/categories/api/use-get-categories"
import { useDashboardId } from "@/hooks/use-dashboard-id"
import { useCreateCategorie } from "@/features/categories/api/use-create-category"
import { Plus } from "lucide-react"


export function AddProductDialog() {
    const [open, setOpen] = useState(false)
    const dashboardId = useDashboardId()

    const categoriesQuery = useGetCategories(dashboardId)
    const CategoryMutation = useCreateCategorie(dashboardId)

    const CategoryOptions = (categoriesQuery.data ?? []).map((category) => ({
        label: category.name,
        value: category.id
    }))
    const onCreateCategory = (name: string) => CategoryMutation.mutate({
        name
    });

    type ProductFormValues = z.infer<typeof createProductFormSchema>

    const onSubmit = (values: ProductFormValues) => {
        // CreateMutation.mutate(values, {
        //     onSuccess: () => {
        //         onClose();
        //     }
        // })
        console.log(values);
        setOpen(false);
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size={"sm"} className="text-sm">
                    <Plus className="size-4 mr-2"/>
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
                <DialogFormProduct
                    dashboardId={dashboardId}
                    onSubmit={onSubmit}
                    disabled={false}
                    categoryOptions={CategoryOptions}
                    onCreateCategory={onCreateCategory}
                />
            </DialogContent>
        </Dialog>
    )
}
