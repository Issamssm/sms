import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormMessage
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { createCategoryFormSchema } from "@/schema/categories"


type CategoryFormValues = z.infer<typeof createCategoryFormSchema>

type Props = {
    onSubmit: (values: CategoryFormValues) => void;
    disabled?: boolean;
    onClose: () => void;
}

export const DialogFormCategory = ({
    onSubmit,
    disabled,
    onClose,
}: Props) => {

    const form = useForm<CategoryFormValues>({
        resolver: zodResolver(createCategoryFormSchema),
        defaultValues: {
            name: ""
        },
    })

    const handleSubmit = (values: CategoryFormValues) => {
        onSubmit(values);
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Input placeholder="Category name" {...field} disabled={disabled} />
                            </FormControl>
                            <FormDescription>Enter the name of the category.</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" disabled={disabled}>
                    Save Category
                </Button>
                <Button type="button" variant={"outline"} onClick={onClose} className="ml-4">
                    Cancel
                </Button>
            </form>
        </Form>
    )
}
