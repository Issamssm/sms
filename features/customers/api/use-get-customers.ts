import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export type CustomerResponse = {
    id: string;
    name: string;
    contactInfo?: string | null;
    address?: string | null;
    dashboardId: string;
    createdAt: Date;
    updatedAt: Date;
    // inventoryOutcome: InventoryOutcomeResponse[];
};



export const useGetCustomers = (dashboardId: string) => {
    const query = useQuery<CustomerResponse[], Error>({
        enabled: !!dashboardId,
        queryKey: ["customers", dashboardId],
        queryFn: async (): Promise<CustomerResponse[]> => {
            try {
                const response = await axios.get<CustomerResponse[]>(`/api/customer?dashboardId=${dashboardId}`);
                return response.data;
            } catch (error) {
                console.error("Error fetching customers:", error);
                throw new Error("Failed to fetch customers");
            }
        },
    });

    return query;
};