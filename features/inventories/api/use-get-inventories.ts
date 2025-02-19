import { useQuery, useQueryClient } from "@tanstack/react-query";
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
    createdAt: Date
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

export const useGetInventoriesByProductId = (dashboardId: string, productId?: string) => {
    const queryClient = useQueryClient();

    const inventoriesData = queryClient.getQueryData<InventoryItem[]>(["inventories", dashboardId]);

    if (!inventoriesData) {
        console.log("Inventories not found in cache");
        return { ascInventoryIncome: [], descInventoryIncome: [], ascInventoryOutcome: [], descInventoryOutcome: [] };
    }

    const filterAndSortInventory = (type: "income" | "outcome") => {
        const filteredData = inventoriesData
            .filter((inventory) => inventory.productId === productId && inventory.type === type)
            .map((inventory) => ({
                quantity: inventory.quantity,
                costPrice: Number(inventory.price),
                createdAt: new Date(inventory.date),
            }));

        const asc = [...filteredData].sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
        const desc = [...filteredData].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

        return { asc, desc };
    };

    const { asc: ascInventoryIncome, desc: descInventoryIncome } = filterAndSortInventory("income");
    const { asc: ascInventoryOutcome, desc: descInventoryOutcome } = filterAndSortInventory("outcome");

    return { ascInventoryIncome, descInventoryIncome, ascInventoryOutcome, descInventoryOutcome };
};


