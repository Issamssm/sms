import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
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
        Error,
        RequestType
    >({
        mutationFn: async (json) => {
            const response = await axios.post(`/api/categories?dashboardId=${dashboardId}`, json);
            return response.data;
        },
        onSuccess: () => {
            toast.success("Categorie created");
            queryClient.invalidateQueries({ queryKey: ["categories", dashboardId] });
        },
        onError: () => {
            toast.error("Failed to create categorie");
        },
    });

    return mutation;
};
