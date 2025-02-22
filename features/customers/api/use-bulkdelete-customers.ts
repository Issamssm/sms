import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";


type RequestType = {
    ids: string[]
}


export const useBulkDeleteCustomers = (dashboardId: string) => {
    const queryClient = useQueryClient();

    const mutation = useMutation<
        void,
        Error,
        RequestType
    >({
        mutationFn: async (json) => {
            const response = await axios.delete(`/api/customer/bulkdelete?dashboardId=${dashboardId}`, {
                data: json
            });
            return response.data;
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
        }
    });
    return mutation;
};