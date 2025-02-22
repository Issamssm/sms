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
            return new NextResponse("Customer ID is required", { status: 400 });
        }

        const customer = await db.customer.findFirst({
            where: {
                dashboardId,
                id,
            }
        });


        return NextResponse.json(customer);
    } catch (error) {
        console.log('[CUSTOMER_GET]', error);
        return new NextResponse("Internal error", { status: 500 });
    }
};