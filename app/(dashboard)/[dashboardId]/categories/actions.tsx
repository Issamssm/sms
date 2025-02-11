"use client"

import { Trash } from "lucide-react";

import { Button } from "@/components/ui/button";

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
            <Button variant={"ghost"}
                className="size-4 p-0"
                onClick={handleDelete}
                disabled={deleteMutation.isPending}
            >
                <Trash className="size-4 mr-2" />
            </Button>
        </>
    )
}
