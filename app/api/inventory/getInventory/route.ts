import db from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";


export async function GET(req: Request) {
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
            return new NextResponse("Inventory ID is required", { status: 400 });
        }

        const [income, outcome] = await Promise.all([
            db.inventoryIncome.findFirst({
                where: { dashboardId, id },
                select: {
                    id: true,
                    quantity: true,
                    costPrice: true,
                    purchaseDate: true,
                    productId: true,
                    createdAt: true,
                    notes: true,
                    invoiceNumber: true,
                    supplierId: true,
                    location: true,
                    expiryDate: true,
                },
            }),
            db.inventoryOutcome.findFirst({
                where: { dashboardId, id },
                select: {
                    id: true,
                    quantity: true,
                    sellingPrice: true,
                    shippedAt: true,
                    productId: true,
                    createdAt: true,
                    notes: true,
                    invoiceNumber: true,
                    customerId: true,
                    location: true,
                },
            })
        ]);

        if (!income && !outcome) {
            return new NextResponse("Inventory not found", { status: 404 });
        }

        let inventoryItem;

        if (income) {
            inventoryItem = {
                id: income.id,
                quantity: income.quantity,
                price: income.costPrice ? Number(income.costPrice) : 0,
                date: income.purchaseDate,
                expiryDate: income.expiryDate,
                partner: income.supplierId,
                type: "income",
                dashboardId: dashboardId,
                productId: income.productId,
                createdAt: income.createdAt,
                notes: income.notes,
                invoiceNumber: income.invoiceNumber,
                location: income.location,
            };
        } else if (outcome) {
            inventoryItem = {
                id: outcome.id,
                quantity: outcome.quantity,
                price: outcome.sellingPrice ? Number(outcome.sellingPrice) : 0,
                date: outcome.shippedAt,
                expiryDate: null,
                partner: outcome.customerId,
                type: "outcome",
                dashboardId: dashboardId,
                productId: outcome.productId,
                createdAt: outcome.createdAt,
                notes: outcome.notes,
                invoiceNumber: outcome.invoiceNumber,
                location: outcome.location,
            };
        } else {
            return new NextResponse("Inventory not found", { status: 404 });
        }

        return NextResponse.json(inventoryItem);
    } catch (error) {
        console.log('[INVENTORY_GET] Error:', error);
        return new NextResponse("Internal error", { status: 500 });
    }
}
