import { useQuery } from "@tanstack/react-query";
import axios from "axios";


export const useGetProduct = (dashboardId: string, id: string) => {
    const query = useQuery({
        enabled: !!dashboardId && !!id,
        queryKey: ["product", dashboardId, id],
        queryFn: async () => {
            try {
                const response = await axios.get(`/api/product/getproduct?dashboardId=${dashboardId}&id=${id}`);
                return response.data;
            } catch (error) {
                console.error("Error fetching product:", error);
                throw new Error("Failed to fetch product");
            }
        },
    });

    return query;
};
