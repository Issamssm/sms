"use client"

import { Eye, MoreHorizontal, Trash } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"

import { useDeleteCategory } from "@/features/categories/api/use-delete-category";

import { useConfirm } from "@/hooks/use-confirm";


type Props = {
    id: string;
    dashboardId: string;
}

export const Actions = ({ id, dashboardId }: Props) => {
    const [ConfirmDialog, confirm] = useConfirm(
        "Delete Category",
        "Are you sure you want to delete this category?"
    )

    const deleteMutation = useDeleteCategory(id, dashboardId);

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
                        onClick={() => {}}
                    >
                        <Eye className="size-4 mr-2" />
                        View products
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
