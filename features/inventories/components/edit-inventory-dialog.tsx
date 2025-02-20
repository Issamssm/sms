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
import { useGetInventory } from "@/features/inventories/api/use-get-inventory"

import { useDashboardId } from "@/hooks/use-dashboard-id"
import { useEditInventory } from "@/features/inventories/hook/use-edit-inventory-dialog"
import { Loader2 } from "lucide-react"


export function EditInventoryDialog() {
    const dashboardId = useDashboardId()
    const { isOpen, onClose, type, id } = useEditInventory()

    const { data: inventory, isLoading: inventoryLoading } = useGetInventory(dashboardId, id)
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
                {inventoryLoading ? (
                    <div className="flex items-center justify-center py-8 h-[400px]">
                        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                    </div>
                ) : (
                    <>
                        {type === "income" && (
                            <DialogFormInventoryIncome
                                dashboardId={dashboardId}
                                onClose={() => onClose()}
                                ProductOptions={ProductOptions}
                                initialValues={inventory}
                                id={id}
                            />
                        )}
                        {type === "outcome" && (
                            <DialogFormInventoryOutcome
                                dashboardId={dashboardId}
                                onClose={() => onClose()}
                                ProductOptions={ProductOptions}
                            />
                        )}
                    </>
                )}
            </DialogContent>
        </Dialog>
    )
}

