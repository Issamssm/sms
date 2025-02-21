"use client"
import * as z from "zod"
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

import { useCreateInventoryIncome } from "@/features/inventories/api/use-create-inventory-income"
import { InventoryIncomeFormSchema } from "@/schema/inventory"
import { Loader } from "lucide-react"

type InventoryIncomeFormValue = z.infer<typeof InventoryIncomeFormSchema>

type Props = {
    onClose: () => void;
    ProductOptions: {
        label: string;
        value: string;
        stockMethode: $Enums.ProductStocks;
    }[];
    SupplierOptions: {
        label: string;
        value: string;
    }[];
    dashboardId: string
}

export const DialogFormInventoryIncome = ({
    onClose,
    ProductOptions,
    dashboardId,
    SupplierOptions,
}: Props) => {
    const CreateMutation = useCreateInventoryIncome(dashboardId)


    const form = useForm<z.infer<typeof InventoryIncomeFormSchema>>({
        resolver: zodResolver(InventoryIncomeFormSchema),
        defaultValues: {
            quantity: 0,
            costPrice: 0,
            purchaseDate: new Date(),
        },
    })

    const isPending = CreateMutation.isPending;

    const watchedQuantity = form.watch("quantity");
    const watchedCostPrice = form.watch("costPrice");

    const totalCostPrice = watchedQuantity * watchedCostPrice;

    const handleSubmit = (values: InventoryIncomeFormValue) => {
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
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Product</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger disabled={isPending}>
                                                    <SelectValue placeholder="Select a product" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {ProductOptions.map((product) => (
                                                    <SelectItem key={product.value} value={product.value}>{product.label}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="grid grid-cols-2 gap-2 md:gap-4">
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
                                                    disabled={isPending}
                                                    className="w-full"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="costPrice"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Purchase price per unit</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    step="0.01"
                                                    placeholder="0.00"
                                                    min={0}
                                                    disabled={isPending}
                                                    {...field}
                                                    className="w-full"
                                                />
                                            </FormControl>
                                            {!!totalCostPrice && (
                                                <div className="text-xs text-green-700">
                                                    Total: <span className="text-xs font-semibold">{totalCostPrice}</span>
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
                                name="purchaseDate"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Purchase date</FormLabel>
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
                                            <Input placeholder=" Add invoice number" {...field} disabled={isPending} />
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
                                name="expiryDate"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Expiry date</FormLabel>
                                        <FormControl>
                                            <DatePicker
                                                value={field.value || undefined}
                                                onChange={field.onChange}
                                                disabled={isPending}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="supplierId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Supplier</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger disabled={isPending} >
                                                    <SelectValue placeholder="Select a supplier" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {SupplierOptions.map((supplier) => (
                                                    <SelectItem key={supplier.value} value={supplier.value}>{supplier.label}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormDescription>Choose the supplier from whom you purchased the product.</FormDescription>
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
                                            <Input {...field} disabled={isPending} placeholder="Add location" />
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
