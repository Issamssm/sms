import { CustomerFormSchema } from "@/schema/customer";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import toast from 'react-hot-toast';
import { z } from "zod";


type RequestType = z.infer<typeof CustomerFormSchema>


export const useCreateCustomer = (dashboardId: string) => {
    const queryClient = useQueryClient();

    const mutation = useMutation<
        ResponseType,
        AxiosError,
        RequestType
    >({
        mutationFn: async (json) => {
            const response = await axios.post(`/api/customer?dashboardId=${dashboardId}`, json);
            return response.data;
        },
        onSuccess: () => {
            toast.success("Customer created");
            queryClient.invalidateQueries({ queryKey: ["customers", dashboardId] })
        },
        onError: (error: AxiosError) => {
            const errorMessage = (error.response?.data as { message: string })?.message;

            if (errorMessage) {
                toast.error(errorMessage);
            } else {
                toast.error("Failed to create customer");
            }
        },
    });

    return mutation;
};
