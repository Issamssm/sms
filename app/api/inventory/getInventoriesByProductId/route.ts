import db from '@/lib/db';
import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
    try {
        const { userId } = await auth();

        const url = new URL(req.url);
        const dashboardId = url.searchParams.get("dashboardId");
        const productId = url.searchParams.get("productId");

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 403 });
        }

        if (!dashboardId) {
            return new NextResponse("Dashboard ID is required", { status: 400 });
        }

        if (!productId) {
            return new NextResponse("Product ID is required", { status: 400 });
        }

        const [inventoryIncome, inventoryOutcome] = await Promise.all([
            db.inventoryIncome.findMany({
                where: { dashboardId, productId },
                select: {
                    id: true,
                    quantity: true,
                    costPrice: true,
                    purchaseDate: true,
                    product: { select: { name: true } },
                    dashboardId: true,
                    productId: true,
                    createdAt: true
                },
            }),
            db.inventoryOutcome.findMany({
                where: { dashboardId, productId },
                select: {
                    id: true,
                    quantity: true,
                    sellingPrice: true,
                    shippedAt: true,
                    product: { select: { name: true } },
                    dashboardId: true,
                    productId: true,
                    createdAt: true
                },
            })
        ]);

        const inventories = [
            ...inventoryIncome.map(item => ({
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
            ...inventoryOutcome.map(item => ({
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

        return NextResponse.json(inventories);
    } catch (error) {
        console.log('[INVENTORIES_BY_PRODUCTID_GET]', error);
        return new NextResponse("Internal error", { status: 500 });
    }
}