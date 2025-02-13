import { useQuery } from "@tanstack/react-query";
import axios from "axios";

type InventoryItem = {
    id: string;
    quantity: number;
    price: number;
    date: Date;
    product: string;
    type: string;
    dashboardId: string
}

export const useGetInventories = (dashboardId: string) => {
    const query = useQuery<InventoryItem[], Error>({
        enabled: !!dashboardId,
        queryKey: ["inventories", dashboardId],
        queryFn: async (): Promise<InventoryItem[]> => {
            try {
                const response = await axios.get(`/api/inventory?dashboardId=${dashboardId}`);
                return response.data;
            } catch (error) {
                console.error("Error fetching inventories:", error);
                throw new Error("Failed to fetch inventories");
            }
        },
    });

    return query;
};
