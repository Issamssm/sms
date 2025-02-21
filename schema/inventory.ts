import { z } from "zod";

// create InventoryIncome schema
export const InventoryIncomeFormSchema = z.object({
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
    notes: z.string()
        .optional()
        .refine((val) => !val || val.split(/\s+/).length <= 60, {
            message: 'The text must not exceed 60 words',
        }),
})

// create InventoryOutcome schema
export const InventoryOutcomeFormSchema = z.object({
    productId: z.string({
        message: "Product is required.",
    }),
    quantity: z.union([z.string(), z.number()])
        .transform((val) => Number(val))
        .refine((val) => !isNaN(val) && val >= 0, {
            message: "Must be a valid positive number",
        }),
    sellingPrice: z.union([z.string(), z.number()])
        .transform((val) => Number(val))
        .refine((val) => !isNaN(val) && val >= 0, {
            message: "Must be a valid positive number",
        }),
    customerId: z.string().optional(),
    shippedAt: z.date(),
    invoiceNumber: z.string().optional(),
    notes: z.string()
        .optional()
        .refine((val) => !val || val.split(/\s+/).length <= 60, {
            message: 'The text must not exceed 60 words',
        }),
    location: z.string().optional(),
})