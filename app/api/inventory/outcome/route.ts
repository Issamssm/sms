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
            sellingPrice,
            invoiceNumber,
            location,
            shippedAt,
            notes,
            customerId
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
            db.inventoryOutcome.create({
                data: {
                    dashboardId,
                    productId,
                    quantity,
                    sellingPrice,
                    invoiceNumber,
                    location,
                    shippedAt,
                    notes,
                    customerId
                }
            }),
            db.product.update({
                where: { id: productId },
                data: {
                    currentStock: {
                        decrement: quantity
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
