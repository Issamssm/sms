import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";


type RequestType = {
    ids: string[]
}


export const useBulkDeleteCategories = (dashboardId: string) => {
    const queryClient = useQueryClient();

    const mutation = useMutation<
        void,
        Error,
        RequestType
    >({
        mutationFn: async (json) => {
            const response = await axios.delete(`/api/category/bulkdelete?dashboardId=${dashboardId}`, {
                data: json
            });
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["products", dashboardId] });
            queryClient.invalidateQueries({ queryKey: ["categories", dashboardId] });
        }
    });
    return mutation;
};