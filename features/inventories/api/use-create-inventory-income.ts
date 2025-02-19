import { InventoryIncomeFormSchema } from "@/schema/inventory";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import toast from 'react-hot-toast';
import { z } from "zod";


type RequestType = z.infer<typeof InventoryIncomeFormSchema>


export const useCreateInventoryIncome = (dashboardId: string) => {
    const queryClient = useQueryClient();

    const mutation = useMutation<
        ResponseType,
        AxiosError,
        RequestType
    >({
        mutationFn: async (json) => {
            const response = await axios.post(`/api/inventory/income?dashboardId=${dashboardId}`, json);
            return response.data;
        },
        onSuccess: () => {
            toast.success("Inventory created");
            queryClient.invalidateQueries({ queryKey: ["inventories", dashboardId] })
            queryClient.invalidateQueries({ queryKey: ["products", dashboardId] });
            queryClient.invalidateQueries({
                predicate: (query) =>
                    query.queryKey[0] === "inventory" &&
                    query.queryKey[1] === dashboardId
            });
            queryClient.invalidateQueries({
                predicate: (query) =>
                    query.queryKey[0] === "product" &&
                    query.queryKey[1] === dashboardId
            });
        },
        onError: (error: AxiosError) => {
            const errorMessage = (error.response?.data as { message: string })?.message;

            if (errorMessage) {
                toast.error(errorMessage);
            } else {
                toast.error("Failed to create inventory");
            }
        },
    });

    return mutation;
};
