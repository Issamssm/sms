import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

type ResponseType = {
    id: string;
};

export const useDeleteProduct = (id: string, dashboardId: string) => {
    const queryClient = useQueryClient();
    const router = useRouter();

    const mutation = useMutation<ResponseType, Error>({
        mutationFn: async () => {
            return toast.promise(
                axios.delete(`/api/product?dashboardId=${dashboardId}&id=${id}`),
                {
                    loading: "Deleting products...",
                    success: "Product deleted",
                    error: "Failed to delete product",
                }
            );
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["product", { id, dashboardId }] });
            queryClient.invalidateQueries({ queryKey: ["products", dashboardId] });

            router.replace(`/${dashboardId}/products`);
        },
    });

    return mutation;
};
