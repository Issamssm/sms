import { z } from "zod";

export const SupplierFormSchema = z.object({
    name: z.string().min(3, {
        message: "Name must be at least 3 characters.",
    }),
    address: z.string().optional(),
    contactInfo: z.string().optional(),
})