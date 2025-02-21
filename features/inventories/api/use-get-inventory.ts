import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export type InventoryItem = {
    id: string;
    quantity: number;
    price: number;
    date: Date;
    expiryDate: Date | null;
    partner: string | null;
    type: "income" | "outcome";
    dashboardId: string;
    product: string;
    productId: string;
    createdAt: Date;
    notes: string | null;
    invoiceNumber: string | null;
    location: string | null;
}


export const useGetInventory = (dashboardId: string, id?: string) => {
    const query = useQuery<InventoryItem, Error>({
        enabled: !!dashboardId && !!id,
        queryKey: ["inventory", dashboardId, id],
        queryFn: async (): Promise<InventoryItem> => {
            try {
                const response = await axios.get(`/api/inventory/getInventory?dashboardId=${dashboardId}&id=${id}`);
                return response.data;
            } catch (error) {
                console.error("Error fetching inventory:", error);
                throw new Error("Failed to fetch inventory");
            }
        },
    });

    return query;
};