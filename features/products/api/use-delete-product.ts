import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";

type ResponseType = {
    id: string;
};

export const useDeleteProduct = (id: string, dashboardId: string) => {
    const queryClient = useQueryClient();

    const mutation = useMutation<ResponseType, Error>({
        mutationFn: async () => {
            return toast.promise(
                axios.delete(`/api/product?dashboardId=${dashboardId}&id=${id}`),
                {
                    loading: "Deleting product...",
                    success: "Product deleted",
                    error: "Failed to delete product",
                }
            );
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["product", dashboardId, id] });
            queryClient.invalidateQueries({ queryKey: ["products", dashboardId] });
            queryClient.invalidateQueries({ queryKey: ["categories", dashboardId] });
            queryClient.invalidateQueries({ queryKey: ["inventories", dashboardId] });
            queryClient.invalidateQueries({
                predicate: (query) =>
                    query.queryKey[0] === "inventory" &&
                    query.queryKey[1] === dashboardId
            });
        },
    });

    return mutation;
};
