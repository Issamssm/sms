import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { CustomerResponse } from "./use-get-customers";


export const useGetCustomer = (dashboardId: string, id?: string) => {
    const query = useQuery<CustomerResponse, Error>({
        enabled: !!dashboardId && !!id,
        queryKey: ["customer", dashboardId, id],
        queryFn: async (): Promise<CustomerResponse> => {
            try {
                const response = await axios.get<CustomerResponse>(`/api/customer/getcustomer?dashboardId=${dashboardId}&id=${id}`);
                return response.data;
            } catch (error) {
                console.error("Error fetching customer:", error);
                throw new Error("Failed to fetch customer");
            }
        },
    });

    return query;
};
