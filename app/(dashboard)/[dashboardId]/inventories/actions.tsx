"use client"

import { useRouter } from "next/navigation";
import { FileText, MoreHorizontal, Trash } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"

import { useDeleteInventory } from "@/features/inventories/api/use-delete-inventory";

import { useConfirm } from "@/hooks/use-confirm";


type Props = {
    id: string;
    dashboardId: string;
    type: string
}

export const Actions = ({ id, dashboardId, type }: Props) => {
    const router = useRouter()
    const [ConfirmDialog, confirm] = useConfirm(
        "Delete Inventory",
        "Are you sure you want to delete this inventory?"
    )

    const deleteMutation = useDeleteInventory(id, dashboardId, type);

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
                        onClick={() => router.push(`/${dashboardId}/inventories/${id}`)}
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
