import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export type SupplierResponse = {
    id: string;
    name: string;
    address?: string | null;
    contactInfo: string;
    dashboardId: string;
    createdAt: Date;
    updatedAt: Date;
    // inventoryIncome: InventoryIncomeResponse[];
};


export const useGetSuppliers = (dashboardId: string) => {
    const query = useQuery<SupplierResponse[], Error>({
        enabled: !!dashboardId,
        queryKey: ["suppliers", dashboardId],
        queryFn: async (): Promise<SupplierResponse[]> => {
            try {
                const response = await axios.get<SupplierResponse[]>(`/api/supplier?dashboardId=${dashboardId}`);
                return response.data;
            } catch (error) {
                console.error("Error fetching suppliers:", error);
                throw new Error("Failed to fetch suppliers");
            }
        },
    });

    return query;
};