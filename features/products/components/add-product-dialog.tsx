"use client"

import { useEffect, useState } from "react"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Plus } from "lucide-react"
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
import { useCreateProduct } from "@/features/products/api/use-create-product"

import { createProductFormSchema } from "@/schema/products"
import { usePathname } from "next/navigation"
import { useForm } from "react-hook-form"

type Props = {
    dashboardId: string;
    autoUpdateStatus: boolean | undefined;
}

export function AddProductDialog({
    dashboardId,
    autoUpdateStatus
}: Props) {
    const [open, setOpen] = useState(false)
    const pathname = usePathname();

    useEffect(() => {
        setOpen(false);
    }, [pathname]);

    const CreateMutation = useCreateProduct(dashboardId)
    const categoriesQuery = useGetCategories(dashboardId)
    const CategoryMutation = useCreateCategorie(dashboardId)

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
                setOpen(false);
                form.reset()
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
                <DialogFormProduct
                    autoUpdate={autoUpdateStatus}
                    dashboardId={dashboardId}
                    onSubmit={onSubmit}
                    disabled={isPending}
                    categoryOptions={CategoryOptions}
                    onCreateCategory={onCreateCategory}
                    onClose={() => setOpen(false)}
                    isLoading={isLoading}
                />
            </DialogContent>
        </Dialog>
    )
}
