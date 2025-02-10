import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";

type ResponseType = {
    id: string;
};

export const useDeleteCategory = (id: string, dashboardId: string) => {
    const queryClient = useQueryClient();

    const mutation = useMutation<ResponseType, Error>({
        mutationFn: async () => {
            return toast.promise(
                axios.delete(`/api/category?dashboardId=${dashboardId}&id=${id}`),
                {
                    loading: "Deleting category...",
                    success: "category deleted",
                    error: "Failed to delete category",
                }
            );
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["products", dashboardId] });
            queryClient.invalidateQueries({ queryKey: ["categories", dashboardId] });
        },
    });

    return mutation;
};
