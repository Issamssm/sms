"use client"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { DialogFormInventoryIncome } from "./dialog-form-inventroyincome"
import { DialogFormInventoryOutcome } from "./dialog-form-inventroyoutcome"

import { useGetProducts } from "@/features/products/api/use-get-products"
import { useGetSuppliers } from "@/features/suppliers/api/use-get-suppliers"
import { useGetCustomers } from "@/features/customer/api/use-get-customers"

import { useDashboardId } from "@/hooks/use-dashboard-id"
import { useNewInventory } from "@/features/inventories/hook/use-new-inventory-dialog"


export function AddInventoryDialog() {
    const { isOpen, onClose, type } = useNewInventory()

    const dashboardId = useDashboardId()
    const { data: products = [] } = useGetProducts(dashboardId)
    const { data: suppliers = [] } = useGetSuppliers(dashboardId)
    const { data: customers = [] } = useGetCustomers(dashboardId)

    const ProductOptions = (products).map((product) => ({
        label: product.name,
        value: product.id,
        stockMethode: product.stockMethode
    }))

    const SupplierOptions = (suppliers).map((supplier) => ({
        label: supplier.name,
        value: supplier.id,
    }))

    const CustomerOptions = (customers).map((customer) => ({
        label: customer.name,
        value: customer.id,
    }))


    return (
        <Dialog open={isOpen} onOpenChange={onClose} aria-modal="true">
            <DialogContent className="sm:max-w-[425px] md:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>{type === "income" ? "Add New Stock Entry" : "Register Stock Usage"}</DialogTitle>
                    <DialogDescription>{type === "income" ? "Enter the details for the new inventory income." : "Enter the details for the new inventory outcome."}</DialogDescription>
                </DialogHeader>
                {type === "income" &&
                    <DialogFormInventoryIncome
                        dashboardId={dashboardId}
                        onClose={() => onClose()}
                        ProductOptions={ProductOptions}
                    SupplierOptions={SupplierOptions}
                    />
                }
                {type === "outcome" &&
                    <DialogFormInventoryOutcome
                        dashboardId={dashboardId}
                        onClose={() => onClose()}
                        ProductOptions={ProductOptions}
                        CustomerOptions={CustomerOptions}
                    />
                }
            </DialogContent>
        </Dialog>
    )
}

