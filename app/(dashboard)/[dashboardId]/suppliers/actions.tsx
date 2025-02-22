"use client"

import { FileText, MoreHorizontal, Trash } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"

import { useDeleteSupplier } from "@/features/suppliers/api/use-delete-supplier";

import { useConfirm } from "@/hooks/use-confirm";
import { useEditSupplierState } from "@/features/suppliers/hook/use-edit-supplier-dialog";


type Props = {
    id: string;
    dashboardId: string;
}

export const Actions = ({ id, dashboardId }: Props) => {
    const { onOpen } = useEditSupplierState()
    const [ConfirmDialog, confirm] = useConfirm(
        "Delete Supplier",
        "Are you sure you want to delete this supplier?"
    )

    const deleteMutation = useDeleteSupplier(id, dashboardId);

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
