import db from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function DELETE(req: Request) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 403 });
        }

        const url = new URL(req.url);
        const dashboardId = url.searchParams.get("dashboardId");

        if (!dashboardId) {
            return new NextResponse("Dashboard ID is required", { status: 400 });
        }

        const { ids } = await req.json();

        if (!ids || !Array.isArray(ids) || ids.length === 0) {
            return new NextResponse("Inventory IDs are required", { status: 400 });
        }

        await db.$transaction(async (prisma) => {
            const incomes = await prisma.inventoryIncome.findMany({
                where: { dashboardId, id: { in: ids } },
                select: { id: true, productId: true, quantity: true },
            });

            const outcomes = await prisma.inventoryOutcome.findMany({
                where: { dashboardId, id: { in: ids } },
                select: { id: true, productId: true, quantity: true },
            });

            await Promise.all([
                prisma.inventoryIncome.deleteMany({
                    where: { id: { in: incomes.map((i) => i.id) } },
                }),
                prisma.inventoryOutcome.deleteMany({
                    where: { id: { in: outcomes.map((o) => o.id) } },
                }),
            ]);

            const productNetChanges = new Map<string, number>();

            incomes.forEach(({ productId, quantity }) => {
                const current = productNetChanges.get(productId) || 0;
                productNetChanges.set(productId, current - quantity);
            });

            outcomes.forEach(({ productId, quantity }) => {
                const current = productNetChanges.get(productId) || 0;
                productNetChanges.set(productId, current + quantity);
            });

            const updatePromises = [];
            for (const [productId, netChange] of productNetChanges) {
                updatePromises.push(
                    prisma.product.update({
                        where: { id: productId },
                        data: { currentStock: { increment: netChange } },
                    })
                );
            }
            await Promise.all(updatePromises);
        });

        return NextResponse.json({ message: "Inventories deleted successfully" });
    } catch (error) {
        console.error("[INVENTORIES_BULKDELETE]", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
