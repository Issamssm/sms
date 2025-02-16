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
import { Loader } from "lucide-react"


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
                <div className="flex items-center gap-2">
                    <Button type="submit" disabled={disabled}>
                        {disabled && <Loader className="animate-spin" />}
                        create category
                    </Button>
                    <Button type="button" disabled={disabled} variant={"outline"} onClick={onClose}>
                        Cancel
                    </Button>
                </div>
            </form>
        </Form>
    )
}
