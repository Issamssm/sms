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

        await db.$transaction([
            db.inventoryIncome.deleteMany({
                where: {
                    dashboardId,
                    id: { in: ids },
                }
            }),
            db.inventoryOutcome.deleteMany({
                where: {
                    dashboardId,
                    id: { in: ids },
                }
            })
        ]);

        return NextResponse.json({ message: "Inventories deleted successfully" });
    } catch (error) {
        console.error('[INVENTORIES_BULKDELETE]', error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
