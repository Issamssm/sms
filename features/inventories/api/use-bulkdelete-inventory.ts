import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";


type RequestType = {
    ids: string[]
}


export const useBulkDeleteInventories = (dashboardId: string) => {
    const queryClient = useQueryClient();

    const mutation = useMutation<
        void,
        Error,
        RequestType
    >({
        mutationFn: async (json) => {
            const response = await axios.delete(`/api/inventory/bulkdelete?dashboardId=${dashboardId}`, {
                data: json
            });
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["inventories", dashboardId] })
            queryClient.invalidateQueries({ queryKey: ["products", dashboardId] });
        }
    });
    return mutation;
};