import db from '@/lib/db';
import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
    try {
        const { userId } = await auth();

        const url = new URL(req.url);
        const dashboardId = url.searchParams.get("dashboardId");

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 403 });
        }

        if (!dashboardId) {
            return new NextResponse("Dashboard ID is required", { status: 400 });
        }

        const [inventoryIncome, inventoryOutcome] = await Promise.all([
            db.inventoryIncome.findMany({
                where: { dashboardId },
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
                where: { dashboardId },
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
        console.log('[INVENTORIES_GET]', error);
        return new NextResponse("Internal error", { status: 500 });
    }
}

export async function DELETE(
    req: Request
) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 403 });
        }

        const url = new URL(req.url);
        const dashboardId = url.searchParams.get("dashboardId");
        const id = url.searchParams.get("id");
        const type = url.searchParams.get("type");

        if (!dashboardId) {
            return new NextResponse("Dashboard ID is required", { status: 400 });
        }

        if (!id) {
            return new NextResponse("Inventory ID is required", { status: 400 });
        }

        if (!type || (type !== "income" && type !== "outcome")) {
            return new NextResponse("Invalid inventory type", { status: 400 });
        }

        const inventory = type === "income"
            ? await db.inventoryIncome.findUnique({
                where: { id, dashboardId },
                select: { quantity: true, productId: true },
            })
            : await db.inventoryOutcome.findUnique({
                where: { id, dashboardId },
                select: { quantity: true, productId: true },
            });

        if (!inventory) {
            return new NextResponse("Inventory record not found", { status: 404 });
        }

        const quantityChange = inventory.quantity;
        const productId = inventory.productId;

        await db.$transaction(async (prisma) => {
            if (type === "income") {
                await prisma.inventoryIncome.delete({ where: { id, dashboardId } });

                await prisma.product.update({
                    where: { id: productId },
                    data: { currentStock: { decrement: quantityChange } },
                });
            } else {
                await prisma.inventoryOutcome.delete({ where: { id, dashboardId } });

                await prisma.product.update({
                    where: { id: productId },
                    data: { currentStock: { increment: quantityChange } },
                });
            }
        });

        return new NextResponse("Deleted successfully", { status: 200 });
    } catch (error) {
        console.error("[INVENTORY_DELETE]", error);
        return new NextResponse("Internal error", { status: 500 });
    }
}
