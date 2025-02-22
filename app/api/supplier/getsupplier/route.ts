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
            return new NextResponse("Supplier ID is required", { status: 400 });
        }

        const supplier = await db.supplier.findFirst({
            where: {
                dashboardId,
                id,
            }
        });


        return NextResponse.json(supplier);
    } catch (error) {
        console.log('[SUPPLIER_GET]', error);
        return new NextResponse("Internal error", { status: 500 });
    }
};