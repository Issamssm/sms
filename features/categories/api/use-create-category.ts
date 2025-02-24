import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import toast from 'react-hot-toast';


type ResponseType = {
    dashboardId: string;
    id: string;
    name: string;
    products: {
        id: string;
    }[];
}

type RequestType = {
    name: string;
};

export const useCreateCategorie = (dashboardId: string) => {
    const queryClient = useQueryClient();

    const mutation = useMutation<
        ResponseType,
        AxiosError,
        RequestType
    >({
        mutationFn: async (json) => {
            const response = await axios.post(`/api/category?dashboardId=${dashboardId}`, json);
            return response.data;
        },
        onSuccess: () => {
            toast.success("Categorie created");
            queryClient.invalidateQueries({ queryKey: ["categories", dashboardId] });
        },
        onError: (error: AxiosError) => {
            const errorMessage = (error.response?.data as { message: string })?.message;

            if (errorMessage) {
                toast.error(errorMessage);
            } else {
                toast.error("Failed to create category");
            }        
        },
    });

    return mutation;
};
