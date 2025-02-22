import { CustomerFormSchema } from "@/schema/customer";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import toast from 'react-hot-toast';
import { z } from "zod";


type RequestType = z.infer<typeof CustomerFormSchema>


export const useEditCustomer = (dashboardId: string, id?: string) => {
    const queryClient = useQueryClient();

    const mutation = useMutation<
        ResponseType,
        AxiosError,
        RequestType
    >({
        mutationFn: async (json) => {
            const response = await axios.patch(`/api/customer?dashboardId=${dashboardId}&id=${id}`, json);
            return response.data;
        },
        onSuccess: () => {
            toast.success("Customer edited");
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
        onError: (error: AxiosError) => {
            const errorMessage = (error.response?.data as { message: string })?.message;

            if (errorMessage) {
                toast.error(errorMessage);
            } else {
                toast.error("Failed to edited customer");
            }
        },
    });

    return mutation;
};
