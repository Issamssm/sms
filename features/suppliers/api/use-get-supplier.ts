import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { SupplierResponse } from "./use-get-suppliers";


export const useGetSupplier = (dashboardId: string, id?: string) => {
    const query = useQuery<SupplierResponse, Error>({
        enabled: !!dashboardId && !!id,
        queryKey: ["supplier", dashboardId, id],
        queryFn: async (): Promise<SupplierResponse> => {
            try {
                const response = await axios.get<SupplierResponse>(`/api/supplier/getsupplier?dashboardId=${dashboardId}&id=${id}`);
                return response.data;
            } catch (error) {
                console.error("Error fetching supplier:", error);
                throw new Error("Failed to fetch supplier");
            }
        },
    });

    return query;
};
