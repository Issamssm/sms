import { createProductFormSchema } from "@/schema/products";
import { $Enums } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import toast from 'react-hot-toast';
import { z } from "zod";


type ResponseType = {
    id: string;
    dashboardId: string;
    name: string;
    status: $Enums.ProductStatus;
    sellingPrice: Decimal | null;
    category: {
        name: string;
    } | null;
    currentStock: Decimal | null;
}

type RequestType = z.infer<typeof createProductFormSchema>


export const useCreateProduct = (dashboardId: string) => {
    const queryClient = useQueryClient();

    const mutation = useMutation<
        ResponseType,
        AxiosError,
        RequestType
    >({
        mutationFn: async (json) => {
            const response = await axios.post(`/api/product?dashboardId=${dashboardId}`, json);
            return response.data;
        },
        onSuccess: () => {
            toast.success("Product created");
            queryClient.invalidateQueries({ queryKey: ["products", dashboardId] });
        },
        onError: (error: AxiosError) => {
            const errorMessage = (error.response?.data as { message: string })?.message;

            if (errorMessage) {
                toast.error(errorMessage);
            } else {
                toast.error("Failed to create product");
            }
        },
    });

    return mutation;
};
