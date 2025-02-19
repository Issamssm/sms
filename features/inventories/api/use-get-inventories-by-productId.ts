import { useQuery } from "@tanstack/react-query";
import axios from "axios";

type InventoryItem = {
    id: string;
    quantity: number;
    price: number;
    date: Date;
    product: string;
    type: string;
    dashboardId: string;
    productId: string;
}

export const useGetInventoriesByProductId = (dashboardId: string, productId: string) => {
    const query = useQuery<InventoryItem[], Error>({
        enabled: !!dashboardId && !!productId,
        queryKey: ["inventory", dashboardId, productId],
        queryFn: async (): Promise<InventoryItem[]> => {
            try {
                const response = await axios.get(`/api/inventory/getInventoriesByProductId?dashboardId=${dashboardId}&productId=${productId}`);
                return response.data;
            } catch (error) {
                console.error("Error fetching inventories:", error);
                throw new Error("Failed to fetch inventories");
            }
        },
    });

    return query;
};
