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

import { useDashboardId } from "@/hooks/use-dashboard-id"
import { useNewInventory } from "@/features/inventories/hook/use-new-inventory-dialog"


export function InventoryDialog() {
    const { isOpen, onClose, type } = useNewInventory()

    const dashboardId = useDashboardId()
    const { data: products = [] } = useGetProducts(dashboardId)
    const ProductOptions = (products).map((product) => ({
        label: product.name,
        value: product.id,
        stockMethode: product.stockMethode
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
                    />
                }
                {type === "outcome" &&
                    <DialogFormInventoryOutcome
                        dashboardId={dashboardId}
                        onClose={() => onClose()}
                        ProductOptions={ProductOptions}
                    />
                }
            </DialogContent>
        </Dialog>
    )
}

