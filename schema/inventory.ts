import { z } from "zod";

// create InventoryIncome schema
export const createInventoryIncomeFormSchema = z.object({
    productId: z.string({
        message: "Product is required.",
    }),
    quantity: z.union([z.string(), z.number()])
        .transform((val) => Number(val))
        .refine((val) => !isNaN(val) && val >= 0, {
            message: "Must be a valid positive number",
        }),
    costPrice: z.union([z.string(), z.number()])
        .transform((val) => Number(val))
        .refine((val) => !isNaN(val) && val >= 0, {
            message: "Must be a valid positive number",
        }),
    supplierId: z.string().optional(),
    purchaseDate: z.date(),
    expiryDate: z.date().optional().nullable(),
    invoiceNumber: z.string().optional(),
    location: z.string().optional(),
    notes: z.string().optional(),
})