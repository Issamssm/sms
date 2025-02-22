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
import { useDashboardId } from "@/hooks/use-dashboard-id"
import { useGetSupplier } from "../api/use-get-supplier"
import { useEditSupplierState } from "../hook/use-edit-supplier-dialog"
import { Loader2 } from "lucide-react"
import { useEditSupplier } from "../api/use-edit-supplier"


export function EditSupplierDialog() {
    const dashboardId = useDashboardId()
    const { isOpen, onClose, id } = useEditSupplierState()
    const pathname = usePathname();

    useEffect(() => {
        onClose();
    }, [pathname, onClose]);

    const { data: supplier, isLoading: supplierLoading } = useGetSupplier(dashboardId, id)
    const EditMutation = useEditSupplier(dashboardId, id)

    const isPending = EditMutation.isPending;

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
        EditMutation.mutate(values, {
            onSuccess: () => {
                onClose();
                form.reset()
            }
        })
    }

    const defaultValues = supplier ? {
        name: supplier.name ?? "",
        address: supplier.address ?? "",
        contactInfo: supplier.contactInfo ?? "",
    } : {
        name: "",
        address: "",
        contactInfo: "",
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-sm">
                <DialogHeader>
                    <DialogTitle>{id ? "Edit Supplier" : "Add New Supplier"}</DialogTitle>
                    <DialogDescription>
                        {id ? "Update supplier details." : "Create a new supplier."}
                    </DialogDescription>
                </DialogHeader>
                {supplierLoading ? (
                    <div className="flex h-[360px] items-center justify-center w-full">
                        <Loader2 className="size-4 animate-spin" />
                    </div>
                ) : (
                    <DialogFormSupplier
                        onSubmit={onSubmit}
                        disabled={isPending}
                        onClose={() => onClose()}
                        initialValues={defaultValues}
                        id={id}
                    />
                )}
            </DialogContent>
        </Dialog>
    )
}
