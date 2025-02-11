import { z } from "zod";

// product schema
export const createCategoryFormSchema = z.object({
    name: z.string().min(3, {
        message: "Name must be at least 3 characters.",
    })
})