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
import { DialogFormCategory } from "./dialog-form-category"

import { useCreateCategorie } from "@/features/categories/api/use-create-category"

import { createCategoryFormSchema } from "@/schema/categories"
import { usePathname } from "next/navigation"
import { useForm } from "react-hook-form"

type Props = {
    dashboardId: string;
}

export function AddCategoryDialog({
    dashboardId,
}: Props) {
    const [open, setOpen] = useState(false)
    const pathname = usePathname();

    useEffect(() => {
        setOpen(false);
    }, [pathname]);

    const CreateMutation = useCreateCategorie(dashboardId)

    const isPending = CreateMutation.isPending;

    type CategoryFormValues = z.infer<typeof createCategoryFormSchema>

    const form = useForm<CategoryFormValues>({
        resolver: zodResolver(createCategoryFormSchema),
        defaultValues: {
            name: ""
        },
    })

    const onSubmit = (values: CategoryFormValues) => {
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
                    Add Category
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-sm">
                <DialogHeader>
                    <DialogTitle>Add New Category</DialogTitle>
                    <DialogDescription>
                        Create a new category to organize your items efficiently.
                    </DialogDescription>
                </DialogHeader>
                <DialogFormCategory
                    onSubmit={onSubmit}
                    disabled={isPending}
                    onClose={() => setOpen(false)}
                />
            </DialogContent>
        </Dialog>
    )
}
