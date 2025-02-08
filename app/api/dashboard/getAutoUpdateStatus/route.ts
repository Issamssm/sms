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

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 403 });
        }

        if (!dashboardId) {
            return new NextResponse("Dashboard ID is required", { status: 400 });
        }

        const autoUpdateStatus = await db.dashboard.findFirst({
            where: {
                id: dashboardId,
            },
            select: {
                autoUpdateStatus: true,
            }
        });

        return NextResponse.json(autoUpdateStatus);
    } catch (error) {
        console.log('[DASHBOARD_AUTOUPDATESTATUS_GET]', error);
        return new NextResponse("Internal error", { status: 500 });
    }
};