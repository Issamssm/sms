import * as z from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

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
import { Textarea } from "@/components/ui/textarea"

import { Loader } from "lucide-react"

import { CustomerFormSchema } from "@/schema/customer"


type CustomerFormValues = z.infer<typeof CustomerFormSchema>

type Props = {
    onSubmit: (values: CustomerFormValues) => void;
    disabled?: boolean;
    onClose: () => void;
    initialValues?: CustomerFormValues;
    id?: string;
}

export const DialogFormCustomer = ({
    onSubmit,
    disabled,
    onClose,
    initialValues,
    id
}: Props) => {

    const form = useForm<CustomerFormValues>({
        resolver: zodResolver(CustomerFormSchema),
        defaultValues: initialValues ?? {
            name: "",
            address: "",
            contactInfo: "",
        },
    })

    const handleSubmit = (values: CustomerFormValues) => {
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
                                <Input placeholder="Customer name" {...field} value={field.value} disabled={disabled} />
                            </FormControl>
                            <FormDescription>Enter the name of the customer.</FormDescription>
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
                                <Input placeholder="Customer address" {...field} value={field.value} disabled={disabled} />
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
                                    placeholder="Customer contact info (e.g., Email, Phone number, Site web)"
                                    {...field}
                                    disabled={disabled}
                                    value={field.value}
                                    className="h-36 resize-none"
                                />
                            </FormControl>
                            <FormDescription>Enter the customer&apos;s contact information.</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="flex items-center gap-2">
                    <Button type="submit" disabled={disabled}>
                        {disabled && <Loader className="animate-spin" />}
                        {!id ? "Create Customer" : "Save"}
                    </Button>
                    <Button type="button" disabled={disabled} variant={"outline"} onClick={onClose}>
                        Cancel
                    </Button>
                </div>
            </form>
        </Form>
    )
}
