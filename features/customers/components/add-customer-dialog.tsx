"use client"

import { useEffect } from "react"
import { z } from "zod"
import { usePathname } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { DialogFormCustomer } from "./dialog-form-customer"

import { useCreateCustomer } from "@/features/customers/api/use-create-customer"

import { useNewCustomer } from "@/features/customers/hook/use-new-customer-dialog"
import { useDashboardId } from "@/hooks/use-dashboard-id"

import { CustomerFormSchema } from "@/schema/customer"


export function AddCustomerDialog() {
    const dashboardId = useDashboardId()
    const { isOpen, onClose } = useNewCustomer()
    const pathname = usePathname();

    useEffect(() => {
        onClose();
    }, [pathname, onClose]);

    const CreateMutation = useCreateCustomer(dashboardId)

    const isPending = CreateMutation.isPending;

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
                    <DialogTitle>Add New Customer</DialogTitle>
                    <DialogDescription>
                        Create a new customer.
                    </DialogDescription>
                </DialogHeader>
                <DialogFormCustomer
                    onSubmit={onSubmit}
                    disabled={isPending}
                    onClose={() => onClose()}
                />
            </DialogContent>
        </Dialog>
    )
}
