"use client"

import { FileText, MoreHorizontal, Trash } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"

import { useDeleteCustomer } from "@/features/customers/api/use-delete-customer";

import { useConfirm } from "@/hooks/use-confirm";
import { useEditCustomerState } from "@/features/customers/hook/use-edit-customer-dialog";


type Props = {
    id: string;
    dashboardId: string;
}

export const Actions = ({ id, dashboardId }: Props) => {
    const { onOpen } = useEditCustomerState()
    const [ConfirmDialog, confirm] = useConfirm(
        "Delete Customer",
        "Are you sure you want to delete this customer?"
    )

    const deleteMutation = useDeleteCustomer(id, dashboardId);

    const handleDelete = async () => {
        const ok = await confirm();
        if (ok) {
            deleteMutation.mutate()
        }
    };

    return (
        <>
            <ConfirmDialog />
            <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                    <Button variant={"ghost"} className="size-8 p-0">
                        <MoreHorizontal className="size-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem
                        disabled={deleteMutation.isPending}
                        onClick={() => onOpen(id)}
                    >
                        <FileText className="size-4 mr-2" />
                        Details
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        disabled={deleteMutation.isPending}
                        onClick={handleDelete}
                    >
                        <Trash className="size-4 mr-2" />
                        Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    )
}
