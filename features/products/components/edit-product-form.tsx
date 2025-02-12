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
  ProductStatusesWithLabel,
  ProductPriceMethodsWithLabel,
  ProductStockMethodsWithLabel,
  MeasurementUnitsWithLabel,
  ProductPriceMethods,
} from "@/constants"
import { editProductFormSchema } from "@/schema/products"
import { Textarea } from "@/components/ui/textarea"
import { Select as CreatableSelect } from "@/components/select"



type ProductFormValues = z.infer<typeof editProductFormSchema>

type Props = {
  autoUpdate: boolean | undefined;
  defaultValues: ProductFormValues;
  onSubmit: (values: ProductFormValues) => void;
  disabled?: boolean;
  onCreateCategory: (name: string) => void
  CategoryOptions: {
    label: string;
    value: string;
  }[];
  isLoading: boolean;
  dashboardId: string
}

export const EditProductForm = ({
  autoUpdate,
  defaultValues,
  onSubmit,
  disabled,
  CategoryOptions,
  onCreateCategory,
  isLoading,
  dashboardId
}: Props) => {

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(editProductFormSchema),
    defaultValues: defaultValues
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
      <form onSubmit={form.handleSubmit(handleSubmit)} className="grid gap-2 md:grid-cols-2">
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
                  options={CategoryOptions}
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
                Select the current status of the product, or set it manually or automatically from the settings.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
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
        <FormField
          control={form.control}
          name="warehouseLocation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Warehouse Location</FormLabel>
              <FormControl>
                <Input placeholder="Enter warehouse location" {...field} />
              </FormControl>
              <FormDescription>Specify where this product is stored in the warehouse.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem className="md:col-span-2">
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter product description"
                  {...field}
                  disabled={disabled}
                  value={field.value}
                />
              </FormControl>
              <FormDescription>Provide a brief description of the product.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-fit mt-2" disabled={disabled}>
          Save Product
        </Button>
      </form>
    </Form>
  )
}
