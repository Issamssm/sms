import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, useWatch } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
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
import { Select as CreatableSelect } from "@/components/select"
import {
    ProductStatusesWithLabel,
    ProductPriceMethodsWithLabel,
    ProductStockMethodsWithLabel,
    MeasurementUnitsWithLabel,
    ProductPriceMethods,
} from "@/constants"
import { createProductFormSchema } from "@/schema/products"


type ProductFormValues = z.infer<typeof createProductFormSchema>

type Props = {
    autoUpdate: boolean | undefined;
    dashboardId: string;
    onSubmit: (values: ProductFormValues) => void;
    disabled?: boolean;
    categoryOptions: { label: string; value: string }[];
    onCreateCategory: (name: string) => void;
    onClose: () => void;
    isLoading: boolean
}

export const DialogFormProduct = ({
    autoUpdate,
    dashboardId,
    onSubmit,
    disabled,
    categoryOptions,
    onCreateCategory,
    onClose,
    isLoading
}: Props) => {

    const form = useForm<ProductFormValues>({
        resolver: zodResolver(createProductFormSchema),
        defaultValues: {
            name: "",
            status: "OUT_OF_STOCK",
            categoryId: null,
            sellingPrice: 0,
            priceMethode: "MANUAL",
            stockMethode: "MANUAL",
            minInventory: 0,
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
            form.setValue("sellingPrice", 0);
        }
    };

    const handleSubmit = (values: ProductFormValues) => {
        onSubmit(values);
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
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
                                        <Input placeholder="Product name" {...field} disabled={disabled} />
                                    </FormControl>
                                    <FormDescription>Enter the name of the product.</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="categoryId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Category</FormLabel>
                                    <FormControl>
                                        <CreatableSelect
                                            dashboardId={dashboardId}
                                            placeholder="Select an category"
                                            options={categoryOptions}
                                            onCreate={onCreateCategory}
                                            value={field.value}
                                            onChange={field.onChange}
                                            disabled={disabled || isLoading}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="status"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Status {" "}
                                        {
                                            autoUpdate ? (
                                                <span className="text-xs text-red-500">
                                                    (Automatically determined)
                                                </span>
                                            ) : ""
                                        }
                                    </FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger disabled={autoUpdate || disabled}>
                                                <SelectValue placeholder="Select product status" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {ProductStatusesWithLabel.map((status) => (
                                                <SelectItem key={status.value} value={status.value}>{status.label}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormDescription>
                                        Select the current status of the product, or you can set it manually or automatically from the settings.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
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
                                            min={0}
                                            {...field}
                                            disabled={selectedPriceMethod !== "MANUAL" || disabled}
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
                                            <SelectTrigger disabled={disabled}>
                                                <SelectValue placeholder="Select price method" />
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
                                            <SelectTrigger disabled={disabled}>
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
                                        <Input type="number" placeholder="0" min={0} {...field} disabled={disabled} />
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
                                            <SelectTrigger disabled={disabled}>
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
                <Button type="submit" disabled={disabled}>
                    Save Product
                </Button>
                <Button type="button" variant={"outline"} onClick={onClose} className="ml-4">
                    Cancel
                </Button>
            </form>
        </Form>
    )
}
