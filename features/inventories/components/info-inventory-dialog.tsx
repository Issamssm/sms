"use client"

import { format } from "date-fns"
import {
    Calendar,
    DollarSign,
    Hash,
    Loader2,
    MapPin,
    Package2,
    Store,
    Truck,
    User,
} from "lucide-react"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"

import { useGetInventory } from "@/features/inventories/api/use-get-inventory"

import { useInfoInventory } from "@/features/inventories/hook/use-info-inventory-dialog"
import { useDashboardId } from "@/hooks/use-dashboard-id"

export function InventoryIncomeDialogInfo() {
    const dashboardId = useDashboardId()
    const { isOpen, id, onClose, type } = useInfoInventory()

    const { data: inventory, isLoading: inventoryLoading } = useGetInventory(dashboardId, id)

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px] md:max-w-[500px] bg-white p-6 rounded-lg shadow-lg">
                <DialogHeader className="border-b border-gray-200 pb-3 mb-4">
                    <DialogTitle className="text-lg font-semibold text-gray-800">Inventory Details :</DialogTitle>
                </DialogHeader>
                {inventoryLoading ? (
                    <div className="h-[400px] w-full flex items-center justify-center bg-gray-50 rounded-lg">
                        <Loader2 className="h-6 w-6 text-gray-500 animate-spin" />
                    </div>
                ) : (
                    <div className="group/sidebar">
                        <div className="grid gap-4 h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-transparent group-hover/sidebar:scrollbar-thumb-gray-400 group-hover/sidebar:scrollbar-thumb-opacity-100">
                            <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                    <Package2 className="h-4 w-4 text-gray-500" />
                                    <span className="font-bold text-gray-700">Product:</span>
                                    <span className="text-gray-600">{inventory?.product ?? "Not available"}</span>
                                </div>

                                <div className="flex items-center gap-2">
                                    <Hash className="h-4 w-4 text-gray-500" />
                                    <span className="font-bold text-gray-700">Quantity:</span>
                                    <span className="text-gray-600">{inventory?.quantity ?? "0"}</span>
                                </div>

                                <div className="flex items-center gap-2">
                                    <DollarSign className="h-4 w-4 text-gray-500" />
                                    <span className="font-bold text-gray-700">
                                        {type === "income" ? "Purchase Price per Unit:" : "Selling Price per Unit:"}
                                    </span>
                                    <span className="text-gray-600">
                                        {inventory?.price ? inventory?.price.toFixed(2) : "0.00"}
                                    </span>
                                </div>
                            </div>

                            <Separator />

                            <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                    {type === "income" ? (
                                        <Truck className="h-4 w-4 text-gray-500" />
                                    ) : (
                                        <User className="h-4 w-4 text-gray-500" />
                                    )}
                                    <span className="font-bold text-gray-700">
                                        {type === "income" ? "Supplier:" : "Customer:"}
                                    </span>
                                    <span className="text-gray-600">{inventory?.partner ?? "Not specified"}</span>
                                </div>

                                <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-gray-500" />
                                    <span className="font-bold text-gray-700">
                                        {type === "income" ? "Purchase Date:" : "Shipment Date:"}
                                    </span>
                                    <span className="text-gray-600">
                                        {inventory?.date ? format(inventory?.date, "PPP") : "Not available"}
                                    </span>
                                </div>

                                {inventory?.expiryDate && (
                                    <div className="flex items-center gap-2">
                                        <Calendar className="h-4 w-4 text-gray-500" />
                                        <span className="font-bold text-gray-700">Expiry Date:</span>
                                        <span className="text-gray-600">{format(inventory?.expiryDate, "PPP")}</span>
                                    </div>
                                )}
                            </div>

                            <Separator />

                            <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                    <Store className="h-4 w-4 text-gray-500" />
                                    <span className="font-bold text-gray-700">Invoice Number:</span>
                                    <span className="text-gray-600">
                                        {inventory?.invoiceNumber ?? "Not available"}
                                    </span>
                                </div>

                                <div className="flex items-center gap-2">
                                    <MapPin className="h-4 w-4 text-gray-500" />
                                    <span className="font-bold text-gray-700">Location:</span>
                                    <span className="text-gray-600">{inventory?.location ?? "Not specified"}</span>
                                </div>
                            </div>

                            <Separator />

                            <div className="space-y-2">
                                <span className="font-bold text-gray-700">Notes:</span>
                                <p className="text-sm text-gray-600">
                                    {inventory?.notes ?? "No additional notes"}
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    )
}
