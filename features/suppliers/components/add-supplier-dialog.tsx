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
import { DialogFormSupplier } from "./dialog-form-supplier"


import { SupplierFormSchema } from "@/schema/suppliers"
import { usePathname } from "next/navigation"
import { useForm } from "react-hook-form"
import { useNewSuppier } from "../hook/use-new-supplier-dialog"
import { useCreateSupplier } from "../api/use-create-supplier"
import { useDashboardId } from "@/hooks/use-dashboard-id"


export function AddSupplierDialog() {
    const dashboardId = useDashboardId()
    const { isOpen, onClose } = useNewSuppier()
    const pathname = usePathname();

    useEffect(() => {
        onClose();
    }, [pathname, onClose]);

    const CreateMutation = useCreateSupplier(dashboardId)

    const isPending = CreateMutation.isPending;

    type SupplierFormValues = z.infer<typeof SupplierFormSchema>

    const form = useForm<SupplierFormValues>({
        resolver: zodResolver(SupplierFormSchema),
        defaultValues: {
            name: "",
            address: "",
            contactInfo: "",
        },
    })

    const onSubmit = (values: SupplierFormValues) => {
        CreateMutation.mutate(values, {
            onSuccess: () => {
                onClose();
                form.reset()
            }
        })
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-sm">
                <DialogHeader>
                    <DialogTitle>Add New Supplier</DialogTitle>
                    <DialogDescription>
                        Create a new supplier.
                    </DialogDescription>
                </DialogHeader>
                <DialogFormSupplier
                    onSubmit={onSubmit}
                    disabled={isPending}
                    onClose={() => onClose()}
                />
            </DialogContent>
        </Dialog>
    )
}
