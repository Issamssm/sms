import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";


type ResponseType = {
    id: string;
}

export const useDeleteProduct = (id: string, dashboardId: string) => {
    const queryClient = useQueryClient();

    const mutation = useMutation<
        ResponseType,
        Error
    >({
        mutationFn: async () => {
            const response = await axios.delete(`/api/product?dashboardId=${dashboardId}&id=${id}`);
            return response.data;
        },
        onSuccess: () => {
            toast.success("Product deleted")
            queryClient.invalidateQueries({ queryKey: ["product", { id, dashboardId }] })
            queryClient.invalidateQueries({ queryKey: ["products", dashboardId] })
        },
        onError: () => {
            toast.error("Failed to delete product")
        }
    });
    return mutation;
};