import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";

type ResponseType = {
    id: string;
};

export const useDeleteCustomer = (id: string, dashboardId: string) => {
    const queryClient = useQueryClient();

    const mutation = useMutation<ResponseType, Error>({
        mutationFn: async () => {
            return toast.promise(
                axios.delete(`/api/customer?dashboardId=${dashboardId}&id=${id}`),
                {
                    loading: "Deleting customer...",
                    success: "Customer deleted",
                    error: "Failed to delete customer",
                }
            );
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["customers", dashboardId] });
            queryClient.invalidateQueries({ queryKey: ["inventroies", dashboardId] });
            queryClient.invalidateQueries({
                predicate: (query) =>
                    query.queryKey[0] === "customer" &&
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
