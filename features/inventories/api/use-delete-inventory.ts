import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";

type ResponseType = {
    id: string;
};

export const useDeleteInventory = (id: string, dashboardId: string, type: string) => {
    const queryClient = useQueryClient();

    const mutation = useMutation<ResponseType, Error>({
        mutationFn: async () => {
            return toast.promise(
                axios.delete(`/api/inventory?dashboardId=${dashboardId}&id=${id}&type=${type}`),
                {
                    loading: "Deleting inventory...",
                    success: "Inventory deleted",
                    error: "Failed to delete inventory",
                }
            );
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["inventory", id, dashboardId] });
            queryClient.invalidateQueries({ queryKey: ["inventories", dashboardId] });
        },
    });

    return mutation;
};
