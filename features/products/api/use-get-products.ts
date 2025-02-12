import { $Enums } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useSearchParams } from "next/navigation";

type ResponseType = {
    id: string;
    dashboardId: string;
    name: string;
    status: $Enums.ProductStatus;
    sellingPrice: number | null;
    category: {
        name: string;
    } | null;
    currentStock: number | null;
}[];

export const useGetProducts = (dashboardId: string) => {
    const params = useSearchParams();
    const categoryId = params.get("categoryId") || "";

    const query = useQuery<ResponseType, Error>({
        enabled: !!dashboardId,
        queryKey: ["products", dashboardId, categoryId],
        queryFn: async (): Promise<ResponseType> => {
            try {
                const response = await axios.get<ResponseType>(
                    `/api/product?dashboardId=${dashboardId}&categoryId=${categoryId}`
                );

                return response.data.map(product => ({
                    ...product,
                    sellingPrice: product.sellingPrice ? Number(product.sellingPrice) : 0,
                    currentStock: product.currentStock ? Number(product.currentStock) : 0
                }));
            } catch (error) {
                console.error("Error fetching products:", error);
                throw new Error("Failed to fetch products");
            }
        },
    });

    return query;
};
