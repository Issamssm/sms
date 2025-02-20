import { $Enums } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export type InventoryProductItem = {
    id: string;
    quantity: number;
    price: number;
    date: Date;
    product: string;
    type: "income" | "outcome";
    dashboardId: string;
    productId: string;
    createdAt: Date;
};

export type ProductResponseType = {
    product: {
        id: string;
        name: string;
        description: string | null;
        dashboardId: string;
        sellingPrice: number;
        status: $Enums.ProductStatus;
        categoryId: string | null;
        currentStock: number;
        stockMethode: $Enums.ProductStocks;
        priceMethode: $Enums.ProductPrice;
        minInventory: number;
        measureUnit: $Enums.MeasurementUnit;
        warehouseLocation: string | null;
    },
    inventories: InventoryProductItem[];
};

export const useGetProduct = (dashboardId: string, id: string) => {
    const query = useQuery<ProductResponseType, Error>({
        enabled: !!dashboardId && !!id,
        queryKey: ["product", dashboardId, id],
        queryFn: async (): Promise<ProductResponseType> => {
            try {
                const response = await axios.get<ProductResponseType>(`/api/product/getproduct?dashboardId=${dashboardId}&id=${id}`);
                return response.data;
            } catch (error) {
                console.error("Error fetching product:", error);
                throw new Error("Failed to fetch product");
            }
        },
    });

    return query;
};
