import { useQuery } from "@tanstack/react-query";
import axios from "axios";

type ResponseType = {
    dashboardId: string;
    id: string;
    name: string;
    products: {
        id: string;
    }[];
}[];

export const useGetCategories = (dashboardId: string) => {
    const query = useQuery<ResponseType, Error>({
        enabled: !!dashboardId,
        queryKey: ["categories", dashboardId],
        queryFn: async (): Promise<ResponseType> => {
            try {
                const response = await axios.get<ResponseType>(`/api/category?dashboardId=${dashboardId}`);
                return response.data;
            } catch (error) {
                console.error("Error fetching categories:", error);
                throw new Error("Failed to fetch categories");
            }
        },
    });

    return query;
};
