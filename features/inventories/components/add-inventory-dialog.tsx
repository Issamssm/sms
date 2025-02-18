"use client"

import { useState } from "react"
import { MinusCircle, PlusCircle } from "lucide-react"
import { cn } from "@/lib/utils"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { DialogFormInventoryIncome } from "./dialog-form-inventroyincome"
import { DialogFormInventoryOutcome } from "./dialog-form-inventroyoutcome"

import { useGetProducts } from "@/features/products/api/use-get-products"

import { useDashboardId } from "@/hooks/use-dashboard-id"

type Props = {
    label: string;
    title: string;
    description: string;
    type: "income" | "outcome"
}

export function InventoryDialog({
    label,
    title,
    description,
    type
}: Props) {
    const [open, setOpen] = useState(false)
    const dashboardId = useDashboardId()
    const { data: products = [], isLoading: productsLoading } = useGetProducts(dashboardId)
    const ProductOptions = (products).map((product) => ({
        label: product.name,
        value: product.id,
        stockMethode: product.stockMethode
    }))


    return (
        <Dialog open={open} onOpenChange={setOpen} aria-modal="true">
            <DialogTrigger asChild>
                <Button className={cn("w-full md:w-fit",
                    type === "income" && "bg-green-600 hover:bg-green-700 text-white",
                    type === "outcome" && "bg-red-600 hover:bg-red-700 text-white",
                )} disabled={productsLoading}>
                    {type === "income" ? <PlusCircle /> : <MinusCircle />}
                    {label}
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] md:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>{description}</DialogDescription>
                </DialogHeader>
                {type === "income" &&
                    <DialogFormInventoryIncome
                        dashboardId={dashboardId}
                        onClose={() => setOpen(false)}
                        ProductOptions={ProductOptions}
                    />
                }
                {type === "outcome" &&
                    <DialogFormInventoryOutcome
                        dashboardId={dashboardId}
                        onClose={() => setOpen(false)}
                        ProductOptions={ProductOptions}
                    />
                }
            </DialogContent>
        </Dialog>
    )
}

