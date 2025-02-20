import db from '@/lib/db';
import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export async function POST(
    req: Request
) {
    try {
        const { userId } = await auth();

        const body = await req.json();
        const {
            productId,
            quantity,
            costPrice,
            purchaseDate,
            supplierId,
            invoiceNumber,
            location,
            expiryDate,
            notes
        } = body;

        const url = new URL(req.url);
        const dashboardId = url.searchParams.get("dashboardId");

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 403 });
        }

        if (!dashboardId) {
            return NextResponse.json({ message: "Dashboard ID is required" }, { status: 400 });
        }

        await db.$transaction([
            db.inventoryIncome.create({
                data: {
                    dashboardId,
                    productId,
                    quantity,
                    costPrice,
                    purchaseDate,
                    supplierId,
                    invoiceNumber,
                    location,
                    expiryDate,
                    notes
                }
            }),
            db.product.update({
                where: { id: productId },
                data: {
                    currentStock: {
                        increment: quantity
                    }
                }
            })
        ]);

        return NextResponse.json({ message: "Inventorie created successfully" });
    } catch (error) {
        if (error instanceof Error) {
            console.log('[INVENTORY_POST]', error.message);
        } else {
            console.log('[INVENTORY_POST]', error);
        }
        return new NextResponse("Internal error", { status: 500 });
    }
};

export async function PATCH(
    req: Request
) {
    try {
        const { userId } = await auth();

        const body = await req.json();
        const {
            productId,
            quantity,
            costPrice,
            purchaseDate,
            supplierId,
            invoiceNumber,
            location,
            expiryDate,
            notes,
            oldQuantity
        } = body;

        const url = new URL(req.url);
        const dashboardId = url.searchParams.get("dashboardId");
        const id = url.searchParams.get("id");

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 403 });
        }

        if (!dashboardId) {
            return NextResponse.json({ message: "Dashboard ID is required" }, { status: 400 });
        }

        if (!id) {
            return NextResponse.json({ message: "Product ID is required" }, { status: 400 });
        }

        const product = await db.product.findFirst({ where: {dashboardId, id: productId }, select: { currentStock: true } });

        if (!product) throw new Error("Product not found");

        const newStock = Number(product.currentStock) - oldQuantity + quantity;

        await db.$transaction([
            db.inventoryIncome.update({
                where: { dashboardId, id },
                data: {
                    productId,
                    quantity,
                    costPrice,
                    purchaseDate,
                    supplierId,
                    invoiceNumber,
                    location,
                    expiryDate,
                    notes
                }
            }),
            db.product.update({
                where: { id: productId },
                data: {
                    currentStock: newStock
                }
            })
        ]);

        return NextResponse.json({ message: "Inventorie edited successfully" });
    } catch (error) {
        if (error instanceof Error) {
            console.log('[INVENTORY_PATCH]', error.message);
        } else {
            console.log('[INVENTORY_PATCH]', error);
        }
        return new NextResponse("Internal error", { status: 500 });
    }
};
