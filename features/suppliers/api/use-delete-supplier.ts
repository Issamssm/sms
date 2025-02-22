import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";

type ResponseType = {
    id: string;
};

export const useDeleteSupplier = (id: string, dashboardId: string) => {
    const queryClient = useQueryClient();

    const mutation = useMutation<ResponseType, Error>({
        mutationFn: async () => {
            return toast.promise(
                axios.delete(`/api/supplier?dashboardId=${dashboardId}&id=${id}`),
                {
                    loading: "Deleting supplier...",
                    success: "Supplier deleted",
                    error: "Failed to delete supplier",
                }
            );
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["suppliers", dashboardId] });
            queryClient.invalidateQueries({ queryKey: ["inventroies", dashboardId] });
            queryClient.invalidateQueries({
                predicate: (query) =>
                    query.queryKey[0] === "supplier" &&
                    query.queryKey[1] === dashboardId
            });
            queryClient.invalidateQueries({
                predicate: (query) =>
                    query.queryKey[0] === "inventory" &&
                    query.queryKey[1] === dashboardId
            });
        },
    });

    return mutation;
};
