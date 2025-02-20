import db from '@/lib/db';
import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export async function GET(
    req: Request
) {
    try {
        const { userId } = await auth();

        const url = new URL(req.url);
        const dashboardId = url.searchParams.get("dashboardId");
        const id = url.searchParams.get("id");

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 403 });
        }

        if (!dashboardId) {
            return new NextResponse("Dashboard ID is required", { status: 400 });
        }

        if (!id) {
            return new NextResponse("Product ID is required", { status: 400 });
        }

        const product = await db.product.findFirst({
            where: {
                dashboardId,
                id,
            },
            include: {
                inventoriesIncome: {
                    select: {
                        id: true,
                        quantity: true,
                        costPrice: true,
                        purchaseDate: true,
                        product: { select: { name: true } },
                        dashboardId: true,
                        productId: true,
                        createdAt: true
                    }
                },
                inventoriesOutcome: {
                    select: {
                        id: true,
                        quantity: true,
                        sellingPrice: true,
                        shippedAt: true,
                        product: { select: { name: true } },
                        dashboardId: true,
                        productId: true,
                        createdAt: true
                    }
                }
            }
        });

        const inventories = [
            ...(product?.inventoriesIncome || []).map(item => ({
                id: item.id,
                quantity: item.quantity,
                price: item.costPrice ? Number(item.costPrice) : 0,
                date: item.purchaseDate,
                product: item.product.name,
                type: "income",
                dashboardId: item.dashboardId,
                productId: item.productId,
                createdAt: item.createdAt,
            })),
            ...(product?.inventoriesOutcome || []).map(item => ({
                id: item.id,
                quantity: item.quantity,
                price: item.sellingPrice ? Number(item.sellingPrice) : 0,
                date: item.shippedAt,
                product: item.product.name,
                type: "outcome",
                dashboardId: item.dashboardId,
                productId: item.productId,
                createdAt: item.createdAt,
            }))
        ];


        return NextResponse.json({
            product: {
                id: product?.id,
                name: product?.name,
                description: product?.description,
                dashboardId: product?.dashboardId,
                sellingPrice: product?.sellingPrice ? Number(product?.sellingPrice) : 0,
                status: product?.status,
                categoryId: product?.categoryId,
                currentStock: product?.currentStock ? Number(product?.currentStock) : 0,
                stockMethode: product?.stockMethode,
                priceMethode: product?.priceMethode,
                minInventory: product?.minInventory ? Number(product?.minInventory) : 0,
                measureUnit: product?.measureUnit,
                warehouseLocation: product?.warehouseLocation,
            },
            inventories
        });
    } catch (error) {
        console.log('[PRODUCT_GET]', error);
        return new NextResponse("Internal error", { status: 500 });
    }
};