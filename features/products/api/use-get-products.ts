import { $Enums } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

type ResponseType = {
    id: string;
    dashboardId: string;
    name: string;
    status: $Enums.ProductStatus;
    sellingPrice: Decimal | null;
    category: {
        name: string;
    } | null;
}[];

export const useGetProducts = (dashboardId: string) => {
    const query = useQuery<ResponseType, Error>({
        enabled: !!dashboardId,
        queryKey: ["products", dashboardId],
        queryFn: async (): Promise<ResponseType> => {
            try {
                const response = await axios.get<ResponseType>(`/api/product?dashboardId=${dashboardId}`);
                return response.data;
            } catch (error) {
                console.error("Error fetching products:", error);
                throw new Error("Failed to fetch products");
            }
        },
    });

    return query;
};
