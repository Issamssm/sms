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
import { SupplierFormSchema } from "@/schema/suppliers"
import { Loader } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"


type SupplierFormValues = z.infer<typeof SupplierFormSchema>

type Props = {
    onSubmit: (values: SupplierFormValues) => void;
    disabled?: boolean;
    onClose: () => void;
    initialValues?: SupplierFormValues;
    id?: string;
}

export const DialogFormSupplier = ({
    onSubmit,
    disabled,
    onClose,
    initialValues,
    id
}: Props) => {

    const form = useForm<SupplierFormValues>({
        resolver: zodResolver(SupplierFormSchema),
        defaultValues: initialValues ?? {
            name: "",
            address: "",
            contactInfo: "",
        },
    })

    const handleSubmit = (values: SupplierFormValues) => {
        onSubmit(values);
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 h-[360px]">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Input placeholder="Supplier name" {...field} value={field.value} disabled={disabled} />
                            </FormControl>
                            <FormDescription>Enter the name of the supplier.</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Input placeholder="Supplier address" {...field} value={field.value} disabled={disabled} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="contactInfo"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Textarea
                                    placeholder="Supplier contact info (e.g., Email, Phone number, Site web)"
                                    {...field}
                                    disabled={disabled}
                                    value={field.value}
                                    className="h-36 resize-none"
                                />
                            </FormControl>
                            <FormDescription>Enter the supplier&apos;s contact information.</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="flex items-center gap-2">
                    <Button type="submit" disabled={disabled}>
                        {disabled && <Loader className="animate-spin" />}
                        {!id ? "Create Supplier" : "Save"}
                    </Button>
                    <Button type="button" disabled={disabled} variant={"outline"} onClick={onClose}>
                        Cancel
                    </Button>
                </div>
            </form>
        </Form>
    )
}
