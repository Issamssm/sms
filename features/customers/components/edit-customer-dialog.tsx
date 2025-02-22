"use client"

import { z } from "zod"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { usePathname } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { DialogFormCustomer } from "./dialog-form-customer"


import { useGetCustomer } from "@/features/customers/api/use-get-customer"
import { useEditCustomer } from "@/features/customers/api/use-edit-customer"

import { useEditCustomerState } from "@/features/customers/hook/use-edit-customer-dialog"
import { useDashboardId } from "@/hooks/use-dashboard-id"

import { CustomerFormSchema } from "@/schema/customer"

import { Loader2 } from "lucide-react"


export function EditCustomerDialog() {
    const dashboardId = useDashboardId()
    const { isOpen, onClose, id } = useEditCustomerState()
    const pathname = usePathname();

    useEffect(() => {
        onClose();
    }, [pathname, onClose]);

    const { data: customer, isLoading: customerLoading } = useGetCustomer(dashboardId, id)
    const EditMutation = useEditCustomer(dashboardId, id)

    const isPending = EditMutation.isPending;

    type CustomerFormValues = z.infer<typeof CustomerFormSchema>

    const form = useForm<CustomerFormValues>({
        resolver: zodResolver(CustomerFormSchema),
        defaultValues: {
            name: "",
            address: "",
            contactInfo: "",
        },
    })

    const onSubmit = (values: CustomerFormValues) => {
        EditMutation.mutate(values, {
            onSuccess: () => {
                onClose();
                form.reset()
            }
        })
    }

    const defaultValues = customer ? {
        name: customer.name ?? "",
        address: customer.address ?? "",
        contactInfo: customer.contactInfo ?? "",
    } : {
        name: "",
        address: "",
        contactInfo: "",
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-sm">
                <DialogHeader>
                    <DialogTitle>{id ? "Edit Customer" : "Add New Customer"}</DialogTitle>
                    <DialogDescription>
                        {id ? "Update customer details." : "Create a new customer."}
                    </DialogDescription>
                </DialogHeader>
                {customerLoading ? (
                    <div className="flex h-[360px] items-center justify-center w-full">
                        <Loader2 className="size-4 animate-spin" />
                    </div>
                ) : (
                    <DialogFormCustomer
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
