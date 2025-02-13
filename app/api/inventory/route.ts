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

        const inventoryIncome = await db.inventoryIncome.findMany({
            where: { dashboardId },
            include: {
                product: {
                    select: {
                        name: true
                    }
                }
            }
        });

        const inventoryOutcome = await db.inventoryOutcome.findMany({
            where: { dashboardId },
            include: {
                product: {
                    select: {
                        name: true
                    }
                }
            }
        });

        const inventories = [
            ...inventoryIncome.map(item => ({
                id: item.id,
                quantity: item.quantity,
                price: item.costPrice ? Number(item.costPrice) : 0,
                date: item.purchaseDate,
                product: item.product.name,
                type: "income",
                dashboardId: item.dashboardId,
            })),
            ...inventoryOutcome.map(item => ({
                id: item.id,
                quantity: item.quantity,
                price: item.sellingPrice ? Number(item.sellingPrice) : 0,
                date: item.shippedAt,
                product: item.product.name,
                type: "outcome",
                dashboardId: item.dashboardId,
            }))
        ];

        return NextResponse.json(inventories);
    } catch (error) {
        console.log('[INVENTORIES_GET]', error);
        return new NextResponse("Internal error", { status: 500 });
    }
}

export async function DELETE(
    req: Request,
) {
    try {
        const { userId } = await auth();

        const url = new URL(req.url);
        const dashboardId = url.searchParams.get("dashboardId");

        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");
        const type = searchParams.get("type");

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 403 });
        }

        if (!dashboardId) {
            return new NextResponse("Dashboard ID is required", { status: 400 });
        }

        if (!id) {
            return new NextResponse("Inventory ID is required", { status: 400 });
        }

        if (!type || (type !== "income" && type !== "outcome")) {
            return new NextResponse("Invalid inventory type", { status: 400 });
        }

        if (type === "income") {
            await db.inventoryIncome.delete({
                where: { dashboardId, id },
            });
        } else if (type === "outcome") {
            await db.inventoryOutcome.delete({
                where: { dashboardId, id },
            });
        }

        return new NextResponse("Deleted successfully", { status: 200 });
    } catch (error) {
        console.log('[INVENTORY_DELETE]', error);
        return new NextResponse("Internal error", { status: 500 });
    }
};