"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, useWatch } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form"
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
    MeasurementUnitSchema,
    ProductStatusSchema,
    ProductStocksSchema,
    ProductPriceSchema,
    ProductStatusesWithLabel,
    ProductPriceMethodsWithLabel,
    ProductStockMethodsWithLabel,
    MeasurementUnitsWithLabel,
    ProductPriceMethods,
} from "@/constants"

const formSchema = z.object({
    name: z.string().min(3, {
        message: "Name must be at least 3 characters.",
    }),
    status: ProductStatusSchema,
    categoryId: z.string().optional().nullable(),
    sellingPrice: z.string().refine((val) => !isNaN(Number(val)), {
        message: "Must be a valid number",
    }),
    priceMethode: ProductPriceSchema,
    stockMethode: ProductStocksSchema,
    minInventory: z.string().refine((val) => !isNaN(Number(val)), {
        message: "Must be a valid number",
    }),
    measureUnit: MeasurementUnitSchema,
})

type ProductFormValues = z.infer<typeof formSchema>

export function AddProductDialog() {
    const [open, setOpen] = useState(false)

    const form = useForm<ProductFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            status: "AVAILABLE",
            categoryId: null,
            sellingPrice: "0",
            priceMethode: "MANUAL",
            stockMethode: "MANUAL",
            minInventory: "0",
            measureUnit: "NONE",
        },
    })

    const selectedPriceMethod = useWatch({
        control: form.control,
        name: "priceMethode",
    });

    const handlePriceMethodChange = (value: (typeof ProductPriceMethods)[number]) => {
        form.setValue("priceMethode", value);
        if (value !== "MANUAL") {
            form.setValue("sellingPrice", "0");
        }
    };


    function onSubmit(values: ProductFormValues) {
        console.log({
            ...values,
            sellingPrice: parseFloat(values.sellingPrice),
            minInventory: parseInt(values.minInventory),
        });
        form.reset();
        setOpen(false);
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline">Add New Product</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[625px]">
                <DialogHeader>
                    <DialogTitle>Add New Product</DialogTitle>
                    <DialogDescription>
                        Fill in the details for the new product. Use the tabs to navigate between sections.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <Tabs defaultValue="basic" className="w-full h-[400px]">
                            <TabsList className="grid w-full grid-cols-3">
                                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                                <TabsTrigger value="pricing">Pricing</TabsTrigger>
                                <TabsTrigger value="inventory">Inventory</TabsTrigger>
                            </TabsList>
                            <TabsContent value="basic" className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Product name" {...field} />
                                            </FormControl>
                                            <FormDescription>Enter the name of the product.</FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="status"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Status</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select product status" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {ProductStatusesWithLabel.map((status) => (
                                                        <SelectItem key={status.value} value={status.value}>{status.label}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormDescription>Select the current status of the product.</FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                {/* <FormField
                                    control={form.control}
                                    name="categoryId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Category</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Category ID" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                /> */}
                            </TabsContent>
                            <TabsContent value="pricing" className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="sellingPrice"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Selling Price</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    step="0.01"
                                                    placeholder="0.00"
                                                    {...field}
                                                    disabled={selectedPriceMethod !== "MANUAL"}
                                                    value={selectedPriceMethod === "MANUAL" ? field.value : "0"} 
                                                />
                                            </FormControl>
                                            <FormDescription>Enter the selling price of the product.</FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="priceMethode"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Price Method</FormLabel>
                                            <Select onValueChange={handlePriceMethodChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select price method"/>
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {ProductPriceMethodsWithLabel.map((price) => (
                                                        <SelectItem key={price.value} value={price.value}>{price.label}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormDescription>Select the pricing method for the product.</FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </TabsContent>
                            <TabsContent value="inventory" className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="stockMethode"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Stock Method</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select stock method" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {ProductStockMethodsWithLabel.map((stock) => (
                                                        <SelectItem key={stock.value} value={stock.value}>{stock.label}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormDescription>Select the stock management method for the product.</FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="minInventory"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Minimum Inventory</FormLabel>
                                            <FormControl>
                                                <Input type="number" placeholder="0" {...field} />
                                            </FormControl>
                                            <FormDescription>Enter the minimum inventory level for the product.</FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="measureUnit"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Measurement Unit</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select measurement unit" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {MeasurementUnitsWithLabel.map((units) => (
                                                        <SelectItem key={units.value} value={units.value}>{units.label}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormDescription>Select the measurement unit for the product.</FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </TabsContent>
                        </Tabs>
                        <Button type="submit">Save Product</Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
