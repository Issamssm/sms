import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";


type RequestType = {
    ids: string[]
}


export const useBulkDeleteProducts = (dashboardId: string) => {
    const queryClient = useQueryClient();

    const mutation = useMutation<
        void,
        Error,
        RequestType
    >({
        mutationFn: async (json) => {
            const response = await axios.delete(`/api/product/bulkdelete?dashboardId=${dashboardId}`, {
                data: json
            });
            return response.data;
        },
        onSuccess: () => {
            toast.success("Products deleted")
            queryClient.invalidateQueries({ queryKey: ["products", dashboardId] })
        },
        onError: () => {
            toast.error("Failed to delete products")
        }
    });
    return mutation;
};