import { z } from "zod";
import {
    MeasurementUnitSchema,
    ProductStatusSchema,
    ProductStocksSchema,
    ProductPriceSchema
} from "@/constants"

// product schema
export const createProductFormSchema = z.object({
    name: z.string().min(3, {
        message: "Name must be at least 3 characters.",
    }),
    status: ProductStatusSchema,
    categoryId: z.string().optional().nullable(),
    sellingPrice: z.union([z.string(), z.number()])
        .transform((val) => Number(val))
        .refine((val) => !isNaN(val) && val >= 0, {
            message: "Must be a valid positive number",
        }),
    priceMethode: ProductPriceSchema,
    stockMethode: ProductStocksSchema,
    minInventory: z.union([z.string(), z.number()])
        .transform((val) => Number(val))
        .refine((val) => !isNaN(val) && val >= 0, {
            message: "Must be a valid positive number",
        }),

    measureUnit: MeasurementUnitSchema,
})