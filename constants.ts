import { z } from "zod";

export const MeasurementUnits = [
    "PIECE",
    "KILOGRAM",
    "GRAM",
    "LITER",
    "MILLILITER",
    "METER",
    "CENTIMETER",
    "MILLIMETER",
    "BOX",
    "PACK",
    "DOZEN",
    "NONE",
] as const;
export const MeasurementUnitsWithLabel = [
    { value: "PIECE", label: "Piece" },
    { value: "KILOGRAM", label: "Kilogram" },
    { value: "GRAM", label: "Gram" },
    { value: "LITER", label: "Liter" },
    { value: "MILLILITER", label: "Milliliter" },
    { value: "METER", label: "Meter" },
    { value: "CENTIMETER", label: "Centimeter" },
    { value: "MILLIMETER", label: "Millimeter" },
    { value: "BOX", label: "Box" },
    { value: "PACK", label: "Pack" },
    { value: "DOZEN", label: "Dozen" },
    { value: "NONE", label: "None" },
] as const;
export const MeasurementUnitSchema = z.enum(MeasurementUnits);



export const ProductStatuses = ["AVAILABLE", "OUT_OF_STOCK", "LOW_STOCK"] as const;
export const ProductStatusesWithLabel = [
    { value: "AVAILABLE", label: "Available", color: "bg-green-500" },
    { value: "OUT_OF_STOCK", label: "Out of Stock", color: "bg-red-500" },
    { value: "LOW_STOCK", label: "Low Stock", color: "bg-yellow-500" },
] as const;
export const ProductStatusSchema = z.enum(ProductStatuses);



export const ProductStocksMethods = ["FIFO", "LIFO", "CUMP", "HPP", "LPP", "MANUAL"] as const;
export const ProductStockMethodsWithLabel = [
    { value: "FIFO", label: "FIFO (First In First Out)" },
    { value: "LIFO", label: "LIFO (Last In First Out)" },
    { value: "CUMP", label: "CUMP (Weighted Average Cost)" },
    { value: "HPP", label: "HPP (Highest Purchase Price)" },
    { value: "LPP", label: "LPP (Lowest Purchase Price)" },
    { value: "MANUAL", label: "Manual" },
] as const;
export const ProductStocksSchema = z.enum(ProductStocksMethods);



export const ProductPriceMethods = ["WAC", "LPP", "HSP", "LSP", "MANUAL"] as const;
export const ProductPriceMethodsWithLabel = [
    { value: "WAC", label: "Weighted Average Cost (WAC)" },
    { value: "LPP", label: "Lowest Purchase Price (LPP)" },
    { value: "HSP", label: "Highest Selling Price (HSP)" },
    { value: "LSP", label: "Lowest Selling Price (LSP)" },
    { value: "MANUAL", label: "Manual" },
] as const;
export const ProductPriceSchema = z.enum(ProductPriceMethods);
export type ProductPriceType = (typeof ProductPriceMethods)[number];
