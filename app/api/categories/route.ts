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
        
        const categories = await db.category.findMany({
            where: {
                dashboardId,
            },
            select: {
                id: true,
                name: true,
                dashboardId: true,
                products: {
                    select: {
                        id: true,
                    }
                }
            }
        });

        return NextResponse.json(categories);
    } catch (error) {
        console.log('[CATEGORIES_GET]', error);
        return new NextResponse("Internal error", { status: 500 });
    }
};

export async function POST(
    req: Request
) {
    try {
        const { userId } = await auth();

        const body = await req.json();
        const { name } = body;

        const url = new URL(req.url);
        const dashboardId = url.searchParams.get("dashboardId");

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 403 });
        }

        if (!dashboardId) {
            return NextResponse.json({ message: "Dashboard ID is required" }, { status: 400 });
        }
        
        const category = await db.category.create({
            data: {
                name,
                dashboardId: dashboardId,
            },
            select: {
                id: true,
                name: true,
                dashboardId: true,
                products: {
                    select: {
                        id: true,
                    }
                }
            }
        });

        return NextResponse.json(category);
    } catch (error) {
        console.log('[CATEGORY_POST]', error);
        return new NextResponse("Internal error", { status: 500 });
    }
};