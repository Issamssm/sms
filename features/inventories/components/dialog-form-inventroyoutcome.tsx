"use client"

import * as z from "zod"
import { useEffect, useState } from "react"
import { $Enums } from "@prisma/client"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger
} from "@/components/ui/tabs"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { DatePicker } from "@/components/date-picker"

import { useCreateInventoryOutcome } from "@/features/inventories/api/use-create-inventory-outcome"
import { InventoryOutcomeFormSchema } from "@/schema/inventory"
import { Loader } from "lucide-react"
import { CalculateCost } from "@/lib/utils"

type InventoryOutcomeFormValue = z.infer<typeof InventoryOutcomeFormSchema>


type Props = {
    onClose: () => void;
    ProductOptions: {
        label: string;
        value: string;
        stockMethode: $Enums.ProductStocks;
    }[];
    CustomerOptions: {
        label: string;
        value: string;
    }[];
    dashboardId: string
}

export const DialogFormInventoryOutcome = ({
    onClose,
    ProductOptions,
    dashboardId,
    CustomerOptions,
}: Props) => {
    const CreateMutation = useCreateInventoryOutcome(dashboardId)
    const [product, setProduct] = useState<{
        label: string;
        value: string;
        stockMethode: $Enums.ProductStocks;
    } | undefined | null>(null);

    const form = useForm<z.infer<typeof InventoryOutcomeFormSchema>>({
        resolver: zodResolver(InventoryOutcomeFormSchema),
        defaultValues: {
            quantity: 0,
            sellingPrice: 0,
            shippedAt: new Date(),
        },
    })

    const watchedQuantity = form.watch("quantity");

    const { totalCost, error } = CalculateCost({
        productId: product?.value || "",
        quantity: product?.value ? Number(watchedQuantity) || 0 : 0,
        dashboardId,
        method: product?.stockMethode || "FIFO",
    });

    const isPending = CreateMutation.isPending;

    const sellingPricePerUnit = watchedQuantity > 0 ? parseFloat((totalCost / watchedQuantity).toFixed(2)) : 0;

    useEffect(() => {
        if (product?.stockMethode !== "MANUAL") {
            form.setValue("sellingPrice", sellingPricePerUnit);
        }
    }, [product?.stockMethode, totalCost, form, sellingPricePerUnit])


    const handleSubmit = (values: InventoryOutcomeFormValue) => {
        CreateMutation.mutate(values, {
            onSuccess: () => {
                onClose();
                form.reset()
            }
        })
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                <Tabs defaultValue="basic" className="w-full h-[400px]">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="basic">Basic Info</TabsTrigger>
                        <TabsTrigger value="invoice">Invoice</TabsTrigger>
                        <TabsTrigger value="additional">Additional Info</TabsTrigger>
                    </TabsList>
                    <TabsContent value="basic">
                        <div className="space-y-4">
                            <FormField
                                control={form.control}
                                name="productId"
                                render={({ field }) => {
                                    const selectedProduct = ProductOptions.find(p => p.value === field.value);
                                    return (
                                        <FormItem>
                                            <FormLabel>Product</FormLabel>
                                            <Select
                                                onValueChange={(value) => {
                                                    field.onChange(value);
                                                    const selectedProduct = ProductOptions.find(p => p.value === value);
                                                    setProduct(selectedProduct);
                                                }}
                                                defaultValue={field.value}
                                            >
                                                <FormControl>
                                                    <SelectTrigger disabled={isPending}>
                                                        <SelectValue placeholder="Select a product" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {ProductOptions.map((product) => (
                                                        <SelectItem key={product.value} value={product.value}>
                                                            {product.label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            {selectedProduct?.stockMethode && (
                                                <div className="text-xs text-blue-700">
                                                    Stock Method: <span className="text-xs font-semibold">{selectedProduct?.stockMethode}</span>
                                                </div>
                                            )}
                                            <FormMessage />
                                        </FormItem>
                                    );
                                }}
                            />
                            <div className="grid grid-cols-2 gap-2">
                                <FormField
                                    control={form.control}
                                    name="quantity"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Quantity</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    placeholder="0"
                                                    min={0}
                                                    {...field}
                                                    onChange={(e) => {
                                                        const value = Number(e.target.value);
                                                        if (value >= 0) {
                                                            field.onChange(value);
                                                        }
                                                    }}
                                                    disabled={isPending}
                                                />

                                            </FormControl>
                                            <FormMessage>
                                                {form.formState.errors.quantity && (
                                                    <span className="text-red-500 text-xs">
                                                        {form.formState.errors.quantity.message}
                                                    </span>
                                                )}
                                                {error && (
                                                    <span className="text-red-500 text-xs">
                                                        {error}
                                                    </span>
                                                )}
                                            </FormMessage>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="sellingPrice"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Selling price per unit</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    step="0.01"
                                                    placeholder="0.00"
                                                    min={0}
                                                    {...field}
                                                    disabled={product?.stockMethode !== "MANUAL" || isPending}
                                                    value={product?.stockMethode === "MANUAL" ? field.value : sellingPricePerUnit || 0}
                                                    className="w-full"
                                                />
                                            </FormControl>
                                            {!!totalCost && (
                                                <div className="text-xs text-green-700">
                                                    Total: <span className="text-xs font-semibold">{parseFloat((totalCost).toFixed(2))}</span>
                                                </div>
                                            )}
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <FormField
                                control={form.control}
                                name="notes"
                                render={({ field }) => (
                                    <FormItem className="md:col-span-2 lg:col-span-3">
                                        <FormLabel>Notes</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Enter notes"
                                                {...field}
                                                disabled={isPending}
                                                className="resize-none"
                                                value={field.value}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </TabsContent>
                    <TabsContent value="invoice">
                        <div className="space-y-4">
                            <FormField
                                name="shippedAt"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Shipped date</FormLabel>
                                        <FormControl>
                                            <DatePicker
                                                value={field.value}
                                                onChange={field.onChange}
                                                disabled={isPending}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="invoiceNumber"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Invoice Number</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Add invoice number" {...field} disabled={isPending} />
                                        </FormControl>
                                        <FormDescription>
                                            Enter the invoice number associated with this purchase, if applicable.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </TabsContent>
                    <TabsContent value="additional">
                        <div className="space-y-4">
                            <FormField
                                control={form.control}
                                name="customerId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Customer</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger disabled={isPending} >
                                                    <SelectValue placeholder="Select a customer" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {CustomerOptions.map((customer) => (
                                                    <SelectItem key={customer.value} value={customer.value}>
                                                        {customer.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="location"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Location</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Add location" {...field} disabled={isPending} />
                                        </FormControl>
                                        <FormDescription>
                                            Specify the storage location (e.g., warehouse name or shelf number).
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </TabsContent>
                </Tabs>
                <div className="flex items-center gap-2">
                    <Button type="submit" disabled={isPending}>
                        {isPending && <Loader className="animate-spin" />}
                        Save
                    </Button>
                    <Button type="button" disabled={isPending} variant={"outline"} onClick={onClose}>
                        Cancel
                    </Button>
                </div>
            </form>
        </Form>
    )
}
